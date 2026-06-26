/* ════════════════════════════════════════════════════════════
   assistant.js · Study assistant
   Two layers:
   1) Instant retrieval (no network) — routes a question to the best
      glossary definition and exact chapter section, with deep links.
   2) Optional in-browser AI (WebLLM / WebGPU) — generates a written
      answer grounded in the retrieved guide context. Opt-in: the model
      (~0.9 GB) downloads on first use and is then cached by the browser.
      No API key, no server, no cost. Falls back to layer 1 when WebGPU
      is unavailable. Reads window.GLOSSARY; uses a built-in section index.
════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Config ── */
  var WEBLLM_URL = '/lib/web-llm.js'; // self-hosted (same-origin) — no CDN, no redirect, reliable under strict CSP
  var MODEL = 'Llama-3.2-1B-Instruct-q4f16_1-MLC'; // ~0.9 GB download, stronger answers; swap for 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC' (smaller) if downloads struggle
  var LS_AI = 'sp_ai_enabled';

  var PAGE_SHORT = {
    'chapters1-2.html': 'Ch 1–2', 'chapter3.html': 'Ch 3',
    'chapters4-5.html': 'Ch 4–5', 'chapter6.html': 'Ch 6', 'chapter7.html': 'Ch 7',
    'chapter8.html': 'Ch 8', 'chapter9.html': 'Ch 9', 'chapter10.html': 'Ch 10',
    'chapter11.html': 'Ch 11'
  };

  /* Section index: p=page, a=anchor id, l=label, k=extra keywords */
  var SECTIONS = [
    { p: 'chapters1-2.html', a: 'cia', l: 'CIA Triad', k: 'confidentiality integrity availability triad core goals' },
    { p: 'chapters1-2.html', a: 'controls', l: 'Security Controls', k: 'control preventive detective corrective deterrent compensating directive technical managerial operational physical categories types' },
    { p: 'chapters1-2.html', a: 'data', l: 'Data Protection', k: 'pii phi tokenization masking steganography obfuscation classification' },
    { p: 'chapters1-2.html', a: 'crypto-basics', l: 'Key Stretching & PFS', k: 'cryptography key stretching perfect forward secrecy pbkdf2 hashing encryption salt' },
    { p: 'chapters1-2.html', a: 'logs', l: 'Logs & SIEM', k: 'logs logging siem syslog monitoring' },
    { p: 'chapters1-2.html', a: 'resilience', l: 'Resilience Terms', k: 'resilience redundancy scalability elasticity high availability' },
    { p: 'chapters1-2.html', a: 'aaa', l: 'AAA', k: 'authentication authorization accounting' },
    { p: 'chapters1-2.html', a: 'factors', l: 'Auth Factors & MFA', k: 'authentication factors mfa multifactor something you know have are somewhere' },
    { p: 'chapters1-2.html', a: 'otp', l: 'HOTP vs TOTP', k: 'otp hotp totp one time password token authenticator' },
    { p: 'chapters1-2.html', a: 'biometrics', l: 'Biometrics', k: 'biometrics fingerprint face far frr cer crossover error rate' },
    { p: 'chapters1-2.html', a: 'lifecycle', l: 'Account Lifecycle', k: 'account lifecycle provisioning deprovisioning onboarding offboarding' },
    { p: 'chapters1-2.html', a: 'pam', l: 'PAM & Least Privilege', k: 'privileged access management least privilege jit just in time' },
    { p: 'chapters1-2.html', a: 'sso', l: 'SSO & Federation', k: 'single sign on sso federation saml oauth openid connect' },
    { p: 'chapters1-2.html', a: 'models', l: 'Access Control Models', k: 'access control models dac mac rbac abac rule based discretionary mandatory role attribute' },
    { p: 'chapters1-2.html', a: 'anomalies', l: 'Anomaly Indicators', k: 'anomaly behavior indicators impossible travel' },
    { p: 'chapter3.html', a: 'osi', l: 'OSI Model', k: 'osi model layers physical data link network transport session presentation application' },
    { p: 'chapter3.html', a: 'core', l: 'Core Protocols', k: 'tcp udp icmp arp protocols handshake' },
    { p: 'chapter3.html', a: 'infra', l: 'DNS · DHCP · NTP', k: 'dns dhcp ntp infrastructure protocols name resolution' },
    { p: 'chapter3.html', a: 'addressing', l: 'IPv4 / IPv6', k: 'ip address ipv4 ipv6 rfc 1918 private subnet' },
    { p: 'chapter3.html', a: 'email', l: 'Email Stack', k: 'email smtp imap pop spf dkim dmarc mail' },
    { p: 'chapter3.html', a: 'web', l: 'Web · TLS · IPsec', k: 'web http https tls ssl ipsec encryption transport security' },
    { p: 'chapter3.html', a: 'files', l: 'File Transfer', k: 'ftp sftp ftps tftp file transfer' },
    { p: 'chapter3.html', a: 'remote', l: 'Remote Access', k: 'remote access ssh telnet rdp remote desktop' },
    { p: 'chapter3.html', a: 'voip', l: 'VoIP & Directory', k: 'voip sip ldap ldaps directory' },
    { p: 'chapter3.html', a: 'upgrade', l: 'Insecure → Secure Map', k: 'insecure secure protocol port replacement alternative map' },
    { p: 'chapter3.html', a: 'firewalls', l: 'Firewalls', k: 'firewall waf ngfw utm stateful stateless' },
    { p: 'chapter3.html', a: 'zones', l: 'Network Zones', k: 'network zones dmz screened subnet segmentation' },
    { p: 'chapter3.html', a: 'nat', l: 'NAT & PAT', k: 'nat pat network port address translation' },
    { p: 'chapter3.html', a: 'isolation', l: 'SCADA & Air Gaps', k: 'scada ics air gap isolation industrial' },
    { p: 'chapter3.html', a: 'proxy', l: 'Proxies', k: 'proxy forward reverse server' },
    { p: 'chapter3.html', a: 'zerotrust', l: 'Zero Trust', k: 'zero trust pep pdp policy enforcement decision point sase plane microsegmentation' },
    { p: 'chapters4-5.html', a: 'ids', l: 'IDS vs IPS', k: 'ids ips intrusion detection prevention signature anomaly span tap inline' },
    { p: 'chapters4-5.html', a: 'honeypots', l: 'Deception Tech', k: 'honeypot honeynet honeyfile honeytoken deception decoy' },
    { p: 'chapters4-5.html', a: 'wireless', l: 'Wireless Basics', k: 'wireless wifi 802.11 access point ssid' },
    { p: 'chapters4-5.html', a: 'wpa', l: 'WEP → WPA3', k: 'wep wpa wpa2 wpa3 psk sae encryption wireless security' },
    { p: 'chapters4-5.html', a: 'eap', l: 'EAP & 802.1X', k: 'eap peap leap 802.1x port based authentication' },
    { p: 'chapters4-5.html', a: 'wattacks', l: 'Wireless Attacks', k: 'wireless attacks evil twin rogue access point deauth disassociation bluesnarfing bluejacking' },
    { p: 'chapters4-5.html', a: 'vpn', l: 'VPNs', k: 'vpn ipsec split full tunnel site to site remote access' },
    { p: 'chapters4-5.html', a: 'nac', l: 'NAC', k: 'nac network access control posture' },
    { p: 'chapters4-5.html', a: 'authproto', l: 'RADIUS vs TACACS+', k: 'radius tacacs authentication aaa protocol' },
    { p: 'chapters4-5.html', a: 'virt', l: 'Virtualization', k: 'virtualization hypervisor vm escape sprawl type 1 2 bare metal hosted' },
    { p: 'chapters4-5.html', a: 'cloud', l: 'Cloud Models', k: 'cloud iaas paas saas shared responsibility model' },
    { p: 'chapters4-5.html', a: 'cloudsec', l: 'Cloud Security', k: 'cloud security casb iac sdn sase' },
    { p: 'chapters4-5.html', a: 'endpoint', l: 'Endpoint Defense', k: 'endpoint edr xdr antivirus defense response' },
    { p: 'chapters4-5.html', a: 'hardening', l: 'Hardening & Boot', k: 'hardening secure boot measured boot uefi baseline gold image' },
    { p: 'chapters4-5.html', a: 'encryption', l: 'TPM · HSM · FDE · DLP', k: 'tpm hsm fde sed dlp full disk encryption data loss prevention' },
    { p: 'chapters4-5.html', a: 'mobile', l: 'Mobile / MDM', k: 'mobile mdm byod cope cyod geofencing containerization device' },
    { p: 'chapters4-5.html', a: 'embedded', l: 'Embedded & IoT', k: 'embedded iot ics scada rtos real time' },
    { p: 'chapter6.html', a: 'actors', l: 'Threat Actors', k: 'threat actors nation state apt hacktivist insider script kiddie organized crime' },
    { p: 'chapter6.html', a: 'attributes', l: 'Attacker Attributes', k: 'attacker attributes resources sophistication internal external funding' },
    { p: 'chapter6.html', a: 'motivations', l: 'Motivations', k: 'motivations financial espionage chaos revenge political' },
    { p: 'chapter6.html', a: 'vectors', l: 'Threat Vectors', k: 'threat vectors supply chain attack vector' },
    { p: 'chapter6.html', a: 'surface', l: 'Attack Surface & Shadow IT', k: 'attack surface shadow it' },
    { p: 'chapter6.html', a: 'malware', l: 'Malware Types', k: 'malware virus worm trojan rat ransomware spyware rootkit keylogger logic bomb fileless botnet' },
    { p: 'chapter6.html', a: 'indicators', l: 'Malware Indicators', k: 'malware indicators infection signs compromise' },
    { p: 'chapter6.html', a: 'human', l: 'Human Vectors', k: 'social engineering human vectors' },
    { p: 'chapter6.html', a: 'phishing', l: 'Phishing Family', k: 'phishing spear phishing whaling vishing smishing pharming pretexting tailgating' },
    { p: 'chapter6.html', a: 'principles', l: 'SE Principles', k: 'social engineering principles authority urgency scarcity intimidation' },
    { p: 'chapter6.html', a: 'blocking', l: 'Blocking Malware', k: 'blocking malware antivirus signature heuristic fim file integrity monitoring' },
    { p: 'chapter6.html', a: 'intel', l: 'Threat Intelligence', k: 'threat intelligence stix taxii ioc osint ais feeds' },
    { p: 'chapter6.html', a: 'research', l: 'Research Sources', k: 'research sources osint dark web vulnerability databases' },
    { p: 'chapter7.html', a: 'dos', l: 'Denial of Service', k: 'dos ddos denial of service distributed resource exhaustion syn flood reflected amplified botnet flood availability indicator' },
    { p: 'chapter7.html', a: 'onpath', l: 'Spoofing & On-Path', k: 'spoofing forgery on path attack mitm man in the middle attacker in the browser ssl stripping replay credential replay' },
    { p: 'chapter7.html', a: 'dns', l: 'DNS Attacks', k: 'dns poisoning pharming url redirection domain hijacking cache' },
    { p: 'chapter7.html', a: 'dnsdefense', l: 'DNS & URL Defenses', k: 'dnssec dns filter sinkhole log files dns security extensions' },
    { p: 'chapter7.html', a: 'coding', l: 'Secure Coding', k: 'input validation client server side html escaping encoding race condition toctou error handling code obfuscation compiler outsourced code' },
    { p: 'chapter7.html', a: 'web', l: 'Web App Security', k: 'http headers general request entity cookie secure cookie code signing owasp' },
    { p: 'chapter7.html', a: 'analysis', l: 'Code Analysis & Secure Dev', k: 'static dynamic code analysis sast dast manual review fuzzing sandboxing package monitoring development testing staging production quality assurance qa stages' },
    { p: 'chapter7.html', a: 'injection', l: 'Injection & Memory Attacks', k: 'sql injection sqli database field query stored procedure parameterized ldap xml injection directory traversal cross site scripting xss reflected stored buffer overflow integer overflow memory leak dll injection dynamic link library web server logs' },
    { p: 'chapter7.html', a: 'automation', l: 'Automation & SOAR', k: 'soar security orchestration automation response user resource provisioning guardrails security groups ticket creation escalation enable disable services continuous integration testing cicd integration api apis scripting' },
    { p: 'chapter7.html', a: 'autotradeoffs', l: 'Automation Trade-offs', k: 'automation scripting benefits drawbacks efficiency baselines standard configuration secure scaling single point of failure technical debt supportability workforce multiplier' },
    { p: 'chapter11.html', a: 'data-classification', l: 'Data Classification', k: 'top secret secret confidential unclassified restricted public data classification government commercial data owner steward custodian controller processor roles sensitivity label' },
    { p: 'chapter11.html', a: 'regulated-data', l: 'Regulated & Sensitive Data', k: 'pii phi financial data intellectual property trade secret legal information data retention policy gdpr ccpa right to be forgotten data inventory regulated sensitive' },
    { p: 'chapter11.html', a: 'data-sanitization', l: 'Data Sanitization & Destruction', k: 'wiping degaussing physical destruction file shredding paper shredding pulping burning ssd overwrite certificate of destruction naid sanitization media disposal' },
    { p: 'chapter11.html', a: 'incident-response', l: 'Incident Response', k: 'nist sp 800-61 incident response plan preparation detection analysis containment eradication recovery post-incident lessons learned ir team communication plan threat hunting security incident data breach' },
    { p: 'chapter11.html', a: 'digital-forensics', l: 'Digital Forensics & Legal Holds', k: 'digital forensics order of volatility ram memory forensic artifacts file metadata email rdp cache os forensics prefetch registry event logs legal hold ediscovery chain of custody spoliation' },
    { p: 'chapter11.html', a: 'soar', l: 'SOAR & Automation', k: 'soar security orchestration automation response siem playbook runbook ttp tactics techniques procedures stix taxii mttr' },
    { p: 'chapter11.html', a: 'governance', l: 'Security Governance', k: 'governance board ciso security committee centralized decentralized policy standard procedure guideline sdlc onboarding offboarding eol eosl end of life service monitoring revision' },
    { p: 'chapter11.html', a: 'legal-agreements', l: 'Legal Agreements & Compliance', k: 'sla mou nda msa bpa rules of engagement right to audit due diligence conflicts of interest attestation acknowledgement ccpa right to be forgotten data inventory service level agreement memorandum of understanding' },
    { p: 'chapter11.html', a: 'awareness', l: 'Security Awareness Training', k: 'security awareness training computer based training cbt phishing simulation insider threat password management removable media usb cables social engineering opsec operational security hybrid remote work' }
  ];

  var STOP = {};
  ('what is the a an of to in on for and or how do does are i my me explain define whats tell about question answer which when why best most least first explanation mean means difference between vs').split(' ').forEach(function (w) { STOP[w] = 1; });

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function tokenize(q) {
    var seen = {}, out = [];
    String(q).toLowerCase().replace(/[^a-z0-9+]+/g, ' ').split(' ').forEach(function (w) {
      if (w.length >= 2 && !STOP[w] && !seen[w]) { seen[w] = 1; out.push(w); }
    });
    return out;
  }

  var GLOSSARY = window.GLOSSARY || [];

  function searchGlossary(q, tokens) {
    var nq = q.toLowerCase();
    return GLOSSARY.map(function (e) {
      var s = 0;
      var tl = e.t.toLowerCase(), fl = (e.f || '').toLowerCase(), dl = e.d.toLowerCase();
      if (tl.length > 2 && nq.indexOf(tl) > -1) s += 25;            // whole term appears in question
      var termWords = tl.split(/[^a-z0-9+]+/);
      tokens.forEach(function (t) {
        if (tl === t) s += 40;                                       // exact acronym/term
        else if (termWords.indexOf(t) > -1) s += 12;
        else if (fl && fl.split(/[^a-z0-9]+/).indexOf(t) > -1) s += 5;
        else if (dl.indexOf(t) > -1) s += 1;
      });
      return { e: e, s: s };
    }).filter(function (r) { return r.s >= 8; }).sort(function (a, b) { return b.s - a.s; });
  }

  function searchSections(tokens) {
    return SECTIONS.map(function (sec) {
      var ll = sec.l.toLowerCase(), kl = sec.k.toLowerCase(), s = 0;
      tokens.forEach(function (t) {
        if (ll.indexOf(t) > -1) s += 3;
        if (kl.split(' ').indexOf(t) > -1) s += 2;
      });
      return { sec: sec, s: s };
    }).filter(function (r) { return r.s > 0; }).sort(function (a, b) { return b.s - a.s; });
  }

  /* Build a compact context string for the LLM from retrieval hits. */
  function buildContext(q, tokens) {
    var gl = searchGlossary(q, tokens), secs = searchSections(tokens);
    var lines = [];
    gl.slice(0, 3).forEach(function (r) {
      var e = r.e;
      lines.push('- ' + e.t + (e.f ? ' (' + e.f + ')' : '') + ': ' + e.d);
    });
    secs.slice(0, 4).forEach(function (r) {
      lines.push('- Guide section: "' + r.sec.l + '" (' + (PAGE_SHORT[r.sec.p] || r.sec.p) + ')');
    });
    return lines.join('\n');
  }

  /* Retrieval answer (instant, no network) — glossary definition + where to study. */
  function retrievalAnswer(q, tokens) {
    var gl = searchGlossary(q, tokens), secs = searchSections(tokens);
    if (!gl.length && !secs.length) {
      return '<div class="ai-empty">I couldn\'t find a match in the guide. Try a keyword (e.g. <em>SSH</em>, <em>zero trust</em>, <em>phishing</em>), or browse the <a href="glossary.html">Glossary</a> and <a href="index.html#chapters">chapters</a>.</div>';
    }
    var html = '';
    if (gl.length) {
      var e = gl[0].e;
      html += '<div class="ai-answer"><div class="ai-a-term">' + esc(e.t) + (e.f ? ' <span class="ai-a-exp">' + esc(e.f) + '</span>' : '') + '</div>' +
        '<div class="ai-a-def">' + esc(e.d) + '</div>' +
        '<a class="ai-a-more" href="glossary.html?q=' + encodeURIComponent(e.t) + '">Open in Glossary →</a></div>';
      if (gl[1] && gl[1].s >= 12) {
        var e2 = gl[1].e;
        html += '<div class="ai-related">Related term: <a href="glossary.html?q=' + encodeURIComponent(e2.t) + '">' + esc(e2.t) + '</a></div>';
      }
    }
    if (secs.length) {
      html += '<div class="ai-where">📍 Where to study this</div><div class="ai-links">';
      secs.slice(0, 4).forEach(function (r) {
        var sec = r.sec;
        html += '<a class="ai-link" href="' + sec.p + '#' + sec.a + '"><span class="ai-link-l">' + esc(sec.l) + '</span><span class="ai-link-p">' + (PAGE_SHORT[sec.p] || '') + '</span></a>';
      });
      html += '</div>';
    }
    html += '<div class="ai-foot"><a href="practice.html">Practice quiz →</a><a href="glossary.html">Full glossary →</a></div>';
    return html;
  }

  /* ════════ In-browser AI (WebLLM) ════════ */
  var ai = {
    supported: (typeof navigator !== 'undefined' && !!navigator.gpu),
    state: 'idle',          // idle | loading | ready | error
    engine: null,
    loadPromise: null,
    onProgress: null        // set by UI
  };

  function loadEngine() {
    if (ai.loadPromise) return ai.loadPromise;
    ai.state = 'loading';
    ai.loadPromise = import(/* webpackIgnore: true */ WEBLLM_URL).then(function (webllm) {
      // Cache weights in IndexedDB instead of the Cache API — avoids the
      // "Cache.add() encountered a network error" failure that the Cache API
      // hits on Hugging Face's cross-origin redirected model files.
      var appConfig = Object.assign({}, webllm.prebuiltAppConfig, { useIndexedDBCache: true });
      return webllm.CreateMLCEngine(MODEL, {
        appConfig: appConfig,
        initProgressCallback: function (p) { if (ai.onProgress) ai.onProgress(p); }
      });
    }).then(function (engine) {
      ai.engine = engine; ai.state = 'ready';
      try { localStorage.setItem(LS_AI, '1'); } catch (e) {}
      return engine;
    }).catch(function (err) {
      ai.state = 'error'; ai.loadPromise = null;
      throw err;
    });
    return ai.loadPromise;
  }

  /* Stream an answer; calls onToken(fullText) as tokens arrive. */
  function generate(q, context, onToken) {
    var sys = 'You are a concise, accurate CompTIA Security+ (SY0-701) tutor embedded in a study guide. ' +
      'Use the STUDY GUIDE CONTEXT below when it is relevant; if it does not cover the question, answer from general Security+ knowledge but stay accurate and exam-focused. ' +
      'Keep answers under ~120 words. If the user pasted a multiple-choice question, state the correct option and give a one-sentence reason. ' +
      'Never invent port numbers, acronyms, or facts.';
    var user = 'STUDY GUIDE CONTEXT:\n' + (context || '(no direct match found in the guide)') + '\n\nQUESTION:\n' + q;
    return ai.engine.chat.completions.create({
      messages: [{ role: 'system', content: sys }, { role: 'user', content: user }],
      temperature: 0.3, max_tokens: 400, stream: true
    }).then(function (chunks) {
      var acc = '';
      return (function pump(iter) {
        return iter.next().then(function (res) {
          if (res.done) return acc;
          var d = res.value && res.value.choices && res.value.choices[0] && res.value.choices[0].delta;
          if (d && d.content) { acc += d.content; onToken(acc); }
          return pump(iter);
        });
      })(chunks[Symbol.asyncIterator]());
    });
  }

  /* ── UI injection ── */
  function build() {
    var launcher = document.createElement('button');
    launcher.className = 'ai-launcher';
    launcher.type = 'button';
    launcher.setAttribute('aria-label', 'Open study assistant');
    launcher.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 1.3 4.7L3 21l4.5-1.2A9 9 0 1 0 12 3Z"/><path d="M9 11h6M9 14h4"/></svg><span>Ask</span>';

    var panel = document.createElement('aside');
    panel.className = 'ai-panel';
    panel.setAttribute('aria-label', 'Study assistant');
    panel.innerHTML =
      '<div class="ai-head"><div><strong>Study Assistant</strong><span class="ai-sub">AI answers + links into the guide</span></div>' +
      '<button class="ai-close" type="button" aria-label="Close">✕</button></div>' +
      '<div class="ai-body" id="aiBody">' +
        '<div class="ai-intro">Ask about any Security+ topic, or paste a quiz question. You get an instant guide match, plus an optional AI-written answer that runs <strong>privately in your browser</strong> (no account, no cost).</div>' +
        '<div class="ai-suggest" id="aiSuggest"></div>' +
      '</div>' +
      '<form class="ai-form" id="aiForm"><textarea id="aiInput" rows="2" placeholder="e.g. What port does SSH use? · Explain zero trust"></textarea>' +
      '<button class="ai-send" type="submit" aria-label="Ask">→</button></form>';

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    var body = panel.querySelector('#aiBody');
    var input = panel.querySelector('#aiInput');
    var form = panel.querySelector('#aiForm');
    var suggest = panel.querySelector('#aiSuggest');

    ['What port does SSH use?', 'Explain zero trust', 'What is a worm?', 'IDS vs IPS'].forEach(function (s) {
      var c = document.createElement('button');
      c.type = 'button'; c.className = 'ai-s-chip'; c.textContent = s;
      c.addEventListener('click', function () { input.value = s; ask(); });
      suggest.appendChild(c);
    });

    function open() { panel.classList.add('open'); launcher.classList.add('hidden'); setTimeout(function () { input.focus(); }, 150); }
    function close() { panel.classList.remove('open'); launcher.classList.remove('hidden'); }

    function ask() {
      var q = input.value.trim();
      if (!q) return;
      var tokens = tokenize(q);
      if (!tokens.length) {
        body.innerHTML = '<div class="ai-empty">Type a topic or paste a quiz question — I\'ll answer and point you to the section that covers it.</div>';
        return;
      }
      var llmHost = document.createElement('div');   // AI answer block (top)
      var retr = document.createElement('div');      // retrieval block (always)
      retr.innerHTML = retrievalAnswer(q, tokens);
      body.innerHTML = '';
      body.appendChild(Object.assign(document.createElement('div'), { className: 'ai-asked', textContent: q }));
      body.appendChild(llmHost);
      body.appendChild(retr);
      body.scrollTop = 0;
      renderAI(llmHost, q, tokens);
    }

    /* Renders the AI section: enable button, progress, or streamed answer. */
    function renderAI(host, q, tokens) {
      if (!ai.supported) {
        host.innerHTML = '<div class="ai-note">💡 AI answers need a WebGPU browser (Chrome, Edge, or Safari 18+). Showing guide matches below.</div>';
        return;
      }
      var enabled = false;
      try { enabled = localStorage.getItem(LS_AI) === '1'; } catch (e) {}

      if (ai.state === 'ready') { runGen(host, q, tokens); return; }

      if (!enabled && ai.state === 'idle') {
        host.innerHTML =
          '<div class="ai-llm"><div class="ai-llm-head">✨ AI answer</div>' +
          '<div class="ai-note">Generate a written answer with a small AI model that runs in your browser. ' +
          'First use downloads the model (~0.9&nbsp;GB), then it\'s cached for next time.</div>' +
          '<button type="button" class="ai-gen-btn">Generate AI answer</button></div>';
        host.querySelector('.ai-gen-btn').addEventListener('click', function () { runGen(host, q, tokens); });
        return;
      }
      // enabled previously, or mid-load → go straight to generation (which loads if needed)
      runGen(host, q, tokens);
    }

    function runGen(host, q, tokens) {
      host.innerHTML =
        '<div class="ai-llm"><div class="ai-llm-head">✨ AI answer <span class="ai-llm-tag">in-browser</span></div>' +
        '<div class="ai-progress" hidden><div class="ai-progress-bar"><span></span></div><div class="ai-progress-txt"></div></div>' +
        '<div class="ai-llm-body"><span class="ai-typing">Thinking…</span></div>' +
        '<div class="ai-disclaim">Generated locally by ' + esc(MODEL.split('-').slice(0, 2).join(' ')) + ' — verify against the linked sections.</div></div>';
      var prog = host.querySelector('.ai-progress');
      var bar = host.querySelector('.ai-progress-bar span');
      var ptxt = host.querySelector('.ai-progress-txt');
      var out = host.querySelector('.ai-llm-body');

      ai.onProgress = function (p) {
        prog.hidden = false;
        var pct = Math.round((p.progress || 0) * 100);
        bar.style.width = pct + '%';
        ptxt.textContent = (p.text || 'Loading model…').replace(/\[.*?\]\s*/, '');
      };

      var ready = ai.state === 'ready' ? Promise.resolve(ai.engine) : loadEngine();
      ready.then(function () {
        prog.hidden = true;
        out.innerHTML = '<span class="ai-typing">Thinking…</span>';
        var context = buildContext(q, tokens);
        return generate(q, context, function (full) {
          out.textContent = full;
          body.scrollTop = host.offsetTop;
        });
      }).then(function (full) {
        if (!full || !out.textContent.trim()) out.innerHTML = '<div class="ai-note">No answer generated — see the guide matches below.</div>';
      }).catch(function (err) {
        prog.hidden = true;
        out.innerHTML = '<div class="ai-note">⚠️ Couldn\'t run the AI model (' + esc(String(err && err.message || err).slice(0, 80)) +
          '). Your browser may not support WebGPU, or the download was blocked. The guide matches below still work.</div>';
      });
    }

    launcher.addEventListener('click', open);
    panel.querySelector('.ai-close').addEventListener('click', close);
    form.addEventListener('submit', function (ev) { ev.preventDefault(); ask(); });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && panel.classList.contains('open')) close(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
