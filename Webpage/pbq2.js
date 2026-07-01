/* ════════════════════════════════════════════════════════════
   pbq2.js · Advanced Scenario-Based PBQ Labs — Security+ SY0-701
   Schema: { id, type, domain, title, scenario,
             questions:[{id, stem, type, options:{A,B,...}, correct, explanation}] }
   Loaded after pbq.js; quiz.js renders via its advanced PBQ path.
════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (!window.PBQ_BANK) window.PBQ_BANK = [];

  [
    /* ── pbq_arch_01 ── DMZ Architecture Security Review ───────────────── */
    {
      id: 'pbq_arch_01', type: 'architecture', domain: '3.0',
      title: 'DMZ Architecture Security Review',
      scenario: 'A security architect reviews the network design for a retail company processing credit card payments (PCI-DSS scope).\n\nNetwork Layout:\n  Zone A (Internet-facing): WEB-01 and WEB-02 behind an Application Load Balancer (ALB)\n  Zone B (Application): APP-01 handling business logic and session management\n  Zone C (Data): PostgreSQL DB-01 storing customer PII and payment card data\n  Zone D (Corporate LAN): 150 workstations, internal file servers, HR systems\n\nFirewall & Segmentation:\n  Firewall-1: between internet and the shared internal segment\n  Zones A, B, and C share a single subnet 192.168.10.0/24 — no internal firewalls, no ACLs\n  Firewall-2: between 192.168.10.0/24 and Zone D (Corporate LAN)\n\nAdditional Config:\n  TLS 1.3 terminated at ALB; traffic from ALB to web servers travels unencrypted within 192.168.10.0/24\n  DB-01 accepts connections on TCP 5432 from all hosts in 192.168.10.0/24\n  Nightly backups run to a backup server in Zone D',
      questions: [
        {
          id: 'q1', stem: 'Which TWO statements BEST describe critical security violations in this architecture? (Select TWO)',
          type: 'multi',
          options: {
            A: 'TLS is terminated at the ALB, meaning traffic between the ALB and web servers travels as plaintext within the shared segment',
            B: 'DB-01 containing PCI-DSS cardholder data shares a flat network segment with internet-facing web servers, with no intervening firewall',
            C: 'Firewall-2 is placed between the shared application segment and the Corporate LAN',
            D: 'DB-01 accepts connections on TCP 5432 from all hosts in 192.168.10.0/24, including WEB-01 and WEB-02',
            E: 'Database backups are stored in Zone D rather than an offsite or cloud location'
          },
          correct: ['B', 'D'],
          explanation: 'B is correct: Placing PCI-DSS cardholder data (DB-01) in the same flat segment as internet-facing web servers is a critical violation. A compromised web server has unrestricted L3 access to the database. PCI-DSS Req 1 mandates isolating the cardholder data environment with a firewall. | D is correct: Even within a shared segment the database must only accept connections from APP-01. Port 5432 open to WEB-01/WEB-02 means a web shell or SQLi attack can query the database directly, bypassing the application layer. | A is lower-severity: TLS offloading at the ALB is a widely accepted pattern when the internal segment is adequately controlled — the root problem here is the missing segmentation, not the TLS offloading. | C is a CORRECT design decision — Firewall-2 protecting the corporate LAN from the DMZ is exactly right. | E is a resilience gap, not a primary architectural violation.'
        },
        {
          id: 'q2', stem: 'Which control, added between the web server tier and the database tier, would MOST reduce the blast radius of a successful web application compromise?',
          type: 'single',
          options: {
            A: 'A WAF deployed at the perimeter in front of Firewall-1, filtering inbound HTTP/HTTPS requests',
            B: 'A host-based intrusion detection system (HIDS) installed on DB-01 to alert on anomalous query patterns',
            C: 'An internal network firewall or security group isolating DB-01 in its own subnet, permitting only APP-01 to reach TCP 5432',
            D: 'Database activity monitoring (DAM) deployed on DB-01 to log and alert on queries exceeding a behavioral baseline',
            E: 'AES-256 full database encryption at rest with keys stored in a dedicated HSM'
          },
          correct: 'C',
          explanation: 'C is correct: An internal firewall isolating DB-01 and restricting TCP 5432 to APP-01\'s IP eliminates the lateral movement path from compromised web servers to the database — the textbook blast-radius reduction. | A: A perimeter WAF cannot see East-West traffic inside 192.168.10.0/24; once an attacker has code execution on WEB-01 the WAF is irrelevant. | B: HIDS is a detective control — it alerts but does not prevent the TCP connection. | D: DAM logs and may block queries; the correct fix is network segmentation, not query filtering. | E: At-rest encryption protects storage media — it does not affect live database connections from a compromised host.'
        },
        {
          id: 'q3', stem: 'The security team wants to inspect encrypted HTTPS traffic from external clients before it reaches any internal server. Where should the TLS inspection proxy be placed?',
          type: 'single',
          options: {
            A: 'Outside the network perimeter, upstream of Firewall-1, as a cloud-based inline security service',
            B: 'Between Firewall-1 and the Application Load Balancer, intercepting encrypted traffic before the ALB',
            C: 'Between the ALB and WEB-01/WEB-02, at the point where TLS has already been terminated by the ALB',
            D: 'On WEB-01 and WEB-02 as host-installed SSL inspection agents at the OS network layer',
            E: 'On Firewall-2, between 192.168.10.0/24 and the Corporate LAN'
          },
          correct: 'B',
          explanation: 'B is correct: The TLS inspection proxy must intercept encrypted traffic BEFORE the existing TLS termination point (the ALB). Placed between Firewall-1 and the ALB, it terminates the client TLS session, decrypts and inspects, then re-encrypts and forwards to the ALB. | A: A cloud-based service decrypts all client traffic including PCI-DSS cardholder data — significant compliance and confidentiality concerns. | C: Between ALB and web servers, traffic is already plaintext — there is nothing to decrypt at this position. | D: Host agents on WEB-01/WEB-02 cannot see traffic between Firewall-1 and the ALB — a separate earlier network hop. | E: Firewall-2 handles the wrong traffic path; external HTTPS never crosses Firewall-2.'
        }
      ]
    },

    /* ── pbq_arch_02 ── AWS Cloud Architecture Security Review ─────────── */
    {
      id: 'pbq_arch_02', type: 'architecture', domain: '3.0',
      title: 'AWS Cloud Architecture Security Review',
      scenario: 'A security engineer reviews a three-tier web application on AWS.\n\nInfrastructure:\n  VPC 10.0.0.0/16 across two AZs (us-east-1a/b)\n  Public Subnets (10.0.1.0/24, 10.0.2.0/24): ALB + Internet Gateway\n  Private Subnets (10.0.3.0/24, 10.0.4.0/24): EC2 Auto Scaling Group (6 instances)\n  Database Subnets (10.0.5.0/24, 10.0.6.0/24): RDS MySQL 8.0 Multi-AZ\n  S3 Bucket prod-assets-20xx: customer-uploaded documents and profile images\n  IAM Role ec2-app-role: attached to all EC2 instances in the ASG\n\nFindings:\n  F1: prod-assets-20xx — Block Public Access = OFF; ACL grants s3:GetObject to AllUsers (public internet)\n  F2: RDS Security Group sg-rds-7742 — Inbound TCP 3306, Source: 0.0.0.0/0\n  F3: ec2-app-role IAM Policy: {"Effect":"Allow","Action":["*"],"Resource":["*"]} (AdministratorAccess equivalent)\n  F4: VPC Flow Logs — Not enabled on the VPC or any subnet',
      questions: [
        {
          id: 'q1', stem: 'Which remediation MOST directly addresses the S3 public exposure in Finding F1?',
          type: 'single',
          options: {
            A: 'Enable server-side encryption (SSE-S3) on prod-assets-20xx to protect objects at rest',
            B: 'Enable S3 Block Public Access at the bucket level AND remove the AllUsers GetObject ACL grant',
            C: 'Create a VPC endpoint for S3 and restrict the bucket policy to VPC endpoint requests only',
            D: 'Enable S3 Object Lock in governance mode to prevent overwrites or deletions',
            E: 'Modify the ACL to grant s3:PutObject to the EC2 role only, removing all GetObject grants'
          },
          correct: 'B',
          explanation: 'B is correct: Two independent configurations create public read access — Block Public Access disabled lets ACLs grant public access, and the AllUsers ACL explicitly grants GetObject. Enabling Block Public Access overrides all ACL and policy-based public grants. Removing the AllUsers ACL adds defense in depth. Both together are the complete fix. | A: Encryption does not control read access — encrypted objects are still downloadable by anyone with the GetObject permission. | C: A VPC endpoint restricts the network path but does not make the bucket private — the AllUsers ACL still grants direct public access via the S3 URL. | D: Object Lock addresses integrity and retention, not read access control. | E: The application needs GetObject to serve files; removing it breaks functionality while not addressing the root public ACL issue.'
        },
        {
          id: 'q2', stem: 'Which remediation MOST directly addresses the RDS network exposure in Finding F2?',
          type: 'single',
          options: {
            A: 'Enable RDS encryption at rest using an AWS KMS customer-managed key',
            B: 'Enable automated RDS backups with 7-day retention and point-in-time recovery',
            C: 'Modify sg-rds-7742: change the inbound rule source from 0.0.0.0/0 to the EC2 Auto Scaling Group security group ID, restricting TCP 3306 to application instances only',
            D: 'Migrate the RDS instance to a Public Subnet and assign it an Elastic IP for controlled external administration',
            E: 'Enable RDS Performance Insights to monitor query throughput and detect unusual activity'
          },
          correct: 'C',
          explanation: 'C is correct: The security group allows TCP 3306 from 0.0.0.0/0 — any internet IP can attempt a MySQL connection. Changing the source to the EC2 security group ID dynamically permits only ASG instances, adapting automatically as the group scales without manual IP management. | A: Encryption at rest protects storage volumes but does not close the internet-exposed port — an encrypted database with a public security group is still fully exploitable. | B: Backups address availability, not network access control. | D: Moving RDS to a public subnet with an Elastic IP dramatically worsens exposure. | E: Performance Insights monitors queries after connections are established; it cannot prevent unauthorized connections.'
        },
        {
          id: 'q3', stem: 'Which remediation MOST directly addresses the IAM overpermission in Finding F3?',
          type: 'single',
          options: {
            A: 'Attach the AWS-managed ReadOnlyAccess policy, replacing the current allow-all policy',
            B: 'Remove ec2-app-role from the ASG launch template so instances operate with no IAM role',
            C: 'Replace the current policy with a least-privilege policy granting only the specific API actions and resource ARNs the application requires (e.g., s3:GetObject/PutObject on prod-assets-20xx; rds-db:connect on the specific RDS ARN)',
            D: 'Require MFA for all IAM AssumeRole API calls to prevent unauthorized role assumption',
            E: 'Enable AWS CloudTrail in all regions to log and alert on every API call made using ec2-app-role'
          },
          correct: 'C',
          explanation: 'C is correct: The current policy gives every EC2 instance effective full account ownership — one compromised instance can delete all S3 buckets, create IAM backdoors, extract secrets, or destroy the account. A scoped policy granting exactly what the application code needs limits the blast radius to only legitimately-needed resources. | A: ReadOnlyAccess grants read access to every resource in the account including Secrets Manager, other buckets, and RDS snapshots — still not least-privilege, and breaks write operations the application needs. | B: Removing the role breaks all AWS API functionality the application requires. | D: EC2 instances retrieve credentials from IMDSv2 automatically — MFA-required AssumeRole applies to human/federated principals, not instance profiles. | E: CloudTrail is a detective control; it logs API calls but cannot prevent a compromised instance from executing destructive actions.'
        },
        {
          id: 'q4', stem: 'Which remediation MOST directly addresses the missing VPC Flow Logs in Finding F4?',
          type: 'single',
          options: {
            A: 'Enable AWS Config with the vpc-flow-logs-enabled managed rule to generate a compliance finding',
            B: 'Deploy a host-based IDS on each EC2 instance to capture network traffic at the OS level',
            C: 'Enable VPC Flow Logs at the VPC level, capturing all accepted and rejected traffic flows, and publish to CloudWatch Logs or S3',
            D: 'Enable Amazon GuardDuty to detect malicious IPs and anomalous API behavior',
            E: 'Deploy AWS Network Firewall with Suricata-compatible IDS signatures to inspect and log VPC traffic'
          },
          correct: 'C',
          explanation: 'C is correct: VPC Flow Logs capture metadata for all network flows across the VPC (source/dest IP, ports, protocol, bytes, accept/reject). Without them there is zero forensic record of network communication — no way to determine what connected to the exposed RDS port or whether the S3 bucket was accessed from unexpected sources. Enabling at the VPC level covers all subnets automatically. | A: The AWS Config rule detects the gap and generates a finding — it does not enable Flow Logs. | B: Host-based IDS on EC2 cannot capture flows rejected by security groups before reaching the instance, or traffic involving the ALB that never touches a specific EC2 host. | D: GuardDuty\'s network-level detections (port scanning, C2 beaconing) REQUIRE VPC Flow Logs as input — enabling GuardDuty without Flow Logs disables its network threat detection. GuardDuty supplements Flow Logs, it does not replace them. | E: Network Firewall logs traffic traversing its deployment points, not the comprehensive per-flow visibility across all subnets and SG decisions that Flow Logs provide.'
        }
      ]
    },

    /* ── pbq_arch_03 ── Zero Trust Implementation Assessment ────────────── */
    {
      id: 'pbq_arch_03', type: 'architecture', domain: '3.0',
      title: 'Zero Trust Implementation Assessment',
      scenario: 'A CISO announced the company has "implemented Zero Trust." An assessor reviews the claim against NIST SP 800-207 across six dimensions:\n\n1. Identity: MFA enforced for all users (username + password + TOTP). No risk-based re-evaluation after initial login.\n2. Device: Only company-managed laptops permitted; BYOD blocked. No continuous device health checks after enrollment.\n3. Network Access: Remote employees connect via full-tunnel IPsec VPN granting full L3 access to 10.0.0.0/8.\n4. Application Access: After VPN, users access SharePoint/ERP/file shares by internal IP or DNS. No per-app access broker or identity-aware proxy.\n5. Data Classification: No formal classification scheme. All data in SharePoint/file servers with no sensitivity labels.\n6. Monitoring: SIEM aggregates Windows Event Logs, VPN auth logs, perimeter firewall logs. Signature-based alerts only; no UEBA baseline.',
      questions: [
        {
          id: 'q1', stem: 'Which THREE of the six dimensions "Do Not Implement Zero Trust" (vs. "Partially Implement Zero Trust")? (Select THREE)',
          type: 'multi',
          options: {
            A: 'Identity — MFA required for all users to authenticate',
            B: 'Device — Only company-managed devices permitted; BYOD blocked',
            C: 'Network Access — VPN grants full L3 access to 10.0.0.0/8',
            D: 'Application Access — Users access apps by IP/DNS after VPN connection',
            E: 'Data Classification — No classification scheme implemented',
            F: 'Monitoring — SIEM aggregates logs with signature-based alerts'
          },
          correct: ['C', 'D', 'E'],
          explanation: 'C — Does Not Implement ZT: VPN grants implicit network-level trust after auth. Once connected, the user reaches all 10.0.0.0/8 resources. ZT explicitly rejects network-location-based trust — access must be per-application and per-session. VPN is the architectural antithesis of ZT. | D — Does Not Implement ZT: Apps accessible based on VPN network presence, not per-application identity and posture verification. No broker, no identity-aware proxy, no per-app authorization decision. This is the castle-and-moat model ZT replaces. | E — Does Not Implement ZT: ZT requires data-centric access controls — you must know what data exists and its sensitivity before enforcing least-privilege purpose-limited policies. Without classification, there is no foundation for data-centric ZT. | A — Partially Implements ZT: MFA is required but ZT needs continuous contextual re-evaluation per session. | B — Partially Implements ZT: Managed-device-only is a ZT component, but without continuous posture assessment a compromised managed device still passes. | F — Partially Implements ZT: Basic SIEM logging is the ZT monitoring foundation, but ZT needs UEBA behavioral baselines and anomaly detection — not only signature-based alerting.'
        },
        {
          id: 'q2', stem: 'The VPN grants full L3 access to all of 10.0.0.0/8 after authentication. Which Zero Trust principle does this MOST directly violate?',
          type: 'single',
          options: {
            A: 'Continuous monitoring and validation — ZT requires real-time behavioral analysis of all sessions',
            B: 'Never trust, always verify — VPN creates implicit trust based on network location; ZT requires per-application, per-session explicit verification regardless of connection origin',
            C: 'Assume breach — organizations must operate as if a breach is always underway; VPN provides false confidence by treating connected users as trusted insiders',
            D: 'Least privilege access — VPN grants access to all of 10.0.0.0/8 when users need only specific applications',
            E: 'Micro-segmentation — ZT divides the network into isolated zones; VPN connects users to a large flat network'
          },
          correct: 'B',
          explanation: 'B is correct: The VPN model operates on network-location trust — after passing authentication the user is granted membership in the "trusted internal network." ZT\'s core tenet "never trust, always verify" prohibits exactly this: network location must never be the basis for trust. Every access request must be verified based on identity, device posture, and context at the application layer. | D (least privilege) is also violated, but it is a consequence of the network-trust model — not the root principle violated. The MOST direct violation is the implicit trust granted by network location. | A and C are genuine ZT principles but are not what the VPN model specifically violates architecturally. | E (micro-segmentation) is a ZT implementation technique; the core philosophical violation is the "trust = network location" assumption.'
        },
        {
          id: 'q3', stem: 'Which technology would MOST directly replace the corporate VPN to achieve Zero Trust for the remote access and application access dimensions?',
          type: 'single',
          options: {
            A: 'A next-generation firewall (NGFW) deployed at the perimeter with deep packet inspection',
            B: 'A Zero Trust Network Access (ZTNA) / Software-Defined Perimeter (SDP) solution that grants per-application access after verifying identity and device posture on every session',
            C: 'MFA added to the existing VPN client to strengthen the initial authentication step',
            D: 'A Network Access Control (NAC) solution that evaluates device health before granting the VPN tunnel',
            E: 'An SD-WAN solution that optimizes traffic routing between remote users and the corporate data center'
          },
          correct: 'B',
          explanation: 'B is correct: ZTNA/SDP is the architectural VPN replacement. Instead of connecting the user to the network, the ZTNA controller evaluates identity, device posture, and context, then grants access to ONLY the specific application requested. The user\'s device never joins the internal network — the ZTNA broker forwards sessions to authorized apps through an encrypted tunnel, with each application access being a separate verified decision. | A: NGFW improves inspection but users still VPN-connect to the network first — the trust model is unchanged. | C: MFA strengthens authentication but the user still gets full L3 access after auth — the architecture is unchanged. | D: NAC + VPN evaluates device health before granting the tunnel but the outcome is still full network access. | E: SD-WAN optimizes WAN routing and performance; it does not change the trust model.'
        },
        {
          id: 'q4', stem: 'The identity dimension uses TOTP MFA for all users. Which additional capability would MOST advance this toward a FULL Zero Trust identity implementation?',
          type: 'single',
          options: {
            A: 'Replace TOTP with FIDO2 hardware security keys (YubiKey) to eliminate phishing risk',
            B: 'Implement Conditional Access policies that evaluate device compliance, user location risk, and session risk signals per access request — blocking access or requiring step-up auth when anomalies are detected',
            C: 'Enable SSO federation across all internal apps and SaaS services using SAML 2.0 or OIDC',
            D: 'Enforce a minimum 16-character passphrase policy with lockout after 5 failures and 90-day rotation',
            E: 'Deploy quarterly phishing simulation campaigns to reduce human-factor credential compromise risk'
          },
          correct: 'B',
          explanation: 'B is correct: ZT identity is continuous and context-aware, not a one-time authentication event. MFA establishes identity at login, creating static session trust for the rest of the session. ZT requires dynamic re-evaluation per request: Is this device compliant NOW? Is the user in an expected location? Has risk changed (impossible travel, credential spray detected)? Conditional Access (Entra ID CA, Okta FastPass) evaluates contextual signals per request and enforces adaptive responses — blocking from non-compliant devices, requiring step-up MFA for high-risk sessions. This is continuous verification, not one-time authentication. | A: FIDO2 is phishing-resistant and a meaningful MFA improvement, but it addresses authentication method strength — not the continuous contextual re-evaluation that defines ZT identity. Strong MFA + static session trust is still not ZT. | C: SSO centralizes identity governance but does not add per-session contextual verification. | D: Password policy addresses credential strength, not continuous session/access verification. | E: Phishing simulations are a human risk control; they have no impact on the ZT identity architecture.'
        }
      ]
    },

    /* ── pbq_arch_04 ── Firewall Rule Base Analysis ──────────────────────── */
    {
      id: 'pbq_arch_04', type: 'architecture', domain: '3.0',
      title: 'Firewall Rule Base Analysis',
      scenario: 'Network zones:\n  Internet: Any external (untrusted) source\n  DMZ (10.10.10.0/24): Public-facing web servers and Proxy-01 (10.10.10.50)\n  Corp LAN (10.20.0.0/16): Employee workstations; MGMT-SRV (10.20.1.5) is a Windows Server 2022 DC\n  DB Tier (10.30.0.0/24): PostgreSQL database servers (TCP 5432)\n\nThe firewall is stateful; rules are evaluated top-to-bottom, first match wins.\nReturn traffic for established connections is automatically permitted.\n\nRule | Source            | Destination          | Port/Protocol | Action\n-----|-------------------|----------------------|---------------|-------\n  1  | ANY               | 10.10.10.0/24 (DMZ)  | TCP 443       | ALLOW\n  2  | 10.20.0.0/16      | 10.10.10.50 (Proxy)  | TCP 8080      | ALLOW\n  3  | ANY               | 10.20.1.5 (MGMT-SRV) | TCP 3389      | ALLOW\n  4  | ANY               | ANY                  | ANY           | ALLOW\n  5  | 10.20.0.0/16      | 10.10.10.50 (Proxy)  | TCP 80        | ALLOW\n  6  | 10.10.10.0/24     | 10.30.0.0/24 (DB)    | TCP 5432      | ALLOW\n  7  | 10.20.0.0/16      | ANY                  | ANY           | ALLOW\n  8  | ANY               | ANY                  | ANY           | DENY',
      questions: [
        {
          id: 'q1', stem: 'Which rule represents the MOST critical security risk?',
          type: 'single',
          options: {
            A: 'Rule 1 — ANY source to DMZ TCP 443 exposes web servers to the entire internet',
            B: 'Rule 3 — ANY source to an internal DC on TCP 3389 creates a critical attack surface',
            C: 'Rule 4 — ANY/ANY/ANY ALLOW at position 4 means all traffic from any source to any destination is permitted, completely negating the firewall',
            D: 'Rule 7 — Corp LAN to ANY/ANY enables unrestricted outbound data exfiltration',
            E: 'Rule 8 — the implicit deny-all is too broad and blocks legitimate unpermitted traffic'
          },
          correct: 'C',
          explanation: 'C is correct: Rule 4 (ANY→ANY, ANY port, ALLOW) at position 4 completely negates the firewall. Any traffic not matching Rules 1-3 is unconditionally permitted. This means any internet host can reach the DB Tier, any internal system can reach any external host on any port, and every rule below position 4 is a shadow rule that can never be reached. | B — Rule 3 (internet RDP to a DC) is also critical and would be the top finding if Rule 4 did not exist — but Rule 4 makes Rule 3 redundant while also allowing everything else. Rule 4\'s impact is unbounded. | A — Rule 1 is a legitimate rule; publishing HTTPS services in the DMZ is the intended function. | D — Rule 7 violates least privilege but is itself shadowed by Rule 4. | E — the implicit deny-all (Rule 8) is correct and expected; it is unreachable because of Rule 4, which is Rule 4\'s fault, not Rule 8\'s.'
        },
        {
          id: 'q2', stem: 'Which BEST identifies the shadow rule and its most significant operational consequence?',
          type: 'single',
          options: {
            A: 'Rule 1 is shadowed by Rule 3 because both allow ANY source traffic',
            B: 'Rule 5 is shadowed by Rule 4 — Rule 4 (ANY/ANY/ANY ALLOW) matches all Corp LAN traffic to Proxy-01 on TCP 80 before Rule 5 is reached; Rule 5 can never be evaluated',
            C: 'Rule 6 is shadowed by Rule 1 because both involve DMZ traffic',
            D: 'Rule 7 is shadowed by Rule 2 because both allow Corp LAN traffic',
            E: 'Rule 8 is the shadow rule because all traffic is permitted by earlier rules'
          },
          correct: 'B',
          explanation: 'B is correct: Corp LAN traffic to Proxy-01 on TCP 80 hits Rule 1 (no match), Rule 2 (wrong port — 8080 not 80), Rule 3 (wrong destination), then Rule 4 (ANY/ANY/ANY — MATCH). Rule 5 is never reached. The significant operational consequence: shadow rules create hidden dependencies on the broad rule above them. If Rule 4 is removed to fix the misconfiguration, Rule 5 immediately becomes the active control — but Rule 5 was never tested in production as the active rule. The cleanup itself can unexpectedly expose or block traffic. | A: Rules 1 and 3 have different destinations and ports — no shadow relationship. | C: Rules 1 and 6 have different source, destination, direction, and port — no shadow relationship. | D: Rule 7 is broader than Rule 2, not narrower — Rule 7 is shadowed by Rule 4, not Rule 2. | E: Rule 8 (implicit deny-all) is a structural rule, not a shadow rule; its unreachability is a consequence of Rule 4.'
        },
        {
          id: 'q3', stem: 'A new web app on 10.10.10.22 must be accessible from the internet on TCP 8443. Which describes the CORRECT new rule and placement?',
          type: 'single',
          options: {
            A: 'ANY → 10.10.10.22, TCP 8443, ALLOW — inserted at position 9 (after the implicit deny)',
            B: 'ANY → 10.10.10.22, TCP 8443, ALLOW — inserted at position 5 (between Rule 4 and Rule 5)',
            C: 'ANY → 10.10.10.22, TCP 8443, ALLOW — inserted at position 1 (before all existing rules)',
            D: '10.10.10.22 → ANY, TCP 8443, ALLOW — inserted at position 3 (alongside the RDP rule)',
            E: 'No new rule needed — Rule 4 (ANY/ANY ALLOW) already permits all internet traffic to 10.10.10.22 on TCP 8443'
          },
          correct: 'C',
          explanation: 'C is correct: The new rule must be placed BEFORE Rule 4 (the ANY/ANY/ANY ALLOW). Rule 4 already permits this traffic, but (1) Rule 4 is a misconfiguration targeted for removal — any rule placed after it becomes a shadow rule that stops working when Rule 4 is eventually removed; (2) relying on a misconfiguration for intentional access makes the rule base unauditable. Position 1 ensures the rule is always evaluated, explicitly documented as intentional policy, and functional independently of Rule 4. | A: Position 9 is after the implicit deny at position 8 — any rule after an implicit deny is unreachable. | B: Position 5 is immediately after Rule 4 — Rule 4 matches all internet traffic to 10.10.10.22 first; the new rule is a shadow rule and will stop working when Rule 4 is removed. | D: Source and destination are inverted — this allows the server to INITIATE connections, not receive them. Since the firewall is stateful, return traffic is automatic; the correct rule allows inbound FROM internet TO the server. | E: Depending on a known misconfiguration for application access is not acceptable security practice.'
        },
        {
          id: 'q4', stem: 'Assuming Rule 4 is immediately removed, which TWO remaining rules still violate the principle of least privilege? (Select TWO)',
          type: 'multi',
          options: {
            A: 'Rule 1 — ANY → DMZ, TCP 443',
            B: 'Rule 2 — Corp LAN → Proxy-01, TCP 8080',
            C: 'Rule 3 — ANY → MGMT-SRV, TCP 3389',
            D: 'Rule 5 — Corp LAN → Proxy-01, TCP 80',
            E: 'Rule 6 — DMZ → DB Tier, TCP 5432',
            F: 'Rule 7 — Corp LAN → ANY, ANY'
          },
          correct: ['C', 'F'],
          explanation: 'C is correct (Rule 3 — ANY → MGMT-SRV TCP 3389): Least privilege requires restricting both source AND destination. Remote administration via RDP to a domain controller must be restricted to specific known sources — the admin\'s workstation IP or a bastion host. ANY source means any internet IP can attempt RDP, enabling brute force, credential spray, and RDP exploit exploitation. Fix: restrict source to a specific admin IP or jump server subnet. | F is correct (Rule 7 — Corp LAN → ANY, ANY): All corporate workstations should only reach authorized services — typically HTTPS (TCP 443) via the proxy, DNS (UDP 53), and specific approved services. Unrestricted outbound access enables malware callbacks on any non-standard port, data exfiltration via SFTP/FTP/custom protocols, and shadow IT. Fix: remove Rule 7, add specific allow rules for authorized outbound services. | A: Rule 1 (ANY → DMZ TCP 443) is correctly scoped — publishing HTTPS services requires ANY source because all internet users are legitimate requestors. | B: Rule 2 (Corp LAN → Proxy-01 TCP 8080) is correctly scoped — specific source, destination, port. | D: Rule 5 was a shadow rule; now active and correctly scoped. | E: Rule 6 (DMZ → DB Tier TCP 5432) is correctly scoped — specific source zone, specific destination zone, specific port.'
        }
      ]
    },

    /* ── pbq_arch_05 ── Identity Architecture Security Review ───────────── */
    {
      id: 'pbq_arch_05', type: 'architecture', domain: '3.0',
      title: 'Identity Architecture Security Review',
      scenario: 'Identity infrastructure at a 500-person financial services firm:\n\n  Active Directory: Single domain CORP.LOCAL on two Windows Server 2022 DCs; 4 accounts have Domain Admin membership\n  Azure AD Connect: Syncs all on-prem AD accounts to Entra ID every 30 minutes\n  SAML: Azure AD is the IdP for Salesforce, ServiceNow, and Atlassian Cloud\n  VPN Auth: FreeRADIUS using username/password\n  Endpoints: 500 Windows 11 laptops; no PAM solution deployed\n\nAssessment Findings:\n  F1: All 500 laptops were imaged with the same local admin account ("LocalAdmin") and same password set in 2021 — never rotated\n  F2: All 4 DA accounts perform daily tasks (email, web, documents) on the same laptops used for privileged AD operations — no PAW, no tiered admin model\n  F3: Azure AD Connect service account (CORP\\aad-sync-svc) is a member of Domain Admins — only needs specific delegated permissions (Read/Write on specific AD attributes; Replicate Directory Changes)\n  F4: FreeRADIUS shared secret set in 2021, never rotated; stored in plaintext in /etc/freeradius/clients.conf on a multi-purpose server also running a legacy web app\n  F5: Azure AD Conditional Access excludes domain-joined devices from MFA — employees on domain-joined workstations can access Salesforce, ServiceNow, and Atlassian using only username + password',
      questions: [
        {
          id: 'q1', stem: 'The risk committee asks to prioritize Findings 2, 1, and 5 only. Which ranks them correctly from HIGHEST to LOWEST risk?',
          type: 'single',
          options: {
            A: 'F2 (DA on standard workstations) → F1 (shared local admin credentials) → F5 (no MFA for SAML)',
            B: 'F1 (shared local admin credentials) → F2 (DA on standard workstations) → F5 (no MFA for SAML)',
            C: 'F5 (no MFA for SAML) → F2 (DA on standard workstations) → F1 (shared local admin credentials)',
            D: 'F2 (DA on standard workstations) → F5 (no MFA for SAML) → F1 (shared local admin credentials)',
            E: 'F1 (shared local admin credentials) → F5 (no MFA for SAML) → F2 (DA on standard workstations)'
          },
          correct: 'A',
          explanation: 'A is correct — F2 is highest risk: DA credentials on general-purpose workstations running email and browsers are one successful phishing email away from full AD compromise. DA-level access = complete control over authentication, authorization, group policy, and every account in the domain — an organization-ending event. | F1 is second: Identical local admin credentials across 500 endpoints enable enterprise-wide lateral movement via pass-the-hash. An attacker who compromises one endpoint and extracts the NTLM hash can authenticate as local admin to all 499 others. Severe, but one tier below F2 — local admin on endpoints is not DA. | F5 is lowest of the three: Bypassing MFA for SAML apps means a stolen domain password = access to Salesforce/ServiceNow/Atlassian. The blast radius is contained to those three apps; the attacker does not gain on-prem AD access. | Common trap — B (F1 highest): Candidates who prioritize scope (500 machines) over impact (full domain compromise) choose B. But one DA credential compromise is an organization-ending event; lateral movement to 500 endpoints is severe but recoverable. Impact outweighs scope.'
        },
        {
          id: 'q2', stem: 'Which finding would be MOST directly addressed by implementing a Privileged Access Workstation (PAW)?',
          type: 'single',
          options: {
            A: 'F1 — All 500 laptops share the same local admin username and password',
            B: 'F2 — Domain admins read email, browse the web, and perform privileged AD operations on the same general-purpose laptop',
            C: 'F3 — Azure AD Connect service account has Domain Admin permissions',
            D: 'F4 — FreeRADIUS shared secret is 3 years old and stored in plaintext',
            E: 'F5 — SAML federation allows SaaS app access without MFA for domain-joined users'
          },
          correct: 'B',
          explanation: 'B is correct: A PAW is a dedicated, hardened device used EXCLUSIVELY for privileged administrative tasks — no email client, web browser, or productivity software. A PAW directly eliminates F2\'s risk: the attack path "phishing email to DA workstation = domain compromise" is broken by physical and logical separation of privileged sessions from daily-use sessions. On a PAW, no malware delivery mechanism (malicious email, drive-by download, malicious document) can reach the privileged session. | A (F1 — shared local admin): Addressed by Microsoft LAPS or Azure AD LAPS, which generates a unique rotating password per endpoint. A PAW does not help with endpoint credential management. | C (F3 — over-permissioned service account): Addressed by reducing the Azure AD Connect account to least-privilege delegated permissions. PAW scope is user admin sessions, not service account permissions. | D (F4 — RADIUS secret): Addressed by rotating the secret and storing it in a secrets manager. PAW has no role here. | E (F5 — SAML without MFA): Addressed by modifying Conditional Access policy to enforce MFA regardless of device type. PAW is a privileged access isolation control, not an IdP policy control.'
        },
        {
          id: 'q3', stem: 'The team must eliminate persistent local administrator accounts across all 500 endpoints WITHOUT breaking legitimate IT support workflows. Which control BEST achieves this?',
          type: 'single',
          options: {
            A: 'Deploy a GPO removing all accounts from the local Administrators group except Domain Admins, redirecting all admin tasks to domain admin accounts',
            B: 'Deploy Microsoft LAPS to all endpoints, generating a unique random local admin password per machine stored in Active Directory',
            C: 'Implement Just-in-Time (JIT) privilege elevation via a PAM solution: the local administrator account is disabled by default and granted temporarily — time-limited and approval-workflow-gated — only when a specific administrative task requires it',
            D: 'Configure the EDR platform to terminate all processes spawned by the local admin SID, blocking unauthorized use',
            E: 'Require IT technicians to use domain admin credentials for all endpoint admin tasks, connecting via RDP for local configuration work'
          },
          correct: 'C',
          explanation: 'C is correct: JIT privilege elevation simultaneously eliminates persistent local admin accounts AND preserves legitimate IT workflows. Under JIT: the local admin account is disabled by default (no persistent credential to harvest); when a technician needs to install software or troubleshoot, they submit a time-limited elevation request through the PAM console; the PAM solution enables the account or grants temporary local admin membership for a defined window (e.g., 60 minutes); after expiry, the account is automatically disabled and the event is logged. Result: no persistent credential, full audit trail, IT work continues uninterrupted. | A: Replacing shared local admin with Domain Admin is worse — DA credential on every endpoint means endpoint compromise = immediate DA exposure in memory. | B: LAPS is the correct remediation for F1 (credential sharing for lateral movement) — it makes passwords unique. But LAPS does not disable the account; the account stays enabled with a unique password. The question asks about eliminating PERSISTENT local admin accounts. LAPS and JIT are complementary; JIT goes further. | D: Blocking all processes under the local admin SID breaks legitimate IT uses (software installation, driver management) that the question requires to remain functional. | E: Using DA accounts for routine endpoint tasks is the well-known anti-pattern that causes enterprise-wide breaches — this is not a solution, it creates a worse problem.'
        }
      ]
    },

    /* ── pbq_arch_06 ── Secure SDLC Pipeline Assessment ────────────────── */
    {
      id: 'pbq_arch_06', type: 'architecture', domain: '4.0',
      title: 'Secure SDLC Pipeline Assessment',
      scenario: 'CI/CD pipeline for a PCI-DSS-scoped payment processing API (Python/FastAPI, containerized, deployed to EC2 via Jenkins):\n\nPipeline Stages:\n  1. Developer pushes code to GitHub branch\n  2. Pull request opened for peer code review\n  3. Jenkins build: docker build (no security scanning)\n  4. Jenkins push: image pushed to AWS ECR\n  5. Jenkins deploy: image deployed to EC2 staging\n  6. Manual QA testing in staging\n  7. Jenkins deploy to production\n\nSecurity Gaps:\n  G1: No SAST tool at any stage\n  G2: No DAST tool at any stage\n  G3: Secrets stored as ENV instructions in the Dockerfile (e.g., ENV DB_CONN="postgresql://admin:P@ssw0rd@db.internal:5432/payments")\n  G4: No container image vulnerability scanning\n  G5: Penetration test scheduled one week before go-live',
      questions: [
        {
          id: 'q1', stem: 'Which security gap poses the MOST immediate risk to the organization and PCI-DSS compliance?',
          type: 'single',
          options: {
            A: 'G1 — No SAST; Python code is never statically analyzed for injection or insecure cryptographic usage',
            B: 'G2 — No DAST; the running application is never tested for runtime vulnerabilities',
            C: 'G3 — Secrets in the Dockerfile; database credentials, payment processor API keys, and AWS credentials are baked into every image layer',
            D: 'G4 — No container scanning; the base image may contain known CVEs exploitable after deployment',
            E: 'G5 — Penetration test one week before launch; insufficient time to remediate findings'
          },
          correct: 'C',
          explanation: 'C is correct: Secrets in Dockerfile ENV instructions are the most immediate risk for two compounding reasons. First, Docker image layers are immutable — a secret set via ENV is baked into that layer permanently. Even if a subsequent layer removes the ENV instruction, docker image history exposes the secret to anyone who can pull the image. Second, GitHub, Jenkins build logs, and ECR are all additional exposure surfaces. For a PCI-DSS payment API these secrets include payment processor API keys and database credentials for cardholder data — a present, active credential exposure, not a potential future vulnerability. | A: SAST findings represent potential vulnerabilities requiring exploitation — a future risk. G3 is an active credential compromise today. | B: No DAST is a future testing gap requiring a running application. | D: CVE exploitation typically requires specific conditions; hardcoded payment processor API keys can be immediately used to initiate fraudulent transactions. | E: Penetration test timing creates a workflow risk but does not represent an active security exposure today.'
        },
        {
          id: 'q2', stem: 'At which pipeline stage should SAST be integrated for MAXIMUM effectiveness?',
          type: 'single',
          options: {
            A: 'As a developer IDE plugin (SonarLint, Semgrep extension) providing real-time feedback as code is written',
            B: 'As a pre-commit hook in Git, scanning staged changes before the developer commits to a branch',
            C: 'As a required status check in the GitHub Pull Request workflow, blocking merge to main if high/critical findings are present',
            D: 'As a Jenkins pipeline step after the Docker build, scanning artifacts before the image is pushed to ECR',
            E: 'As a post-deployment scan of the production codebase running nightly'
          },
          correct: 'C',
          explanation: 'C is correct: PR-level SAST as a required status check achieves the optimal balance of three factors: (1) Enforcement — it is mandatory and cannot be skipped; unlike IDE plugins (ignored by developers) or pre-commit hooks (bypassed with git commit --no-verify), a required PR check prevents code with critical findings from merging; (2) Developer context — the code was recently written so remediation is fast and accurate; (3) Catch before integration — vulnerabilities are identified before entering the shared main branch. | A: IDE plugins are voluntary — developers control whether to act. "Maximum effectiveness" requires enforcement, not just availability. | B: Pre-commit hooks can be bypassed with --no-verify and fire on every commit including WIP, generating noise. | D: After the Docker build, code has already been committed and merged — potentially hours or days earlier and built upon by other developers. Earlier is always better for SAST. | E: Post-deployment violates shift-left entirely — vulnerabilities are discovered only after they are running in production, requiring emergency patching.'
        },
        {
          id: 'q3', stem: 'Which control BEST ensures payment processor API keys and database credentials are never stored in code, Dockerfiles, or container images?',
          type: 'single',
          options: {
            A: 'Move secrets to a .env file in the project root, exclude it with .gitignore, and document required variables in README.md',
            B: 'Use Docker ARG instructions instead of ENV to pass secrets at build time, preventing them from appearing in the final image filesystem',
            C: 'Store all secrets in AWS Secrets Manager and configure the application to retrieve them at runtime using the EC2 instance\'s IAM role — no secrets in code, Dockerfiles, or environment variables baked into the image',
            D: 'Base64-encode secrets before storing them as ENV instructions in the Dockerfile to prevent plaintext exposure',
            E: 'Store secrets in Jenkins encrypted environment variables and inject them at deployment time via docker run -e'
          },
          correct: 'C',
          explanation: 'C is correct: AWS Secrets Manager (or equivalent: HashiCorp Vault, Azure Key Vault) is the standard for containerized CI/CD secrets. Implementation: secrets are stored in Secrets Manager with rotation policies and access auditing; the EC2 instance has an IAM role with secretsmanager:GetSecretValue scoped to specific ARNs; the application calls the Secrets Manager API at startup. No secret ever exists in code, Dockerfiles, image layers, build logs, or baked-in env vars. For PCI-DSS, this satisfies Req 8 (unique authentication) and Req 3 (protection of cardholder data credentials). | A: A .gitignore .env file prevents git commits but leaves secrets on developer laptops, requires manual copy to every EC2 instance, and provides no centralized rotation. | B: Docker ARG values are NOT stored in the final image filesystem — however, they ARE visible in docker image history --no-trunc and in CI/CD build output. ARG is safer than ENV but does not prevent exposure. | D: Base64 is encoding, not encryption. echo "string" | base64 -d instantly recovers the plaintext — zero security. | E: Jenkins env vars are better than Dockerfiles but secrets are visible in docker inspect on the running container and in /proc/PID/environ. A compromised Jenkins instance exposes all secrets; no centralized rotation or audit logging.'
        },
        {
          id: 'q4', stem: 'The penetration test is scheduled one week before go-live for a PCI-DSS-scoped payment API. Which statement BEST describes the risk of this timing?',
          type: 'single',
          options: {
            A: 'One week is insufficient to remediate critical findings; architectural vulnerabilities discovered during the test cannot be safely fixed and retested in that timeframe, forcing a choice between launching with known flaws or delaying the launch',
            B: 'Penetration tests scheduled immediately before launch are more focused because testers prioritize only exploitable issues, reducing findings and making remediation easier',
            C: 'One week is adequate for remediating common vulnerabilities such as XSS and SQLi; a follow-up test 30 days post-launch can catch remaining issues',
            D: 'API penetration testing is less effective than web app testing; the team would get more value from automated DAST scans',
            E: 'The risk is acceptable because PCI-DSS only requires an annual penetration test; performing one before launch satisfies the compliance requirement'
          },
          correct: 'A',
          explanation: 'A is correct: The fundamental risk is the remediation timeline mismatch. Real penetration tests of payment APIs frequently uncover architectural flaws — authentication bypass, broken access control, insecure cryptographic implementations, mass assignment vulnerabilities, improper input validation at the framework level. These require design changes, not simple patches — development time, code review, and retest before resolution. One week is insufficient for this cycle. The forced choice: (1) launch with documented known critical vulnerabilities in a PCI-DSS system (legal liability, regulatory exposure, breach risk), or (2) delay the launch. Correct timing: 4-8 weeks before go-live. | B: Proximity to launch does not improve test focus or quality; late-stage tests are worse because developers are in launch-prep mode, not remediation mode. | C: "One week for XSS/SQLi" misunderstands payment API penetration testing — architectural auth and authorization flaws require weeks of development. Operating a known-vulnerable payment system for 30 days post-launch is a direct PCI-DSS violation if critical findings are known and unresolved. | D: API penetration testing is highly effective and finds business logic flaws, chained vulnerabilities, and authorization issues that automated DAST cannot detect. PCI-DSS Req 11.4 specifically requires it; DAST does not substitute. | E: PCI-DSS compliance timing does not resolve the remediation feasibility problem — a "compliant" test that uncovers critical findings with no time to fix them is operationally equivalent to having no test.'
        }
      ]
    },

    /* ── pbq_mix_01 ── TLS Configuration Selection Lab ──────────────────── */
    {
      id: 'pbq_mix_01', type: 'configuration', domain: '1.0',
      title: 'TLS Configuration Selection Lab',
      scenario: 'A security engineer is configuring TLS for a new internal REST API used by a mobile banking application. The API handles authentication tokens, session management, and account data. Regulatory context: PCI-DSS 4.0, FFIEC guidance on internet banking security, and the organization\'s internal security baseline.\n\nFor each configuration parameter below, select the MOST appropriate value for this banking API deployment.',
      questions: [
        {
          id: 'q1', stem: 'Minimum TLS Version: Which version should be set as the minimum accepted protocol version?',
          type: 'single',
          options: { A: 'TLS 1.0', B: 'TLS 1.1', C: 'TLS 1.2', D: 'TLS 1.3' },
          correct: 'D',
          explanation: 'D is correct: TLS 1.3 is required for any new banking API deployment. TLS 1.0 and 1.1 are formally deprecated by RFC 8996 (2021) and explicitly prohibited by PCI-DSS 4.0 Req 6.2.4. TLS 1.3 eliminates all cipher suites vulnerable to BEAST, LUCKY13, POODLE, and RC4 attacks; removes CBC cipher modes; mandates AEAD ciphers; enforces forward secrecy in every session via ephemeral key exchange; and reduces the handshake from 2 round trips to 1. For a new deployment where both client and server are under your control, there is no justification for permitting anything below TLS 1.3. | C (TLS 1.2): Acceptable as a fallback minimum when legacy clients must be supported, but PCI-DSS 4.0 recommends TLS 1.3 for new deployments. | A and B: Prohibited by RFC 8996 and PCI-DSS — both are vulnerable to downgrade attacks.'
        },
        {
          id: 'q2', stem: 'Cipher Suite Priority: Which cipher suite should have the HIGHEST priority in the server preference list?',
          type: 'single',
          options: { A: 'RC4-SHA', B: 'AES-128-CBC-SHA', C: 'AES-256-GCM-SHA384', D: '3DES-EDE-CBC' },
          correct: 'C',
          explanation: 'C is correct: AES-256-GCM-SHA384 is an AEAD (Authenticated Encryption with Associated Data) cipher suite providing confidentiality (AES-256) and integrity (GCM authentication tag). AEAD ciphers are immune to padding oracle attacks (LUCKY13, POODLE) that affect CBC-mode ciphers because there is no padding to attack. AES-GCM is hardware-accelerated via AES-NI on all modern processors. SHA-384 for the MAC and key derivation is stronger than SHA-1. | A (RC4-SHA): RC4 prohibited by RFC 7465 in 2015 due to statistical biases enabling practical decryption — removed from all modern TLS libraries, banned by PCI-DSS. | B (AES-128-CBC-SHA): CBC mode is susceptible to BEAST and LUCKY13 timing attacks; SHA-1 MAC is deprecated. Even in TLS 1.2, AES-GCM must be preferred over AES-CBC. | D (3DES-EDE-CBC): Deprecated by NIST (effective 2023) due to SWEET32 birthday attack at 64-bit block size — also prohibited by PCI-DSS 4.0.'
        },
        {
          id: 'q3', stem: 'Certificate Type: Which certificate type is MOST appropriate for this banking API?',
          type: 'single',
          options: {
            A: 'Self-signed certificate',
            B: 'DV (Domain Validated) certificate',
            C: 'OV (Organization Validated) certificate',
            D: 'EV (Extended Validation) certificate'
          },
          correct: 'C',
          explanation: 'C is correct: OV certificates are the minimum appropriate type for a financial services API. The CA verifies domain control AND organizational identity — confirming the requesting entity legally exists and is authorized for this domain. Mobile app clients need assurance they are connecting to a verified organizational entity, not just any domain holder. OV satisfies this without the operational overhead of EV. | A (Self-signed): Every client must be manually configured to trust the specific certificate — operationally infeasible for a banking mobile app and creates MITM risk. | B (DV): Verifies only domain control, not organizational identity. Any person controlling the domain can obtain a DV certificate. Insufficient for financial services per FFIEC and NIST 800-52. | D (EV): Provides the highest verification level but for a back-end API with no browser-facing component, EV\'s additional verification overhead provides no material security benefit over OV. EV is appropriate for consumer-facing banking websites, not back-end APIs.'
        },
        {
          id: 'q4', stem: 'Certificate Key Length: Which RSA key length is MOST appropriate for a banking API certificate with a 2-year validity period?',
          type: 'single',
          options: { A: '512-bit RSA', B: '1024-bit RSA', C: '2048-bit RSA', D: '4096-bit RSA' },
          correct: 'D',
          explanation: 'D is correct: 4096-bit RSA is most appropriate for a banking application. NIST SP 800-57 specifies 2048-bit as the minimum through 2030, but banking applications should use 4096-bit because: (1) financial regulatory guidance (FFIEC) recommends it for financial systems; (2) a certificate issued today must remain secure for its full 2-year validity period — 4096-bit provides a larger security margin against improving factoring attacks; (3) RSA asymmetric operations occur only during the TLS handshake, not bulk data encryption — the performance overhead of 4096-bit vs 2048-bit is one-time per session. For a banking API where security margin outweighs slight handshake overhead, 4096-bit is justified. | A (512-bit): Factored in 1999. Completely insecure. | B (1024-bit): Feasible to factor with nation-state resources — browsers stopped issuing 1024-bit certs in 2013-2014. | C (2048-bit): The correct MINIMUM for any new deployment, but "minimum acceptable" is not "most appropriate for a banking API."'
        },
        {
          id: 'q5', stem: 'Forward Secrecy: Which key exchange mechanism should be configured to ensure forward secrecy for all sessions?',
          type: 'single',
          options: {
            A: 'Disabled',
            B: 'RSA key exchange (static RSA)',
            C: 'ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) key exchange'
          },
          correct: 'C',
          explanation: 'C is correct: ECDHE provides forward secrecy — each TLS session uses a fresh ephemeral (one-time) key pair generated for that session only. The session key is never derivable from the server\'s long-term private key. If an attacker records all encrypted banking API traffic today and later compromises the server\'s private key (theft, legal compulsion, breach), they cannot decrypt any previously recorded session. Each ephemeral key is destroyed after the session ends. | B (Static RSA): The client encrypts a pre-master secret with the server\'s RSA public key. If the private key is ever compromised, ALL previously recorded sessions — potentially years of banking transactions — can be decrypted retroactively. This "crack now, decrypt later" risk is unacceptable for banking. Static RSA is explicitly removed from TLS 1.3. | A (Disabled): No forward secrecy means all sessions are vulnerable to retroactive decryption upon private key compromise. TLS 1.3 mandates ephemeral key exchange for this reason.'
        },
        {
          id: 'q6', stem: 'Certificate Pinning: Which pinning approach BEST balances security and operational maintainability for a banking mobile application?',
          type: 'single',
          options: {
            A: 'Not implemented — rely on the device OS trust store',
            B: 'Public key pinning — pin the hash of the server\'s public key',
            C: 'Certificate pinning — pin the hash of the complete server certificate'
          },
          correct: 'B',
          explanation: 'B is correct: Public key pinning ties the mobile app to a specific public key, not a specific certificate. When the certificate expires and is renewed (typically every 1-2 years), the same key pair can be retained — the public key hash remains constant and the pin remains valid without a mobile app update. Operators can embed backup pins (hashes of secondary key pairs) so that if the primary key must be replaced, existing app installs already trust the backup. OWASP MASTG recommends public key pinning for mobile financial applications. | C (Certificate pinning): Pins the full certificate hash. When the certificate expires — even if the key pair is unchanged — the new certificate has a different serial number and validity period, producing a different hash. The pin is invalid and the mobile app refuses to connect until an app update ships the new pin. Certificate renewals become operational crises. For a mobile banking app, an expired pin causing the app to refuse connections is a critical business continuity failure. | A (Not implemented): Without pinning, any certificate from any of the hundreds of globally trusted CAs is accepted. A rogue or compromised CA can issue a certificate for the banking domain that the app will accept — enabling a perfect undetectable MITM attack intercepting auth tokens.'
        }
      ]
    },

    /* ── pbq_mix_02 ── SOC Incident Classification and Escalation ────────── */
    {
      id: 'pbq_mix_02', type: 'classification', domain: '4.0',
      title: 'SOC Incident Classification and Escalation',
      scenario: 'A SOC Tier-1 analyst begins their shift with 6 open alerts. Each requires classification and an escalation decision.\n\nClassification options: True Positive (TP) | False Positive (FP) | Benign True Positive (BTP) | Undetermined\nEscalation options: Close ticket | Escalate to Tier 2 | Escalate to IR team | Notify CISO | Notify legal/compliance\n\nAlert 1 — Endpoint: CrowdStrike on FINANCE-PC-07 detects svchost32.exe (NOT legitimate svchost.exe) attempting to enumerate and encrypt files in \\\\SERVER01\\Finance-Share. Process spawned from a macro in Invoice_Q2.xlsm opened 11 minutes ago. Files being renamed with .locked extension. Ransom note text detected in process memory.\n\nAlert 2 — AV: Windows Defender on ADMIN-PC-03 flags C:\\Tools\\PsExec.exe as "HackTool:Win32/PsExec.A." IT help desk uses PsExec daily. The flagged file\'s SHA-256 matches the official Sysinternals download. An exception was documented 90 days ago in the approved software inventory.\n\nAlert 3 — Auth: CEO account j.mcallister authenticated at 3:17 AM Saturday from Singapore (IP 202.45.67.88). Most recent prior login: Tuesday 9:03 AM from Chicago office (10.20.1.5). HR travel records show no scheduled international travel. MFA is registered on the account.\n\nAlert 4 — Network IDS: High connection volume from 10.10.50.100 (VULN-SCANNER-01) performing TCP SYN probes against all hosts in 10.20.0.0/16. Same scanner performed identical activity last month and the month before. Source IP is in this month\'s approved maintenance schedule signed by the CISO.\n\nAlert 5 — DLP: User m.johnson uploaded financial_models_FY2024_proprietary.zip (1.2 GB) to personal Dropbox at 11:47 PM via corporate guest Wi-Fi. m.johnson submitted resignation 2 days ago; last day is in 13 days. DLP classifies contents as "Restricted — Proprietary Financial Models."\n\nAlert 6 — IDS: Snort SID 1002345 "SQL Injection attempt via UNION SELECT" against WEB-01 (10.10.10.5) from Tor exit node 185.220.101.45. The web framework (Django 3.2) was patched to v3.2.19 six months ago, which addressed the specific SQLi vulnerability this signature targets.',
      questions: [
        {
          id: 'q1', stem: 'Which TWO alerts are True Positives requiring IMMEDIATE escalation to the IR team? (Select TWO)',
          type: 'multi',
          options: {
            A: 'Alert 1 — Ransomware encrypting Finance share files',
            B: 'Alert 2 — AV flag on IT team\'s documented PsExec tool',
            C: 'Alert 3 — CEO login from Singapore at 3 AM',
            D: 'Alert 4 — Vulnerability scanner during approved maintenance window',
            E: 'Alert 5 — Resigning employee uploads proprietary financial models to personal Dropbox',
            F: 'Alert 6 — SQLi IDS signature against patched web server'
          },
          correct: ['A', 'E'],
          explanation: 'A is correct (TP / IR team): Alert 1 is unambiguous ransomware in progress — svchost32.exe impersonating legitimate svchost.exe (known evasion technique), spawned from a macro document (confirmed delivery vector), files actively renamed with .locked extension, ransom note in memory. Every second of delay allows more file encryption. IR team must isolate FINANCE-PC-07 immediately. | E is correct (TP / IR team): Alert 5 is unambiguous data exfiltration — resigning employee (highest-risk insider threat window: the resignation-to-departure period is when IP theft most commonly occurs), 1.2 GB of classified proprietary financial models, uploaded to personal cloud after business hours. Requires IR for forensic preservation AND legal/compliance notification for potential IP theft and securities law implications (if the archive contains unreleased earnings data). | B: False Positive — PsExec is a legitimate dual-use tool, hash-verified against the Sysinternals official download, with a documented exception. Windows Defender flags all PsExec by default. | C: Undetermined — suspicious but requires context gathering before classification. | D: Benign True Positive — the port scan is real and authorized. | F: Likely False Positive — vulnerability was patched, but verification is required first.'
        },
        {
          id: 'q2', stem: 'Which alert is a Benign True Positive that should be CLOSED without any escalation?',
          type: 'single',
          options: {
            A: 'Alert 1 — Ransomware on FINANCE-PC-07',
            B: 'Alert 2 — AV flag on PsExec',
            C: 'Alert 3 — CEO login from Singapore',
            D: 'Alert 4 — Vulnerability scanner port scan during approved maintenance',
            E: 'Alert 5 — DLP alert for resigning employee file upload',
            F: 'Alert 6 — SQLi IDS signature against patched server'
          },
          correct: 'D',
          explanation: 'D is correct (BTP): Alert 4 meets the precise BTP definition — the event IS real (the port scan is genuinely occurring, the IDS is not misfiring), the activity is expected from a known authorized source (VULN-SCANNER-01 in the CISO-approved maintenance schedule), and it is recurring as part of an approved security program (same scanner, same time window, every month for 3 months). BTP vs FP distinction: FP = the alert fired on something that DID NOT happen; BTP = the alert fired on something that DID happen but is authorized/expected. Correct action: close the ticket with a note referencing the maintenance schedule entry; optionally create a suppression rule for future scan windows. | B (Alert 2): This is arguably a False Positive — Defender fires on PsExec because of its heuristic rule, not because anything malicious occurred. The tool IS legitimate, hash-verified and documented. FP is the canonical SOC classification for a detection firing on a documented exception. | A, C, E: All require escalation and cannot be closed.'
        },
        {
          id: 'q3', stem: 'The CEO\'s account authenticated at 3:17 AM from Singapore while the most recent prior login was Tuesday 9 AM from Chicago with no travel records on file. The CEO has MFA registered. Which classification and action is MOST appropriate for a Tier-1 analyst?',
          type: 'single',
          options: {
            A: 'True Positive — Escalate to IR team and lock the CEO\'s account immediately',
            B: 'False Positive — Close the ticket; executives travel frequently and authenticate from unexpected locations',
            C: 'Undetermined — Escalate to Tier 2 with full context: check if MFA approval came from the CEO\'s registered device, review other session activity, verify travel with the CEO\'s EA, and check VPN logs for a Singapore exit explanation',
            D: 'True Positive — Notify the CISO immediately and request authorization to lock the account before gathering context',
            E: 'Benign True Positive — Document the anomalous login and monitor for additional suspicious activity without escalation'
          },
          correct: 'C',
          explanation: 'C is correct: Alert 3 is UNDETERMINED — suspicious but not confirmed. The geographic anomaly is significant (Chicago → Singapore in 42 hours is physically possible but not in HR travel records), but legitimate explanations exist: the CEO could be traveling on personal time not logged in HR, using a VPN exiting in Singapore, or a trusted colleague had temporary access. Critically, MFA was satisfied — suggesting either the CEO\'s registered device was present or the credential + OTP was intercepted. Correct Tier-1 action: escalate to Tier 2 with full context. Tier 2 can: check whether MFA approval came from the CEO\'s registered phone, review all active CEO sessions, contact the EA to verify travel, check VPN logs. This converts "Undetermined" to TP or FP before any disruptive action. | A: Locking the CEO\'s account at 3 AM without confirmation creates executive disruption and business impact if this is a legitimate session. | B: "Executives travel" is not acceptable grounds for closing an impossible-travel alert without verification. | D: CISO notification before Tier-2 investigation wastes executive attention; reserve for confirmed incidents. | E: Monitoring without escalation leaves a potential account compromise unaddressed for hours.'
        },
        {
          id: 'q4', stem: 'Alert 5 is confirmed True Positive — endpoint forensics shows the archive contains proprietary pricing models and unreleased earnings data. Which TWO escalation actions are BOTH required? (Select TWO)',
          type: 'multi',
          options: {
            A: 'Close the ticket — the employee is still employed and has not violated policy yet by possessing these files',
            B: 'Escalate to the IR team for forensic preservation and investigation of the endpoint and any other transfer activity',
            C: 'Notify legal and compliance teams due to potential trade secret theft and securities law implications (unreleased earnings data)',
            D: 'Escalate to Tier 2 for further analysis before notifying any additional teams',
            E: 'Notify the employee\'s direct manager only and defer to the HR termination process'
          },
          correct: ['B', 'C'],
          explanation: 'B is correct (IR team): Forensic investigation must happen NOW before the employee\'s last day (13 days away). The device must be imaged while evidence is accessible; the investigation must determine whether this was the only transfer or if additional data was exfiltrated over a longer period. After the last day, the device is typically wiped. | C is correct (Legal and compliance): Two distinct legal concerns require immediate legal team involvement: (1) "Proprietary pricing models" = potential trade secret theft under the Defend Trade Secrets Act (DTSA) and the employment agreement\'s IP assignment clause; (2) "Unreleased earnings data" = material non-public information (MNPI) — exfiltration by an employee is a potential insider trading or securities fraud issue requiring immediate securities counsel notification and potential SEC disclosure assessment. | A: Employees have no right to exfiltrate company IP regardless of employment status. The upload to personal cloud is the violation event. | D: Tier-2 escalation is for ambiguous alerts; this is a confirmed TP with confirmed restricted content — direct escalation to IR and legal is required. | E: Manager notification without legal and IR involvement risks evidence contamination (manager may alert the employee, prompting evidence destruction) and bypasses mandatory notification channels.'
        }
      ]
    },

    /* ── pbq_mix_03 ── Risk Register Prioritization ──────────────────────── */
    {
      id: 'pbq_mix_03', type: 'risk-register', domain: '5.0',
      title: 'Risk Register Prioritization and Treatment',
      scenario: 'Six risks identified in the annual security risk assessment. Risk Score = Likelihood x Impact (1–5 scale).\n\n  R1: Unpatched EOL ERP system with known exploitable CVEs. Processes payroll/AP for 2,000 staff.\n      Likelihood: 4 | Impact: 4 | Control: Annual vuln scan only; patches deferred\n\n  R2: Ransomware encrypts all production servers and backup copies; 5-7 day recovery from offline tapes.\n      Likelihood: 3 | Impact: 5 | Control: Weekly offline tape backups; EDR on endpoints only; no network segmentation\n\n  R3: Volumetric DDoS makes corporate website/customer portal unavailable 4-8 hours.\n      Likelihood: 3 | Impact: 3 | Control: Web server rate limiting (interim while DDoS mitigation service is being procured)\n\n  R4: APT compromises executive email accounts; gains M&A strategy, board comms, MNPI.\n      Likelihood: 2 | Impact: 5 | Control: Standard email filtering; no executive-specific controls\n\n  R5: Credential stuffing on low-criticality collaboration tools lacking SSO; exposes internal project data.\n      Likelihood: 3 | Impact: 2 | Control: AD password complexity policy; collaboration tools use separate local credentials\n\n  R6: Physical flooding of primary data center (FEMA flood zone) destroys all on-prem hardware.\n      Likelihood: 1 | Impact: 5 | Control: Daily offsite cloud backup (AWS S3 Glacier); no secondary DC',
      questions: [
        {
          id: 'q1', stem: 'Using Risk Score = Likelihood x Impact, which sequence correctly ranks the six risks from HIGHEST to LOWEST?',
          type: 'single',
          options: {
            A: 'R1 (16) > R2 (15) > R4 (10) > R3 (9) > R5 (6) > R6 (5)',
            B: 'R1 (16) > R2 (15) > R3 (9) > R4 (10) > R5 (6) > R6 (5)',
            C: 'R2 (15) > R4 (10) > R6 (5) > R1 (16) > R3 (9) > R5 (6)',
            D: 'R1 (16) > R2 (15) > R4 (10) > R5 (6) > R3 (9) > R6 (5)',
            E: 'R6 (5) > R5 (6) > R3 (9) > R4 (10) > R2 (15) > R1 (16)'
          },
          correct: 'A',
          explanation: 'A is correct: R1: 4×4=16 | R2: 3×5=15 | R3: 3×3=9 | R4: 2×5=10 | R5: 3×2=6 | R6: 1×5=5. Ranked: R1>R2>R4>R3>R5>R6. | The key trap is R4 vs R3: R4 scores 10 (2×5) and ranks ABOVE R3 which scores 9 (3×3), even though R3 has higher likelihood. Candidates who sort by likelihood alone choose B (placing R3 before R4) — but 3×3=9 is mathematically less than 2×5=10. A low-probability catastrophic event (APT gaining MNPI with irreversible espionage impact) represents more total expected risk than a moderate-probability moderate-impact event (DDoS with bounded availability impact). Risk scoring exists precisely to prevent this intuitive error — humans overweight likelihood and underweight catastrophic tail-risk impacts. | C: Sorts by impact alone (all Impact=5 risks first) — ignores likelihood. | D: Inverts R5 and R3 (R5 scores 6, R3 scores 9 — R3 must rank above R5). | E: Reversed.'
        },
        {
          id: 'q2', stem: 'R1 (unpatched EOL ERP, score 16) is the highest-priority risk. Which treatment is MOST appropriate as the PRIMARY response?',
          type: 'single',
          options: {
            A: 'Accept — the ERP\'s business criticality and 2-hour downtime limit makes remediation too disruptive; document and accept with management sign-off',
            B: 'Avoid — decommission the ERP system immediately to eliminate the vulnerability',
            C: 'Mitigate — schedule a patching window, deploy WAF and network-layer compensating controls during the patch cycle, and implement continuous vulnerability monitoring',
            D: 'Transfer — purchase a cyber insurance policy covering ERP system compromise to shift the financial liability',
            E: 'Accept with conditions — place the system behind a VPN and revisit patching in the next annual budget cycle'
          },
          correct: 'C',
          explanation: 'C is correct: A score of 16/25 cannot be accepted without exhausting mitigation options first. Mitigation steps: (1) schedule an emergency patch window during a low-traffic period even if limited to 2 hours; (2) deploy network segmentation and WAF as compensating controls during the patch cycle to reduce exploitability; (3) implement continuous vulnerability scanning for the ERP subnet; (4) engage the vendor for an emergency patch or workaround. The 2-hour downtime constraint is an operational challenge, not a justification for leaving a known-exploitable payroll system unpatched. For a financial services firm, accepting unpatched known vulnerabilities may also violate regulatory requirements (NYDFS 23 NYCRR 500, GLBA Safeguards Rule). | A: Accepting a score-16 risk without first exhausting mitigation is not defensible. | B: Decommissioning is theoretically clean but not feasible if the system processes payroll for 2,000 employees with no identified replacement. Avoid requires eliminating the activity — here payroll cannot be eliminated. | D: Insurance covers financial impact but does not remediate the vulnerability. A known-exploitable system may also void insurance coverage. | E: VPN restricts network access but does not remediate the exploitable vulnerability; deferring 12 months is unacceptable for a score-16 risk.'
        },
        {
          id: 'q3', stem: 'Strong technical mitigations for R2 (ransomware) are now in place: server-side EDR, network segmentation, and daily immutable offline backups. Residual risk remains because ransomware TTPs evolve faster than defenses. Which treatment is MOST appropriate for the RESIDUAL risk?',
          type: 'single',
          options: {
            A: 'Accept — no controls can eliminate ransomware risk entirely; board acknowledges the residual risk in writing',
            B: 'Mitigate further — add application allowlisting, PAM, and zero trust segmentation to continue reducing the score',
            C: 'Transfer — obtain cyber insurance covering ransomware payment, business interruption, and IR expenses to shift the financial impact of the residual risk',
            D: 'Avoid — prohibit all email attachments and external USB connections to eliminate ransomware delivery vectors',
            E: 'Accept with compensating controls — add monitoring and require CISO approval before any ransom payment decision'
          },
          correct: 'C',
          explanation: 'C is correct: Transfer via cyber insurance is the most appropriate treatment for residual ransomware risk after strong technical mitigations. Risk transfer is designed for scenarios where: (1) the risk cannot be fully eliminated (ransomware TTPs evolve faster than defenses — even the best-defended organizations get hit); (2) the financial impact is catastrophic (R2 Impact=5: full rebuild, 5-7 day outage, potential ransom payment, regulatory notification costs); (3) all cost-effective mitigations are already in place. The model: mitigate what you can, transfer what remains at reasonable cost. | A: Accepting a catastrophic-impact residual risk without financial protection is irresponsible for a financial services firm. Acceptance is appropriate for LOW-score residual risks, not Impact=5. | B: Additional technical controls will reduce likelihood further, but Impact remains 5 regardless — ransomware always has catastrophic potential if any attack succeeds. At some point marginal mitigation investment has diminishing returns vs. the cost-effective residual transfer. | D: Prohibiting email attachments would cause severe business disruption — not a viable business decision. | E: CISO approval for ransom payment is governance, not risk treatment. The financial exposure is not addressed by an approval workflow.'
        },
        {
          id: 'q4', stem: 'One of the six risks has a COMPENSATING control listed rather than a primary control. Which risk is it, and what identifies the control as compensating?',
          type: 'single',
          options: {
            A: 'R1 — Annual vulnerability scanning is compensating because continuous monitoring would be the primary control',
            B: 'R2 — Offline tape backups are compensating because real-time replication to a secondary site is the primary control',
            C: 'R3 — Web server rate limiting is compensating: explicitly deployed as an interim measure while the primary control (dedicated DDoS mitigation service) is being procured',
            D: 'R4 — Standard email filtering is compensating because executive-specific DMARC enforcement would be the primary control',
            E: 'R6 — Offsite cloud backup is compensating because a geographically redundant secondary DC would be the primary control for physical DR'
          },
          correct: 'C',
          explanation: 'C is correct: R3\'s web server rate limiting meets the precise definition of a compensating control — it is deployed IN PLACE OF the primary control (dedicated DDoS mitigation service) because the primary cannot yet be implemented (procurement is pending), and it provides only partial protection until the primary control is available. Three defining characteristics are met: (1) labeled as "interim measure" — temporary, not permanent; (2) substitutes for a specific identified primary control (DDoS mitigation service contract); (3) provides only partial protection — rate limiting blocks simple single-source attacks but cannot absorb large volumetric distributed attacks. The register text itself signals its compensating nature: "deployed as interim measure while dedicated DDoS mitigation service contract is finalized." | A: Annual vuln scanning for R1 is a detective/assessment control with a gap (no continuous monitoring), but it is not labeled as compensating and does not substitute for a specific identified primary control. | B: Offline tape backups for R2 are a primary recovery control — they are not substituting for a different primary control. | D: Standard email filtering for R4 is an existing primary control with gaps — not designated as interim or as a substitute. | E: Offsite cloud backup for R6 is a primary DR control; the absence of a secondary DC is a gap, not a compensating control arrangement.'
        }
      ]
    },

    /* ── pbq_mix_04 ── Data Classification and Handling Controls ─────────── */
    {
      id: 'pbq_mix_04', type: 'classification', domain: '5.0',
      title: 'Data Classification and Handling Controls',
      scenario: 'A data governance team reviews six data types from an enterprise data inventory.\n\nClassification Taxonomy:\n  Public:       Approved for unrestricted external distribution. No harm if disclosed.\n  Internal:     For internal use only. Limited impact if disclosed.\n  Confidential: Sensitive business or personal data. Significant harm if disclosed.\n  Restricted:   Highest sensitivity. Severe or irreversible harm if disclosed. Regulatory/legal obligations govern access.\n  Restricted (Critical Infra): Air-gapped storage; MFA for all access; full audit logging; need-to-know enforced by policy.\n\nData Types:\n  A: Employee salary, bonus, and compensation data (individual-level figures for all 2,000 employees)\n  B: Approved press releases and marketing materials published on the company\'s public website\n  C: Customer PII including full names, addresses, dates of birth, and Social Security Numbers (SSNs)\n  D: Internal meeting notes from a weekly project status meeting (5 developers; topics: sprint velocity, blockers, resource requests)\n  E: Source code for the organization\'s proprietary trading algorithm — primary competitive advantage\n  F: Access credentials (username, PIN, certificate) for a nuclear power plant\'s ICS safety shutdown relay',
      questions: [
        {
          id: 'q1', stem: 'Which TWO data types are correctly classified as RESTRICTED — the highest sensitivity tier? (Select TWO)',
          type: 'multi',
          options: {
            A: 'A — Employee salary and compensation data',
            B: 'B — Approved press releases',
            C: 'C — Customer PII including SSNs',
            D: 'D — Internal project meeting notes',
            E: 'E — Proprietary trading algorithm source code',
            F: 'F — Nuclear ICS safety shutdown relay credentials'
          },
          correct: ['C', 'F'],
          explanation: 'C is correct (Restricted): Customer SSNs meet the Restricted threshold because: (1) SSNs are specifically identified as sensitive personal information in federal law (Privacy Act, GLBA, FTC Safeguards Rule) and every state breach notification statute — unauthorized disclosure triggers mandatory breach notification; (2) SSNs cannot be changed once disclosed — exposure causes irreversible, long-term harm (identity theft, credit fraud, tax fraud for the victim\'s lifetime); (3) financial services firms are subject to GLBA, CCPA, and state financial privacy laws mandating Restricted-equivalent handling with encryption in transit and at rest plus access controls. | F is correct (Restricted — Critical Infrastructure): Nuclear ICS credentials are the most sensitive category — compromise directly enables manipulation of physical safety systems at a nuclear facility. Consequences include facility shutdown, radiation release, or catastrophic failure — irreversible, life-safety impacts affecting populations beyond the organization. NRC regulations and NERC CIP mandate the highest available classification for cyber assets that could adversely impact nuclear safety. | A (Salary — Confidential, not Restricted): Individual compensation data requires Confidential handling (encryption at rest, access controls) but does not reach Restricted because the harm of disclosure is significant but not catastrophic or irreversible at the organizational level. | E (Source code — Confidential, not Restricted): A trade secret requiring strong protection but not Restricted because: harm is competitive and financial (not safety-critical or irreversible to individuals); legal remedies exist (trade secret misappropriation); source code cannot cause physical harm.'
        },
        {
          id: 'q2', stem: 'Which data type is most commonly OVER-classified — assigned a HIGHER level than its actual sensitivity warrants?',
          type: 'single',
          options: {
            A: 'A — Employee salary data',
            B: 'B — Approved press releases',
            C: 'C — Customer PII including SSNs',
            D: 'D — Internal project meeting notes',
            E: 'E — Proprietary trading algorithm source code',
            F: 'F — Nuclear ICS credentials'
          },
          correct: 'D',
          explanation: 'D is correct: Internal project meeting notes (sprint velocity, blockers, resource requests from a dev team) are routinely over-classified as Confidential when the correct level is Internal. Why analysts over-classify: (1) the word "internal" in the classification name feels inadequate for "real business documents"; (2) meeting notes may reference sensitive-sounding topics (budget, personnel, architecture) prompting analysts to classify up out of caution; (3) organizations fail to provide sufficient classification examples. Correct analysis: internal meeting notes about sprint velocity do not contain PII, financial data, IP, or information causing significant harm if disclosed to a general business audience. The impact of disclosure is "limited" — correctly Internal. Over-classifying Internal as Confidential triggers disproportionate handling requirements (encryption at rest, access logging), creates workflow friction, and contributes to classification fatigue where employees stop respecting the system. | A (Salary): Already correctly classified at Confidential — not commonly over-classified. | B (Press releases): Already at Public — no misclassification risk. | C (SSNs): Sometimes UNDER-classified as Confidential rather than Restricted. | E (Source code): Commonly UNDER-classified as Internal by developers who treat "our codebase" as routine internal info.'
        },
        {
          id: 'q3', stem: 'What is the MINIMUM set of handling controls required for customer PII including SSNs (Data Type C)?',
          type: 'single',
          options: {
            A: 'No special controls — customer data handled by authorized employees with valid system access requires no additional controls',
            B: 'Encryption at rest only — SSNs must be protected in storage; transmission between internal systems does not require encryption',
            C: 'Encryption in transit only — SSNs must be protected when transmitted; at-rest encryption is optional if the database is behind a firewall',
            D: 'Encryption in transit AND at rest — SSNs must be encrypted both when stored and when transmitted, with audit logging of all access',
            E: 'Air-gapped storage with MFA and full audit logging — SSNs require the same controls as critical infrastructure credentials'
          },
          correct: 'D',
          explanation: 'D is correct: Restricted PII including SSNs requires encryption in transit AND at rest — both controls address different threat vectors: (1) Encryption at rest (AES-256 minimum) protects SSNs if storage media is physically stolen, database backups are intercepted, or an attacker gains raw storage layer access without application authentication; (2) Encryption in transit (TLS 1.2 minimum, TLS 1.3 preferred) protects SSNs from interception while they move between application servers, database servers, client devices, and partner systems. A network eavesdropper who cannot see data at rest can still see it in transit if transit encryption is absent — both vectors must be closed independently. Regulatory requirements: GLBA Safeguards Rule (updated 2023) explicitly requires encryption of customer financial information in transit and at rest. | B: Transmission is just as important as at-rest — internal network traffic is not inherently protected from insider threats, misconfigured taps, or attackers who have already gained lateral access. | C: At-rest encryption is equally required — "behind a firewall" does not protect the data if the firewall is bypassed, the database server is compromised, or a backup tape is stolen. | E: Air-gapped storage is required for Critical Infrastructure Restricted data (Type F). SSNs, while Restricted, are handled in transactional financial systems requiring network connectivity for real-time processing — air-gapping makes the data operationally inaccessible.'
        },
        {
          id: 'q4', stem: 'Nuclear ICS credentials (Data Type F) require air-gapped storage rather than standard Restricted handling. What is the PRIMARY reason?',
          type: 'single',
          options: {
            A: 'Nuclear credentials are much longer and more complex than standard passwords, requiring physically isolated storage to prevent format-related vulnerabilities',
            B: 'Air-gapped storage is mandated by PCI-DSS for credentials used to access industrial control systems',
            C: 'Air-gapped storage eliminates the network as an attack vector entirely — for data where credential compromise could enable manipulation of physical safety systems with potentially catastrophic and irreversible consequences, removing the network attack surface is warranted even at significant operational cost',
            D: 'Encryption in transit and at rest is technically insufficient for any Restricted data — all Restricted data should use air-gapped storage',
            E: 'Nuclear facility credentials rotate on a 24-hour cycle, making encrypted database storage impractical'
          },
          correct: 'C',
          explanation: 'C is correct: The distinguishing factor for nuclear ICS credentials is the nature and reversibility of harm from credential compromise. Encryption at rest + in transit reduces the probability of compromise but does not eliminate it — network-connected systems remain vulnerable to zero-days, supply chain attacks, nation-state actors, and insider threats regardless of encryption. For nuclear safety systems, even a single successful credential compromise could enable manipulation of a safety shutdown relay with potentially catastrophic, irreversible consequences. When the consequence of failure is irreversible catastrophic harm (not merely financial loss or PII exposure), eliminating the attack vector entirely — air-gapping — is justified at significant operational cost. This is the principle behind NERC CIP and NRC cybersecurity requirements for nuclear critical assets. | A: Credential length/complexity does not drive the air-gap requirement. Standard encryption handles any length. | B: PCI-DSS governs payment card data, not nuclear/ICS credentials. NRC regulations and NERC CIP govern nuclear facility cybersecurity. | D: Encryption in transit and at rest is fully appropriate for financial Restricted data (like SSNs). The air-gap is specific to Critical Infrastructure designations where network attack vectors must be eliminated. | E: Credential rotation frequency has no bearing on storage medium; air-gapped systems support rotation via physically controlled processes (removable media, dual-person integrity).'
        }
      ]
    },

    /* ── pbq_mix_05 ── Compliance Framework Mapping ─────────────────────── */
    {
      id: 'pbq_mix_05', type: 'compliance', domain: '5.0',
      title: 'Compliance Framework Mapping',
      scenario: 'A compliance manager maps eight specific requirements to the correct framework. Each requirement is worded as it appears in or is directly derived from the source framework. Two options are distractors.\n\nRequirements:\n  R1: "The organization shall define and apply an information security risk assessment process that identifies, analyzes, and evaluates information security risks."\n  R2: "A covered entity must provide an individual with access to the protected health information about them within 30 days of a request."\n  R3: "Primary account numbers must be rendered unreadable anywhere they are stored using one-way hashes, truncation, index tokens, or strong cryptography."\n  R4: "In the case of a personal data breach, the controller shall notify the competent supervisory authority without undue delay and, where feasible, not later than 72 hours after having become aware of it."\n  R5: "Agencies shall employ the concept of least privilege, allowing only authorized accesses for users that are necessary to accomplish assigned tasks in accordance with organizational missions and business functions."\n  R6: "Service organization management must provide a description of the service organization\'s system and assert that controls are suitably designed and operating effectively based on the applicable trust service criteria."\n  R7: "Responsible Entities must implement methods for authentication of individuals, hardware, or software; multi-factor authentication; or other methods providing equivalent security."\n  R8: "The Framework provides a common language for understanding, managing, and expressing cybersecurity risk to internal and external stakeholders. It consists of the Framework Core, Implementation Tiers, and Framework Profiles."\n\nFramework options (2 are distractors):\n  ISO/IEC 27001 | HIPAA | PCI DSS | GDPR | NIST SP 800-53 | SOC 2 | NERC CIP | NIST CSF | SOX [DISTRACTOR] | CMMC [DISTRACTOR]',
      questions: [
        {
          id: 'q1', stem: 'Requirement R4 states that organizations must notify supervisory authorities within 72 hours of a personal data breach. Which framework mandates this, and why do candidates commonly — but incorrectly — map this to HIPAA?',
          type: 'single',
          options: {
            A: 'HIPAA — the Breach Notification Rule requires covered entities to notify HHS within 72 hours of discovering a breach affecting more than 500 individuals',
            B: 'GDPR — Article 33 requires controllers to notify the competent supervisory authority within 72 hours; HIPAA uses entirely different timelines (60 days to individuals; 60 days to HHS for smaller breaches; immediate media notice for large state-level breaches)',
            C: 'PCI DSS — requirement 12.10 mandates notifying card brands and acquirers within 72 hours of a suspected cardholder data breach',
            D: 'NIST SP 800-53 — IR-6 requires federal agencies to report security incidents to US-CERT including 72-hour windows',
            E: 'SOC 2 — Type II reports must be delivered to customers within 72 hours of a material control failure'
          },
          correct: 'B',
          explanation: 'B is correct (GDPR, Article 33): The 72-hour breach notification requirement is one of GDPR\'s most distinctive provisions. Article 33 explicitly states notification must occur "without undue delay and, where feasible, not later than 72 hours" to the supervisory authority (e.g., ICO in the UK, CNIL in France). GDPR also requires separate notification to affected individuals under Article 34 "without undue delay" when high risk to individuals exists. | Why HIPAA is the common wrong answer: HIPAA Breach Notification Rule (45 CFR 164.400-414) uses entirely different timelines — notification to affected individuals: within 60 days of discovering the breach; notification to HHS Secretary: within 60 days for smaller breaches, 60 days of discovery for breaches affecting 500+ individuals; media notification (for 500+ in a state): within 60 days. HIPAA has no 72-hour requirement — 72 hours is definitively GDPR. | C (PCI DSS): PCI DSS requires notification "immediately" (interpreted as within 24 hours) for confirmed breaches — not 72 hours. | D (NIST 800-53): IR-6 addresses incident reporting but the 72-hour window in R4 is not NIST language; NIST references US-CERT timelines that vary by incident category.'
        },
        {
          id: 'q2', stem: 'Requirement R8 describes a framework with a Framework Core, Implementation Tiers, and Framework Profiles that provides a "common language" for cybersecurity risk. Which framework is this, and how does it differ from NIST SP 800-53?',
          type: 'single',
          options: {
            A: 'NIST SP 800-53 — the catalog of security and privacy controls for federal information systems, organized into control families (Access Control, Incident Response, etc.)',
            B: 'NIST Cybersecurity Framework (CSF) — a voluntary risk management framework originally developed for critical infrastructure, featuring five core functions (Identify, Protect, Detect, Respond, Recover) plus Govern added in CSF 2.0',
            C: 'ISO/IEC 27001 — an international standard for establishing and continually improving an ISMS using Plan-Do-Check-Act',
            D: 'CMMC — a DoD framework with five maturity levels assessing cybersecurity practices of defense contractors',
            E: 'SOC 2 — a reporting framework with five Trust Services Criteria: Security, Availability, Processing Integrity, Confidentiality, and Privacy'
          },
          correct: 'B',
          explanation: 'B is correct (NIST CSF): Framework Core, Implementation Tiers, and Framework Profiles are the three defining structural components of the NIST Cybersecurity Framework (CSF, v1.1 / 2.0). The "common language for communicating cybersecurity risk" is also definitively CSF language — designed as a communication tool for organizations to describe their current and target security posture to stakeholders and boards. CSF 2.0 (February 2024) added a sixth core function (GOVERN) to the original five. | How CSF differs from NIST SP 800-53 (which maps to R5): SP 800-53 is a comprehensive catalog of 1,000+ specific controls (AC-1, IR-6, SC-28, etc.) used by federal agencies to meet FISMA and by FedRAMP cloud service providers. It is prescriptive and mandatory for federal systems. CSF is a voluntary FRAMEWORK with a high-level structure for thinking about risk — it deliberately avoids prescribing specific controls and instead maps to other frameworks (800-53, ISO 27001, CIS Controls) via crosswalk tables. CSF is aspirational ("what should we do?"); 800-53 is prescriptive ("here are the required controls"). R5\'s "least privilege" language (allowing "only authorized accesses necessary to accomplish assigned tasks") maps to NIST SP 800-53 control AC-6.'
        },
        {
          id: 'q3', stem: 'Requirement R7 mandates that Responsible Entities implement MFA or equivalent for access to systems affecting critical infrastructure. Which framework contains this, and why is NIST SP 800-53 an incorrect mapping despite also requiring MFA?',
          type: 'single',
          options: {
            A: 'NIST SP 800-53 — IA-2 requires MFA for federal information systems; "Responsible Entities" is NIST\'s term for federal agencies',
            B: 'NERC CIP — specifically CIP-005 and CIP-007, governing Electronic Security Perimeters and systems security management for the bulk electric system; "Responsible Entities" is NERC CIP\'s defined term for utilities subject to these standards',
            C: 'CMMC — Level 2 and Level 3 require MFA for privileged accounts; defense contractors are called "Responsible Entities"',
            D: 'FedRAMP — Moderate baseline requires MFA for privileged accounts; "Responsible Entities" refers to cloud service providers under FedRAMP authorization',
            E: 'HIPAA — Security Rule 164.312(d) mandates authentication procedures; covered entities are the "Responsible Entities" under HIPAA terminology'
          },
          correct: 'B',
          explanation: 'B is correct (NERC CIP): "Responsible Entities" is a defined term specific to NERC CIP standards, referring to transmission owners, transmission operators, generation owners, generation operators, load-serving entities, and other organizations subject to NERC reliability standards. CIP-006-6 and CIP-007-6 contain the MFA requirement for access to Electronic Security Perimeters (ESPs) around Bulk Electric System (BES) Cyber Systems. NERC CIP is the mandatory reliability standard for the North American power grid, enforced by FERC with fines up to $1 million per day per violation. | Why NIST SP 800-53 is wrong despite also requiring MFA: NIST 800-53 AC-2, IA-2, and IA-3 require MFA for federal systems, but (1) NIST uses "organizations" or "agencies," not "Responsible Entities"; (2) NIST 800-53 applies to federal information systems, not electric utilities; (3) the requirement text "systems that can affect critical infrastructure" maps to NERC CIP\'s BES Cyber System terminology, not NIST\'s federal agency framing. The terminology "Responsible Entities" combined with "critical infrastructure" uniquely identifies NERC CIP. | A/C/D/E: All contain MFA requirements but none use "Responsible Entities" terminology and none specifically address the bulk electric system or North American grid reliability context.'
        },
        {
          id: 'q4', stem: 'SOX and CMMC are included as distractors. Which statement BEST explains why neither maps to any of the eight requirements listed?',
          type: 'single',
          options: {
            A: 'SOX and CMMC are outdated frameworks superseded by NIST SP 800-53 and GDPR respectively',
            B: 'SOX governs financial reporting accuracy and internal controls over financial reporting (not information security frameworks); CMMC governs cybersecurity maturity for DoD contractors (not general enterprise privacy, data protection, or critical infrastructure requirements). Neither maps to the categories described in R1 through R8',
            C: 'SOX and CMMC are valid frameworks but use proprietary terminology that cannot appear in a compliance mapping exercise',
            D: 'SOX and CMMC requirements are classified as government-sensitive and cannot appear in commercial compliance mapping exercises',
            E: 'SOX and CMMC require government-issued certifications that make them incompatible with private-sector compliance mapping'
          },
          correct: 'B',
          explanation: 'B is correct: SOX and CMMC are real and important frameworks but govern different scopes than R1-R8. | SOX (Sarbanes-Oxley Act, 2002): Primarily governs financial statement accuracy and internal controls over financial reporting for public companies. SOX Section 302 requires executive certification of financial statements; Section 404 requires management assessment of internal controls. SOX ITGC (IT General Controls) — access controls, change management, backup/recovery — are relevant to information security, but SOX does not define the specific risk assessment processes, PHI access rights, cardholder data encryption, breach notification timelines, or critical infrastructure requirements described in R1-R8. | CMMC (Cybersecurity Maturity Model Certification): DoD-specific framework assessing defense contractor cybersecurity practices. CMMC requirements map closely to NIST SP 800-171 and 800-53 controls, but scoped to organizations handling Controlled Unclassified Information (CUI) on behalf of the DoD. The requirements R1-R8 describe general enterprise, healthcare, payment card, EU data subject, federal agency, cloud service, and electric utility contexts — not DoD contractor CUI protection. | Key exam principle: knowing what a framework does NOT cover is as important as knowing what it covers. SOX failure = financial audit finding. CMMC failure = loss of DoD contract eligibility. Neither = breach notification, PHI access rights, or bulk electric system control.'
        }
      ]
    },

    /* ── pbq_mix_06 ── Security Tool Selection Lab ───────────────────────── */
    {
      id: 'pbq_mix_06', type: 'tool-selection', domain: '4.0',
      title: 'Security Tool Selection Lab',
      scenario: 'A security team matches six use cases to the correct tool. The option list contains 8 tools — 6 are correct matches, 2 are distractors.\n\nUse Cases:\n  UC1: Detect anomalous behavior on endpoints by monitoring process trees, file system changes, registry modifications, and network connections in real time. Alert and respond when a process attempts to inject into another process or spawn an unexpected child process.\n  UC2: Automatically collect, normalize, correlate, and alert on security events from 50+ data sources (firewalls, endpoints, cloud logs, identity providers, DNS). Provide a centralized investigation timeline for each incident.\n  UC3: Prevent sensitive data from being copied to USB storage devices OR transmitted to personal webmail (Gmail, Yahoo Mail) from corporate endpoints. Alert when an employee attempts to email a file containing SSNs.\n  UC4: Scan Docker and OCI container images for known CVEs in OS packages and application dependencies before they are promoted from the build registry to the production Kubernetes cluster.\n  UC5: When a phishing email is detected, automatically quarantine all instances of that message across all corporate mailboxes, add the sender domain to the email gateway blocklist, and create/assign an incident ticket — within 90 seconds of detection, without analyst intervention.\n  UC6: Provide a continuously updated, read-only inventory of all cloud resource configurations (S3 buckets, security groups, IAM policies, RDS instances) and automatically flag configurations that deviate from CIS Benchmark baselines.\n\nTool Options:\n  EDR | SIEM | DLP | Container image scanner (Trivy/Snyk) | SOAR | CSPM | CASB [DISTRACTOR] | WAF [DISTRACTOR]',
      questions: [
        {
          id: 'q1', stem: 'UC1 requires real-time monitoring of process trees, file system changes, and inter-process injection on endpoints. Which tool is MOST appropriate, and why is SIEM incorrect despite also receiving endpoint data?',
          type: 'single',
          options: {
            A: 'SIEM — aggregates endpoint logs from all 50+ sources including Windows Event Logs and detects anomalous patterns through correlation rules',
            B: 'EDR — deploys a kernel-level agent on each endpoint to monitor OS-level behavior in real time, including process creation, parent-child relationships, file writes, registry changes, and network socket creation; can detect and block process injection as events occur',
            C: 'DLP — monitors data movement on endpoints including file access patterns that could indicate malicious activity',
            D: 'SOAR — orchestrates automated responses to endpoint alerts and can trigger isolation of a compromised endpoint',
            E: 'CSPM — provides configuration monitoring including endpoint compliance baselines'
          },
          correct: 'B',
          explanation: 'B is correct (EDR): EDR tools operate via a kernel-level or OS-level agent that intercepts OS events at the time they occur — process creation, file writes, network socket openings, registry changes, DLL loads, and inter-process memory access. This real-time OS-level telemetry is EDR\'s defining capability. When svchost.exe attempts to inject code into lsass.exe (a common credential dumping technique), the EDR agent detects the memory write attempt and can block or alert in milliseconds. This depth of endpoint behavioral visibility is not possible without an endpoint agent. | Why SIEM is wrong: SIEM (A) receives endpoint data via log forwarding (Windows Event Logs, Sysmon, endpoint agent logs) but operates on LOGS — discrete events written after the fact. Logs are: (1) sampled, not every file write generates a log; (2) delayed, shipped on a schedule not in real time; (3) post-hoc, written after the event not intercepted during it. SIEM can correlate EDR events to identify patterns across multiple hosts, but SIEM cannot detect process injection at the moment of injection. The EDR agent sends telemetry TO the SIEM; SIEM is the analysis layer, EDR is the collection and enforcement layer. | D (SOAR): SOAR executes automated responses (e.g., isolates an endpoint) but relies on EDR or SIEM to provide the detection — SOAR cannot independently detect process injection.'
        },
        {
          id: 'q2', stem: 'UC3 requires preventing sensitive data from being copied to USB drives OR sent via personal webmail. A team member recommends CASB instead of DLP. Which statement BEST explains why DLP is correct for UC3 and CASB is a distractor?',
          type: 'single',
          options: {
            A: 'DLP is correct because CASB requires a cloud provider partnership not available for on-premises environments',
            B: 'DLP is correct because it deploys an endpoint agent that enforces policies at the OS level — blocking USB writes and scanning outbound application traffic for sensitive data patterns; CASB governs access to cloud applications and cannot enforce USB device policies at the endpoint level',
            C: 'DLP is correct because CASB is designed for mobile device management and cannot monitor desktop workstation traffic',
            D: 'DLP and CASB are equivalent for this use case',
            E: 'DLP is correct because CASB cannot inspect HTTPS traffic and therefore cannot see personal webmail content'
          },
          correct: 'B',
          explanation: 'B is correct: DLP with an endpoint agent operates at the OS level — it intercepts file operations, monitors clipboard activity, controls USB device writes via OS driver hooks, and can inspect application-layer traffic leaving the endpoint (including content pasted into a browser-based webmail window). USB blocking is an OS-level operation that requires an endpoint agent; only software running on the device can intercept writes to a USB storage driver. CASB has no endpoint agent and no USB policy enforcement capability. | CASB governs cloud access: CASB sits between users and cloud applications (as a proxy or via API integration with cloud providers). CASB can apply DLP-like policies for uploads to cloud services, but it has no endpoint agent and no USB enforcement. For UC3 requiring BOTH USB blocking AND personal webmail prevention on corporate laptops, only DLP covers both. CASB would be correct if the requirement were specifically "prevent employees from uploading sensitive documents to personal Dropbox while allowing Box" — that is distinctly CASB territory. | Exam tip: CASB vs DLP confusion is frequent. CASB = who can access which cloud apps. DLP = what data can leave the endpoint. When a use case mentions "USB drives," the answer is always DLP, never CASB.'
        },
        {
          id: 'q3', stem: 'UC5 requires AUTOMATICALLY quarantining a phishing email from all mailboxes, blocking the sender domain, and creating a ticket — within 90 seconds, without analyst intervention. Which tool executes this automated response workflow?',
          type: 'single',
          options: {
            A: 'SIEM — correlation rules detect phishing patterns and generate high-priority alerts for immediate analyst response',
            B: 'EDR — endpoint agents detect phishing attachment execution and quarantine the email from the local mailbox',
            C: 'SOAR — playbooks define automated response workflows; a phishing playbook calls email platform APIs to quarantine across all mailboxes, calls the gateway API to block the sender domain, and creates a ticket — all automatically within seconds',
            D: 'DLP — blocks outbound email containing sensitive data and intercepts phishing emails before delivery',
            E: 'CSPM — detects phishing infrastructure in cloud environments and triggers automated remediation'
          },
          correct: 'C',
          explanation: 'C is correct (SOAR): SOAR platforms (Palo Alto XSOAR, Splunk SOAR, IBM QRadar SOAR) execute multi-step automated playbooks triggered by alerts. A phishing response playbook: (1) receives a trigger from the email security gateway; (2) calls the email platform API (Microsoft Graph API, Google Workspace Admin API) to quarantine the specific message from ALL mailboxes simultaneously; (3) calls the gateway API to add the sender domain to the blocklist; (4) creates a ticket in the ITSM platform (ServiceNow, Jira); (5) notifies affected users. The entire sequence executes in seconds. The 90-second SLA is achievable only with automated SOAR execution, not human-in-the-loop response. | A (SIEM): SIEM detects and generates the alert but does NOT execute the response. SIEM is the "detect" layer; SOAR is the "respond" layer. The standard model: SIEM (detection and correlation) → alert trigger → SOAR (automated response execution). Candidates who confuse SIEM and SOAR typically answer A for automated response questions — but SIEM dashboards show alerts to analysts; SOAR playbooks execute actions autonomously. | B (EDR): EDR can quarantine the phishing attachment on the local endpoint but cannot reach the email server to quarantine the same message from 500 other mailboxes. EDR operates on the endpoint, not email infrastructure.'
        },
        {
          id: 'q4', stem: 'Which TWO tools from the option list are DISTRACTORS that do not correctly match any of the six use cases? (Select TWO)',
          type: 'multi',
          options: {
            A: 'EDR (Endpoint Detection and Response)',
            B: 'SIEM (Security Information and Event Management)',
            C: 'DLP (Data Loss Prevention)',
            D: 'Container image scanner (Trivy / Snyk Container)',
            E: 'SOAR (Security Orchestration, Automation, and Response)',
            F: 'CSPM (Cloud Security Posture Management)',
            G: 'CASB (Cloud Access Security Broker)',
            H: 'WAF (Web Application Firewall)'
          },
          correct: ['G', 'H'],
          explanation: 'G (CASB) is a distractor: CASB governs user access to cloud applications — controlling which cloud services are accessible, enforcing session controls in SaaS apps, providing shadow IT visibility. UC3 (sensitive data prevention) is closest, but DLP is correct because it covers USB blocking (an endpoint OS function CASB cannot perform). CASB would be correct for: "Prevent employees from uploading any file to personal Dropbox while allowing corporate OneDrive." That specific use case is not listed. | H (WAF) is a distractor: WAF inspects HTTP/HTTPS traffic to web applications, filtering requests containing SQLi, XSS, and OWASP Top 10 payloads. It operates on INBOUND web traffic. UC6 (cloud configuration review) might seem cloud-security related, but WAF filters live traffic — it has no ability to read S3 bucket ACLs, security group rules, or IAM policies. CSPM reads cloud resource configurations via cloud provider APIs — a fundamentally different function at a different layer. | Correct mappings: UC1=EDR, UC2=SIEM, UC3=DLP, UC4=Container image scanner, UC5=SOAR, UC6=CSPM. | Trap: CASB is frequently offered as a wrong answer when DLP or CSPM is correct because CASB is a "cloud security" tool and cloud security questions are common. Remember: CASB=who can access which cloud apps; DLP=what data can leave the endpoint; CSPM=are cloud resources configured securely.'
        }
      ]
    }

  ].forEach(function (lab) { window.PBQ_BANK.push(lab); });

})();
