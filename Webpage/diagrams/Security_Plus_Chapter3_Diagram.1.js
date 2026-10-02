/* ═══════════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════════ */
let activeOverlay  = null;
let ztActive       = false;
let linkedInActive = false;
let studyMode      = false;
let selectedNode   = null;

/* ═══════════════════════════════════════════════════════
   HELPERS — build detail panel HTML blocks
═══════════════════════════════════════════════════════ */
function def(text) {
  return `<div class="dp-section"><div class="dp-content">${text}</div></div>`;
}
function ports(...pairs) {
  const pills = pairs.map(([p,l]) => `<span class="dp-pill port">${p}</span><span style="font-size:10px;color:var(--text-dim)">${l}</span>`).join(' ');
  return `<div class="dp-section"><div class="dp-label">Ports</div><div class="dp-port-row">${pills}</div></div>`;
}
function insecure(text) { return `<div class="dp-warn">${text}</div>`; }
function secure(text)   { return `<div class="dp-secure">${text}</div>`; }
function tip(text)      { return `<div class="dp-exam-tip">${text}</div>`; }
function cli(text)      { return `<div class="dp-cli">${text}</div>`; }
function divider()      { return `<div class="dp-divider"></div>`; }
function table(headers, rows) {
  const ths = headers.map(h=>`<th>${h}</th>`).join('');
  const trs = rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('');
  return `<table class="dp-table"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
}
function h(html) { return html; }

/* ═══════════════════════════════════════════════════════
   NODE DATA — all 17 clusters
═══════════════════════════════════════════════════════ */
const NODE_DATA = {

  /* ── CLUSTER 1 / OSI reference nodes ── */
  'osi-sidebar': { title: 'OSI Model', osi: null, html:
    def('The Open Systems Interconnection model is a 7-layer conceptual framework describing how data travels across a network. Each layer has distinct responsibilities and hands data up/down to adjacent layers.') +
    table(['Layer','Name','Key Protocols'],
      [['7','Application','HTTP, HTTPS, FTP, SSH, DNS, SMTP, LDAP, SNMP'],
       ['6','Presentation','SSL, TLS — encryption, formatting, compression'],
       ['5','Session','SIP, RTP — session setup and teardown'],
       ['4','Transport','TCP, UDP — ports, reliability, flow control'],
       ['3','Network','IP, ICMP, ARP* — routing between networks'],
       ['2','Data Link','Ethernet, MAC, Switches, VLANs, STP'],
       ['1','Physical','Cables, hubs, air gap, physical hardware']]) +
    tip('ARP spans Layer 2 and 3 — it maps IP addresses (L3) to MAC addresses (L2).')
  },

  /* ── CLUSTER 2 — Core Protocols ── */
  'tcp': { title: 'TCP — Transmission Control Protocol', osi: 4, html:
    def('Connection-oriented protocol that guarantees reliable, ordered delivery of data. Uses a 3-way handshake (SYN → SYN-ACK → ACK) before data transmission.') +
    ports(['Various','Well-known ports use TCP for reliability']) +
    secure('Used by: HTTP, HTTPS, FTP, SMTP, SSH, RDP') +
    tip('TCP = reliable but slower. UDP = fast but no guarantee. Know which services use which.')
  },
  'udp': { title: 'UDP — User Datagram Protocol', osi: 4, html:
    def('Connectionless protocol. No handshake, no guarantee of delivery. Sends packets and hopes they arrive. Faster and lower latency than TCP.') +
    secure('Used by: DNS (port 53), DHCP, VoIP, RTP, TFTP, SNMP') +
    tip('UDP is preferred when speed matters more than reliability — streaming, gaming, VoIP. DNS uses UDP for queries but TCP for zone transfers.')
  },
  'ip': { title: 'IP — Internet Protocol', osi: 3, html:
    def('Responsible for addressing and routing packets across networks. IP is connectionless — it does not guarantee delivery, order, or error correction. IPv4 uses 32-bit addresses; IPv6 uses 128-bit.') +
    tip('IP provides addressing; TCP/UDP provide transport. Together they form the foundation of the internet.')
  },
  'icmp': { title: 'ICMP — Internet Control Message Protocol', osi: 3, html:
    def('Used for network diagnostics and error reporting. Not used to carry application data. Common tools: <code>ping</code> (tests reachability) and <code>traceroute</code> / <code>tracert</code> (maps network path).') +
    insecure('Can be used in ICMP flood (ping flood) DoS attacks. Many firewalls restrict ICMP at perimeter.') +
    tip('ICMP is Layer 3 — it works at the network level, not transport or application.')
  },
  'arp': { title: 'ARP — Address Resolution Protocol', osi: '2-3', html:
    def('Resolves IP addresses (Layer 3) to MAC addresses (Layer 2) on a local network segment. A device broadcasts "Who has IP x.x.x.x?" and the owner replies with its MAC address.') +
    insecure('ARP Poisoning: attacker sends fake ARP replies to associate their MAC with a legitimate IP — enables man-in-the-middle attacks on the LAN.') +
    tip('ARP spans Layer 2/3 — this is a common exam trick. ARP has no authentication, making it inherently vulnerable.')
  },
  'data-in-transit': { title: 'Data in Transit', osi: null, html:
    def('Data actively moving across a network between two endpoints. Protecting data in transit is one of the three data states (transit, rest, use). Unencrypted data in transit can be captured by packet sniffers.') +
    secure('Protected by: TLS (HTTPS, SMTPS, LDAPS), IPsec (VPN), SSH (SFTP, tunnels)') +
    insecure('Exposed by: HTTP, FTP, TFTP, SMTP (port 25), LDAP, Telnet, SNMP v1/v2') +
    tip('Any protocol without encryption sends data in cleartext — credentials, emails, and file contents are all visible to anyone with network access.')
  },

  /* ── CLUSTER 3 — DNS & Network Services ── */
  'dns-server': { title: 'DNS — Domain Name System', osi: 7, html:
    def('Translates human-readable domain names (e.g. google.com) to IP addresses. Uses a hierarchical distributed database. Queries typically use UDP port 53; zone transfers use TCP port 53.') +
    ports(['53 UDP','Queries'],['53 TCP','Zone transfers']) +
    table(['Record','Purpose'],
      [['A','Maps hostname → IPv4 address'],
       ['AAAA','Maps hostname → IPv6 address'],
       ['PTR','Reverse lookup: IP → hostname'],
       ['MX','Mail exchange server for a domain'],
       ['CNAME','Alias pointing to another hostname'],
       ['SOA','Start of Authority — zone metadata and primary NS']]) +
    insecure('DNS Poisoning: attacker injects false records into DNS cache, redirecting users to malicious IPs.') +
    secure('DNSSEC: digitally signs DNS records using public key cryptography. RRSIG is the digital signature record attached to each signed DNS entry.') +
    tip('Know all 6 record types and their purposes. DNS Poisoning → DNSSEC is a classic exam pairing.')
  },
  'dhcp': { title: 'DHCP — Dynamic Host Configuration Protocol', osi: 7, html:
    def('Automatically assigns IP addresses, subnet masks, default gateways, and DNS server addresses to clients. Uses a 4-step process: Discover → Offer → Request → Acknowledge (DORA).') +
    ports(['67 UDP','Server (receives client requests)'],['68 UDP','Client (receives offers)']) +
    insecure('DHCP Starvation: attacker exhausts IP pool with fake requests. Rogue DHCP: attacker runs unauthorized DHCP server to hand out malicious gateway/DNS.') +
    tip('DHCP runs on UDP — remember port 67 (server) and 68 (client).')
  },
  'ntp': { title: 'NTP — Network Time Protocol', osi: 7, html:
    def('Synchronizes clocks across network devices. Accurate time is critical for log correlation, Kerberos authentication (tickets expire), and certificate validity checks.') +
    ports(['123 UDP','NTP']) +
    tip('If NTP is compromised or clocks are skewed, Kerberos authentication fails. Time accuracy is a security control, not just an admin convenience.')
  },
  'ipv4': { title: 'IPv4', osi: 3, html:
    def('32-bit addressing scheme providing approximately 4.3 billion unique addresses. Addresses written in dotted-decimal notation (e.g., 192.168.1.1). Exhaustion of public IPv4 addresses drove adoption of NAT and IPv6.') +
    tip('IPv4 = 32-bit. IPv6 = 128-bit. DNS A record = IPv4. DNS AAAA record = IPv6.')
  },
  'rfc1918': { title: 'RFC 1918 — Private IP Address Ranges', osi: 3, html:
    def('Defines three ranges of IPv4 addresses reserved for private/internal use. These addresses are not routable on the public internet — NAT translates them to public IPs.') +
    table(['Range','CIDR','Common Use'],
      [['10.0.0.0–10.255.255.255','10.0.0.0/8','Large enterprise networks'],
       ['172.16.0.0–172.31.255.255','172.16.0.0/12','Medium networks'],
       ['192.168.0.0–192.168.255.255','192.168.0.0/16','Home/small office']]) +
    tip('RFC 1918 addresses must be NATted to reach the internet. Memorize all three ranges.')
  },
  'ipv6': { title: 'IPv6', osi: 3, html:
    def('128-bit addressing providing 3.4×10³⁸ unique addresses. Written in hexadecimal with colons (e.g., 2001:0db8::1). Eliminates the need for NAT. Includes built-in IPsec support.') +
    tip('IPv6 uses AAAA records in DNS. No broadcast — uses multicast instead. No NAT required due to massive address space.')
  },
  'unicast': { title: 'Unicast / Broadcast (IPv4 Addressing Methods)', osi: 3, html:
    def('<strong>Unicast:</strong> one-to-one communication — a packet sent from one specific source to one specific destination IP address.<br><br><strong>Broadcast:</strong> one-to-all communication — a packet sent to all devices on a subnet (e.g., 192.168.1.255). Broadcast is limited to a single broadcast domain; routers do not forward broadcasts.') +
    tip('VLANs create separate broadcast domains, limiting the scope of broadcast traffic and reducing congestion.')
  },

  /* ── CLUSTER 4 — Email Security ── */
  'mail-server': { title: 'Mail Server — Email Protocol Stack', osi: 7, html:
    def('A mail server handles sending and receiving of email. Outbound mail uses SMTP; inbound retrieval uses POP3 or IMAP. Email authentication relies on SPF, DKIM, and DMARC to prevent spoofing.') +
    table(['Protocol','Port','Purpose'],
      [['SMTP','25','Send email between servers (cleartext)'],
       ['SMTSP','465/587','SMTP with TLS encryption'],
       ['POP3','110','Download mail, deletes from server'],
       ['IMAP','143','Sync mail, stays on server'],
       ['IMAPS','993','IMAP over TLS']]) +
    tip('SPF + DKIM + DMARC work together. SPF checks sending IP, DKIM checks signature, DMARC sets the policy for failures.')
  },
  'smtp': { title: 'SMTP — Simple Mail Transfer Protocol', osi: 7, html:
    def('Used to send email between mail servers and from clients to servers. Operates in cleartext — usernames, passwords, and message content are all visible on the network.') +
    ports(['25','Server-to-server (cleartext)'],['587','Client submission (STARTTLS)'],['465','SMTPS (implicit TLS)']) +
    insecure('Port 25 sends everything in cleartext. Commonly blocked by ISPs to prevent spam relaying.') +
    secure('SMTSP/SMTPS: SMTP over TLS. Use port 587 (STARTTLS) or 465 (implicit TLS).') +
    tip('Port 25 = insecure server relay. Port 587 = secure client submission. Know both.')
  },
  'smtsp': { title: 'SMTSP — Secure SMTP', osi: 7, html:
    def('Encrypted and authenticated version of SMTP. Uses TLS to protect the connection, preventing eavesdropping and credential theft during email transmission.') +
    ports(['465','Implicit TLS (SMTPS)'],['587','STARTTLS (upgrade to TLS mid-session']) +
    secure('TLS-encrypted SMTP session — credentials and content are protected in transit.') +
    tip('The exam may call this SMTSP or SMTPS. Either way: SMTP + TLS = secure email sending.')
  },
  'pop3': { title: 'POP3 — Post Office Protocol v3', osi: 7, html:
    def('Downloads email from the mail server to the local client and typically deletes it from the server. Good for single-device use. Not ideal for multiple devices since mail is not synced.') +
    ports(['110','POP3 (cleartext)'],['995','POP3S (over TLS)']) +
    insecure('Port 110 transmits credentials and mail content in cleartext.') +
    tip('POP3 = downloads and removes from server. IMAP = syncs and keeps on server. Classic exam distinction.')
  },
  'imap': { title: 'IMAP — Internet Message Access Protocol', osi: 7, html:
    def('Allows email clients to access and manage mail directly on the server. Mail stays on the server and is synchronized across multiple devices — better for modern multi-device use than POP3.') +
    ports(['143','IMAP (cleartext)'],['993','IMAPS (over TLS)']) +
    tip('IMAP = syncs, stays on server. POP3 = downloads, removes from server. IMAP is preferred for mobile/multi-device users.')
  },
  'spf': { title: 'SPF — Sender Policy Framework', osi: 7, html:
    def('A DNS TXT record that lists all IP addresses authorized to send email on behalf of a domain. When a receiving server gets an email, it checks the sender\'s DNS for an SPF record to verify the sending IP is legitimate.') +
    tip('SPF stops email spoofing at the IP level. It lives in DNS as a TXT record. Failing SPF alone doesn\'t reject mail — DMARC decides the action.')
  },
  'dkim': { title: 'DKIM — DomainKeys Identified Mail', osi: 7, html:
    def('Adds a cryptographic digital signature to outgoing email headers. The receiving server fetches the sender\'s public key from DNS and verifies the signature. Proves the email was not tampered with in transit and originated from the claimed domain.') +
    tip('DKIM signs the message. SPF checks the sending server. DMARC enforces what happens when either fails.')
  },
  'dmarc': { title: 'DMARC — Domain-Based Message Authentication, Reporting, and Conformance', osi: 7, html:
    def('A policy published in DNS that tells receiving mail servers what to do when an email fails SPF and/or DKIM checks. Policies: <em>none</em> (monitor only), <em>quarantine</em> (send to spam), <em>reject</em> (block entirely). Also provides reporting back to the domain owner.') +
    tip('DMARC is the enforcement layer. SPF + DKIM collect evidence; DMARC decides the verdict. Know: none → quarantine → reject as escalating strictness.')
  },
  'email-gateway': { title: 'Email Gateway', osi: 7, html:
    def('A security appliance or service that sits inline between the internet and the internal mail server. Inspects all inbound and outbound email for spam, malware, phishing, and policy violations before delivery.') +
    secure('Enforces SPF/DKIM/DMARC checks, scans attachments for malware, blocks phishing URLs, and filters outbound data loss.') +
    tip('Email Gateway sits at the perimeter — it\'s the first and last line of defense for email traffic.')
  },

  /* ── CLUSTER 5 — Web & Encryption ── */
  'web-server': { title: 'Web Server (DMZ)', osi: 7, html:
    def('Hosts public-facing web applications. Placed in the DMZ so that if compromised, the attacker cannot immediately reach the internal LAN. Protected by HTTPS/TLS, WAF, and firewall ACLs.') +
    secure('HTTPS (port 443) + TLS 1.2/1.3 encrypts all traffic. WAF filters application-layer attacks (SQLi, XSS).') +
    insecure('HTTP (port 80) transmits everything in cleartext — never use for authenticated or sensitive content.')
  },
  'http': { title: 'HTTP — Hypertext Transfer Protocol', osi: 7, html:
    def('The foundation of web communication. Transfers web pages, APIs, and web content. All data is transmitted in cleartext — visible to anyone with network access between client and server.') +
    ports(['80','HTTP (cleartext)']) +
    insecure('Credentials, session cookies, and page content are fully exposed in transit. Never use for login or sensitive data.') +
    secure('HTTPS (port 443): HTTP wrapped in TLS — encrypts all content.') +
    tip('HTTP = cleartext = red. HTTPS = encrypted = green. Any exam scenario involving sensitive data over the web should use HTTPS.')
  },
  'https': { title: 'HTTPS — HTTP Secure', osi: 7, html:
    def('HTTP transmitted over a TLS-encrypted connection. The TLS handshake negotiates encryption before any HTTP data is sent, protecting headers, cookies, credentials, and page content from interception.') +
    ports(['443','HTTPS (TLS-encrypted)']) +
    secure('TLS 1.2 and 1.3 are current standards. TLS 1.3 is faster and eliminates legacy cipher suites.') +
    tip('HTTPS does not make a website secure — it only encrypts the connection. A phishing site can use HTTPS too. The padlock means encrypted, not trustworthy.')
  },
  'ssl': { title: 'SSL — Secure Sockets Layer (Deprecated)', osi: 6, html:
    def('The predecessor to TLS. SSL 2.0 and 3.0 are both deprecated and contain critical vulnerabilities. Should not be used in any modern system.') +
    insecure('SSL 3.0 → POODLE attack. SSL 2.0 → DROWN attack. Both allow decryption of encrypted traffic.') +
    secure('TLS 1.2 and TLS 1.3 are the current standards. TLS 1.0 and 1.1 are also deprecated.') +
    tip('"SSL" is still used colloquially (e.g., "SSL certificate") but the actual protocol is TLS. On the exam: SSL = deprecated, use TLS.')
  },
  'tls': { title: 'TLS — Transport Layer Security', osi: 6, html:
    def('The current standard for encrypting data in transit. TLS wraps application protocols (HTTP, SMTP, LDAP, etc.) to create encrypted tunnels. Operates via a handshake that negotiates cipher suites and authenticates the server via certificate.') +
    secure('TLS 1.2 — widely supported, current minimum. TLS 1.3 — faster handshake, removes legacy ciphers, most secure.') +
    insecure('TLS 1.0 and 1.1 are deprecated. SSL is deprecated.') +
    tip('TLS replaces SSL. TLS 1.3 is the gold standard. Know the deprecation chain: SSL → TLS 1.0 → TLS 1.1 → TLS 1.2 (acceptable) → TLS 1.3 (best).')
  },
  'ipsec': { title: 'IPsec — Internet Protocol Security', osi: 3, html:
    def('A suite of protocols that encrypts and authenticates IP packets. Operates at Layer 3, making it transparent to applications. Commonly used for VPN tunnels.') +
    table(['Mode','Description'],
      [['Tunnel mode','Encrypts entire IP packet (new IP header added) — used for site-to-site VPN'],
       ['Transport mode','Encrypts payload only, original IP header intact — used for host-to-host']]) +
    secure('Protocols: AH (Authentication Header) — integrity only. ESP (Encapsulating Security Payload) — encryption + integrity.') +
    tip('IPsec Tunnel mode = site-to-site VPN (entire packet encrypted). Transport mode = host-to-host (payload only). ESP provides encryption; AH does not.')
  },

  /* ── CLUSTER 6 — File Transfer ── */
  'ftp': { title: 'FTP — File Transfer Protocol', osi: 7, html:
    def('Transfers files between a client and server. Uses two channels: port 21 for commands (control) and port 20 for data transfer. All traffic including credentials is sent in cleartext.') +
    ports(['21','Control / commands'],['20','Data transfer (active mode)']) +
    insecure('Credentials and file contents fully visible in cleartext. No encryption whatsoever.') +
    secure('Replace with SFTP (port 22, uses SSH) or FTPS (port 990/21, uses TLS).') +
    tip('FTP uses TWO ports: 21 (control) and 20 (data). SFTP uses only port 22. They are completely different technologies despite the similar names.')
  },
  'tftp': { title: 'TFTP — Trivial File Transfer Protocol', osi: 7, html:
    def('A simplified file transfer protocol with no authentication, no encryption, and no directory listing. Designed for simple boot/config file transfers on trusted isolated networks. Uses UDP for speed.') +
    ports(['69','TFTP (UDP, no auth)']) +
    insecure('No authentication at all — anyone on the network can read or write files. Never use on untrusted networks.') +
    secure('If file transfer is needed: use SFTP (port 22, SSH-based) instead.') +
    tip('TFTP has NO authentication — it\'s the most insecure file transfer protocol. Common use: pushing firmware/config to network devices on an isolated management VLAN.')
  },
  'sftp': { title: 'SFTP — SSH File Transfer Protocol', osi: 7, html:
    def('A completely separate protocol from FTP — it is a file transfer subsystem of SSH, not FTP over SSL/TLS. All data is encrypted via the SSH session. Provides authentication, encryption, and directory operations.') +
    ports(['22','SFTP (runs over SSH)']) +
    secure('Full SSH encryption. Authenticates via password or SSH key pairs. Same port as SSH.') +
    tip('SFTP ≠ FTPS. SFTP runs over SSH (port 22). FTPS runs over TLS (port 990 implicit or 21 explicit). They look similar but are fundamentally different — this is a common exam trap.')
  },
  'ftps': { title: 'FTPS — FTP Secure (FTP over TLS)', osi: 7, html:
    def('FTP with TLS encryption added. FTPS is an extension of FTP — it adds TLS on top of the existing FTP protocol. Two modes: Implicit (port 990, TLS from the start) and Explicit (port 21, STARTTLS upgrades the connection).') +
    ports(['990','Implicit FTPS (TLS from connection start)'],['21','Explicit FTPS (STARTTLS upgrade)']) +
    secure('TLS encrypts credentials and file content.') +
    tip('FTPS = FTP + TLS. SFTP = SSH-based (different protocol entirely). Port 990 = implicit FTPS. Port 22 = SFTP. Know both for the exam.')
  },

  /* ── CLUSTER 7 — Remote Access ── */
  'ssh': { title: 'SSH — Secure Shell', osi: 7, html:
    def('Provides encrypted terminal access to remote systems. Replaced Telnet (port 23), which sent all data including passwords in cleartext. SSH encrypts the entire session including authentication.') +
    ports(['22','SSH']) +
    secure('Supports password auth and public key authentication (SSH keys — more secure than passwords).') +
    insecure('Replaced Telnet (port 23) — never use Telnet on any network.') +
    tip('SSH port 22 is also used by SFTP. Telnet (port 23) = cleartext = always replace with SSH. Know that OpenSSH is the most common implementation on Linux/Unix systems.')
  },
  'openssh': { title: 'OpenSSH', osi: 7, html:
    def('The open-source implementation of the SSH protocol suite. The default SSH client and server on Linux, macOS, and most Unix systems. Provides ssh (client), sshd (server), sftp, scp, and ssh-keygen utilities.') +
    secure('Supports RSA, ECDSA, and Ed25519 key pairs. Supports SSH tunneling and port forwarding.') +
    tip('OpenSSH is the reference implementation of SSH. On the exam, if you see SSH on Linux/Unix, it\'s almost certainly OpenSSH.')
  },
  'rdp': { title: 'RDP — Remote Desktop Protocol', osi: 7, html:
    def('Microsoft\'s proprietary protocol for GUI remote access to Windows systems. Transmits the full desktop environment over the network. High-value attack target due to credential-based access.') +
    ports(['3389','RDP']) +
    insecure('Exposed RDP is one of the most commonly exploited services. Vulnerable to: brute force, BlueKeep (CVE-2019-0708), credential stuffing.') +
    secure('Harden with: Network Level Authentication (NLA), firewall ACL to restrict source IPs, VPN requirement before RDP, MFA, account lockout policies.') +
    tip('RDP port 3389 on the internet = red flag. Restrict via firewall or require VPN first. Never expose RDP directly to the internet.')
  },
  'vpn': { title: 'VPN — Virtual Private Network', osi: 3, html:
    def('Creates an encrypted tunnel through an untrusted network (typically the internet), allowing remote users or sites to securely access internal resources as if directly connected.') +
    table(['Type','Description'],
      [['Site-to-site VPN','Connects two networks permanently (branch to HQ). Uses IPsec tunnel mode.'],
       ['Remote-access VPN','Connects individual users to the corporate network. Uses TLS or IPsec.'],
       ['Split-tunnel VPN','Only corporate traffic goes through VPN; other traffic goes direct to internet.'],
       ['Full-tunnel VPN','All traffic routes through the VPN gateway.']]) +
    tip('VPN encrypts the tunnel, not the data inside. If a user visits HTTP sites through VPN, that traffic is still cleartext inside the tunnel.')
  },
  'jump-server': { title: 'Jump Server (Jump Box)', osi: 7, html:
    def('A hardened, dedicated intermediary host in a secured zone. Administrators must connect to the jump server first, then use it to reach internal systems. Eliminates direct exposure of internal servers to the internet or user workstations.') +
    secure('Centralizes access logging and session recording. All admin activity passes through a single audited point. Reduces attack surface by limiting which systems are directly accessible.') +
    tip('Jump Server = Privileged Access Workstation (PAW) concept. The jump server is the ONLY path to sensitive internal systems — not a convenience, it\'s a security control.')
  },

  /* ── CLUSTER 8 — VoIP ── */
  'voip': { title: 'VoIP — Voice Over Internet Protocol', osi: 7, html:
    def('Technology for transmitting voice calls over IP networks instead of traditional telephone infrastructure. VoIP uses SIP for call signaling and RTP for actual audio transmission.') +
    tip('VoIP = application layer. SIP = session layer (setup/teardown). RTP = transport layer (media stream). SRTP = encrypted RTP.')
  },
  'sip': { title: 'SIP — Session Initiation Protocol', osi: 5, html:
    def('Signaling protocol that establishes, manages, and terminates VoIP and multimedia sessions. SIP handles call setup and teardown; the actual audio is carried by RTP/SRTP.') +
    ports(['5060','SIP (cleartext/UDP)'],['5061','SIPS (SIP over TLS)']) +
    insecure('SIP on port 5060 sends signaling in cleartext — call metadata and credentials exposed.') +
    secure('SIPS on port 5061 uses TLS for encrypted signaling.') +
    tip('SIP = Layer 5 (Session). It manages the session, not the data. RTP carries the actual voice data at Layer 4.')
  },
  'rtp': { title: 'RTP — Real-Time Transport Protocol', osi: 4, html:
    def('Carries the actual audio and video media streams during VoIP and multimedia calls. Uses UDP for low latency. RTP itself provides no encryption — media content is transmitted in cleartext.') +
    insecure('RTP streams can be captured and reconstructed to eavesdrop on calls.') +
    secure('SRTP: Secure RTP — adds AES encryption and HMAC-SHA1 authentication to protect the media stream.') +
    tip('RTP = the voice data. SIP = the call setup. SRTP = encrypted RTP. Know this flow: SIP setup → RTP media → SIP teardown.')
  },
  'srtp': { title: 'SRTP — Secure Real-Time Transport Protocol', osi: 4, html:
    def('An extension of RTP that adds AES encryption and message authentication (HMAC-SHA1) to protect voice/video media streams. Prevents eavesdropping and tampering of VoIP calls.') +
    secure('Encrypts RTP payload with AES. Provides integrity via HMAC-SHA1. Does not add significant latency.') +
    tip('SRTP is to RTP as HTTPS is to HTTP — the secure encrypted version. Use SRTP + SIPS together for fully secured VoIP.')
  },

  /* ── CLUSTER 9 — Directory Services ── */
  'directory-services': { title: 'Directory Services', osi: 7, html:
    def('A centralized database storing information about users, computers, groups, printers, and policies in a network. The most common implementation is Microsoft Active Directory (AD). Provides authentication and authorization for the entire organization.') +
    tip('Directory Services = the phone book of the network. Active Directory is the dominant implementation. LDAP is the protocol used to query it.')
  },
  'ldap': { title: 'LDAP — Lightweight Directory Access Protocol', osi: 7, html:
    def('The protocol used to query and modify directory services (like Active Directory). Uses a hierarchical tree structure: Domain → Organizational Unit (OU) → User/Computer objects. Cleartext by default.') +
    ports(['389','LDAP (cleartext)'],['636','LDAPS (over TLS)']) +
    insecure('Port 389 transmits credentials and directory queries in cleartext.') +
    secure('LDAPS (port 636): LDAP over TLS — encrypts the entire session.') +
    tip('LDAP = how you talk to Active Directory. Port 389 = insecure. Port 636 = secure (LDAPS). Classic port-pair exam question.')
  },
  'ldaps': { title: 'LDAPS — LDAP Secure (LDAP over TLS)', osi: 7, html:
    def('LDAP wrapped in a TLS connection. Encrypts all directory queries, authentication credentials, and responses. Should always be used instead of plain LDAP in production environments.') +
    ports(['636','LDAPS (TLS-encrypted)']) +
    secure('Full TLS encryption of all LDAP traffic. Requires a valid certificate on the directory server.') +
    tip('LDAP 389 → LDAPS 636. Same relationship as HTTP 80 → HTTPS 443. Memorize the port pair.')
  },

  /* ── CLUSTER 10 — Switch Hardening ── */
  'switch': { title: 'Switch (Layer 2)', osi: 2, html:
    def('A Layer 2 device that connects devices within the same LAN. Forwards frames based on destination MAC address using a MAC address table (CAM table). Unlike hubs, switches send frames only to the intended recipient port.') +
    table(['Hardening Control','Purpose'],
      [['Port Security','Limits MAC addresses per port'],
       ['MAC Filtering','Allows/blocks by MAC address'],
       ['BPDU Guard','Shuts port if BPDU received on edge port'],
       ['Disable unused ports','Reduces physical attack surface'],
       ['VLAN segmentation','Limits broadcast domain scope']]) +
    tip('Switch hardening = Port Security + BPDU Guard + MAC Filtering + disable unused ports. Know all four.')
  },
  'vlan': { title: 'VLAN — Virtual LAN', osi: 2, html:
    def('Logically segments a physical LAN into separate broadcast domains without requiring separate physical hardware. Devices on different VLANs cannot communicate without passing through a router or Layer 3 switch. Creates isolated network segments for different departments or security zones.') +
    secure('Key use: separating guest Wi-Fi, IoT devices, servers, and workstations onto different VLANs prevents lateral movement if one segment is compromised.') +
    tip('VLANs control East-West (lateral) traffic. A compromised device in VLAN 10 cannot directly reach devices in VLAN 20 — traffic must route through a firewall or L3 switch where ACLs can be applied.')
  },
  'port-security': { title: 'Port Security', osi: 2, html:
    def('A switch feature that limits the number of MAC addresses allowed to communicate through a specific switch port. If an unauthorized MAC address is detected, the port can be set to shut down, restrict traffic, or send an alert.') +
    secure('Prevents: unauthorized device connection, MAC flooding attacks (which fill the CAM table and force the switch to broadcast all traffic like a hub).') +
    tip('Port Security is configured per switch port. It limits MAC addresses, not IP addresses. Three violation modes: protect, restrict, shutdown.')
  },
  'mac-filter': { title: 'MAC Filtering', osi: 2, html:
    def('Allows or denies network access based on a device\'s hardware MAC address. Can be implemented on switches (per port) or wireless access points (per SSID).') +
    insecure('MAC addresses can be spoofed (cloned) — MAC filtering is a weak control, not a strong security measure on its own. It adds friction, not real security.') +
    tip('MAC filtering is "security through obscurity" when used alone. It\'s easily bypassed by MAC spoofing. Still a valid hardening layer but never rely on it as the sole control.')
  },
  'stp': { title: 'STP / Rapid STP — Spanning Tree Protocol', osi: 2, html:
    def('Prevents switching loops in networks with redundant switch paths. Without STP, broadcast frames would loop indefinitely (broadcast storm), consuming all bandwidth. STP elects a Root Bridge and blocks redundant paths, keeping only one active path.') +
    table(['Protocol','Description'],
      [['STP (802.1D)','Original — slow convergence (30–50 seconds)'],
       ['Rapid STP (802.1w)','Faster convergence (1–2 seconds) — use this'],
       ['BPDU','Bridge Protocol Data Unit — messages switches use to communicate STP info'],
       ['Edge Port','Port connected to an end device, not another switch'],
       ['BPDU Guard','Shuts edge port immediately if BPDU received (rogue switch protection)']]) +
    tip('BPDU Guard protects edge ports from rogue switch attacks. Rapid STP replaced STP — know which is faster.')
  },
  'bpdu-guard': { title: 'BPDU Guard', osi: 2, html:
    def('A switch security feature that immediately disables (err-disables) an edge port if it receives a BPDU (Bridge Protocol Data Unit). Edge ports are connected to end devices (PCs, printers) and should never receive BPDUs — only switches send BPDUs.') +
    secure('Prevents: rogue switch attacks where an attacker plugs in a switch to manipulate STP topology and intercept traffic.') +
    tip('BPDU Guard = protection against rogue switches. Enable it on all access/edge ports. If a port receives a BPDU, something is wrong — shut it down immediately.')
  },

  /* ── CLUSTER 11 — Router Hardening ── */
  'router': { title: 'Router (Layer 3)', osi: 3, html:
    def('Forwards packets between different networks based on destination IP address. Routers connect network segments and make routing decisions using routing tables. They do not forward broadcast traffic.') +
    table(['Hardening Control','Purpose'],
      [['ACLs','Permit/deny traffic based on IP and port'],
       ['Implicit Deny','Block all unmatched traffic by default'],
       ['Disable unused services','Reduce attack surface'],
       ['SNMP v3 only','Encrypted management protocol'],
       ['Route authentication','Prevent routing table manipulation']]) +
    cli('route          # show routing table (Linux)\nroute print    # show routing table (Windows)\nroute add <dst> mask <mask> <gw>  # add static route') +
    tip('Routers separate broadcast domains (unlike switches). ACLs on routers filter inter-network traffic.')
  },
  'acl': { title: 'ACL — Access Control List', osi: 3, html:
    def('An ordered list of permit/deny rules applied to network traffic on a router or firewall interface. Each rule specifies: protocol, source IP, destination IP, and port. Rules are evaluated top-to-bottom — first match wins.') +
    table(['Field','Description'],
      [['Permission','Permit or Deny'],
       ['Protocol','TCP, UDP, ICMP, IP (any)'],
       ['Source','Source IP address / range'],
       ['Destination','Destination IP address / range'],
       ['Port','Destination port number (e.g., 80, 443)']]) +
    secure('Implicit Deny: an invisible "deny all" rule at the end of every ACL. If no rule matches, traffic is blocked.') +
    tip('ACL rules are processed top-to-bottom. Put specific rules before general ones. The implicit deny at the end blocks everything not explicitly permitted.')
  },
  'implicit-deny': { title: 'Implicit Deny', osi: 3, html:
    def('The default behavior at the end of every ACL — if no rule explicitly permits traffic, it is denied. This rule is not written but is always present. It is the foundational principle of least privilege in network access control.') +
    tip('"Implicit deny" means the deny rule is implied/invisible but absolutely real. If you forget to add a permit rule, traffic is blocked. Always write ACLs with the implicit deny in mind — add only what you need to allow.')
  },
  'snmpv1': { title: 'SNMP v1 / v2 (Insecure)', osi: 7, html:
    def('Simple Network Management Protocol versions 1 and 2. Used to monitor and manage network devices (routers, switches, servers). Both versions use community strings (like passwords) for authentication, but transmit them in cleartext.') +
    ports(['161 UDP','SNMP agent (queries)'],['162 UDP','SNMP trap (alerts)']) +
    insecure('Community strings sent in cleartext. Default community strings ("public" for read, "private" for write) are well-known and often unchanged.') +
    secure('Use SNMP v3 — the only version with authentication (MD5/SHA) AND encryption (AES/DES).') +
    tip('SNMP v1 and v2 = cleartext community strings = insecure. SNMP v3 = auth + encryption = secure. Only SNMP v3 is acceptable in production.')
  },
  'snmpv3': { title: 'SNMP v3 — Secure Network Management', osi: 7, html:
    def('The only version of SNMP with both authentication and encryption. Replaces the insecure community string model with user-based security providing message integrity, authentication, and privacy.') +
    ports(['161 UDP','SNMP queries'],['162 UDP','SNMP traps']) +
    secure('Authentication: MD5 or SHA (verify message source). Encryption: AES or DES (protect content). Integrity: prevents tampering.') +
    tip('SNMP v3 is the ONLY version with authentication AND encryption. The exam will ask this. v1 and v2 use cleartext community strings — never acceptable for production use.')
  },

  /* ── CLUSTER 12 — Firewalls ── */
  'firewall': { title: 'Firewall', osi: 3, html:
    def('A security device that monitors and controls incoming and outgoing network traffic based on defined rules. Acts as the enforcement point between network zones. Can be hardware appliance, software, or cloud-based.') +
    table(['Type','Description'],
      [['Host-based','Software on individual host — controls that host\'s traffic only (e.g., Windows Firewall)'],
       ['Network-based','Dedicated hardware at network boundary — protects entire network segment'],
       ['Software-based','Runs on general-purpose hardware — flexible but slower than dedicated appliance'],
       ['Stateless','Filters by fixed rules only — fast, no session awareness'],
       ['Stateful','Tracks connection state — blocks unsolicited inbound packets'],
       ['WAF','HTTP/HTTPS-specific — protects web applications (SQLi, XSS)'],
       ['NGFW','Stateful + DPI + App awareness + IPS + identity rules']]) +
    tip('Know each firewall type and its use case. Stateless = fast, dumb. Stateful = smart, tracks sessions. NGFW = everything plus application intelligence.')
  },
  'waf': { title: 'WAF — Web Application Firewall', osi: 7, html:
    def('A firewall that operates at Layer 7 specifically for HTTP/HTTPS traffic. Sits in front of web applications and filters requests based on application-layer rules. Protects against: SQL injection, cross-site scripting (XSS), CSRF, directory traversal, and other OWASP Top 10 attacks.') +
    secure('Can operate in: Positive model (allow only known-good patterns) or Negative model (block known-bad signatures).') +
    tip('WAF is application-aware — it understands HTTP requests and responses, not just ports and IPs. A regular firewall cannot stop SQLi; a WAF can.')
  },
  'ngfw': { title: 'NGFW — Next-Generation Firewall', osi: 7, html:
    def('Combines traditional stateful firewall capabilities with deep packet inspection, application identification, intrusion prevention (IPS), TLS inspection, and identity-based policies. Can make access decisions based on user identity, not just IP address.') +
    secure('Features: Stateful inspection + Deep Packet Inspection (DPI) + Application awareness + IPS + User/identity-based rules + TLS/SSL inspection.') +
    tip('NGFW = stateful firewall + IPS + application control + identity awareness. It\'s the most capable firewall type. Use when you need to control by application or user, not just port/IP.')
  },
  'utm': { title: 'UTM — Unified Threat Management', osi: 7, html:
    def('A single appliance that combines multiple security functions: firewall, IDS/IPS, antivirus, content filtering, spam filtering, and VPN. Simplifies management by consolidating tools — but a single point of failure for all security functions.') +
    tip('UTM = one box, many functions. Simpler to manage but creates a single point of failure. NGFW is the modern evolution. The exam may distinguish them: UTM = bundled, NGFW = next-gen capabilities.')
  },
  'fail-modes': { title: 'Firewall Failure Modes', osi: null, html:
    def('Defines how a firewall behaves when it experiences a hardware or software failure.') +
    table(['Mode','Behavior','Priority'],
      [['Fail-open','Traffic flows through if firewall fails','Availability over Security'],
       ['Fail-closed','All traffic blocked if firewall fails','Security over Availability']]) +
    tip('"Fail-open = available but unsafe. Fail-closed = secure but potentially disruptive." Know which to recommend: high-security environments (finance, healthcare) → fail-closed. High-availability requirements → fail-open. The exam will give you a scenario.')
  },

  /* ── CLUSTER 13 — Network Zones ── */
  'screened-subnet': { title: 'Screened Subnet / DMZ', osi: null, html:
    def('A subnet placed between two firewalls — one facing the internet, one facing the internal LAN. Also called a DMZ (Demilitarized Zone). Hosts public-facing services (web, mail, DNS) in a partially trusted zone isolated from the internal network.') +
    secure('If an attacker compromises a DMZ server, they still face an internal firewall before reaching the LAN.') +
    tip('"Screened subnet" and "DMZ" are used interchangeably on the exam. The key is two firewalls with a buffer zone between them.')
  },
  'dmz-zone': { title: 'DMZ — Demilitarized Zone', osi: null, html:
    def('A network zone that sits between the internet-facing perimeter firewall and the internal network firewall. Hosts services that must be accessible from the internet (web servers, mail servers, DNS servers) while limiting attacker access to the internal LAN.') +
    tip('DMZ = partially trusted zone. Internet = untrusted. Intranet = trusted. A CA placed in the DMZ provides certificates to public services.')
  },
  'attack-surface': { title: 'Attack Surface', osi: null, html:
    def('The total sum of all exposure points where an attacker could attempt to enter, extract data from, or disrupt a system or network. Includes: open ports, running services, user accounts, APIs, physical access points, and unpatched software.') +
    secure('Reduce attack surface by: closing unused ports, disabling unused services, removing unnecessary software, applying least privilege, and network segmentation.') +
    tip('Smaller attack surface = fewer ways in. Every open port, active service, and user account is part of the attack surface.')
  },
  'intranet': { title: 'Intranet', osi: null, html:
    def('A private internal network accessible only to authorized users within an organization. Uses internet technologies (HTTP, DNS) but is not accessible from the public internet. The trusted zone in network segmentation.') +
    tip('Intranet = internal, trusted. Extranet = shared with external partners, semi-trusted. Internet = public, untrusted.')
  },
  'extranet': { title: 'Extranet', osi: null, html:
    def('A controlled private network that grants limited access to external parties (partners, vendors, suppliers, customers). Sits between the fully trusted intranet and the untrusted internet. Often implemented as a segmented zone or via VPN.') +
    tip('Extranet is semi-trusted. It extends a portion of the intranet to external partners with restricted access. Not the same as the internet.')
  },
  'east-west': { title: 'East-West Traffic (Horizontal Traffic)', osi: null, html:
    def('Network traffic that moves laterally between systems within the same network — server to server, workstation to workstation. Contrast with North-South traffic (between internal network and internet/external).') +
    insecure('Traditional perimeter security only inspects North-South traffic. Attackers who breach the perimeter can move laterally (East-West) without being detected.') +
    secure('Zero Trust and micro-segmentation inspect East-West traffic, limiting lateral movement after a breach.') +
    tip('East-West = lateral movement risk. Zero Trust controls East-West. VLANs limit East-West blast radius. This is key to modern security architecture.')
  },
  'ca': { title: 'CA — Certificate Authority', osi: 7, html:
    def('An entity that issues, manages, and revokes digital certificates. Acts as the root of trust for Public Key Infrastructure (PKI). Browsers and operating systems ship with a list of trusted root CAs. TLS/HTTPS, code signing, and email encryption all rely on CA-issued certificates.') +
    secure('Certificates bind a public key to an identity, verified by the CA\'s signature.') +
    tip('The CA\'s job is to vouch for identity. If a CA is compromised, every certificate it issued becomes untrustworthy. Root CA compromise = catastrophic. Intermediate CAs add a layer of protection.')
  },

  /* ── CLUSTER 14 — NAT ── */
  'nat': { title: 'NAT — Network Address Translation', osi: 3, html:
    def('Translates private (RFC 1918) IP addresses to public IP addresses, allowing multiple internal devices to share one or more public IPs. Performed by the router or firewall at the network boundary.') +
    table(['Type','Description'],
      [['Static NAT','One private IP ↔ one public IP (1:1). Used for servers needing a consistent public IP.'],
       ['Dynamic NAT','Pool of public IPs assigned on demand. Many private → pool of public IPs.'],
       ['PAT (NAT Overload)','Many private IPs → one public IP, differentiated by port numbers. What home routers do.']]) +
    tip('When people say "NAT," they almost always mean PAT. PAT uses port numbers to track many connections through one public IP.')
  },
  'nat-gateway': { title: 'NAT Gateway', osi: 3, html:
    def('The device (typically router or firewall) that performs NAT. Maintains a translation table mapping internal private IP:port combinations to external public IP:port combinations.') +
    tip('The NAT Gateway is the device that does the translating. It\'s where RFC 1918 private IPs become public IPs for internet communication.')
  },
  'pat': { title: 'PAT — Port Address Translation', osi: 3, html:
    def('Also called NAT Overload. Maps many internal private IP addresses to a single public IP address, differentiated by unique port numbers. This is what home routers and most enterprise NAT implementations actually do.') +
    tip('"NAT" in everyday use usually means PAT. The exam may test the distinction. PAT = many-to-one using port numbers. Static NAT = one-to-one. Dynamic NAT = many-to-pool.')
  },
  'static-nat': { title: 'Static NAT', osi: 3, html:
    def('A permanent one-to-one mapping between a single private IP and a single public IP. Used when an internal server must always be reachable at a consistent public IP address (e.g., a web server in the DMZ).') +
    tip('Static NAT = 1:1. The public IP is dedicated to one host. Used for DMZ servers that must receive inbound connections from the internet.')
  },
  'dynamic-nat': { title: 'Dynamic NAT', osi: 3, html:
    def('Maps internal private IPs to a pool of available public IPs on demand. When an internal device needs internet access, it is assigned an available public IP from the pool. Less common than PAT in modern networks.') +
    tip('Dynamic NAT = many-to-pool (but still 1:1 at any given moment). Not the same as PAT (many-to-one). Dynamic NAT can fail if the public IP pool is exhausted.')
  },

  /* ── CLUSTER 15 — SCADA / Air Gap ── */
  'scada': { title: 'SCADA — Supervisory Control and Data Acquisition', osi: null, html:
    def('Industrial control systems used to manage critical infrastructure: power grids, water treatment plants, oil pipelines, manufacturing facilities, and transportation systems. Historically designed for reliability and uptime, not cybersecurity.') +
    insecure('SCADA systems were designed before internet connectivity was common. Many run legacy OSes (Windows XP), lack encryption, and were never designed to resist cyberattacks.') +
    secure('Best practice: air-gap SCADA networks from all external connectivity. Implement strict physical access controls.') +
    tip('SCADA = critical infrastructure = extremely high-impact target. Air gap is the strongest isolation control. Stuxnet (2010) demonstrated that even air-gapped SCADA systems can be compromised via USB.')
  },
  'air-gap': { title: 'Air Gap', osi: 1, html:
    def('A physical isolation technique where a system or network has absolutely no wired or wireless network connections to any other network. The "gap" is literal — no cable, no Wi-Fi, no Bluetooth can bridge to external networks.') +
    secure('Strongest form of network isolation. Eliminates remote network-based attack vectors entirely.') +
    insecure('Does not eliminate all attack vectors: physical access, USB drives, malicious insiders, and electromagnetic emanations can still be used.') +
    tip('Air gap = no network connection at all. It\'s a physical Layer 1 control. The dashed border on the SCADA zone in this diagram represents the air gap visually.')
  },
  'air-gapped-system': { title: 'Air-Gapped System', osi: 1, html:
    def('A computer or network that is completely isolated from all unsecured networks through physical separation. No path exists (wired or wireless) to untrusted networks.') +
    tip('Air-gapped systems are used for: classified military networks, nuclear control systems, SCADA, and financial trading infrastructure. The isolation IS the security control.')
  },
  'physical-isolation': { title: 'Physical Isolation', osi: 1, html:
    def('Separating a system from all network connectivity at the hardware level. Broader concept than air gap — includes keeping systems in locked rooms, removing network interfaces, and controlling physical access.') +
    secure('Combines with: locked server rooms, cable management, port blocking, and guard/access controls.') +
    tip('Physical isolation is a Layer 1 control. No software firewall can substitute for physically disconnecting a system from a network.')
  },

  /* ── CLUSTER 16 — Network Appliances & Proxy ── */
  'proxy': { title: 'Proxy Server', osi: 7, html:
    def('An intermediary server that sits between clients and the internet (or between clients and servers). Clients send requests to the proxy, which forwards them on the client\'s behalf. Hides client identity from the destination server.') +
    table(['Type','Description'],
      [['Forward Proxy','Client-side — controls/monitors outbound user traffic. Provides caching and content filtering.'],
       ['Reverse Proxy','Server-side — sits in front of backend servers. Protects servers, provides load balancing and caching.']]) +
    tip('Forward proxy = protects clients / controls outbound. Reverse proxy = protects servers / handles inbound. Classic exam distinction.')
  },
  'forward-proxy': { title: 'Forward Proxy Server', osi: 7, html:
    def('Sits between internal clients and the internet. Internal users send requests to the forward proxy, which fetches content on their behalf. Provides: caching (stores frequently accessed content locally to reduce bandwidth), content filtering (blocks categories of websites by policy), and anonymity (hides internal client IPs).') +
    secure('Enforces acceptable use policies. Logs all outbound web requests for audit. Can perform TLS inspection to scan encrypted traffic.') +
    tip('Forward proxy = faces outward, serves clients. Think: "I want to block employees from social media" → deploy a forward proxy.')
  },
  'reverse-proxy': { title: 'Reverse Proxy', osi: 7, html:
    def('Sits in front of backend web servers and handles all inbound requests from the internet. The client interacts with the reverse proxy, which distributes requests to backend servers. Protects server identities, provides load balancing, TLS termination, and caching.') +
    secure('Hides backend server IPs. Provides load balancing, SSL/TLS offloading, and WAF capability. Clients never directly reach backend servers.') +
    tip('Reverse proxy = faces inward, serves servers. Think: "I want to protect my web server farm" → deploy a reverse proxy. CDN services (Cloudflare, Akamai) are large-scale reverse proxies.')
  },

  /* ── CLUSTER 17 — Zero Trust ── */
  'implicit-trust': { title: 'Implicit Trust (Legacy Model)', osi: null, html:
    def('The traditional network security assumption that users and devices inside the network perimeter are trusted. Once a user is inside the network (via VPN or physical access), they are treated as trusted and can access many internal resources freely.') +
    insecure('Implicit trust is the root cause of lateral movement attacks. A single compromised internal account can reach many systems because "they\'re inside the network."') +
    secure('Zero Trust eliminates implicit trust — every access request must be authenticated, authorized, and verified regardless of network location.') +
    tip('"Never trust, always verify" is the zero trust mantra. Implicit trust = the old model. Zero trust = the new model.')
  },
  'ztna': { title: 'ZTNA — Zero Trust Network Access', osi: 7, html:
    def('Technology implementing zero trust principles for application access. Instead of connecting users to a network (like VPN), ZTNA connects users to specific applications after verifying identity, device health, and context. Users cannot see or access applications they\'re not authorized for.') +
    secure('Application-level access control. Device posture checking. Continuous authentication.') +
    tip('ZTNA replaces VPN in zero trust architectures. VPN gives network access; ZTNA gives application access. Much narrower and more secure.')
  },
  'pep': { title: 'PEP — Policy Enforcement Point', osi: null, html:
    def('The gateway that enforces access decisions made by the Policy Engine. The subject\'s requests pass through the PEP, which allows or blocks based on the PE/PA\'s decision. The PEP is in the data path — all traffic flows through it.') +
    tip('PEP = enforces. PE = decides. PA = communicates the decision. Control Plane = PE + PA. Data Plane = where PEP operates. This is the most-tested Zero Trust architecture component.')
  },
  'pe': { title: 'Policy Engine (PE)', osi: null, html:
    def('The brain of the zero trust architecture. Evaluates access requests against policy rules and signals (user identity, device health, location, time, behavioral analytics) to make an allow or deny decision. Can use AI/ML to detect anomalies.') +
    tip('Control Plane = PE + PA. The PE decides; the PA communicates that decision to the PEP. Remember: "Engine = decision maker."')
  },
  'pa': { title: 'Policy Administrator (PA)', osi: null, html:
    def('Communicates the Policy Engine\'s access decision to the Policy Enforcement Point. Acts as the translator between the control plane\'s decision and the enforcement action at the PEP. Manages session tokens and credentials for approved access.') +
    tip('PA = the messenger between PE (decision) and PEP (enforcement). Control Plane = PE + PA together.')
  },
  'control-plane': { title: 'Control Plane (Zero Trust)', osi: null, html:
    def('The part of the Zero Trust architecture that manages and enforces security policy. Contains the Policy Engine (makes decisions) and Policy Administrator (communicates decisions). Does not carry application data — only manages access decisions.') +
    tip('"Control Plane = decides. Data Plane = transmits." This is the most-tested Zero Trust concept on the exam.')
  },
  'data-plane': { title: 'Data Plane (Zero Trust)', osi: null, html:
    def('The path through which actual application data flows between the subject and the enterprise resource, once access has been granted by the control plane. The PEP sits in the data plane.') +
    tip('"Data Plane = transmits. Control Plane = decides." Data flows through the data plane. Policy enforcement happens through the PEP, which sits in the data plane.')
  },
  'adaptive-id': { title: 'Adaptive Identity Authorization', osi: null, html:
    def('Continuously evaluates identity signals beyond the initial login — including device health, geographic location, time of access, behavioral patterns, and risk score — to adapt access decisions in real time. High-risk signals can trigger step-up authentication or revoke access mid-session.') +
    tip('Adaptive Identity = zero trust\'s continuous verification in practice. Not just "who are you at login" but "are you still behaving normally throughout the session."')
  },
  'sase': { title: 'SASE — Secure Access Service Edge', osi: null, html:
    def('A cloud-delivered architecture that converges networking (SD-WAN) and security (ZTNA, CASB, FWaaS, SWG) into a single unified service. Security travels with the user regardless of location — no need to backhaul traffic to a data center.') +
    table(['Component','Description'],
      [['ZTNA','Zero Trust Network Access — replaces VPN'],
       ['CASB','Cloud Access Security Broker — controls cloud app usage'],
       ['FWaaS','Firewall as a Service — cloud-based perimeter firewall'],
       ['SWG','Secure Web Gateway — web proxy and content filtering'],
       ['SD-WAN','Software-defined WAN — intelligent traffic routing']]) +
    tip('SASE = Zero Trust + cloud delivery. Security moves to the edge, not the data center. Gartner coined the term in 2019.')
  },
  'subject': { title: 'Subject (Zero Trust)', osi: null, html:
    def('The entity requesting access to an enterprise resource in a Zero Trust model. Can be a human user, an IoT device, a service account, or an automated process. The subject\'s identity, device health, and context are all evaluated before access is granted.') +
    tip('In Zero Trust: Subject → PEP → Enterprise Resource. The subject must be verified every time, even if they were verified 5 minutes ago.')
  },
  'resource': { title: 'Enterprise Resource', osi: null, html:
    def('The application, data set, service, or system that the subject is trying to access. In Zero Trust, resources are hidden from unauthorized users — they cannot even discover that the resource exists until they are authorized.') +
    tip('Enterprise Resources are protected by the PEP. Unlike VPN (which exposes the whole network), ZTNA only exposes the specific resource the user is authorized to access.')
  },

  /* ── Additional zone/concept nodes ── */
  'nat-gateway': { title: 'NAT Gateway', osi: 3, html:
    def('The device (typically router or firewall at the perimeter) that performs NAT/PAT. Maintains a translation table mapping internal private IP:port to external public IP:port for all active connections.') +
    tip('The NAT Gateway is where RFC 1918 private IPs become public IPs. It\'s typically the edge router or firewall.')
  },
};

/* ═══════════════════════════════════════════════════════
   SVG ARROW ENGINE
═══════════════════════════════════════════════════════ */

/** Get centre of a node chip relative to the canvas scroll container */
function nodeCenter(id) {
  const el = document.querySelector(`[data-node-id="${id}"]`);
  if (!el) return null;
  const canvas = document.getElementById('canvas');
  const cr = canvas.getBoundingClientRect();
  const nr = el.getBoundingClientRect();
  return {
    x: nr.left - cr.left + nr.width  / 2,
    y: nr.top  - cr.top  + nr.height / 2 + canvas.scrollTop
  };
}

/** Get top-centre of a node (for arrows arriving at a node) */
function nodeTop(id) {
  const el = document.querySelector(`[data-node-id="${id}"]`);
  if (!el) return null;
  const canvas = document.getElementById('canvas');
  const cr = canvas.getBoundingClientRect();
  const nr = el.getBoundingClientRect();
  return {
    x: nr.left - cr.left + nr.width / 2,
    y: nr.top  - cr.top  + canvas.scrollTop
  };
}

/** Draw a curved animated arrow between two points */
function drawArrow(svg, p1, p2, opts) {
  if (!p1 || !p2) return;
  const { color, marker, label, dashArray, animName, animDur, bend } = opts;

  // control point for quadratic curve (adds slight arc)
  const bx = bend || 0;
  const mx = (p1.x + p2.x) / 2 + bx;
  const my = (p1.y + p2.y) / 2 - 30;

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const d = `M ${p1.x} ${p1.y} Q ${mx} ${my} ${p2.x} ${p2.y}`;
  path.setAttribute('d', d);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-dasharray', dashArray || '7,4');
  path.setAttribute('marker-end', `url(#${marker})`);
  if (animName) {
    path.style.animation = `${animName} ${animDur || '0.9s'} linear infinite`;
  }
  svg.appendChild(path);

  // label at midpoint
  if (label) {
    const tx = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tx.setAttribute('x', mx);
    tx.setAttribute('y', my - 6);
    tx.setAttribute('text-anchor', 'middle');
    tx.setAttribute('class', 'svg-arrow-label');
    tx.setAttribute('fill', color);
    // dark background rect
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const pad = 4;
    // We append text first to measure, then add rect before it
    tx.textContent = label;
    svg.appendChild(tx);
    try {
      const bb = tx.getBBox();
      bg.setAttribute('x',      bb.x - pad);
      bg.setAttribute('y',      bb.y - pad);
      bg.setAttribute('width',  bb.width  + pad * 2);
      bg.setAttribute('height', bb.height + pad * 2);
      bg.setAttribute('rx', '3');
      bg.setAttribute('fill', '#07090f');
      bg.setAttribute('fill-opacity', '0.82');
      svg.insertBefore(bg, tx);
    } catch(e) { /* getBBox can fail before paint */ }
  }
}

/** Remove all dynamic SVG children (keep <defs>) */
function clearSVG() {
  const svg = document.getElementById('overlay-svg');
  [...svg.children].forEach(c => { if (c.tagName !== 'defs') c.remove(); });
}

function redrawOverlay() {
  if (activeOverlay) drawOverlayArrows(activeOverlay);
}

/* ═══════════════════════════════════════════════════════
   OVERLAY DEFINITIONS
═══════════════════════════════════════════════════════ */

const ATTACK_ARROWS = [
  { from: 'attack-surface', to: 'dns-server',    label: 'DNS Poisoning',          bend:  40 },
  { from: 'attack-surface', to: 'arp',            label: 'ARP Poisoning',          bend: -40 },
  { from: 'attack-surface', to: 'http',           label: 'Packet Sniffing',        bend:  20 },
  { from: 'attack-surface', to: 'ftp',            label: 'Credential Theft',       bend: -20 },
  { from: 'attack-surface', to: 'rdp',            label: 'Brute Force',            bend:  60 },
  { from: 'attack-surface', to: 'mail-server',    label: 'Phishing / Spoofing',    bend: -60 },
  { from: 'attack-surface', to: 'snmpv1',         label: 'Community String Sniff', bend:  30 },
  { from: 'attack-surface', to: 'ldap',           label: 'Cleartext Bind',         bend: -30 },
];

const UPGRADE_ARROWS = [
  { from: 'ftp',    to: 'sftp',    label: 'Use SSH tunnel'  },
  { from: 'ftp',    to: 'ftps',    label: 'Add TLS'         },
  { from: 'tftp',   to: 'sftp',    label: 'Use SFTP instead', bend: 50 },
  { from: 'http',   to: 'https',   label: 'Wrap in TLS'    },
  { from: 'ssl',    to: 'tls',     label: 'Deprecated → TLS' },
  { from: 'smtp',   to: 'smtsp',   label: 'Add TLS'         },
  { from: 'ldap',   to: 'ldaps',   label: 'Port 389 → 636'  },
  { from: 'rtp',    to: 'srtp',    label: 'Add AES'         },
  { from: 'snmpv1', to: 'snmpv3',  label: 'v1/v2 → v3'     },
];

function drawOverlayArrows(type) {
  clearSVG();
  const svg = document.getElementById('overlay-svg');

  if (type === 'attack') {
    ATTACK_ARROWS.forEach(a => {
      drawArrow(svg, nodeCenter(a.from), nodeTop(a.to), {
        color:     '#e74c3c',
        marker:    'arrow-red',
        label:     a.label,
        dashArray: '7,4',
        animName:  'dash-attack',
        animDur:   '0.85s',
        bend:      a.bend || 0,
      });
    });
  }

  if (type === 'upgrade') {
    UPGRADE_ARROWS.forEach(a => {
      drawArrow(svg, nodeCenter(a.from), nodeTop(a.to), {
        color:     '#3498db',
        marker:    'arrow-blue',
        label:     a.label,
        dashArray: '5,3',
        animName:  'dash-upgrade',
        animDur:   '1.1s',
        bend:      a.bend || 0,
      });
    });
  }

  // Defense overlay uses CSS glow only (no SVG arrows needed — handled by body class)
}

/* ═══════════════════════════════════════════════════════
   OVERLAY TOGGLES
═══════════════════════════════════════════════════════ */
function toggleOverlay(name) {
  const btnMap   = { attack:'btn-attack', defense:'btn-defense', upgrade:'btn-upgrade' };
  const cssClass = { attack:'active-red', defense:'active-green', upgrade:'active-blue' };
  const bodyClass= { attack:'overlay-attack', defense:'overlay-defense', upgrade:'overlay-upgrade' };

  if (activeOverlay === name) {
    document.getElementById(btnMap[name]).classList.remove(cssClass[name]);
    document.body.classList.remove(bodyClass[name]);
    clearSVG();
    activeOverlay = null;
  } else {
    if (activeOverlay) {
      document.getElementById(btnMap[activeOverlay]).classList.remove(cssClass[activeOverlay]);
      document.body.classList.remove(bodyClass[activeOverlay]);
    }
    activeOverlay = name;
    document.getElementById(btnMap[name]).classList.add(cssClass[name]);
    document.body.classList.add(bodyClass[name]);
    // slight delay so DOM has settled after class changes
    setTimeout(() => drawOverlayArrows(name), 50);
  }
}

/* ═══════════════════════════════════════════════════════
   ZERO TRUST TOGGLE
═══════════════════════════════════════════════════════ */
function toggleZeroTrust() {
  ztActive = !ztActive;
  const btn     = document.getElementById('btn-zt');
  const diagram = document.getElementById('zt-diagram');
  const canvas  = document.getElementById('canvas');
  if (ztActive) {
    btn.style.cssText = 'border-color:var(--teal);color:var(--teal);background:rgba(26,188,156,0.1)';
    diagram.classList.add('visible');
    canvas.classList.add('zt-active');
  } else {
    btn.style.cssText = '';
    diagram.classList.remove('visible');
    canvas.classList.remove('zt-active');
  }
}

/* ═══════════════════════════════════════════════════════
   LINKEDIN VIEW
═══════════════════════════════════════════════════════ */
function toggleLinkedIn() {
  linkedInActive = !linkedInActive;
  const btn = document.getElementById('btn-linkedin');
  if (linkedInActive) {
    // Close detail panel and any active overlays for a clean screenshot
    closeDetail();
    clearSVG();
    document.body.classList.remove('overlay-attack','overlay-defense','overlay-upgrade');
    if (activeOverlay) {
      const btnMap = { attack:'btn-attack', defense:'btn-defense', upgrade:'btn-upgrade' };
      const cssClass = { attack:'active-red', defense:'active-green', upgrade:'active-blue' };
      document.getElementById(btnMap[activeOverlay]).classList.remove(cssClass[activeOverlay]);
      activeOverlay = null;
    }
    document.body.classList.add('linkedin-mode');
    btn.textContent = '← Back to Study Mode';
    btn.classList.add('active-linkedin');
  } else {
    document.body.classList.remove('linkedin-mode');
    btn.textContent = '📸 LinkedIn View';
    btn.classList.remove('active-linkedin');
  }
}

/* ═══════════════════════════════════════════════════════
   STUDY MODE
═══════════════════════════════════════════════════════ */
function toggleStudyMode() {
  studyMode = !studyMode;
  const btn = document.getElementById('btn-study');
  document.body.classList.toggle('study-mode', studyMode);
  if (studyMode) {
    btn.textContent = '👁 Labels On';
    btn.style.cssText = 'border-color:var(--purple);color:var(--purple);background:rgba(155,89,182,0.12)';
    // Close detail panel — in study mode you quiz yourself without hints
    closeDetail();
  } else {
    btn.textContent = '👁 Study Mode';
    btn.style.cssText = '';
  }
}

/* ═══════════════════════════════════════════════════════
   DETAIL PANEL
═══════════════════════════════════════════════════════ */
const OSI_COLORS = { 7:'#f39c12', 6:'#b07fe0', 5:'#1abc9c', 4:'#2ecc71', 3:'#3498db', 2:'#c0865a', 1:'#95a5a6' };
const OSI_NAMES  = {
  7:'Layer 7 — Application', 6:'Layer 6 — Presentation', 5:'Layer 5 — Session',
  4:'Layer 4 — Transport',   3:'Layer 3 — Network',       2:'Layer 2 — Data Link',
  1:'Layer 1 — Physical',    '2-3':'Layer 2/3 — Data Link / Network'
};

function openDetail(nodeId, title, osiLayer, html) {
  if (selectedNode) selectedNode.classList.remove('selected');
  document.getElementById('detail-title').textContent = title;
  document.getElementById('detail-body').innerHTML = html;

  const tag = document.getElementById('detail-osi-tag');
  if (osiLayer) {
    const col = OSI_COLORS[osiLayer] || '#94a3b8';
    tag.textContent = OSI_NAMES[osiLayer] || ('Layer ' + osiLayer);
    tag.style.color = col;
    tag.style.borderColor = col + '55';
    tag.style.background  = col + '18';
    pulseOsiLayer(osiLayer);
  } else {
    tag.textContent = 'Cross-layer / Concept';
    tag.style.color = 'var(--text-dim)';
    tag.style.borderColor = '';
    tag.style.background  = '';
  }
  document.getElementById('detail-panel').classList.remove('collapsed');
  document.body.classList.add('detail-open');
  // Redraw overlay arrows after panel opens (canvas width changed)
  if (activeOverlay && activeOverlay !== 'defense') {
    clearSVG();
    setTimeout(() => drawOverlayArrows(activeOverlay), 280);
  }
}

function closeDetail() {
  document.getElementById('detail-panel').classList.add('collapsed');
  document.body.classList.remove('detail-open');
  if (selectedNode) { selectedNode.classList.remove('selected'); selectedNode = null; }
  // Redraw overlay arrows after panel closes (canvas width changed)
  if (activeOverlay && activeOverlay !== 'defense') {
    clearSVG();
    setTimeout(() => drawOverlayArrows(activeOverlay), 280);
  }
}

function openNodeById(id) {
  const d = NODE_DATA[id];
  if (d) openDetail(id, d.title, d.osi, d.html);
}

/* ═══════════════════════════════════════════════════════
   OSI LAYER PULSE & FILTER
═══════════════════════════════════════════════════════ */
let activeOsiFilter = null;

function pulseOsiLayer(layer) {
  const el = document.getElementById('osi-' + layer);
  if (!el) return;
  el.classList.remove('pulse');
  void el.offsetWidth;
  el.classList.add('pulse');
  el.addEventListener('animationend', () => el.classList.remove('pulse'), { once: true });
}

function selectOsiLayer(layer) {
  pulseOsiLayer(layer);
  if (activeOsiFilter === layer) {
    clearOsiFilter();
  } else {
    applyOsiFilter(layer);
  }
}

/* Build set of node-data IDs that belong to a given OSI layer */
function nodeIdsForLayer(layer) {
  const ids = new Set();
  Object.entries(NODE_DATA).forEach(([id, d]) => {
    if (!d.osi) return;
    // handle '2-3' cross-layer entries
    const layers = String(d.osi).split('-').map(Number);
    if (layers.includes(layer)) ids.add(id);
  });
  return ids;
}

function applyOsiFilter(layer) {
  activeOsiFilter = layer;
  const matchIds = nodeIdsForLayer(layer);

  /* ── Topology canvas ── */
  document.querySelectorAll('.node[data-node-id]').forEach(node => {
    const id = node.dataset.nodeId;
    const d  = NODE_DATA[id];
    node.classList.remove('osi-match', 'osi-dim', 'osi-cross');
    if (!d || d.osi === null || d.osi === undefined) {
      node.classList.add('osi-cross');           // cross-layer concept
    } else if (matchIds.has(id)) {
      node.classList.add('osi-match');
    } else {
      node.classList.add('osi-dim');
    }
  });

  /* Dim zones whose every visible node is dimmed */
  document.querySelectorAll('.zone').forEach(zone => {
    const nodes = zone.querySelectorAll('.node[data-node-id]');
    const allDim = [...nodes].every(n => n.classList.contains('osi-dim'));
    zone.classList.toggle('zone-all-dim', allDim && nodes.length > 0);
  });

  /* ── OSI sidebar bands ── */
  for (let i = 1; i <= 7; i++) {
    const band = document.getElementById('osi-' + i);
    if (!band) continue;
    band.classList.remove('osi-band-active', 'osi-band-dim');
    band.classList.add(i === layer ? 'osi-band-active' : 'osi-band-dim');
  }

  document.body.classList.add('osi-filtered');

  /* ── Graph view: dim nodes not matching this OSI layer ── */
  if (gGraphActive && gGraphInited) {
    const matchIds = nodeIdsForLayer(layer);
    document.querySelectorAll('#gn > g[data-g-node-id]').forEach(g => {
      const nid = g.dataset.gNodeId;
      const isCat = nid.startsWith('cat-');
      const nodeId = GNODES.find(n => n.id === nid)?.nodeId;
      const vis = isCat || (nodeId && matchIds.has(nodeId));
      g.style.opacity = vis ? '1' : '0.06';
      g.style.pointerEvents = vis ? 'auto' : 'none';
    });
    document.querySelectorAll('#ge > line').forEach(line => line.style.opacity = '0.06');
    document.querySelectorAll('#ge > line[data-gs][data-gt]').forEach(line => {
      const sN = GNODES.find(n => n.id === line.dataset.gs);
      const tN = GNODES.find(n => n.id === line.dataset.gt);
      const sv = !sN || sN.id.startsWith('cat-') || (sN.nodeId && matchIds.has(sN.nodeId));
      const tv = !tN || tN.id.startsWith('cat-') || (tN.nodeId && matchIds.has(tN.nodeId));
      if (sv && tv) line.style.opacity = '0.65';
    });
  }

  /* Update filter indicator on OSI sidebar */
  _updateFilterBanner(layer);
}

function clearOsiFilter() {
  activeOsiFilter = null;

  /* ── Topology canvas ── */
  document.querySelectorAll('.node').forEach(n =>
    n.classList.remove('osi-match', 'osi-dim', 'osi-cross'));
  document.querySelectorAll('.zone').forEach(z =>
    z.classList.remove('zone-all-dim'));

  /* ── OSI sidebar bands ── */
  for (let i = 1; i <= 7; i++) {
    const band = document.getElementById('osi-' + i);
    if (band) band.classList.remove('osi-band-active', 'osi-band-dim');
  }

  document.body.classList.remove('osi-filtered');

  /* ── Graph view ── */
  if (gGraphActive && gGraphInited) {
    document.querySelectorAll('#gn > g').forEach(g => {
      g.style.opacity = '1';
      g.style.pointerEvents = 'auto';
    });
    document.querySelectorAll('#ge > line').forEach(line => {
      line.style.opacity = '';
    });
  }

  _updateFilterBanner(null);
}

/* Small banner that appears on the OSI sidebar when a filter is active */
function _updateFilterBanner(layer) {
  let banner = document.getElementById('osi-filter-banner');
  if (!layer) {
    if (banner) banner.remove();
    return;
  }
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'osi-filter-banner';
    banner.style.cssText = [
      'position:absolute','bottom:0','left:0','right:0',
      'background:rgba(15,23,42,0.9)','border-top:1px solid var(--border)',
      'padding:5px 6px','font-size:9px','font-weight:700',
      'color:var(--text-dim)','text-align:center',
      'letter-spacing:0.5px','z-index:60',
      'cursor:pointer','line-height:1.4'
    ].join(';');
    banner.title = 'Click to clear filter';
    banner.onclick = clearOsiFilter;
    document.getElementById('osi-sidebar').style.position = 'relative';
    document.getElementById('osi-sidebar').appendChild(banner);
  }
  const col = OSI_COLORS[layer] || '#fff';
  banner.innerHTML =
    `<span style="color:${col}">Layer ${layer} filter active</span><br>` +
    `<span style="opacity:0.6">click to clear</span>`;
}

/* ═══════════════════════════════════════════════════════
   NODE CLICK WIRING — attach to all .node elements
═══════════════════════════════════════════════════════ */
document.querySelectorAll('.node[data-node-id]').forEach(node => {
  node.addEventListener('click', function(e) {
    e.stopPropagation();
    if (linkedInActive) return;

    if (selectedNode) selectedNode.classList.remove('selected');
    selectedNode = this;
    this.classList.add('selected');

    const id    = this.dataset.nodeId;
    const label = this.querySelector('.node-label')?.textContent || this.textContent.trim();
    const d     = NODE_DATA[id];

    if (d) {
      openDetail(id, d.title, d.osi, d.html);
    } else {
      openDetail(id, label, null,
        `<p class="dp-placeholder">Detailed content for <strong>${label}</strong> coming in Phase 3.</p>`);
    }
  });
});

/* fallback: nodes without data-node-id */
document.querySelectorAll('.node:not([data-node-id])').forEach(node => {
  node.addEventListener('click', function(e) {
    e.stopPropagation();
    const label = this.querySelector('.node-label')?.textContent || this.textContent.trim();
    openDetail(null, label, null,
      `<p class="dp-placeholder">Click a labeled node for full details.</p>`);
  });
});

/* close detail on canvas background click */
document.getElementById('canvas').addEventListener('click', e => {
  if (e.target.id === 'canvas') closeDetail();
});

/* ═══════════════════════════════════════════════════════
   HOVER TOOLTIPS — show OSI layer on node hover
═══════════════════════════════════════════════════════ */
const tooltip = document.getElementById('tooltip');
let tooltipTimer = null;

document.querySelectorAll('.node[data-node-id]').forEach(node => {
  node.addEventListener('mouseenter', function(e) {
    if (linkedInActive) return;
    tooltipTimer = setTimeout(() => {
      const id = this.dataset.nodeId;
      const d  = NODE_DATA[id];
      if (!d) return;
      const osiLabel = d.osi ? (OSI_NAMES[d.osi] || ('Layer ' + d.osi)) : 'Cross-layer concept';
      const osiColor = d.osi ? (OSI_COLORS[d.osi] || '#94a3b8') : '#8b98ad';
      tooltip.innerHTML =
        `<span style="color:${osiColor};font-weight:700;font-size:9px;letter-spacing:.5px">${osiLabel}</span><br>` +
        `<span style="font-size:11px">${d.title}</span>`;
      tooltip.classList.add('visible');
    }, 400);
  });

  node.addEventListener('mousemove', function(e) {
    let tx = e.clientX + 14;
    let ty = e.clientY + 14;
    if (tx + 240 > window.innerWidth)  tx = e.clientX - 244;
    if (ty + 56  > window.innerHeight) ty = e.clientY - 60;
    tooltip.style.left = tx + 'px';
    tooltip.style.top  = ty + 'px';
  });

  node.addEventListener('mouseleave', () => {
    clearTimeout(tooltipTimer);
    tooltip.classList.remove('visible');
  });

  node.addEventListener('click', () => {
    clearTimeout(tooltipTimer);
    tooltip.classList.remove('visible');
  });
});

/* ═══════════════════════════════════════════════════════
   FIRST-RUN HINT
═══════════════════════════════════════════════════════ */
(function showFirstRunHint() {
  if (sessionStorage.getItem('ch3-hint-seen')) return;
  const hint = document.createElement('div');
  hint.style.cssText = [
    'position:fixed','bottom:' + (44 + 12) + 'px','left:50%',
    'transform:translateX(-50%)',
    'background:var(--surface2)','border:1px solid var(--border)',
    'border-radius:8px','padding:10px 18px',
    'font-size:11px','color:var(--text)',
    'z-index:500','pointer-events:none',
    'box-shadow:0 4px 20px rgba(0,0,0,0.5)',
    'text-align:center','line-height:1.6',
    'opacity:1','transition:opacity 0.6s ease'
  ].join(';');
  hint.innerHTML =
    '<strong style="color:var(--text-bright)">Click any node</strong> to open its definition &nbsp;·&nbsp; ' +
    '<strong style="color:var(--orange)">Toggle buttons</strong> activate overlays &nbsp;·&nbsp; ' +
    '<strong style="color:var(--teal)">OSI bands</strong> pulse on each click';
  document.body.appendChild(hint);
  setTimeout(() => { hint.style.opacity = '0'; }, 4500);
  setTimeout(() => { hint.remove(); }, 5200);
  sessionStorage.setItem('ch3-hint-seen', '1');
})();

/* ═══════════════════════════════════════════════════════
   SVG OVERLAY — resize & scroll handling
═══════════════════════════════════════════════════════ */
function syncSvgSize() {
  const canvas = document.getElementById('canvas');
  const svg    = document.getElementById('overlay-svg');
  svg.style.height = canvas.scrollHeight + 'px';
}

// Sync on load
syncSvgSize();

// Redraw arrows when canvas scrolls (arrows are absolute-positioned so they stay correct)
document.getElementById('canvas').addEventListener('scroll', () => {
  syncSvgSize();
  if (activeOverlay && activeOverlay !== 'defense') {
    clearSVG();
    setTimeout(() => drawOverlayArrows(activeOverlay), 20);
  }
});

// Redraw on window resize
window.addEventListener('resize', () => {
  syncSvgSize();
  if (activeOverlay && activeOverlay !== 'defense') {
    clearSVG();
    setTimeout(() => drawOverlayArrows(activeOverlay), 50);
  }
});

// Also sync size whenever canvas content might change (ZT toggle)
const canvasObserver = new MutationObserver(() => {
  syncSvgSize();
});
canvasObserver.observe(document.getElementById('canvas'), { childList: true, subtree: false });
