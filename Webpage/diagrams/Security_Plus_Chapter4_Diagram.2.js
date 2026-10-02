/* Declutter: flip the single toggle button label between Graph View / Bubble View */
document.addEventListener('DOMContentLoaded', function () {
  var b = document.getElementById('btn-graph');
  if (!b) return;
  function upd() {
    var cv = document.getElementById('canvas'), gv = document.getElementById('graph-view');
    var active = (cv && cv.style.display === 'none') || (gv && gv.classList.contains('visible'));
    b.textContent = active ? '🫧 Bubble View' : '🗺 Graph View';
  }
  if (!gGraphActive) { toggleGraphView(); }
  b.addEventListener('click', function () { setTimeout(upd, 0); });
  upd();
});
