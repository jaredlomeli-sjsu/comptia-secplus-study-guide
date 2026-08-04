/* ════════════════════════════════════════════════════════════
   linux-sim.js · Simulated Linux shell for the Security+ study guide

   A virtual filesystem + command interpreter that behaves like a real
   shell, built to run the command set from the CISCO "Linux Unhatched"
   course and the SEC+ log-analysis labs.

   Reads window.LINUX_LESSONS (lessons + challenges) when present.
   Exposes window.LinuxSim for tools/test-linux-sim.js.

   Style note: vanilla ES5 to match the rest of the site — var, function
   expressions, IIFE. No framework, no bundler, no transpile.
════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ════════════════════════════════════════
     HELPERS
  ════════════════════════════════════════ */
  function $(id) {
    return document.getElementById(id);
  }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function padL(s, n) {
    s = String(s);
    while (s.length < n) s = " " + s;
    return s;
  }
  function padR(s, n) {
    s = String(s);
    while (s.length < n) s = s + " ";
    return s;
  }
  function ok(out) {
    return { out: out == null ? "" : out, err: "", code: 0 };
  }
  function fail(err, code) {
    return { out: "", err: err, code: code == null ? 1 : code };
  }

  /* A fixed simulated clock. Deterministic so the jsdom harness can assert
     on `ls -l` output; files created in-session advance it a minute each. */
  var BOOT = Date.UTC(2026, 6, 15, 10, 30, 0);
  var clock = BOOT;
  function tick() {
    clock += 60000;
    return clock;
  }

  var MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  /* Real `ls -l` shows "Mon DD  YYYY" for anything older than ~6 months and
     "Mon DD HH:MM" for anything recent. */
  function stamp(ms) {
    var d = new Date(ms);
    var mon = MONTHS[d.getUTCMonth()];
    var day = padL(d.getUTCDate(), 2);
    if (BOOT - ms > 15552000000) {
      return mon + " " + day + "  " + d.getUTCFullYear();
    }
    var hh = padL(d.getUTCHours(), 2).replace(" ", "0");
    var mm = padL(d.getUTCMinutes(), 2).replace(" ", "0");
    return mon + " " + day + " " + hh + ":" + mm;
  }

  /* ════════════════════════════════════════
     VIRTUAL FILESYSTEM

     node = { type, mode, owner, group, mtime, links,
              content (files) | children (dirs) | target (symlinks),
              size (optional override) }
     type: d directory · f regular · l symlink · s socket · p pipe
           b block device · c character device
  ════════════════════════════════════════ */
  function dir(mode, owner, group, children, mtime) {
    return {
      type: "d",
      mode: mode || "rwxr-xr-x",
      owner: owner || "root",
      group: group || "root",
      mtime: mtime || BOOT,
      children: children || {},
    };
  }
  function file(content, mode, owner, group, mtime, size) {
    return {
      type: "f",
      mode: mode || "rw-r--r--",
      owner: owner || "root",
      group: group || "root",
      mtime: mtime || BOOT,
      content: content == null ? "" : content,
      size: size,
    };
  }
  function special(type, mode, owner, group, target) {
    return {
      type: type,
      mode: mode,
      owner: owner || "root",
      group: group || "root",
      mtime: BOOT,
      target: target,
      content: "",
    };
  }

  var ALPHA_FIRST =
    "A is for Apple\nB is for Bear\nC is for Cat\nD is for Dog\n" +
    "E is for Elephant\nF is for Flower\nG is for Grape\nH is for House\n" +
    "I is for Igloo\nJ is for Jacket\n";

  var ALPHA =
    "alpha\nbravo\ncharlie\ndelta\necho\nfoxtrot\ngolf\nhotel\n" +
    "india\njuliet\nkilo\nlima\n";

  /* Chosen so every grep example in the source notes returns exactly the
     documented lines: r..f -> roof, reef · re*d -> red, reed, reeed, rd */
  var RED = "red\nreed\nreeed\nrd\nreef\nreel\nread\nroof\n";

  var PROFILE = "I am 37 years old.\n3121991\nName: sysadmin\n";

  var PASSWD =
    "root:x:0:0:root:/root:/bin/bash\n" +
    "daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\n" +
    "bin:x:2:2:bin:/bin:/usr/sbin/nologin\n" +
    "syslog:x:104:110::/home/syslog:/usr/sbin/nologin\n" +
    "sysadmin:x:1000:1000:System Administrator:/home/sysadmin:/bin/bash\n";

  var AUTHLOG =
    "Jul 15 09:14:02 localhost sshd[1841]: Accepted password for sysadmin from 192.168.56.1 port 51422 ssh2\n" +
    "Jul 15 09:14:02 localhost sshd[1841]: pam_unix(sshd:session): session opened for user sysadmin\n" +
    "Jul 15 09:22:47 localhost sudo:  sysadmin : TTY=pts/0 ; PWD=/home/sysadmin ; USER=root ; COMMAND=/usr/bin/apt-get update\n" +
    "Jul 15 09:31:15 localhost sshd[1902]: Failed password for wronguser from 192.168.56.101 port 44210 ssh2\n" +
    "Jul 15 09:31:18 localhost sshd[1902]: Failed password for wronguser from 192.168.56.101 port 44210 ssh2\n" +
    "Jul 15 09:31:21 localhost sshd[1902]: Failed password for wronguser from 192.168.56.101 port 44210 ssh2\n" +
    "Jul 15 09:31:24 localhost sshd[1902]: Connection closed by authenticating user wronguser 192.168.56.101 port 44210 [preauth]\n" +
    "Jul 15 10:02:33 localhost cron[2011]: pam_unix(cron:session): session opened for user root\n" +
    "Jul 15 10:02:33 localhost cron[2011]: pam_unix(cron:session): session closed for user root\n" +
    "Jul 15 10:18:09 localhost sshd[2140]: Accepted publickey for sysadmin from 192.168.56.1 port 51988 ssh2\n";

  var HELLO_SH = '#!/bin/bash\necho "Hello, World!"\n';

  function seedRoot() {
    return dir("rwxr-xr-x", "root", "root", {
      bin: dir("rwxr-xr-x", "root", "root", {}),
      dev: dir("rwxr-xr-x", "root", "root", {
        zero: special("c", "rw-rw-rw-", "root", "root"),
        sda: special("b", "rw-rw----", "root", "disk"),
        log: special("s", "rw-rw-rw-", "root", "root"),
        initctl: special("p", "rw-------", "root", "root"),
      }),
      etc: dir("rwxr-xr-x", "root", "root", {
        passwd: file(PASSWD, "rw-r--r--", "root", "root", Date.UTC(2026, 5, 2)),
        shadow: file(
          "root:!:19900:0:99999:7:::\nsysadmin:$6$xK2:19900:0:99999:7:::\n",
          "rw-r-----",
          "root",
          "shadow",
          Date.UTC(2026, 5, 2),
        ),
        hosts: file(
          "127.0.0.1\tlocalhost\n127.0.1.1\tlocalhost.localdomain\n",
          "rw-r--r--",
          "root",
          "root",
        ),
      }),
      home: dir("rwxr-xr-x", "root", "root", {
        sysadmin: dir("rwxr-xr-x", "sysadmin", "sysadmin", {
          ".bashrc": file(
            "# ~/.bashrc\nalias ll='ls -alF'\n",
            "rw-r--r--",
            "sysadmin",
            "sysadmin",
          ),
          ".profile": file(
            "# ~/.profile\n",
            "rw-r--r--",
            "sysadmin",
            "sysadmin",
          ),
          Documents: dir(
            "rwxr-xr-x",
            "sysadmin",
            "sysadmin",
            {
              "notes.txt": file(
                "Remember: absolute paths start with /\nRelative paths do not.\n",
                "rw-r--r--",
                "sysadmin",
                "sysadmin",
              ),
              "report.txt": file(
                "Quarterly access review — 12 accounts checked.\n",
                "rw-r--r--",
                "sysadmin",
                "sysadmin",
              ),
            },
            Date.UTC(2026, 6, 10),
          ),
          School: dir(
            "rwxr-xr-x",
            "sysadmin",
            "sysadmin",
            {
              Art: dir("rwxr-xr-x", "sysadmin", "sysadmin", {
                "sketch.txt": file(
                  "charcoal study\n",
                  "rw-r--r--",
                  "sysadmin",
                  "sysadmin",
                ),
              }),
            },
            Date.UTC(2026, 6, 12),
          ),
          "alpha.txt": file(
            ALPHA,
            "rw-r--r--",
            "sysadmin",
            "sysadmin",
            Date.UTC(2026, 6, 14, 8, 15),
          ),
          "alpha-first.txt": file(
            ALPHA_FIRST,
            "rw-r--r--",
            "sysadmin",
            "sysadmin",
            Date.UTC(2026, 6, 14, 8, 20),
          ),
          "red.txt": file(
            RED,
            "rw-r--r--",
            "sysadmin",
            "sysadmin",
            Date.UTC(2026, 6, 13, 16, 5),
          ),
          "profile.txt": file(
            PROFILE,
            "rw-r--r--",
            "sysadmin",
            "sysadmin",
            Date.UTC(2026, 6, 13, 16, 9),
          ),
          "numbers.txt": file(
            "1\n2\n3\n4\n5\n",
            "rw-r--r--",
            "sysadmin",
            "sysadmin",
          ),
          "letters.txt": file("x\ny\nz\n", "rw-r--r--", "sysadmin", "sysadmin"),
          "hello.sh": file(
            HELLO_SH,
            "rw-r--r--",
            "sysadmin",
            "sysadmin",
            Date.UTC(2026, 6, 14, 9, 0),
          ),
          notes: special(
            "l",
            "rwxrwxrwx",
            "sysadmin",
            "sysadmin",
            "/home/sysadmin/Documents/notes.txt",
          ),
        }),
      }),
      opt: dir("rwxr-xr-x", "root", "root", {}),
      srv: dir("rwxr-xr-x", "root", "root", {}),
      root: dir("rwx------", "root", "root", {}),
      tmp: dir("rwxrwxrwt", "root", "root", {}),
      var: dir("rwxr-xr-x", "root", "root", {
        spool: dir("rwxr-xr-x", "root", "root", {}),
        log: dir("rwxr-xr-x", "root", "syslog", {
          /* Owned by root:adm and mode 640 — sysadmin cannot read it without
             sudo. That is the whole point of the Lab 4.1 exercise. */
          "auth.log": file(
            AUTHLOG,
            "rw-r-----",
            "root",
            "adm",
            Date.UTC(2026, 6, 15, 10, 18),
          ),
          "bootstrap.log": file(
            "",
            "rw-r-----",
            "syslog",
            "adm",
            Date.UTC(2017, 11, 7),
            19573,
          ),
          syslog: file(
            "Jul 15 10:30:01 localhost systemd[1]: Started Daily apt refresh.\n",
            "rw-r-----",
            "syslog",
            "adm",
            Date.UTC(2026, 6, 15, 10, 30),
          ),
        }),
      }),
    });
  }

  function deepClone(n) {
    var c = {},
      k;
    for (k in n) {
      if (!Object.prototype.hasOwnProperty.call(n, k)) continue;
      if (k === "children") {
        c.children = {};
        for (var ck in n.children) {
          if (Object.prototype.hasOwnProperty.call(n.children, ck)) {
            c.children[ck] = deepClone(n.children[ck]);
          }
        }
      } else {
        c[k] = n[k];
      }
    }
    return c;
  }

  /* ════════════════════════════════════════
     SHELL STATE
  ════════════════════════════════════════ */
  var HOST = "localhost";
  var GROUPS = {
    sysadmin: ["sysadmin"],
    root: ["root", "adm", "shadow", "disk", "syslog", "sysadmin"],
  };

  var sh = {
    root: null,
    cwd: "/home/sysadmin",
    user: "sysadmin",
    stack: [],
    halted: false,
  };

  function resetFs(overlay) {
    sh.root = seedRoot();
    sh.cwd = "/home/sysadmin";
    sh.user = "sysadmin";
    sh.stack = [];
    sh.halted = false;
    clock = BOOT;
    if (typeof overlay === "function") overlay(api);
  }

  function homeOf(u) {
    return u === "root" ? "/root" : "/home/" + u;
  }

  /* Normalize a path against the cwd. Handles ~, ., .., and // */
  function absPath(p) {
    if (p == null || p === "") p = ".";
    var start;
    if (p === "~" || p.indexOf("~/") === 0) {
      start = homeOf(sh.user) + p.slice(1);
    } else if (p.charAt(0) === "/") {
      start = p;
    } else {
      start = sh.cwd + "/" + p;
    }
    var parts = start.split("/");
    var out = [];
    for (var i = 0; i < parts.length; i++) {
      var seg = parts[i];
      if (seg === "" || seg === ".") continue;
      if (seg === "..") {
        out.pop();
        continue;
      }
      out.push(seg);
    }
    return "/" + out.join("/");
  }

  function baseName(p) {
    var a = absPath(p).split("/");
    return a[a.length - 1] || "/";
  }
  function dirName(p) {
    var a = absPath(p).split("/");
    a.pop();
    return "/" + a.slice(1).join("/");
  }

  /* Walk to a node. Returns null when any component is missing. */
  function lookup(p) {
    var abs = absPath(p);
    if (abs === "/") return sh.root;
    var parts = abs.split("/").slice(1);
    var node = sh.root;
    for (var i = 0; i < parts.length; i++) {
      if (!node || node.type !== "d" || !node.children) return null;
      node = node.children[parts[i]];
      if (!node) return null;
    }
    return node;
  }

  /* Follow a symlink to its target (one hop is enough here). */
  function deref(node) {
    if (node && node.type === "l" && node.target) {
      var t = lookup(node.target);
      return t || node;
    }
    return node;
  }

  function parentOf(p) {
    return lookup(dirName(p));
  }

  function sizeOf(n) {
    if (n.size != null) return n.size;
    if (n.type === "d") return 4096;
    if (n.type === "l") return (n.target || "").length;
    return (n.content || "").length;
  }

  /* ── permissions ────────────────────────────── */
  function triad(node) {
    if (sh.user === "root") return "rwx";
    if (node.owner === sh.user) return node.mode.slice(0, 3);
    var gs = GROUPS[sh.user] || [];
    for (var i = 0; i < gs.length; i++) {
      if (gs[i] === node.group) return node.mode.slice(3, 6);
    }
    return node.mode.slice(6, 9);
  }
  function can(node, perm) {
    if (!node) return false;
    /* root bypasses r/w but still needs an x bit somewhere to execute */
    if (sh.user === "root" && perm !== "x") return true;
    var t = triad(node);
    /* The sticky bit and setuid/setgid replace the x character in a mode
       string rather than adding a column: /tmp is rwxrwxrwt, and that final
       t still means "other may execute". Treat them as execute. */
    if (perm === "x") return /[xst]/.test(t.charAt(2));
    return t.indexOf(perm) !== -1;
  }
  /* Every component of the path needs +x to be traversable. */
  function canTraverse(p) {
    var abs = absPath(p);
    var parts = abs.split("/").slice(1);
    var node = sh.root;
    if (!can(node, "x")) return false;
    for (var i = 0; i < parts.length - 1; i++) {
      node = node.children ? node.children[parts[i]] : null;
      if (!node) return true;
      if (!can(node, "x")) return false;
    }
    return true;
  }

  function typeChar(n) {
    return n.type === "f" ? "-" : n.type;
  }
  function modeStr(n) {
    return typeChar(n) + n.mode;
  }

  /* Symbolic + numeric chmod. Returns a new 9-char mode or null. */
  var NUM_TO_RWX = ["---", "--x", "-w-", "-wx", "r--", "r-x", "rw-", "rwx"];
  function applyChmod(mode, spec) {
    if (/^[0-7]{3}$/.test(spec)) {
      return (
        NUM_TO_RWX[+spec.charAt(0)] +
        NUM_TO_RWX[+spec.charAt(1)] +
        NUM_TO_RWX[+spec.charAt(2)]
      );
    }
    var clauses = spec.split(",");
    var bits = [
      mode.slice(0, 3).split(""),
      mode.slice(3, 6).split(""),
      mode.slice(6, 9).split(""),
    ];
    var IDX = { r: 0, w: 1, x: 2 };
    for (var c = 0; c < clauses.length; c++) {
      var m = /^([ugoa]*)([+\-=])([rwx]*)$/.exec(clauses[c]);
      if (!m) return null;
      var who = m[1] || "a";
      var act = m[2];
      var perms = m[3];
      var sets = [];
      if (who.indexOf("a") !== -1) sets = [0, 1, 2];
      else {
        if (who.indexOf("u") !== -1) sets.push(0);
        if (who.indexOf("g") !== -1) sets.push(1);
        if (who.indexOf("o") !== -1) sets.push(2);
      }
      for (var s = 0; s < sets.length; s++) {
        var t = sets[s];
        if (act === "=") bits[t] = ["-", "-", "-"];
        for (var p = 0; p < perms.length; p++) {
          var i = IDX[perms.charAt(p)];
          bits[t][i] = act === "-" ? "-" : perms.charAt(p);
        }
      }
    }
    return bits[0].join("") + bits[1].join("") + bits[2].join("");
  }

  /* ════════════════════════════════════════
     grep — BRE and ERE translated to JS RegExp

     In BRE, `+ ? { } ( ) |` are LITERAL unless backslash-escaped, and
     `^`/`$` are only anchors at the very start/end of the pattern. ERE
     is close enough to JS to pass through with light escaping. The source
     notes teach exactly this distinction, so it has to be right.
  ════════════════════════════════════════ */
  function breToJs(pat) {
    var out = "";
    var i = 0;
    var inClass = false;
    while (i < pat.length) {
      var c = pat.charAt(i);
      if (inClass) {
        out += c;
        if (c === "]" && !/\[\^?$/.test(out.slice(0, -1))) inClass = false;
        i++;
        continue;
      }
      if (c === "[") {
        inClass = true;
        out += c;
        i++;
        /* a ] immediately after [ or [^ is a literal ] */
        if (pat.charAt(i) === "^") {
          out += "^";
          i++;
        }
        if (pat.charAt(i) === "]") {
          out += "\\]";
          i++;
        }
        continue;
      }
      if (c === "\\") {
        var n = pat.charAt(i + 1);
        if ("(){}|+?".indexOf(n) !== -1) out += n; /* GNU BRE metachar */
        else if (n === "") out += "\\\\";
        else out += "\\" + n;
        i += 2;
        continue;
      }
      if ("+?{}()|".indexOf(c) !== -1) {
        out += "\\" + c; /* literal in BRE */
        i++;
        continue;
      }
      if (c === "^") {
        out += i === 0 ? "^" : "\\^";
        i++;
        continue;
      }
      if (c === "$") {
        out += i === pat.length - 1 ? "$" : "\\$";
        i++;
        continue;
      }
      if (c === "*") {
        /* a leading * is literal */
        out += out === "" ? "\\*" : "*";
        i++;
        continue;
      }
      out += c;
      i++;
    }
    return out;
  }

  function ereToJs(pat) {
    /* JS regex syntax is a superset of ERE for everything the course covers. */
    return pat;
  }

  function buildRe(pat, extended, icase) {
    var src = extended ? ereToJs(pat) : breToJs(pat);
    try {
      return new RegExp(src, icase ? "i" : "");
    } catch (e) {
      return null;
    }
  }

  /* ════════════════════════════════════════
     PROCESS TABLE (for ps)
  ════════════════════════════════════════ */
  var PROCS = [
    {
      uid: "root",
      pid: 1,
      ppid: 0,
      tty: "?",
      time: "00:00:03",
      cmd: "/sbin/init",
    },
    {
      uid: "root",
      pid: 412,
      ppid: 1,
      tty: "?",
      time: "00:00:00",
      cmd: "/lib/systemd/systemd-journald",
    },
    {
      uid: "root",
      pid: 640,
      ppid: 1,
      tty: "?",
      time: "00:00:01",
      cmd: "/usr/sbin/sshd -D",
    },
    {
      uid: "root",
      pid: 705,
      ppid: 1,
      tty: "?",
      time: "00:00:00",
      cmd: "/usr/sbin/cron -f",
    },
    {
      uid: "syslog",
      pid: 733,
      ppid: 1,
      tty: "?",
      time: "00:00:00",
      cmd: "/usr/sbin/rsyslogd -n",
    },
    {
      uid: "sysadmin",
      pid: 80,
      ppid: 640,
      tty: "pts/0",
      time: "00:00:00",
      cmd: "bash",
    },
  ];
  var extraProcs = [];
  function procList() {
    return PROCS.concat(extraProcs);
  }

  /* ════════════════════════════════════════
     COMMANDS
     Each returns {out, err, code}. Returning text rather than writing to
     the DOM is what lets pipes and redirection compose.
  ════════════════════════════════════════ */
  function splitFlags(args) {
    var flags = "";
    var rest = [];
    var nOpt = null;
    for (var i = 0; i < args.length; i++) {
      var a = args[i];
      if (a.charAt(0) === "-" && a.length > 1 && a !== "--") {
        if (/^-\d+$/.test(a)) {
          nOpt = +a.slice(1);
          continue;
        }
        flags += a.slice(1);
      } else {
        rest.push(a);
      }
    }
    return { flags: flags, rest: rest, n: nOpt };
  }

  function readFile(path, res) {
    var node = deref(lookup(path));
    if (!node) return { err: path + ": No such file or directory" };
    if (node.type === "d") return { err: path + ": Is a directory" };
    if (!canTraverse(path) || !can(node, "r"))
      return { err: path + ": Permission denied" };
    return { text: node.content || "" };
  }

  var CMDS = {};

  CMDS.pwd = function () {
    return ok(sh.cwd + "\n");
  };

  CMDS.whoami = function () {
    return ok(sh.user + "\n");
  };

  CMDS.cd = function (args) {
    var target = args[0] == null ? homeOf(sh.user) : args[0];
    var abs = absPath(target);
    var node = deref(lookup(abs));
    if (!node) return fail("cd: " + target + ": No such file or directory");
    if (node.type !== "d") return fail("cd: " + target + ": Not a directory");
    if (!can(node, "x")) return fail("cd: " + target + ": Permission denied");
    sh.cwd = abs;
    return ok("");
  };

  CMDS.ls = function (args) {
    var f = splitFlags(args);
    var long = f.flags.indexOf("l") !== -1;
    var all = f.flags.indexOf("a") !== -1;
    var rev = f.flags.indexOf("r") !== -1;
    var byTime = f.flags.indexOf("t") !== -1;
    var bySize = f.flags.indexOf("S") !== -1;
    var targets = f.rest.length ? f.rest : ["."];
    var chunks = [];
    var errs = [];

    for (var t = 0; t < targets.length; t++) {
      var p = targets[t];
      var node = lookup(p);
      if (!node) {
        errs.push("ls: cannot access '" + p + "': No such file or directory");
        continue;
      }
      var listing = [];
      if (node.type === "d") {
        if (!can(node, "r")) {
          errs.push("ls: cannot open directory '" + p + "': Permission denied");
          continue;
        }
        for (var name in node.children) {
          if (!Object.prototype.hasOwnProperty.call(node.children, name))
            continue;
          if (!all && name.charAt(0) === ".") continue;
          listing.push({ name: name, node: node.children[name] });
        }
        if (all) {
          listing.push({ name: ".", node: node });
          listing.push({ name: "..", node: parentOf(p) || node });
        }
      } else {
        listing.push({ name: p, node: node });
      }

      listing.sort(function (a, b) {
        if (byTime) return b.node.mtime - a.node.mtime;
        if (bySize) return sizeOf(b.node) - sizeOf(a.node);
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
      });
      if (rev) listing.reverse();

      var body;
      if (long) {
        var wLinks = 1,
          wOwner = 1,
          wGroup = 1,
          wSize = 1;
        listing.forEach(function (item) {
          wOwner = Math.max(wOwner, item.node.owner.length);
          wGroup = Math.max(wGroup, item.node.group.length);
          wSize = Math.max(wSize, String(sizeOf(item.node)).length);
        });
        var lines = listing.map(function (item) {
          var n = item.node;
          var nm = item.name;
          if (n.type === "l") nm += " -> " + n.target;
          return (
            modeStr(n) +
            " " +
            padL(n.links || 1, wLinks) +
            " " +
            padR(n.owner, wOwner) +
            " " +
            padR(n.group, wGroup) +
            " " +
            padL(sizeOf(n), wSize) +
            " " +
            stamp(n.mtime) +
            " " +
            nm
          );
        });
        if (node.type === "d") {
          var total = listing.reduce(function (a, i) {
            return a + Math.ceil(sizeOf(i.node) / 1024) * 4;
          }, 0);
          lines.unshift("total " + total);
        }
        body = lines.join("\n") + "\n";
      } else {
        body =
          listing
            .map(function (i) {
              return i.name;
            })
            .join("  ") + "\n";
      }

      if (targets.length > 1 && node.type === "d") {
        chunks.push(p + ":\n" + body);
      } else {
        chunks.push(body);
      }
    }

    var out = chunks.join("\n");
    if (errs.length && !chunks.length) return fail(errs.join("\n"));
    if (errs.length) return { out: out, err: errs.join("\n"), code: 1 };
    return ok(out);
  };

  CMDS.cat = function (args, ctx) {
    var f = splitFlags(args);
    if (!f.rest.length) return ok(ctx.stdin || "");
    var out = "",
      errs = [];
    for (var i = 0; i < f.rest.length; i++) {
      var r = readFile(f.rest[i]);
      if (r.err) errs.push("cat: " + r.err);
      else out += r.text;
    }
    if (errs.length) return { out: out, err: errs.join("\n"), code: 1 };
    return ok(out);
  };

  function headTail(which) {
    return function (args, ctx) {
      var f = splitFlags(args);
      var n = f.n;
      if (n == null) {
        var ni = f.flags.indexOf("n");
        if (ni !== -1 && f.rest.length && /^\d+$/.test(f.rest[0])) {
          n = +f.rest.shift();
        }
      }
      if (n == null) n = 10;

      var sources = [];
      if (f.rest.length) {
        for (var i = 0; i < f.rest.length; i++) {
          var r = readFile(f.rest[i]);
          if (r.err) return fail(which + ": " + r.err);
          sources.push({ name: f.rest[i], text: r.text });
        }
      } else {
        sources.push({ name: null, text: ctx.stdin || "" });
      }

      var parts = sources.map(function (s) {
        var lines = s.text.split("\n");
        if (lines.length && lines[lines.length - 1] === "") lines.pop();
        var picked =
          which === "head"
            ? lines.slice(0, n)
            : lines.slice(Math.max(0, lines.length - n));
        var body = picked.length ? picked.join("\n") + "\n" : "";
        return sources.length > 1 ? "==> " + s.name + " <==\n" + body : body;
      });
      return ok(parts.join("\n"));
    };
  }
  CMDS.head = headTail("head");
  CMDS.tail = headTail("tail");

  CMDS.echo = function (args) {
    return ok(args.join(" ") + "\n");
  };

  CMDS.grep = function (args, ctx) {
    var flags = "";
    var rest = [];
    for (var i = 0; i < args.length; i++) {
      if (args[i].charAt(0) === "-" && args[i].length > 1)
        flags += args[i].slice(1);
      else rest.push(args[i]);
    }
    if (!rest.length) return fail("usage: grep [OPTION]... PATTERN [FILE]...");
    var pat = rest.shift();
    var re = buildRe(pat, flags.indexOf("E") !== -1, flags.indexOf("i") !== -1);
    if (!re) return fail("grep: invalid regular expression");
    var invert = flags.indexOf("v") !== -1;
    var count = flags.indexOf("c") !== -1;
    var numbered = flags.indexOf("n") !== -1;

    var sources = [];
    if (rest.length) {
      for (var j = 0; j < rest.length; j++) {
        var r = readFile(rest[j]);
        if (r.err) return fail("grep: " + r.err);
        sources.push({ name: rest[j], text: r.text });
      }
    } else {
      sources.push({ name: null, text: ctx.stdin || "" });
    }

    var out = "";
    var hits = 0;
    var many = sources.length > 1;
    for (var s = 0; s < sources.length; s++) {
      var lines = sources[s].text.split("\n");
      if (lines.length && lines[lines.length - 1] === "") lines.pop();
      var local = 0;
      for (var k = 0; k < lines.length; k++) {
        var m = re.test(lines[k]);
        if (invert ? !m : m) {
          local++;
          hits++;
          if (!count) {
            var prefix = many ? sources[s].name + ":" : "";
            if (numbered) prefix += k + 1 + ":";
            out += prefix + lines[k] + "\n";
          }
        }
      }
      if (count) out += (many ? sources[s].name + ":" : "") + local + "\n";
    }
    return { out: out, err: "", code: hits ? 0 : 1 };
  };

  CMDS.mkdir = function (args) {
    var f = splitFlags(args);
    if (!f.rest.length) return fail("mkdir: missing operand");
    var parents = f.flags.indexOf("p") !== -1;
    for (var i = 0; i < f.rest.length; i++) {
      var abs = absPath(f.rest[i]);
      var parts = abs.split("/").slice(1);
      var node = sh.root;
      for (var j = 0; j < parts.length; j++) {
        var last = j === parts.length - 1;
        var next = node.children[parts[j]];
        if (next) {
          if (last && !parents)
            return fail(
              "mkdir: cannot create directory '" + f.rest[i] + "': File exists",
            );
          node = next;
          continue;
        }
        if (!last && !parents)
          return fail(
            "mkdir: cannot create directory '" +
              f.rest[i] +
              "': No such file or directory",
          );
        if (!can(node, "w"))
          return fail(
            "mkdir: cannot create directory '" +
              f.rest[i] +
              "': Permission denied",
          );
        node.children[parts[j]] = dir(
          "rwxr-xr-x",
          sh.user,
          sh.user,
          {},
          tick(),
        );
        node = node.children[parts[j]];
      }
    }
    return ok("");
  };

  CMDS.touch = function (args) {
    var f = splitFlags(args);
    if (!f.rest.length) return fail("touch: missing file operand");
    for (var i = 0; i < f.rest.length; i++) {
      var abs = absPath(f.rest[i]);
      var existing = lookup(abs);
      if (existing) {
        existing.mtime = tick();
        continue;
      }
      var parent = parentOf(abs);
      if (!parent || parent.type !== "d")
        return fail(
          "touch: cannot touch '" + f.rest[i] + "': No such file or directory",
        );
      if (!can(parent, "w"))
        return fail(
          "touch: cannot touch '" + f.rest[i] + "': Permission denied",
        );
      parent.children[baseName(abs)] = file(
        "",
        "rw-r--r--",
        sh.user,
        sh.user,
        tick(),
      );
    }
    return ok("");
  };

  /* Shared destination logic for cp and mv: a trailing dir means "into it". */
  function destPath(src, dest) {
    var d = lookup(dest);
    if (d && d.type === "d") return absPath(dest) + "/" + baseName(src);
    return absPath(dest);
  }

  CMDS.cp = function (args) {
    var f = splitFlags(args);
    var recurse = f.flags.indexOf("r") !== -1 || f.flags.indexOf("R") !== -1;
    if (f.rest.length < 2) return fail("cp: missing destination file operand");
    var dest = f.rest.pop();
    for (var i = 0; i < f.rest.length; i++) {
      var src = f.rest[i];
      var node = lookup(src);
      if (!node)
        return fail("cp: cannot stat '" + src + "': No such file or directory");
      if (node.type === "d" && !recurse)
        return fail("cp: -r not specified; omitting directory '" + src + "'");
      if (!can(node, "r"))
        return fail(
          "cp: cannot open '" + src + "' for reading: Permission denied",
        );
      var target = destPath(src, dest);
      var parent = parentOf(target);
      if (!parent || parent.type !== "d")
        return fail(
          "cp: cannot create regular file '" +
            dest +
            "': No such file or directory",
        );
      if (!can(parent, "w"))
        return fail(
          "cp: cannot create regular file '" + dest + "': Permission denied",
        );
      var copy = deepClone(node);
      copy.owner = sh.user;
      copy.mtime = tick();
      parent.children[baseName(target)] = copy;
    }
    return ok("");
  };

  CMDS.mv = function (args) {
    var f = splitFlags(args);
    if (f.rest.length < 2) return fail("mv: missing destination file operand");
    var dest = f.rest.pop();
    for (var i = 0; i < f.rest.length; i++) {
      var src = f.rest[i];
      var abs = absPath(src);
      var node = lookup(abs);
      if (!node)
        return fail("mv: cannot stat '" + src + "': No such file or directory");
      var srcParent = parentOf(abs);
      if (!can(srcParent, "w"))
        return fail("mv: cannot move '" + src + "': Permission denied");
      var target = destPath(src, dest);
      var parent = parentOf(target);
      if (!parent || parent.type !== "d")
        return fail(
          "mv: cannot move '" +
            src +
            "' to '" +
            dest +
            "': No such file or directory",
        );
      if (!can(parent, "w"))
        return fail(
          "mv: cannot move '" + src + "' to '" + dest + "': Permission denied",
        );
      delete srcParent.children[baseName(abs)];
      node.mtime = tick();
      parent.children[baseName(target)] = node;
    }
    return ok("");
  };

  CMDS.rm = function (args) {
    var f = splitFlags(args);
    var recurse = f.flags.indexOf("r") !== -1 || f.flags.indexOf("R") !== -1;
    var force = f.flags.indexOf("f") !== -1;
    if (!f.rest.length) return force ? ok("") : fail("rm: missing operand");
    for (var i = 0; i < f.rest.length; i++) {
      var abs = absPath(f.rest[i]);
      var node = lookup(abs);
      if (!node) {
        if (force) continue;
        return fail(
          "rm: cannot remove '" + f.rest[i] + "': No such file or directory",
        );
      }
      if (node.type === "d" && !recurse)
        return fail("rm: cannot remove '" + f.rest[i] + "': Is a directory");
      var parent = parentOf(abs);
      if (!can(parent, "w"))
        return fail("rm: cannot remove '" + f.rest[i] + "': Permission denied");
      delete parent.children[baseName(abs)];
    }
    return ok("");
  };

  CMDS.chmod = function (args) {
    var f = splitFlags(args);
    /* a numeric mode looks like a flag to splitFlags only if negative — safe */
    if (f.rest.length < 2) return fail("chmod: missing operand");
    var spec = f.rest.shift();
    for (var i = 0; i < f.rest.length; i++) {
      var node = lookup(f.rest[i]);
      if (!node)
        return fail(
          "chmod: cannot access '" + f.rest[i] + "': No such file or directory",
        );
      if (sh.user !== "root" && node.owner !== sh.user)
        return fail(
          "chmod: changing permissions of '" +
            f.rest[i] +
            "': Operation not permitted",
        );
      var next = applyChmod(node.mode, spec);
      if (!next) return fail("chmod: invalid mode: '" + spec + "'");
      node.mode = next;
    }
    return ok("");
  };

  CMDS.chown = function (args) {
    var f = splitFlags(args);
    if (f.rest.length < 2) return fail("chown: missing operand");
    var spec = f.rest.shift();
    var parts = spec.split(":");
    var owner = parts[0];
    var group = parts.length > 1 ? parts[1] : null;
    if (sh.user !== "root")
      return fail(
        "chown: changing ownership of '" +
          f.rest[0] +
          "': Operation not permitted",
      );
    for (var i = 0; i < f.rest.length; i++) {
      var node = lookup(f.rest[i]);
      if (!node)
        return fail(
          "chown: cannot access '" + f.rest[i] + "': No such file or directory",
        );
      if (owner) node.owner = owner;
      if (group) node.group = group;
    }
    return ok("");
  };

  CMDS.dd = function (args) {
    var opts = {};
    for (var i = 0; i < args.length; i++) {
      var m = /^(\w+)=(.+)$/.exec(args[i]);
      if (m) opts[m[1]] = m[2];
    }
    if (!opts.if || !opts.of) return fail("dd: missing if= or of= operand");
    var bs = 512;
    if (opts.bs) {
      var bm = /^(\d+)([KMG]?)$/i.exec(opts.bs);
      if (!bm) return fail("dd: invalid number: '" + opts.bs + "'");
      bs =
        +bm[1] *
        { "": 1, K: 1024, M: 1048576, G: 1073741824 }[bm[2].toUpperCase()];
    }
    var count = opts.count ? +opts.count : 1;
    var bytes = bs * count;

    var srcNode = lookup(opts.if);
    if (!srcNode && opts.if !== "/dev/zero")
      return fail(
        "dd: failed to open '" + opts.if + "': No such file or directory",
      );

    var target = absPath(opts.of);
    var parent = parentOf(target);
    if (!parent || parent.type !== "d")
      return fail(
        "dd: failed to open '" + opts.of + "': No such file or directory",
      );
    if (!can(parent, "w"))
      return fail("dd: failed to open '" + opts.of + "': Permission denied");

    var content;
    if (opts.if === "/dev/zero") content = "";
    else content = (deref(srcNode).content || "").slice(0, bytes);

    var n = file(content, "rw-r--r--", sh.user, sh.user, tick(), bytes);
    parent.children[baseName(target)] = n;

    return ok(
      count +
        "+0 records in\n" +
        count +
        "+0 records out\n" +
        bytes +
        " bytes (" +
        Math.round(bytes / 1000) +
        " kB) copied, 0.0421 s, " +
        Math.round(bytes / 1000 / 0.0421 / 1000) +
        " MB/s\n",
    );
  };

  CMDS.ps = function (args) {
    var f = splitFlags(args);
    var every = f.flags.indexOf("e") !== -1 || f.flags.indexOf("A") !== -1;
    var full = f.flags.indexOf("f") !== -1;
    var list = procList().filter(function (p) {
      return every || p.uid === sh.user;
    });
    var lines;
    if (full) {
      lines = [
        padR("UID", 9) +
          padL("PID", 5) +
          padL("PPID", 6) +
          "  C STIME TTY          TIME CMD",
      ];
      list.forEach(function (p) {
        lines.push(
          padR(p.uid, 9) +
            padL(p.pid, 5) +
            padL(p.ppid, 6) +
            "  0 10:29 " +
            padR(p.tty, 8) +
            " " +
            p.time +
            " " +
            p.cmd,
        );
      });
    } else {
      lines = ["  PID TTY          TIME CMD"];
      list.forEach(function (p) {
        lines.push(
          padL(p.pid, 5) + " " + padR(p.tty, 12) + " " + p.time + " " + p.cmd,
        );
      });
    }
    return ok(lines.join("\n") + "\n");
  };

  CMDS.ifconfig = function () {
    return ok(
      "eth0      Link encap:Ethernet  HWaddr 08:00:27:4a:1b:9c\n" +
        "          inet addr:192.168.56.102  Bcast:192.168.56.255  Mask:255.255.255.0\n" +
        "          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1\n" +
        "          RX packets:14208 errors:0 dropped:0 overruns:0 frame:0\n" +
        "          TX packets:9134 errors:0 dropped:0 overruns:0 carrier:0\n\n" +
        "lo        Link encap:Local Loopback\n" +
        "          inet addr:127.0.0.1  Mask:255.0.0.0\n" +
        "          UP LOOPBACK RUNNING  MTU:65536  Metric:1\n",
    );
  };

  CMDS.ping = function (args) {
    var f = splitFlags(args);
    var count = 4;
    var ci = f.flags.indexOf("c");
    if (ci !== -1 && f.rest.length && /^\d+$/.test(f.rest[0]))
      count = +f.rest.shift();
    if (f.n != null) count = f.n;
    var host = f.rest[0];
    if (!host) return fail("ping: usage error: Destination address required");
    /* Only the lab network answers; anything else times out. */
    var reachable =
      /^192\.168\.56\./.test(host) ||
      host === "localhost" ||
      host === "127.0.0.1";
    var ip = host === "localhost" ? "127.0.0.1" : host;
    var out = "PING " + host + " (" + ip + ") 56(84) bytes of data.\n";
    if (reachable) {
      for (var i = 1; i <= count; i++) {
        out +=
          "64 bytes from " +
          ip +
          ": icmp_seq=" +
          i +
          " ttl=64 time=0." +
          (2 + i) +
          "1 ms\n";
      }
    }
    out += "\n--- " + host + " ping statistics ---\n";
    out +=
      count +
      " packets transmitted, " +
      (reachable ? count : 0) +
      " received, " +
      (reachable ? 0 : 100) +
      "% packet loss, time " +
      count * 1000 +
      "ms\n";
    return ok(out);
  };

  CMDS.shutdown = function (args) {
    var when = args[0] || "+1";
    var msg = args.slice(1).join(" ");
    sh.halted = true;
    return ok(
      "Shutdown scheduled for " +
        (when === "now" ? "now" : when) +
        ", use 'shutdown -c' to cancel." +
        (msg ? "\nBroadcast message: " + msg : "") +
        "\n",
    );
  };

  CMDS.su = function (args) {
    var f = splitFlags(args);
    var target = f.rest[0] || "root";
    sh.stack.push(sh.user);
    sh.user = target;
    sh.cwd = f.flags.indexOf("l") !== -1 ? homeOf(target) : sh.cwd;
    return ok("");
  };

  CMDS.exit = function () {
    if (sh.stack.length) {
      sh.user = sh.stack.pop();
      return ok("");
    }
    return ok("logout\n");
  };

  CMDS.sudo = function (args, ctx) {
    var user = "root";
    if (args[0] === "-u") {
      args = args.slice(1);
      user = args.shift();
    }
    if (!args.length) return fail("usage: sudo [-u user] command");
    var prev = sh.user;
    sh.user = user;
    var res = dispatch(args[0], args.slice(1), ctx);
    sh.user = prev;
    return res;
  };

  CMDS.passwd = function (args) {
    var f = splitFlags(args);
    var user = f.rest[0] || sh.user;
    if (f.flags.indexOf("S") !== -1) {
      if (user !== sh.user && sh.user !== "root")
        return fail(
          "passwd: You may not view or modify password information for " +
            user +
            ".",
        );
      var row = {
        sysadmin: "sysadmin P 12/20/2025 0 99999 7 -1",
        root: "root L 11/02/2025 0 99999 7 -1",
        daemon: "daemon NP 01/01/2025 0 99999 7 -1",
      }[user];
      if (!row) return fail("passwd: user '" + user + "' does not exist");
      return ok(row + "\n");
    }
    if (user !== sh.user && sh.user !== "root")
      return fail(
        "passwd: You may not view or modify password information for " +
          user +
          ".",
      );
    return ok(
      "Changing password for " +
        user +
        ".\npasswd: password updated successfully\n",
    );
  };

  var PACKAGES = {
    nmap: "The Network Mapper — port scanner and service discovery tool",
    wireshark: "Network traffic analyzer",
    john: "John the Ripper — password cracker",
    hydra: "Very fast network logon cracker",
    tcpdump: "Command-line network traffic capture",
    auditd: "User space tools for security auditing",
    fail2ban: "Ban IPs that cause multiple authentication errors",
  };
  var installed = {};

  CMDS["apt-get"] = function (args) {
    var f = splitFlags(args);
    var sub = f.rest[0];
    var pkg = f.rest[1];
    if (sh.user !== "root" && sub !== "download")
      return fail(
        "E: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)\n" +
          "E: Unable to acquire the dpkg frontend lock, are you root?",
      );
    if (sub === "update")
      return ok(
        "Get:1 http://deb.debian.org/debian bookworm InRelease [151 kB]\n" +
          "Get:2 http://security.debian.org bookworm-security InRelease [48.0 kB]\n" +
          "Fetched 199 kB in 1s (168 kB/s)\n" +
          "Reading package lists... Done\n",
      );
    if (sub === "upgrade")
      return ok(
        "Reading package lists... Done\nBuilding dependency tree... Done\n" +
          "Calculating upgrade... Done\n0 upgraded, 0 newly installed, 0 to remove.\n",
      );
    if (sub === "install") {
      if (!pkg) return fail("apt-get: no package specified");
      if (!PACKAGES[pkg]) return fail("E: Unable to locate package " + pkg);
      installed[pkg] = true;
      return ok(
        "Reading package lists... Done\nBuilding dependency tree... Done\n" +
          "The following NEW packages will be installed:\n  " +
          pkg +
          "\nSetting up " +
          pkg +
          " ...\n",
      );
    }
    if (sub === "remove" || sub === "purge") {
      if (!pkg) return fail("apt-get: no package specified");
      delete installed[pkg];
      return ok(
        "Reading package lists... Done\nThe following packages will be REMOVED:\n  " +
          pkg +
          (sub === "purge" ? "*" : "") +
          "\nRemoving " +
          pkg +
          " ...\n" +
          (sub === "purge"
            ? "Purging configuration files for " + pkg + " ...\n"
            : ""),
      );
    }
    return fail("E: Invalid operation " + (sub || ""));
  };

  CMDS["apt-cache"] = function (args) {
    var f = splitFlags(args);
    if (f.rest[0] !== "search") return fail("apt-cache: unsupported operation");
    var kw = (f.rest[1] || "").toLowerCase();
    var lines = [];
    for (var p in PACKAGES) {
      if (!Object.prototype.hasOwnProperty.call(PACKAGES, p)) continue;
      if (p.indexOf(kw) !== -1 || PACKAGES[p].toLowerCase().indexOf(kw) !== -1)
        lines.push(p + " - " + PACKAGES[p]);
    }
    return ok(lines.length ? lines.join("\n") + "\n" : "");
  };

  CMDS.dpkg = function (args) {
    var f = splitFlags(args);
    if (f.flags.indexOf("l") === -1) return fail("dpkg: unsupported operation");
    var lines = [
      "Desired=Unknown/Install/Remove/Purge/Hold",
      "| Status=Not/Inst/Conf-files/Unpacked/halF-conf/Half-inst",
      "||/ Name           Version      Description",
      "+++-==============-============-=================================",
    ];
    var any = false;
    for (var p in installed) {
      if (!Object.prototype.hasOwnProperty.call(installed, p)) continue;
      any = true;
      lines.push("ii  " + padR(p, 15) + padR("1.0-1", 13) + PACKAGES[p]);
    }
    if (!any)
      lines.push("ii  bash           5.2.15-2     GNU Bourne Again SHell");
    return ok(lines.join("\n") + "\n");
  };

  CMDS.clear = function () {
    return { out: "", err: "", code: 0, clear: true };
  };

  CMDS.reset = function () {
    return { out: "", err: "", code: 0, resetFs: true };
  };

  CMDS.help = function () {
    return ok(
      "Simulated shell — supported commands:\n\n" +
        "  Navigation   ls  pwd  cd\n" +
        "  Viewing      cat  head  tail  grep\n" +
        "  Files        cp  mv  rm  mkdir  touch  dd  echo\n" +
        "  Permissions  chmod  chown  su  sudo  exit  whoami\n" +
        "  System       ps  ifconfig  ping  shutdown  passwd\n" +
        "  Packages     apt-get  apt-cache  dpkg\n" +
        "  Shell        |  >  >>   clear  reset  help\n\n" +
        "Type `reset` to restore the filesystem to its starting state.\n",
    );
  };

  /* ════════════════════════════════════════
     PARSER + RUNNER
  ════════════════════════════════════════ */
  function tokenize(line) {
    var toks = [];
    var cur = "";
    var quote = null;
    var had = false;
    for (var i = 0; i < line.length; i++) {
      var c = line.charAt(i);
      if (quote) {
        if (c === quote) {
          quote = null;
          had = true;
        } else cur += c;
        continue;
      }
      if (c === '"' || c === "'") {
        quote = c;
        had = true;
        continue;
      }
      if (c === " " || c === "\t") {
        if (cur !== "" || had) {
          toks.push(cur);
          cur = "";
          had = false;
        }
        continue;
      }
      if (c === "|" || c === ">") {
        if (cur !== "" || had) {
          toks.push(cur);
          cur = "";
          had = false;
        }
        if (c === ">" && line.charAt(i + 1) === ">") {
          toks.push(">>");
          i++;
        } else toks.push(c);
        continue;
      }
      cur += c;
    }
    if (cur !== "" || had) toks.push(cur);
    return toks;
  }

  function dispatch(name, args, ctx) {
    var fn = CMDS[name];
    if (!fn) {
      if (name.indexOf("./") === 0 || name.charAt(0) === "/")
        return execFile(name);
      return fail(name + ": command not found", 127);
    }
    return fn(args, ctx || { stdin: "" });
  }

  function execFile(path) {
    var node = deref(lookup(path));
    if (!node)
      return fail("bash: " + path + ": No such file or directory", 127);
    if (node.type === "d")
      return fail("bash: " + path + ": Is a directory", 126);
    if (!can(node, "x"))
      return fail("bash: " + path + ": Permission denied", 126);
    /* Just enough of a shell to run the echo lines in hello.sh */
    var out = "";
    var lines = (node.content || "").split("\n");
    for (var i = 0; i < lines.length; i++) {
      var m = /^\s*echo\s+(.*)$/.exec(lines[i]);
      if (m) out += tokenize(m[1]).join(" ") + "\n";
    }
    return ok(out);
  }

  /* Run one full command line: pipeline segments plus optional redirection. */
  function run(line) {
    line = String(line == null ? "" : line).trim();
    if (!line) return { out: "", err: "", code: 0 };

    var toks = tokenize(line);
    var redirect = null;
    var redirectAppend = false;
    for (var i = 0; i < toks.length; i++) {
      if (toks[i] === ">" || toks[i] === ">>") {
        redirectAppend = toks[i] === ">>";
        redirect = toks[i + 1];
        toks = toks.slice(0, i);
        break;
      }
    }

    var segments = [[]];
    for (var j = 0; j < toks.length; j++) {
      if (toks[j] === "|") segments.push([]);
      else segments[segments.length - 1].push(toks[j]);
    }

    var stdin = "";
    var res = { out: "", err: "", code: 0 };
    var errAcc = [];
    var meta = {};
    for (var s = 0; s < segments.length; s++) {
      var seg = segments[s];
      if (!seg.length) continue;
      res = dispatch(seg[0], seg.slice(1), { stdin: stdin });
      if (res.clear) meta.clear = true;
      if (res.resetFs) meta.resetFs = true;
      if (res.err) errAcc.push(res.err);
      stdin = res.out || "";
    }

    var out = stdin;
    if (redirect) {
      var target = absPath(redirect);
      var parent = parentOf(target);
      if (!parent || parent.type !== "d") {
        errAcc.push("bash: " + redirect + ": No such file or directory");
      } else if (!can(parent, "w")) {
        errAcc.push("bash: " + redirect + ": Permission denied");
      } else {
        var existing = lookup(target);
        if (existing && existing.type === "f") {
          if (!can(existing, "w")) {
            errAcc.push("bash: " + redirect + ": Permission denied");
          } else {
            existing.content = redirectAppend
              ? (existing.content || "") + out
              : out;
            existing.size = null;
            existing.mtime = tick();
          }
        } else {
          parent.children[baseName(target)] = file(
            out,
            "rw-r--r--",
            sh.user,
            sh.user,
            tick(),
          );
        }
        out = "";
      }
    }

    return {
      out: out,
      err: errAcc.join("\n"),
      code: res.code || 0,
      clear: meta.clear,
      resetFs: meta.resetFs,
    };
  }

  /* ════════════════════════════════════════
     PUBLIC API (used by the page and by tools/test-linux-sim.js)
  ════════════════════════════════════════ */
  var api = {
    run: run,
    reset: resetFs,
    prompt: function () {
      var where = sh.cwd === homeOf(sh.user) ? "~" : sh.cwd;
      return (
        sh.user + "@" + HOST + ":" + where + (sh.user === "root" ? "#" : "$")
      );
    },
    cwd: function () {
      return sh.cwd;
    },
    user: function () {
      return sh.user;
    },
    lookup: lookup,
    absPath: absPath,
    /* helpers used by challenge setup functions in linux-lessons.js */
    writeFile: function (path, content, mode, owner, group) {
      var abs = absPath(path);
      var parent = parentOf(abs);
      if (!parent) return false;
      parent.children[baseName(abs)] = file(
        content,
        mode || "rw-r--r--",
        owner || "sysadmin",
        group || "sysadmin",
        tick(),
      );
      return true;
    },
    makeDir: function (path, mode, owner, group) {
      var abs = absPath(path);
      var parent = parentOf(abs);
      if (!parent) return false;
      parent.children[baseName(abs)] = dir(
        mode || "rwxr-xr-x",
        owner || "sysadmin",
        group || "sysadmin",
        {},
        tick(),
      );
      return true;
    },
    addProc: function (p) {
      extraProcs.push(p);
    },
    clearProcs: function () {
      extraProcs = [];
    },
    _internals: { breToJs: breToJs, applyChmod: applyChmod, stamp: stamp },
  };

  resetFs();
  window.LinuxSim = api;

  /* ════════════════════════════════════════
     TERMINAL WIDGET
  ════════════════════════════════════════ */
  function Terminal(host, onRan) {
    var self = this;
    this.host = host;
    this.onRan = onRan;
    this.history = [];
    this.hpos = 0;
    this.last = null;

    host.innerHTML = "";
    host.className = "term";
    this.out = el("div", "term-out");
    var row = el("div", "term-inputrow");
    this.ps1 = el("span", "term-ps1");
    this.input = document.createElement("input");
    this.input.className = "term-input";
    this.input.type = "text";
    this.input.autocomplete = "off";
    this.input.spellcheck = false;
    this.input.setAttribute("aria-label", "Terminal command input");
    row.appendChild(this.ps1);
    row.appendChild(this.input);
    host.appendChild(this.out);
    host.appendChild(row);

    this.input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") {
        ev.preventDefault();
        self.submit(self.input.value);
        self.input.value = "";
        return;
      }
      if (ev.key === "ArrowUp") {
        ev.preventDefault();
        if (self.hpos > 0) self.input.value = self.history[--self.hpos] || "";
        return;
      }
      if (ev.key === "ArrowDown") {
        ev.preventDefault();
        if (self.hpos < self.history.length - 1)
          self.input.value = self.history[++self.hpos] || "";
        else {
          self.hpos = self.history.length;
          self.input.value = "";
        }
        return;
      }
      if (ev.key === "l" && ev.ctrlKey) {
        ev.preventDefault();
        self.clear();
      }
    });
    host.addEventListener("click", function (ev) {
      if (window.getSelection && String(window.getSelection())) return;
      if (ev.target.tagName !== "A") self.input.focus();
    });

    this.refresh();
  }

  Terminal.prototype.refresh = function () {
    this.ps1.textContent = api.prompt() + " ";
  };
  Terminal.prototype.clear = function () {
    this.out.innerHTML = "";
  };
  Terminal.prototype.write = function (text, cls) {
    if (text == null || text === "") return;
    var line = el("pre", "term-line" + (cls ? " " + cls : ""));
    line.textContent = text.replace(/\n$/, "");
    this.out.appendChild(line);
  };
  Terminal.prototype.echoCmd = function (cmd) {
    var line = el("pre", "term-line term-cmd");
    line.textContent = api.prompt() + " " + cmd;
    this.out.appendChild(line);
  };
  Terminal.prototype.submit = function (cmd) {
    cmd = String(cmd == null ? "" : cmd);
    this.echoCmd(cmd);
    if (cmd.trim()) {
      this.history.push(cmd);
      this.hpos = this.history.length;
    }
    var res = api.run(cmd);
    if (res.resetFs) {
      api.reset(this.overlay);
      this.clear();
      this.write("Filesystem restored to its starting state.", "term-note");
    } else if (res.clear) {
      this.clear();
    } else {
      this.write(res.out);
      this.write(res.err, "term-err");
    }
    this.last = {
      cmd: cmd,
      out: res.out || "",
      err: res.err || "",
      code: res.code,
    };
    this.refresh();
    this.host.scrollTop = this.host.scrollHeight;
    if (this.onRan) this.onRan(this.last);
  };
  Terminal.prototype.focus = function () {
    this.input.focus();
  };

  window.LinuxSim.Terminal = Terminal;

  /* ════════════════════════════════════════
     PAGE CONTROLLER
     Only runs when the Linux Lab page is present; the test harness loads
     this file without the page and stops here.
  ════════════════════════════════════════ */
  if (!$("termHost")) return;

  var LESSONS = (window.LINUX_LESSONS && window.LINUX_LESSONS.lessons) || [];
  var CHALLENGES =
    (window.LINUX_LESSONS && window.LINUX_LESSONS.challenges) || [];

  var STORE = "sp_linux_progress";
  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORE) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function saveProgress(p) {
    try {
      localStorage.setItem(STORE, JSON.stringify(p));
    } catch (e) {
      /* private browsing / quota — progress just won't persist */
    }
  }
  var progress = loadProgress();

  var termHost = $("termHost");
  var sidePanel = $("sidePanel");
  var briefPanel = $("lessonBrief");
  var labGrid = $("labGrid");
  var term = null;
  var active = null; /* {kind:"lesson"|"challenge", def, step} */

  function markDone(kind, id, step) {
    var key = kind + ":" + id;
    if (!progress[key]) progress[key] = { steps: [] };
    if (progress[key].steps.indexOf(step) === -1)
      progress[key].steps.push(step);
    saveProgress(progress);
  }
  function isDone(kind, id, total) {
    var key = kind + ":" + id;
    return progress[key] && progress[key].steps.length >= total;
  }
  function stepsDone(kind, id) {
    var key = kind + ":" + id;
    return progress[key] ? progress[key].steps.length : 0;
  }

  /* ── validators ─────────────────────────── */
  function checkStep(step, last) {
    if (!last) return false;
    if (step.expectCmd) {
      var re = new RegExp(step.expectCmd);
      if (!re.test(last.cmd.trim())) return false;
    }
    /* multiline so ^ and $ anchor per output line, which is what a step
       like "^47$" means when the command printed a single count */
    if (step.expectOutput) {
      var ro = new RegExp(step.expectOutput, "m");
      if (!ro.test(last.out)) return false;
    }
    if (step.refuteOutput) {
      var rr = new RegExp(step.refuteOutput, "m");
      if (rr.test(last.out)) return false;
    }
    if (step.expectFs && !step.expectFs(api)) return false;
    if (step.expectNoError && last.err) return false;
    return true;
  }

  /* ── side panel rendering ───────────────── */
  function renderIndex(kind) {
    var defs = kind === "lesson" ? LESSONS : CHALLENGES;
    sidePanel.innerHTML = "";
    var head = el("div", "side-head");
    head.appendChild(
      el("h2", null, kind === "lesson" ? "Guided lessons" : "SEC+ challenges"),
    );
    head.appendChild(
      el(
        "p",
        "muted",
        kind === "lesson"
          ? "Work top to bottom. Each task checks the real filesystem, not just what you typed."
          : "Scenarios pulled from the SEC+ domain mapping. No hints unless you ask for one.",
      ),
    );
    sidePanel.appendChild(head);

    var list = el("div", "side-list");
    defs.forEach(function (def, i) {
      var done = isDone(kind, def.id, def.steps.length);
      var item = el("button", "side-item" + (done ? " done" : ""));
      item.type = "button";
      var n = stepsDone(kind, def.id);
      item.innerHTML =
        '<span class="side-num">' +
        (done ? "✓" : i + 1) +
        "</span>" +
        '<span class="side-body"><b>' +
        esc(def.title) +
        "</b>" +
        "<small>" +
        esc(def.blurb || "") +
        "</small>" +
        (def.domain
          ? '<em class="side-dom">Domain ' + esc(def.domain) + "</em>"
          : "") +
        "</span>" +
        '<span class="side-prog">' +
        n +
        "/" +
        def.steps.length +
        "</span>";
      item.addEventListener("click", function () {
        /* Lessons open on their reading page first; challenges go straight
           to the terminal, since working out the approach is the exercise. */
        if (kind === "lesson" && def.teach) openBrief(kind, def);
        else openDef(kind, def);
      });
      list.appendChild(item);
    });
    sidePanel.appendChild(list);
  }

  /* ── the lesson brief: read this before touching the terminal ── */
  function showBrief(on) {
    briefPanel.hidden = !on;
    labGrid.hidden = on;
  }

  function openBrief(kind, def, resuming) {
    briefPanel.innerHTML = "";

    var back = el(
      "button",
      "side-back",
      "← All " + (kind === "lesson" ? "lessons" : "challenges"),
    );
    back.type = "button";
    back.addEventListener("click", function () {
      active = null;
      showBrief(false);
      renderIndex(mode);
    });
    briefPanel.appendChild(back);

    var head = el("header", "brief-head");
    head.appendChild(
      el(
        "div",
        "brief-eyebrow",
        "Lesson " + (LESSONS.indexOf(def) + 1) + " of " + LESSONS.length,
      ),
    );
    head.appendChild(el("h2", null, esc(def.title)));
    if (def.blurb) head.appendChild(el("p", "brief-sub", esc(def.blurb)));
    briefPanel.appendChild(head);

    var body = el("div", "brief-body", def.teach || "");
    briefPanel.appendChild(body);

    if (def.note) {
      var note = el("div", "side-note");
      note.innerHTML = "<strong>Note correction</strong>" + def.note;
      briefPanel.appendChild(note);
    }

    /* what they are about to be asked to do */
    var pre = el("div", "brief-tasks");
    pre.appendChild(el("h3", null, "What you'll do next"));
    var ol = el("ol", null);
    def.steps.forEach(function (s) {
      ol.appendChild(el("li", null, s.task));
    });
    pre.appendChild(ol);
    briefPanel.appendChild(pre);

    var actions = el("div", "brief-actions");
    var next = el(
      "button",
      "btn btn-primary",
      (resuming
        ? "Back to the exercise"
        : "I've read this — start the exercise") + " →",
    );
    next.type = "button";
    next.addEventListener("click", function () {
      showBrief(false);
      if (resuming) {
        renderSteps();
        term.focus();
      } else {
        openDef(kind, def);
      }
    });
    actions.appendChild(next);
    briefPanel.appendChild(actions);

    showBrief(true);
    /* Land at the TOP of the brief — it is a reading page, so start it at the
       beginning. Focus moves to the panel itself (not the Next button at the
       bottom, which would drag the viewport down there) so keyboard and screen
       reader users still follow the new content. preventScroll stops the focus
       call from scrolling on its own before we place the view deliberately. */
    briefPanel.tabIndex = -1;
    try {
      briefPanel.focus({ preventScroll: true });
    } catch (e) {
      briefPanel.focus();
    }
    if (briefPanel.scrollTop) briefPanel.scrollTop = 0;
    briefPanel.scrollIntoView({ block: "start" });
  }

  function openDef(kind, def) {
    active = { kind: kind, def: def, step: 0 };
    /* Start each lesson/challenge from a clean, scenario-specific filesystem.
       api.reset() applies the overlay itself, so setup must not be called
       again here. Clear processes first — a setup may add its own. */
    api.clearProcs();
    api.reset(def.setup);
    if (def.procs) def.procs.forEach(api.addProc);
    term.clear();
    term.overlay = def.setup;
    term.refresh();
    term.write(
      def.intro || "Filesystem prepared. Work through the tasks on the right.",
      "term-note",
    );
    renderSteps();
    term.focus();
  }

  function renderSteps() {
    var def = active.def;
    sidePanel.innerHTML = "";

    var back = el(
      "button",
      "side-back",
      "← All " + (active.kind === "lesson" ? "lessons" : "challenges"),
    );
    back.type = "button";
    back.addEventListener("click", function () {
      active = null;
      showBrief(false);
      renderIndex(mode);
    });
    sidePanel.appendChild(back);

    var head = el("div", "side-head");
    head.appendChild(el("h2", null, esc(def.title)));
    if (def.domain)
      head.appendChild(
        el("div", "side-dom-badge", "SEC+ Domain " + esc(def.domain)),
      );
    /* Lessons carry their teaching on the brief page, reachable again via the
       button below — only challenges keep it inline, since they have no brief. */
    if (active.kind === "lesson") {
      var reread = el("button", "side-reread", "↩ Re-read the lesson");
      reread.type = "button";
      reread.addEventListener("click", function () {
        openBrief(active.kind, def, true);
      });
      head.appendChild(reread);
    } else if (def.teach) {
      head.appendChild(el("div", "side-teach", def.teach));
    }
    sidePanel.appendChild(head);

    if (def.note && active.kind !== "lesson") {
      var note = el("div", "side-note");
      note.innerHTML = "<strong>Note correction</strong>" + def.note;
      sidePanel.appendChild(note);
    }

    var wrap = el("ol", "step-list");
    def.steps.forEach(function (step, i) {
      var done =
        progress[active.kind + ":" + def.id] &&
        progress[active.kind + ":" + def.id].steps.indexOf(i) !== -1;
      var li = el(
        "li",
        "step" + (done ? " done" : "") + (i === active.step ? " current" : ""),
      );
      li.innerHTML = '<div class="step-task">' + step.task + "</div>";
      if (i === active.step && !done) {
        var hintBtn = el("button", "step-hint-btn", "Show hint");
        hintBtn.type = "button";
        var hint = el("div", "step-hint");
        hint.hidden = true;
        hint.innerHTML =
          step.hint ||
          "Re-read the task — the command you need is in the lesson text above.";
        hintBtn.addEventListener("click", function () {
          hint.hidden = !hint.hidden;
          hintBtn.textContent = hint.hidden ? "Show hint" : "Hide hint";
        });
        li.appendChild(hintBtn);
        li.appendChild(hint);
      }
      wrap.appendChild(li);
    });
    sidePanel.appendChild(wrap);

    if (active.step >= def.steps.length) {
      var done2 = el("div", "side-complete");
      done2.innerHTML =
        "<strong>Complete.</strong> " +
        esc(def.outro || "Every task in this section passed.");
      sidePanel.appendChild(done2);
    }
  }

  function onRan(last) {
    if (!active) return;
    var def = active.def;
    if (active.step >= def.steps.length) return;
    var step = def.steps[active.step];
    if (checkStep(step, last)) {
      markDone(active.kind, def.id, active.step);
      active.step++;
      term.write(
        active.step >= def.steps.length
          ? "✓ Task complete — that's the last one in this section."
          : "✓ Task complete.",
        "term-pass",
      );
      renderSteps();
      term.host.scrollTop = term.host.scrollHeight;
    }
  }

  /* ── mode switching ─────────────────────── */
  var mode = "lesson";
  var tabs = [].slice.call(document.querySelectorAll(".mode-tab"));

  function setMode(m) {
    mode = m;
    active = null;
    showBrief(false);
    tabs.forEach(function (t) {
      t.classList.toggle("active", t.dataset.mode === m);
    });
    api.reset();
    api.clearProcs();
    term.overlay = null;
    term.clear();
    term.refresh();
    if (m === "free") {
      sidePanel.innerHTML = "";
      var head = el("div", "side-head");
      head.appendChild(el("h2", null, "Free play"));
      head.appendChild(
        el(
          "p",
          "muted",
          "No goals, nothing graded. The filesystem starts stocked with the files the lessons use — " +
            "type <code>reset</code> to restore it, or <code>help</code> for the command list.",
        ),
      );
      sidePanel.appendChild(head);
      var ref = el("div", "side-ref");
      ref.innerHTML =
        "<h3>Try these</h3>" +
        "<pre>ls -l /var/log\n" +
        "sudo cat /var/log/auth.log | head -5\n" +
        "grep 'r..f' red.txt\n" +
        "grep -c 'Failed password' /var/log/auth.log\n" +
        "chmod u+x hello.sh &amp;&amp; ./hello.sh\n" +
        "ps -ef | grep sshd\n" +
        "echo 'note to self' &gt; todo.txt</pre>";
      sidePanel.appendChild(ref);
      term.write(
        "Free play — simulated Debian shell. Type `help` for the command list.",
        "term-note",
      );
    } else {
      renderIndex(m);
      term.write(
        m === "lesson"
          ? "Pick a lesson on the right to begin."
          : "Pick a challenge on the right to begin.",
        "term-note",
      );
    }
    term.focus();
  }

  term = new Terminal(termHost, onRan);
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      setMode(t.dataset.mode);
    });
  });

  var resetBtn = $("resetAll");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (!window.confirm("Clear all saved Linux Lab progress?")) return;
      progress = {};
      saveProgress(progress);
      setMode(mode);
    });
  }

  setMode("lesson");
})();
