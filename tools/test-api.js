/* Tests for Webpage/api/[action].js using the in-memory store.
 *   node tools/test-api.js
 * No dependencies. Exercises the happy path AND the attack cases (CSRF,
 * tampered/expired tokens, lockout, injection, oversized payloads, conflicts). */
"use strict";
process.env.SP_STORE = "memory";
process.env.SESSION_SECRET = "test-secret-test-secret-test-secret-123456";
const path = require("node:path");
const handler = require(
  path.join(__dirname, "..", "Webpage", "api", "[action].js"),
);

let pass = 0,
  fail = 0;
function ok(cond, name) {
  if (cond) {
    pass++;
    console.log("  ok   " + name);
  } else {
    fail++;
    console.log("  FAIL " + name);
  }
}

let ipCounter = 0;
async function call(method, action, body, opts) {
  const o = opts || {};
  const headers = Object.assign(
    {
      host: "example.test",
      origin: "https://example.test",
      "x-sp-csrf": "1",
      "content-type": "application/json",
      "x-forwarded-for": o.ip || "10.0.0." + ++ipCounter,
    },
    o.headers || {},
  );
  if (o.cookie) headers.cookie = o.cookie;
  const req = { method, headers, query: { action }, body };
  const res = {
    headers: {},
    statusCode: 0,
    body: "",
    setHeader(k, v) {
      this.headers[k.toLowerCase()] = v;
    },
    end(s) {
      this.body = s;
    },
  };
  await handler(req, res);
  return {
    status: res.statusCode,
    json: JSON.parse(res.body),
    headers: res.headers,
  };
}
const cookieOf = (r) => (r.headers["set-cookie"] || "").split(";")[0];

(async () => {
  console.log("registration");
  let r = await call("POST", "register", {
    username: "Alice",
    password: "correct horse battery",
  });
  ok(
    r.status === 200 && r.json.user === "alice",
    "registers and normalises username",
  );
  const set = r.headers["set-cookie"];
  ok(
    /^__Host-sp_session=/.test(set) &&
      /HttpOnly/.test(set) &&
      /Secure/.test(set) &&
      /SameSite=Strict/.test(set) &&
      /Path=\//.test(set) &&
      !/Domain=/.test(set),
    "session cookie has __Host-, HttpOnly, Secure, SameSite=Strict",
  );
  const cookie = cookieOf(r);
  r = await call("POST", "register", {
    username: "alice",
    password: "another password 1",
  });
  ok(r.status === 409, "duplicate username rejected");
  r = await call("POST", "register", { username: "bob", password: "short" });
  ok(r.status === 400, "short password rejected");
  r = await call("POST", "register", {
    username: "../etc/passwd",
    password: "long enough password",
  });
  ok(r.status === 400, "path-traversal username rejected");
  r = await call("POST", "register", {
    username: "x".repeat(40),
    password: "long enough password",
  });
  ok(r.status === 400, "over-long username rejected");
  r = await call("POST", "register", {
    username: "carol",
    password: { $ne: 1 },
  });
  ok(r.status === 400, "non-string password rejected");

  console.log("session");
  r = await call("GET", "me", null, { cookie });
  ok(r.json.user === "alice", "/me returns the user with a valid cookie");
  r = await call("GET", "me", null);
  ok(r.json.user === null, "/me is null without a cookie");
  const tampered = cookie.slice(0, -2) + (cookie.endsWith("AA") ? "BB" : "AA");
  r = await call("GET", "me", null, { cookie: tampered });
  ok(r.json.user === null, "tampered signature rejected");
  const parts = cookie.split("=")[1].split(".");
  const forged = Buffer.from(
    JSON.stringify({ u: "admin", v: 1, exp: Date.now() + 1e9 }),
  ).toString("base64url");
  r = await call("GET", "me", null, {
    cookie: "__Host-sp_session=v1." + forged + "." + parts[2],
  });
  ok(r.json.user === null, "forged payload with old signature rejected");
  const exp = Buffer.from(
    JSON.stringify({ u: "alice", v: 1, exp: Date.now() - 1000 }),
  ).toString("base64url");
  r = await call("GET", "me", null, {
    cookie: "__Host-sp_session=v1." + exp + "." + parts[2],
  });
  ok(r.json.user === null, "expired / re-signed token rejected");

  console.log("csrf");
  r = await call("POST", "logout", {}, { headers: { "x-sp-csrf": undefined } });
  ok(r.status === 403, "missing CSRF header blocked");
  r = await call(
    "POST",
    "logout",
    {},
    { headers: { origin: "https://evil.test" } },
  );
  ok(r.status === 403, "cross-origin Origin blocked");
  r = await call("POST", "logout", {}, { headers: { origin: undefined } });
  ok(r.status === 403, "missing Origin blocked");
  r = await call("POST", "login", "username=a&password=b", {
    headers: { "content-type": "text/plain" },
  });
  ok(r.status === 400, "non-JSON body rejected");
  r = await call(
    "PUT",
    "sync",
    { data: {} },
    { cookie, headers: { origin: "https://evil.test" } },
  );
  ok(r.status === 403, "cross-origin sync write blocked");

  console.log("login + lockout");
  r = await call("POST", "login", {
    username: "alice",
    password: "correct horse battery",
  });
  ok(
    r.status === 200 && /__Host-sp_session=/.test(r.headers["set-cookie"]),
    "login works",
  );
  const r1 = await call("POST", "login", {
    username: "nobody",
    password: "whatever whatever",
  });
  const r2 = await call("POST", "login", {
    username: "alice",
    password: "wrong password!!",
  });
  ok(
    r1.status === 401 && r2.status === 401 && r1.json.error === r2.json.error,
    "unknown user and wrong password give identical errors",
  );
  for (let i = 0; i < 4; i++)
    await call("POST", "login", {
      username: "alice",
      password: "wrong password!!",
    });
  r = await call("POST", "login", {
    username: "alice",
    password: "correct horse battery",
  });
  ok(
    r.status === 429,
    "account locks after repeated failures (even with correct password)",
  );
  r = await call("POST", "login", { username: { $gt: "" }, password: "x" });
  ok(r.status === 401, "object username does not bypass login");

  console.log("rate limiting");
  let limited = false;
  for (let i = 0; i < 25; i++) {
    r = await call(
      "POST",
      "login",
      { username: "nobody", password: "whatever whatever" },
      { ip: "203.0.113.9" },
    );
    if (r.status === 429) {
      limited = true;
      break;
    }
  }
  ok(limited, "per-IP login rate limit kicks in");

  console.log("sync");
  r = await call("GET", "sync", null);
  ok(r.status === 401, "sync requires a session");
  r = await call("GET", "sync", null, { cookie });
  ok(r.status === 200 && r.json.etag === null, "empty sync for a new user");
  const good = {
    sp_linux_progress: JSON.stringify({ "lesson:1": { steps: [0, 1] } }),
    "spQuizDeck:1.0:easy": JSON.stringify([1, 2, 3]),
  };
  r = await call("PUT", "sync", { data: good }, { cookie });
  ok(r.status === 200 && r.json.etag, "first write creates the record");
  let etag = r.json.etag;
  r = await call("PUT", "sync", { data: good }, { cookie });
  ok(r.status === 409, "second write without an etag is a conflict");
  r = await call("PUT", "sync", { data: good, etag: '"stale"' }, { cookie });
  ok(r.status === 409, "stale etag is a conflict");
  r = await call("PUT", "sync", { data: good, etag }, { cookie });
  ok(
    r.status === 200 && r.json.etag !== etag,
    "matching etag succeeds and rotates",
  );
  etag = r.json.etag;
  r = await call("GET", "sync", null, { cookie });
  ok(
    r.json.data.sp_linux_progress === good.sp_linux_progress &&
      r.json.etag === etag,
    "round-trips data",
  );
  r = await call("PUT", "sync", { data: { evil_key: "[]" }, etag }, { cookie });
  ok(r.status === 400, "unknown storage key rejected");
  r = await call(
    "PUT",
    "sync",
    { data: { sp_linux_progress: "not json{" }, etag },
    { cookie },
  );
  ok(r.status === 400, "non-JSON value rejected");
  r = await call(
    "PUT",
    "sync",
    { data: { sp_linux_progress: JSON.stringify("x".repeat(25000)) }, etag },
    { cookie },
  );
  ok(r.status === 400, "oversized value rejected");
  r = await call(
    "PUT",
    "sync",
    { data: { sp_linux_progress: 5 }, etag },
    { cookie },
  );
  ok(r.status === 400, "non-string value rejected");
  r = await call("PUT", "sync", { data: ["a"], etag }, { cookie });
  ok(r.status === 400, "array payload rejected");
  const many = {};
  for (let i = 0; i < 120; i++) many["spQuizDeck:" + i + ".0:easy"] = "[]";
  r = await call("PUT", "sync", { data: many, etag }, { cookie });
  ok(r.status === 400, "too many keys rejected");
  r = await call(
    "PUT",
    "sync",
    { data: JSON.parse('{"__proto__":"[]","sp_linux_progress":"{}"}'), etag },
    { cookie },
  );
  ok(r.status === 400, "__proto__ key rejected");

  console.log("account lifecycle");
  r = await call("POST", "register", {
    username: "dave",
    password: "dave dave dave dave",
  });
  const dcookie = cookieOf(r);
  r = await call("POST", "logout-all", {}, { cookie: dcookie });
  ok(r.status === 200, "logout-all succeeds");
  r = await call("GET", "me", null, { cookie: dcookie });
  ok(r.json.user === null, "old session dead after logout-all");
  r = await call("POST", "login", {
    username: "dave",
    password: "dave dave dave dave",
  });
  const dc2 = cookieOf(r);
  r = await call(
    "POST",
    "delete-account",
    { password: "wrong" },
    { cookie: dc2 },
  );
  ok(r.status === 401, "delete needs the right password");
  r = await call(
    "POST",
    "delete-account",
    { password: "dave dave dave dave" },
    { cookie: dc2 },
  );
  ok(
    r.status === 200 && /Max-Age=0/.test(r.headers["set-cookie"]),
    "delete-account works and clears the cookie",
  );
  r = await call("POST", "login", {
    username: "dave",
    password: "dave dave dave dave",
  });
  ok(r.status === 401, "deleted account cannot log in");
  r = await call("POST", "logout", {});
  ok(
    r.status === 200 && /Max-Age=0/.test(r.headers["set-cookie"]),
    "logout clears the cookie",
  );

  console.log("fail-closed");
  const saved = process.env.SESSION_SECRET;
  delete process.env.SESSION_SECRET;
  r = await call("GET", "me", null);
  ok(
    r.status === 503 && r.json.configured === false,
    "API returns 503 when SESSION_SECRET is missing",
  );
  process.env.SESSION_SECRET = "short";
  r = await call("GET", "me", null);
  ok(r.status === 503, "API returns 503 when SESSION_SECRET is too short");
  process.env.SESSION_SECRET = saved;

  console.log("\n" + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
