/* ════════════════════════════════════════════════════════════
   pbq.js · Performance-Based Questions for Security+ SY0-701
   Interactive, hands-on style tasks (matching, categorizing,
   ordering, sorting). Graded per row. The quiz engine shuffles
   row order, option order, and which PBQs appear each attempt.

   Schema: { id, d (domain), sub (style), q (instructions),
             rows:[[label, correctAnswer], ...],
             options:[ ...shared dropdown values... ], e (explanation) }
════════════════════════════════════════════════════════════ */
window.PBQ_BANK = [
  {
    id: 'pbq1', d: 3, sub: 'Port matching',
    q: 'A junior admin is documenting the firewall. Assign the correct port number to each protocol.',
    rows: [['SSH / SFTP', '22'], ['HTTPS', '443'], ['RDP', '3389'], ['DNS', '53'], ['LDAPS', '636'], ['SMTP', '25']],
    options: ['22', '25', '53', '389', '443', '636', '3389', '23'],
    e: 'SSH/SFTP 22 · HTTPS 443 · RDP 3389 · DNS 53 · LDAPS 636 · SMTP 25.'
  },
  {
    id: 'pbq2', d: 3, sub: 'Secure replacement',
    q: 'Security policy bans cleartext protocols. For each insecure protocol, select the recommended secure replacement.',
    rows: [['Telnet', 'SSH'], ['FTP', 'SFTP'], ['HTTP', 'HTTPS'], ['LDAP', 'LDAPS'], ['SNMP v1/v2', 'SNMPv3'], ['POP3', 'POP3S']],
    options: ['SSH', 'SFTP', 'HTTPS', 'LDAPS', 'SNMPv3', 'POP3S'],
    e: 'Telnet→SSH · FTP→SFTP · HTTP→HTTPS · LDAP→LDAPS · SNMPv1/2→SNMPv3 · POP3→POP3S.'
  },
  {
    id: 'pbq3', d: 1, sub: 'Control function',
    q: 'Classify each security control by its FUNCTION.',
    rows: [['Door lock', 'Preventive'], ['CCTV camera', 'Detective'], ['Data backup restore', 'Corrective'], ['"Beware of dog" sign', 'Deterrent'], ['Intrusion Detection System', 'Detective'], ['Firewall rule', 'Preventive']],
    options: ['Preventive', 'Detective', 'Corrective', 'Deterrent'],
    e: 'Preventive stops it (lock, firewall) · Detective finds it (CCTV, IDS) · Corrective fixes it (restore) · Deterrent discourages it (sign).'
  },
  {
    id: 'pbq4', d: 1, sub: 'Control category',
    q: 'Classify each control by CATEGORY (the type of control).',
    rows: [['Antivirus software', 'Technical'], ['Risk assessment policy', 'Managerial'], ['Bollards / fences', 'Physical'], ['Security awareness training', 'Operational'], ['Encryption', 'Technical'], ['Incident response procedure', 'Operational']],
    options: ['Technical', 'Managerial', 'Operational', 'Physical'],
    e: 'Technical = tech-enforced (AV, encryption) · Managerial = policy/risk · Operational = people-run processes (training, IR) · Physical = tangible (fences).'
  },
  {
    id: 'pbq5', d: 4, sub: 'Sequencing',
    q: 'Place the incident response phases in the correct order. Assign a position (1–6) to each phase.',
    rows: [['Preparation', '1'], ['Identification / Detection', '2'], ['Containment', '3'], ['Eradication', '4'], ['Recovery', '5'], ['Lessons Learned', '6']],
    options: ['1', '2', '3', '4', '5', '6'],
    e: 'Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned.'
  },
  {
    id: 'pbq6', d: 2, sub: 'Sequencing',
    q: 'Order the stages of the Cyber Kill Chain. Assign a position (1–7) to each stage.',
    rows: [['Reconnaissance', '1'], ['Weaponization', '2'], ['Delivery', '3'], ['Exploitation', '4'], ['Installation', '5'], ['Command & Control', '6'], ['Actions on Objectives', '7']],
    options: ['1', '2', '3', '4', '5', '6', '7'],
    e: 'Recon → Weaponization → Delivery → Exploitation → Installation → C2 → Actions on Objectives.'
  },
  {
    id: 'pbq7', d: 2, sub: 'Attack matching',
    q: 'A SOC analyst is triaging alerts. Match each attack to its description.',
    rows: [['Phishing', 'Fraudulent email to steal credentials'], ['SQL injection', 'Malicious SQL sent through input fields'], ['Cross-site scripting', 'Malicious script runs in a victim browser'], ['DDoS', 'Flood a service with traffic to exhaust it'], ['On-path (MITM)', 'Secretly intercept traffic between two parties']],
    options: ['Fraudulent email to steal credentials', 'Malicious SQL sent through input fields', 'Malicious script runs in a victim browser', 'Flood a service with traffic to exhaust it', 'Secretly intercept traffic between two parties'],
    e: 'Phishing = email lure · SQLi = database injection · XSS = script in browser · DDoS = traffic flood · On-path = traffic interception.'
  },
  {
    id: 'pbq8', d: 2, sub: 'Malware matching',
    q: 'Match each malware type to its defining behavior.',
    rows: [['Worm', 'Self-replicates across networks with no user action'], ['Trojan', 'Disguised as legitimate software'], ['Ransomware', 'Encrypts files and demands payment'], ['Rootkit', 'Hides itself with kernel-level privileges'], ['Keylogger', 'Records the user keystrokes']],
    options: ['Self-replicates across networks with no user action', 'Disguised as legitimate software', 'Encrypts files and demands payment', 'Hides itself with kernel-level privileges', 'Records the user keystrokes'],
    e: 'Worm self-spreads · Trojan masquerades · Ransomware encrypts for payment · Rootkit hides at kernel · Keylogger captures keystrokes.'
  },
  {
    id: 'pbq9', d: 4, sub: 'Auth factors',
    q: 'Classify each authentication example by its factor type.',
    rows: [['Password', 'Something you know'], ['Smart card', 'Something you have'], ['Fingerprint', 'Something you are'], ['GPS geolocation', 'Somewhere you are'], ['PIN', 'Something you know'], ['Hardware token', 'Something you have']],
    options: ['Something you know', 'Something you have', 'Something you are', 'Somewhere you are'],
    e: 'Know = password/PIN · Have = smart card/token · Are = biometrics · Somewhere = location.'
  },
  {
    id: 'pbq10', d: 4, sub: 'Access models',
    q: 'Match each access control model to its defining characteristic.',
    rows: [['MAC', 'Access decided by labels and clearances'], ['DAC', 'The data owner sets permissions'], ['RBAC', 'Access based on job role'], ['ABAC', 'Access based on attributes and policy'], ['Rule-BAC', 'Access based on ACL rules (e.g., firewall)']],
    options: ['Access decided by labels and clearances', 'The data owner sets permissions', 'Access based on job role', 'Access based on attributes and policy', 'Access based on ACL rules (e.g., firewall)'],
    e: 'MAC = labels/clearance · DAC = owner-set · RBAC = role · ABAC = attributes · Rule-BAC = rules/ACLs.'
  },
  {
    id: 'pbq11', d: 3, sub: 'Secure sorting',
    q: 'Sort each protocol as Secure (encrypted) or Insecure (cleartext).',
    rows: [['Telnet', 'Insecure'], ['SSH', 'Secure'], ['HTTP', 'Insecure'], ['HTTPS', 'Secure'], ['FTP', 'Insecure'], ['SFTP', 'Secure'], ['SNMPv3', 'Secure'], ['SNMP v2', 'Insecure']],
    options: ['Secure', 'Insecure'],
    e: 'Encrypted: SSH, HTTPS, SFTP, SNMPv3. Cleartext: Telnet, HTTP, FTP, SNMPv1/2.'
  },
  {
    id: 'pbq12', d: 1, sub: 'Cryptography',
    q: 'Match each algorithm/primitive to the cryptographic concept it represents.',
    rows: [['AES', 'Symmetric encryption'], ['RSA', 'Asymmetric encryption'], ['SHA-256', 'Hashing'], ['Diffie-Hellman', 'Key exchange'], ['HMAC', 'Message authentication']],
    options: ['Symmetric encryption', 'Asymmetric encryption', 'Hashing', 'Key exchange', 'Message authentication'],
    e: 'AES = symmetric · RSA = asymmetric · SHA-256 = hashing · Diffie-Hellman = key exchange · HMAC = message authentication.'
  },
  {
    id: 'pbq13', d: 3, sub: 'Wireless',
    q: 'Match each wireless option to its security property.',
    rows: [['WEP', 'Deprecated — weak RC4, easily cracked'], ['WPA2', 'AES-CCMP encryption'], ['WPA3', 'SAE (dragonfly) handshake'], ['Open network', 'No encryption at all']],
    options: ['Deprecated — weak RC4, easily cracked', 'AES-CCMP encryption', 'SAE (dragonfly) handshake', 'No encryption at all'],
    e: 'WEP is broken (RC4) · WPA2 uses AES-CCMP · WPA3 adds SAE · Open = no encryption.'
  },
  {
    id: 'pbq14', d: 3, sub: 'Email ports',
    q: 'Configure the mail client. Assign the correct port to each email protocol.',
    rows: [['SMTP (relay)', '25'], ['SMTPS (implicit TLS)', '465'], ['IMAP', '143'], ['IMAPS', '993'], ['POP3', '110'], ['POP3S', '995']],
    options: ['25', '110', '143', '465', '587', '993', '995'],
    e: 'SMTP 25 · SMTPS 465 (submission/STARTTLS 587) · IMAP 143 · IMAPS 993 · POP3 110 · POP3S 995.'
  },
  {
    id: 'pbq15', d: 5, sub: 'Risk strategy',
    q: 'Match each business action to the risk-handling strategy it represents.',
    rows: [['Purchase cyber insurance', 'Transfer'], ['Discontinue a risky product feature', 'Avoid'], ['Deploy a WAF and patch the app', 'Mitigate'], ['Document a low risk and take no action', 'Accept']],
    options: ['Accept', 'Avoid', 'Transfer', 'Mitigate'],
    e: 'Insurance = transfer · stop the activity = avoid · add controls = mitigate · knowingly do nothing = accept.'
  },
  {
    id: 'pbq16', d: 2, sub: 'Social engineering',
    q: 'Classify each scenario by the social-engineering technique used.',
    rows: [['Deceptive email with a malicious link', 'Phishing'], ['Scam phone call', 'Vishing'], ['Malicious SMS text message', 'Smishing'], ['Following staff through a secure door', 'Tailgating'], ['Spear phishing aimed at the CEO', 'Whaling']],
    options: ['Phishing', 'Vishing', 'Smishing', 'Tailgating', 'Whaling'],
    e: 'Email = phishing · voice = vishing · SMS = smishing · physical follow = tailgating · executive target = whaling.'
  },
  {
    id: 'pbq17', d: 3, sub: 'OSI model',
    q: 'Order the OSI model from Layer 1 to Layer 7. Assign each layer its number (1–7).',
    rows: [['Physical', '1'], ['Data Link', '2'], ['Network', '3'], ['Transport', '4'], ['Session', '5'], ['Presentation', '6'], ['Application', '7']],
    options: ['1', '2', '3', '4', '5', '6', '7'],
    e: 'Physical → Data Link → Network → Transport → Session → Presentation → Application ("Please Do Not Throw Sausage Pizza Away").'
  },
  {
    id: 'pbq18', d: 1, sub: 'PKI enrollment',
    q: 'Order the certificate enrollment steps. Assign a position (1–5) to each step.',
    rows: [['Generate a public/private key pair', '1'], ['Create a Certificate Signing Request (CSR)', '2'], ['CA verifies the requester identity', '3'], ['CA issues the signed certificate', '4'], ['Install the certificate on the server', '5']],
    options: ['1', '2', '3', '4', '5'],
    e: 'Key pair → CSR → CA validates → CA issues cert → install. The private key never leaves the requester.'
  },
  {
    id: 'pbq19', d: 3, sub: 'Cloud models',
    q: 'Match each example to its cloud service model.',
    rows: [['Rent VMs and manage the OS yourself', 'IaaS'], ['Deploy code to a managed runtime', 'PaaS'], ['Use webmail entirely in the browser', 'SaaS'], ['Consume a fully managed database service', 'PaaS']],
    options: ['IaaS', 'PaaS', 'SaaS'],
    e: 'IaaS = you manage OS up · PaaS = provider manages runtime/DB · SaaS = provider manages everything, you just use the app.'
  },
  {
    id: 'pbq20', d: 4, sub: 'Monitoring tools',
    q: 'Match each monitoring/operations tool to what it provides.',
    rows: [['SIEM', 'Aggregates and correlates events, generates alerts'], ['Syslog', 'Centralized collection of log messages'], ['NetFlow', 'Traffic metadata — who talked to whom'], ['Full packet capture', 'Complete payload/content of traffic'], ['SOAR', 'Automates response playbooks']],
    options: ['Aggregates and correlates events, generates alerts', 'Centralized collection of log messages', 'Traffic metadata — who talked to whom', 'Complete payload/content of traffic', 'Automates response playbooks'],
    e: 'SIEM correlates & alerts · Syslog centralizes logs · NetFlow = flow metadata · PCAP = full content · SOAR automates response.'
  },
  {
    id: 'pbq21', d: 2, sub: 'Credential attack matching',
    q: 'A SOC analyst reviews the past week\'s authentication alerts. Each entry below comes from SIEM alerts, DC security event logs, or the VPN gateway. Match each observed behavior to the credential attack technique it represents. (One option is a distractor — it matches no observation.)',
    rows: [
      [
        'SIEM: 312 AD accounts each received exactly 2 login attempts over 6 hours using "Summer2024!" and "Welcome1". Zero accounts were locked out.',
        'Password spraying'
      ],
      [
        'DC Log — Event ID 4624 (Logon Type 3 / Network): CORP\\domain.admin authenticated to FILESERVER01 from ws-developer-12 (10.0.4.87). No interactive logon for this account exists on any host this week. The domain admin is on PTO.',
        'Pass-the-hash'
      ],
      [
        'Web portal log: 12,847 failed logins over 3.5 hours from 94 distinct IPs. 341 succeeded. Cross-referencing against HaveIBeenPwned confirms all 341 successful credential pairs appear in a leaked e-commerce breach database.',
        'Credential stuffing'
      ],
      [
        'DC Log — Event ID 4769 (Kerberos TGS Request): 214 service ticket requests for SPN-registered accounts in 9 minutes from ws-finance-03 (user: jsmith). All tickets use encryption type 0x17 (RC4-HMAC). jsmith has no documented need to access any of these services.',
        'Kerberoasting'
      ],
      [
        'VPN gateway log: Session token originally issued at 08:52 AM reused for a successful authentication at 11:47 PM — 15 hours after issuance (policy lifetime: 12 hours). The legitimate user\'s registered device has been offline since 6:00 PM per MDM telemetry.',
        'Replay attack'
      ],
      [
        'IdP alert: svc-backup-prod received 50,000 failed login attempts in 97 minutes from a single source IP. Attempts are sequential, incrementing through the full printable character set. Account is now locked.',
        'Brute force'
      ]
    ],
    options: ['Password spraying', 'Pass-the-hash', 'Credential stuffing', 'Kerberoasting', 'Replay attack', 'Brute force', 'Credential harvesting'],
    e: 'Password spraying: a small set of common passwords tried across many accounts — 2 attempts per account deliberately stays under the typical 3-strike lockout. | Pass-the-hash: successful NTLM network logon (Logon Type 3) from an unexpected workstation with no matching interactive logon — the attacker captured the NTLM hash via Mimikatz and used it directly; plaintext password is never needed. | Credential stuffing: uses exact username+password PAIRS from a prior breach, not a chosen password list — the match to a known breach DB and distributed-IP pattern (botnet) are the giveaways. | Kerberoasting: mass TGS requests (Event 4769) from a low-privilege user for SPN-registered service accounts in seconds, always requesting RC4 (0x17) — offline cracking happens locally, no lockout is triggered. | Replay attack: a valid session token is reused after the session closed and the device is offline — differs from pass-the-hash in that it targets a session/bearer token, not an NTLM hash. | Brute force: single target account, single source IP, sequential character-set exhaustion, no lockout-evasion strategy. | Distractor — Credential harvesting: the act of collecting credentials (e.g., via phishing or keyloggers) — a precursor activity, not the attack technique shown in any alert above.'
  },

  {
    id: 'pbq22', d: 2, sub: 'Web application attack matching',
    q: 'A security engineer is performing post-incident forensics on a breached web application. Each observation below comes from WAF alerts, application server logs, or user reports. Match each observation to the web attack technique it represents. (One option is a distractor.)',
    rows: [
      [
        'WAF alert: GET /download?file=../../../etc/shadow returned HTTP 200 with the contents of /etc/shadow. The file parameter was passed directly to a filesystem read function without canonicalization.',
        'Path traversal'
      ],
      [
        'User report: "I clicked the Confirm Transfer button on my bank\'s payment page and an unexpected transfer to an unknown account processed simultaneously. The page looked completely normal — the button appeared to be in the correct position."',
        'Clickjacking'
      ],
      [
        'WAF alert: POST body contains <!DOCTYPE t [<!ENTITY x SYSTEM "file:///etc/passwd">]><r>&x;</r>. The application\'s XML parser evaluated the entity and the response included the contents of /etc/passwd.',
        'XXE injection'
      ],
      [
        'API log: Authenticated user (account_id: 2847) issued GET /api/v2/invoices/3001, /3002, /3003 in sequence. All returned HTTP 200 with complete invoice data belonging to other customers. The API validates authentication but applies no per-object authorization check.',
        'IDOR'
      ],
      [
        'Outbound request log: Application fetched http://169.254.169.254/latest/meta-data/iam/security-credentials/app-role in response to a user-supplied webhook URL. AWS IAM credentials were returned to the end user in the response body.',
        'SSRF'
      ],
      [
        'Proxy log: A header value contains the URL-encoded sequence %0d%0a (CRLF). The HTTP response contains two complete response blocks — the second one with attacker-controlled headers including a forged Set-Cookie value for an admin session.',
        'HTTP response splitting'
      ]
    ],
    options: ['Path traversal', 'Clickjacking', 'XXE injection', 'IDOR', 'SSRF', 'HTTP response splitting', 'CSRF'],
    e: 'Path traversal: ../  sequences walk the filesystem out of the web root to reach system files (/etc/shadow) — fix: canonicalize paths and validate against an allowlist before any filesystem call. | Clickjacking: an invisible iframe overlays the legitimate button so the victim\'s click hits the attacker\'s hidden element — fix: X-Frame-Options: DENY or Content-Security-Policy frame-ancestors \'none\'. | XXE injection: the XML parser processes a SYSTEM entity directive and embeds a local file\'s contents into the document — fix: disable DTD/external entity processing in the XML library (FEATURE_SECURE_PROCESSING). | IDOR: the API exposes internal object identifiers (invoice IDs) without verifying the authenticated user owns that object — fix: server-side per-object authorization on every resource access. | SSRF: a user-supplied URL causes the SERVER to issue an outbound request to an internal endpoint unreachable from the internet (169.254.169.254 = AWS metadata service) — fix: allowlist outbound destinations; block requests to link-local and RFC 1918 ranges. | HTTP response splitting: CRLF injection into a response header terminates the first response and begins a second attacker-controlled one with forged cookies — fix: strip CRLF from all values before writing to response headers. | Distractor — CSRF: would forge a cross-site request that carries the victim\'s session cookie to a legitimate endpoint; the clickjacking observation involves UI redressing (invisible overlay), not a forged background request. Common confusion: SSRF and XXE both cause the server to access internal resources, but SSRF exploits a URL parameter while XXE exploits the XML parser\'s entity processing.'
  },
  {
    id: 'pbq23', d: 1, sub: 'Control classification (2 dimensions)',
    q: 'A security architect is documenting controls for a corporate office environment. Classify each control by selecting the answer that correctly identifies BOTH its TYPE (Technical / Administrative / Physical) and its primary FUNCTION (Preventive / Detective / Corrective / Deterrent / Compensating).\n\nType: Technical = technology-enforced | Administrative = policy/procedure-based | Physical = tangible, physical barrier\nFunction: Preventive = stops the event | Detective = identifies the event | Corrective = recovers after the event | Deterrent = discourages the event without technically stopping it | Compensating = substitute control when a primary control is not feasible',
    rows: [
      [
        'Acceptable Use Policy (AUP): employees sign annually; documents prohibited behaviors and disciplinary consequences.',
        'Administrative / Deterrent'
      ],
      [
        'Mantrap (double-door vestibule): a badge scan opens the outer door; the inner door will not release until the outer door has fully closed and the badge is valid.',
        'Physical / Preventive'
      ],
      [
        'Network-based IDS: compares traffic against signature databases and pages the SOC team when a match is found. It generates no automatic blocks.',
        'Technical / Detective'
      ],
      [
        'Automated nightly off-site backup with monthly full-restore drills performed by the operations team.',
        'Technical / Corrective'
      ],
      [
        '24/7 monitored CCTV: cameras at all badge-reader entry points stream live to a staffed security desk that immediately radios a response when tailgating is detected.',
        'Physical / Detective'
      ],
      [
        'Annual security awareness training for all employees covering phishing recognition, password policy, and clean desk procedures.',
        'Administrative / Preventive'
      ],
      [
        'Perimeter firewall with a default-deny rule set that allows only explicitly whitelisted ports and protocols on both inbound and outbound traffic.',
        'Technical / Preventive'
      ]
    ],
    options: [
      'Technical / Preventive',
      'Technical / Detective',
      'Technical / Corrective',
      'Technical / Deterrent',
      'Administrative / Preventive',
      'Administrative / Deterrent',
      'Administrative / Detective',
      'Physical / Preventive',
      'Physical / Detective',
      'Physical / Deterrent'
    ],
    e: 'AUP → Administrative / Deterrent: policy-based (administrative), and it discourages behavior through documented consequences but cannot technically stop a violation from occurring (not Preventive). | Mantrap → Physical / Preventive: a tangible mechanism that physically stops unauthorized entry — no human detection required (not Detective), no recovery function (not Corrective). | IDS → Technical / Detective: detects and alerts on matching traffic but generates no automatic blocks — this distinguishes IDS from IPS, which is Technical / Preventive. | Backup + restore → Technical / Corrective: automated backup software is technology-enforced (Technical) and restores normal operation after a data loss event (Corrective). It prevents nothing and detects nothing by itself. | Monitored CCTV → Physical / Detective: cameras are a physical presence; the staffed monitoring function detects events in real time. Common wrong answer: Physical / Deterrent — cameras do deter, but the PRIMARY function of a monitored system is detection and response. An unmonitored camera with no recording is Deterrent. | Security awareness training → Administrative / Preventive: a people-process program (Administrative) whose goal is changing behavior to prevent incidents. Common wrong answers: Administrative / Deterrent (training aims to change behavior permanently, not just discourage through threat of consequence); Operational / Preventive (SY0-701 uses the Technical/Administrative/Physical triad, not Operational). | Firewall rule set → Technical / Preventive: technology-enforced and actively blocks non-whitelisted traffic before it reaches internal systems. | Distractors — Technical / Deterrent (e.g., a login warning banner: real, but not in this set) · Administrative / Detective (e.g., a quarterly access review procedure: real, but not in this set) · Physical / Deterrent (e.g., "Authorized Personnel Only" signage: real, but not in this set).'
  },

  {
    id: 'pbq24', d: 1, sub: 'Cloud & remote work control classification (2 dimensions)',
    q: 'A security architect is classifying controls for a cloud-first, remote-work environment. Select the answer that correctly identifies BOTH the TYPE and the primary FUNCTION of each control.\n\nType: Technical = technology-enforced | Administrative = policy/procedure-based\nFunction: Preventive = stops the event | Detective = identifies the event | Corrective = recovers or restores after the event | Deterrent = discourages without technically blocking | Compensating = substitute control used when the ideal control is not feasible',
    rows: [
      [
        'Cloud Security Posture Management (CSPM) tool: continuously evaluates cloud resource configurations against a security baseline and alerts the security team when S3 buckets are publicly accessible or IAM policies violate least privilege.',
        'Technical / Detective'
      ],
      [
        'Always-on VPN policy: all remote worker internet traffic must route through the corporate security stack (firewall, proxy, DLP) before reaching external destinations.',
        'Technical / Preventive'
      ],
      [
        'MDM policy: after 10 consecutive failed PIN attempts, or when a theft is reported via the self-service portal, all corporate app data and profiles are remotely wiped from the device.',
        'Technical / Corrective'
      ],
      [
        'Vendor security contract clause: all cloud providers processing company data must submit a third-party penetration test report and remediation evidence to the security team every quarter.',
        'Administrative / Detective'
      ],
      [
        'Change management policy: all production cloud infrastructure changes require approval from two separate team members and a documented rollback procedure before deployment is authorized.',
        'Administrative / Preventive'
      ],
      [
        'Contractor data access procedure: when a contractor cannot be granted direct database access due to data residency restrictions, they are provisioned a read-only reporting dashboard covering only the fields their role requires. This substitute access is reviewed and renewed every 30 days.',
        'Technical / Compensating'
      ]
    ],
    options: [
      'Technical / Preventive',
      'Technical / Detective',
      'Technical / Corrective',
      'Technical / Compensating',
      'Technical / Deterrent',
      'Administrative / Preventive',
      'Administrative / Detective',
      'Administrative / Corrective',
      'Administrative / Deterrent'
    ],
    e: 'CSPM → Technical / Detective: software tool (Technical) that identifies misconfigurations and alerts — it does not automatically remediate, so it is Detective, not Corrective or Preventive. Common wrong: Technical / Preventive — CSPM in alert-only mode finds problems; it does not stop the misconfiguration from occurring. Some CSPM tools have auto-remediation (Corrective), but alert mode is Detective. | Always-on VPN → Technical / Preventive: routes all traffic through security controls before it reaches external destinations, actively preventing data exfiltration and unfiltered internet access (Preventive). Common wrong: Administrative / Preventive — the VPN policy is administrative, but the enforcement mechanism described is the VPN client itself (Technical). | MDM remote wipe → Technical / Corrective: software-enforced (Technical) and responds after a loss/theft event by restoring the security state (Corrective — removes corporate data, prevents further compromise). Common wrong: Technical / Preventive — wiping is a response action, not a pre-event prevention. | Vendor pentest contract clause → Administrative / Detective: a contractual requirement (Administrative) whose output — the penetration test — identifies vulnerabilities (Detective). Common wrong: Administrative / Preventive — the clause itself does not prevent breaches; the pentest findings must be remediated separately. | Two-person approval policy → Administrative / Preventive: a human-enforced policy (Administrative) that prevents unauthorized or accidental production changes from proceeding (Preventive). Common wrong: Technical / Preventive — the policy is the control; if a ticketing system enforced it automatically, that component would be Technical. | Read-only reporting dashboard for contractors → Technical / Compensating: a technology-enforced alternative (Technical) deployed specifically because the ideal control (direct DB access) is not available due to a constraint (data residency). The 30-day renewal cadence confirms it is a managed workaround. Common wrong: Technical / Preventive — a Compensating control is only used when the primary control cannot be implemented; it reduces risk within that constraint. | Distractors — Technical / Deterrent (cloud console login warning banner: valid classification, not in this set) · Administrative / Corrective (disaster recovery runbook: valid, not in this set) · Administrative / Deterrent (remote work AUP: valid, not in this set).'
  },
  {
    id: 'pbq25', d: 1, sub: 'Cryptographic hash matching',
    q: 'A security engineer is documenting the organization\'s cryptographic standards. Match each hash algorithm or keyed primitive to the use-case description that BEST fits its design purpose. (One option is a distractor — it does not match any algorithm listed.)',
    rows: [
      [
        'MD5',
        'Non-security file checksum — deprecated for integrity assurance due to practical collision attacks, but still found in legacy package-verification scripts where tampering is not a concern'
      ],
      [
        'SHA-1',
        'Certificate fingerprinting (legacy, deprecated) — used in early PKI and code signing until a chosen-prefix collision was demonstrated against it in 2017, allowing two different files to produce identical hashes'
      ],
      [
        'SHA-256',
        'Digital signatures and TLS certificate hashing — the current dominant standard in PKI, used in X.509 certificates, code signing, and most modern integrity-verification workflows'
      ],
      [
        'SHA-3',
        'Algorithmic diversity backup to SHA-2 — built on a fundamentally different internal construction (Keccak sponge function rather than Merkle-Damgård) to ensure that a structural weakness in SHA-2 does not compromise the entire hash ecosystem'
      ],
      [
        'bcrypt',
        'Password storage — incorporates a per-password random salt and a configurable work factor (cost parameter) that is deliberately tuned to be slow, making offline GPU-accelerated cracking economically infeasible as hardware improves'
      ],
      [
        'HMAC-SHA256',
        'Message authentication with a shared secret key — produces an authentication tag that simultaneously verifies data integrity AND proves the sender holds the pre-shared key; used in API request signing, JWT validation, and webhook payload verification'
      ]
    ],
    options: [
      'Non-security file checksum — deprecated for integrity assurance due to practical collision attacks, but still found in legacy package-verification scripts where tampering is not a concern',
      'Certificate fingerprinting (legacy, deprecated) — used in early PKI and code signing until a chosen-prefix collision was demonstrated against it in 2017, allowing two different files to produce identical hashes',
      'Digital signatures and TLS certificate hashing — the current dominant standard in PKI, used in X.509 certificates, code signing, and most modern integrity-verification workflows',
      'Algorithmic diversity backup to SHA-2 — built on a fundamentally different internal construction (Keccak sponge function rather than Merkle-Damgård) to ensure that a structural weakness in SHA-2 does not compromise the entire hash ecosystem',
      'Password storage — incorporates a per-password random salt and a configurable work factor (cost parameter) that is deliberately tuned to be slow, making offline GPU-accelerated cracking economically infeasible as hardware improves',
      'Message authentication with a shared secret key — produces an authentication tag that simultaneously verifies data integrity AND proves the sender holds the pre-shared key; used in API request signing, JWT validation, and webhook payload verification',
      'Password-based key derivation — stretches a low-entropy passphrase into a fixed-length cryptographic key using a salted, iterated hash function (PBKDF2); designed to produce encryption keys, not to store passwords directly'
    ],
    e: 'MD5 → Non-security checksum: MD5 collisions were demonstrated in 1996 and made practical by Wang et al. in 2004 — two different files can be crafted with the same MD5 hash, making it untrustworthy for any security-critical integrity check. It persists only in legacy non-security contexts. | SHA-1 → Deprecated cert fingerprinting: the SHAttered attack (2017, Google/CWI) produced the first real-world chosen-prefix SHA-1 collision; browsers stopped accepting SHA-1 TLS certificates in 2017. MD5 and SHA-1 are BOTH deprecated but for different reasons — MD5 was broken earlier and more completely; SHA-1 took until 2017 for a practical full collision. | SHA-256 → Current PKI standard: part of the SHA-2 family (same Merkle-Damgård construction as SHA-1, but with a longer output and additional rounds); no practical collision attack exists against SHA-256. | SHA-3 → Keccak sponge: SHA-3 was standardized in 2015 NOT because SHA-2 was broken, but as insurance — a different mathematical construction that would survive if a fundamental flaw were discovered in the Merkle-Damgård family. Common confusion: candidates think SHA-3 "replaced" SHA-2 because it has a higher number. | bcrypt → Password hashing with work factor: unlike general-purpose hashes (SHA-256), bcrypt is deliberately slow and cannot be parallelized on GPUs the same way — the configurable cost parameter (rounds) lets admins increase difficulty as hardware speeds improve without changing the algorithm. | HMAC-SHA256 → Keyed message authentication: HMAC requires a shared secret key — it cannot be computed without that key. Compare with bcrypt: bcrypt is one-way password storage (no shared key); HMAC is a symmetric MAC (shared key required by both parties). | Distractor — PBKDF2 (key derivation): PBKDF2 stretches a passphrase into an encryption key, not a stored password hash — it produces output intended for use as a cryptographic key, not for direct storage and comparison as bcrypt does.'
  },

  {
    id: 'pbq26', d: 3, sub: 'Network security protocol matching',
    q: 'A network security architect is documenting which protocol addresses which threat. Match each protocol to what it specifically PROTECTS AGAINST — not what it is, but what attack or risk it was designed to defeat. (One option is a distractor.)',
    rows: [
      [
        'TLS 1.3',
        'On-path eavesdropping of application-layer traffic — additionally provides forward secrecy so that capturing the server\'s private key after the fact cannot decrypt previously recorded sessions'
      ],
      [
        'DNSSEC',
        'DNS response spoofing and cache poisoning — prevents an attacker from substituting fraudulent DNS records by requiring that all responses carry a cryptographic signature from the authoritative zone, detectable by validating resolvers'
      ],
      [
        'DMARC',
        'Email From-header domain spoofing — defines a policy (none / quarantine / reject) that receiving mail servers apply when an email claims to come from your domain but fails both SPF and DKIM alignment checks'
      ],
      [
        'S/MIME',
        'Email content interception and sender impersonation — encrypts the message body end-to-end between sender and recipient\'s mail clients (not just hop-to-hop between servers as TLS does) and allows the recipient to verify the sender\'s identity via a certificate'
      ],
      [
        'SRTP',
        'Eavesdropping and tampering with real-time voice and video media streams — encrypts and authenticates the RTP packet payloads carrying actual audio/video data over IP telephony and video conferencing'
      ],
      [
        'LDAPS',
        'Credential interception during directory service queries — wraps LDAP traffic in TLS so that usernames, passwords, and directory data transmitted to domain controllers cannot be captured in cleartext by a network observer'
      ]
    ],
    options: [
      'On-path eavesdropping of application-layer traffic — additionally provides forward secrecy so that capturing the server\'s private key after the fact cannot decrypt previously recorded sessions',
      'DNS response spoofing and cache poisoning — prevents an attacker from substituting fraudulent DNS records by requiring that all responses carry a cryptographic signature from the authoritative zone, detectable by validating resolvers',
      'Email From-header domain spoofing — defines a policy (none / quarantine / reject) that receiving mail servers apply when an email claims to come from your domain but fails both SPF and DKIM alignment checks',
      'Email content interception and sender impersonation — encrypts the message body end-to-end between sender and recipient\'s mail clients (not just hop-to-hop between servers as TLS does) and allows the recipient to verify the sender\'s identity via a certificate',
      'Eavesdropping and tampering with real-time voice and video media streams — encrypts and authenticates the RTP packet payloads carrying actual audio/video data over IP telephony and video conferencing',
      'Credential interception during directory service queries — wraps LDAP traffic in TLS so that usernames, passwords, and directory data transmitted to domain controllers cannot be captured in cleartext by a network observer',
      'VoIP call signaling interception — secures the SIP messages that set up, manage, and tear down calls (not the media stream itself; a separate protocol handles the audio/video payload)'
    ],
    e: 'TLS 1.3 → On-path eavesdropping + forward secrecy: TLS 1.3 mandates forward secrecy (only ephemeral Diffie-Hellman key exchange — no RSA key exchange allowed) so session keys are never derivable from the server private key, making retroactive decryption impossible even with key compromise. | DNSSEC → Cache poisoning: DNSSEC signs zone records with the zone\'s private key; validating resolvers check the chain of trust from the root to the zone. It does NOT encrypt DNS queries — a passive observer still sees what domain you queried. That is a separate problem addressed by DoH/DoT. | DMARC → From-header spoofing: DMARC sits on top of SPF (authorizes sending IPs) and DKIM (signs message content) and adds ALIGNMENT — the From header domain must align with the authenticated domain. Common confusion with S/MIME: DMARC is a server-to-server policy mechanism; it does not encrypt or sign the message content. | S/MIME → End-to-end email encryption: TLS encrypts email between mail servers (hop-to-hop) but the receiving mail server decrypts it — the message exists in plaintext at rest. S/MIME encrypts from sender\'s mail client to recipient\'s mail client, so no intermediate server sees the plaintext. | SRTP → Media stream protection: SRTP (Secure Real-time Transport Protocol) protects the actual voice/video payload — the RTP packets. Common confusion with the distractor: SIP over TLS (SIPS) protects call signaling (setup/teardown), not the media payload. SRTP and SIPS are complementary — both are needed for full VoIP call security. | LDAPS → Cleartext directory credential exposure: standard LDAP (port 389) transmits bind credentials in cleartext — a network observer captures AD usernames and passwords. LDAPS (port 636) wraps this in TLS. Common confusion with TLS 1.3: both use TLS, but LDAPS is specifically about directory service protocol encryption, not general application traffic. | Distractor → SIP signaling interception: this describes SIPS (SIP over TLS), not SRTP — SIPS secures the call control messages, while SRTP secures the media stream. They are separate protocols that must both be deployed for fully secure VoIP.'
  },

  {
    id: 'pbq27', d: 4, sub: 'Ransomware IR sequencing',
    q: 'A hospital\'s file server has been encrypted by ransomware and is actively attempting to spread to adjacent shares. The security team must respond. Assign the correct position (1 = first action taken, 7 = last) to each step.\n\nKey constraints: evidence preservation must precede evidence destruction; eradication must be confirmed before recovery begins; the full picture must be known before the post-incident review can be meaningful.',
    rows: [
      ['Isolate all affected systems by removing them from the network (disable NICs, quarantine VLANs, or power off if necessary to stop active spread)', '1'],
      ['Capture forensic images of affected systems and preserve volatile memory (running processes, network connections) before any remediation changes are made', '2'],
      ['Identify the ransomware variant using the ransom note, encrypted file extensions, and hash lookup against known threat intelligence databases', '3'],
      ['Notify law enforcement (FBI IC3) and relevant regulatory bodies (HHS for HIPAA) while forensic evidence is still intact', '4'],
      ['Eradicate all persistence mechanisms: scheduled tasks, registry run keys, backdoor accounts, rogue services, and lateral movement footholds identified during forensic analysis', '5'],
      ['Restore affected systems and data from the last known-good backup verified to predate the initial infection', '6'],
      ['Conduct a post-incident review: document the full attack timeline, identify control failures, and assign remediation owners and deadlines', '7']
    ],
    options: ['1', '2', '3', '4', '5', '6', '7'],
    e: 'Step 1 — Isolation: containment is always first; an actively spreading ransomware destroys more evidence and causes more damage with every second of network connectivity. | Step 2 — Forensic preservation: capture volatile evidence (RAM, running processes, active network connections) BEFORE any remediation touches the system — eradication in Step 5 will destroy the very artifacts forensics needs. This is the most commonly missed sequencing point: candidates place this after identification or after law enforcement notification. | Step 3 — Variant identification: knowing the ransomware family determines whether a decryptor exists, informs eradication steps (each family uses different persistence mechanisms), and is required before law enforcement notification to provide meaningful detail. | Step 4 — Law enforcement notification: notifying while evidence is intact (before Step 5 destroys persistence mechanisms) allows law enforcement to potentially assist with decryptors or threat actor attribution; HIPAA requires HHS breach notification, and doing this after containment but before eradication reflects current FBI/CISA guidance. | Step 5 — Eradication: ALL persistence mechanisms must be removed and confirmed before any restoration begins — restoring a clean backup onto a system that still contains a scheduled task re-executing the ransomware immediately reinfects the backup. | Step 6 — Recovery / restoration: ONLY after eradication is confirmed. Verify the restore point predates the initial infection (check backup integrity and infection timeline from forensics). | Step 7 — Post-incident review (Lessons Learned): only meaningful after the full incident is resolved — the timeline is complete, all control failures are known, and the team can make accurate remediation recommendations without the pressure of an active incident.'
  },

  {
    id: 'pbq28', d: 5, sub: 'Vulnerability management lifecycle',
    q: 'A security team is establishing a formal vulnerability management program. Assign the correct position (1 = first, 6 = last) to each phase of the vulnerability management lifecycle.\n\nKey constraints: you cannot scan what you have not inventoried; you cannot prioritize findings you have not discovered; you cannot verify what you have not yet remediated; the final report reflects verified outcomes.',
    rows: [
      ['Define scope and build a complete asset inventory — identify all systems, applications, and network segments that fall within the vulnerability management program\'s coverage', '1'],
      ['Scan assets for vulnerabilities using authenticated and unauthenticated scanning tools against the defined scope', '2'],
      ['Prioritize discovered vulnerabilities using CVSS base scores, asset business criticality, threat intelligence on active exploitation, and compensating control context', '3'],
      ['Remediate vulnerabilities in priority order: apply patches, harden configurations, or implement compensating controls where patching is not immediately feasible', '4'],
      ['Verify remediation success: perform targeted rescans or manual validation on each remediated finding to confirm the vulnerability no longer exists or that the compensating control is effective', '5'],
      ['Report findings, remediation status, and residual risk to stakeholders — including risk owners, management, and compliance teams — to close the cycle and inform the next scan scope', '6']
    ],
    options: ['1', '2', '3', '4', '5', '6'],
    e: 'Step 1 — Scope and asset inventory: you cannot manage risk for assets you do not know exist — shadow IT and forgotten servers are often the entry point for breaches. A complete and accurate asset inventory is the prerequisite for every subsequent step. | Step 2 — Scanning: authenticated scans (using credentials to inspect installed software, patch level, and configuration) find significantly more vulnerabilities than unauthenticated scans — both should be used where possible. | Step 3 — Prioritization: NOT every CVSS Critical finding is equally urgent — a CVSS 9.8 vulnerability on an isolated test server with no internet exposure may be lower priority than a CVSS 7.5 vulnerability on a public-facing payment server with active exploitation in the wild. Effective prioritization uses CVSS + asset criticality + threat intel on active exploitation (CISA KEV catalog). | Step 4 — Remediation: patches address root causes; compensating controls (network segmentation, WAF rules, access restrictions) reduce exposure when patching is not immediately feasible. Compensating controls must be documented and tracked until the root-cause patch is applied. | Step 5 — Verification: a patch applied incorrectly, a compensating control misconfigured, or a system that missed the patch deployment are common — verification confirms the fix actually worked before marking the finding closed. Closing findings without verification creates false assurance in the program. | Step 6 — Reporting LAST: the report should reflect verified outcomes, not preliminary scan findings. Reporting before verification means stakeholders see unresolved items as resolved, creating compliance and risk posture misrepresentation. The report also feeds back into the next cycle\'s scope definition (Step 1), making vulnerability management a continuous loop rather than a one-time project.'
  }
];