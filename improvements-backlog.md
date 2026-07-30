# Improvements Backlog — Webpage

Deferred work from the 2026-07-24 site review. The minor items (Choose-THREE bug,
keyboard shortcuts, stale copy) are already done and are **not** listed here.

Everything below is a larger change. Ordered by exam-score value per hour of work.
All line numbers refer to files under `Webpage/` as of 2026-07-24.

## Picking this up in a new session

1. Read `CLAUDE.md` at the repo root first — conventions, data shapes, deploy steps.
2. Work top-down from item 1 unless told otherwise. The ordering is deliberate:
   items 1–2 are what turn a practice run into a study plan, and both reuse existing
   code paths rather than adding new ones.
3. Verify anything that touches `quiz.js`:
   ```sh
   npm install jsdom --prefix /tmp/qa       # one-time
   NODE_PATH=/tmp/qa/node_modules node tools/test-quiz.js
   ```
   Add a section to that harness for whatever you build.
4. Check off items here as they land, and note anything you discover mid-build —
   this file is the running state of the work, not a one-time report.
5. Ask before deploying or committing.

**Exam is the week of 2026-07-31.** If that date has passed, ask what the goal is now
before working through this list — most of it is calibrated to a one-week cram.

---

## 1. Missed-question log + "Retry my misses"

**Why:** Re-drilling your own errors is the highest-yield practice that exists, and
right now every miss is forgotten the moment you refresh. `localStorage` is used in
exactly one place site-wide (`assistant.js`, the AI opt-in flag) — there is no study
history of any kind.

**Effort:** ~2 hours.

**How:**

1. Give every question a stable key. The bank already has `id` (`questions-v2.js`),
   so use that — do **not** key off the stem text, and do not key off the shuffled
   runtime object built by `prepare()` (`quiz.js:71`), which drops `id`.
   - First step: carry `id` through `prepare()` so results know which bank item they
     came from. Add `id: q.id` to the object it returns.
2. In `choose()` / `chooseMulti()` (`quiz.js:269`, `291`), append the id to a
   `localStorage` set:
   ```js
   // sp_misses = { "555": {n: 3, last: 1690000000000}, ... }
   ```
   Increment `n` on a miss; delete the entry (or decrement) after two consecutive
   correct answers so mastered items drop out.
3. Add a fourth mode tab in `practice.html:53` — `data-mode="misses"` — and a branch
   in `setMode()` (`quiz.js:757`). It reuses the whole quiz path; only the pool
   changes:
   ```js
   var pool = BANK.filter(function (q) {
     return MISSES[q.id];
   });
   ```
4. Show the miss count on the tab ("Retry my misses (23)") so it's a visible to-do.

**Watch out for:** the pool can be empty — reuse the existing empty-pool guard in
`quizSetup()` (`quiz.js:144`).

---

## 2. Per-domain score breakdown on the results screen

**Why:** `renderResults()` (`quiz.js:349`) shows one percentage ring and a list of
misses. That tells you _that_ you're weak, not _where_. Every question already
carries `domain` and `subdomain` (51 distinct subdomains, all populated) — the data
is sitting there unused.

**Effort:** ~1 hour.

**How:**

1. `quiz.answered` already holds `{item, chosen, right}` and `item.d` is the domain
   digit. Group it:
   ```js
   var byDomain = {};
   quiz.answered.forEach(function (a) {
     var d =
       byDomain[a.item.d] || (byDomain[a.item.d] = { right: 0, total: 0 });
     d.total++;
     if (a.right) d.right++;
   });
   ```
2. Render a row per domain reusing the existing `.bar > span` markup and the domain
   colors from `index.html:232-320`, inserted into the results card after the ring.
3. Do the same for `item.subdomain` and print the three worst as
   "Weakest areas: 4.3 Digital forensics (0/2) · …".
4. Wire each weak-area line to a "Drill this" button that filters the pool by
   subdomain and calls `startQuiz()`.

**Also worth doing:** a subdomain dropdown in `practice.html:64` alongside the
existing domain/difficulty selects, populated from the distinct `q.subdomain` values.

---

## 3. Timed mock exam (90 questions / 90 minutes)

**Why:** Security+ is as much a pacing test as a knowledge test — roughly one minute
per question, with PBQs eating 5–8 minutes each. `lenSel` (`practice.html:82`) caps
at 50 and there is no timer anywhere on the site. You should sit at least two
full-length timed runs before test day.

**Effort:** ~2–3 hours.

**How:**

1. New mode tab `data-mode="exam"`; hide the domain/difficulty/length filters for it
   (`setMode()` already hides `#lenWrap` and `#diffWrap` per mode — `quiz.js:765-768`).
2. Set builder: draw 4–5 PBQ labs from `window.PBQ_BANK` first, then fill to 90 with
   questions weighted to the real domain split — 12% / 22% / 18% / 28% / 20%. Sample
   per domain rather than shuffling the whole bank, or the mix drifts (the bank is
   not distributed to match the exam: 91 / 166 / 180 / 212 / 151).
3. **Suppress per-question feedback.** `choose()` currently locks the card and shows
   the explanation immediately. Add an `examMode` flag that records the answer and
   advances without grading. This is the one part that genuinely changes existing
   code paths rather than adding to them.
4. Allow back/forward navigation between questions and answer changes until submit
   (see item 4 below — build them together, they share the same state model).
5. Countdown in the `.quiz-meta` row; auto-submit at zero.
6. On results, report a scaled 100–900 score (linear map is close enough) plus the
   per-domain breakdown from item 2.

---

## 4. Flag-for-review, back-navigation, and changeable answers

**Why:** Answers lock the instant you click — `card.classList.add("locked")`
(`quiz.js:272`). The real Pearson VUE interface lets you flag items, move freely, and
change answers before submitting. Practicing without that trains the wrong habit.

**Effort:** ~2 hours, or ~free if built alongside item 3.

**How:**

1. Change `quiz.answered` from an append-only array to an indexed one:
   `quiz.answers[quiz.idx] = {chosen: [...], flagged: false}`.
2. `renderQuestion()` (`quiz.js:167`) should restore any prior selection for the
   current index instead of always starting empty.
3. Add Prev / Next / Flag buttons and a question-navigator strip (90 numbered cells,
   colored: unanswered / answered / flagged) — clicking a cell jumps to it.
4. Grade everything at submit time rather than per question.

---

## 5. Flashcard self-grading (Leitner boxes)

**Why:** Flashcards only flip and shuffle (`quiz.js:448-520`). There is no "I knew
it / I didn't", so it's passive review. The ~473 acronyms and 30 port mappings in the
glossary are exactly what spaced repetition is for.

**Effort:** ~2 hours.

**How:**

1. Add **Again / Hard / Good** buttons under the card in `buildFlashUI()`.
2. Store `sp_leitner = { "<id>": {box: 1..3, due: <timestamp>} }`. Again → box 1,
   Hard → stay, Good → box+1. Due offsets of roughly 10 min / 1 day / 3 days are
   fine for a one-week horizon — don't over-engineer the scheduler.
3. `startFlash()` (`quiz.js:492`) draws due cards first, then unseen, then the rest.
4. Show "12 due · 40 new · 1038 later" above the card.

---

## 6. Acronym and port drill modes

**Why:** Nearly free — the data already exists. 473 glossary entries carry a
full-form field (`e.f`) and 30 carry a port (`e.p`), plus the master port table at
`index.html:609`. CompTIA tests acronyms heavily, and your own tip callout at
`index.html:830` correctly notes port questions are scenario-shaped
("securely transfer files" → SFTP/22), which is what the drill should mirror.

**Effort:** ~2 hours for both.

**How:** Two new modes generating questions on the fly from `window.GLOSSARY`:

- **Acronym:** prompt `e.t` ("SAML"), answer `e.f`. Distractors = three other `.f`
  values from the same category `e.c` (same-category distractors are much harder and
  more exam-like than random ones).
- **Ports:** prompt a scenario, answer protocol+port. Distractors = other
  port-tagged entries. Include the secure-alternative pairing from the master table.

Both reuse `renderQuestion()` unchanged if you shape the generated objects like bank
questions (`stem`, `options`, `correct`, `explanation`, `type`, `difficulty`, `d`).

---

## 7. Explanation → chapter deep links

**Why:** When you miss a question you should land on the exact section that explains
it. `assistant.js` already contains a `SECTIONS` index mapping topics to
`page#anchor` with keyword lists — the hard part is already built and unused by the
quiz.

**Effort:** ~1 hour.

**How:** Export the `SECTIONS` array from `assistant.js` onto `window`, then in
`appendFeedback()` (`quiz.js:320`) score the question's `subdomain` + stem tokens
against it (the `tokenize`/scoring functions in `assistant.js:115-152` are reusable)
and append the best match as "Read more: Ch 3 · Zero Trust →".

---

## 8. Distractor rationale

**Why:** Explanations are one paragraph about the correct answer. Security+ is a
"pick the BEST" exam — knowing why B is tempting-but-wrong is often the whole
question.

**Effort:** content work, not code. Budget by how many you write.

**How:** Add an optional `distractors: {"B": "…", "D": "…"}` field to bank entries;
render it in `appendFeedback()` under the main explanation when present, showing only
the option the user actually picked. Backward compatible — questions without the
field render exactly as they do today.

**Scope:** don't attempt all 800. Target the `hard` questions in Domains 2 and 4
(174 items) — that's where the BEST-answer traps live.

---

## 9. Difficulty retagging + thin subdomains

**Why:** Only **49 of 800** questions are tagged `easy`, and Domain 1 has **4**.
Selecting Domain 1 + Easy yields a 4-question pool, so the Easy filter is effectively
broken.

| Domain               | Easy | Medium | Hard |
| -------------------- | ---- | ------ | ---- |
| 1.0 General Security | 4    | 41     | 46   |
| 2.0 Threats          | 11   | 73     | 82   |
| 3.0 Architecture     | 11   | 96     | 73   |
| 4.0 Operations       | 12   | 108    | 92   |
| 5.0 Program Mgmt     | 11   | 76     | 64   |

**Fix:** either retag ~100 straightforward recall questions as `easy`, or drop the
Easy option from `practice.html:75` and relabel the remaining two levels.

**Separately — thin subdomains.** Across 51 subdomains, several genuinely-tested
areas have 1–3 questions:

- 5.2 Data privacy and protection — 1
- 5.2 Security awareness and training — 1
- 2.2 Wireless security — 2
- 4.1 Data loss prevention — 2
- 4.2 Security awareness — 2
- 4.3 Digital forensics — 2
- 5.4 Business continuity and disaster recovery — 2
- 2.2 DNS security — 3

Adding ~5 questions to each of those seven is a focused, high-yield content task.

**Data quality is otherwise clean:** zero duplicate stems, zero missing explanations,
zero single/multi type mismatches, every question has a subdomain.

---

## 10. Cram sheet page

**Why:** The one page you'd actually read in the parking lot. Print CSS already
exists (`styles.css:1465`, `2787`).

**Effort:** ~1–2 hours, mostly assembling content you've already written.

**Contents:** ports table · acronym list · formulas (SLE = AV × EF, ALE = SLE × ARO)
· RAID levels · RTO/RPO/MTBF/MTTR · 4 control categories × 6 control types · WEP→WPA3
evolution · EAP family · IR and forensics order of volatility.

Single `cram.html`, one column, no JS, print-optimized.

---

## 11. Exam countdown + study plan

**Why:** Turns the site from a library into a schedule.

**Effort:** ~1 hour.

**How:** A date input stored in `localStorage`, a "6 days until exam" banner on
`index.html`, and a static day-by-day plan (Day 1 Domain 4 → Day 2 Domain 2 → … →
Day 6 full mock → Day 7 cram sheet + ports). Link each day to the matching filtered
practice URL.

---

## 12. Smaller structural items

- **Mobile nav.** The top nav is 12 links with no collapse — there's no hamburger and
  no `.topnav` rule in the `max-width: 760px` block (`styles.css:499`). On a phone it
  wraps into a wall of text above every page. A collapsible menu or a horizontally
  scrolling strip would make phone studying much better.
- **Global search.** Search exists only inside the glossary (`glossary-page.js`). A
  `Ctrl+K` palette over chapter headings would beat hunting for "where did I read
  about SAML".
- **Chapter progress.** Nothing marks a chapter as read or shows last-visited. With
  11 chapters and one week, "what haven't I touched yet" is a question the site
  should be able to answer.
- **PWA / offline.** No service worker or manifest. Would let you drill on a phone
  with no signal. Note the payload sizes: `questions-v2.js` is 1.2 MB and
  `lib/web-llm.js` is 6 MB — precache the question bank, leave the model on-demand.
- **No light theme.** `styles.css` has no `prefers-color-scheme` or `data-theme`
  handling; the site is dark-only. Low priority.
