/* ═══════════════════════════════════════════════════
   NODE DATA — detail panel content
═══════════════════════════════════════════════════ */
const NODE_DATA = {

/* ── Threat Actors ── */
'nation-state': { title:'Nation-State', cat:'Threat Actors', html:`
  <p>Government-sponsored attackers with the <strong>highest sophistication and funding</strong>. They build custom tooling, hoard zero-days, and operate patiently for strategic goals.</p>
  <p>Motivations: <strong>espionage, cyberwarfare, data exfiltration</strong>. Their campaign style is the APT.</p>` },
'apt': { title:'APT — Advanced Persistent Threat', cat:'Threat Actors', html:`
  <p>Not a group but a <strong>campaign style</strong>: gain access and stay hidden for <strong>months or years</strong>, exfiltrating continuously. Associated with nation-state actors.</p>
  <p>Exam cue: "maintained undetected access for an extended period."</p>` },
'organized-crime': { title:'Organized Crime', cat:'Threat Actors', html:`
  <p>Professional, profit-funded groups with a division of labor. The dominant force behind <strong>ransomware</strong> and large-scale fraud.</p>
  <p>If the motive is <strong>money</strong>, the actor is almost always organized crime.</p>` },
'hacktivist': { title:'Hacktivist', cat:'Threat Actors', html:`
  <p>Ideology-driven attackers acting on <strong>political or philosophical beliefs</strong>. Typical tactics: website defacement, DDoS, and data leaks to make a statement.</p>` },
'insider-threat': { title:'Insider Threat', cat:'Threat Actors', html:`
  <p>Someone who <strong>already has legitimate access</strong> — employee, contractor, or partner. Bypasses perimeter defenses entirely, making them the hardest to detect.</p>
  <p>Can be malicious (revenge, profit) or accidental.</p>` },
'unskilled-attacker': { title:'Unskilled Attacker', cat:'Threat Actors', html:`
  <p>Runs premade tools and scripts they don't fully understand ("script kiddie"). <strong>Low sophistication</strong>, motivated by chaos, curiosity, or bragging rights.</p>` },
'competitor': { title:'Competitor', cat:'Threat Actors', html:`
  <p>A rival business engaged in <strong>corporate espionage</strong> — stealing trade secrets, IP, pricing, or customer lists for commercial advantage.</p>` },

/* ── Attacker Attributes ── */
'internal-external': { title:'Internal vs External', cat:'Attacker Attributes', html:`
  <p><strong>Internal:</strong> insiders with existing access who skip the perimeter. <strong>External:</strong> outsiders who must first breach a boundary.</p>` },
'resources-funding': { title:'Resources / Funding', cat:'Attacker Attributes', html:`
  <p>Ranges from a free laptop to government budgets. Funding determines tooling, persistence, and whether an actor can buy <strong>zero-days or insiders</strong>.</p>` },
'sophistication': { title:'Level of Sophistication', cat:'Attacker Attributes', html:`
  <p>From blindly running scripts to writing custom malware. High sophistication means stealth, anti-forensics, and <strong>living-off-the-land</strong> techniques.</p>` },

/* ── Motivations ── */
'data-exfiltration': { title:'Data Exfiltration', cat:'Motivations', html:`
  <p>Stealing data out of the organization — the end goal behind most breaches. Common to nation-states, competitors, and crime groups.</p>` },
'financial-gain': { title:'Financial Gain', cat:'Motivations', html:`
  <p>Ransomware, fraud, and selling stolen data or credentials. The signature motivation of <strong>organized crime</strong>.</p>` },
'blackmail': { title:'Blackmail', cat:'Motivations', html:`
  <p>Extortion using stolen data — "pay or we leak it." Modern <strong>double-extortion ransomware</strong> exfiltrates before encrypting to enable this.</p>` },
'service-disruption': { title:'Service Disruption', cat:'Motivations', html:`
  <p>DDoS or sabotage to take a target offline. Favored by hacktivists and, against infrastructure, nation-states.</p>` },
'chaos': { title:'Chaos / Disruption', cat:'Motivations', html:`
  <p>Damage for its own sake or for notoriety. Associated with unskilled attackers and some hacktivists.</p>` },
'beliefs': { title:'Philosophical / Political Beliefs', cat:'Motivations', html:`
  <p>Attacking organizations whose positions the actor opposes — the defining motivation of the <strong>hacktivist</strong>.</p>` },
'ethical-hacking': { title:'Ethical Hacking', cat:'Motivations', html:`
  <p><strong>Authorized</strong> testing to find weaknesses before attackers do. Authorization is the line between a white-hat and a criminal — same techniques, legal permission.</p>` },
'revenge': { title:'Revenge', cat:'Motivations', html:`
  <p>Sabotage, theft, or logic bombs after a termination or grievance. The classic <strong>disgruntled insider</strong>.</p>` },
'cyberwar': { title:'War / Cyberwarfare', cat:'Motivations', html:`
  <p>Attacks on critical infrastructure as an instrument of statecraft. A nation-state motivation.</p>` },
'espionage': { title:'Espionage', cat:'Motivations', html:`
  <p>Long-term covert collection of secrets — corporate or governmental. Drives nation-states and competitors.</p>` },

/* ── Threat Vectors ── */
'message-vector': { title:'Message-Based Vector', cat:'Threat Vectors', html:`
  <p>Malicious code or links embedded in <strong>email, SMS, IM, files, and media</strong>. The #1 initial-access vector. Defended by spam filtering, attachment scanning, and training.</p>` },
'voice-vector': { title:'Voice Call Vector', cat:'Threat Vectors', html:`
  <p>Phone-based deception — vishing and pretexting ("IT support needs your password"). Defended by verification procedures.</p>` },
'social-engineering': { title:'Social Engineering', cat:'Threat Vectors', html:`
  <p>Manipulating <strong>people</strong> instead of systems. The human vector — covered in detail by the human-vector and phishing clusters.</p>` },
'removable-media': { title:'Removable Media', cat:'Threat Vectors', html:`
  <p>Infected USB drives, often dropped in parking lots or handed out as swag. Defended by disabling autorun and controlling USB via endpoint DLP.</p>` },
'vuln-exploit': { title:'Vulnerable Software / Systems', cat:'Threat Vectors', html:`
  <p>Exploiting unpatched software, misconfigurations, open ports, or weak wireless. Defended by <strong>patch management, hardening, and scanning</strong>.</p>` },
'supply-chain': { title:'Supply Chain', cat:'Threat Vectors', html:`
  <p>Compromising a <strong>vendor, MSP, or supplier</strong> the target trusts — one breach cascades to every customer. If the attacker got in "through the company that manages our IT," this is the vector.</p>` },

/* ── Attack Surface & Shadow IT ── */
'attack-surface': { title:'Attack Surface', cat:'Attack Surface', html:`
  <p>The sum of every point an attacker could touch: open ports, running services, exposed APIs, accounts, physical access, <strong>and people</strong>. Hardening shrinks it.</p>` },
'shadow-it': { title:'Shadow IT', cat:'Attack Surface', html:`
  <p>Systems and apps used <strong>without IT approval</strong> — a personal cloud drive for work files, an unsanctioned SaaS tool. Unpatched, unmonitored, invisible. Detected with CASB and network monitoring.</p>` },

/* ── Malware ── */
'virus': { title:'Virus', cat:'Malware', html:`
  <p>Attaches to a host file or program and replicates when the user <strong>runs it</strong>. Needs user action to spread — the key contrast with a worm.</p>` },
'worm': { title:'Worm', cat:'Malware', html:`
  <p><strong>Self-replicates across the network</strong> with no user action and no host file. "Spread to every machine overnight by itself."</p>` },
'trojan': { title:'Trojan Horse', cat:'Malware', html:`
  <p>Malware disguised as legitimate software (cracked games, fake utilities). The user installs it on purpose, believing it is something else.</p>` },
'rat': { title:'RAT — Remote Access Trojan', cat:'Malware', html:`
  <p>A trojan that gives the attacker <strong>remote control</strong> of the machine — a backdoor. Every RAT is a trojan; remote control is its defining feature.</p>` },
'logic-bomb': { title:'Logic Bomb', cat:'Malware', html:`
  <p>Dormant code that triggers on an <strong>event or date</strong> — e.g. "executes when the admin is removed from payroll." A classic insider-revenge tool.</p>` },
'keylogger': { title:'Keylogger', cat:'Malware', html:`
  <p>Records keystrokes — software or a hardware dongle — to steal credentials even when traffic is encrypted.</p>` },
'spyware': { title:'Spyware', cat:'Malware', html:`
  <p>Secretly monitors activity and collects data. <em>Privacy-invasive software</em> does the same semi-openly via buried consent.</p>` },
'rootkit': { title:'Rootkit', cat:'Malware', html:`
  <p>Embeds at <strong>kernel / system level</strong> to hide itself and other malware. "AV finds nothing but the system acts compromised" — needs a boot-time or offline scan.</p>` },
'ransomware': { title:'Ransomware', cat:'Malware', html:`
  <p>Encrypts your data and demands payment; modern crews also exfiltrate first (double extortion). Best defense: <strong>offline backups</strong>.</p>` },
'bloatware': { title:'Bloatware', cat:'Malware', html:`
  <p>Preinstalled unwanted software — not malicious, but unpatched attack surface. Removed during hardening and gold-image builds.</p>` },

/* ── Malware Indicators ── */
'extra-traffic': { title:'Extra Network Traffic', cat:'Malware Indicators', html:`
  <p>Unexplained volume from a host — scanning, spreading, or bulk theft in progress.</p>` },
'data-exfil-sign': { title:'Data Exfiltration', cat:'Malware Indicators', html:`
  <p>Large or unusual outbound transfers, especially off-hours or to unfamiliar destinations.</p>` },
'encrypted-traffic': { title:'Unexpected Encrypted Traffic', cat:'Malware Indicators', html:`
  <p>Malware hides its command channel in encryption a host does not normally use.</p>` },
'c2-beaconing': { title:'Traffic to Specific IPs', cat:'Malware Indicators', html:`
  <p>Regular "heartbeat" connections to the same address — <strong>command-and-control (C2) beaconing</strong>.</p>` },
'outgoing-spam': { title:'Outgoing Spam', cat:'Malware Indicators', html:`
  <p>Your host is sending bulk mail — a sign it has been recruited into a <strong>botnet</strong>.</p>` },

/* ── Human Vectors ── */
'shoulder-surfing': { title:'Shoulder Surfing', cat:'Human Vectors', html:`
  <p>Watching someone's screen or keypad over their shoulder. Countered by privacy screen filters and positioning.</p>` },
'tailgating': { title:'Tailgating', cat:'Human Vectors', html:`
  <p>Following an authorized person through a secure door. Countered by access vestibules (mantraps) and a no-holding-doors culture.</p>` },
'dumpster-diving': { title:'Dumpster Diving', cat:'Human Vectors', html:`
  <p>Recovering sensitive documents from the trash. Countered by shredding and burn bins.</p>` },
'disinformation': { title:'Disinformation', cat:'Human Vectors', html:`
  <p>Deliberately spreading false information to mislead or manipulate opinion.</p>` },
'elicitation': { title:'Elicitation', cat:'Human Vectors', html:`
  <p>Casually drawing information out of people through friendly conversation, without them realizing.</p>` },
'pretexting': { title:'Pretexting', cat:'Human Vectors', html:`
  <p>Inventing a scenario or identity ("I'm from the help desk") to justify a request. Countered by verifying identity through known channels.</p>` },
'watering-hole': { title:'Watering Hole Attack', cat:'Human Vectors', html:`
  <p>When the target is too hardened to attack directly, compromise a website the group <strong>already visits</strong> and infect them when they come to drink.</p>` },
'bec': { title:'Business Email Compromise', cat:'Human Vectors', html:`
  <p>A compromised or spoofed <strong>executive email</strong> ordering wire transfers or data handovers. Countered by out-of-band verification of payment changes.</p>` },
'typosquatting': { title:'Typosquatting', cat:'Human Vectors', html:`
  <p>Registering look-alike domains (<code>gooogle.com</code>) to catch mistyped URLs. Countered by defensive registration and URL filtering.</p>` },
'brand-impersonation': { title:'Brand Impersonation', cat:'Human Vectors', html:`
  <p>Fake login pages, emails, and ads dressed up as a trusted brand. Countered by user training, reporting, and DMARC.</p>` },

/* ── Phishing Family ── */
'spam': { title:'Spam', cat:'Phishing Family', html:`
  <p>Untargeted bulk email — annoying and may carry malware. The base of the phishing pyramid.</p>` },
'spim': { title:'SPIM', cat:'Phishing Family', html:`
  <p>Spam over <strong>instant messaging</strong> (Teams, Slack, WhatsApp) instead of email.</p>` },
'phishing': { title:'Phishing', cat:'Phishing Family', html:`
  <p>A broad, generic lure sent to thousands by email to harvest credentials or install malware.</p>` },
'spear-phishing': { title:'Spear Phishing', cat:'Phishing Family', html:`
  <p><strong>Targeted</strong> phishing — researched and personalized to a specific person or organization.</p>` },
'whaling': { title:'Whaling', cat:'Phishing Family', html:`
  <p>Spear phishing aimed at <strong>executives</strong> — the "big phish" (CEO, CFO).</p>` },
'vishing': { title:'Vishing', cat:'Phishing Family', html:`
  <p>Voice phishing — phone-based, often with spoofed caller ID.</p>` },
'smishing': { title:'Smishing', cat:'Phishing Family', html:`
  <p>SMS phishing — "your package is held, click here" with malicious links.</p>` },

/* ── Social Engineering Principles ── */
'authority': { title:'Authority', cat:'SE Principles', html:`
  <p>People obey perceived power. "This is the CEO — wire it now."</p>` },
'intimidation': { title:'Intimidation', cat:'SE Principles', html:`
  <p>Fear of consequences. "Do it or you're fired / your account is deleted."</p>` },
'consensus': { title:'Consensus', cat:'SE Principles', html:`
  <p>Social proof — everyone else is doing it. "The rest of your team already submitted theirs."</p>` },
'scarcity': { title:'Scarcity', cat:'SE Principles', html:`
  <p>Limited supply forces fast action. "Only 2 licenses left at this price." Urgency is its time-pressure twin.</p>` },
'familiarity': { title:'Familiarity', cat:'SE Principles', html:`
  <p>We comply with people we like or recognize. Rapport is built first, the request comes second.</p>` },

/* ── Blocking Malware ── */
'spam-filter': { title:'Spam Filter', cat:'Blocking Malware', html:`
  <p>At the email gateway — strips the #1 delivery vehicle before users see it. Pairs with SPF/DKIM/DMARC.</p>` },
'anti-malware': { title:'Anti-Malware', cat:'Blocking Malware', html:`
  <p>On every host and at the gateway. Uses signature detection for the known and heuristics for the new.</p>` },
'utm': { title:'UTM — Unified Threat Management', cat:'Blocking Malware', html:`
  <p>An all-in-one appliance: firewall + IPS + anti-malware + content filtering at the network boundary.</p>` },
'signature-based': { title:'Signature-Based Detection', cat:'Blocking Malware', html:`
  <p>Matches files against a database of <strong>known malware fingerprints</strong>. Accurate and low-noise, but blind to brand-new malware until definitions update.</p>` },
'heuristic-based': { title:'Heuristic / Behavior-Based Detection', cat:'Blocking Malware', html:`
  <p>Runs suspect code (often in a sandbox) and flags <strong>malicious behavior</strong> with no signature. Catches zero-days at the cost of more false positives.</p>` },
'fim': { title:'File Integrity Monitoring (FIM)', cat:'Blocking Malware', html:`
  <p>Baselines hashes of critical files and alerts on <strong>any change</strong>. Catches what scanners miss — if a rootkit alters a binary, the hash no longer matches. (e.g. Tripwire.)</p>` },

/* ── Threat Intelligence ── */
'osint': { title:'OSINT — Open Source Intelligence', cat:'Threat Intelligence', html:`
  <p>Anything publicly available: websites, news, social media, DNS records, breach dumps. Free — and attackers use it for recon too.</p>` },
'closed-intel': { title:'Closed / Proprietary Intelligence', cat:'Threat Intelligence', html:`
  <p>Paid commercial feeds and private research — a vendor's <strong>trade secret / IP</strong>, which is why it costs money.</p>` },
'vuln-databases': { title:'Vulnerability Databases', cat:'Threat Intelligence', html:`
  <p><strong>CVE</strong> (MITRE's catalog of known vulnerabilities) and <strong>NVD</strong> (NIST's database adding CVSS severity scores).</p>` },
'stix': { title:'STIX', cat:'Threat Intelligence', html:`
  <p>Structured Threat Information eXpression — the standardized <strong>language / format</strong> describing threat data (IoCs, TTPs, actors). STIX is the letter.</p>` },
'taxii': { title:'TAXII', cat:'Threat Intelligence', html:`
  <p>Trusted Automated eXchange of Intelligence Information — the <strong>transport protocol</strong> that moves STIX between organizations. TAXII is the mail truck.</p>` },
'ais': { title:'AIS — Automated Indicator Sharing', cat:'Threat Intelligence', html:`
  <p>CISA's program using STIX/TAXII to share indicators between government and the private sector in near-real-time.</p>` },
'dark-web': { title:'Dark Web', cat:'Threat Intelligence', html:`
  <p>Monitoring criminal markets and forums for your stolen credentials, data, or planned attacks.</p>` },
'isac': { title:'ISACs / ISAOs', cat:'Threat Intelligence', html:`
  <p>Public/private information-sharing organizations where industry peers exchange threat data — e.g. FS-ISAC for financial services.</p>` },
'ioc': { title:'IoC — Indicators of Compromise', cat:'Threat Intelligence', html:`
  <p>The atoms of threat intel: malicious IPs, file hashes, domains, and registry keys that signal a known attack.</p>` },
'predictive-analysis': { title:'Predictive Analysis', cat:'Threat Intelligence', html:`
  <p>Using current intel and trends to anticipate <em>future</em> attacks rather than only react.</p>` },
'threat-maps': { title:'Threat Maps', cat:'Threat Intelligence', html:`
  <p>Real-time visualizations of global attack traffic — broad situational awareness more than actionable detail.</p>` },
'code-repos': { title:'File / Code Repositories', cat:'Threat Intelligence', html:`
  <p>VirusTotal (check files/hashes against dozens of engines) and GitHub (where leaked exploits — and accidentally committed secrets — live).</p>` },

/* ── Threat Research Sources ── */
'vendor-sites': { title:'Vendor Websites', cat:'Research Sources', html:`
  <p>Advisories, patch notes, and threat write-ups from Microsoft, Cisco, CrowdStrike, etc. First stop for product-specific threats.</p>` },
'conferences': { title:'Conferences', cat:'Research Sources', html:`
  <p>New research and attack techniques debut at DEF CON, Black Hat, and RSA.</p>` },
'industry-groups': { title:'Local Industry Groups', cat:'Research Sources', html:`
  <p>Regional peer networking and shared experience — ISSA chapters, BSides.</p>` },
'info-sharing-centers': { title:'Public/Private Info-Sharing Centers', cat:'Research Sources', html:`
  <p>Structured sector-based exchange through ISACs and ISAOs.</p>` },
'academic-journals': { title:'Academic Journals', cat:'Research Sources', html:`
  <p>Peer-reviewed and rigorous — slower, but authoritative on fundamentals.</p>` },
'rfcs': { title:'RFCs — Requests for Comments', cat:'Research Sources', html:`
  <p>The actual IETF specifications of internet protocols — how things are <em>supposed</em> to work, which defines what abuse looks like.</p>` },
'social-media': { title:'Social Media', cat:'Research Sources', html:`
  <p>The fastest signal anywhere — researchers break news hours before formal advisories — but verify before acting.</p>` },

};

/* ═══════════════════════════════════════════════════
   CATEGORIES — sidebar filter + graph clustering
═══════════════════════════════════════════════════ */
const CATEGORIES = [
  { id:'actors',     label:'Threat Actors',        color:'#e74c3c',
    nodes:['nation-state','apt','organized-crime','hacktivist','insider-threat','unskilled-attacker','competitor'] },
  { id:'attributes', label:'Attacker Attributes',  color:'#3498db',
    nodes:['internal-external','resources-funding','sophistication'] },
  { id:'motivations',label:'Motivations',          color:'#9b59b6',
    nodes:['data-exfiltration','financial-gain','blackmail','service-disruption','chaos','beliefs','ethical-hacking','revenge','cyberwar','espionage'] },
  { id:'vectors',    label:'Threat Vectors',       color:'#e67e22',
    nodes:['message-vector','voice-vector','social-engineering','removable-media','vuln-exploit','supply-chain'] },
  { id:'surface',    label:'Attack Surface',       color:'#e74c3c',
    nodes:['attack-surface','shadow-it'] },
  { id:'malware',    label:'Malware',              color:'#e74c3c',
    nodes:['virus','worm','trojan','rat','logic-bomb','keylogger','spyware','rootkit','ransomware','bloatware'] },
  { id:'indicators', label:'Malware Indicators',   color:'#f1c40f',
    nodes:['extra-traffic','data-exfil-sign','encrypted-traffic','c2-beaconing','outgoing-spam'] },
  { id:'human',      label:'Human Vectors',        color:'#e67e22',
    nodes:['shoulder-surfing','tailgating','dumpster-diving','disinformation','elicitation','pretexting','watering-hole','bec','typosquatting','brand-impersonation'] },
  { id:'phishing',   label:'Phishing Family',      color:'#e74c3c',
    nodes:['spam','spim','phishing','spear-phishing','whaling','vishing','smishing'] },
  { id:'principles', label:'SE Principles',        color:'#9b59b6',
    nodes:['authority','intimidation','consensus','scarcity','familiarity'] },
  { id:'defense',    label:'Blocking Malware',     color:'#2ecc71',
    nodes:['spam-filter','anti-malware','utm','signature-based','heuristic-based','fim'] },
  { id:'intel',      label:'Threat Intelligence',  color:'#1abc9c',
    nodes:['osint','closed-intel','vuln-databases','stix','taxii','ais','dark-web','isac','ioc','predictive-analysis','threat-maps','code-repos'] },
  { id:'research',   label:'Research Sources',     color:'#8b98ad',
    nodes:['vendor-sites','conferences','industry-groups','info-sharing-centers','academic-journals','rfcs','social-media'] },
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
   STUDY MODE
═══════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════
   GRAPH VIEW — force-directed bubble chart
═══════════════════════════════════════════════════ */

/* helpers */
function gn(id,label,color,nodeId,x,y){return{id,label,color,nodeId:nodeId||null,x,y,vx:0,vy:0,r:20,pinned:false}}
function ge(s,t,type,label){return{s,t,type:type||'relates',label:label||null}}

/* ── Category anchor nodes (large, colored rings) ── */
const GNODES = [
  /* Category anchors */
  gn('cat-actors',     'Threat\nActors',     '#e74c3c', null, -720, -420),
  gn('cat-attributes', 'Attacker\nAttributes','#3498db', null, -280, -560),
  gn('cat-motivations','Motiv-\nations',     '#9b59b6', null,  220, -540),
  gn('cat-vectors',    'Threat\nVectors',    '#e67e22', null,  680, -380),
  gn('cat-surface',    'Attack\nSurface',    '#e74c3c', null,  880,  -80),
  gn('cat-malware',    'Malware',            '#e74c3c', null,  720,  260),
  gn('cat-indicators', 'Malware\nIndicators','#f1c40f', null,  380,  520),
  gn('cat-human',      'Human\nVectors',     '#e67e22', null,  -80,  600),
  gn('cat-phishing',   'Phishing\nFamily',   '#e74c3c', null, -520,  520),
  gn('cat-principles', 'SE\nPrinciples',     '#9b59b6', null, -880,  260),
  gn('cat-defense',    'Blocking\nMalware',  '#2ecc71', null, -960,  -40),
  gn('cat-intel',      'Threat\nIntel',      '#1abc9c', null,   40,   40),
  gn('cat-research',   'Research\nSources',  '#8b98ad', null,  520,   40),

  /* Threat Actors */
  gn('nation-state',      'Nation-State',  '#e74c3c','nation-state',     -660,-460),
  gn('apt',               'APT',           '#e74c3c','apt',              -580,-430),
  gn('organized-crime',   'Org. Crime',    '#e67e22','organized-crime',  -660,-360),
  gn('hacktivist',        'Hacktivist',    '#1abc9c','hacktivist',       -780,-370),
  gn('insider-threat',    'Insider',       '#9b59b6','insider-threat',   -850,-420),
  gn('unskilled-attacker','Unskilled',     '#8b98ad','unskilled-attacker',-780,-470),
  gn('competitor',        'Competitor',    '#3498db','competitor',       -570,-340),

  /* Attacker Attributes */
  gn('internal-external', 'Internal /\nExternal','#3498db','internal-external',-220,-600),
  gn('resources-funding', 'Resources',     '#3498db','resources-funding',-140,-570),
  gn('sophistication',    'Sophist-\nication','#3498db','sophistication', -220,-500),

  /* Motivations */
  gn('data-exfiltration', 'Data\nExfil',   '#e74c3c','data-exfiltration', 280,-580),
  gn('financial-gain',    'Financial',     '#e67e22','financial-gain',    360,-550),
  gn('blackmail',         'Blackmail',     '#e74c3c','blackmail',         280,-480),
  gn('service-disruption','Disruption',    '#e74c3c','service-disruption',160,-490),
  gn('chaos',             'Chaos',         '#e67e22','chaos',              90,-540),
  gn('beliefs',           'Beliefs',       '#1abc9c','beliefs',           160,-590),
  gn('ethical-hacking',   'Ethical\nHack', '#2ecc71','ethical-hacking',   370,-460),
  gn('revenge',           'Revenge',       '#9b59b6','revenge',            70,-460),
  gn('cyberwar',          'Cyberwar',      '#e74c3c','cyberwar',          370,-630),
  gn('espionage',         'Espionage',     '#9b59b6','espionage',          70,-630),

  /* Threat Vectors */
  gn('message-vector',    'Message',       '#e67e22','message-vector',    740,-420),
  gn('voice-vector',      'Voice Call',    '#e67e22','voice-vector',      820,-390),
  gn('social-engineering','Social Eng.',   '#e67e22','social-engineering',740,-320),
  gn('removable-media',   'USB Media',     '#e67e22','removable-media',   620,-330),
  gn('vuln-exploit',      'Vuln\nExploit', '#e74c3c','vuln-exploit',      550,-380),
  gn('supply-chain',      'Supply\nChain', '#e74c3c','supply-chain',      620,-430),

  /* Attack Surface */
  gn('attack-surface',    'Attack\nSurface','#e74c3c','attack-surface',   940,-120),
  gn('shadow-it',         'Shadow IT',     '#e67e22','shadow-it',        1020, -90),

  /* Malware */
  gn('virus',             'Virus',         '#e74c3c','virus',             780, 220),
  gn('worm',              'Worm',          '#e74c3c','worm',              860, 250),
  gn('trojan',            'Trojan',        '#e74c3c','trojan',            780, 320),
  gn('rat',               'RAT',           '#e74c3c','rat',               660, 310),
  gn('logic-bomb',        'Logic\nBomb',   '#e74c3c','logic-bomb',        590, 260),
  gn('keylogger',         'Keylogger',     '#e74c3c','keylogger',         660, 210),
  gn('spyware',           'Spyware',       '#e74c3c','spyware',           870, 340),
  gn('rootkit',           'Rootkit',       '#e74c3c','rootkit',           570, 340),
  gn('ransomware',        'Ransomware',    '#e74c3c','ransomware',        870, 170),
  gn('bloatware',         'Bloatware',     '#e67e22','bloatware',         570, 170),

  /* Malware Indicators */
  gn('extra-traffic',     'Extra\nTraffic','#f1c40f','extra-traffic',     440, 480),
  gn('data-exfil-sign',   'Data\nExfil',   '#f1c40f','data-exfil-sign',   520, 510),
  gn('encrypted-traffic', 'Encrypted',     '#f1c40f','encrypted-traffic', 440, 580),
  gn('c2-beaconing',      'C2\nBeacon',    '#f1c40f','c2-beaconing',      320, 570),
  gn('outgoing-spam',     'Out. Spam',     '#f1c40f','outgoing-spam',     250, 520),

  /* Human Vectors */
  gn('shoulder-surfing',  'Shoulder\nSurf','#e67e22','shoulder-surfing',  -20, 560),
  gn('tailgating',        'Tailgating',    '#e67e22','tailgating',         60, 590),
  gn('dumpster-diving',   'Dumpster\nDive','#e67e22','dumpster-diving',    -20, 660),
  gn('disinformation',    'Disinfo',       '#e67e22','disinformation',   -140, 650),
  gn('elicitation',       'Elicitation',   '#e67e22','elicitation',      -210, 600),
  gn('pretexting',        'Pretexting',    '#e67e22','pretexting',       -140, 550),
  gn('watering-hole',     'Watering\nHole','#e74c3c','watering-hole',      70, 680),
  gn('bec',               'BEC',           '#e74c3c','bec',              -230, 680),
  gn('typosquatting',     'Typo-\nsquat',  '#e67e22','typosquatting',      70, 510),
  gn('brand-impersonation','Brand\nImpers','#e67e22','brand-impersonation',-230,510),

  /* Phishing Family */
  gn('spam',              'Spam',          '#e67e22','spam',             -460, 480),
  gn('spim',              'SPIM',          '#e67e22','spim',             -380, 510),
  gn('phishing',          'Phishing',      '#e74c3c','phishing',         -460, 580),
  gn('spear-phishing',    'Spear\nPhish',  '#e74c3c','spear-phishing',   -580, 570),
  gn('whaling',           'Whaling',       '#e74c3c','whaling',          -650, 520),
  gn('vishing',           'Vishing',       '#e74c3c','vishing',          -580, 470),
  gn('smishing',          'Smishing',      '#e74c3c','smishing',         -370, 600),

  /* SE Principles */
  gn('authority',         'Authority',     '#9b59b6','authority',        -820, 220),
  gn('intimidation',      'Intimid-\nation','#9b59b6','intimidation',    -740, 250),
  gn('consensus',         'Consensus',     '#9b59b6','consensus',        -820, 320),
  gn('scarcity',          'Scarcity',      '#9b59b6','scarcity',         -940, 310),
  gn('familiarity',       'Familiarity',   '#9b59b6','familiarity',     -1010, 260),

  /* Blocking Malware */
  gn('spam-filter',       'Spam\nFilter',  '#2ecc71','spam-filter',      -900, -80),
  gn('anti-malware',      'Anti-\nMalware','#2ecc71','anti-malware',     -820, -50),
  gn('utm',               'UTM',           '#2ecc71','utm',              -900,  20),
  gn('signature-based',   'Signature',     '#2ecc71','signature-based', -1020,  10),
  gn('heuristic-based',   'Heuristic',     '#2ecc71','heuristic-based', -1090, -40),
  gn('fim',               'FIM',           '#2ecc71','fim',              -820,-110),

  /* Threat Intelligence */
  gn('osint',             'OSINT',         '#1abc9c','osint',             100,   0),
  gn('closed-intel',      'Closed\nIntel', '#1abc9c','closed-intel',      180,  30),
  gn('vuln-databases',    'CVE / NVD',     '#3498db','vuln-databases',    100, 100),
  gn('stix',              'STIX',          '#1abc9c','stix',              -20,  90),
  gn('taxii',             'TAXII',         '#1abc9c','taxii',             -90,  40),
  gn('ais',               'AIS',           '#1abc9c','ais',               -20, -10),
  gn('dark-web',          'Dark Web',      '#e74c3c','dark-web',          190, 120),
  gn('isac',              'ISACs',         '#1abc9c','isac',             -110, 120),
  gn('ioc',               'IoC',           '#3498db','ioc',               190, -50),
  gn('predictive-analysis','Predictive',   '#1abc9c','predictive-analysis',-110,-50),
  gn('threat-maps',       'Threat\nMaps',  '#1abc9c','threat-maps',        60, 170),
  gn('code-repos',        'Code\nRepos',   '#8b98ad','code-repos',         60, -90),

  /* Research Sources */
  gn('vendor-sites',      'Vendor\nSites', '#8b98ad','vendor-sites',      580,   0),
  gn('conferences',       'Conf-\nerences','#8b98ad','conferences',       660,  30),
  gn('industry-groups',   'Industry\nGroups','#8b98ad','industry-groups', 580, 100),
  gn('info-sharing-centers','Info\nSharing','#8b98ad','info-sharing-centers',460,90),
  gn('academic-journals', 'Journals',      '#8b98ad','academic-journals', 390,  40),
  gn('rfcs',              'RFCs',          '#8b98ad','rfcs',               460, -10),
  gn('social-media',      'Social\nMedia', '#8b98ad','social-media',       660, 110),
];

const GEDGES = [
  /* category membership */
  ge('cat-actors','nation-state','member'), ge('cat-actors','apt','member'),
  ge('cat-actors','organized-crime','member'), ge('cat-actors','hacktivist','member'),
  ge('cat-actors','insider-threat','member'), ge('cat-actors','unskilled-attacker','member'),
  ge('cat-actors','competitor','member'),

  ge('cat-attributes','internal-external','member'), ge('cat-attributes','resources-funding','member'),
  ge('cat-attributes','sophistication','member'),

  ge('cat-motivations','data-exfiltration','member'), ge('cat-motivations','financial-gain','member'),
  ge('cat-motivations','blackmail','member'), ge('cat-motivations','service-disruption','member'),
  ge('cat-motivations','chaos','member'), ge('cat-motivations','beliefs','member'),
  ge('cat-motivations','ethical-hacking','member'), ge('cat-motivations','revenge','member'),
  ge('cat-motivations','cyberwar','member'), ge('cat-motivations','espionage','member'),

  ge('cat-vectors','message-vector','member'), ge('cat-vectors','voice-vector','member'),
  ge('cat-vectors','social-engineering','member'), ge('cat-vectors','removable-media','member'),
  ge('cat-vectors','vuln-exploit','member'), ge('cat-vectors','supply-chain','member'),

  ge('cat-surface','attack-surface','member'), ge('cat-surface','shadow-it','member'),

  ge('cat-malware','virus','member'), ge('cat-malware','worm','member'),
  ge('cat-malware','trojan','member'), ge('cat-malware','rat','member'),
  ge('cat-malware','logic-bomb','member'), ge('cat-malware','keylogger','member'),
  ge('cat-malware','spyware','member'), ge('cat-malware','rootkit','member'),
  ge('cat-malware','ransomware','member'), ge('cat-malware','bloatware','member'),

  ge('cat-indicators','extra-traffic','member'), ge('cat-indicators','data-exfil-sign','member'),
  ge('cat-indicators','encrypted-traffic','member'), ge('cat-indicators','c2-beaconing','member'),
  ge('cat-indicators','outgoing-spam','member'),

  ge('cat-human','shoulder-surfing','member'), ge('cat-human','tailgating','member'),
  ge('cat-human','dumpster-diving','member'), ge('cat-human','disinformation','member'),
  ge('cat-human','elicitation','member'), ge('cat-human','pretexting','member'),
  ge('cat-human','watering-hole','member'), ge('cat-human','bec','member'),
  ge('cat-human','typosquatting','member'), ge('cat-human','brand-impersonation','member'),

  ge('cat-phishing','spam','member'), ge('cat-phishing','spim','member'),
  ge('cat-phishing','phishing','member'), ge('cat-phishing','spear-phishing','member'),
  ge('cat-phishing','whaling','member'), ge('cat-phishing','vishing','member'),
  ge('cat-phishing','smishing','member'),

  ge('cat-principles','authority','member'), ge('cat-principles','intimidation','member'),
  ge('cat-principles','consensus','member'), ge('cat-principles','scarcity','member'),
  ge('cat-principles','familiarity','member'),

  ge('cat-defense','spam-filter','member'), ge('cat-defense','anti-malware','member'),
  ge('cat-defense','utm','member'), ge('cat-defense','signature-based','member'),
  ge('cat-defense','heuristic-based','member'), ge('cat-defense','fim','member'),

  ge('cat-intel','osint','member'), ge('cat-intel','closed-intel','member'),
  ge('cat-intel','vuln-databases','member'), ge('cat-intel','stix','member'),
  ge('cat-intel','taxii','member'), ge('cat-intel','ais','member'),
  ge('cat-intel','dark-web','member'), ge('cat-intel','isac','member'),
  ge('cat-intel','ioc','member'), ge('cat-intel','predictive-analysis','member'),
  ge('cat-intel','threat-maps','member'), ge('cat-intel','code-repos','member'),

  ge('cat-research','vendor-sites','member'), ge('cat-research','conferences','member'),
  ge('cat-research','industry-groups','member'), ge('cat-research','info-sharing-centers','member'),
  ge('cat-research','academic-journals','member'), ge('cat-research','rfcs','member'),
  ge('cat-research','social-media','member'),

  /* cross-links — relationships */
  ge('apt','nation-state','campaign-of'),
  ge('nation-state','espionage','conducts'),
  ge('nation-state','cyberwar','conducts'),
  ge('organized-crime','financial-gain','seeks'),
  ge('organized-crime','ransomware','deploys'),
  ge('hacktivist','beliefs','driven-by'),
  ge('insider-threat','revenge','often'),
  ge('competitor','espionage','conducts'),
  ge('ransomware','blackmail','enables'),
  ge('rat','trojan','is-a'),
  ge('supply-chain','message-vector','relates'),
  ge('watering-hole','social-engineering','type-of'),
  ge('bec','authority','exploits'),
  ge('phishing','message-vector','uses'),
  ge('vishing','voice-vector','uses'),
  ge('signature-based','anti-malware','method-of'),
  ge('heuristic-based','anti-malware','method-of'),
  ge('spam-filter','spam','blocks'),
  ge('stix','taxii','carried-by'),
  ge('ais','taxii','uses'),
  ge('ioc','osint','found-in'),
  ge('c2-beaconing','rat','signals'),
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
  'supports':    {color:'#2ecc71',w:1.5,dash:'',   mk:'ga-green'},
  'enforced-by': {color:'#3498db',w:1.5,dash:'',   mk:'ga-blue'},
  'verified-by': {color:'#2ecc71',w:1.5,dash:'',   mk:'ga-green'},
  'supported-by':{color:'#1abc9c',w:1.5,dash:'',   mk:'ga-teal'},
  'contains':    {color:'#e67e22',w:1.5,dash:'',   mk:'ga-gray'},
  'triggers':    {color:'#e74c3c',w:1.5,dash:'5,3',mk:'ga-red'},
  'addressed-by':{color:'#3498db',w:1.5,dash:'',   mk:'ga-blue'},
  'uses':        {color:'#222c44',w:1.5,dash:'',   mk:'ga-gray'},
  'feeds':       {color:'#f1c40f',w:1.5,dash:'',   mk:'ga-gray'},
  'powers':      {color:'#3b82f6',w:1.5,dash:'',   mk:'ga-blue'},
  'related':     {color:'#475569',w:1,  dash:'4,4', mk:null},
  'type-of':     {color:'#222c44',w:1,  dash:'',   mk:'ga-gray'},
  'implements':  {color:'#3498db',w:1,  dash:'',   mk:'ga-blue'},
  'mitigates':   {color:'#2ecc71',w:1.5,dash:'',   mk:'ga-green'},
  'guides':      {color:'#1abc9c',w:1,  dash:'3,4', mk:'ga-teal'},
  'sends-to':    {color:'#f1c40f',w:1,  dash:'',   mk:'ga-gray'},
  'correlates-with':{color:'#3b82f6',w:1,dash:'4,4',mk:null},
  'extends':     {color:'#1abc9c',w:1.5,dash:'',   mk:'ga-teal'},
  'enables':     {color:'#2ecc71',w:1.5,dash:'',   mk:'ga-green'},
  'protected-by':{color:'#a855f7',w:1.5,dash:'',   mk:'ga-gray'},
  'protects':    {color:'#1abc9c',w:1.5,dash:'',   mk:'ga-teal'},
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

const GICONS = {
  'cat-cia':'🔒','cat-risk':'⚠','cat-ctrlcat':'🏛','cat-ctrltype':'🛡',
  'cat-data':'🗄','cat-crypto':'🔑','cat-logging':'📋','cat-siem':'🖥','cat-infra':'⚙',
  'confidentiality':'🤫','integrity':'✅','availability':'⬆','hashing':'#️',
  'access-controls':'🚪','risk':'⚠','vulnerability':'🕳','security-incident':'🚨',
  'risk-mitigation':'🛠','technical-controls':'💻','operational-controls':'👥',
  'managerial-controls':'📊','physical-controls':'🔐','nist':'📜',
  'preventive':'🛡','deterrent':'⚡','detective':'🔍','corrective':'🔧',
  'compensating':'⚖','directive':'📋','pii':'👤','tokenization':'🎟',
  'data-masking':'🎭','obfuscation':'🌫','steganography':'🖼',
  'key-stretching':'💪','pfs':'🔄','security-log':'🔒','system-log':'💻',
  'application-log':'📱','linux-logs':'🐧','firewall-logs':'🧱',
  'syslog':'📡','packet-captures':'📦','metadata':'🏷','originators':'📤',
  'siem':'📊','siem-dashboards':'📈','ids-ips':'🚨',
  'nic':'🔌','tcp':'📡','redundancy':'♻','resiliency':'💪',
  'scalability':'📈','horizontal-scaling':'↔','vertical-scaling':'↕',
  'elasticity':'🌊','patching':'🩹',
};

const GEDGE_DESC = {
  'confidentiality->hashing':'Hashing verifies\ndata hasn\'t changed',
  'confidentiality->access-controls':'Access controls\nenforce who sees data',
  'integrity->hashing':'Hashing detects\nunauthorized changes',
  'availability->redundancy':'Redundancy prevents\ndowntime failures',
  'availability->resiliency':'Resiliency ensures\nquick recovery',
  'availability->scalability':'Scaling maintains\navailability under load',
  'risk->vulnerability':'Vulnerabilities are\nexploitable weaknesses in risk',
  'risk->security-incident':'Realized risks become\nsecurity incidents',
  'vulnerability->risk-mitigation':'Mitigations address\nknown vulnerabilities',
  'risk-mitigation->patching':'Patching closes\nvulnerable software',
  'risk-mitigation->technical-controls':'Technical controls\nreduce risk',
  'hashing->key-stretching':'Key stretching applies\nhashing iteratively',
  'pfs->confidentiality':'PFS protects past\nsessions\' confidentiality',
  'pii->tokenization':'Tokenization protects\nPII with safe tokens',
  'pii->data-masking':'Masking hides\nreal PII values',
  'obfuscation->steganography':'Steganography is\nadvanced obfuscation',
  'technical-controls->preventive':'Firewalls are\npreventive tech controls',
  'technical-controls->detective':'IDS/IPS are\ndetective tech controls',
  'operational-controls->detective':'Guards and audits\ndetect incidents',
  'managerial-controls->directive':'Policies are\nmanagerial directives',
  'nist->managerial-controls':'NIST guides\nmanagerial policy creation',
  'nist->risk-mitigation':'NIST RMF guides\nrisk mitigation steps',
  'syslog->siem':'Syslog streams\nlogs into SIEM',
  'originators->syslog':'Devices send logs\nvia Syslog protocol',
  'security-log->siem':'Security events\nfeed into SIEM',
  'firewall-logs->siem':'Firewall events\nfeed into SIEM',
  'siem->siem-dashboards':'SIEM powers\nvisual dashboards',
  'siem->ids-ips':'SIEM correlates\nIDS/IPS alerts',
  'ids-ips->detective':'IDS is a\ndetective control type',
  'ids-ips->preventive':'IPS is a\npreventive control type',
  'packet-captures->siem':'PCAP data feeds\ninto SIEM analysis',
  'metadata->siem':'Metadata enriches\nSIEM investigations',
  'scalability->horizontal-scaling':'Horizontal = add\nmore nodes (scale out)',
  'scalability->vertical-scaling':'Vertical = upgrade\nexisting node (scale up)',
  'elasticity->scalability':'Elasticity is\nauto-scaling capability',
  'redundancy->resiliency':'Redundancy is the\nfoundation of resilience',
  'tcp->nic':'TCP packets are\ntransmitted via NIC',
  'patching->vulnerability':'Patching closes\nknown vulnerabilities',
  'access-controls->technical-controls':'Access controls are\na technical control type',
};

function getEdgeDesc(e) {
  return GEDGE_DESC[`${e.s}->${e.t}`] || null;
}

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
    const desc=getEdgeDesc(e);
    if(desc&&e.type!=='member'){
      const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
      const lines=desc.split('\n');
      const bw=76,bh=lines.length*10+6;
      svgGe.appendChild(el('rect',{x:mx-bw/2,y:my-bh/2,width:bw,height:bh,rx:'3',
        fill:'#07090f',stroke:st.color,'stroke-width':'0.5',opacity:'0.92'}));
      lines.forEach((ln,i)=>{
        const t=el('text',{x:mx,y:my-(lines.length-1)*5+i*10,
          'text-anchor':'middle','dominant-baseline':'middle','font-size':'7.5',
          'font-family':'Segoe UI,system-ui,sans-serif','font-weight':'600',
          fill:st.color,'pointer-events':'none'});
        t.textContent=ln;svgGe.appendChild(t);
      });
    }
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
