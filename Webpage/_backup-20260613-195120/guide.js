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
