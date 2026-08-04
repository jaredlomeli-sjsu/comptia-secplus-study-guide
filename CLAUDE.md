# CompTIA Security+ SY0-701 Study Guide

Personal exam-prep site for Jared. **He passed SY0-701 on 2026-07-30**, so the
one-week-cram framing that drove earlier sessions no longer applies — this is now
a portfolio artifact and a place to keep practicing. Ask what the goal is before
working from the old backlog, whose priorities were calibrated to exam week.

## Where things are

```
Webpage/              the entire site — plain static HTML/CSS/vanilla JS, no build step
  index.html          home: exam facts, 5 weighted domains, master port table
  practice.html       quiz / flashcards / PBQ labs (mode tabs + filters)
  quiz.js             the practice engine — quiz, flashcard, and PBQ rendering + grading
  questions-v2.js     800-question bank (window.QUESTION_BANK)
  pbq.js / pbq2.js    50 PBQ labs (window.PBQ_BANK) — 38 row-matching + 12 scenario
  cram.html           final-night cram sheet, weighted to the exam domains
  linux.html          Linux Lab: simulated shell (lessons / free play / challenges)
  linux-sim.js        the shell engine — virtual FS, command dispatch, terminal UI
  linux-lessons.js    8 lessons + 5 SEC+ challenges (window.LINUX_LESSONS)
  glossary.js         1090 terms (window.GLOSSARY); glossary-page.js renders/filters
  assistant.js        study assistant: keyword retrieval + optional in-browser WebLLM
  guide.js            TOC scroll-spy, reveal animations, count-up stats
  styles.css          all styling, dark-only
  diagrams/           11 standalone interactive chapter diagrams
  lib/web-llm.js      6 MB, self-hosted for the assistant — do not inline or move
chapter*.html         11 chapter study-note pages
tools/                node scripts, no deps unless documented in the file header
improvements-backlog.md   ← the work queue; start here
quiz-gap-analysis.md      glossary-vs-bank coverage report
```

## Current work queue

**`improvements-backlog.md` at the repo root is the prioritized backlog.** It has 12
items ordered by exam-score value per hour, each with a why, an effort estimate, and
concrete implementation steps with file/line anchors. Work top-down unless asked
otherwise. The top three:

1. Missed-question log + "Retry my misses" (~2h) — nothing is persisted today
2. Per-domain score breakdown on the results screen (~1h) — data already exists
3. Timed 90-question / 90-minute mock exam (~2–3h) — no timer exists anywhere

Items already completed on 2026-07-24 and **not** in the backlog: the Choose-THREE
multi-select bug, quiz keyboard shortcuts, and stale home-page copy.

## Conventions

- **Vanilla ES5-style JS.** `var`, function expressions, IIFEs, no framework, no
  bundler, no transpile. Match the surrounding style — new code should be
  indistinguishable from what's there.
- **Data lives in `window.*` globals** loaded via plain `<script>` tags in dependency
  order. `quiz.js` must load after the data files.
- **Always `esc()` any bank text before inserting it as HTML** — `quiz.js` and
  `glossary-page.js` each define their own `esc`.
- **Question bank shape** (`questions-v2.js`): `{id, domain: "3.0", subdomain,
difficulty: easy|medium|hard, type: single|multi, stem, options: {A..E},
correct: ["A","B"], explanation}`. `correct` is always an array. Never assume a
  multi question wants exactly 2 answers — 20 of them want 3. Derive the count from
  `correct.length`.
- **Nothing is persisted** except the assistant's AI opt-in flag. If you add
  `localStorage`, namespace keys `sp_*` and wrap access in try/catch.
- **CSP is strict** (`Webpage/vercel.json`) — same-origin only, no CDN scripts. Fonts
  from Google Fonts are the sole exception. Don't add external dependencies.

## Verifying changes

There is no test runner or CI. Three node scripts do the checking:

```sh
node tools/quiz-coverage.js --thin     # glossary terms untested by the question bank

npm install jsdom --prefix /tmp/qa     # one-time
NODE_PATH=/tmp/qa/node_modules node tools/test-quiz.js
NODE_PATH=/tmp/qa/node_modules node tools/test-linux-sim.js
```

`tools/test-quiz.js` loads the real `practice.html` + data + `quiz.js` into jsdom and
drives the UI by clicking and pressing keys. **Run it after any change to `quiz.js`.**
It exists because the Choose-THREE bug was invisible to data-level checks — the bank
was correct and the UI was wrong.

When adding a feature to `quiz.js`, add a section to that harness. Two jsdom quirks
to know: it has no layout (`scrollIntoView` is stubbed in the harness) and it does
not emulate Enter activating a focused button, so a test must click explicitly where
a real browser would fire on Enter.

`tools/test-linux-sim.js` does the same for the Linux Lab, and additionally **walks
every lesson and challenge to completion** using a `SOLUTIONS` table of the commands
a learner would type. **Any new lesson step needs a matching solution entry or the
harness fails** — that is deliberate, since it is the only thing proving a step is
solvable at all. It also asserts a deliberate wrong answer is rejected, which catches
a validator so loose it passes everything.

## Linux Lab notes

- **Lessons are gated by a reading page.** Clicking a lesson opens a full-width brief
  (`#lessonBrief`) built from its `teach` field, hiding `#labGrid`; a Next button
  reveals the terminal. Challenges are deliberately _not_ gated — working out the
  approach is the exercise — so they keep their `teach` inline in the sidebar. A
  lesson's `teach` and `note` render only on the brief, never duplicated in the
  sidebar, which offers a "Re-read the lesson" button instead.
- `linux-sim.js` is self-contained: it exports `window.LinuxSim` and only touches the
  DOM if `#termHost` exists, so the harness can load it headlessly.
- Commands live in the `CMDS` table and return `{out, err, code}` rather than writing
  to the DOM. That is what lets pipes and `>`/`>>` compose — keep new commands pure.
- `grep`'s BRE→JS translation (`breToJs`) is the subtlest code in the file: in BRE
  `+ ? { } ( ) |` are literal, and `^`/`$` only anchor at the pattern's very ends.
  Every example from the source study notes is asserted in the harness; if you touch
  that function, run it.
- Permission strings are 9 chars (`rwxr-xr-x`). The sticky/setuid bits render as
  `t`/`s` **in place of** `x`, so `can()` treats those as execute — `/tmp` is
  `rwxrwxrwt` and must stay traversable.
- The simulated clock is fixed (`BOOT`) so `ls -l` output is deterministic and
  testable. Don't introduce `Date.now()`.

## Deploying

Vercel project `securityplus-studyguide` is linked from `Webpage/.vercel`. Deploy
from inside `Webpage/`, not the repo root:

```sh
cd Webpage && vercel --prod --yes
```

Production alias: <https://securityplus-studyguide.vercel.app>

**Ask before deploying or committing** unless Jared has said to go ahead in the
current session.
