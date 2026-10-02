/* End-to-end check of Webpage/account.js against the real API handler.
 *   NODE_PATH=<jsdom> node tools/test-account.js
 * jsdom's fetch is replaced by a bridge into api/[action].js (in-memory store),
 * so the banner, sign-up, sync, and two-device merge all run for real. */
"use strict";
process.env.SP_STORE = "memory";
process.env.SESSION_SECRET = "test-secret-test-secret-test-secret-123456";
var path = require("node:path");
var fs = require("node:fs");
var jsdom = require("jsdom");
var handler = require(
  path.join(__dirname, "..", "Webpage", "api", "[action].js"),
);
var WEB = path.join(__dirname, "..", "Webpage");

var pass = 0,
  fail = 0;
function ok(c, n) {
  if (c) pass++;
  else fail++;
  console.log((c ? "  PASS " : "  FAIL ") + n);
}
function sleep(ms) {
  return new Promise(function (r) {
    setTimeout(r, ms);
  });
}

/* a "device": its own cookie jar + localStorage, same server */
function device(ip) {
  var jar = "";
  var errs = [];
  var vc = new jsdom.VirtualConsole();
  vc.on("jsdomError", function (e) {
    errs.push(String(e.message));
  });
  var html = fs.readFileSync(path.join(WEB, "linux.html"), "utf8");
  var dom = new jsdom.JSDOM(html, {
    url: "https://example.test/linux.html",
    runScripts: "outside-only",
    pretendToBeVisual: true,
    virtualConsole: vc,
  });
  var w = dom.window;
  w.HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
    this.open = true;
  };
  w.HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.open = false;
  };
  w.fetch = function (url, opts) {
    var o = opts || {};
    var u = new URL(url, "https://example.test");
    var req = {
      method: o.method || "GET",
      headers: Object.assign(
        {
          host: "example.test",
          origin: "https://example.test",
          "x-forwarded-for": ip,
        },
        Object.keys(o.headers || {}).reduce(function (a, k) {
          a[k.toLowerCase()] = o.headers[k];
          return a;
        }, {}),
      ),
      query: { action: u.pathname.replace("/api/", "") },
      body: o.body ? JSON.parse(o.body) : undefined,
    };
    if (jar) req.headers.cookie = jar;
    return new Promise(function (resolve) {
      var res = {
        headers: {},
        statusCode: 0,
        setHeader: function (k, v) {
          this.headers[k.toLowerCase()] = v;
        },
        end: function (s) {
          var sc = this.headers["set-cookie"];
          if (sc) jar = /Max-Age=0/.test(sc) ? "" : sc.split(";")[0];
          resolve({
            status: this.statusCode,
            text: function () {
              return Promise.resolve(s);
            },
          });
        },
      };
      handler(req, res);
    });
  };
  w.eval(fs.readFileSync(path.join(WEB, "account.js"), "utf8"));
  return { w: w, dom: dom, errs: errs };
}
function fill(d, id, v) {
  var i = d.w.document.getElementById(id);
  i.value = v;
}
function submit(d) {
  var f = d.w.document.querySelector(".sp-form");
  f.dispatchEvent(new d.w.Event("submit", { bubbles: true, cancelable: true }));
}

(async function () {
  var A = device("10.1.1.1");
  A.w.document.dispatchEvent(new A.w.Event("DOMContentLoaded"));
  await sleep(150);
  var doc = A.w.document;
  ok(!!doc.querySelector(".sp-banner"), "privacy banner shows on first visit");
  ok(
    !!doc.querySelector(".topnav .sp-acct-btn"),
    "account button added to nav",
  );
  ok(
    !!doc.querySelector('.topnav a[href="security.html"]'),
    "Security link added to nav",
  );
  ok(
    /Sign in/.test(doc.querySelector(".sp-acct-btn").textContent),
    "button says Sign in when signed out",
  );

  A.w.localStorage.setItem(
    "sp_linux_progress",
    JSON.stringify({ "lesson:1": { steps: [0, 1] } }),
  );
  A.w.localStorage.setItem("spQuizDeck:1.0:easy", JSON.stringify([1, 2, 3, 4]));

  doc.querySelector(".sp-acct-btn").click();
  ok(doc.querySelector(".sp-dialog").open === true, "dialog opens");
  doc.querySelectorAll(".sp-tab")[1].click();
  ok(
    /Create account/.test(doc.getElementById("spDlgTitle").textContent),
    "register tab renders",
  );
  fill(A, "spUser", "tester");
  fill(A, "spPass", "short");
  submit(A);
  ok(
    /at least 10/.test(doc.querySelector(".sp-err").textContent),
    "client rejects short password",
  );
  fill(A, "spPass", "a long enough password");
  submit(A);
  await sleep(500);
  ok(
    /tester/.test(doc.querySelector(".sp-acct-btn").textContent),
    "registered and signed in",
  );
  ok(!doc.querySelector(".sp-banner"), "banner removed after sign-in");
  ok(
    JSON.parse(A.w.localStorage.getItem("sp_consent")).sync === true,
    "consent recorded",
  );
  await sleep(300);

  /* device B: signs in, should receive A's progress, plus contribute its own */
  var B = device("10.2.2.2");
  B.w.localStorage.setItem(
    "sp_linux_progress",
    JSON.stringify({
      "lesson:1": { steps: [1, 2] },
      "lesson:2": { steps: [0] },
    }),
  );
  B.w.localStorage.setItem("spQuizDeck:1.0:easy", JSON.stringify([2, 3, 4, 5]));
  B.w.document.dispatchEvent(new B.w.Event("DOMContentLoaded"));
  await sleep(150);
  B.w.document.querySelector(".sp-acct-btn").click();
  fill(B, "spUser", "tester");
  fill(B, "spPass", "a long enough password");
  submit(B);
  await sleep(900);
  var lp = JSON.parse(B.w.localStorage.getItem("sp_linux_progress"));
  ok(
    JSON.stringify(lp["lesson:1"].steps) === "[0,1,2]" &&
      lp["lesson:2"].steps.length === 1,
    "linux progress merged by union",
  );
  ok(
    JSON.stringify(
      JSON.parse(B.w.localStorage.getItem("spQuizDeck:1.0:easy")),
    ) === "[2,3,4]",
    "quiz deck merged by intersection (seen anywhere = seen)",
  );

  /* wrong password, and tampering with local storage can't break load */
  var C = device("10.3.3.3");
  C.w.document.dispatchEvent(new C.w.Event("DOMContentLoaded"));
  await sleep(150);
  C.w.document.querySelector(".sp-acct-btn").click();
  fill(C, "spUser", "tester");
  fill(C, "spPass", "wrong password here");
  submit(C);
  await sleep(500);
  ok(
    /Incorrect/.test(C.w.document.querySelector(".sp-err").textContent),
    "wrong password shows a generic error",
  );
  ok(
    !C.w.document.querySelector(".sp-acct-btn").textContent.includes("tester"),
    "still signed out after failure",
  );

  /* sign out */
  var btns = [].slice.call(A.w.document.querySelectorAll(".sp-dialog button"));
  A.w.document.querySelector(".sp-acct-btn").click();
  btns = [].slice.call(A.w.document.querySelectorAll(".sp-dialog button"));
  btns
    .filter(function (b) {
      return b.textContent === "Sign out";
    })[0]
    .click();
  await sleep(300);
  ok(
    /Sign in/.test(A.w.document.querySelector(".sp-acct-btn").textContent),
    "sign out works",
  );

  /* no-API host (GitHub Pages style): everything degrades gracefully */
  var P = device("10.4.4.4");
  P.w.fetch = function () {
    return Promise.resolve({
      status: 404,
      text: function () {
        return Promise.resolve("<html>404</html>");
      },
    });
  };
  P.w.document.dispatchEvent(new P.w.Event("DOMContentLoaded"));
  P.w.eval(fs.readFileSync(path.join(WEB, "account.js"), "utf8"));
  await sleep(200);
  ok(
    !!P.w.document.querySelector(".sp-banner") &&
      !/Sign in to sync/.test(
        P.w.document.querySelector(".sp-banner").textContent,
      ),
    "no-API host: banner shown without a sign-in button",
  );

  /* jsdom can't navigate; the page reloads once after a merge changes storage */
  var all = A.errs.concat(B.errs, C.errs).filter(function (m) {
    return !/Not implemented: navigation/.test(m);
  });
  ok(
    all.length === 0,
    "no JS errors thrown (" + all.slice(0, 2).join(" | ") + ")",
  );

  console.log("\n=== " + pass + " passed, " + fail + " failed ===");
  process.exit(fail ? 1 : 0);
})();
