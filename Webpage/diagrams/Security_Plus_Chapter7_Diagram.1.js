/* ═══════════════════════════════════════════════════
   NODE DATA — detail panel content
═══════════════════════════════════════════════════ */
const NODE_DATA = {

/* ── Denial of Service ── */
'dos': { title:'DoS — Denial of Service', cat:'Denial of Service', html:`
  <p>An attack that makes a system or service <strong>unavailable</strong> to legitimate users, almost always through resource exhaustion. A <strong>single</strong> source.</p>
  <div class="exam-tip">DoS = one attacker; DDoS = many. Both attack the <strong>availability</strong> leg of the CIA triad.</div>` },
'ddos': { title:'DDoS — Distributed Denial of Service', cat:'Denial of Service', html:`
  <p>A DoS launched from <strong>many machines at once</strong> — usually a <strong>botnet</strong> of compromised hosts — so the flood is far larger and can't be stopped by blocking one IP.</p>` },
'resource-exhaustion': { title:'Resource Exhaustion', cat:'Denial of Service', html:`
  <p>The core mechanism of denial of service: consuming <strong>bandwidth, memory, CPU, or connection-table slots</strong> until nothing is left for real requests.</p>` },
'syn-flood': { title:'SYN Flood', cat:'Denial of Service', html:`
  <p>Sends a storm of TCP <strong>SYN</strong> packets but never completes the three-way handshake, filling the <strong>connection table</strong> with half-open connections.</p>
  <div class="exam-tip">Mitigated with SYN cookies — the server doesn't allocate state until the handshake completes.</div>` },
'reflected-ddos': { title:'Reflected DDoS', cat:'Denial of Service', html:`
  <p>The attacker <strong>spoofs the victim's source IP</strong> and sends requests to third-party servers, which send their replies <em>to the victim</em>. The victim is buried by responses it never asked for.</p>` },
'amplified-ddos': { title:'Amplified DDoS', cat:'Denial of Service', html:`
  <p>A reflected attack using protocols where a <strong>tiny request triggers a huge reply</strong> (DNS, NTP, memcached). Amplification multiplies the attacker's bandwidth many times over.</p>
  <div class="exam-tip">"Small spoofed query → massive response" is the signature of amplification.</div>` },
'indicator': { title:'Indicator', cat:'Denial of Service', html:`
  <p>The observable <strong>sign</strong> of an attack — a traffic spike, a flood of half-open connections, a service timing out. The exam often gives the indicator and asks you to name the attack.</p>` },

/* ── Spoofing & On-Path ── */
'spoofing': { title:'Spoofing', cat:'Spoofing & On-Path', html:`
  <p>Falsifying an identifier — source <strong>IP, MAC, email address, or caller ID</strong> — to impersonate a trusted source and set up a larger attack.</p>` },
'forgery': { title:'Forgery', cat:'Spoofing & On-Path', html:`
  <p>Creating <strong>fraudulent data</strong> (a forged request, token, or certificate) so a system treats it as genuine.</p>` },
'on-path': { title:'On-Path Attack (MITM)', cat:'Spoofing & On-Path', html:`
  <p>An attacker secretly <strong>relays or alters traffic</strong> between two parties who believe they're talking directly — the modern name for man-in-the-middle.</p>
  <div class="exam-tip">Defeated by end-to-end encryption (TLS) and mutual authentication.</div>` },
'aitb': { title:'Attacker-in-the-Browser', cat:'Spoofing & On-Path', html:`
  <p>Also called <strong>man-in-the-browser</strong>. Malware or a malicious extension alters pages and transactions <em>after</em> TLS has decrypted them — so encryption can't stop it.</p>
  <div class="exam-tip">If TLS "should" protect the session but doesn't, suspect compromise on the endpoint itself.</div>` },
'ssl-stripping': { title:'SSL Stripping', cat:'Spoofing & On-Path', html:`
  <p>An on-path attacker <strong>downgrades</strong> a victim's HTTPS connection to plain HTTP, then reads everything in cleartext.</p>
  <div class="exam-tip">Fixed with <strong>HSTS</strong>, which forces browsers to use HTTPS so there's no plaintext to strip.</div>` },
'replay': { title:'Replay Attack', cat:'Spoofing & On-Path', html:`
  <p>Captures valid traffic and <strong>re-sends</strong> it to repeat an action or impersonate a user. Defeated by <strong>nonces, timestamps, and session tokens</strong>.</p>` },
'credential-replay': { title:'Credential Replay', cat:'Spoofing & On-Path', html:`
  <p>A replay attack reusing captured <strong>authentication data</strong> (a hash, ticket, or token) to log in without knowing the password. Countered by one-time tokens, MFA, and short-lived tickets.</p>` },

/* ── DNS Attacks ── */
'dns-poisoning': { title:'DNS Poisoning', cat:'DNS Attacks', html:`
  <p>Corrupting a DNS resolver's <strong>cache</strong> so a legitimate name resolves to the attacker's IP address.</p>` },
'pharming': { title:'Pharming', cat:'DNS Attacks', html:`
  <p>The result of poisoning at scale: silently <strong>redirecting users from a legitimate site to a fake one</strong> with no click required.</p>
  <div class="exam-tip">Phishing lures you to click; pharming redirects you automatically via poisoned DNS.</div>` },
'url-redirection': { title:'URL Redirection', cat:'DNS Attacks', html:`
  <p>Sending a user to a different destination than expected — via a malicious link, a compromised page, or an <strong>open redirect</strong> on a trusted site.</p>` },
'domain-hijacking': { title:'Domain Hijacking', cat:'DNS Attacks', html:`
  <p>Taking control of a domain's <strong>registration</strong> — through stolen registrar credentials or social engineering — to reroute all of its traffic.</p>` },
'url': { title:'URL — Uniform Resource Locator', cat:'DNS Attacks', html:`
  <p>The full web address a user types or clicks. Because users trust the name and rarely check the resolved IP, the URL and the DNS behind it are prime targets.</p>` },

/* ── DNS & URL Defenses ── */
'dnssec': { title:'DNSSEC — DNS Security Extensions', cat:'DNS & URL Defenses', html:`
  <p>Adds <strong>digital signatures</strong> to DNS records so resolvers can verify a response is authentic and unaltered — defeating poisoning.</p>
  <div class="exam-tip">DNSSEC authenticates (origin + integrity); it does <strong>not</strong> encrypt DNS traffic.</div>` },
'dns-filter': { title:'DNS Filtering', cat:'DNS & URL Defenses', html:`
  <p>Blocks resolution of known-malicious or policy-violating domains — users simply can't reach them. A common first line of web/content filtering.</p>` },
'dns-sinkhole': { title:'DNS Sinkhole', cat:'DNS & URL Defenses', html:`
  <p>Returns a <strong>false (controlled) answer</strong> for malicious domains, pointing malware callbacks to a dead end or a monitoring host instead of the real C2 server.</p>` },
'dns-logs': { title:'DNS Log Files', cat:'DNS & URL Defenses', html:`
  <p>Records every query the network makes. Invaluable for detecting <strong>beaconing to suspicious domains</strong>, DNS-based exfiltration, and which host is infected.</p>` },

/* ── Secure Coding ── */
'input-validation': { title:'Input Validation', cat:'Secure Coding', html:`
  <p>Checking that input matches the expected type, length, format, and range before use. The single most important defense against injection.</p>` },
'client-validation': { title:'Client-Side Validation', cat:'Secure Coding', html:`
  <p>Validation in the browser — fast feedback for users, but <strong>trivially bypassed</strong>. Never trust it for security.</p>` },
'server-validation': { title:'Server-Side Validation', cat:'Secure Coding', html:`
  <p>Validation on the server, where an attacker can't tamper with it — the <strong>authoritative</strong> check.</p>
  <div class="exam-tip">When the choice is client vs server, the secure answer is always server-side.</div>` },
'html-escaping': { title:'HTML Escaping / Encoding', cat:'Secure Coding', html:`
  <p>Converting special characters (<code>&lt; &gt; &amp; "</code>) into safe entities so input renders as <strong>text, not code</strong> — the fix for XSS at output.</p>` },
'race-condition': { title:'Race Condition (TOCTOU)', cat:'Secure Coding', html:`
  <p>A flaw where the outcome depends on timing. The classic form is <strong>Time-of-Check to Time-of-Use</strong>: a resource is validated, then changed in the gap before it's used. Fixed with locking and atomic operations.</p>` },
'error-handling': { title:'Error Handling', cat:'Secure Coding', html:`
  <p>Catching errors and returning <strong>generic</strong> messages. Verbose errors leak stack traces, file paths, and database structure to attackers.</p>` },
'obfuscation': { title:'Code Obfuscation', cat:'Secure Coding', html:`
  <p>Deliberately making code hard to read or reverse-engineer. Raises the bar for attackers, but is <strong>not a substitute</strong> for real controls.</p>` },
'compiler': { title:'Compiler', cat:'Secure Coding', html:`
  <p>Translates human-written <strong>source code into executable machine code</strong>. Secure compilers add protections like stack canaries against buffer overflows.</p>` },
'outsourced-code': { title:'Outsourced Code Vulnerabilities', cat:'Secure Coding', html:`
  <p>Flaws or backdoors introduced by <strong>third-party, contracted, or library code</strong> you didn't write. Review and monitor it like your own.</p>` },

/* ── Web App Security ── */
'http-headers': { title:'HTTP Headers', cat:'Web App Security', html:`
  <p>Metadata sent with every request/response. <strong>General headers</strong> apply to both, <strong>request headers</strong> carry client info, and <strong>entity headers</strong> describe the body (content type, length). Security headers like HSTS and CSP harden the app.</p>` },
'cookies': { title:'Cookie', cat:'Web App Security', html:`
  <p>Stores session state in the browser so the server can recognize a returning user. A prime theft target because stealing it can hijack a session.</p>` },
'secure-cookie': { title:'Secure Cookie', cat:'Web App Security', html:`
  <p>A cookie with the <code>Secure</code> flag (sent only over HTTPS) and usually <code>HttpOnly</code> (hidden from JavaScript) to resist theft via XSS.</p>` },
'code-signing': { title:'Code Signing', cat:'Web App Security', html:`
  <p>Digitally signing software with the publisher's private key so users can verify <strong>authenticity and integrity</strong> — the code is from the stated author and untampered.</p>` },
'owasp': { title:'OWASP', cat:'Web App Security', html:`
  <p>The <strong>Open Worldwide Application Security Project</strong> — a nonprofit behind the well-known <strong>OWASP Top 10</strong> list of the most critical web application risks.</p>` },

/* ── Code Analysis ── */
'static-analysis': { title:'Static Code Analysis (SAST)', cat:'Code Analysis', html:`
  <p>Inspects source code <strong>without running it</strong>, finding flaws early in development. "Analyzing the code."</p>` },
'manual-review': { title:'Manual Code Review', cat:'Code Analysis', html:`
  <p>Humans read the code line by line, catching <strong>logic and design flaws</strong> that automated tools miss.</p>` },
'dynamic-analysis': { title:'Dynamic Code Analysis (DAST)', cat:'Code Analysis', html:`
  <p>Tests the application <strong>while it runs</strong>, finding runtime flaws. "Observing/receiving behavior."</p>` },
'fuzzing': { title:'Fuzzing', cat:'Code Analysis', html:`
  <p>Feeds <strong>massive random/malformed input</strong> to an application to find crashes and unhandled cases. A form of dynamic analysis.</p>` },
'sandboxing': { title:'Sandboxing', cat:'Code Analysis', html:`
  <p>Runs untrusted code in an <strong>isolated environment</strong> to observe it safely — used in dynamic analysis and malware study.</p>` },
'package-monitoring': { title:'Package Monitoring', cat:'Code Analysis', html:`
  <p>Watching third-party <strong>dependencies</strong> for known vulnerabilities and tampering — a key software-supply-chain defense.</p>` },
'dev-stages': { title:'Secure Development Environment Stages', cat:'Code Analysis', html:`
  <p>Code is promoted through separate environments: <strong>development → testing / quality assurance (QA) → staging → production</strong>. Separation keeps untested code away from real users and data.</p>
  <div class="exam-tip">Never edit code directly in production; promote it forward only after it passes each gate.</div>` },

/* ── Injection & Memory ── */
'sqli': { title:'SQL Injection (SQLi)', cat:'Injection & Memory', html:`
  <p>Inserting malicious <strong>SQL</strong> through unsanitized input to read, alter, or destroy data in a database (made of records and <strong>fields</strong>).</p>
  <div class="exam-tip">Definitive fix: parameterized queries / stored procedures + input validation.</div>` },
'parameterized': { title:'Parameterized Query / Stored Procedure', cat:'Injection & Memory', html:`
  <p>A <strong>stored procedure</strong> is reusable SQL stored in the database; a <strong>parameterized</strong> one binds user input as <em>data</em>, never executable SQL — so injection can't execute.</p>` },
'ldap-injection': { title:'LDAP Injection', cat:'Injection & Memory', html:`
  <p>Injecting into <strong>LDAP</strong> directory queries to bypass authentication or read the directory. Defended by input validation and escaping LDAP metacharacters.</p>` },
'xml-injection': { title:'XML Injection', cat:'Injection & Memory', html:`
  <p>Injecting malicious content into <strong>XML</strong> input or documents (including XXE — XML External Entity). Defended by validating input and disabling external entities.</p>` },
'directory-traversal': { title:'Directory Traversal', cat:'Injection & Memory', html:`
  <p>Using <code>../</code> sequences to escape the web root and read arbitrary files. Defended by canonicalizing paths and least privilege.</p>` },
'reflected-xss': { title:'Reflected XSS', cat:'Injection & Memory', html:`
  <p>A malicious script in a request is <strong>reflected back</strong> and runs in the victim's browser, typically via a crafted link the victim clicks.</p>` },
'stored-xss': { title:'Stored XSS', cat:'Injection & Memory', html:`
  <p>A script <strong>saved on the server</strong> (in a comment, profile, etc.) that runs for <em>every</em> visitor who views the page — more dangerous than reflected XSS.</p>` },
'dll-injection': { title:'DLL Injection', cat:'Injection & Memory', html:`
  <p>Forcing a process to load a malicious <strong>Dynamic Link Library</strong> so the attacker's code runs in that process's context. Defended by code signing, app allow-listing, and EDR.</p>` },
'buffer-overflow': { title:'Buffer Overflow', cat:'Injection & Memory', html:`
  <p>Writing <strong>past a buffer's boundary</strong> to corrupt adjacent memory or hijack execution. Mitigated by bounds checking, ASLR, DEP, and stack canaries.</p>` },
'integer-overflow': { title:'Integer Overflow', cat:'Injection & Memory', html:`
  <p>A value exceeds its data type's maximum and <strong>wraps around</strong> to an unexpected number, which can trigger memory-corruption bugs.</p>` },
'memory-leak': { title:'Memory Leak', cat:'Injection & Memory', html:`
  <p>Failing to free memory that's no longer needed, until the application gradually <strong>exhausts available memory</strong> and degrades or crashes.</p>` },
'web-server-logs': { title:'Web Server Logs', cat:'Injection & Memory', html:`
  <p>Record every request to the server. After an injection or traversal attempt, they show the malicious <strong>payloads, source IPs, and targeted URLs</strong> — key evidence for detection and IR.</p>` },

/* ── Automation & SOAR ── */
'soar': { title:'SOAR — Security Orchestration, Automation & Response', cat:'Automation & SOAR', html:`
  <p>Connects security tools and runs <strong>playbooks</strong> — automated, repeatable response steps — so routine actions happen instantly and consistently.</p>
  <div class="exam-tip">SIEM correlates and alerts; SOAR automates the response to those alerts.</div>` },
'user-provisioning': { title:'User Provisioning', cat:'Automation & SOAR', html:`
  <p>Automatically <strong>creating, modifying, and disabling user accounts</strong> as people join, move, or leave the organization.</p>` },
'resource-provisioning': { title:'Resource Provisioning', cat:'Automation & SOAR', html:`
  <p>Automatically <strong>spinning up servers, storage, and services</strong> on demand — often via Infrastructure as Code.</p>` },
'guardrails': { title:'Guardrails', cat:'Automation & SOAR', html:`
  <p>Automated policy limits that <strong>prevent unsafe actions</strong> — for example, blocking the creation of a public storage bucket.</p>` },
'security-groups': { title:'Security Groups', cat:'Automation & SOAR', html:`
  <p>Programmatically managing <strong>firewall / access rules</strong> around resources, so access control scales with the infrastructure.</p>` },
'ticket-creation': { title:'Ticket Creation', cat:'Automation & SOAR', html:`
  <p>Auto-generating incident or help-desk <strong>tickets</strong> when an alert fires, so nothing falls through the cracks.</p>` },
'escalation': { title:'Escalation', cat:'Automation & SOAR', html:`
  <p>Automatically routing an unhandled or high-severity issue to the <strong>right team or responder</strong>.</p>` },
'enable-disable': { title:'Enabling / Disabling Services & Access', cat:'Automation & SOAR', html:`
  <p>Turning accounts, ports, or services <strong>on or off automatically</strong> in response to events — e.g., disabling a compromised account instantly.</p>` },
'cicd': { title:'Continuous Integration / Testing (CI/CD)', cat:'Automation & SOAR', html:`
  <p>Automatically <strong>building, testing, and deploying</strong> code on every change, catching defects early and shipping consistently.</p>` },
'apis': { title:'Integrations & APIs', cat:'Automation & SOAR', html:`
  <p><strong>APIs</strong> let tools talk to each other — the glue that makes orchestration and automation possible.</p>` },

/* ── Trade-offs ── */
'auto-benefits': { title:'Automation Benefits', cat:'Trade-offs', html:`
  <ul>
    <li><strong>Efficiency / time savings</strong></li>
    <li><strong>Enforcing baselines</strong></li>
    <li><strong>Standard infrastructure configs</strong></li>
    <li><strong>Secure scaling</strong></li>
    <li><strong>Employee retention</strong> (less toil)</li>
    <li><strong>Faster incident reaction</strong></li>
    <li><strong>Workforce multiplier</strong></li>
  </ul>` },
'auto-drawbacks': { title:'Automation Drawbacks', cat:'Trade-offs', html:`
  <ul>
    <li><strong>Increased initial cost</strong></li>
    <li><strong>Complexity</strong></li>
    <li><strong>Single point of failure</strong></li>
    <li><strong>Technical debt</strong></li>
    <li><strong>Ongoing supportability</strong></li>
  </ul>` },

};

/* ═══════════════════════════════════════════════════
   CATEGORIES — sidebar filter + graph clustering
═══════════════════════════════════════════════════ */
const CATEGORIES = [
  { id:'dos',        label:'Denial of Service',   color:'#e74c3c',
    nodes:['dos','ddos','resource-exhaustion','syn-flood','reflected-ddos','amplified-ddos','indicator'] },
  { id:'onpath',     label:'Spoofing & On-Path',  color:'#e67e22',
    nodes:['spoofing','forgery','on-path','aitb','ssl-stripping','replay','credential-replay'] },
  { id:'dnsatk',     label:'DNS Attacks',         color:'#e74c3c',
    nodes:['dns-poisoning','pharming','url-redirection','domain-hijacking','url'] },
  { id:'dnsdef',     label:'DNS & URL Defenses',  color:'#2ecc71',
    nodes:['dnssec','dns-filter','dns-sinkhole','dns-logs'] },
  { id:'coding',     label:'Secure Coding',       color:'#3498db',
    nodes:['input-validation','client-validation','server-validation','html-escaping','race-condition','error-handling','obfuscation','compiler','outsourced-code'] },
  { id:'web',        label:'Web App Security',    color:'#9b59b6',
    nodes:['http-headers','cookies','secure-cookie','code-signing','owasp'] },
  { id:'analysis',   label:'Code Analysis',       color:'#1abc9c',
    nodes:['static-analysis','manual-review','dynamic-analysis','fuzzing','sandboxing','package-monitoring','dev-stages'] },
  { id:'injection',  label:'Injection & Memory',  color:'#e74c3c',
    nodes:['sqli','parameterized','ldap-injection','xml-injection','directory-traversal','reflected-xss','stored-xss','dll-injection','buffer-overflow','integer-overflow','memory-leak','web-server-logs'] },
  { id:'automation', label:'Automation & SOAR',   color:'#1abc9c',
    nodes:['soar','user-provisioning','resource-provisioning','guardrails','security-groups','ticket-creation','escalation','enable-disable','cicd','apis'] },
  { id:'tradeoffs',  label:'Automation Trade-offs',color:'#f1c40f',
    nodes:['auto-benefits','auto-drawbacks'] },
];

/* Reverse map: node id → category ids */
const NODE_CAT_MAP = {};
CATEGORIES.forEach(c => c.nodes.forEach(n => {
  if (!NODE_CAT_MAP[n]) NODE_CAT_MAP[n] = [];
  NODE_CAT_MAP[n].push(c.id);
}));

/* ── Build sidebar buttons ── */
(function buildSidebar() {
  const list = document.getElementById('cat-list');
  CATEGORIES.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.dataset.catId = c.id;
    btn.innerHTML =
      `<span class="cat-dot" style="background:${c.color}"></span>`+
      `<span>${c.label}</span>`;
    btn.addEventListener('click', () => {
      if (activeCat === c.id) clearFilter();
      else applyFilter(c.id);
    });
    list.appendChild(btn);
  });
})();

/* ═══════════════════════════════════════════════════
   FILTER LOGIC
═══════════════════════════════════════════════════ */
let activeCat = null;

function applyFilter(catId) {
  activeCat = catId;
  const cat = CATEGORIES.find(c => c.id === catId);
  const matchSet = new Set(cat.nodes);

  document.querySelectorAll('.node[data-node-id]').forEach(n => {
    n.classList.remove('cat-match','cat-dim');
    n.classList.add(matchSet.has(n.dataset.nodeId) ? 'cat-match' : 'cat-dim');
  });

  document.querySelectorAll('.zone').forEach(zone => {
    const nodes = zone.querySelectorAll('.node[data-node-id]');
    const allDim = [...nodes].every(n => n.classList.contains('cat-dim'));
    zone.classList.toggle('zone-all-dim', allDim && nodes.length > 0);
  });

  document.body.classList.add('cat-filtered');

  document.querySelectorAll('.cat-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.catId === catId));

  const banner = document.getElementById('filter-banner');
  banner.style.display = 'block';
  banner.style.color = cat.color;
  banner.style.borderColor = cat.color;
  banner.innerHTML = `${cat.label}<br><span style="opacity:.55;font-size:8px">click to clear</span>`;
  banner.onclick = clearFilter;

  document.getElementById('clear-btn').style.display = 'block';
}

function clearFilter() {
  activeCat = null;
  document.body.classList.remove('cat-filtered');
  document.querySelectorAll('.node').forEach(n =>
    n.classList.remove('cat-match','cat-dim'));
  document.querySelectorAll('.zone').forEach(z =>
    z.classList.remove('zone-all-dim'));
  document.querySelectorAll('.cat-btn').forEach(b =>
    b.classList.remove('active'));
  document.getElementById('filter-banner').style.display = 'none';
  document.getElementById('clear-btn').style.display = 'none';
}

/* ═══════════════════════════════════════════════════
   DETAIL PANEL
═══════════════════════════════════════════════════ */
let selectedNode = null;

function openDetail(id) {
  const d = NODE_DATA[id];
  if (!d) return;

  if (selectedNode) selectedNode.classList.remove('selected');
  const el = document.querySelector(`.node[data-node-id="${id}"]`);
  if (el) { el.classList.add('selected'); selectedNode = el; }

  document.getElementById('detail-title').textContent = d.title;
  document.getElementById('detail-category').textContent = d.cat;
  document.getElementById('detail-body').innerHTML = d.html;
  document.getElementById('detail-panel').classList.remove('collapsed');
  document.body.classList.add('detail-open');
}

function closeDetail() {
  document.getElementById('detail-panel').classList.add('collapsed');
  document.body.classList.remove('detail-open');
  if (selectedNode) { selectedNode.classList.remove('selected'); selectedNode = null; }
}

/* ═══════════════════════════════════════════════════
   GRAPH VIEW — force-directed bubble chart
═══════════════════════════════════════════════════ */
function gn(id,label,color,nodeId,x,y){return{id,label,color,nodeId:nodeId||null,x,y,vx:0,vy:0,r:20,pinned:false}}
function ge(s,t,type,label){return{s,t,type:type||'relates',label:label||null}}

const GNODES = [
  /* Category anchors */
  gn('cat-dos',       'Denial of\nService',  '#e74c3c', null, -720,-420),
  gn('cat-onpath',    'Spoofing /\nOn-Path', '#e67e22', null, -260,-540),
  gn('cat-dnsatk',    'DNS\nAttacks',        '#e74c3c', null,  260,-520),
  gn('cat-dnsdef',    'DNS\nDefenses',       '#2ecc71', null,  720,-360),
  gn('cat-coding',    'Secure\nCoding',      '#3498db', null,  900,  40),
  gn('cat-web',       'Web App\nSecurity',   '#9b59b6', null,  680, 360),
  gn('cat-analysis',  'Code\nAnalysis',      '#1abc9c', null,  220, 540),
  gn('cat-injection', 'Injection /\nMemory', '#e74c3c', null, -300, 540),
  gn('cat-automation','Automation\n/ SOAR',  '#1abc9c', null, -760, 320),
  gn('cat-tradeoffs', 'Trade-\noffs',        '#f1c40f', null, -960, -60),

  /* Denial of Service */
  gn('dos','DoS','#e74c3c','dos',-700,-460),
  gn('ddos','DDoS','#e74c3c','ddos',-620,-430),
  gn('resource-exhaustion','Resource\nExhaust','#e67e22','resource-exhaustion',-760,-380),
  gn('syn-flood','SYN\nFlood','#e74c3c','syn-flood',-680,-360),
  gn('reflected-ddos','Reflected','#e74c3c','reflected-ddos',-820,-440),
  gn('amplified-ddos','Amplified','#e74c3c','amplified-ddos',-820,-360),
  gn('indicator','Indicator','#f1c40f','indicator',-600,-500),

  /* Spoofing & On-Path */
  gn('spoofing','Spoofing','#e67e22','spoofing',-300,-600),
  gn('forgery','Forgery','#e67e22','forgery',-220,-580),
  gn('on-path','On-Path','#e74c3c','on-path',-300,-480),
  gn('aitb','In-Browser','#e74c3c','aitb',-180,-500),
  gn('ssl-stripping','SSL\nStrip','#e74c3c','ssl-stripping',-380,-500),
  gn('replay','Replay','#e74c3c','replay',-180,-600),
  gn('credential-replay','Cred\nReplay','#e74c3c','credential-replay',-120,-540),

  /* DNS Attacks */
  gn('dns-poisoning','DNS\nPoison','#e74c3c','dns-poisoning',300,-560),
  gn('pharming','Pharming','#e74c3c','pharming',220,-580),
  gn('url-redirection','URL\nRedirect','#e67e22','url-redirection',360,-500),
  gn('domain-hijacking','Domain\nHijack','#e74c3c','domain-hijacking',200,-460),
  gn('url','URL','#95a5a6','url',330,-440),

  /* DNS Defenses */
  gn('dnssec','DNSSEC','#2ecc71','dnssec',760,-400),
  gn('dns-filter','DNS\nFilter','#3498db','dns-filter',840,-360),
  gn('dns-sinkhole','Sinkhole','#9b59b6','dns-sinkhole',760,-310),
  gn('dns-logs','DNS\nLogs','#e67e22','dns-logs',660,-340),

  /* Secure Coding */
  gn('input-validation','Input\nValid','#2ecc71','input-validation',940,0),
  gn('client-validation','Client','#e67e22','client-validation',1020,30),
  gn('server-validation','Server','#2ecc71','server-validation',940,80),
  gn('html-escaping','HTML\nEscape','#2ecc71','html-escaping',1020,-40),
  gn('race-condition','Race\nCond','#e74c3c','race-condition',860,30),
  gn('error-handling','Error\nHandle','#3498db','error-handling',860,-40),
  gn('obfuscation','Obfusc.','#9b59b6','obfuscation',1080,0),
  gn('compiler','Compiler','#95a5a6','compiler',1080,80),
  gn('outsourced-code','Outsourced','#e67e22','outsourced-code',940,-80),

  /* Web App Security */
  gn('http-headers','HTTP\nHeaders','#3498db','http-headers',700,360),
  gn('cookies','Cookie','#9b59b6','cookies',620,330),
  gn('secure-cookie','Secure\nCookie','#2ecc71','secure-cookie',700,420),
  gn('code-signing','Code\nSign','#2ecc71','code-signing',780,390),
  gn('owasp','OWASP','#e67e22','owasp',620,400),

  /* Code Analysis */
  gn('static-analysis','Static','#3498db','static-analysis',240,540),
  gn('manual-review','Manual','#3498db','manual-review',160,520),
  gn('dynamic-analysis','Dynamic','#9b59b6','dynamic-analysis',300,580),
  gn('fuzzing','Fuzzing','#9b59b6','fuzzing',180,600),
  gn('sandboxing','Sandbox','#1abc9c','sandboxing',320,500),
  gn('package-monitoring','Package\nMon','#2ecc71','package-monitoring',100,560),
  gn('dev-stages','Dev\nStages','#95a5a6','dev-stages',240,460),

  /* Injection & Memory */
  gn('sqli','SQLi','#e74c3c','sqli',-280,560),
  gn('parameterized','Param.\nQuery','#2ecc71','parameterized',-200,540),
  gn('ldap-injection','LDAP\nInj','#e74c3c','ldap-injection',-360,560),
  gn('xml-injection','XML\nInj','#e74c3c','xml-injection',-360,620),
  gn('directory-traversal','Dir\nTraversal','#e74c3c','directory-traversal',-280,640),
  gn('reflected-xss','Reflect\nXSS','#e74c3c','reflected-xss',-200,620),
  gn('stored-xss','Stored\nXSS','#e74c3c','stored-xss',-140,580),
  gn('dll-injection','DLL\nInj','#e74c3c','dll-injection',-440,560),
  gn('buffer-overflow','Buffer\nOver','#e74c3c','buffer-overflow',-440,620),
  gn('integer-overflow','Integer\nOver','#e74c3c','integer-overflow',-380,500),
  gn('memory-leak','Memory\nLeak','#e67e22','memory-leak',-300,480),
  gn('web-server-logs','Web\nLogs','#3498db','web-server-logs',-160,500),

  /* Automation & SOAR */
  gn('soar','SOAR','#1abc9c','soar',-760,360),
  gn('user-provisioning','User\nProvis','#3498db','user-provisioning',-840,330),
  gn('resource-provisioning','Resource\nProvis','#3498db','resource-provisioning',-680,330),
  gn('guardrails','Guard-\nrails','#2ecc71','guardrails',-840,400),
  gn('security-groups','Security\nGroups','#2ecc71','security-groups',-680,400),
  gn('ticket-creation','Ticket','#e67e22','ticket-creation',-900,360),
  gn('escalation','Escalate','#e67e22','escalation',-620,360),
  gn('enable-disable','Enable/\nDisable','#9b59b6','enable-disable',-760,440),
  gn('cicd','CI/CD','#1abc9c','cicd',-760,280),
  gn('apis','APIs','#95a5a6','apis',-700,300),

  /* Trade-offs */
  gn('auto-benefits','Benefits','#2ecc71','auto-benefits',-980,-100),
  gn('auto-drawbacks','Drawbacks','#e74c3c','auto-drawbacks',-940,-20),
];

const GEDGES = [
  /* category membership */
  ge('cat-dos','dos','member'), ge('cat-dos','ddos','member'), ge('cat-dos','resource-exhaustion','member'),
  ge('cat-dos','syn-flood','member'), ge('cat-dos','reflected-ddos','member'), ge('cat-dos','amplified-ddos','member'), ge('cat-dos','indicator','member'),

  ge('cat-onpath','spoofing','member'), ge('cat-onpath','forgery','member'), ge('cat-onpath','on-path','member'),
  ge('cat-onpath','aitb','member'), ge('cat-onpath','ssl-stripping','member'), ge('cat-onpath','replay','member'), ge('cat-onpath','credential-replay','member'),

  ge('cat-dnsatk','dns-poisoning','member'), ge('cat-dnsatk','pharming','member'), ge('cat-dnsatk','url-redirection','member'),
  ge('cat-dnsatk','domain-hijacking','member'), ge('cat-dnsatk','url','member'),

  ge('cat-dnsdef','dnssec','member'), ge('cat-dnsdef','dns-filter','member'), ge('cat-dnsdef','dns-sinkhole','member'), ge('cat-dnsdef','dns-logs','member'),

  ge('cat-coding','input-validation','member'), ge('cat-coding','client-validation','member'), ge('cat-coding','server-validation','member'),
  ge('cat-coding','html-escaping','member'), ge('cat-coding','race-condition','member'), ge('cat-coding','error-handling','member'),
  ge('cat-coding','obfuscation','member'), ge('cat-coding','compiler','member'), ge('cat-coding','outsourced-code','member'),

  ge('cat-web','http-headers','member'), ge('cat-web','cookies','member'), ge('cat-web','secure-cookie','member'),
  ge('cat-web','code-signing','member'), ge('cat-web','owasp','member'),

  ge('cat-analysis','static-analysis','member'), ge('cat-analysis','manual-review','member'), ge('cat-analysis','dynamic-analysis','member'),
  ge('cat-analysis','fuzzing','member'), ge('cat-analysis','sandboxing','member'), ge('cat-analysis','package-monitoring','member'), ge('cat-analysis','dev-stages','member'),

  ge('cat-injection','sqli','member'), ge('cat-injection','parameterized','member'), ge('cat-injection','ldap-injection','member'),
  ge('cat-injection','xml-injection','member'), ge('cat-injection','directory-traversal','member'), ge('cat-injection','reflected-xss','member'),
  ge('cat-injection','stored-xss','member'), ge('cat-injection','dll-injection','member'), ge('cat-injection','buffer-overflow','member'),
  ge('cat-injection','integer-overflow','member'), ge('cat-injection','memory-leak','member'), ge('cat-injection','web-server-logs','member'),

  ge('cat-automation','soar','member'), ge('cat-automation','user-provisioning','member'), ge('cat-automation','resource-provisioning','member'),
  ge('cat-automation','guardrails','member'), ge('cat-automation','security-groups','member'), ge('cat-automation','ticket-creation','member'),
  ge('cat-automation','escalation','member'), ge('cat-automation','enable-disable','member'), ge('cat-automation','cicd','member'), ge('cat-automation','apis','member'),

  ge('cat-tradeoffs','auto-benefits','member'), ge('cat-tradeoffs','auto-drawbacks','member'),

  /* cross-links — relationships */
  ge('ddos','dos','type-of'),
  ge('reflected-ddos','spoofing','uses'),
  ge('amplified-ddos','reflected-ddos','type-of'),
  ge('syn-flood','resource-exhaustion','causes'),
  ge('ddos','resource-exhaustion','causes'),
  ge('on-path','ssl-stripping','enables'),
  ge('dns-poisoning','pharming','enables'),
  ge('dnssec','dns-poisoning','mitigates'),
  ge('dns-sinkhole','dns-poisoning','related'),
  ge('input-validation','sqli','mitigates'),
  ge('parameterized','sqli','mitigates'),
  ge('html-escaping','reflected-xss','mitigates'),
  ge('html-escaping','stored-xss','mitigates'),
  ge('server-validation','input-validation','implements'),
  ge('code-signing','dll-injection','mitigates'),
  ge('secure-cookie','stored-xss','protects'),
  ge('owasp','sqli','catalogs'),
  ge('fuzzing','dynamic-analysis','type-of'),
  ge('sandboxing','dynamic-analysis','supports'),
  ge('soar','escalation','automates'),
  ge('soar','ticket-creation','automates'),
  ge('cicd','dev-stages','automates'),
  ge('apis','soar','powers'),
  ge('web-server-logs','sqli','detects'),
];

/* ── Simulation constants ── */
const G_REPEL   = 18000;
const G_SPRING  = 0.03;
const G_IDEAL   = 120;
const G_GRAVITY = 0.003;
const G_DAMPING = 0.80;

let gNodes=[], gNodeMap={}, gGraphInited=false, gGraphActive=false;
let gDragNode=null, gDragOff={}, gPanning=false, gPanStart={};
let gTx={x:0,y:0,k:1};

function gTick(){
  const ns=gNodes;
  for(let i=0;i<ns.length;i++){
    const a=ns[i]; if(a.pinned)continue;
    for(let j=i+1;j<ns.length;j++){
      const b=ns[j];
      let dx=b.x-a.x,dy=b.y-a.y;
      const d2=dx*dx+dy*dy+1,d=Math.sqrt(d2);
      const f=G_REPEL/d2,fx=f*dx/d,fy=f*dy/d;
      a.vx-=fx;a.vy-=fy;
      if(!b.pinned){b.vx+=fx;b.vy+=fy;}
    }
  }
  for(const e of GEDGES){
    const a=gNodeMap[e.s],b=gNodeMap[e.t];
    if(!a||!b)continue;
    const dx=b.x-a.x,dy=b.y-a.y,d=Math.sqrt(dx*dx+dy*dy)+0.001;
    const f=G_SPRING*(d-G_IDEAL),fx=f*dx/d,fy=f*dy/d;
    if(!a.pinned){a.vx+=fx;a.vy+=fy;}
    if(!b.pinned){b.vx-=fx;b.vy-=fy;}
  }
  for(const n of ns){
    if(n.pinned)continue;
    n.vx+=-n.x*G_GRAVITY;n.vy+=-n.y*G_GRAVITY;
    n.vx*=G_DAMPING;n.vy*=G_DAMPING;
    n.x+=n.vx;n.y+=n.vy;
  }
}

function runGraphLayout(steps){
  gNodes.forEach(n=>{n.pinned=false;n.vx=0;n.vy=0;});
  for(let i=0;i<steps;i++)gTick();
  gRender();
}

const GESTYLE={
  member:  {color:'#1e3a5f',w:1,  dash:'3,7', mk:null},
  'type-of':     {color:'#222c44',w:1,  dash:'',   mk:'ga-gray'},
  'uses':        {color:'#222c44',w:1.5,dash:'',   mk:'ga-gray'},
  'causes':      {color:'#e74c3c',w:1.5,dash:'5,3',mk:'ga-red'},
  'enables':     {color:'#e67e22',w:1.5,dash:'',   mk:'ga-gray'},
  'mitigates':   {color:'#2ecc71',w:1.5,dash:'',   mk:'ga-green'},
  'implements':  {color:'#3498db',w:1,  dash:'',   mk:'ga-blue'},
  'protects':    {color:'#1abc9c',w:1.5,dash:'',   mk:'ga-teal'},
  'catalogs':    {color:'#e67e22',w:1,  dash:'4,4',mk:null},
  'supports':    {color:'#1abc9c',w:1.5,dash:'',   mk:'ga-teal'},
  'automates':   {color:'#1abc9c',w:1.5,dash:'',   mk:'ga-teal'},
  'powers':      {color:'#3498db',w:1.5,dash:'',   mk:'ga-blue'},
  'detects':     {color:'#3498db',w:1,  dash:'4,4',mk:'ga-blue'},
  'related':     {color:'#475569',w:1,  dash:'4,4', mk:null},
};

function gRender(){
  const svgGe=document.getElementById('ge');
  const svgGn=document.getElementById('gn');
  svgGe.innerHTML='';svgGn.innerHTML='';

  function el(tag,attrs){
    const e=document.createElementNS('http://www.w3.org/2000/svg',tag);
    for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);
    return e;
  }

  for(const e of GEDGES){
    const a=gNodeMap[e.s],b=gNodeMap[e.t];
    if(!a||!b)continue;
    const st=GESTYLE[e.type]||GESTYLE.uses;
    const dx=b.x-a.x,dy=b.y-a.y,d=Math.sqrt(dx*dx+dy*dy)+0.001;
    const sr=a.r+2,er=b.r+(st.mk?9:2);
    const x1=a.x+dx/d*sr,y1=a.y+dy/d*sr,x2=b.x-dx/d*er,y2=b.y-dy/d*er;
    const line=el('line',{x1,y1,x2,y2,stroke:st.color,'stroke-width':st.w,
      opacity:e.type==='member'?'0.3':'0.65','data-gs':e.s,'data-gt':e.t});
    if(st.dash)line.setAttribute('stroke-dasharray',st.dash);
    if(st.mk)line.setAttribute('marker-end',`url(#${st.mk})`);
    svgGe.appendChild(line);
    if(e.label){
      const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
      const t=el('text',{x:mx,y:my-4,'text-anchor':'middle','font-size':'8',
        'font-family':'Segoe UI,system-ui,sans-serif','font-weight':'600',
        fill:st.color,opacity:'0.8','pointer-events':'none'});
      t.textContent=e.label;
      svgGe.appendChild(t);
    }
  }

  for(const n of gNodes){
    const isCat=n.id.startsWith('cat-');
    const g=el('g',{transform:`translate(${n.x.toFixed(1)},${n.y.toFixed(1)})`,
      cursor:'pointer','data-g-node-id':n.id});
    const circle=el('circle',{r:n.r,fill:n.color+'22',stroke:n.color,
      'stroke-width':isCat?'2.5':'1.5'});
    g.appendChild(circle);
    const lines=n.label.split('\n');
    const lh=11,sy=-(lines.length-1)*lh/2;
    lines.forEach((lbl,i)=>{
      const t=el('text',{'text-anchor':'middle','dominant-baseline':'middle',
        y:sy+i*lh,'font-size':n.r>28?'10':'9',
        'font-family':'Segoe UI,system-ui,sans-serif',
        'font-weight':'700',fill:n.color,'pointer-events':'none'});
      t.textContent=lbl;
      g.appendChild(t);
    });
    g.addEventListener('mouseenter',()=>{
      circle.setAttribute('fill',n.color+'44');
      circle.setAttribute('stroke-width','2.5');
    });
    g.addEventListener('mouseleave',()=>{
      if(gDragNode!==n){
        circle.setAttribute('fill',n.color+'22');
        circle.setAttribute('stroke-width',isCat?'2.5':'1.5');
      }
    });
    g.addEventListener('mousedown',ev=>{
      ev.stopPropagation();
      gDragNode=n;n.pinned=true;
      const pt=gSvgPt(ev);
      gDragOff={x:pt.x-n.x,y:pt.y-n.y};
    });
    g.addEventListener('click',ev=>{
      ev.stopPropagation();
      if(n.nodeId&&NODE_DATA[n.nodeId]) openDetail(n.nodeId);
    });
    svgGn.appendChild(g);
  }
  gApplyTx();
  if(activeCat) applyGraphFilter(activeCat);
}

function gSvgPt(e){
  const r=document.getElementById('graph-svg').getBoundingClientRect();
  return{x:(e.clientX-r.left-gTx.x)/gTx.k,y:(e.clientY-r.top-gTx.y)/gTx.k};
}
function gApplyTx(){
  document.getElementById('graph-root').setAttribute('transform',
    `translate(${gTx.x.toFixed(1)},${gTx.y.toFixed(1)}) scale(${gTx.k.toFixed(4)})`);
}
function fitGraph(){
  if(!gNodes.length)return;
  const svg=document.getElementById('graph-svg');
  const{width:W,height:H}=svg.getBoundingClientRect();
  let mnx=1e9,mxx=-1e9,mny=1e9,mxy=-1e9;
  gNodes.forEach(n=>{mnx=Math.min(mnx,n.x-n.r);mxx=Math.max(mxx,n.x+n.r);
    mny=Math.min(mny,n.y-n.r);mxy=Math.max(mxy,n.y+n.r);});
  const pad=50,k=Math.min((W-pad*2)/(mxx-mnx),(H-pad*2)/(mxy-mny),1.8);
  gTx.k=k;gTx.x=W/2-(mnx+mxx)/2*k;gTx.y=H/2-(mny+mxy)/2*k;
  gApplyTx();
}

function gSetupInteraction(){
  const svg=document.getElementById('graph-svg');
  svg.addEventListener('wheel',e=>{
    e.preventDefault();
    const r=svg.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;
    const f=e.deltaY<0?1.12:0.89;
    gTx.x=mx-(mx-gTx.x)*f;gTx.y=my-(my-gTx.y)*f;
    gTx.k=Math.max(0.12,Math.min(4,gTx.k*f));
    gApplyTx();
  },{passive:false});
  svg.addEventListener('mousedown',e=>{
    const tgt=e.target;
    if(tgt===svg||tgt.id==='graph-root'||tgt.id==='ge'||tgt.id==='gn'){
      gPanning=true;gPanStart={x:e.clientX-gTx.x,y:e.clientY-gTx.y};
    }
  });
  window.addEventListener('mousemove',e=>{
    if(gDragNode){
      const pt=gSvgPt(e);
      gDragNode.x=pt.x-gDragOff.x;gDragNode.y=pt.y-gDragOff.y;
      gRender();
    }else if(gPanning){
      gTx.x=e.clientX-gPanStart.x;gTx.y=e.clientY-gPanStart.y;
      gApplyTx();
    }
  });
  window.addEventListener('mouseup',()=>{gDragNode=null;gPanning=false;});
}

function applyGraphFilter(catId){
  const cat=CATEGORIES.find(c=>c.id===catId);
  if(!cat)return;
  const matchSet=new Set(cat.nodes);
  document.querySelectorAll('#gn > g[data-g-node-id]').forEach(g=>{
    const nid=g.dataset.gNodeId;
    const isCat=nid.startsWith('cat-');
    const nodeId=GNODES.find(n=>n.id===nid)?.nodeId;
    const vis=isCat||(nodeId&&matchSet.has(nodeId));
    g.style.opacity=vis?'1':'0.05';
    g.style.pointerEvents=vis?'auto':'none';
  });
  document.querySelectorAll('#ge > line[data-gs][data-gt]').forEach(line=>{
    const sNode=GNODES.find(n=>n.id===line.dataset.gs);
    const tNode=GNODES.find(n=>n.id===line.dataset.gt);
    const sVis=!sNode||sNode.id.startsWith('cat-')||(sNode.nodeId&&matchSet.has(sNode.nodeId));
    const tVis=!tNode||tNode.id.startsWith('cat-')||(tNode.nodeId&&matchSet.has(tNode.nodeId));
    line.style.opacity=(sVis&&tVis)?'0.6':'0.04';
  });
}
function clearGraphFilter(){
  document.querySelectorAll('#gn > g[data-g-node-id]').forEach(g=>{
    g.style.opacity='';g.style.pointerEvents='';
  });
  document.querySelectorAll('#ge > line').forEach(l=>l.style.opacity='');
}

function toggleGraphView(){
  gGraphActive=!gGraphActive;
  const btn=document.getElementById('btn-graph');
  const gview=document.getElementById('graph-view');
  const canvas=document.getElementById('canvas');
  if(gGraphActive){
    btn.style.cssText='border-color:var(--teal);color:var(--teal);background:rgba(26,188,156,.1)';
    gview.classList.add('visible');
    canvas.style.display='none';
    if(!gGraphInited){
      gNodes=GNODES.map(n=>({...n}));
      gNodeMap={};
      gNodes.forEach(n=>gNodeMap[n.id]=n);
      const deg={};
      gNodes.forEach(n=>deg[n.id]=0);
      GEDGES.forEach(e=>{if(deg[e.s]!==undefined)deg[e.s]++;if(deg[e.t]!==undefined)deg[e.t]++;});
      gNodes.forEach(n=>{
        const isCat=n.id.startsWith('cat-');
        n.r=isCat?36:Math.max(18,Math.min(34,18+((deg[n.id]||0)*1.6)));
      });
      runGraphLayout(300);
      gSetupInteraction();
      gGraphInited=true;
    }
    setTimeout(fitGraph,60);
    if(activeCat)applyGraphFilter(activeCat);
  }else{
    btn.style.cssText='';
    gview.classList.remove('visible');
    canvas.style.display='';
  }
}

/* Patch clearFilter and applyFilter to also update graph */
const _origApply=applyFilter;
applyFilter=function(catId){
  _origApply(catId);
  if(gGraphActive&&gGraphInited)applyGraphFilter(catId);
};
const _origClear=clearFilter;
clearFilter=function(){
  _origClear();
  if(gGraphActive&&gGraphInited)clearGraphFilter();
};

/* ═══ ILLUSTRATED MODE ═══ */
let illustratedMode = false;
const GICONS = {};
const GEDGE_DESC = {};
function getEdgeDesc(e) { return GEDGE_DESC[`${e.s}->${e.t}`] || null; }

const _origGRender = gRender;
gRender = function() {
  if (!illustratedMode) { _origGRender(); return; }
  const svgGe=document.getElementById('ge'), svgGn=document.getElementById('gn');
  svgGe.innerHTML=''; svgGn.innerHTML='';
  function el(tag,attrs){
    const e=document.createElementNS('http://www.w3.org/2000/svg',tag);
    for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);return e;
  }
  for(const e of GEDGES){
    const a=gNodeMap[e.s],b=gNodeMap[e.t];if(!a||!b)continue;
    const st=GESTYLE[e.type]||GESTYLE.uses;
    const dx=b.x-a.x,dy=b.y-a.y,d=Math.sqrt(dx*dx+dy*dy)+0.001;
    const sr=36,er=36+(st.mk?9:2);
    const x1=a.x+dx/d*sr,y1=a.y+dy/d*sr,x2=b.x-dx/d*er,y2=b.y-dy/d*er;
    const line=el('line',{x1,y1,x2,y2,stroke:st.color,'stroke-width':st.w,
      opacity:e.type==='member'?'0.2':'0.7','data-gs':e.s,'data-gt':e.t});
    if(st.dash)line.setAttribute('stroke-dasharray',st.dash);
    if(st.mk)line.setAttribute('marker-end',`url(#${st.mk})`);
    svgGe.appendChild(line);
  }
  const NW=72,NH=58;
  for(const n of gNodes){
    const isCat=n.id.startsWith('cat-');
    const g=el('g',{transform:`translate(${n.x.toFixed(1)},${n.y.toFixed(1)})`,
      cursor:'pointer','data-g-node-id':n.id});
    const rect=el('rect',{x:-NW/2,y:-NH/2,width:NW,height:NH,rx:'8',
      fill:n.color+'18',stroke:n.color,'stroke-width':isCat?'2.5':'1.5'});
    g.appendChild(rect);
    const icon=el('text',{y:'-7','text-anchor':'middle','dominant-baseline':'middle',
      'font-size':isCat?'20':'16','pointer-events':'none'});
    icon.textContent=GICONS[n.id]||'●';g.appendChild(icon);
    const lbl=el('text',{y:'13','text-anchor':'middle','dominant-baseline':'middle',
      'font-size':'7.5','font-family':'Segoe UI,system-ui,sans-serif',
      'font-weight':'700',fill:n.color,'pointer-events':'none'});
    lbl.textContent=n.label.replace(/\n/g,' ');g.appendChild(lbl);
    g.addEventListener('mouseenter',()=>rect.setAttribute('fill',n.color+'35'));
    g.addEventListener('mouseleave',()=>{if(gDragNode!==n)rect.setAttribute('fill',n.color+'18');});
    g.addEventListener('mousedown',ev=>{ev.stopPropagation();gDragNode=n;n.pinned=true;
      const pt=gSvgPt(ev);gDragOff={x:pt.x-n.x,y:pt.y-n.y};});
    g.addEventListener('click',ev=>{ev.stopPropagation();
      if(n.nodeId&&NODE_DATA[n.nodeId])openDetail(n.nodeId);});
    svgGn.appendChild(g);
  }
  gApplyTx();
  if(activeCat)applyGraphFilter(activeCat);
};

function toggleIllustrated(){
  if(!gGraphActive)toggleGraphView();
  illustratedMode=!illustratedMode;
  const btn=document.getElementById('btn-illustrated');
  btn.style.cssText=illustratedMode?'border-color:var(--purple);color:var(--purple);background:rgba(155,89,182,.12)':'';
  btn.textContent=illustratedMode?'🖼 Bubble View':'🖼 Illustrated';
  gRender();
}

let studyMode = false;
function toggleStudyMode() {
  studyMode = !studyMode;
  const btn = document.getElementById('btn-study');
  if (studyMode) {
    document.querySelectorAll('.node-label,.node-sub').forEach(el =>
      el.style.opacity = '0');
    btn.style.cssText = 'border-color:var(--teal);color:var(--teal);background:rgba(26,188,156,.1)';
    btn.textContent = '👁 Labels Hidden';
  } else {
    document.querySelectorAll('.node-label,.node-sub').forEach(el =>
      el.style.opacity = '');
    btn.style.cssText = '';
    btn.textContent = '👁 Study Mode';
  }
}
