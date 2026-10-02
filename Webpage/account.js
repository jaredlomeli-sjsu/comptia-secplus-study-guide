/* Account, privacy notice, and cross-device progress sync.
 *
 * - First visit: a privacy & storage notice (what is stored, what is not).
 * - Optional account (username + password) → progress syncs across devices via
 *   /api/* (HttpOnly session cookie; the page's JS can never read the token).
 * - Only the quiz-deck queues and Linux Lab progress sync. Nothing else leaves
 *   the browser.
 * - Built with DOM methods only — no innerHTML anywhere in this file.
 * - If /api isn't there (GitHub Pages mirror, local file) everything keeps
 *   working in local-only mode.
 */
(function () {
  "use strict";

  /* Never initialise twice (double include / double DOMContentLoaded). */
  if (window.__spAccountLoaded) return;
  window.__spAccountLoaded = true;

  var CONSENT_KEY = "sp_consent";
  var KEY_RE = /^(sp_linux_progress|spQuizDeck:[0-9.]+:[a-z]+)$/;
  var RELOAD_FLAG = "sp_synced_reload";

  var state = {
    user: null,
    available: null,
    etag: null,
    last: null,
    busy: false,
  };
  var dirty = false;
  var pushTimer = null;
  var acctBtn = null;
  var dialog = null;

  var nativeSet = Storage.prototype.setItem;
  var nativeRemove = Storage.prototype.removeItem;

  /* ───────────── tiny helpers ───────────── */
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    var k;
    if (attrs) {
      for (k in attrs) {
        if (k === "text") e.textContent = attrs[k];
        else if (k === "class") e.className = attrs[k];
        else e.setAttribute(k, attrs[k]);
      }
    }
    (kids || []).forEach(function (c) {
      e.appendChild(c);
    });
    return e;
  }
  function lsGet(k) {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  }
  function lsSet(k, v) {
    try {
      nativeSet.call(localStorage, k, v);
    } catch (e) {
      /* private mode / quota */
    }
  }
  function api(method, action, body) {
    var opts = {
      method: method,
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    };
    if (method !== "GET") {
      opts.headers["Content-Type"] = "application/json";
      opts.headers["X-SP-CSRF"] = "1";
      opts.body = JSON.stringify(body || {});
    }
    return fetch("/api/" + action, opts).then(function (res) {
      return res.text().then(function (t) {
        var j = null;
        try {
          j = JSON.parse(t);
        } catch (e) {
          /* non-JSON: host has no API */
        }
        return { status: res.status, json: j };
      });
    });
  }

  /* ───────────── sync: collect / merge ───────────── */
  function collectLocal() {
    var out = {};
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (KEY_RE.test(k)) out[k] = localStorage.getItem(k);
      }
    } catch (e) {
      /* ignore */
    }
    return out;
  }
  function parseJson(s) {
    try {
      return JSON.parse(s);
    } catch (e) {
      return null;
    }
  }
  /* Linux Lab progress: { "lesson:id": { steps: [n,…] } } → union of steps */
  function mergeLinux(a, b) {
    var x = parseJson(a) || {};
    var y = parseJson(b) || {};
    var out = {};
    [x, y].forEach(function (src) {
      Object.keys(src).forEach(function (key) {
        if (key === "__proto__" || !src[key] || !Array.isArray(src[key].steps))
          return;
        var cur = out[key] ? out[key].steps : [];
        src[key].steps.forEach(function (n) {
          if (typeof n === "number" && cur.indexOf(n) === -1) cur.push(n);
        });
        cur.sort(function (p, q) {
          return p - q;
        });
        out[key] = { steps: cur };
      });
    });
    return JSON.stringify(out);
  }
  /* Quiz deck = ids still unseen. A card seen on either device is seen. */
  function mergeDeck(a, b) {
    var x = parseJson(a);
    var y = parseJson(b);
    if (!Array.isArray(x)) return JSON.stringify(Array.isArray(y) ? y : []);
    if (!Array.isArray(y)) return JSON.stringify(x);
    return JSON.stringify(
      x.filter(function (id) {
        return y.indexOf(id) !== -1;
      }),
    );
  }
  function mergeAll(local, remote) {
    var out = {};
    var keys = {};
    Object.keys(local).forEach(function (k) {
      keys[k] = 1;
    });
    Object.keys(remote).forEach(function (k) {
      keys[k] = 1;
    });
    Object.keys(keys).forEach(function (k) {
      if (!(k in remote)) out[k] = local[k];
      else if (!(k in local)) out[k] = remote[k];
      else
        out[k] =
          k === "sp_linux_progress"
            ? mergeLinux(local[k], remote[k])
            : mergeDeck(local[k], remote[k]);
    });
    return out;
  }
  function sameData(a, b) {
    var ka = Object.keys(a);
    if (ka.length !== Object.keys(b).length) return false;
    return ka.every(function (k) {
      return a[k] === b[k];
    });
  }

  function setStatus(msg) {
    var s = document.getElementById("spSyncStatus");
    if (s) s.textContent = msg;
  }

  function pull() {
    return api("GET", "sync").then(function (r) {
      if (r.status === 401) {
        state.user = null;
        renderBtn();
        return null;
      }
      if (r.status !== 200 || !r.json) throw new Error("pull failed");
      var local = collectLocal();
      var merged = mergeAll(local, r.json.data || {});
      var changedLocal = !sameData(local, merged);
      Object.keys(merged).forEach(function (k) {
        if (local[k] !== merged[k]) lsSet(k, merged[k]);
      });
      state.etag = r.json.etag;
      return {
        merged: merged,
        remote: r.json.data || {},
        changedLocal: changedLocal,
      };
    });
  }

  function push(data, retried) {
    return api("PUT", "sync", {
      data: data,
      etag: state.etag || undefined,
    }).then(function (r) {
      if (r.status === 200 && r.json) {
        state.etag = r.json.etag;
        dirty = false;
        state.last = new Date();
        return true;
      }
      if (r.status === 409 && !retried) {
        return pull().then(function (p) {
          return p ? push(p.merged, true) : false;
        });
      }
      throw new Error("push failed");
    });
  }

  function syncNow(reloadIfChanged) {
    if (!state.user || state.busy) return Promise.resolve();
    state.busy = true;
    setStatus("Syncing…");
    return pull()
      .then(function (p) {
        if (!p) return null;
        var needPush = !sameData(p.merged, p.remote);
        return (needPush ? push(p.merged) : Promise.resolve(true)).then(
          function () {
            state.last = new Date();
            return p;
          },
        );
      })
      .then(function (p) {
        setStatus(
          p ? "Synced at " + state.last.toLocaleTimeString() : "Signed out.",
        );
        if (p && p.changedLocal && reloadIfChanged) {
          var done = false;
          try {
            done = sessionStorage.getItem(RELOAD_FLAG) === "1";
            if (!done) sessionStorage.setItem(RELOAD_FLAG, "1");
          } catch (e) {
            done = true;
          }
          if (!done) location.reload();
        } else if (p) {
          try {
            sessionStorage.removeItem(RELOAD_FLAG);
          } catch (e) {
            /* ignore */
          }
        }
      })
      .catch(function () {
        setStatus(
          "Couldn't reach the sync service. Your progress is still saved on this device.",
        );
      })
      .then(function () {
        state.busy = false;
      });
  }

  function schedulePush() {
    if (!state.user) return;
    dirty = true;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () {
      if (state.busy) return schedulePush();
      state.busy = true;
      push(collectLocal())
        .then(function () {
          setStatus("Synced at " + state.last.toLocaleTimeString());
        })
        .catch(function () {
          setStatus(
            "Couldn't reach the sync service. Your progress is still saved on this device.",
          );
        })
        .then(function () {
          state.busy = false;
        });
    }, 3000);
  }

  /* Notice writes to the synced keys without touching quiz.js / linux-sim.js */
  Storage.prototype.setItem = function (k, v) {
    nativeSet.call(this, k, v);
    if (this === window.localStorage && KEY_RE.test(String(k))) schedulePush();
  };
  Storage.prototype.removeItem = function (k) {
    nativeRemove.call(this, k);
    if (this === window.localStorage && KEY_RE.test(String(k))) schedulePush();
  };
  document.addEventListener("visibilitychange", function () {
    if (
      document.visibilityState === "hidden" &&
      dirty &&
      state.user &&
      !state.busy
    ) {
      try {
        fetch("/api/sync", {
          method: "PUT",
          credentials: "same-origin",
          keepalive: true,
          headers: { "Content-Type": "application/json", "X-SP-CSRF": "1" },
          body: JSON.stringify({
            data: collectLocal(),
            etag: state.etag || undefined,
          }),
        });
      } catch (e) {
        /* best effort */
      }
    }
  });

  /* ───────────── nav button ───────────── */
  function renderBtn() {
    if (!acctBtn) return;
    acctBtn.textContent = state.user ? "👤 " + state.user : "🔒 Sign in";
    acctBtn.setAttribute(
      "aria-label",
      state.user ? "Account: " + state.user : "Sign in to sync progress",
    );
  }
  function mountNav() {
    var nav = document.querySelector(".topnav");
    if (!nav) return;
    var sec = el("a", {
      class: "navlink",
      href: "security.html",
      text: "Security",
    });
    if (/security\.html$/.test(location.pathname)) sec.className += " active";
    nav.appendChild(sec);
    acctBtn = el("button", { class: "navlink sp-acct-btn", type: "button" });
    acctBtn.addEventListener("click", openDialog);
    nav.appendChild(acctBtn);
    renderBtn();
  }

  /* ───────────── dialog ───────────── */
  function field(id, label, type, autocomplete) {
    var input = el("input", {
      id: id,
      type: type,
      autocomplete: autocomplete,
      required: "required",
      spellcheck: "false",
      autocapitalize: "none",
    });
    return {
      wrap: el("label", { class: "sp-field", for: id }, [
        el("span", { text: label }),
        input,
      ]),
      input: input,
    };
  }

  function closeDialog() {
    if (dialog && dialog.open) dialog.close();
  }

  function openDialog() {
    if (!dialog) {
      dialog = el("dialog", {
        class: "sp-dialog",
        "aria-labelledby": "spDlgTitle",
      });
      dialog.addEventListener("click", function (ev) {
        if (ev.target === dialog) closeDialog();
      });
      document.body.appendChild(dialog);
    }
    drawDialog("signin");
    if (!dialog.open) dialog.showModal();
  }

  function drawDialog(mode, note) {
    while (dialog.firstChild) dialog.removeChild(dialog.firstChild);
    var box = el("div", { class: "sp-dlg-box" });
    var close = el("button", {
      class: "sp-x",
      type: "button",
      "aria-label": "Close",
      text: "✕",
    });
    close.addEventListener("click", closeDialog);
    box.appendChild(close);

    if (state.available === false) {
      box.appendChild(el("h2", { id: "spDlgTitle", text: "Sync unavailable" }));
      box.appendChild(
        el("p", {
          class: "sp-note",
          text: "Account sync isn't available on this host right now. Everything still works — your progress is saved in this browser. The main site (securityplus-studyguide.vercel.app) supports sync.",
        }),
      );
      dialog.appendChild(box);
      return;
    }
    if (state.user) return drawAccount(box, note);

    var creating = mode === "register";
    box.appendChild(
      el("h2", {
        id: "spDlgTitle",
        text: creating ? "Create account" : "Sign in",
      }),
    );
    box.appendChild(
      el("p", {
        class: "sp-note",
        text: "Sync your quiz and Linux Lab progress across devices. No email, no tracking. There is no password recovery, so keep your password safe.",
      }),
    );
    var tabs = el("div", { class: "sp-tabs", role: "tablist" });
    [
      ["signin", "Sign in"],
      ["register", "Create account"],
    ].forEach(function (t) {
      var b = el("button", {
        type: "button",
        role: "tab",
        "aria-selected": String(mode === t[0]),
        class: "sp-tab" + (mode === t[0] ? " on" : ""),
        text: t[1],
      });
      b.addEventListener("click", function () {
        drawDialog(t[0]);
      });
      tabs.appendChild(b);
    });
    box.appendChild(tabs);

    var form = el("form", { class: "sp-form", novalidate: "novalidate" });
    var u = field("spUser", "Username", "text", "username");
    u.input.setAttribute("minlength", "3");
    u.input.setAttribute("maxlength", "32");
    var p = field(
      "spPass",
      creating ? "Password (10+ characters)" : "Password",
      "password",
      creating ? "new-password" : "current-password",
    );
    p.input.setAttribute("maxlength", "128");
    form.appendChild(u.wrap);
    form.appendChild(p.wrap);
    var err = el("p", { class: "sp-err", role: "alert" });
    var submit = el("button", {
      class: "sp-primary",
      type: "submit",
      text: creating ? "Create account" : "Sign in",
    });
    form.appendChild(err);
    form.appendChild(submit);
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      err.textContent = "";
      var name = u.input.value.trim();
      var pass = p.input.value;
      if (name.length < 3)
        return void (err.textContent =
          "Username must be at least 3 characters.");
      if (creating && pass.length < 10)
        return void (err.textContent =
          "Password must be at least 10 characters.");
      submit.disabled = true;
      api("POST", creating ? "register" : "login", {
        username: name,
        password: pass,
      })
        .then(function (r) {
          if (r.status === 200 && r.json && r.json.user) {
            state.user = r.json.user;
            state.etag = null;
            lsSet(
              CONSENT_KEY,
              JSON.stringify({ v: 1, t: Date.now(), sync: true }),
            );
            removeBanner();
            renderBtn();
            drawDialog("signin", "Signed in. Syncing your progress…");
            return syncNow(true);
          }
          err.textContent =
            (r.json && r.json.error) || "Something went wrong. Try again.";
          submit.disabled = false;
        })
        .catch(function () {
          err.textContent = "Couldn't reach the server. Check your connection.";
          submit.disabled = false;
        });
    });
    box.appendChild(form);
    dialog.appendChild(box);
    u.input.focus();
  }

  function drawAccount(box, note) {
    box.appendChild(el("h2", { id: "spDlgTitle", text: "Your account" }));
    box.appendChild(
      el("p", { class: "sp-who", text: "Signed in as " + state.user }),
    );
    box.appendChild(
      el("p", {
        id: "spSyncStatus",
        class: "sp-note",
        role: "status",
        text: note || "",
      }),
    );
    var row = el("div", { class: "sp-actions" });
    function btn(label, cls, fn) {
      var b = el("button", { type: "button", class: cls, text: label });
      b.addEventListener("click", fn);
      row.appendChild(b);
      return b;
    }
    btn("Sync now", "sp-primary", function () {
      syncNow(true);
    });
    function out(action, msg) {
      return function () {
        api("POST", action, {}).then(function () {
          state.user = null;
          state.etag = null;
          renderBtn();
          drawDialog("signin", msg);
        });
      };
    }
    btn("Sign out", "sp-ghost", out("logout"));
    btn("Sign out everywhere", "sp-ghost", out("logout-all"));
    box.appendChild(row);

    var danger = el("details", { class: "sp-danger" });
    danger.appendChild(
      el("summary", { text: "Delete account and cloud data" }),
    );
    danger.appendChild(
      el("p", {
        class: "sp-note",
        text: "Permanently erases your account and synced progress from the server. Progress saved in this browser stays.",
      }),
    );
    var pw = field(
      "spDelPass",
      "Confirm password",
      "password",
      "current-password",
    );
    var derr = el("p", { class: "sp-err", role: "alert" });
    var del = el("button", {
      type: "button",
      class: "sp-delete",
      text: "Delete permanently",
    });
    del.addEventListener("click", function () {
      derr.textContent = "";
      api("POST", "delete-account", { password: pw.input.value }).then(
        function (r) {
          if (r.status === 200) {
            state.user = null;
            state.etag = null;
            renderBtn();
            drawDialog("signin", "Account deleted.");
          } else
            derr.textContent =
              (r.json && r.json.error) || "Couldn't delete the account.";
        },
      );
    });
    danger.appendChild(pw.wrap);
    danger.appendChild(derr);
    danger.appendChild(del);
    box.appendChild(danger);

    var link = el("a", {
      class: "sp-link",
      href: "security.html",
      text: "How this is secured →",
    });
    box.appendChild(link);
    dialog.appendChild(box);
    if (state.last) setStatus("Synced at " + state.last.toLocaleTimeString());
  }

  /* ───────────── first-visit notice ───────────── */
  var banner = null;
  function removeBanner() {
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    banner = null;
  }
  function showBanner() {
    if (lsGet(CONSENT_KEY)) return;
    banner = el("section", {
      class: "sp-banner",
      role: "region",
      "aria-label": "Privacy and storage notice",
    });
    var txt = el("div", { class: "sp-banner-txt" }, [
      el("strong", { text: "🔒 Privacy & storage" }),
      el("span", {
        text: " This site keeps your quiz and lab progress in your browser. If you sign in to sync across devices, it sets one HttpOnly, Secure, SameSite=Strict session cookie. No ads, no trackers, no third-party cookies.",
      }),
    ]);
    var acts = el("div", { class: "sp-banner-acts" });
    var signin = el("button", {
      type: "button",
      class: "sp-primary",
      text: "Sign in to sync",
    });
    signin.addEventListener("click", function () {
      openDialog();
    });
    var ok = el("button", {
      type: "button",
      class: "sp-ghost",
      text: "Continue locally",
    });
    ok.addEventListener("click", function () {
      lsSet(CONSENT_KEY, JSON.stringify({ v: 1, t: Date.now(), sync: false }));
      removeBanner();
    });
    var more = el("a", {
      class: "sp-link",
      href: "security.html",
      text: "Details",
    });
    if (state.available !== false) acts.appendChild(signin);
    acts.appendChild(ok);
    acts.appendChild(more);
    banner.appendChild(txt);
    banner.appendChild(acts);
    document.body.appendChild(banner);
  }

  /* ───────────── boot ───────────── */
  var booted = false;
  function boot() {
    if (booted) return;
    booted = true;
    mountNav();
    api("GET", "me")
      .then(function (r) {
        if (r.json && Object.prototype.hasOwnProperty.call(r.json, "user")) {
          state.available = true;
          state.user = r.json.user;
        } else {
          state.available = false;
        }
      })
      .catch(function () {
        state.available = false;
      })
      .then(function () {
        renderBtn();
        showBanner();
        if (state.user) syncNow(true);
        else {
          try {
            sessionStorage.removeItem(RELOAD_FLAG);
          } catch (e) {
            /* ignore */
          }
        }
      });
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
