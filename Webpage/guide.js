/* Shared behavior: TOC scroll-spy + back-to-top button */
(function () {
  'use strict';

  /* ── Back to top ── */
  var btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(btn);

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      btn.classList.toggle('show', window.scrollY > 600);
      ticking = false;
    });
  }, { passive: true });

  /* ── TOC scroll-spy ── */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  if (!tocLinks.length || !('IntersectionObserver' in window)) return;

  var map = {};
  tocLinks.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    var sec = document.getElementById(id);
    if (sec) map[id] = a;
  });

  var current = null;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var link = map[entry.target.id];
      if (!link || link === current) return;
      if (current) current.classList.remove('active');
      link.classList.add('active');
      current = link;
    });
  }, { rootMargin: '-70px 0px -65% 0px', threshold: 0 });

  Object.keys(map).forEach(function (id) {
    observer.observe(document.getElementById(id));
  });
})();

/* ── Home page enhancements: reveal, count-up, weight bars, pass gauge ──
   All guarded — these only act when the relevant elements exist (index.html). */
(function () {
  'use strict';
  if (!('IntersectionObserver' in window)) {
    // Fallback: reveal everything immediately
    Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) { el.classList.add('in'); });
    return;
  }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reveal + fill weight bars on scroll */
  var revealItems = document.querySelectorAll('.reveal');
  if (revealItems.length) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        var bars = e.target.querySelectorAll ? e.target.querySelectorAll('.bar > span') : [];
        Array.prototype.forEach.call(bars, function (s) { s.style.width = (s.dataset.w || 0) + '%'; });
        rio.unobserve(e.target);
      });
    }, { threshold: 0.18 });
    Array.prototype.forEach.call(revealItems, function (el) { rio.observe(el); });
  }

  /* Count-up hero stats */
  function countUp(el) {
    var target = +el.dataset.count;
    var suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = target + suffix; return; }
    var cur = 0, step = Math.max(1, Math.round(target / 38));
    var t = setInterval(function () {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = cur + suffix;
    }, 22);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    Array.prototype.forEach.call(counters, function (el) { cio.observe(el); });
  }

  /* Animate pass-score gauge (750/900 ≈ 83%) */
  var g = document.getElementById('gauge');
  if (g) {
    var gio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        if (reduce) { g.style.setProperty('--p', 83); }
        else { g.style.setProperty('--p', 0); setTimeout(function () { g.style.setProperty('--p', 83); }, 120); }
        gio.unobserve(g);
      });
    }, { threshold: 0.5 });
    gio.observe(g);
  }
})();
