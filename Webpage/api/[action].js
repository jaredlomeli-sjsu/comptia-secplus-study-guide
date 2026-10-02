"use strict";
/*
 * Account + progress-sync API for the Security+ study guide.
 *
 *   GET  /api/me              -> { user } (null when signed out)
 *   POST /api/register        { username, password }
 *   POST /api/login           { username, password }
 *   POST /api/logout
 *   POST /api/logout-all      invalidates every session for the account
 *   POST /api/delete-account  { password } — erases the account and its data
 *   GET  /api/sync            -> { data, etag }
 *   PUT  /api/sync            { data, etag? }  (optimistic concurrency via etag)
 *
 * Security model: scrypt password hashes, HMAC-signed session token in an
 * HttpOnly/Secure/SameSite=Strict __Host- cookie, per-account lockout, per-IP
 * rate limits, CSRF defence (custom header + Origin check + JSON-only), strict
 * input validation, private blob storage, fail-closed when SESSION_SECRET is
 * missing. No emails or other PII are collected.
 */
const crypto = require("node:crypto");
const { promisify } = require("node:util");
const store = require("./_store");

const scrypt = promisify(crypto.scrypt);
const COOKIE = "__Host-sp_session";
const SESSION_MS = 30 * 24 * 60 * 60 * 1000;
const SCRYPT = { N: 16384, r: 8, p: 1 };
const USERNAME_RE = /^[a-z0-9_.-]{3,32}$/;
const KEY_RE = /^(sp_linux_progress|spQuizDeck:[0-9.]+:[a-z]+)$/;
const MAX_KEYS = 100;
const MAX_VALUE = 20000;
const MAX_TOTAL = 200000;
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;

const b64u = (buf) => Buffer.from(buf).toString("base64url");
const hmac = (secret, msg) =>
  crypto.createHmac("sha256", secret).update(msg).digest();

function secret() {
  const s = process.env.SESSION_SECRET;
  return s && s.length >= 32 ? s : null;
}

function send(res, status, body, headers) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (headers)
    for (const k of Object.keys(headers)) res.setHeader(k, headers[k]);
  res.end(JSON.stringify(body));
}

function parseCookies(header) {
  const out = {};
  String(header || "")
    .split(";")
    .forEach((part) => {
      const i = part.indexOf("=");
      if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
    });
  return out;
}

function setCookie(value, maxAgeSec) {
  return (
    COOKIE +
    "=" +
    value +
    "; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=" +
    maxAgeSec
  );
}

function signToken(user, version) {
  const payload = b64u(
    JSON.stringify({ u: user, v: version, exp: Date.now() + SESSION_MS }),
  );
  return "v1." + payload + "." + b64u(hmac(secret(), "v1." + payload));
}

function verifyToken(token) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return null;
  const want = hmac(secret(), "v1." + parts[1]);
  let got;
  try {
    got = Buffer.from(parts[2], "base64url");
  } catch (e) {
    return null;
  }
  if (got.length !== want.length || !crypto.timingSafeEqual(got, want))
    return null;
  try {
    const p = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    if (
      typeof p.u !== "string" ||
      typeof p.exp !== "number" ||
      p.exp < Date.now()
    )
      return null;
    return p;
  } catch (e) {
    return null;
  }
}

function clientIp(req) {
  const h =
    req.headers["x-vercel-forwarded-for"] ||
    req.headers["x-forwarded-for"] ||
    "";
  return String(h).split(",")[0].trim() || "unknown";
}

/*
 * Housekeeping for rate-limit records. Each record only matters for its window
 * (the longest is 1 hour), so anything untouched for 2 hours is dead weight.
 * Rather than a cron job (which needs its own secret), roughly 1 in 50
 * rate-limited requests sweeps one page of stale records. Never fails a request.
 */
const PRUNE_PROB = Number(process.env.SP_PRUNE_PROB || 0.02);
const PRUNE_AFTER_MS = 2 * 60 * 60 * 1000;
async function maybePruneRateRecords() {
  if (Math.random() >= PRUNE_PROB) return;
  try {
    await store.pruneOlderThan("rl/", PRUNE_AFTER_MS, 100);
  } catch (e) {
    console.error("rate-record cleanup failed", e && e.name);
  }
}

/* Fixed-window counter. Keys are HMACs, so raw IPs are never stored. */
async function rateLimit(req, bucket, limit, windowMs) {
  const id = b64u(hmac(secret(), "rl:" + bucket + ":" + clientIp(req))).slice(
    0,
    32,
  );
  const path = "rl/" + bucket + "-" + id + ".json";
  const now = Date.now();
  await maybePruneRateRecords();
  const cur = await store.readJson(path);
  let rec = cur ? cur.data : null;
  if (!rec || now - rec.t > windowMs) rec = { n: 0, t: now };
  if (rec.n >= limit) return false;
  rec.n += 1;
  try {
    await store.writeJson(
      path,
      rec,
      cur ? { ifMatch: cur.etag } : { create: true },
    );
  } catch (e) {
    /* racing request: best effort */
  }
  return true;
}

function csrfOk(req) {
  if (req.headers["x-sp-csrf"] !== "1") return false;
  const origin = req.headers.origin;
  if (!origin) return false;
  try {
    return new URL(origin).host === req.headers.host;
  } catch (e) {
    return false;
  }
}

function jsonBody(req) {
  const ct = String(req.headers["content-type"] || "");
  if (!/^application\/json\b/i.test(ct)) return null;
  const b = req.body;
  if (!b || typeof b !== "object" || Array.isArray(b)) return null;
  return b;
}

function cleanUsername(v) {
  const u = typeof v === "string" ? v.trim().toLowerCase() : "";
  return USERNAME_RE.test(u) ? u : null;
}

function passwordProblem(p) {
  if (typeof p !== "string" || p.length < 10)
    return "Password must be at least 10 characters.";
  if (p.length > 128) return "Password must be 128 characters or fewer.";
  return null;
}

async function hashPassword(password, saltB64) {
  const salt = saltB64
    ? Buffer.from(saltB64, "base64")
    : crypto.randomBytes(16);
  const key = await scrypt(password, salt, 32, SCRYPT);
  return { salt: salt.toString("base64"), hash: key.toString("base64") };
}

async function passwordMatches(password, rec) {
  const { hash } = await hashPassword(password, rec.salt);
  const a = Buffer.from(hash, "base64");
  const b = Buffer.from(rec.hash, "base64");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* Burn the same CPU for unknown usernames so timing doesn't reveal accounts. */
const DUMMY = {
  salt: crypto.randomBytes(16).toString("base64"),
  hash: crypto.randomBytes(32).toString("base64"),
};

function sanitizeSync(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const keys = Object.keys(data);
  if (keys.length > MAX_KEYS) return null;
  const out = {};
  let total = 0;
  for (const k of keys) {
    const v = data[k];
    if (!KEY_RE.test(k) || typeof v !== "string" || v.length > MAX_VALUE)
      return null;
    try {
      JSON.parse(v);
    } catch (e) {
      return null;
    }
    total += v.length;
    if (total > MAX_TOTAL) return null;
    out[k] = v;
  }
  return out;
}

async function currentUser(req) {
  const tok = verifyToken(parseCookies(req.headers.cookie)[COOKIE]);
  if (!tok) return null;
  const u = await store.readJson("users/" + tok.u + ".json");
  if (!u || u.data.tokenVersion !== tok.v) return null;
  return { name: tok.u, rec: u.data, etag: u.etag };
}

const userPath = (u) => "users/" + u + ".json";
const dataPath = (u) => "data/" + u + ".json";

async function handle(req, res, action) {
  const method = req.method;

  if (action === "me" && method === "GET") {
    const me = await currentUser(req);
    return send(res, 200, { user: me ? me.name : null });
  }

  if (action === "sync" && (method === "GET" || method === "PUT")) {
    const me = await currentUser(req);
    if (!me) return send(res, 401, { error: "Not signed in." });
    if (method === "GET") {
      const d = await store.readJson(dataPath(me.name));
      return send(
        res,
        200,
        d ? { data: d.data.data, etag: d.etag } : { data: {}, etag: null },
      );
    }
    if (!csrfOk(req)) return send(res, 403, { error: "Request blocked." });
    const body = jsonBody(req);
    const data = body && sanitizeSync(body.data);
    if (!data) return send(res, 400, { error: "Invalid sync data." });
    try {
      const doc = { data, updated: Date.now() };
      const r = await store.writeJson(
        dataPath(me.name),
        doc,
        typeof body.etag === "string" && body.etag
          ? { ifMatch: body.etag }
          : { create: true },
      );
      return send(res, 200, { etag: r.etag });
    } catch (e) {
      if (e && (e.code === "CONFLICT" || e.code === "EXISTS"))
        return send(res, 409, { error: "Out of date." });
      throw e;
    }
  }

  if (method !== "POST") return send(res, 404, { error: "Not found." });
  if (!csrfOk(req)) return send(res, 403, { error: "Request blocked." });

  if (action === "logout") {
    return send(res, 200, { ok: true }, { "Set-Cookie": setCookie("", 0) });
  }

  if (action === "logout-all") {
    const me = await currentUser(req);
    if (!me) return send(res, 401, { error: "Not signed in." });
    me.rec.tokenVersion = (me.rec.tokenVersion || 0) + 1;
    await store.writeJson(userPath(me.name), me.rec, { ifMatch: me.etag });
    return send(res, 200, { ok: true }, { "Set-Cookie": setCookie("", 0) });
  }

  const body = jsonBody(req);
  if (!body) return send(res, 400, { error: "Invalid request." });

  if (action === "register") {
    if (!(await rateLimit(req, "reg", 5, 60 * 60 * 1000)))
      return send(res, 429, { error: "Too many attempts. Try again later." });
    const user = cleanUsername(body.username);
    if (!user)
      return send(res, 400, {
        error: "Username must be 3-32 characters: letters, numbers, . _ -",
      });
    const problem = passwordProblem(body.password);
    if (problem) return send(res, 400, { error: problem });
    const { salt, hash } = await hashPassword(body.password);
    const rec = {
      u: user,
      salt,
      hash,
      n: SCRYPT.N,
      created: Date.now(),
      tokenVersion: 1,
      fails: 0,
      lockUntil: 0,
    };
    try {
      await store.writeJson(userPath(user), rec, { create: true });
    } catch (e) {
      if (e && e.code === "EXISTS")
        return send(res, 409, { error: "That username is taken." });
      throw e;
    }
    return send(
      res,
      200,
      { user },
      { "Set-Cookie": setCookie(signToken(user, 1), SESSION_MS / 1000) },
    );
  }

  if (action === "login") {
    if (!(await rateLimit(req, "login", 20, 15 * 60 * 1000)))
      return send(res, 429, { error: "Too many attempts. Try again later." });
    const user = cleanUsername(body.username);
    const pw =
      typeof body.password === "string" && body.password.length <= 128
        ? body.password
        : "";
    const found = user ? await store.readJson(userPath(user)) : null;
    const bad = () =>
      send(res, 401, { error: "Incorrect username or password." });
    if (!found) {
      await passwordMatches(pw, DUMMY);
      return bad();
    }
    const rec = found.data;
    if (rec.lockUntil && rec.lockUntil > Date.now()) {
      return send(res, 429, {
        error: "Account temporarily locked. Try again in a few minutes.",
      });
    }
    if (!(await passwordMatches(pw, rec))) {
      rec.fails = (rec.fails || 0) + 1;
      if (rec.fails >= MAX_FAILS) {
        rec.fails = 0;
        rec.lockUntil = Date.now() + LOCK_MS;
      }
      try {
        await store.writeJson(userPath(user), rec, { ifMatch: found.etag });
      } catch (e) {
        /* best effort */
      }
      return bad();
    }
    if (rec.fails || rec.lockUntil) {
      rec.fails = 0;
      rec.lockUntil = 0;
      try {
        await store.writeJson(userPath(user), rec, { ifMatch: found.etag });
      } catch (e) {
        /* best effort */
      }
    }
    return send(
      res,
      200,
      { user },
      {
        "Set-Cookie": setCookie(
          signToken(user, rec.tokenVersion),
          SESSION_MS / 1000,
        ),
      },
    );
  }

  if (action === "delete-account") {
    const me = await currentUser(req);
    if (!me) return send(res, 401, { error: "Not signed in." });
    if (!(await rateLimit(req, "del", 10, 15 * 60 * 1000)))
      return send(res, 429, { error: "Too many attempts. Try again later." });
    const pw =
      typeof body.password === "string" && body.password.length <= 128
        ? body.password
        : "";
    if (!(await passwordMatches(pw, me.rec)))
      return send(res, 401, { error: "Incorrect password." });
    await store.deleteJson(dataPath(me.name));
    await store.deleteJson(userPath(me.name));
    return send(res, 200, { ok: true }, { "Set-Cookie": setCookie("", 0) });
  }

  return send(res, 404, { error: "Not found." });
}

module.exports = async function handler(req, res) {
  const action = String((req.query && req.query.action) || "");
  if (!secret()) {
    return send(res, 503, {
      error: "Sync is not configured.",
      configured: false,
    });
  }
  try {
    await handle(req, res, action);
  } catch (e) {
    console.error("api error", action, e && e.name);
    send(res, 500, { error: "Server error." });
  }
};

module.exports._test = { sanitizeSync, verifyToken, signToken };
