# Quiz gap analysis — bank vs. current site content

> **STATUS: RESOLVED (2026-07-21).** 300 new multiple-choice questions were added to
> `questions-v2.js` (ids 501–800), taking the bank from 500 → **800**, in two rounds:
>
> - **Round 1 (ids 501–729, 229 questions)** — closed the coverage gap. Untested glossary
>   terms went **358 → 0**.
> - **Round 2 (ids 730–800, 71 questions)** — deepened the weakest coverage and corrected
>   domain drift. Terms with only a single mention went **83 → 10**; terms with solid
>   coverage (2+ mentions) went 542 → **1022 of 1090**.
>
> Also fixed pre-existing question **415**, which was typed `multi` while its options bundle
> answer _pairs_ (only one option is correct); it now renders as single-select and its stray
> "(Select TWO)" instruction was removed.
>
> **Domain weighting** could not be fully restored, because the fix is add-only and Domain 3
> was already over its exam weight after round 1. Round 2 was allocated to close the gap as
> far as addition allows:
>
> | Domain                           | Final | Share | Exam weight |
> | -------------------------------- | ----: | ----: | ----------: |
> | 1.0 General Security Concepts    |    91 | 11.4% |         12% |
> | 2.0 Threats, Vulns & Mitigations |   166 | 20.8% |         22% |
> | 3.0 Security Architecture        |   180 | 22.5% |         18% |
> | 4.0 Security Operations          |   212 | 26.5% |         28% |
> | 5.0 Security Program Management  |   151 | 18.9% |         20% |
>
> Domain 3 remains ~4.5 points heavy; removing questions is the only way to close it further.
> Remaining follow-up: PBQ labs were not expanded (still 40); see "Recommended allocation".
>
> The original findings are preserved below.

Generated 2026-07-21 · method: every glossary term (with acronym/expansion/alt-name/hyphen variants)
matched against the full text of every live question — MC stems, all options, explanations, subdomains,
plus all PBQ rows and options.

**Sources analyzed:** `glossary.js` (1090 terms) · `questions-v2.js` (500 MC) · `pbq.js` + `pbq2.js` (40 PBQ)

## Headline numbers

| Bucket                   |   Count | Meaning                                                      |
| ------------------------ | ------: | ------------------------------------------------------------ |
| Covered (2+ mentions)    |     542 | Genuinely tested                                             |
| Thin (exactly 1 mention) |      76 | Appears once, often only as a distractor — weak coverage     |
| **Untested**             | **358** | No mention in any question, option, explanation, or PBQ      |
| Ambiguous                |     114 | Partial word overlap only; treated as covered (conservative) |

**358 of 1090 glossary terms (33%) are tested nowhere.** Validation: a 36-term
sample was re-checked by direct phrase grep against the raw bank files — 35 confirmed truly absent
(one, "onboarding/offboarding", appears incidentally inside an unrelated stem). Expect ~97% precision.

## Existing bank is already correctly domain-weighted

| Domain                                     | Current MC | Share | SY0-701 weight |
| ------------------------------------------ | ---------: | ----: | -------------: |
| 1.0 General Security Concepts              |         60 |   12% |            12% |
| 2.0 Threats, Vulnerabilities & Mitigations |        110 |   22% |            22% |
| 3.0 Security Architecture                  |         90 |   18% |            18% |
| 4.0 Security Operations                    |        140 |   28% |            28% |
| 5.0 Security Program Management            |        100 |   20% |            20% |

Current mix: 456 single / 44 multi · 226 hard / 231 medium / 43 easy.
**New questions must preserve these proportions** — so the additions get allocated by domain weight,
not by raw gap size (Domain 3 has by far the most untested terms but must not become the largest addition).

## Untested terms by exam domain

| Domain | Untested terms | Chapters |
| ------ | -------------: | -------- |
| 1.0    |             45 | 1, 10    |
| 2.0    |             45 | 6, 7     |
| 3.0    |            123 | 3, 4, 5  |
| 4.0    |             68 | 2, 9     |
| 5.0    |             77 | 8, 11    |

## Recommended allocation for the add-only pass

Target: **+250 MC questions** (bank 500 → 750) and **+10 PBQ labs** (40 → 50), split by exam weight.
Because gap size and exam weight disagree, the terms-per-question density differs per domain:

| Domain                           | New MC | Untested terms | Approach                                                                            |
| -------------------------------- | -----: | -------------: | ----------------------------------------------------------------------------------- |
| 1.0 General Security Concepts    |     30 |             45 | ~1.5 terms/question — crypto formats & control types cluster well                   |
| 2.0 Threats, Vulns & Mitigations |     55 |             45 | ~1 term/question — highest exam value, give each attack its own scenario            |
| 3.0 Security Architecture        |     45 |            123 | ~3 terms/question — bundle protocol/port/appliance families into scenarios and PBQs |
| 4.0 Security Operations          |     70 |             68 | ~1 term/question — heaviest domain, deepest coverage                                |
| 5.0 Security Program Mgmt        |     50 |             77 | ~1.5 terms/question — group governance/audit/risk vocab into scenarios              |

Keep the existing mix: ~90% single / 10% multi-select, and roughly 45% hard / 46% medium / 9% easy.

Domain 3's overflow is best absorbed by PBQ labs — port-matching, protocol-to-secure-alternative,
appliance placement, RAID-level selection, and backup/site-resiliency ordering all map naturally to the
existing PBQ styles and cover many terms per lab.

### Highest-value clusters to write first

1. **Network protocols & appliances** (ch3, 49 terms) — ICMP, NTP, OSPF, GRE, TFTP, FTPS, PPTP, DTLS,
   proxies (forward/reverse), UTM, screened subnet, air gap, fail-open/fail-closed, IPsec AH/ESP/IKE.
2. **Resilience & physical ops** (ch9, 54 terms) — RAID levels, UPS/generator/PDU, active-active vs
   active-passive, COOP, backup types (snapshot/hot/warm/cold, on/off-site), sensor types, TEMPEST/Faraday,
   fire suppression (dry-pipe, pre-action, clean agent).
3. **Endpoint/IoT/OT** (ch5, 49 terms) — PLC, HMI, data historian, SCADA peers, Zigbee/Z-Wave/NB-IoT/LTE-M,
   CAN bus, OBD-II, BAS, deployment models (COPE/CYOD/COBO), ASLR/DEP, gold image, jailbreaking/side loading.
4. **Governance & audit** (ch8, 51 terms) — risk assessment cadences, risk appetite postures, pen test
   environments (known/partially known/unknown), audit types, SSAE/SOC 3/CCM/CIS-RAM, KRI, TCO, ROSI.
5. **Crypto formats & PKI plumbing** (ch10, 36 terms) — PEM/DER/P7B/P12, RA/KRA, SAN & wildcard certs,
   block vs stream ciphers, ChaCha20, Blowfish, ECDSA, scrypt, pepper, key stretching, blockchain.
6. **Application attacks** (ch7, 19 terms) — SYN flood, reflected/amplified DDoS, XML injection, integer
   overflow, memory leak, race condition/TOCTOU, session fixation/sidejacking, credential replay,
   domain hijacking, URL redirection, null pointer dereference, AppArmor/WDAC/SRP.

## Full untested list by chapter

### Chapter 1 — Security fundamentals & control types · domain 1.0 · 9 untested

**Core** — Job rotation · Mandatory vacation · Directive control · Threat scope reduction · Fencing · PTZ (Pan-Tilt-Zoom) · Deperimeterization

**Crypto** — Data masking

**Ops** — Security guards

### Chapter 2 — Identity & access management · domain 4.0 · 14 untested

**IAM** — Identity proofing · Passwordless · Rule-based access control · PIV (Personal Identity Verification) · Time-of-day restrictions · Interoperability · Password age · FACL (File System Access Control List) · FIDO (Fast IDentity Online) · ZSP (Zero Standing Privileges) · FER (Failure to Enroll Rate)

**Endpoint** — Geofencing · SELinux (Security-Enhanced Linux)

**Ops** — Resource inaccessibility

### Chapter 3 — Network architecture & protocols · domain 3.0 · 49 untested

**Network** — UTM (Unified Threat Management) · Forward proxy · Reverse proxy · AH (Authentication Header) · ESP (Encapsulating Security Payload) · IKE (Internet Key Exchange) · Screened subnet · Content filter · ICMP (Internet Control Message Protocol) · FTPS (FTP Secure) · TFTP (Trivial File Transfer Protocol) · NTP (Network Time Protocol) · Fail-open · Fail-closed · Inline vs. tap/monitor · NIPS (Network-based Intrusion Prevention System) · PPTP (Point-to-Point Tunneling Protocol) · OSPF (Open Shortest Path First) · VLSM (Variable Length Subnet Masking) · IDF (Intermediate Distribution Frame) · MDF (Main Distribution Frame) · GRE (Generic Routing Encapsulation) · PBX (Private Branch Exchange) · POTS (Plain Old Telephone Service) · DSL (Digital Subscriber Line) · CSU (Channel Service Unit) · DNAT (Destination Network Address Translation) · MTU (Maximum Transmission Unit) · VTC (Video Teleconferencing) · IRC (Internet Relay Chat) · SHTTP (Secure HyperText Transfer Protocol) · Logical segmentation · Content categorization · RAS (Remote Access Server) · SOAP (Simple Object Access Protocol) · UTP (Unshielded Twisted Pair) · Broadcast domain · Neighbor Discovery (ND) · Security Association (SA) · DTLS (Datagram Transport Layer Security) · VNC (Virtual Network Computing) · MIB (Management Information Base) · SASL (Simple Authentication and Security Layer) · NTP Stratum · CARP (Common Address Redundancy Protocol) · DiffServ (Differentiated Services)

**Core** — Policy-driven access control

**Data** — Intellectual property (IP)

**Crypto** — IDEA (International Data Encryption Algorithm)

### Chapter 4 — Wireless & network security · domain 3.0 · 25 untested

**Wireless** — WPA (Wi-Fi Protected Access) · WPS (Wi-Fi Protected Setup) · Site survey · MSCHAP (Microsoft Challenge Handshake Authentication Protocol) · PEAP (Protected Extensible Authentication Protocol) · LEAP (Lightweight Extensible Authentication Protocol) · TKIP (Temporal Key Integrity Protocol) · WIDS (Wireless Intrusion Detection System) · WTLS (Wireless Transport Layer Security) · PMK (Pairwise Master Key) · BLE (Bluetooth Low Energy) · Bluebourne

**Network** — Port mirroring (Switched Port Analyzer (SPAN)) · Honeynet · Honeyfile · NIDS (Network-based Intrusion Detection System) · L2TP (Layer 2 Tunneling Protocol) · PPP (Point-to-Point Protocol) · PAC (Proxy Auto Configuration)

**IAM** — TACACS+ (Terminal Access Controller Access-Control System Plus) · PAP (Password Authentication Protocol) · CHAP (Challenge-Handshake Authentication Protocol)

**Crypto** — IV (Initialization Vector)

**GRC** — IEEE (Institute of Electrical and Electronics Engineers)

**Threats** — War

### Chapter 5 — Endpoint, mobile, cloud & virtualization · domain 3.0 · 49 untested

**Endpoint** — UEM (Unified Endpoint Management) · COPE (Corporate-Owned, Personally Enabled) · CYOD (Choose Your Own Device) · Thin client · Side loading · Jailbreaking · Gold image (Master image) · ASLR (Address Space Layout Randomization) · DEP (Data Execution Prevention) · SEH (Structured Exception Handling) · BIOS (Basic Input/Output System) · UAV (Unmanned Aerial Vehicle) · OTA (Over-the-Air) · MFD (Multifunction Device) · MFP (Multifunction Printer) · ESN (Electronic Serial Number) · PED (Personal Electronic Device) · EFS (Encrypted File System) · Mobile wallet · COBO (Corporate-Owned, Business-Only) · EPP (Endpoint Protection Platform) · PLC (Programmable Logic Controller) · Data historian · HMI (Human-Machine Interface) · AIC triad (Availability, Integrity, Confidentiality) · Z-Wave · Zigbee · NB-IoT (Narrowband IoT) · LTE-M (LTE Machine Type Communication) · BAS (Building Automation System) · Smart meter · PACS (Physical Access Control System) · OBD-II (On-Board Diagnostics II) · SEAndroid (Security-Enhanced Android) · Apple DEP/VPP (Device Enrollment Program / Volume Purchase Program) · Sheep dip · Abandonware

**Cloud** — VM sprawl · Edge computing · VDI (Virtual Desktop Infrastructure) · VDE (Virtual Desktop Environment) · Cloud-specific vulnerabilities · MaaS (Monitoring as a Service) · NFV (Network Functions Virtualization) · Transit gateway · Idempotence

**Data** — SED (Self-Encrypting Drive)

**Wireless** — Cellular

**Crypto** — TEE (Trusted Execution Environment)

### Chapter 6 — Threat actors, malware & social engineering · domain 2.0 · 26 untested

**Threats** — Unskilled attacker (Script kiddie) · AI (Artificial Intelligence) · Image-based threat vector · Blackmail · Philosophical/political beliefs · Ethical hacking motivation · Revenge · Disruption/chaos · File-based threat vector · Session fixation · Session sidejacking · IM (Instant Messaging)

**Malware** — Virus · PUP (Potentially Unwanted Program) · Bloatware · VBA (Visual Basic for Applications) · Crypto-malware · CME (Common Malware Enumeration) · OSSEC

**SocEng** — Influence campaign · SPIM (Spam over Instant Messaging) · Brand impersonation · Misinformation/disinformation

**Ops** — FIM (File Integrity Monitoring) · AIS (Automated Indicator Sharing) · Dark web

### Chapter 7 — Application & web attacks · domain 2.0 · 19 untested

**Threats** — Race condition (Time-of-check to time-of-use (TOCTOU)) · Reflected DDoS · Attacker-in-the-browser (Man-in-the-Browser) · Domain hijacking · Integer overflow · Memory leak · SameSite · Null pointer dereference · WDAC (Windows Defender Application Control) · Software Restriction Policies (SRP) · AppArmor · BeEF (Browser Exploitation Framework) · Software diversity

**Ops** — Client-side validation · Compiler · Outsourced code · Secure cookie · Stored procedure

**SocEng** — Pharming

### Chapter 8 — Risk, governance & third-party management · domain 5.0 · 51 untested

**GRC** — Risk transference · Environmental variables · Key Risk Indicator (KRI) · Partially known environment · Offensive pen test · Defensive pen test · Integrated pen test · SDK (Software Development Kit) · RAD (Rapid Application Development) · UAT (User Acceptance Testing) · CIO (Chief Information Officer) · CSO (Chief Security Officer) · ISSO (Information Systems Security Officer) · Backout plan · Service restart (Application restart) · Industry/organizational impact · Loss of license · Passive reconnaissance · CAR (Corrective Action Report) · CP (Contingency Planning) · Ad hoc risk assessment · Expansionary risk appetite · Conservative risk appetite · Neutral risk appetite · Regulatory examinations · Onboarding/offboarding · Risky behavior · Conduct policy (Code of conduct) · Security awareness training lifecycle · TCO (Total Cost of Ownership) · CTF (Capture the Flag) · WO (Work Order) · SDL (Security Development Lifecycle) · WRT (Work Recovery Time) · DISA (Defense Information Systems Agency) · RCSA (Risk and Control Self-Assessment) · ROSI (Return on Security Investment) · SSAE (Statement on Standards for Attestation Engagements) · CIS-RAM (CIS Risk Assessment Method) · DoD Cyber Exchange

**Ops** — Credentialed scan · Blue team · SCAP (Security Content Automation Protocol) · theHarvester · Dsniff · Ettercap · Scapy · sFlow

**Network** — Microsegmentation · Three-way handshake

**Wireless** — Heat map

### Chapter 9 — Resilience, physical security & vulnerability ops · domain 4.0 · 54 untested

**Ops** — Black-box testing · White-box testing · Gray-box testing · Infrared detection · Pressure detection · Microwave detection · Ultrasonic detection · Dual gate · Lighting · Alarms · Active/active load balancing · Active/passive load balancing · Software load balancer · NIC teaming (Link aggregation) · UPS (Uninterruptible Power Supply) · Generator · Managed PDU (Managed Power Distribution Unit) · Site resiliency · COOP (Continuity of Operations Planning) · Parallel processing · Capacity planning · Concurrent session usage · Out-of-cycle logging · Platform diversity · Geographic dispersion · ML (Machine Learning) · Published/documented indicator · Removal of unnecessary software · Rescanning · CRC (Cyclical Redundancy Check) · MTTF (Mean Time to Failure) · MDR (Managed Detection and Response) · CMDB (Configuration Management Database) · Wazuh · OpenVAS (Open Vulnerability Assessment System) · TDR (Threat Detection and Response) · TEMPEST · Faraday cage · Dry pipe system · Pre-action system · Clean Agent · Trend analysis · Instant Secure Erase (ISE / crypto erase)

**Threats** — Credit card skimming · Physical brute force · Architecture and design weaknesses · System sprawl

**Core** — Technology diversity · Control diversity · Mission essential functions

**GRC** — Hardware asset management · MEF (Mission Essential Functions)

**Wireless** — RFID (Radio Frequency Identification)

**Data** — Online backup

### Chapter 10 — Cryptography & PKI · domain 1.0 · 36 untested

**Crypto** — Pepper · RIPEMD (RACE Integrity Primitives Evaluation Message Digest) · Stream cipher · PGP (Pretty Good Privacy) · ChaCha20 · Blowfish · ECDSA (Elliptic Curve Digital Signature Algorithm) · PEM format (Privacy-Enhanced Mail) · DER format (Distinguished Encoding Rules) · P7B (PKCS#7) · P12 / PFX (PKCS#12 / Personal Information Exchange) · RA (Registration Authority) · Blockchain · Open public ledger · Lightweight cryptography · scrypt · SCEP (Simple Certificate Enrollment Protocol) · P12 (PKCS#12) · CFB (Cipher Feedback) · OID (Object Identifier) · Recovery Agent (RA) · XOR (Exclusive OR) · Partition encryption · Third-party certificate · Cryptoprocessor · Subject name attributes · PKCS (Public Key Cryptography Standards) · TDE (Transparent Data Encryption) · KMIP (Key Management Interoperability Protocol) · KRA (Key Recovery Agent) · Cain and Abel · L0phtcrack · HPKP (HTTP Public Key Pinning)

**IAM** — Distinguished Name (DN) · OU (Organizational Unit)

**Endpoint** — FPGA (Field Programmable Gate Array)

### Chapter 11 — Data protection, incident response & policy · domain 5.0 · 26 untested

**Data** — Data steward · File shredding · Pulping · Burning (incineration) · Certificate of destruction · Human- and non-human-readable data · K-anonymity · Pseudo-anonymization · De-identification · RMS (Rights Management Services) · Tombstone

**GRC** — Centralized governance · Decentralized governance · EoSL (End of Service Life) · Conflicts of interest · Acknowledgement · Computer-based training (CBT) · MOA (Memorandum of Agreement) · Situational awareness

**IR** — CIRT (Computer Incident Response Team) · CSIRT (Computer Security Incident Response Team) · WinHex

**Endpoint** — HDD (Hard Disk Drive) · MMS (Multimedia Messaging Service)

**IAM** — SAM (Security Accounts Manager) · SAW (Secure Administrative Workstation)

## Thin coverage (1 mention only) — candidates for a second question

- ch1 · Core · CIA Triad
- ch2 · Core · AAA
- ch1 · Core · Need to know
- ch3 · Core · Data plane
- ch1 · Core · Operational control
- ch10 · Crypto · DES
- ch10 · Crypto · CA
- ch10 · Crypto · Birthday attack
- ch10 · Crypto · Post-quantum cryptography
- ch10 · Crypto · KEK
- ch2 · IAM · HOTP
- ch2 · IAM · KDC
- ch3 · Network · Stateful firewall
- ch4 · Network · Full tunnel
- ch3 · Network · Anomaly-based detection
- ch3 · Network · NAT
- ch3 · Network · Out-of-band management
- ch6 · Threats · Hacktivist
- ch10 · Threats · Dictionary attack
- ch6 · Malware · Bootkit
- ch11 · Data · Pseudonymization
- ch5 · Ops · XDR
- ch8 · Ops · False negative
- ch11 · IR · Runbook
- ch5 · Endpoint · Measured boot
- ch5 · Endpoint · IoT
- ch7 · Threats · SYN flood
- ch7 · Ops · Fuzzing
- ch7 · Ops · Guardrails
- ch7 · Ops · User provisioning
- ch9 · Core · Vendor diversity
- ch9 · Ops · Clustering
- ch9 · Data · NAS
- ch10 · Data · SAN
- ch9 · Data · 3-2-1 rule
- ch9 · Ops · Differential backup
- ch9 · Ops · Incremental backup
- ch9 · Ops · Journaling
- ch11 · Data · Top Secret
- ch11 · Data · Data retention policy
- ch11 · Data · Wiping (overwrite)
- ch11 · GRC · Data inventory
- ch11 · GRC · OPSEC
- ch2 · Ops · Resource consumption
- ch9 · Core · Bollards
- ch5 · Crypto · Secure enclave
- ch10 · Crypto · SAN certificate
- ch5 · Cloud · Operational Technology
- ch9 · Ops · User Behavior Analytics
- ch11 · IAM · Password vaulting
- ch8 · GRC · Risk owner
- ch2 · Crypto · CTR
- ch9 · Ops · HVAC
- ch5 · Endpoint · MBR
- ch3 · Network · P2P
- ch3 · Network · TSIG
- ch8 · GRC · Standard operating procedure
- ch10 · Crypto · Volume encryption
- ch10 · Crypto · Database encryption
- ch11 · Data · Regulated data
- ch11 · Data · Financial information
- ch3 · Network · URI
- ch9 · GRC · Fines
- ch5 · Endpoint · GPS
- ch4 · Wireless · WAP
- ch8 · GRC · ERM
- ch4 · Wireless · BSSID
- ch5 · Endpoint · UAC
- ch5 · Cloud · DCS
- ch9 · Ops · OTX
- ch3 · Network · iptables
- ch6 · Malware · Cuckoo Sandbox
- ch7 · Threats · AppLocker
- ch9 · Ops · Halon
- ch10 · Crypto · Hashcat
- ch11 · IR · Amcache
