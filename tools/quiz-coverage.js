#!/usr/bin/env node
/*
 * quiz-coverage.js — glossary-vs-question-bank coverage checker
 *
 * Reports which glossary terms are not tested anywhere in the practice
 * material, so the question bank can be kept in step as site content grows.
 *
 * A term counts as covered if it appears anywhere a learner would encounter
 * it: a question stem, ANY answer option (right or wrong), an explanation, a
 * subdomain label, or anywhere in a PBQ lab. Distractors teach too, so they
 * count.
 *
 * Usage:  node tools/quiz-coverage.js [--list] [--thin]
 *           --list   print every untested term, grouped by chapter
 *           --thin   also print terms mentioned exactly once (weak coverage)
 *
 * Exit code is 1 when untested terms exist, so this can gate CI if wanted.
 */

"use strict";
const fs = require("fs");
const path = require("path");

const WEB = path.join(__dirname, "..", "Webpage");
const SOURCES = ["glossary.js", "questions-v2.js", "pbq.js", "pbq2.js"];

global.window = {};
for (const f of SOURCES) {
  const p = path.join(WEB, f);
  if (!fs.existsSync(p)) {
    console.error(`missing source file: ${p}`);
    process.exit(2);
  }
  // strip BOM; these files assign to window.*
  eval(fs.readFileSync(p, "utf8").replace(/^﻿/, ""));
}

const GLOSSARY = window.GLOSSARY || [];
const BANK = window.QUESTION_BANK || [];
const PBQ = window.PBQ_BANK || [];

// Everything a learner could read, as one lowercase corpus.
const corpus = [
  ...BANK.map((q) =>
    [
      q.stem,
      ...Object.values(q.options || {}),
      q.explanation,
      q.subdomain,
    ].join(" "),
  ),
  ...PBQ.map((p) => JSON.stringify(p)),
]
  .join("\n")
  .toLowerCase();

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Separator-flexible so "RAID-0" also matches "RAID 0", "e-discovery" matches
// "ediscovery". Word-boundary anchored so "UPS" does not match "backups".
const rx = (s) =>
  new RegExp(
    (/^[a-z0-9]/.test(s) ? "\\b" : "") +
      esc(s).replace(/(\\?[-\s/])+/g, "[-\\s/]*") +
      (/[a-z0-9]$/.test(s) ? "\\b" : ""),
    "g",
  );

// A term may legitimately appear under its acronym, its expansion, an
// alternate name after an em dash, or without a parenthetical.
function variants(g) {
  const out = new Set();
  const add = (s) => {
    s = (s || "").trim().toLowerCase();
    if (s.length >= 3) out.add(s);
  };
  for (const raw of [g.t, g.f]) {
    if (!raw) continue;
    add(raw);
    add(raw.replace(/\s*\(.*?\)/g, ""));
    (raw.match(/\(([^)]+)\)/g) || []).forEach((p) => add(p.slice(1, -1)));
    raw.split(/\s+[—–/]\s+|\s+\/\s+/).forEach(add);
  }
  (g.t.match(/\b[A-Z][A-Z0-9+#-]{1,}\b/g) || []).forEach(add);
  return [...out];
}

// Fallback for multi-word terms phrased differently in a question: do all the
// significant words appear together in one item? Conservative on purpose —
// counts as covered, to avoid crying wolf.
const STOP = new Set([
  "a",
  "an",
  "the",
  "of",
  "to",
  "and",
  "or",
  "for",
  "in",
  "on",
  "system",
  "systems",
  "attack",
  "protocol",
  "service",
  "based",
  "type",
]);
const items = [
  ...BANK.map((q) =>
    [q.stem, ...Object.values(q.options || {}), q.explanation]
      .join(" ")
      .toLowerCase(),
  ),
  ...PBQ.map((p) => JSON.stringify(p).toLowerCase()),
];
function looseHit(g) {
  const words = [
    ...new Set(
      g.t
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/\s+/),
    ),
  ].filter((w) => w.length > 2 && !STOP.has(w));
  if (!words.length) return false;
  return items.some((it) => words.every((w) => rx(w).test(it)));
}

const untested = [];
const thin = [];
for (const g of GLOSSARY) {
  const n = Math.max(
    0,
    ...variants(g).map((v) => (corpus.match(rx(v)) || []).length),
  );
  if (n === 0 && !looseHit(g)) untested.push(g);
  else if (n === 1) thin.push(g);
}

const args = process.argv.slice(2);
console.log(`glossary terms : ${GLOSSARY.length}`);
console.log(`MC questions   : ${BANK.length}`);
console.log(`PBQ labs       : ${PBQ.length}`);
console.log(`untested terms : ${untested.length}`);
console.log(`thin (1 mention): ${thin.length}`);

const byChapter = (list) => {
  const m = {};
  for (const g of list) (m[g.ch] = m[g.ch] || []).push(g.t);
  for (const ch of Object.keys(m).sort((a, b) => a - b)) {
    console.log(`  ch${ch} (${m[ch].length}): ${m[ch].join(" | ")}`);
  }
};

if (untested.length && args.includes("--list")) {
  console.log("\nUNTESTED:");
  byChapter(untested);
}
if (args.includes("--thin") && thin.length) {
  console.log("\nTHIN (mentioned once):");
  byChapter(thin);
}

process.exit(untested.length ? 1 : 0);
