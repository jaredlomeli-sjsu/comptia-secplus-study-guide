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
  }
];
