#!/usr/bin/env node
/*
 * test-quiz.js — behavioral tests for the practice engine (Webpage/quiz.js)
 *
 * Loads practice.html plus the real data + quiz scripts into jsdom and drives
 * the UI the way a learner would: clicking options, submitting, pressing keys.
 * This catches the class of bug that unit-testing the data cannot — where the
 * question bank is fine but the UI mishandles it.
 *
 * Covers:
 *   - multi-select questions honor their own answer count (2 vs 3), which was
 *     broken until 2026-07-24: the UI hardcoded 2, making all 20 "Choose THREE"
 *     questions impossible to answer correctly
 *   - single-answer grading still works
 *   - keyboard shortcuts (A-E / 1-5 / Enter) and their guards
 *
 * Requires jsdom, which is not a repo dependency (this is a static site with no
 * build step). Install it wherever you like and point NODE_PATH at it, e.g.
 *
 *   npm install jsdom --prefix /tmp/qa
 *   NODE_PATH=/tmp/qa/node_modules node tools/test-quiz.js
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
      "  NODE_PATH=/tmp/qa/node_modules node tools/test-quiz.js",
  );
  process.exit(2);
}

const WEB = path.join(__dirname, "..", "Webpage");
const read = (f) => fs.readFileSync(path.join(WEB, f), "utf8");
const HTML = read("practice.html");
const DATA = ["questions-v2.js", "pbq.js", "pbq2.js"];

/* Build a page whose question bank is exactly `bank`, so a test can target one
   question shape deterministically instead of hoping the shuffle cooperates. */
function page(bank) {
  const dom = new JSDOM(HTML, {
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  const w = dom.window;
  DATA.forEach((f) => w.eval(read(f)));
  const full = w.QUESTION_BANK;
  w.QUESTION_BANK = typeof bank === "function" ? bank(full) : bank;
  /* jsdom has no layout, so scrollIntoView is missing; the results screen calls
     it. Stub it rather than letting an unrelated TypeError muddy the output. */
  w.Element.prototype.scrollIntoView = function () {};
  w.eval(read("quiz.js"));
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
const keyOn = (w, k, target) =>
  (target || w.document.body).dispatchEvent(
    new w.KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }),
  );

/* ── find representative questions in the real bank ── */
const probe = page((b) => b);
const BANK = probe.QUESTION_BANK;
const threeQ = BANK.find((q) => q.type === "multi" && q.correct.length === 3);
const twoQ = BANK.find((q) => q.type === "multi" && q.correct.length === 2);
const singleQ = BANK.find((q) => q.type !== "multi");

console.log("Bank: " + BANK.length + " questions");
console.log(
  "  multi wanting 3: " +
    BANK.filter((q) => q.type === "multi" && q.correct.length === 3).length +
    " · multi wanting 2: " +
    BANK.filter((q) => q.type === "multi" && q.correct.length === 2).length,
);
if (!threeQ || !twoQ || !singleQ) {
  console.error("Bank lacks one of the shapes under test — aborting.");
  process.exit(2);
}

/* ════ 1. a "Choose THREE" question is answerable ════ */
console.log('\n[1] Multi-select honors its own count ("Choose THREE")');
{
  const w = page([threeQ]);
  const d = w.document;
  d.querySelector(".practice-card.setup .btn-primary").click();

  const banner = d.querySelector(".q-select-two");
  check(
    "banner reads THREE",
    banner && banner.textContent.includes("Select THREE"),
    banner && banner.textContent,
  );

  const opts = Array.from(d.querySelectorAll(".q-option"));
  const submit = d.querySelector(".q-nav .btn-primary");
  check("submit disabled with 0 selected", submit.disabled === true);
  opts[0].click();
  opts[1].click();
  check("submit still disabled at 2 (needs 3)", submit.disabled === true);
  opts[2].click();
  check(
    "a 3rd option is selectable",
    d.querySelectorAll(".q-option.selected").length === 3,
    "selected=" + d.querySelectorAll(".q-option.selected").length,
  );
  check("submit enabled at 3", submit.disabled === false);
}

/* ════ 2. answering all three correctly is graded correct ════ */
console.log("\n[2] All-correct multi-select grades as correct");
{
  const w = page([threeQ]);
  const d = w.document;
  d.querySelector(".practice-card.setup .btn-primary").click();

  /* options are shuffled — locate the correct ones by text */
  const correctTexts = threeQ.correct.map((L) => threeQ.options[L]);
  const opts = Array.from(d.querySelectorAll(".q-option"));
  const wanted = opts.filter((b) =>
    correctTexts.includes(b.querySelector(".q-opt-text").textContent),
  );
  check("located 3 correct options after shuffle", wanted.length === 3);
  wanted.forEach((b) => b.click());
  d.querySelector(".q-nav .btn-primary").click();

  const fb = d.querySelector(".q-feedback");
  check("graded correct", fb.className.includes("good"), fb.className);
  check(
    'label says "all 3 right"',
    fb.textContent.includes("all 3 right"),
    fb.textContent.slice(0, 60),
  );
  check(
    "3 options marked correct",
    d.querySelectorAll(".q-option.correct").length === 3,
  );
}

/* ════ 3. two-answer questions unchanged ════ */
console.log("\n[3] Regression: 2-answer multi still caps at 2");
{
  const w = page([twoQ]);
  const d = w.document;
  d.querySelector(".practice-card.setup .btn-primary").click();

  const banner = d.querySelector(".q-select-two");
  check(
    "banner reads TWO",
    banner && banner.textContent.includes("Select TWO"),
    banner && banner.textContent,
  );
  const opts = Array.from(d.querySelectorAll(".q-option"));
  opts[0].click();
  opts[1].click();
  opts[2].click();
  check(
    "cannot select a 3rd",
    d.querySelectorAll(".q-option.selected").length === 2,
    "selected=" + d.querySelectorAll(".q-option.selected").length,
  );
  check(
    "submit enabled at 2",
    d.querySelector(".q-nav .btn-primary").disabled === false,
  );
}

/* ════ 4. keyboard shortcuts ════ */
console.log("\n[4] Keyboard shortcuts");
{
  const w = page([singleQ, singleQ]);
  const d = w.document;

  check("setup card visible", !!d.querySelector(".practice-card.setup"));
  check("keyboard hint shown", !!d.querySelector(".kbd-hint"));
  keyOn(w, "Enter");
  check("Enter starts the quiz", !!d.querySelector(".q-options"));

  keyOn(w, "b");
  check(
    "lowercase 'b' answers",
    d.querySelector(".practice-card").classList.contains("locked"),
  );
  check(
    "option B is the one graded",
    /correct|incorrect/.test(d.querySelectorAll(".q-option")[1].className),
  );

  /* After answering, the Next button holds focus. The handler must defer to the
     browser's native Enter-activates-focused-button behavior — jsdom does not
     emulate that, so from our handler Enter is correctly a no-op here. */
  check(
    "Next button holds focus",
    d.activeElement && d.activeElement.tagName === "BUTTON",
    d.activeElement && d.activeElement.tagName,
  );
  const before = d.querySelector(".q-counter").textContent;
  keyOn(w, "Enter", d.activeElement);
  check(
    "no double-fire when a button is focused",
    before === d.querySelector(".q-counter").textContent,
  );
  d.activeElement.click(); // what a real browser does on Enter
  check(
    "advances exactly one question",
    d.querySelector(".q-counter").textContent !== before,
    before + " -> " + d.querySelector(".q-counter").textContent,
  );

  check(
    "next question is unlocked",
    !d.querySelector(".practice-card").classList.contains("locked"),
  );
  keyOn(w, "a", d.getElementById("domainSel"));
  check(
    "keypress inside a <select> is ignored",
    !d.querySelector(".practice-card").classList.contains("locked"),
  );
  keyOn(w, "3");
  check(
    "number key answers",
    d.querySelector(".practice-card").classList.contains("locked"),
  );
}

console.log("\n=== " + pass + " passed, " + fail + " failed ===");
process.exit(fail ? 1 : 0);
