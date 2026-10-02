/* Binds the diagram pages' click actions (data-fn / data-arg) to the page's
 * global functions. Replaces inline onclick="" attributes so the diagrams' CSP
 * needs no 'unsafe-inline' for scripts. */
(function () {
  "use strict";
  Array.prototype.forEach.call(document.querySelectorAll("[data-fn]"), function (el) {
    var name = el.getAttribute("data-fn");
    var raw = el.getAttribute("data-arg");
    var hasArg = raw !== null;
    var arg;
    if (hasArg) {
      try {
        arg = JSON.parse(raw);
      } catch (e) {
        return;
      }
    }
    el.addEventListener("click", function () {
      var fn = window[name];
      if (typeof fn !== "function") return;
      if (hasArg) fn(arg);
      else fn();
    });
  });
})();
