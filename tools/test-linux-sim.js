#!/usr/bin/env node
/*
 * test-linux-sim.js — behavioral tests for the Linux Lab (Webpage/linux-sim.js)
 *
 * Loads linux.html plus linux-lessons.js and linux-sim.js into jsdom and drives
 * the page the way a learner would: clicking a lesson, typing into the terminal,
 * pressing Enter, and watching steps complete.
 *
 * Two halves:
 *   1. Engine tests — paths, ls -l rendering, the BRE/ERE grep distinction,
 *      permissions, pipes and redirection. grep gets the densest coverage
 *      because its regex translation is the highest-risk code in the file and
 *      every example is asserted against the source study notes.
 *   2. A full walkthrough of all 8 lessons and 5 challenges. Every step is
 *      solved in order and must actually advance. This is what catches a
 *      validator that is too strict (unsolvable) or too loose (auto-passing) —
 *      the latter is checked explicitly with a deliberate wrong answer.
 *
 * Requires jsdom, which is not a repo dependency (this is a static site with no
 * build step). Install it wherever you like and point NODE_PATH at it, e.g.
 *
 *   npm install jsdom --prefix /tmp/qa
 *   NODE_PATH=/tmp/qa/node_modules node tools/test-linux-sim.js
 *
 * Exit code is 1 on any failure, so this can gate a commit or CI.
 */

"use strict";
const fs = require("fs");
const path = require("path");

let JSDOM;
try {
  ({ JSDOM } = require("jsdom"));
} catch (e) {
  console.error(
    "jsdom not found. Install it and re-run, e.g.\n" +
      "  npm install jsdom --prefix /tmp/qa\n" +
      "  NODE_PATH=/tmp/qa/node_modules node tools/test-linux-sim.js",
  );
  process.exit(2);
}

const WEB = path.join(__dirname, "..", "Webpage");
const read = (f) => fs.readFileSync(path.join(WEB, f), "utf8");

/* A page with the real lesson data and engine loaded. `url` is set so that
   jsdom provides localStorage, which the progress tracker uses. */
function page() {
  const dom = new JSDOM(read("linux.html"), {
    runScripts: "outside-only",
    pretendToBeVisual: true,
    url: "https://localhost/linux.html",
  });
  const w = dom.window;
  /* jsdom has no layout, so scrollIntoView is missing; the brief page and the
     terminal both call it. Stub it rather than letting an unrelated TypeError
     spam the output. Same quirk as tools/test-quiz.js. */
  w.Element.prototype.scrollIntoView = function () {};
  w.eval(read("linux-lessons.js"));
  w.eval(read("linux-sim.js"));
  return w;
}

let pass = 0,
  fail = 0;
function check(name, cond, extra) {
  if (cond) {
    pass++;
    console.log("  PASS " + name);
  } else {
    fail++;
    console.log("  FAIL " + name + (extra ? " :: " + extra : ""));
  }
}
function eq(name, got, want) {
  check(
    name,
    String(got) === String(want),
    "want " + JSON.stringify(want) + ", got " + JSON.stringify(got),
  );
}

const w = page();
const L = w.LinuxSim;
const out = (c) => L.run(c).out;
const err = (c) => L.run(c).err;

/* ════ 1. path resolution ════ */
console.log("\n[1] Path resolution");
eq("pwd starts at home", out("pwd"), "/home/sysadmin\n");
L.run("cd /home/sysadmin/School/Art");
eq("absolute cd", L.cwd(), "/home/sysadmin/School/Art");
L.run("cd ..");
eq("cd .. goes up one", L.cwd(), "/home/sysadmin/School");
L.run("cd ../Documents");
eq("relative cd with ..", L.cwd(), "/home/sysadmin/Documents");
L.run("cd ~");
eq("cd ~ returns home", L.cwd(), "/home/sysadmin");
L.run("cd /");
eq("cd / reaches root", L.cwd(), "/");
L.run("cd ~");
check(
  "cd into a file is rejected",
  /Not a directory/.test(err("cd alpha.txt")),
);
check(
  "cd to a missing path is rejected",
  /No such file/.test(err("cd nowhere")),
);
eq("cwd unchanged after failed cd", L.cwd(), "/home/sysadmin");

/* ════ 2. ls -l rendering ════ */
console.log("\n[2] ls -l rendering");
const varlog = out("ls -l /var/log");
check(
  "bootstrap.log row matches the source notes byte for byte",
  /-rw-r----- +1 syslog adm +19573 Dec  7  2017 bootstrap\.log/.test(varlog),
  JSON.stringify(varlog),
);
check("old files show a year, not a time", /Dec  7  2017/.test(varlog));
check("recent files show HH:MM", /Jul 15 10:18/.test(varlog));
check(
  "symlinks render an arrow to the target",
  /notes -> \/home\/sysadmin\/Documents\/notes\.txt/.test(out("ls -l")),
);
const dev = out("ls -l /dev");
check("character device type is c", /^c/m.test(dev));
check("block device type is b", /^b/m.test(dev));
check("socket type is s", /^s/m.test(dev));
check("pipe type is p", /^p/m.test(dev));
check("directory type is d", /^d/m.test(out("ls -l")));
check("dotfiles hidden by default", !/\.bashrc/.test(out("ls")));
check("ls -a reveals dotfiles", /\.bashrc/.test(out("ls -a")));
eq("ls -r reverses", out("ls -r").trim().split(/\s+/)[0], "red.txt");

/* ════ 3. grep — every example from the source study notes ════ */
console.log("\n[3] grep (BRE/ERE) — asserted against the source notes");
eq(
  "grep 'r$' finds lines ending in r",
  out("grep 'r$' alpha-first.txt"),
  "B is for Bear\nF is for Flower\n",
);
check(
  "grep 'root' /etc/passwd",
  /^root:x:0:0:root/.test(out("grep 'root' /etc/passwd")),
);
eq(
  "grep 'r..f' — dot is exactly one char",
  out("grep 'r..f' red.txt"),
  "reef\nroof\n",
);
eq(
  "grep '[0-9]' matches digits",
  out("grep '[0-9]' profile.txt"),
  "I am 37 years old.\n3121991\n",
);
eq(
  "grep '[^0-9]' correctly EXCLUDES the all-digit line (the notes list it in error)",
  out("grep '[^0-9]' profile.txt"),
  "I am 37 years old.\nName: sysadmin\n",
);
eq(
  "grep 're*d' — zero or more, so rd matches",
  out("grep 're*d' red.txt"),
  "red\nreed\nreeed\nrd\n",
);
eq(
  "grep 'ee*' — one or more, so rd does not",
  out("grep 'ee*' red.txt"),
  "red\nreed\nreeed\nreef\nreel\nread\n",
);
eq("BRE: + is a literal plus, not a quantifier", out("grep 'e+' red.txt"), "");
eq("ERE: -E makes + a quantifier", out("grep -E 'e+f' red.txt"), "reef\n");
eq("ERE: | is alternation", out("grep -E 'roof|reel' red.txt"), "reel\nroof\n");
eq(
  "ERE: ? makes the previous pattern optional",
  out("grep -E '^re?d$' red.txt"),
  "red\nrd\n",
);
eq("BRE: ^ is literal unless first", out("grep 'a^b' red.txt"), "");
eq("BRE: $ is literal unless last", out("grep 'a$b' red.txt"), "");
eq("grep -c counts instead of printing", out("grep -c 'e' red.txt"), "6\n");
eq("grep -v inverts", out("grep -v 'e' red.txt"), "rd\nroof\n");
eq("grep -i ignores case", out("grep -i 'RED' red.txt"), "red\n");
check(
  "grep -n prefixes line numbers",
  /^1:red$/m.test(out("grep -n 'red' red.txt")),
);

/* ════ 4. permissions ════ */
console.log("\n[4] Permissions");
check(
  "auth.log is unreadable as sysadmin",
  /Permission denied/.test(err("cat /var/log/auth.log")),
);
check(
  "sudo cat reads it",
  /Failed password/.test(out("sudo cat /var/log/auth.log")),
);
check(
  "./hello.sh denied with no execute bit",
  /Permission denied/.test(err("./hello.sh")),
);
L.run("chmod u+x hello.sh");
eq(
  "chmod u+x sets only the owner bit",
  L.lookup("/home/sysadmin/hello.sh").mode,
  "rwxr--r--",
);
eq("script now runs", out("./hello.sh"), "Hello, World!\n");
L.run("chmod 750 hello.sh");
eq("numeric chmod 750", L.lookup("/home/sysadmin/hello.sh").mode, "rwxr-x---");
L.run("chmod a=r hello.sh");
eq(
  "chmod a=r sets exactly",
  L.lookup("/home/sysadmin/hello.sh").mode,
  "r--r--r--",
);
L.run("chmod u+w,g-r hello.sh");
eq("multi-clause chmod", L.lookup("/home/sysadmin/hello.sh").mode, "rw----r--");
check(
  "chown without root is refused",
  /Operation not permitted/.test(err("chown root alpha.txt")),
);
L.run("sudo chown root:adm alpha.txt");
const alpha = L.lookup("/home/sysadmin/alpha.txt");
eq(
  "sudo chown applies owner:group",
  alpha.owner + ":" + alpha.group,
  "root:adm",
);
eq("whoami", out("whoami"), "sysadmin\n");
L.run("su");
eq("su switches to root", out("whoami"), "root\n");
L.run("exit");
eq("exit returns to sysadmin", out("whoami"), "sysadmin\n");
eq("sudo -u runs as a named user", out("sudo -u root whoami"), "root\n");
eq("sudo does not leak its identity", out("whoami"), "sysadmin\n");

/* ════ 5. pipes and redirection ════ */
console.log("\n[5] Pipes and redirection");
L.reset();
eq("pipe into head", out("cat alpha.txt | head -2"), "alpha\nbravo\n");
eq("pipe into grep", out("cat red.txt | grep 'oo'"), "roof\n");
eq(
  "three-stage pipe",
  out("sudo cat /var/log/auth.log | grep 'Failed' | head -1").trim().slice(-4),
  "ssh2",
);
eq(
  "sudo cat piped into grep -c",
  out("sudo cat /var/log/auth.log | grep -c 'Failed password'"),
  "3\n",
);
L.run("echo 'first' > note.txt");
eq("> writes a file", out("cat note.txt"), "first\n");
L.run("echo 'second' >> note.txt");
eq(">> appends", out("cat note.txt"), "first\nsecond\n");
L.run("echo 'clobber' > note.txt");
eq("> overwrites", out("cat note.txt"), "clobber\n");
eq("a redirected command prints nothing", L.run("echo hi > x.txt").out, "");
check(
  "redirect into an unwritable dir errors",
  /Permission denied|No such file/.test(err("echo hi > /root/x.txt")),
);

/* ════ 6. file operations ════ */
console.log("\n[6] File operations");
L.reset();
L.run("cp /etc/passwd .");
check("cp into . lands in cwd", /^root:x:0:0/.test(out("cat passwd")));
L.run("mkdir -p a/b/c");
eq("mkdir -p builds the chain", L.lookup("/home/sysadmin/a/b/c").type, "d");
check(
  "mkdir without -p on a missing parent fails",
  /No such file/.test(err("mkdir q/r")),
);
L.run("mv numbers.txt letters.txt a");
check(
  "mv moves multiple sources into a dir",
  !!L.lookup("/home/sysadmin/a/numbers.txt") &&
    !!L.lookup("/home/sysadmin/a/letters.txt"),
);
check("mv removed the sources", !L.lookup("/home/sysadmin/numbers.txt"));
L.run("mv passwd passwd.bak");
check(
  "mv renames in place",
  !!L.lookup("/home/sysadmin/passwd.bak") && !L.lookup("/home/sysadmin/passwd"),
);
check("rm on a directory needs -r", /Is a directory/.test(err("rm a")));
L.run("rm -r a");
check("rm -r removes the tree", !L.lookup("/home/sysadmin/a"));
const dd = out("dd if=/dev/zero of=/tmp/swapex bs=1M count=50");
check(
  "dd prints the records summary",
  /50\+0 records in/.test(dd) && /50\+0 records out/.test(dd),
);
eq("dd produces the right size", L.lookup("/tmp/swapex").size, 52428800);

/* ════ 7. system and packages ════ */
console.log("\n[7] System, network, packages");
check("ps -ef lists init", /\/sbin\/init/.test(out("ps -ef")));
check("ps -ef has a PPID column", /PPID/.test(out("ps -ef")));
check("ps -ef | grep sshd", /sshd/.test(out("ps -ef | grep sshd")));
check(
  "ifconfig shows the lab address",
  /192\.168\.56\.102/.test(out("ifconfig")),
);
eq(
  "ping -c 3 sends exactly 3",
  (out("ping -c 3 192.168.56.101").match(/icmp_seq/g) || []).length,
  3,
);
check(
  "unreachable host reports full loss",
  /100% packet loss/.test(out("ping -c 2 10.0.0.99")),
);
eq(
  "passwd -S sysadmin",
  out("passwd -S sysadmin"),
  "sysadmin P 12/20/2025 0 99999 7 -1\n",
);
check(
  "passwd -S root shows a locked password",
  /root L/.test(out("sudo passwd -S root")),
);
check(
  "passwd -S daemon shows NP",
  /daemon NP/.test(out("sudo passwd -S daemon")),
);
check(
  "apt-get without root is refused",
  /Permission denied/.test(err("apt-get update")),
);
check(
  "sudo apt-get update works",
  /Reading package lists/.test(out("sudo apt-get update")),
);
check(
  "apt-cache search finds nmap",
  /nmap/.test(out("apt-cache search scanner")),
);
check(
  "apt-get install nmap",
  /Setting up nmap/.test(out("sudo apt-get install nmap")),
);
check("dpkg -l lists it", /nmap/.test(out("dpkg -l")));
check(
  "unknown command reports not found",
  /command not found/.test(err("frobnicate")),
);

/* ════════════════════════════════════════════════
   8. FULL WALKTHROUGH — every lesson and challenge
   Solutions are the commands a learner would type.
════════════════════════════════════════════════ */
const SOLUTIONS = {
  "lesson:nav": [
    "pwd",
    "ls",
    "ls -r",
    "cd Documents",
    "cd ..",
    "cd /home/sysadmin/School/Art",
    "cd ~",
  ],
  "lesson:listing": [
    "ls -l",
    "ls -la",
    "ls -l /var/log",
    "ls -l ~",
    "ls -l /dev",
    "ls -lS",
    "ls -ltr",
  ],
  "lesson:perms": [
    "whoami",
    "cat /var/log/auth.log",
    "ls -l /var/log/auth.log",
    "sudo cat /var/log/auth.log",
    "./hello.sh",
    "chmod u+x hello.sh",
    "./hello.sh",
    "chmod 755 hello.sh",
    "chown root alpha.txt",
    "sudo chown root alpha.txt",
  ],
  "lesson:viewing": [
    "cat numbers.txt",
    "head -3 alpha.txt",
    "tail -2 alpha.txt",
    "sudo head -5 /var/log/auth.log",
  ],
  "lesson:grep": [
    "grep 'r$' alpha-first.txt",
    "grep 'root' /etc/passwd",
    "grep 'r..f' red.txt",
    "grep '[0-9]' profile.txt",
    "grep '[^0-9]' profile.txt",
    "grep 're*d' red.txt",
    "grep 'ee*' red.txt",
    "grep -E 'e+' red.txt",
    "sudo grep -c 'Failed password' /var/log/auth.log",
  ],
  "lesson:fileops": [
    "cp /etc/passwd .",
    "mkdir backup",
    "mv numbers.txt letters.txt backup",
    "mv passwd passwd.bak",
    "rm backup",
    "rm -r backup",
    "dd if=/dev/zero of=/tmp/swapex bs=1M count=50",
  ],
  "lesson:system": [
    "ps",
    "ps -ef",
    "ps -ef | grep sshd",
    "ifconfig",
    "ping -c 4 192.168.56.101",
    "shutdown now Goodbye World!",
  ],
  "lesson:pkgacct": [
    "sudo apt-get update",
    "apt-cache search scanner",
    "sudo apt-get install nmap",
    "passwd -S sysadmin",
    "sudo passwd -S root",
    "echo 'audit start' > audit.txt",
    "echo 'checked accounts' >> audit.txt",
    "cat audit.txt",
  ],
  "challenge:bruteforce": [
    "sudo head -5 /var/log/auth.log",
    "sudo grep 'Failed password' /var/log/auth.log",
    "sudo grep -c 'Failed password' /var/log/auth.log",
    "sudo grep 'Accepted' /var/log/auth.log",
    "sudo grep -c '192.168.56.101' /var/log/auth.log",
  ],
  "challenge:leastpriv": [
    "ls -l /opt/app",
    "chmod 600 /opt/app/config.ini",
    "chmod 750 /opt/app/run.sh",
    "chmod go-w /opt/app",
    "sudo chown root /opt/app/config.ini",
  ],
  "challenge:rogueproc": [
    "ps -ef",
    "ps -ef | grep tmp",
    "ps -ef | grep 705",
    "cat /tmp/.update",
    "cat /var/spool/cron-sysadmin",
    "rm /tmp/.update",
  ],
  "challenge:recon": [
    "ls",
    "ls -la",
    "cat .hidden_harvest",
    "cat .ssh_backdoor",
    "grep 'bash' /etc/passwd",
    "rm .hidden_harvest .ssh_backdoor",
  ],
  "challenge:audit": [
    "sudo ls -l /srv/finance",
    "sudo chmod go-w /srv/finance/ledger.csv",
    "passwd -S sysadmin",
    "sudo passwd -S daemon",
    "passwd -S sysadmin > ~/audit-evidence.txt",
    "grep bash /etc/passwd >> ~/audit-evidence.txt",
  ],
};

function type(win, cmd) {
  const input = win.document.querySelector(".term-input");
  input.value = cmd;
  input.dispatchEvent(
    new win.KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    }),
  );
}
function tabFor(win, mode) {
  return [].slice
    .call(win.document.querySelectorAll(".mode-tab"))
    .filter((t) => t.dataset.mode === mode)[0];
}
function doneCount(win) {
  return win.document.querySelectorAll(".step.done").length;
}

/* Drive one lesson/challenge to completion through the real UI.
   Lessons open on their reading page first, so the brief's Next button has to
   be clicked before the terminal is reachable. */
function walk(win, mode, index, key, def) {
  tabFor(win, mode).click();
  const items = win.document.querySelectorAll(".side-item");
  items[index].click();

  if (mode === "lesson") {
    const brief = win.document.getElementById("lessonBrief");
    check(key + " opens its reading page first", !brief.hidden);
    check(
      key + " hides the terminal until the brief is read",
      win.document.getElementById("labGrid").hidden,
    );
    const next = brief.querySelector(".brief-actions .btn-primary");
    if (!next) {
      check(key + " brief has a Next button", false);
      return;
    }
    next.click();
    check(
      key + " Next reveals the terminal",
      !win.document.getElementById("labGrid").hidden,
    );
  }

  const sols = SOLUTIONS[key];
  if (!sols) {
    check(key + " has a solution script", false, "no SOLUTIONS entry");
    return;
  }
  if (sols.length !== def.steps.length) {
    check(
      key + " solution length matches step count",
      false,
      "steps=" + def.steps.length + " solutions=" + sols.length,
    );
    return;
  }

  let advanced = 0;
  for (let i = 0; i < sols.length; i++) {
    const before = doneCount(win);
    type(win, sols[i]);
    const after = doneCount(win);
    if (after > before) advanced++;
    else {
      check(
        key + " step " + (i + 1) + " advances on: " + sols[i],
        false,
        "step did not complete — task: " +
          def.steps[i].task.replace(/<[^>]*>/g, ""),
      );
    }
  }
  check(
    key + " completes all " + def.steps.length + " steps",
    advanced === sols.length,
    advanced + "/" + sols.length,
  );
}

console.log("\n[8] Lesson walkthrough — every step solved in order");
{
  const win = page();
  const defs = win.LINUX_LESSONS.lessons;
  eq("8 lessons are defined", defs.length, 8);
  defs.forEach((def, i) => walk(win, "lesson", i, "lesson:" + def.id, def));
}

console.log("\n[9] Challenge walkthrough — every step solved in order");
{
  const win = page();
  const defs = win.LINUX_LESSONS.challenges;
  eq("5 challenges are defined", defs.length, 5);
  defs.forEach((def, i) =>
    walk(win, "challenge", i, "challenge:" + def.id, def),
  );
}

/* ════ 9b. the lesson brief gate ════ */
console.log("\n[9b] Lesson brief gates the exercise");
{
  const win = page();
  const brief = win.document.getElementById("lessonBrief");
  const grid = win.document.getElementById("labGrid");
  const defs = win.LINUX_LESSONS.lessons;

  tabFor(win, "lesson").click();
  check("brief hidden on the lesson index", brief.hidden);
  check("terminal visible on the lesson index", !grid.hidden);

  win.document.querySelectorAll(".side-item")[0].click();
  check("clicking a lesson opens the brief", !brief.hidden);
  check("terminal is hidden behind the brief", grid.hidden);
  /* Regression: focusing the Next button dragged the viewport to the bottom of
     the reading page, so the user started at the end of it. */
  check(
    "brief does NOT focus the bottom Next button",
    win.document.activeElement !==
      brief.querySelector(".brief-actions .btn-primary"),
    "activeElement is " + (win.document.activeElement || {}).className,
  );
  check(
    "focus moves to the brief container instead",
    win.document.activeElement === brief,
  );
  eq("brief is scrolled to its top", brief.scrollTop, 0);
  check("brief renders the lesson title", /Navigation/.test(brief.textContent));
  check("brief shows lesson position", /Lesson 1 of 8/.test(brief.textContent));
  check(
    "brief previews the upcoming tasks",
    /What you'll do next/.test(brief.textContent),
  );
  eq(
    "brief lists every upcoming task",
    brief.querySelectorAll(".brief-tasks li").length,
    defs[0].steps.length,
  );

  defs.forEach((d, i) => {
    check(
      "lesson " + (i + 1) + " (" + d.id + ") has substantial reading content",
      (d.teach || "").length > 2000,
      (d.teach || "").length + " chars",
    );
    check(
      "lesson " + (i + 1) + " brief is sectioned with headings",
      ((d.teach || "").match(/<h3>/g) || []).length >= 4,
    );
  });

  brief.querySelector(".side-back").click();
  check("Back returns to the index and hides the brief", brief.hidden);

  /* note corrections belong on the brief, not duplicated in the sidebar */
  const withNote = defs.filter((d) => d.note);
  check(
    "several lessons carry note corrections",
    withNote.length >= 3,
    withNote.length + " lessons",
  );
  win.document
    .querySelectorAll(".side-item")
    [defs.indexOf(withNote[0])].click();
  check(
    "note correction renders on the brief",
    /Note correction/.test(brief.textContent),
  );
  brief.querySelector(".brief-actions .btn-primary").click();
  check("Next reveals the terminal", !grid.hidden);
  check(
    "note correction is not duplicated in the sidebar",
    !/Note correction/.test(
      win.document.getElementById("sidePanel").textContent,
    ),
  );
  check(
    "sidebar offers a re-read button",
    !!win.document.querySelector(".side-reread"),
  );
  win.document.querySelector(".side-reread").click();
  check("re-read reopens the brief", !brief.hidden);
  check(
    "re-read wording differs on return",
    /Back to the exercise/.test(brief.textContent),
  );
  brief.querySelector(".brief-actions .btn-primary").click();
  check("returning from a re-read restores the terminal", !grid.hidden);
}

/* ════ 9c. challenges are not gated ════ */
console.log("\n[9c] Challenges skip the brief");
{
  const win = page();
  tabFor(win, "challenge").click();
  win.document.querySelectorAll(".side-item")[0].click();
  check(
    "challenge opens straight to the terminal",
    !win.document.getElementById("labGrid").hidden,
  );
  check(
    "no brief for a challenge",
    win.document.getElementById("lessonBrief").hidden,
  );
  check(
    "challenge keeps its teaching inline in the sidebar",
    /side-teach/.test(win.document.getElementById("sidePanel").innerHTML),
  );
}

/* ════ 10. validators actually reject ════ */
console.log("\n[10] Validators reject wrong answers");
{
  const win = page();
  tabFor(win, "lesson").click();
  win.document
    .querySelectorAll(".side-item")[0]
    .click(); /* Navigation & Paths */
  win.document
    .getElementById("lessonBrief")
    .querySelector(".brief-actions .btn-primary")
    .click();
  const before = doneCount(win);
  type(win, "ls -l");
  eq(
    "a wrong command does not complete step 1 (which wants pwd)",
    doneCount(win),
    before,
  );
  type(win, "echo pwd");
  eq("a near-miss does not complete it either", doneCount(win), before);
  type(win, "pwd");
  eq("the right command does", doneCount(win), before + 1);
}

/* ════ 11. progress persistence ════ */
console.log("\n[11] Progress persistence");
{
  const win = page();
  tabFor(win, "lesson").click();
  win.document.querySelectorAll(".side-item")[0].click();
  win.document
    .getElementById("lessonBrief")
    .querySelector(".brief-actions .btn-primary")
    .click();
  type(win, "pwd");
  const raw = win.localStorage.getItem("sp_linux_progress");
  check(
    "progress is written to localStorage",
    !!raw && /lesson:nav/.test(raw),
    String(raw),
  );
  check(
    "progress uses the sp_ namespace",
    Object.keys(win.localStorage).every((k) => k.indexOf("sp_") === 0),
  );
}

/* ════ 12. free play ════ */
console.log("\n[12] Free play mode");
{
  const win = page();
  tabFor(win, "free").click();
  type(win, "pwd");
  const text = win.document.querySelector(".term-out").textContent;
  check("free play echoes the command", /pwd/.test(text));
  check("free play prints the result", /\/home\/sysadmin/.test(text));
  type(win, "touch scratch.txt");
  check(
    "filesystem is writable in free play",
    !!win.LinuxSim.lookup("/home/sysadmin/scratch.txt"),
  );
  type(win, "reset");
  check(
    "reset restores the filesystem",
    !win.LinuxSim.lookup("/home/sysadmin/scratch.txt"),
  );
}

console.log("\n=== " + pass + " passed, " + fail + " failed ===");
process.exit(fail ? 1 : 0);
