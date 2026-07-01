/* ════════════════════════════════════════════════════════════
   quiz.js · Practice engine for Security+ SY0-701 study guide
   Reads window.QUESTION_BANK (v2 format):
     stem, options {A-D/E}, correct (array), type, difficulty, subdomain, domain, explanation
   Modes: scenario Quiz (single + multi-select) · Flashcards · PBQ Labs
════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var BANK = (window.QUESTION_BANK || []).slice();
  var DOMAIN_NAMES = {
    '1': '1.0 General Security Concepts',
    '2': '2.0 Threats, Vulnerabilities & Mitigations',
    '3': '3.0 Security Architecture',
    '4': '4.0 Security Operations',
    '5': '5.0 Program Management & Oversight'
  };
  var DIFF_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
  var DIFF_CLS   = { easy: 'diff-easy', medium: 'diff-medium', hard: 'diff-hard' };
  var LETTERS = ['A', 'B', 'C', 'D', 'E'];

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls)  e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* v2 domain field is "1.0" — extract leading digit for selector matching */
  function domainKey(q) { return String(q.domain).charAt(0); }

  function poolFor(d, diff) {
    var pool = (d === 'all') ? BANK : BANK.filter(function (q) { return domainKey(q) === String(d); });
    if (diff && diff !== 'all') pool = pool.filter(function (q) { return q.difficulty === diff; });
    return pool;
  }

  /* Convert a v2 question into a runtime question with shuffled option order */
  function prepare(q) {
    var letters = Object.keys(q.options);   // ['A','B','C','D'] or ['A','B','C','D','E']
    var order   = shuffle(letters);          // shuffled letter list
    return {
      stem:       q.stem,
      e:          q.explanation,
      d:          domainKey(q),
      subdomain:  q.subdomain  || '',
      difficulty: q.difficulty || 'medium',
      type:       q.type       || 'single',
      options:    order.map(function (k) { return q.options[k]; }),
      /* correct: array of shuffled position indices (0-based) */
      correct:    q.correct.map(function (c) { return order.indexOf(c); })
    };
  }

  var domainSel = $('domainSel');
  var diffSel   = $('diffSel');
  var lenSel    = $('lenSel');
  var poolCount = $('poolCount');
  var quizArea  = $('quizArea');
  var flashArea = $('flashArea');
  var pbqArea   = $('pbqArea');
  var PBQ       = (window.PBQ_BANK || []).slice();
  var tabs      = document.querySelectorAll('.mode-tab');

  function getDiff() { return diffSel ? diffSel.value : 'all'; }
  function currentPoolSize() { return poolFor(domainSel.value, getDiff()).length; }
  function updatePoolCount() {
    var n = currentPoolSize();
    poolCount.textContent = n + ' question' + (n === 1 ? '' : 's') + ' in pool';
  }

  /* ════════════════════════════════════════
     QUIZ MODE
  ════════════════════════════════════════ */
  var quiz = { set: [], idx: 0, answered: [], score: 0 };

  function quizSetup() {
    quizArea.innerHTML = '';
    var card  = el('div', 'practice-card setup');
    var n     = currentPoolSize();
    card.appendChild(el('div', 'setup-icon', '🎯'));
    card.appendChild(el('h3', null, 'Ready to test yourself?'));
    card.appendChild(el('p', 'muted',
      'A fresh, randomly-selected set is drawn every attempt from the ' +
      '<strong>' + n + '</strong>-question pool. ' +
      'Single-answer and <strong>Select TWO</strong> questions are mixed in.'));
    var start = el('button', 'btn btn-primary', 'Start quiz →');
    start.addEventListener('click', startQuiz);
    if (!n) { start.disabled = true; card.appendChild(el('p', 'muted', 'No questions match these filters.')); }
    card.appendChild(start);
    quizArea.appendChild(card);
  }

  function startQuiz() {
    var pool = poolFor(domainSel.value, getDiff());
    var n    = Math.min(parseInt(lenSel.value, 10) || 10, pool.length);
    quiz.set      = shuffle(pool).slice(0, n).map(prepare);
    quiz.idx      = 0;
    quiz.answered = [];
    quiz.score    = 0;
    renderQuestion();
  }

  function renderQuestion() {
    var item   = quiz.set[quiz.idx];
    var isMulti = item.type === 'multi';
    quizArea.innerHTML = '';

    /* progress bar */
    var bar  = el('div', 'quiz-progress');
    var fill = el('div', 'quiz-progress-fill');
    fill.style.width = (quiz.idx / quiz.set.length * 100) + '%';
    bar.appendChild(fill);
    quizArea.appendChild(bar);

    /* meta row */
    var meta = el('div', 'quiz-meta');
    meta.appendChild(el('span', 'q-counter', 'Question ' + (quiz.idx + 1) + ' / ' + quiz.set.length));
    meta.appendChild(el('span', 'q-domain',  'Domain ' + item.d + '.0'));
    meta.appendChild(el('span', 'diff-badge ' + (DIFF_CLS[item.difficulty] || 'diff-medium'),
      DIFF_LABEL[item.difficulty] || item.difficulty));
    meta.appendChild(el('span', 'q-score', 'Score: ' + quiz.score));
    quizArea.appendChild(meta);

    var card = el('div', 'practice-card');

    /* "Select TWO" banner */
    if (isMulti) {
      card.appendChild(el('div', 'q-select-two', '★ Select TWO answers'));
    }

    card.appendChild(el('div', 'q-text', esc(item.stem)));

    var opts     = el('div', 'q-options');
    var selected = [];
    var submitBtn;

    item.options.forEach(function (opt, i) {
      var b = el('button', 'q-option' + (isMulti ? ' q-option-multi' : ''));
      b.innerHTML =
        '<span class="q-letter">' + LETTERS[i] + '</span>' +
        '<span class="q-opt-text">' + esc(opt) + '</span>';

      if (isMulti) {
        b.addEventListener('click', function () {
          if (card.classList.contains('locked')) return;
          var pos = selected.indexOf(i);
          if (pos === -1) {
            if (selected.length < 2) {
              selected.push(i);
              b.classList.add('selected');
            }
          } else {
            selected.splice(pos, 1);
            b.classList.remove('selected');
          }
          if (submitBtn) submitBtn.disabled = (selected.length !== 2);
        });
      } else {
        b.addEventListener('click', function () { choose(i, card); });
      }
      opts.appendChild(b);
    });
    card.appendChild(opts);

    /* multi-select needs an explicit submit button */
    if (isMulti) {
      var multiNav = el('div', 'q-nav');
      submitBtn = el('button', 'btn btn-primary', 'Check answers');
      submitBtn.disabled = true;
      submitBtn.addEventListener('click', function () { chooseMulti(selected, card); });
      multiNav.appendChild(submitBtn);
      card.appendChild(multiNav);
    }

    quizArea.appendChild(card);
  }

  /* single-answer submission */
  function choose(i, card) {
    var item = quiz.set[quiz.idx];
    if (card.classList.contains('locked')) return;
    card.classList.add('locked');

    var correctIdx = item.correct[0];
    var right      = (i === correctIdx);
    if (right) quiz.score++;
    quiz.answered.push({ item: item, chosen: [i], right: right });

    var buttons = card.querySelectorAll('.q-option');
    buttons.forEach(function (b, bi) {
      b.disabled = true;
      if (bi === correctIdx) b.classList.add('correct');
      else if (bi === i)     b.classList.add('incorrect');
    });

    appendFeedback(card, right, item.e);
    appendNextBtn(card);
  }

  /* multi-answer submission */
  function chooseMulti(selected, card) {
    var item = quiz.set[quiz.idx];
    if (card.classList.contains('locked')) return;
    card.classList.add('locked');

    var right = (selected.length === item.correct.length) &&
      item.correct.every(function (c) { return selected.indexOf(c) !== -1; });
    if (right) quiz.score++;
    quiz.answered.push({ item: item, chosen: selected.slice(), right: right });

    var buttons = card.querySelectorAll('.q-option');
    buttons.forEach(function (b, bi) {
      b.disabled = true;
      b.classList.remove('selected');
      if (item.correct.indexOf(bi) !== -1) b.classList.add('correct');
      else if (selected.indexOf(bi) !== -1) b.classList.add('incorrect');
    });

    appendFeedback(card, right, item.e, true);
    /* replace the "Check answers" nav with the next button */
    var oldNav = card.querySelector('.q-nav');
    if (oldNav) oldNav.remove();
    appendNextBtn(card);
  }

  function appendFeedback(card, right, explanation, isMulti) {
    var fb = el('div', 'q-feedback ' + (right ? 'good' : 'bad'));
    var label = right
      ? ('✓ Correct' + (isMulti ? ' — both right' : ''))
      : '✗ Not quite';
    fb.innerHTML = '<b>' + label + '</b> — ' + esc(explanation);
    card.appendChild(fb);
  }

  function appendNextBtn(card) {
    var nav  = el('div', 'q-nav');
    var next = el('button', 'btn btn-primary',
      quiz.idx + 1 < quiz.set.length ? 'Next question →' : 'See results →');
    next.addEventListener('click', function () {
      quiz.idx++;
      if (quiz.idx < quiz.set.length) renderQuestion(); else renderResults();
    });
    nav.appendChild(next);
    card.appendChild(nav);
    next.focus();
  }

  function renderResults() {
    quizArea.innerHTML = '';
    var total  = quiz.set.length;
    var score  = quiz.score;
    var pct    = Math.round(score / total * 100);
    var passed = pct >= 75;

    var card = el('div', 'practice-card results');
    var ring = el('div', 'result-ring');
    ring.style.setProperty('--p', pct);
    ring.innerHTML =
      '<div class="result-ring-v"><b>' + pct + '%</b>' +
      '<small>' + score + ' / ' + total + '</small></div>';
    card.appendChild(ring);
    card.appendChild(el('h3', null,
      passed ? 'Nice — that\'s a passing range.' : 'Keep going — you\'ll get there.'));
    card.appendChild(el('p', 'muted', passed
      ? 'The real exam passes at 750/900 (~83%). Strong work — run another set to stay sharp.'
      : 'Aim for 75%+ here before test day. Review the misses below, then try a fresh set.'));

    var again   = el('button', 'btn btn-primary', '↻ New random set');
    again.addEventListener('click', startQuiz);
    var actions = el('div', 'q-nav center');
    actions.appendChild(again);
    card.appendChild(actions);
    quizArea.appendChild(card);

    /* missed-question review */
    var missed = quiz.answered.filter(function (a) { return !a.right; });
    if (missed.length) {
      var rev = el('div', 'review');
      rev.appendChild(el('h4', 'review-h',
        'Review your ' + missed.length + ' missed question' + (missed.length === 1 ? '' : 's')));
      missed.forEach(function (a) {
        var chosenText  = a.chosen.map(function (i) { return a.item.options[i]; }).join(', ');
        var correctText = a.item.correct.map(function (i) { return a.item.options[i]; }).join(', ');
        var r = el('div', 'review-item');
        r.innerHTML =
          '<div class="rq">' + esc(a.item.stem) + '</div>' +
          '<div class="ra wrong">Your answer: '  + esc(chosenText)  + '</div>' +
          '<div class="ra right">Correct: '      + esc(correctText) + '</div>' +
          '<div class="re">'                      + esc(a.item.e)   + '</div>';
        rev.appendChild(r);
      });
      quizArea.appendChild(rev);
    }
    quizArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ════════════════════════════════════════
     FLASHCARD MODE  (reads raw BANK directly)
  ════════════════════════════════════════ */
  var flash = { cards: [], idx: 0, flipped: false };

  function buildFlashUI() {
    flashArea.innerHTML = '';
    var stage = el('div', 'flash-stage');
    var fcard = el('div', 'flashcard'); fcard.id = 'flashcard';
    fcard.innerHTML =
      '<div class="flash-inner">' +
        '<div class="flash-face flash-front">' +
          '<span class="flash-tag" id="flashTag"></span>' +
          '<div class="flash-q" id="flashFront"></div>' +
          '<span class="flash-hint">click to reveal answer</span>' +
        '</div>' +
        '<div class="flash-face flash-back">' +
          '<span class="flash-tag answer">Answer</span>' +
          '<div class="flash-a" id="flashBack"></div>' +
        '</div>' +
      '</div>';
    fcard.addEventListener('click', function () {
      flash.flipped = !flash.flipped;
      fcard.classList.toggle('flipped', flash.flipped);
    });
    stage.appendChild(fcard);
    flashArea.appendChild(stage);

    var ctr     = el('div', 'flash-controls');
    var prev    = el('button', 'btn btn-ghost',   '← Prev');
    var counter = el('span',  'flash-counter');
    counter.id  = 'flashCounter';
    var next    = el('button', 'btn btn-ghost',   'Next →');
    var sh      = el('button', 'btn btn-primary', '↻ Shuffle');
    prev.addEventListener('click', function () { moveFlash(-1); });
    next.addEventListener('click', function () { moveFlash(1);  });
    sh.addEventListener('click', startFlash);
    ctr.appendChild(prev);
    ctr.appendChild(counter);
    ctr.appendChild(next);
    ctr.appendChild(sh);
    flashArea.appendChild(ctr);
  }

  function startFlash() {
    flash.cards   = shuffle(poolFor(domainSel.value, getDiff()));
    flash.idx     = 0;
    flash.flipped = false;
    renderFlash();
  }

  function moveFlash(step) {
    flash.idx     = (flash.idx + step + flash.cards.length) % flash.cards.length;
    flash.flipped = false;
    renderFlash();
  }

  function renderFlash() {
    var c = flash.cards[flash.idx];
    if (!c) return;
    var fcard = $('flashcard');
    fcard.classList.remove('flipped');
    $('flashTag').textContent = 'Domain ' + c.domain;
    $('flashFront').innerHTML = esc(c.stem);
    /* build answer text from correct letter(s) → option text */
    var corrTexts = c.correct.map(function (letter) { return c.options[letter]; }).join(' / ');
    $('flashBack').innerHTML =
      '<b>' + esc(corrTexts) + '</b>' +
      '<span class="flash-exp">' + esc(c.explanation) + '</span>';
    $('flashCounter').textContent = (flash.idx + 1) + ' / ' + flash.cards.length;
  }

  /* ════════════════════════════════════════
     PBQ MODE  (compact format — unchanged)
  ════════════════════════════════════════ */
  var pbq = { set: [], idx: 0, results: [] };
  var pbqAdv = { qIdx: 0, qRight: 0 };
  var PBQ_PER_SET = 5;

  function pbqPoolFor(d) {
    var all = PBQ.concat(window.PBQ_BANK || []);
    if (d === 'all') return all;
    return all.filter(function (p) {
      var dk = p.d !== undefined ? String(p.d) : String(p.domain).charAt(0);
      return dk === String(d);
    });
  }

  function pbqSetup() {
    pbqArea.innerHTML = '';
    var pool = pbqPoolFor(domainSel.value);
    var card = el('div', 'practice-card setup');
    card.appendChild(el('div', 'setup-icon', '🧪'));
    card.appendChild(el('h3', null, 'Performance-Based Questions'));
    card.appendChild(el('p', 'muted',
      'Hands-on tasks like the real exam — match ports, sort protocols, categorize controls, and order processes. ' +
      'A random set of <strong>' + Math.min(PBQ_PER_SET, pool.length) + '</strong> is drawn from ' +
      '<strong>' + pool.length + '</strong> labs, graded per row.'));
    var start = el('button', 'btn btn-primary', 'Start PBQ set →');
    start.addEventListener('click', startPbq);
    if (!pool.length) { card.appendChild(el('p', 'muted', 'No PBQs for this domain — choose another.')); }
    else card.appendChild(start);
    pbqArea.appendChild(card);
  }

  function startPbq() {
    var pool  = pbqPoolFor(domainSel.value);
    pbq.set   = shuffle(pool).slice(0, Math.min(PBQ_PER_SET, pool.length));
    pbq.idx   = 0;
    pbq.results = [];
    renderPbq();
  }

  function renderPbq() {
    var item = pbq.set[pbq.idx];
    if (item.questions) {
      pbqAdv.qIdx  = 0;
      pbqAdv.qRight = 0;
      renderPbqAdvQuestion(item);
      return;
    }
    pbqArea.innerHTML = '';

    var bar  = el('div', 'quiz-progress');
    var fill = el('div', 'quiz-progress-fill');
    fill.style.width = (pbq.idx / pbq.set.length * 100) + '%';
    bar.appendChild(fill);
    pbqArea.appendChild(bar);

    var meta = el('div', 'quiz-meta');
    meta.appendChild(el('span', 'q-counter', 'Lab ' + (pbq.idx + 1) + ' / ' + pbq.set.length));
    meta.appendChild(el('span', 'q-domain', item.sub + ' · Domain ' + item.d + '.0'));
    pbqArea.appendChild(meta);

    var card = el('div', 'practice-card');
    card.appendChild(el('div', 'q-text', esc(item.q)));

    var grid             = el('div', 'pbq-grid');
    var optionsShuffled  = shuffle(item.options);
    shuffle(item.rows).forEach(function (row) {
      var label  = row[0];
      var answer = row[1];
      var line   = el('div', 'pbq-row');
      line.appendChild(el('span', 'pbq-label', esc(label)));
      var sel = el('select', 'pbq-select');
      sel.dataset.answer = answer;
      sel.appendChild(new Option('— select —', ''));
      optionsShuffled.forEach(function (o) { sel.appendChild(new Option(o, o)); });
      var icon = el('span', 'pbq-mark', '');
      line.appendChild(sel);
      line.appendChild(icon);
      grid.appendChild(line);
    });
    card.appendChild(grid);

    var check = el('button', 'btn btn-primary', 'Check answers');
    check.addEventListener('click', function () { gradePbq(card, item); });
    var nav = el('div', 'q-nav');
    nav.appendChild(check);
    card.appendChild(nav);
    pbqArea.appendChild(card);
  }

  function gradePbq(card, item) {
    if (card.classList.contains('locked')) return;
    card.classList.add('locked');
    var rows        = card.querySelectorAll('.pbq-row');
    var correctRows = 0;
    rows.forEach(function (line) {
      var sel  = line.querySelector('.pbq-select');
      var mark = line.querySelector('.pbq-mark');
      sel.disabled = true;
      if (sel.value === sel.dataset.answer) {
        line.classList.add('row-correct'); mark.textContent = '✓'; correctRows++;
      } else {
        line.classList.add('row-incorrect'); mark.textContent = '✗';
      }
    });
    var allRight = correctRows === rows.length;
    pbq.results.push({ correctRows: correctRows, total: rows.length, allRight: allRight });

    var fb = el('div', 'q-feedback ' + (allRight ? 'good' : 'bad'));
    fb.innerHTML = '<b>' + correctRows + ' / ' + rows.length + ' correct</b> — ' + esc(item.e);
    card.appendChild(fb);

    var nav    = card.querySelector('.q-nav');
    nav.innerHTML = '';
    var reveal = el('button', 'btn btn-ghost', 'Reveal answers');
    reveal.addEventListener('click', function () {
      rows.forEach(function (line) {
        var sel = line.querySelector('.pbq-select');
        sel.value = sel.dataset.answer;
        line.classList.remove('row-incorrect');
        line.classList.add('row-correct');
        line.querySelector('.pbq-mark').textContent = '✓';
      });
      reveal.disabled = true;
    });
    var next = el('button', 'btn btn-primary',
      pbq.idx + 1 < pbq.set.length ? 'Next lab →' : 'See results →');
    next.addEventListener('click', function () {
      pbq.idx++;
      if (pbq.idx < pbq.set.length) renderPbq(); else renderPbqResults();
    });
    nav.appendChild(reveal);
    nav.appendChild(next);
    next.focus();
  }

  function renderPbqResults() {
    pbqArea.innerHTML = '';
    var solved    = pbq.results.filter(function (r) { return r.allRight; }).length;
    var rowsRight = pbq.results.reduce(function (a, r) { return a + r.correctRows; }, 0);
    var rowsTotal = pbq.results.reduce(function (a, r) { return a + r.total; }, 0);
    var pct       = rowsTotal ? Math.round(rowsRight / rowsTotal * 100) : 0;

    var card = el('div', 'practice-card results');
    var ring = el('div', 'result-ring');
    ring.style.setProperty('--p', pct);
    ring.innerHTML =
      '<div class="result-ring-v"><b>' + pct + '%</b>' +
      '<small>' + rowsRight + ' / ' + rowsTotal + ' items</small></div>';
    card.appendChild(ring);
    card.appendChild(el('h3', null, 'You fully solved ' + solved + ' of ' + pbq.set.length + ' labs'));
    card.appendChild(el('p', 'muted', pct >= 80
      ? 'Strong — PBQs are weighted heavily on the real exam, so this is exactly the muscle to build.'
      : 'PBQs reward knowing exact mappings (ports, controls, order). Re-run a fresh set to drill them.'));
    var again   = el('button', 'btn btn-primary', '↻ New PBQ set');
    again.addEventListener('click', startPbq);
    var actions = el('div', 'q-nav center');
    actions.appendChild(again);
    card.appendChild(actions);
    pbqArea.appendChild(card);
    pbqArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ════════════════════════════════════════
     MODE SWITCHING
  ════════════════════════════════════════ */
  var mode = 'quiz';
  function setMode(m) {
    mode = m;
    tabs.forEach(function (t) { t.classList.toggle('active', t.dataset.mode === m); });
    quizArea.hidden  = m !== 'quiz';
    flashArea.hidden = m !== 'flash';
    pbqArea.hidden   = m !== 'pbq';
    $('lenWrap').style.display = (m === 'quiz') ? '' : 'none';
    /* difficulty filter not meaningful for PBQ mode */
    var dw = $('diffWrap');
    if (dw) dw.style.display = (m === 'pbq') ? 'none' : '';
    if (m === 'quiz')        quizSetup();
    else if (m === 'flash')  { if (!$('flashcard')) buildFlashUI(); startFlash(); }
    else                     pbqSetup();
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () { setMode(t.dataset.mode); });
  });

  domainSel.addEventListener('change', function () {
    updatePoolCount();
    if (mode === 'quiz')       quizSetup();
    else if (mode === 'flash') startFlash();
    else                       pbqSetup();
  });

  if (diffSel) {
    diffSel.addEventListener('change', function () {
      updatePoolCount();
      if (mode === 'quiz')       quizSetup();
      else if (mode === 'flash') startFlash();
    });
  }

  /* ─── init ─── */
  /* ════════════════════════════════════════
     ADVANCED PBQ — scenario / multi-question
  ════════════════════════════════════════ */
  function renderPbqAdvQuestion(lab) {
    var q       = lab.questions[pbqAdv.qIdx];
    var letters = Object.keys(q.options);
    var isMulti = q.type === 'multi';
    pbqArea.innerHTML = '';

    var bar = el('div', 'quiz-progress');
    var fill = el('div', 'quiz-progress-fill');
    fill.style.width = (pbq.idx / pbq.set.length * 100) + '%';
    bar.appendChild(fill);
    pbqArea.appendChild(bar);

    var meta = el('div', 'quiz-meta');
    meta.appendChild(el('span', 'q-counter', 'Lab ' + (pbq.idx + 1) + ' / ' + pbq.set.length));
    meta.appendChild(el('span', 'q-domain', lab.title + ' · Domain ' + lab.domain));
    meta.appendChild(el('span', 'q-counter', 'Q' + (pbqAdv.qIdx + 1) + ' / ' + lab.questions.length));
    pbqArea.appendChild(meta);

    var card = el('div', 'practice-card');

    var scenWrap = el('div', 'pbq-adv-scenario');
    var togBtn   = el('button', 'pbq-adv-toggle', '▼ Scenario (click to collapse)');
    var scenPre  = el('pre', 'pbq-adv-text', esc(lab.scenario));
    togBtn.addEventListener('click', function () {
      var hidden = scenPre.style.display === 'none';
      scenPre.style.display = hidden ? '' : 'none';
      togBtn.textContent = (hidden ? '▼' : '▶') + ' Scenario (click to ' + (hidden ? 'collapse' : 'expand') + ')';
    });
    scenWrap.appendChild(togBtn);
    scenWrap.appendChild(scenPre);
    card.appendChild(scenWrap);

    if (isMulti) {
      var howMany = Array.isArray(q.correct) ? q.correct.length : 2;
      card.appendChild(el('div', 'q-select-two', '★ Select ' + howMany + ' answers'));
    }
    card.appendChild(el('div', 'q-text', esc(q.stem)));

    var opts     = el('div', 'q-options');
    var selected = [];
    var submitBtn;
    letters.forEach(function (letter) {
      var b = el('button', 'q-option' + (isMulti ? ' q-option-multi' : ''));
      b.innerHTML = '<span class="q-letter">' + esc(letter) + '</span>' +
                    '<span class="q-opt-text">' + esc(q.options[letter]) + '</span>';
      if (isMulti) {
        b.addEventListener('click', function () {
          if (card.classList.contains('locked')) return;
          var pos    = selected.indexOf(letter);
          var maxSel = Array.isArray(q.correct) ? q.correct.length : 2;
          if (pos === -1) {
            if (selected.length < maxSel) { selected.push(letter); b.classList.add('selected'); }
          } else {
            selected.splice(pos, 1);
            b.classList.remove('selected');
          }
          if (submitBtn) submitBtn.disabled = (selected.length !== maxSel);
        });
      } else {
        b.addEventListener('click', function () { gradeAdvQuestion(letter, card, lab, q, letters); });
      }
      opts.appendChild(b);
    });
    card.appendChild(opts);

    if (isMulti) {
      var mn = el('div', 'q-nav');
      submitBtn = el('button', 'btn btn-primary', 'Check answers');
      submitBtn.disabled = true;
      submitBtn.addEventListener('click', function () { gradeAdvMulti(selected, card, lab, q, letters); });
      mn.appendChild(submitBtn);
      card.appendChild(mn);
    }
    pbqArea.appendChild(card);
  }

  function gradeAdvQuestion(chosen, card, lab, q, letters) {
    if (card.classList.contains('locked')) return;
    card.classList.add('locked');
    var correct = Array.isArray(q.correct) ? q.correct[0] : q.correct;
    var right   = (chosen === correct);
    if (right) pbqAdv.qRight++;
    var buttons = card.querySelectorAll('.q-option');
    letters.forEach(function (letter, i) {
      buttons[i].disabled = true;
      if (letter === correct) buttons[i].classList.add('correct');
      else if (letter === chosen) buttons[i].classList.add('incorrect');
    });
    appendFeedback(card, right, q.explanation);
    appendAdvNextBtn(card, lab);
  }

  function gradeAdvMulti(selected, card, lab, q, letters) {
    if (card.classList.contains('locked')) return;
    card.classList.add('locked');
    var correct = Array.isArray(q.correct) ? q.correct : [q.correct];
    var right   = (selected.length === correct.length) &&
                  correct.every(function (c) { return selected.indexOf(c) !== -1; });
    if (right) pbqAdv.qRight++;
    var buttons = card.querySelectorAll('.q-option');
    letters.forEach(function (letter, i) {
      buttons[i].disabled = true;
      buttons[i].classList.remove('selected');
      if (correct.indexOf(letter) !== -1)  buttons[i].classList.add('correct');
      else if (selected.indexOf(letter) !== -1) buttons[i].classList.add('incorrect');
    });
    appendFeedback(card, right, q.explanation, true);
    var oldNav = card.querySelector('.q-nav');
    if (oldNav) oldNav.remove();
    appendAdvNextBtn(card, lab);
  }

  function appendAdvNextBtn(card, lab) {
    var isLastQ   = pbqAdv.qIdx + 1 >= lab.questions.length;
    var isLastLab = pbq.idx + 1 >= pbq.set.length;
    if (isLastQ) {
      pbq.results.push({
        correctRows: pbqAdv.qRight,
        total:       lab.questions.length,
        allRight:    pbqAdv.qRight === lab.questions.length
      });
    }
    var nav   = el('div', 'q-nav');
    var label = isLastQ ? (isLastLab ? 'See results →' : 'Next lab →') : 'Next question →';
    var next  = el('button', 'btn btn-primary', label);
    next.addEventListener('click', function () {
      pbqAdv.qIdx++;
      if (pbqAdv.qIdx < lab.questions.length) {
        renderPbqAdvQuestion(lab);
      } else {
        pbq.idx++;
        if (pbq.idx < pbq.set.length) renderPbq();
        else renderPbqResults();
      }
    });
    nav.appendChild(next);
    card.appendChild(nav);
    next.focus();
  }

  if (!BANK.length) {
    quizArea.innerHTML =
      '<div class="practice-card"><p class="muted">Question bank failed to load — ensure questions-v2.js is included.</p></div>';
    return;
  }
  Object.keys(DOMAIN_NAMES).forEach(function (k) {
    var o = el('option');
    o.value       = k;
    o.textContent = DOMAIN_NAMES[k];
    domainSel.appendChild(o);
  });
  updatePoolCount();
  setMode('quiz');
})();
