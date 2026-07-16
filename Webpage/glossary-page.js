/* glossary-page.js · search, filter, and render the Security+ glossary */
(function () {
  "use strict";
  var BANK = (window.GLOSSARY || []).slice();
  var CAT_NAMES = {
    Core: "Core Concepts",
    Crypto: "Cryptography & PKI",
    IAM: "Identity & Access",
    Network: "Network Security",
    Threats: "Threats & Attacks",
    Malware: "Malware",
    SocEng: "Social Engineering",
    Cloud: "Architecture & Cloud",
    Data: "Data Protection",
    Ops: "Operations & Monitoring",
    IR: "Incident Response & Forensics",
    GRC: "Governance, Risk & Compliance",
    Wireless: "Wireless",
    Endpoint: "Endpoint & Mobile",
  };
  var CAT_ORDER = [
    "Core",
    "Crypto",
    "IAM",
    "Network",
    "Threats",
    "Malware",
    "SocEng",
    "Cloud",
    "Data",
    "Ops",
    "IR",
    "GRC",
    "Wireless",
    "Endpoint",
  ];
  var CHAPTER_NAMES = {
    1: "Ch 1 · Security Basics",
    2: "Ch 2 · Identity & Access",
    3: "Ch 3 · Network Technologies",
    4: "Ch 4 · Securing Networks",
    5: "Ch 5 · Securing Hosts & Data",
    6: "Ch 6 · Threats & Attacks",
    7: "Ch 7 · Advanced Attacks",
    8: "Ch 8 · Risk Management",
    9: "Ch 9 · Protecting Assets",
    10: "Ch 10 · Cryptography & PKI",
    11: "Ch 11 · Policies & Incident Response",
  };

  var listEl = document.getElementById("glossaryList");
  var searchEl = document.getElementById("glossarySearch");
  var chipsEl = document.getElementById("glossaryChips");
  var chapterEl = document.getElementById("glossaryChapter");
  var countEl = document.getElementById("glossaryCount");
  if (!listEl) return;
  if (!BANK.length) {
    listEl.innerHTML = '<p class="muted">Glossary failed to load.</p>';
    return;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function norm(s) {
    return String(s).toLowerCase();
  }

  BANK.sort(function (a, b) {
    return norm(a.t).localeCompare(norm(b.t));
  });

  var query = "",
    activeCat = "all",
    activeChapter = "all";

  /* build category chips */
  var present = CAT_ORDER.filter(function (c) {
    return BANK.some(function (e) {
      return e.c === c;
    });
  });
  function chip(value, label, n) {
    var b = document.createElement("button");
    b.className = "g-chip" + (value === activeCat ? " active" : "");
    b.dataset.cat = value;
    b.innerHTML =
      esc(label) +
      (n != null ? ' <span class="g-chip-n">' + n + "</span>" : "");
    b.addEventListener("click", function () {
      activeCat = value;
      Array.prototype.forEach.call(chipsEl.children, function (c) {
        c.classList.toggle("active", c.dataset.cat === value);
      });
      render();
    });
    return b;
  }
  chipsEl.appendChild(chip("all", "All", BANK.length));
  present.forEach(function (c) {
    chipsEl.appendChild(
      chip(
        c,
        CAT_NAMES[c] || c,
        BANK.filter(function (e) {
          return e.c === c;
        }).length,
      ),
    );
  });

  /* build chapter dropdown */
  if (chapterEl) {
    var chaptersPresent = [];
    for (var chNum = 1; chNum <= 11; chNum++) {
      if (
        BANK.some(function (e) {
          return e.ch === chNum;
        })
      )
        chaptersPresent.push(chNum);
    }
    chaptersPresent.forEach(function (chNum) {
      var opt = document.createElement("option");
      opt.value = String(chNum);
      opt.textContent =
        (CHAPTER_NAMES[chNum] || "Chapter " + chNum) +
        " (" +
        BANK.filter(function (e) {
          return e.ch === chNum;
        }).length +
        ")";
      chapterEl.appendChild(opt);
    });
    chapterEl.addEventListener("change", function () {
      activeChapter = chapterEl.value;
      render();
    });
  }

  function matches(e) {
    if (activeCat !== "all" && e.c !== activeCat) return false;
    if (activeChapter !== "all" && String(e.ch) !== activeChapter) return false;
    if (!query) return true;
    return (
      norm(e.t).indexOf(query) > -1 ||
      norm(e.f).indexOf(query) > -1 ||
      norm(e.d).indexOf(query) > -1 ||
      (e.p ? norm(e.p).indexOf(query) > -1 : false)
    );
  }

  function render() {
    var items = BANK.filter(matches);
    countEl.textContent =
      "Showing " + items.length + " of " + BANK.length + " terms";
    if (!items.length) {
      listEl.innerHTML =
        '<div class="g-empty">No terms match your search. Try a different word or clear the filter.</div>';
      return;
    }
    var html = "",
      curLetter = "";
    items.forEach(function (e) {
      var letter = /[a-z]/i.test(e.t[0]) ? e.t[0].toUpperCase() : "#";
      if (letter !== curLetter) {
        curLetter = letter;
        html +=
          '<div class="g-letter" id="g-' + letter + '">' + letter + "</div>";
      }
      var exp = e.f ? '<span class="g-exp">' + esc(e.f) + "</span>" : "";
      var chTag = e.ch
        ? '<span class="g-tag g-tag-ch" title="' +
          esc(CHAPTER_NAMES[e.ch] || "Chapter " + e.ch) +
          '">Ch ' +
          e.ch +
          "</span>"
        : "";
      var portTag = e.p
        ? '<span class="g-tag g-tag-port" title="Port ' +
          esc(e.p) +
          '">Port ' +
          esc(e.p) +
          "</span>"
        : "";
      html +=
        '<div class="g-entry">' +
        '<div class="g-term">' +
        esc(e.t) +
        exp +
        '<span class="g-tag">' +
        esc(CAT_NAMES[e.c] || e.c) +
        "</span>" +
        chTag +
        portTag +
        "</div>" +
        '<div class="g-def">' +
        esc(e.d) +
        "</div></div>";
    });
    listEl.innerHTML = html;
  }

  searchEl.addEventListener("input", function () {
    query = norm(searchEl.value.trim());
    render();
  });

  /* Prefill from ?q= (used by the study assistant's "Open in Glossary" links)
     and ?ch= (used by chapter-page "Glossary for this chapter" links) */
  try {
    var params = new URLSearchParams(window.location.search);
    var qp = params.get("q");
    if (qp) {
      searchEl.value = qp;
      query = norm(qp.trim());
    }
    var chp = params.get("ch");
    if (chp && chapterEl && CHAPTER_NAMES[chp]) {
      chapterEl.value = chp;
      activeChapter = chp;
    }
  } catch (e) {
    /* ignore */
  }

  render();
})();
