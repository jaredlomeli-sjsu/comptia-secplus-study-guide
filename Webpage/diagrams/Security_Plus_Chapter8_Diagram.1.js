const NODE_DATA = {

'risk': { title:'Risk', cat:'Risk Fundamentals', html:`
  <p>The <strong>likelihood</strong> that a threat will exploit a vulnerability, combined with the <strong>impact</strong> if it happens. Risk = Threat × Vulnerability × Impact.</p>
  <div class="exam-tip">Risk has three ingredients — drop any one and there is no risk.</div>` },
'impact': { title:'Impact', cat:'Risk Fundamentals', html:`
  <p>The harm caused if a risk is realized — measured in <strong>dollars, downtime, lives, reputation, or compliance fines</strong>.</p>` },
'malicious-human': { title:'Malicious Human Threat', cat:'Risk Fundamentals', html:`
  <p>People who <strong>intentionally</strong> harm the organization — external attackers, hacktivists, criminals, nation-states, or malicious insiders.</p>` },
'accidental-human': { title:'Accidental Human Threat', cat:'Risk Fundamentals', html:`
  <p>Unintentional harm caused by users — clicking a phishing link, misconfiguring a server, emailing data to the wrong person. The most <strong>common</strong> threat source.</p>` },
'environmental': { title:'Environmental Threats', cat:'Risk Fundamentals', html:`
  <p>Non-human threats: <strong>fire, flood, earthquake, hurricane, power loss, HVAC failure</strong>. Handled with site selection, redundancy, and disaster recovery.</p>` },
'threat-assessment': { title:'Threat Assessment', cat:'Risk Fundamentals', html:`
  <p>Cataloguing <strong>what could harm</strong> the organization — by source (human, natural, technical) and by likelihood — as input to risk analysis.</p>` },
'risk-identification': { title:'Risk Identification', cat:'Risk Fundamentals', html:`
  <p>The first step of the risk-management lifecycle: <strong>finding</strong> risks before they become incidents, through interviews, scans, audits, and prior loss data.</p>` },

'internal-risk': { title:'Internal Risk', cat:'Risk Types', html:`
  <p>Risks originating <strong>inside</strong> the organization — disgruntled staff, sloppy processes, weak controls, untrained users.</p>` },
'external-risk': { title:'External Risk', cat:'Risk Types', html:`
  <p>Risks from <strong>outside</strong> — attackers, competitors, regulators, natural events, and changes in the threat landscape.</p>` },
'ip-theft': { title:'Intellectual Property Theft', cat:'Risk Types', html:`
  <p>Loss of trade secrets, source code, designs, formulas, or strategy documents. Damage is often <strong>strategic and permanent</strong>, not just financial.</p>` },
'software-compliance': { title:'Software Compliance / Licensing', cat:'Risk Types', html:`
  <p>Running unlicensed or over-deployed software exposes the org to <strong>audits, fines, and lawsuits</strong>. Tracked with software asset management.</p>` },
'legacy-systems': { title:'Legacy Systems / Platforms', cat:'Risk Types', html:`
  <p>End-of-life systems no longer receiving <strong>security patches</strong>. Mitigations include segmentation, compensating controls, and migration plans.</p>
  <div class="exam-tip">If you can't patch it, isolate it.</div>` },

'lack-hardening': { title:'Lack of Hardening', cat:'Vulnerability Types', html:`
  <p>Defaults left in place — open services, default credentials, unnecessary features. Fix with <strong>baselines, CIS benchmarks, and config compliance scans</strong>.</p>` },
'lack-policies': { title:'Lack of Security Policies', cat:'Vulnerability Types', html:`
  <p>Without written policies, people make up the rules. Without rules, <strong>nothing is enforceable</strong>.</p>` },
'weak-practices': { title:'Improper / Weak Practices', cat:'Vulnerability Types', html:`
  <p>Bad habits that look like work: shared passwords, propped-open doors, ad-hoc firewall changes, "temporary" exceptions that never expire.</p>` },
'lack-firewall': { title:'Lack of Firewalls', cat:'Vulnerability Types', html:`
  <p>No filtering at the boundary means <strong>anything</strong> can reach internal hosts. Even a basic stateful firewall removes most opportunistic traffic.</p>` },
'lack-antimalware': { title:'Lack of Anti-Malware', cat:'Vulnerability Types', html:`
  <p>Endpoints without anti-malware or EDR detect <strong>nothing</strong> — malware can run, persist, and spread before anyone notices.</p>` },

'risk-management': { title:'Risk Management', cat:'Risk Management', html:`
  <p>The <strong>ongoing program</strong> of identifying, analyzing, treating, and monitoring risk — not a one-time project. Drives every other security decision.</p>` },
'risk-assessment': { title:'Risk Assessment', cat:'Risk Management', html:`
  <p>The analyze step: <strong>rate likelihood and impact</strong>, then prioritize. Output drives the risk register and treatment plans.</p>` },
'continuous-assessment': { title:'Continuous Risk Assessment', cat:'Risk Management', html:`
  <p>Always-on monitoring of changes that move risk — new vulns, new vendors, new threats, new business processes — so the picture stays current.</p>` },
'inherent-risk': { title:'Inherent Risk', cat:'Risk Management', html:`
  <p>The risk <strong>before</strong> any controls are applied — the "raw" exposure of the activity itself.</p>` },
'residual-risk': { title:'Residual Risk', cat:'Risk Management', html:`
  <p>What remains <strong>after</strong> controls are in place. Should be at or below the risk appetite.</p>
  <div class="exam-tip">Inherent − controls = residual.</div>` },
'control-risk': { title:'Control Risk', cat:'Risk Management', html:`
  <p>The chance that a <strong>control itself fails or is bypassed</strong>. Why we use defense-in-depth — one failed control should not undo the program.</p>` },
'risk-appetite': { title:'Risk Appetite', cat:'Risk Management', html:`
  <p>The <strong>type and amount</strong> of risk leadership is willing to pursue. Sets the bar for treatment decisions.</p>` },
'expansionary': { title:'Expansionary Appetite', cat:'Risk Management', html:`
  <p>Willing to take on <strong>more</strong> risk for growth — startups, new markets, aggressive timelines.</p>` },
'conservative': { title:'Conservative Appetite', cat:'Risk Management', html:`
  <p><strong>Risk-averse</strong>: prefer stability over upside. Common in healthcare, finance, government, and any heavily regulated sector.</p>` },
'neutral': { title:'Neutral Appetite', cat:'Risk Management', html:`
  <p><strong>Balanced</strong> between growth and caution — most mature mid-size organizations.</p>` },
'risk-tolerance': { title:'Risk Tolerance', cat:'Risk Management', html:`
  <p>The <strong>acceptable variance</strong> around the appetite — how far from "ideal" leadership will accept on a given risk before it must be treated.</p>` },
'asset': { title:'Asset', cat:'Risk Management', html:`
  <p>Anything of value to the organization — data, systems, facilities, people, brand, intellectual property. You can't protect what you haven't <strong>inventoried</strong>.</p>` },
'asset-value': { title:'Asset Value (AV)', cat:'Risk Management', html:`
  <p>The dollar value of an asset — required input for <strong>quantitative</strong> risk math (AV × EF = SLE).</p>` },
'rca': { title:'Risk Control Assessment (RCA)', cat:'Risk Management', html:`
  <p>An independent review of how well controls are <strong>designed and operating</strong>. Often done by internal audit or a third party.</p>` },
'rcsa': { title:'Risk Control Self-Assessment (RCSA)', cat:'Risk Management', html:`
  <p>Business units <strong>rate their own</strong> risks and controls. Cheap and fast, but biased — pair with independent review.</p>` },

'quantitative': { title:'Quantitative Analysis', cat:'Quantitative Analysis', html:`
  <p>Uses <strong>dollar figures and probabilities</strong> — defensible to executives, requires reliable data.</p>` },
'ef': { title:'Exposure Factor (EF)', cat:'Quantitative Analysis', html:`
  <p>The <strong>percentage</strong> of an asset lost in a single event. A laptop stolen = 100%; a hard drive corrupted = 50%, etc.</p>` },
'sle': { title:'Single Loss Expectancy (SLE)', cat:'Quantitative Analysis', html:`
  <p>Loss in dollars from <strong>one</strong> occurrence. <code>SLE = AV × EF</code>.</p>` },
'aro': { title:'Annualized Rate of Occurrence (ARO)', cat:'Quantitative Analysis', html:`
  <p>How often per year you expect the event. <strong>Once every two years</strong> = 0.5; <strong>twice a year</strong> = 2.</p>` },
'ale': { title:'Annualized Loss Expectancy (ALE)', cat:'Quantitative Analysis', html:`
  <p>The expected <strong>annual cost</strong> of the risk. <code>ALE = SLE × ARO</code>.</p>
  <div class="exam-tip">Spend less per year on a control than the ALE — otherwise the control costs more than the risk.</div>` },

'qualitative': { title:'Qualitative Analysis', cat:'Reporting & Treatment', html:`
  <p>Rates risks on a <strong>scale</strong> — high/medium/low or 1–5 — instead of dollars. Fast and intuitive but subjective.</p>` },
'risk-reporting': { title:'Risk Reporting', cat:'Reporting & Treatment', html:`
  <p>Communicating risk posture <strong>to leadership and the board</strong>, usually as dashboards summarizing register, matrix, and trend.</p>` },
'risk-register': { title:'Risk Register', cat:'Reporting & Treatment', html:`
  <p>The <strong>master list</strong> of all known risks: description, owner, likelihood, impact, current treatment, and status. The center of the risk program.</p>` },
'risk-matrix': { title:'Risk Matrix / Heat Map', cat:'Reporting & Treatment', html:`
  <p>A grid plotting <strong>likelihood vs. impact</strong> — red cells in the top-right demand action, green cells can usually be accepted.</p>` },
'risk-accept': { title:'Risk Acceptance', cat:'Reporting & Treatment', html:`
  <p>Acknowledge the risk and <strong>do nothing</strong> — appropriate when the cost of treatment exceeds the expected loss.</p>` },
'risk-avoid': { title:'Risk Avoidance', cat:'Reporting & Treatment', html:`
  <p><strong>Stop doing</strong> the activity that creates the risk. The only response that drives the risk to zero — but you lose the activity's benefits.</p>` },
'risk-mitigate': { title:'Risk Mitigation', cat:'Reporting & Treatment', html:`
  <p>Apply <strong>controls</strong> to reduce likelihood or impact. The default response for most risks.</p>` },
'risk-transfer': { title:'Risk Transfer', cat:'Reporting & Treatment', html:`
  <p>Shift the financial impact to someone else — <strong>insurance, contracts, outsourcing</strong>. The risk still exists; you've just moved the bill.</p>` },

'supply-chain': { title:'Supply Chain', cat:'Supply Chain', html:`
  <p>The chain of <strong>vendors, software, components, and services</strong> behind your product. A weakness anywhere in it becomes your problem.</p>
  <div class="exam-tip">SolarWinds was a supply-chain attack — the trusted update was the vector.</div>` },
'vendor-risk': { title:'Vendor Risk', cat:'Supply Chain', html:`
  <p>The risk a third party brings — breach at the vendor, weak contracts, lock-in, or sub-tier compromise reaching your data.</p>` },
'vendor-assessment': { title:'Vendor Assessment', cat:'Supply Chain', html:`
  <p>Pre- and ongoing <strong>due diligence</strong>: questionnaires, SOC 2 reports, pentest summaries, financial health, and exit/contingency plans.</p>` },

'cve': { title:'CVE — Common Vulnerabilities and Exposures', cat:'Vuln Standards', html:`
  <p>A <strong>unique identifier</strong> (e.g. <code>CVE-2024-12345</code>) for a publicly known flaw. CVE <em>names</em> the vulnerability.</p>` },
'cvss': { title:'CVSS — Common Vulnerability Scoring System', cat:'Vuln Standards', html:`
  <p>A 0.0–10.0 <strong>severity score</strong> reflecting exploitability and impact. CVSS <em>scores</em> the vulnerability.</p>
  <div class="exam-tip">CVE names; CVSS scores.</div>` },
'scap': { title:'SCAP — Security Content Automation Protocol', cat:'Vuln Standards', html:`
  <p>A NIST-driven suite of standards (XCCDF, OVAL, CCE, CPE) so scanners and content from different vendors <strong>speak the same language</strong> and results are automatable.</p>` },
'vuln-sources': { title:'Vulnerability Info Sources', cat:'Vuln Standards', html:`
  <p>Where to learn about new vulns: <strong>NVD, vendor advisories, CISA KEV, ISAC feeds, threat intel platforms</strong>, and the security press.</p>` },

'vuln-assessment': { title:'Vulnerability Assessment', cat:'Vulnerability Assessment', html:`
  <p>A <strong>scan-and-report</strong> exercise to find missing patches, weak configs, and exposed services — not exploited like a pentest, just identified.</p>` },
'network-scanner': { title:'Network Scanner', cat:'Vulnerability Assessment', html:`
  <p>Discovers <strong>live hosts</strong> and what's listening on them. Foundation for every other scan.</p>` },
'arp-ping': { title:'ARP Ping Scan', cat:'Vulnerability Assessment', html:`
  <p>Uses ARP requests on the local LAN — works even when hosts <strong>block ICMP</strong>. Layer-2, so it can't cross routers.</p>` },
'syn-stealth': { title:'SYN Stealth Scan', cat:'Vulnerability Assessment', html:`
  <p>Sends a SYN and analyzes the reply but never completes the handshake — less likely to be logged by the target. Nmap <code>-sS</code>.</p>` },
'port-scan': { title:'Port Scan', cat:'Vulnerability Assessment', html:`
  <p>Determines which TCP/UDP <strong>ports are open</strong>, closed, or filtered on a host.</p>` },
'service-scan': { title:'Service Scan', cat:'Vulnerability Assessment', html:`
  <p>Goes further: identifies the <strong>application and version</strong> behind each open port (Apache 2.4.41, OpenSSH 8.2, etc.). Nmap <code>-sV</code>.</p>` },
'os-detection': { title:'OS Detection', cat:'Vulnerability Assessment', html:`
  <p>Guesses the <strong>operating system</strong> from TCP/IP stack fingerprints. Nmap <code>-O</code>.</p>` },
'vuln-scanner': { title:'Vulnerability Scanner', cat:'Vulnerability Assessment', html:`
  <p>Matches discovered systems and versions against a <strong>CVE database</strong> to produce a prioritized list of flaws. Tools: Nessus, OpenVAS, Qualys, Rapid7.</p>` },
'config-compliance': { title:'Configuration Compliance Scanner', cat:'Vulnerability Assessment', html:`
  <p>Audits a system against a <strong>baseline or benchmark</strong> (CIS, DISA STIG) and reports which settings drift.</p>` },

'credentialed': { title:'Credentialed Scan', cat:'Scan Authentication', html:`
  <p>The scanner <strong>logs in</strong> with valid credentials. Sees patch levels, registry, configs — far <strong>deeper</strong> and far fewer false positives.</p>
  <div class="exam-tip">Credentialed = inside view. Use it for internal vuln management.</div>` },
'noncredentialed': { title:'Non-Credentialed Scan', cat:'Scan Authentication', html:`
  <p>No login — the scanner sees only what an <strong>outside attacker</strong> would. Useful for perimeter posture but misses internal flaws.</p>` },

'pentest': { title:'Penetration Test', cat:'Penetration Testing', html:`
  <p>An <strong>authorized simulated attack</strong> against the organization to find what real attackers would find — and prove it by exploiting it.</p>` },
'physical-pentest': { title:'Physical Penetration Test', cat:'Penetration Testing', html:`
  <p>Tests <strong>doors, locks, badges, cameras, and human guards</strong> — tailgating, lock picking, social-engineering a receptionist.</p>` },
'red-team': { title:'Red Team', cat:'Penetration Testing', html:`
  <p>The <strong>offensive</strong> team — simulates real adversaries with stealth, persistence, and creativity. Goal: achieve objectives without getting caught.</p>` },
'blue-team': { title:'Blue Team', cat:'Penetration Testing', html:`
  <p>The <strong>defensive</strong> team — SOC analysts, IR, hunters. Detect, contain, and evict the attacker.</p>` },
'purple-team': { title:'Purple Team', cat:'Penetration Testing', html:`
  <p><strong>Integrated</strong> exercise where red and blue <em>work together</em> in real time so the org learns the most per dollar — red attacks, blue tunes detection live.</p>
  <div class="exam-tip">Red attacks · blue defends · purple collaborates.</div>` },
'roe': { title:'Rules of Engagement (ROE)', cat:'Penetration Testing', html:`
  <p>Written, signed agreement: <strong>scope, schedule, targets in and out of scope, allowed techniques, points of contact, and emergency stop conditions</strong>. Protects everyone.</p>` },

'black-box': { title:'Black-Box Testing', cat:'Tester Knowledge', html:`
  <p>Tester gets <strong>no internal information</strong> — simulates an external attacker discovering everything from scratch. Realistic but slow.</p>` },
'white-box': { title:'White-Box Testing', cat:'Tester Knowledge', html:`
  <p>Tester has <strong>full knowledge</strong> — diagrams, source code, credentials. Fastest and deepest; mimics a malicious insider or auditor.</p>` },
'gray-box': { title:'Gray-Box Testing', cat:'Tester Knowledge', html:`
  <p><strong>Partial knowledge</strong> — e.g. user credentials and a network diagram. The common middle ground.</p>` },

'recon': { title:'Reconnaissance', cat:'Recon & Footprinting', html:`
  <p>Gathering information about a target <strong>before</strong> attempting access. Recon makes every later phase faster.</p>` },
'passive-recon': { title:'Passive Reconnaissance', cat:'Recon & Footprinting', html:`
  <p><strong>No packets sent to the target</strong> — OSINT, public records, social media, DNS lookups via third parties. Undetectable.</p>` },
'network-recon': { title:'Network Reconnaissance', cat:'Recon & Footprinting', html:`
  <p>Active probing — pings, port scans, banner grabs. <strong>Detectable</strong> but produces ground-truth data.</p>` },
'footprinting': { title:'Footprinting', cat:'Recon & Footprinting', html:`
  <p>Building a <strong>profile of the organization</strong>: domains, subdomains, IP ranges, employees, technologies, vendors.</p>` },
'fingerprinting': { title:'Fingerprinting', cat:'Recon & Footprinting', html:`
  <p>Identifying the <strong>specific systems and software</strong> at the target — versions, platforms, frameworks.</p>` },
'os-fingerprinting': { title:'OS Fingerprinting', cat:'Recon & Footprinting', html:`
  <p>Identifying the <strong>operating system</strong> by quirks in its TCP/IP stack (window sizes, TTLs, options).</p>` },

'ip-scanner': { title:'IP Scanner', cat:'Scanning Tools', html:`
  <p>Walks a subnet and reports <strong>live hosts</strong>. Examples: Angry IP Scanner, Advanced IP Scanner.</p>` },
'nmap': { title:'nmap', cat:'Scanning Tools', html:`
  <p>The standard <strong>port and service scanner</strong>. Host discovery, port scan, service/version detection, OS detection, scripting via NSE.</p>
  <div class="exam-tip">If a question describes a flexible CLI that maps hosts, ports, services, and OS — it's nmap.</div>` },
'netcat': { title:'netcat (nc)', cat:'Scanning Tools', html:`
  <p>"The TCP/IP <strong>swiss army knife</strong>" — reads and writes raw sockets. Used to banner-grab, transfer files, and set up bind/reverse shells.</p>` },
'scanless': { title:'scanless', cat:'Scanning Tools', html:`
  <p>Performs port scans by proxying through <strong>third-party scan websites</strong>, so the target sees the website's IP — not yours.</p>` },
'dnsenum': { title:'dnsenum', cat:'Scanning Tools', html:`
  <p>Enumerates DNS records, attempts <strong>zone transfers</strong>, and brute-forces subdomains to map a target's namespace.</p>` },
'nessus': { title:'Nessus', cat:'Scanning Tools', html:`
  <p>Industry-standard <strong>vulnerability scanner</strong> (Tenable). Plugin-based; produces CVSS-scored findings with remediation guidance.</p>` },
'hping': { title:'hping', cat:'Scanning Tools', html:`
  <p><strong>Crafts custom TCP/UDP/ICMP packets</strong> to test firewalls, do advanced traceroute, and run packet-level attacks.</p>` },
'sn1per': { title:'sn1per', cat:'Scanning Tools', html:`
  <p>An <strong>all-in-one recon framework</strong> that chains many tools (nmap, Nikto, Metasploit modules, OSINT) into a single automated assessment.</p>` },
'curl': { title:'cURL', cat:'Scanning Tools', html:`
  <p>Command-line HTTP client. Sends <strong>arbitrary HTTP(S) requests</strong> — headers, methods, bodies — for probing web apps and APIs.</p>` },

'persistence': { title:'Persistence', cat:'Post-Exploitation', html:`
  <p>Mechanisms that let an attacker <strong>survive a reboot</strong> — scheduled tasks, services, registry run keys, web shells, malicious accounts.</p>` },
'vertical-movement': { title:'Vertical Movement', cat:'Post-Exploitation', html:`
  <p>Moving <strong>up the privilege ladder</strong> — user → power user → admin → domain admin. Same as privilege escalation.</p>` },
'lateral-movement': { title:'Lateral Movement', cat:'Post-Exploitation', html:`
  <p>Moving <strong>sideways</strong> from the initial host to other hosts at the <em>same</em> privilege level — chasing better data or position.</p>` },
'priv-esc': { title:'Privilege Escalation', cat:'Post-Exploitation', html:`
  <p>Gaining <strong>more rights</strong> than the current account has — through misconfigs, unpatched kernels, weak SUID binaries, or stolen tokens.</p>` },
'pivoting': { title:'Pivoting', cat:'Post-Exploitation', html:`
  <p>Using a <strong>compromised host as a launchpad</strong> to attack systems the attacker couldn't reach directly — common across segmented networks.</p>` },

'security-assessment': { title:'Security Assessment', cat:'Testing Types', html:`
  <p>Broad evaluation of an environment's <strong>posture</strong> — interviews, document review, scans. Identifies weaknesses without necessarily exploiting them.</p>` },
'security-audit': { title:'Security Audit', cat:'Testing Types', html:`
  <p>Formal review of <strong>compliance against a standard or policy</strong> (ISO, PCI, HIPAA). Produces pass/fail findings against specific control objectives.</p>
  <div class="exam-tip">Assessment finds weaknesses; audit measures against a standard.</div>` },
'bug-bounty': { title:'Bug Bounty Program', cat:'Testing Types', html:`
  <p><strong>Crowd-sourced</strong> security testing — outside researchers find and report flaws under defined rules, in exchange for cash rewards.</p>` },

'iso-27001': { title:'ISO/IEC 27001', cat:'Frameworks', html:`
  <p>Standard for an <strong>Information Security Management System (ISMS)</strong>. The <strong>only certifiable</strong> standard in this group.</p>
  <div class="exam-tip">ISO 27001 = the certifiable ISMS framework.</div>` },
'iso-27002': { title:'ISO/IEC 27002', cat:'Frameworks', html:`
  <p>The <strong>catalog of controls</strong> that supports ISO 27001 — implementation guidance for each control area.</p>` },
'iso-27701': { title:'ISO/IEC 27701', cat:'Frameworks', html:`
  <p>Extension of 27001 for <strong>privacy</strong> — a Privacy Information Management System (PIMS) aligned with GDPR and similar laws.</p>` },
'iso-31000': { title:'ISO 31000', cat:'Frameworks', html:`
  <p>General-purpose <strong>risk management</strong> framework — principles, framework, and process. Not security-specific.</p>` },
'nist-csf': { title:'NIST Cybersecurity Framework (CSF)', cat:'Frameworks', html:`
  <p>Five functions: <strong>Identify · Protect · Detect · Respond · Recover</strong> (CSF 2.0 adds <strong>Govern</strong>). Voluntary; widely adopted in U.S. industry.</p>` },
'nist-rmf': { title:'NIST Risk Management Framework (RMF)', cat:'Frameworks', html:`
  <p>Seven steps: <strong>Prepare · Categorize · Select · Implement · Assess · Authorize · Monitor</strong>. Mandatory for U.S. federal systems (SP 800-37).</p>` },

};

const CATEGORIES = [
  { id:'fundamentals', label:'Risk Fundamentals',  color:'#e67e22',
    nodes:['risk','impact','malicious-human','accidental-human','environmental','threat-assessment','risk-identification'] },
  { id:'risk-types',   label:'Risk Types',         color:'#e74c3c',
    nodes:['internal-risk','external-risk','ip-theft','software-compliance','legacy-systems'] },
  { id:'vuln-types',   label:'Vulnerability Types',color:'#e74c3c',
    nodes:['lack-hardening','lack-policies','weak-practices','lack-firewall','lack-antimalware'] },
  { id:'mgmt',         label:'Risk Management',    color:'#3498db',
    nodes:['risk-management','risk-assessment','continuous-assessment','inherent-risk','residual-risk','control-risk','risk-appetite','expansionary','conservative','neutral','risk-tolerance','asset','asset-value','rca','rcsa'] },
  { id:'quant',        label:'Quantitative',       color:'#2ecc71',
    nodes:['quantitative','ef','sle','aro','ale'] },
  { id:'treatment',    label:'Reporting & Treatment',color:'#1abc9c',
    nodes:['qualitative','risk-reporting','risk-register','risk-matrix','risk-accept','risk-avoid','risk-mitigate','risk-transfer'] },
  { id:'supply',       label:'Supply Chain',       color:'#e67e22',
    nodes:['supply-chain','vendor-risk','vendor-assessment'] },
  { id:'standards',    label:'Vuln Standards',     color:'#1abc9c',
    nodes:['cve','cvss','scap','vuln-sources'] },
  { id:'assess',       label:'Vuln Assessment',    color:'#3498db',
    nodes:['vuln-assessment','network-scanner','arp-ping','syn-stealth','port-scan','service-scan','os-detection','vuln-scanner','config-compliance'] },
  { id:'cred',         label:'Credentialed Scans', color:'#2ecc71',
    nodes:['credentialed','noncredentialed'] },
  { id:'pentest',      label:'Penetration Testing',color:'#e74c3c',
    nodes:['pentest','physical-pentest','red-team','blue-team','purple-team','roe'] },
  { id:'knowledge',    label:'Tester Knowledge',   color:'#f1c40f',
    nodes:['black-box','white-box','gray-box'] },
  { id:'recon',        label:'Recon & Footprint',  color:'#3498db',
    nodes:['recon','passive-recon','network-recon','footprinting','fingerprinting','os-fingerprinting'] },
  { id:'tools',        label:'Scanning Tools',     color:'#1abc9c',
    nodes:['ip-scanner','nmap','netcat','scanless','dnsenum','nessus','hping','sn1per','curl'] },
  { id:'postexp',      label:'Post-Exploitation',  color:'#e74c3c',
    nodes:['persistence','vertical-movement','lateral-movement','priv-esc','pivoting'] },
  { id:'testing',      label:'Testing Types',      color:'#9b59b6',
    nodes:['security-assessment','security-audit','bug-bounty'] },
  { id:'frameworks',   label:'Frameworks',         color:'#9b59b6',
    nodes:['iso-27001','iso-27002','iso-27701','iso-31000','nist-csf','nist-rmf'] },
];

const NODE_CAT_MAP = {};
CATEGORIES.forEach(c => c.nodes.forEach(n => {
  if (!NODE_CAT_MAP[n]) NODE_CAT_MAP[n] = [];
  NODE_CAT_MAP[n].push(c.id);
}));

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

function gn(id,label,color,nodeId,x,y){return{id,label,color,nodeId:nodeId||null,x,y,vx:0,vy:0,r:20,pinned:false}}
function ge(s,t,type,label){return{s,t,type:type||'relates',label:label||null}}

const GNODES = [
  gn('cat-fundamentals','Risk\nFundamentals','#e67e22',null,-720,-460),
  gn('cat-risk-types',  'Risk\nTypes',       '#e74c3c',null,-200,-540),
  gn('cat-vuln-types',  'Vuln\nTypes',       '#e74c3c',null, 320,-540),
  gn('cat-mgmt',        'Risk\nMgmt',        '#3498db',null,-720, -80),
  gn('cat-quant',       'Quant.',            '#2ecc71',null, -80, -80),
  gn('cat-treatment',   'Treatment',         '#1abc9c',null, 460, -80),
  gn('cat-supply',      'Supply\nChain',     '#e67e22',null, 820,-360),
  gn('cat-standards',   'CVE/CVSS\nSCAP',    '#1abc9c',null, 820,  80),
  gn('cat-assess',      'Vuln\nAssess',      '#3498db',null,-820, 380),
  gn('cat-cred',        'Cred\nScans',       '#2ecc71',null,-320, 480),
  gn('cat-pentest',     'Pentest',           '#e74c3c',null,  200, 480),
  gn('cat-knowledge',   'Tester\nKnowledge', '#f1c40f',null,  680, 380),
  gn('cat-recon',       'Recon /\nFootprint','#3498db',null,-720, 700),
  gn('cat-tools',       'Scanning\nTools',   '#1abc9c',null, -100, 740),
  gn('cat-postexp',     'Post-Exp',          '#e74c3c',null,  560, 740),
  gn('cat-testing',     'Testing\nTypes',    '#9b59b6',null, -880, -380),
  gn('cat-frameworks',  'Frameworks',        '#9b59b6',null,  900, 580),

  gn('risk','Risk','#e67e22','risk',-740,-500),
  gn('impact','Impact','#e74c3c','impact',-680,-540),
  gn('malicious-human','Malic.\nHuman','#e74c3c','malicious-human',-820,-480),
  gn('accidental-human','Accident.','#e67e22','accidental-human',-820,-420),
  gn('environmental','Environ.','#f1c40f','environmental',-620,-460),
  gn('threat-assessment','Threat\nAssess','#3498db','threat-assessment',-660,-400),
  gn('risk-identification','Risk ID','#3498db','risk-identification',-740,-400),

  gn('internal-risk','Internal','#e67e22','internal-risk',-260,-540),
  gn('external-risk','External','#e67e22','external-risk',-180,-580),
  gn('ip-theft','IP Theft','#e74c3c','ip-theft',-140,-520),
  gn('software-compliance','SW Lic.','#9b59b6','software-compliance',-220,-480),
  gn('legacy-systems','Legacy','#e74c3c','legacy-systems',-300,-500),

  gn('lack-hardening','No Hard.','#e74c3c','lack-hardening',300,-580),
  gn('lack-policies','No Pol.','#e74c3c','lack-policies',360,-540),
  gn('weak-practices','Weak Pr.','#e74c3c','weak-practices',280,-520),
  gn('lack-firewall','No FW','#e74c3c','lack-firewall',420,-560),
  gn('lack-antimalware','No AM','#e74c3c','lack-antimalware',420,-500),

  gn('risk-management','Risk\nMgmt','#3498db','risk-management',-760,-120),
  gn('risk-assessment','Risk\nAssess','#3498db','risk-assessment',-680,-120),
  gn('continuous-assessment','Cont.','#1abc9c','continuous-assessment',-620,-80),
  gn('inherent-risk','Inherent','#e67e22','inherent-risk',-820,-80),
  gn('residual-risk','Residual','#f1c40f','residual-risk',-780,-40),
  gn('control-risk','Control','#e67e22','control-risk',-700,-40),
  gn('risk-appetite','Appetite','#9b59b6','risk-appetite',-620,-40),
  gn('expansionary','Expan.','#9b59b6','expansionary',-560,-20),
  gn('conservative','Conserv.','#9b59b6','conservative',-600,20),
  gn('neutral','Neutral','#9b59b6','neutral',-660,20),
  gn('risk-tolerance','Tolerance','#f1c40f','risk-tolerance',-720,40),
  gn('asset','Asset','#95a5a6','asset',-820,-20),
  gn('asset-value','AV','#95a5a6','asset-value',-880,-60),
  gn('rca','RCA','#3498db','rca',-880,20),
  gn('rcsa','RCSA','#3498db','rcsa',-820,60),

  gn('quantitative','Quant.','#1abc9c','quantitative',-80,-120),
  gn('ef','EF','#2ecc71','ef',-140,-80),
  gn('sle','SLE','#2ecc71','sle',-60,-60),
  gn('aro','ARO','#2ecc71','aro',-20,-100),
  gn('ale','ALE','#2ecc71','ale',-100,-40),

  gn('qualitative','Qual.','#1abc9c','qualitative',420,-120),
  gn('risk-reporting','Report','#3498db','risk-reporting',480,-120),
  gn('risk-register','Register','#3498db','risk-register',500,-60),
  gn('risk-matrix','Matrix','#3498db','risk-matrix',440,-60),
  gn('risk-accept','Accept','#2ecc71','risk-accept',380,-40),
  gn('risk-avoid','Avoid','#2ecc71','risk-avoid',420,0),
  gn('risk-mitigate','Mitig.','#2ecc71','risk-mitigate',480,20),
  gn('risk-transfer','Transfer','#2ecc71','risk-transfer',540,-20),

  gn('supply-chain','Supply\nChain','#e67e22','supply-chain',820,-400),
  gn('vendor-risk','Vendor\nRisk','#e74c3c','vendor-risk',880,-340),
  gn('vendor-assessment','Vendor\nAssess','#3498db','vendor-assessment',760,-320),

  gn('cve','CVE','#1abc9c','cve',820,40),
  gn('cvss','CVSS','#1abc9c','cvss',880,80),
  gn('scap','SCAP','#1abc9c','scap',780,100),
  gn('vuln-sources','Sources','#3498db','vuln-sources',860,140),

  gn('vuln-assessment','Vuln\nAssess','#3498db','vuln-assessment',-840,340),
  gn('network-scanner','Net\nScan','#3498db','network-scanner',-780,360),
  gn('arp-ping','ARP\nPing','#3498db','arp-ping',-900,380),
  gn('syn-stealth','SYN','#3498db','syn-stealth',-840,400),
  gn('port-scan','Port','#3498db','port-scan',-780,420),
  gn('service-scan','Service','#3498db','service-scan',-720,400),
  gn('os-detection','OS Det.','#3498db','os-detection',-720,360),
  gn('vuln-scanner','Vuln Sc.','#9b59b6','vuln-scanner',-880,440),
  gn('config-compliance','Config\nCompl.','#9b59b6','config-compliance',-800,460),

  gn('credentialed','Cred.','#2ecc71','credentialed',-340,460),
  gn('noncredentialed','Non-Cred.','#e67e22','noncredentialed',-260,500),

  gn('pentest','Pentest','#e74c3c','pentest',180,440),
  gn('physical-pentest','Physical','#e67e22','physical-pentest',120,480),
  gn('red-team','Red','#e74c3c','red-team',200,500),
  gn('blue-team','Blue','#3498db','blue-team',260,460),
  gn('purple-team','Purple','#9b59b6','purple-team',240,520),
  gn('roe','RoE','#3498db','roe',160,520),

  gn('black-box','Black','#e74c3c','black-box',640,360),
  gn('white-box','White','#2ecc71','white-box',720,360),
  gn('gray-box','Gray','#e67e22','gray-box',680,400),

  gn('recon','Recon','#3498db','recon',-720,680),
  gn('passive-recon','Passive','#2ecc71','passive-recon',-780,720),
  gn('network-recon','Net\nRecon','#e67e22','network-recon',-660,720),
  gn('footprinting','Footprint','#3498db','footprinting',-720,760),
  gn('fingerprinting','Finger.','#3498db','fingerprinting',-660,760),
  gn('os-fingerprinting','OS Fp.','#3498db','os-fingerprinting',-780,760),

  gn('ip-scanner','IP Scan','#1abc9c','ip-scanner',-180,720),
  gn('nmap','nmap','#1abc9c','nmap',-100,700),
  gn('netcat','netcat','#1abc9c','netcat',-20,720),
  gn('scanless','scanless','#1abc9c','scanless',-180,780),
  gn('dnsenum','dnsenum','#1abc9c','dnsenum',-100,780),
  gn('nessus','Nessus','#9b59b6','nessus',-20,780),
  gn('hping','hping','#1abc9c','hping',60,700),
  gn('sn1per','sn1per','#1abc9c','sn1per',60,760),
  gn('curl','cURL','#1abc9c','curl',120,720),

  gn('persistence','Persist.','#e74c3c','persistence',540,720),
  gn('vertical-movement','Vert.','#e74c3c','vertical-movement',600,700),
  gn('lateral-movement','Lateral','#e74c3c','lateral-movement',660,720),
  gn('priv-esc','PrivEsc','#e74c3c','priv-esc',540,780),
  gn('pivoting','Pivot','#e74c3c','pivoting',640,780),

  gn('security-assessment','Sec\nAssess','#9b59b6','security-assessment',-880,-400),
  gn('security-audit','Sec\nAudit','#9b59b6','security-audit',-820,-360),
  gn('bug-bounty','Bug\nBounty','#9b59b6','bug-bounty',-940,-360),

  gn('iso-27001','27001','#9b59b6','iso-27001',880,540),
  gn('iso-27002','27002','#9b59b6','iso-27002',940,580),
  gn('iso-27701','27701','#9b59b6','iso-27701',820,580),
  gn('iso-31000','31000','#9b59b6','iso-31000',880,620),
  gn('nist-csf','NIST\nCSF','#1abc9c','nist-csf',940,640),
  gn('nist-rmf','NIST\nRMF','#1abc9c','nist-rmf',820,640),
];

const GEDGES = [
  ge('cat-fundamentals','risk','member'), ge('cat-fundamentals','impact','member'),
  ge('cat-fundamentals','malicious-human','member'), ge('cat-fundamentals','accidental-human','member'),
  ge('cat-fundamentals','environmental','member'), ge('cat-fundamentals','threat-assessment','member'),
  ge('cat-fundamentals','risk-identification','member'),

  ge('cat-risk-types','internal-risk','member'), ge('cat-risk-types','external-risk','member'),
  ge('cat-risk-types','ip-theft','member'), ge('cat-risk-types','software-compliance','member'),
  ge('cat-risk-types','legacy-systems','member'),

  ge('cat-vuln-types','lack-hardening','member'), ge('cat-vuln-types','lack-policies','member'),
  ge('cat-vuln-types','weak-practices','member'), ge('cat-vuln-types','lack-firewall','member'),
  ge('cat-vuln-types','lack-antimalware','member'),

  ge('cat-mgmt','risk-management','member'), ge('cat-mgmt','risk-assessment','member'),
  ge('cat-mgmt','continuous-assessment','member'), ge('cat-mgmt','inherent-risk','member'),
  ge('cat-mgmt','residual-risk','member'), ge('cat-mgmt','control-risk','member'),
  ge('cat-mgmt','risk-appetite','member'), ge('cat-mgmt','expansionary','member'),
  ge('cat-mgmt','conservative','member'), ge('cat-mgmt','neutral','member'),
  ge('cat-mgmt','risk-tolerance','member'), ge('cat-mgmt','asset','member'),
  ge('cat-mgmt','asset-value','member'), ge('cat-mgmt','rca','member'), ge('cat-mgmt','rcsa','member'),

  ge('cat-quant','quantitative','member'), ge('cat-quant','ef','member'),
  ge('cat-quant','sle','member'), ge('cat-quant','aro','member'), ge('cat-quant','ale','member'),

  ge('cat-treatment','qualitative','member'), ge('cat-treatment','risk-reporting','member'),
  ge('cat-treatment','risk-register','member'), ge('cat-treatment','risk-matrix','member'),
  ge('cat-treatment','risk-accept','member'), ge('cat-treatment','risk-avoid','member'),
  ge('cat-treatment','risk-mitigate','member'), ge('cat-treatment','risk-transfer','member'),

  ge('cat-supply','supply-chain','member'), ge('cat-supply','vendor-risk','member'),
  ge('cat-supply','vendor-assessment','member'),

  ge('cat-standards','cve','member'), ge('cat-standards','cvss','member'),
  ge('cat-standards','scap','member'), ge('cat-standards','vuln-sources','member'),

  ge('cat-assess','vuln-assessment','member'), ge('cat-assess','network-scanner','member'),
  ge('cat-assess','arp-ping','member'), ge('cat-assess','syn-stealth','member'),
  ge('cat-assess','port-scan','member'), ge('cat-assess','service-scan','member'),
  ge('cat-assess','os-detection','member'), ge('cat-assess','vuln-scanner','member'),
  ge('cat-assess','config-compliance','member'),

  ge('cat-cred','credentialed','member'), ge('cat-cred','noncredentialed','member'),

  ge('cat-pentest','pentest','member'), ge('cat-pentest','physical-pentest','member'),
  ge('cat-pentest','red-team','member'), ge('cat-pentest','blue-team','member'),
  ge('cat-pentest','purple-team','member'), ge('cat-pentest','roe','member'),

  ge('cat-knowledge','black-box','member'), ge('cat-knowledge','white-box','member'),
  ge('cat-knowledge','gray-box','member'),

  ge('cat-recon','recon','member'), ge('cat-recon','passive-recon','member'),
  ge('cat-recon','network-recon','member'), ge('cat-recon','footprinting','member'),
  ge('cat-recon','fingerprinting','member'), ge('cat-recon','os-fingerprinting','member'),

  ge('cat-tools','ip-scanner','member'), ge('cat-tools','nmap','member'),
  ge('cat-tools','netcat','member'), ge('cat-tools','scanless','member'),
  ge('cat-tools','dnsenum','member'), ge('cat-tools','nessus','member'),
  ge('cat-tools','hping','member'), ge('cat-tools','sn1per','member'),
  ge('cat-tools','curl','member'),

  ge('cat-postexp','persistence','member'), ge('cat-postexp','vertical-movement','member'),
  ge('cat-postexp','lateral-movement','member'), ge('cat-postexp','priv-esc','member'),
  ge('cat-postexp','pivoting','member'),

  ge('cat-testing','security-assessment','member'), ge('cat-testing','security-audit','member'),
  ge('cat-testing','bug-bounty','member'),

  ge('cat-frameworks','iso-27001','member'), ge('cat-frameworks','iso-27002','member'),
  ge('cat-frameworks','iso-27701','member'), ge('cat-frameworks','iso-31000','member'),
  ge('cat-frameworks','nist-csf','member'), ge('cat-frameworks','nist-rmf','member'),

  ge('asset-value','sle','feeds'),
  ge('ef','sle','feeds'),
  ge('sle','ale','feeds'),
  ge('aro','ale','feeds'),
  ge('inherent-risk','residual-risk','reduces-to'),
  ge('risk-mitigate','residual-risk','produces'),
  ge('risk-appetite','risk-tolerance','sets'),
  ge('expansionary','risk-appetite','type-of'),
  ge('conservative','risk-appetite','type-of'),
  ge('neutral','risk-appetite','type-of'),
  ge('risk-assessment','risk-register','feeds'),
  ge('risk-register','risk-matrix','feeds'),
  ge('risk-matrix','risk-reporting','feeds'),
  ge('vuln-scanner','cve','uses'),
  ge('cvss','cve','scores'),
  ge('scap','vuln-scanner','automates'),
  ge('credentialed','vuln-scanner','enhances'),
  ge('nmap','port-scan','performs'),
  ge('nmap','service-scan','performs'),
  ge('nmap','os-detection','performs'),
  ge('nessus','vuln-scanner','is-a'),
  ge('dnsenum','footprinting','supports'),
  ge('hping','network-scanner','related'),
  ge('curl','recon','supports'),
  ge('sn1per','recon','automates'),
  ge('netcat','recon','supports'),
  ge('scanless','port-scan','performs'),
  ge('recon','passive-recon','includes'),
  ge('recon','network-recon','includes'),
  ge('footprinting','fingerprinting','leads-to'),
  ge('fingerprinting','os-fingerprinting','includes'),
  ge('red-team','blue-team','attacks'),
  ge('blue-team','red-team','defends'),
  ge('purple-team','red-team','integrates'),
  ge('purple-team','blue-team','integrates'),
  ge('pentest','roe','requires'),
  ge('pentest','black-box','uses'),
  ge('pentest','white-box','uses'),
  ge('pentest','gray-box','uses'),
  ge('pentest','persistence','tests'),
  ge('priv-esc','vertical-movement','equals'),
  ge('lateral-movement','pivoting','enables'),
  ge('supply-chain','vendor-risk','contains'),
  ge('vendor-assessment','vendor-risk','reduces'),
  ge('iso-27002','iso-27001','supports'),
  ge('iso-27701','iso-27001','extends'),
  ge('legacy-systems','lack-hardening','related'),
  ge('security-audit','iso-27001','measures-against'),
  ge('security-assessment','vuln-assessment','related'),
];

const G_REPEL=18000, G_SPRING=0.03, G_IDEAL=120, G_GRAVITY=0.003, G_DAMPING=0.80;
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
  member:        {color:'#1e3a5f',w:1,  dash:'3,7', mk:null},
  'type-of':     {color:'#222c44',w:1,  dash:'',   mk:'ga-gray'},
  'uses':        {color:'#222c44',w:1.5,dash:'',   mk:'ga-gray'},
  'feeds':       {color:'#2ecc71',w:1.5,dash:'',   mk:'ga-green'},
  'produces':    {color:'#2ecc71',w:1.5,dash:'',   mk:'ga-green'},
  'reduces':     {color:'#2ecc71',w:1.5,dash:'',   mk:'ga-green'},
  'reduces-to':  {color:'#1abc9c',w:1.5,dash:'4,4',mk:'ga-teal'},
  'sets':        {color:'#3498db',w:1.5,dash:'',   mk:'ga-blue'},
  'scores':      {color:'#1abc9c',w:1.5,dash:'',   mk:'ga-teal'},
  'automates':   {color:'#1abc9c',w:1.5,dash:'',   mk:'ga-teal'},
  'enhances':    {color:'#2ecc71',w:1.5,dash:'',   mk:'ga-green'},
  'performs':    {color:'#3498db',w:1.5,dash:'',   mk:'ga-blue'},
  'is-a':        {color:'#222c44',w:1,  dash:'',   mk:'ga-gray'},
  'supports':    {color:'#1abc9c',w:1.5,dash:'',   mk:'ga-teal'},
  'leads-to':    {color:'#3498db',w:1.5,dash:'4,4',mk:'ga-blue'},
  'includes':    {color:'#1e3a5f',w:1,  dash:'3,7',mk:null},
  'attacks':     {color:'#e74c3c',w:1.5,dash:'',   mk:'ga-red'},
  'defends':     {color:'#3498db',w:1.5,dash:'',   mk:'ga-blue'},
  'integrates':  {color:'#9b59b6',w:1.5,dash:'',   mk:null},
  'requires':    {color:'#e67e22',w:1.5,dash:'',   mk:null},
  'tests':       {color:'#e74c3c',w:1.5,dash:'',   mk:'ga-red'},
  'equals':      {color:'#475569',w:1,  dash:'4,4',mk:null},
  'enables':     {color:'#e67e22',w:1.5,dash:'',   mk:null},
  'contains':    {color:'#475569',w:1,  dash:'4,4',mk:null},
  'extends':     {color:'#9b59b6',w:1.5,dash:'4,4',mk:null},
  'measures-against':{color:'#9b59b6',w:1.5,dash:'4,4',mk:null},
  'related':     {color:'#475569',w:1,  dash:'4,4',mk:null},
};

function gRender(){
  if(illustratedMode){ gRenderIllustrated(); return; }
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

let illustratedMode = false;
const GICONS = {};

function gRenderIllustrated(){
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
}

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
