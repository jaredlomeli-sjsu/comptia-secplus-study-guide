/* ═══ NODE DATA ═══ */
const NODE_DATA = {
/* ── Zone 1: Hashing & Integrity ── */
'hash-function':{title:'Hash Function (Message Digest)',cat:'Hashing & Integrity',html:`
  <p>A <strong>hash function</strong> is a one-way mathematical algorithm that converts any amount of input into a <strong>fixed-length output</strong> called a <em>hash</em>, <em>digest</em>, or <em>message digest</em>. Hash functions are <strong>deterministic</strong> (same input always produces same output) and <strong>irreversible</strong> (you cannot recover the input from the output).</p>
  <h4>Avalanche Effect</h4>
  <p>A single-bit change in the input produces a completely different output. This is a critical property — it prevents attackers from making small modifications to data and predicting what the new hash will be.</p>
  <h4>Properties of a secure hash function</h4>
  <ul>
    <li><strong>Pre-image resistance:</strong> Cannot reverse the hash to find the input</li>
    <li><strong>Second pre-image resistance:</strong> Cannot find a different input that produces the same hash as a given input</li>
    <li><strong>Collision resistance:</strong> Cannot find any two inputs that produce the same output</li>
  </ul>
  <div class="exam-tip">Hashes verify INTEGRITY only — not authenticity. To prove who sent the data, use HMAC (adds a secret key) or a digital signature (uses asymmetric keys).</div>`},

'md5':{title:'MD5 — Message Digest 5',cat:'Hashing & Integrity',html:`
  <p>Designed by Ron Rivest in 1992. Produces a <strong>128-bit (16-byte) digest</strong>. MD5 was the dominant hash algorithm for over a decade but is now <strong>cryptographically broken</strong> — collisions can be engineered in seconds on modern hardware.</p>
  <h4>Why it's broken</h4>
  <p>Researchers demonstrated practical MD5 collisions in 2004, and by 2008 attackers used MD5 collisions to create a rogue CA certificate trusted by all browsers. An attacker who engineers a collision can swap a malicious file for a legitimate one while producing the same hash.</p>
  <h4>Still used for (non-security purposes)</h4>
  <p>Non-security file integrity checks, deduplication, cached lookups, and legacy systems where collision resistance is irrelevant. <em>Never</em> use MD5 for digital signatures, TLS certificates, password storage, or any security-critical application.</p>
  <div class="warn-box">MD5 is broken for ALL cryptographic security purposes. If a question asks which hash is "broken" or "no longer secure," MD5 is always the answer.</div>`},

'sha1':{title:'SHA-1 — Secure Hash Algorithm 1',cat:'Hashing & Integrity',html:`
  <p>Published by NIST in 1995 as a replacement for the flawed SHA-0. Produces a <strong>160-bit (20-byte) digest</strong>. NIST deprecated SHA-1 in 2011 for most applications. In 2017, Google's Project Zero demonstrated the first practical SHA-1 collision (<strong>SHAttered attack</strong>) — creating two different PDF files with the same SHA-1 hash.</p>
  <h4>Current status</h4>
  <p>SHA-1 is no longer accepted for TLS certificates (browsers began rejecting them in 2017), code signing, or any new cryptographic application. Legacy systems may still use SHA-1 for non-security purposes but it should be migrated away from.</p>
  <div class="exam-tip">SHA-1 is DEPRECATED — not just old, actually broken (SHAttered, 2017). The exam tests that you know SHA-1 = deprecated and SHA-256 = current standard.</div>`},

'sha256':{title:'SHA-256 (SHA-2 Family)',cat:'Hashing & Integrity',html:`
  <p><strong>SHA-256</strong> is the most widely used member of the <strong>SHA-2 family</strong>, standardized by NIST. It produces a <strong>256-bit (32-byte) digest</strong>. No practical collision attacks are known against SHA-256 — it is the current workhorse of modern cryptography.</p>
  <h4>SHA-2 family variants</h4>
  <ul>
    <li><strong>SHA-224:</strong> 224-bit output (truncated SHA-256)</li>
    <li><strong>SHA-256:</strong> 256-bit — most common</li>
    <li><strong>SHA-384:</strong> 384-bit output (truncated SHA-512)</li>
    <li><strong>SHA-512:</strong> 512-bit — highest security margin</li>
  </ul>
  <h4>Used in</h4>
  <p>TLS certificates, Bitcoin proof-of-work, code signing, HMAC-SHA256, X.509 certificate signatures, and virtually every modern security protocol that requires hashing.</p>
  <div class="exam-tip">SHA-256 is part of SHA-2. SHA-2 and SHA-3 are different algorithm families — SHA-3 is NOT just a newer version of SHA-2. Both are current and secure.</div>`},

'sha3':{title:'SHA-3 (Keccak)',cat:'Hashing & Integrity',html:`
  <p>Standardized by NIST in 2015. SHA-3 uses a completely different internal structure called the <strong>Keccak sponge construction</strong> — unlike SHA-1 and SHA-2 which share a Merkle-Damgård design. SHA-3 was designed as a <strong>backup standard</strong> in case SHA-2 were ever broken.</p>
  <h4>Key advantages over SHA-2</h4>
  <ul>
    <li><strong>Different internal structure:</strong> Any vulnerability found in SHA-2 would not affect SHA-3</li>
    <li><strong>Resistant to length-extension attacks:</strong> SHA-2 is vulnerable to length extension; SHA-3 is not</li>
    <li>Same output sizes: 224, 256, 384, 512-bit variants</li>
  </ul>
  <div class="exam-tip">SHA-3 uses a Keccak sponge — this is a key exam differentiator. SHA-2 and SHA-3 both produce the same output sizes but are architecturally different. SHA-3 is the backup if SHA-2 is ever broken.</div>`},

'hmac':{title:'HMAC — Hash-Based Message Authentication Code',cat:'Hashing & Integrity',html:`
  <p>An <strong>HMAC</strong> combines a cryptographic hash function with a <strong>shared secret key</strong>. The result is a keyed message authentication code that proves both <strong>integrity</strong> (data not modified) and <strong>authenticity</strong> (came from someone who knows the key).</p>
  <h4>HMAC vs. plain hash</h4>
  <ul>
    <li><strong>Plain hash:</strong> Integrity only. Anyone can compute it — no secret required. Does not prove the sender's identity.</li>
    <li><strong>HMAC:</strong> Integrity + Authenticity. Requires the shared secret key to generate or verify. Prevents forgery even if traffic is intercepted.</li>
  </ul>
  <h4>HMAC does NOT provide non-repudiation</h4>
  <p>Because both parties share the same key, either party could have generated the HMAC — you cannot prove which one did. Non-repudiation requires an asymmetric digital signature (only the private key holder could have signed).</p>
  <div class="exam-tip">HMAC = integrity + authenticity (shared key). Digital signature = integrity + authenticity + NON-REPUDIATION (asymmetric). This distinction is frequently tested.</div>`},

'non-repudiation':{title:'Non-Repudiation',cat:'Hashing & Integrity',html:`
  <p><strong>Non-repudiation</strong> means the inability to deny having performed an action. In cryptography, it means a sender cannot later claim they did not send a signed message — because only the holder of the private key could have created that signature.</p>
  <h4>What provides non-repudiation</h4>
  <ul>
    <li><strong>Digital signatures:</strong> Only the private key holder can sign. The signature is verified with the public key, which is tied to the signer's identity by their certificate. The signer cannot deny it.</li>
  </ul>
  <h4>What does NOT provide non-repudiation</h4>
  <ul>
    <li><strong>HMAC:</strong> Both parties share the key — either could have created the MAC. You cannot prove which one did.</li>
    <li><strong>Symmetric encryption:</strong> Both parties hold the key — either could have encrypted the data.</li>
  </ul>
  <div class="exam-tip">Non-repudiation = ONLY achieved with asymmetric digital signatures (private key). HMAC and symmetric crypto cannot provide non-repudiation because the key is shared.</div>`},

'checksum':{title:'Checksum',cat:'Hashing & Integrity',html:`
  <p>A <strong>checksum</strong> is a simple error-detection value computed from data. Common examples: CRC32, Adler-32, TCP/IP checksum. Checksums are designed for <strong>accidental error detection</strong> — not for security against intentional tampering.</p>
  <h4>Checksum vs. cryptographic hash</h4>
  <ul>
    <li><strong>Checksum:</strong> Fast, simple, not collision-resistant. An attacker can easily craft data that produces the same checksum as legitimate data.</li>
    <li><strong>Cryptographic hash:</strong> Collision-resistant, pre-image resistant. Suitable for security applications.</li>
  </ul>
  <p>Use a checksum only when the threat is accidental corruption (network noise, disk error). Use a cryptographic hash (SHA-256) when the threat includes intentional tampering.</p>
  <div class="exam-tip">Checksums detect accidents; cryptographic hashes detect tampering. The exam may present a scenario and ask which to use — if security is involved, the answer is always a cryptographic hash, never a checksum.</div>`},

'hash-collision':{title:'Hash Collision',cat:'Hashing & Integrity',html:`
  <p>A <strong>hash collision</strong> occurs when two different inputs produce the same hash output. Because hash functions map infinite inputs to a finite output space, collisions must theoretically exist — the goal is to make them computationally infeasible to find.</p>
  <h4>Birthday paradox</h4>
  <p>The birthday attack exploits the probability that any two inputs will collide. In a group of just 23 people, there's a 50% chance two share a birthday — similarly, an n-bit hash only requires approximately 2<sup>n/2</sup> attempts to find any collision (far less than 2<sup>n</sup>).</p>
  <h4>Status by algorithm</h4>
  <ul>
    <li><strong>MD5:</strong> Practical collisions engineered in seconds — broken</li>
    <li><strong>SHA-1:</strong> Practical collision demonstrated 2017 (SHAttered) — deprecated</li>
    <li><strong>SHA-256 / SHA-3:</strong> No practical collision attacks known — secure</li>
  </ul>
  <div class="exam-tip">Collision resistance is why we use larger hash outputs. SHA-256 provides 128-bit collision resistance (2<sup>128</sup> work to find a collision). Birthday attacks halve the effective security bits.</div>`},

/* ── Zone 2: Password Attacks ── */
'online-attack':{title:'Online Password Attack',cat:'Password Attacks',html:`
  <p>An <strong>online attack</strong> submits credentials directly against a <strong>live authentication system</strong> — a web login form, SSH, RDP, Active Directory, etc. The attacker receives real-time feedback (success/failure).</p>
  <h4>Limitations</h4>
  <ul>
    <li>Account lockout policies limit attempts (e.g., 5 failures = 30-minute lockout)</li>
    <li>Rate limiting and CAPTCHA slow automated tools</li>
    <li>IDS/IPS can detect and block repeated failures</li>
    <li>Every attempt is logged and visible to defenders</li>
  </ul>
  <h4>Defenses</h4>
  <p>Account lockout, MFA, rate limiting, CAPTCHA, IP blocking, adaptive authentication.</p>
  <div class="exam-tip">Online attacks are limited by lockout. Offline attacks have no lockout. Password spraying is a specific online attack technique designed to EVADE lockout by spreading attempts.</div>`},

'offline-attack':{title:'Offline Password Attack',cat:'Password Attacks',html:`
  <p>An <strong>offline attack</strong> runs against a <strong>stolen hash database</strong> — the attacker has extracted hashed passwords from a compromised system and now cracks them locally, with no connection to the target system.</p>
  <h4>Why offline attacks are dangerous</h4>
  <ul>
    <li><strong>No lockout:</strong> There is no authentication system to lock the attacker out</li>
    <li><strong>GPU parallelism:</strong> Modern GPUs can attempt billions of SHA-256 hashes per second</li>
    <li><strong>Unlimited time:</strong> The attacker can run for days, weeks, or months</li>
    <li><strong>Invisible to defenders:</strong> No failed login attempts are logged on the target system</li>
  </ul>
  <h4>Defense</h4>
  <p>Slow hash algorithms (bcrypt, Argon2) with salting make offline attacks computationally expensive even with stolen hashes.</p>
  <div class="exam-tip">The primary defense against offline attacks is using slow, memory-intensive password hashing (bcrypt, Argon2), NOT account lockout — lockout only applies to online attacks.</div>`},

'dict-attack':{title:'Dictionary Attack',cat:'Password Attacks',html:`
  <p>A <strong>dictionary attack</strong> tries passwords from a <strong>wordlist</strong> — a curated collection of common passwords, dictionary words, name/date combinations, and previously leaked credentials from breaches (like the RockYou dataset of 14+ million real passwords).</p>
  <p>Far more efficient than pure brute force because most users choose predictable passwords. A well-crafted wordlist with rule-based mutations (adding numbers, capitalizing) can crack the majority of passwords from typical user populations.</p>
  <h4>Defense</h4>
  <p>Block known-breached passwords (NIST SP 800-63B recommends checking against breach databases), enforce password complexity and length, and use MFA.</p>
  <div class="exam-tip">Dictionary attacks exploit weak/predictable passwords. The best defense is blocking common/breached passwords at account creation, not just enforcing complexity rules.</div>`},

'brute-force-pw':{title:'Brute Force Password Attack',cat:'Password Attacks',html:`
  <p>A <strong>brute force attack</strong> systematically tries <em>every possible combination</em> of characters up to a given length. It is <strong>guaranteed to succeed eventually</strong> — but becomes impractical as password length increases because the keyspace grows exponentially.</p>
  <h4>Keyspace growth</h4>
  <ul>
    <li>8-char lowercase: 26<sup>8</sup> ≈ 208 billion combinations</li>
    <li>12-char mixed case+digits+symbols: ~1.5 × 10<sup>22</sup> combinations</li>
  </ul>
  <p>At 10 billion attempts/second (GPU), an 8-char lowercase password falls in ~21 seconds. A 12-char complex password takes millions of years.</p>
  <div class="exam-tip">Password LENGTH is the single most effective defense against brute force — each additional character multiplies the keyspace exponentially. NIST recommends prioritizing length (16+ chars) over complexity.</div>`},

'spraying':{title:'Password Spraying',cat:'Password Attacks',html:`
  <p><strong>Password spraying</strong> is an online attack that tries a <strong>small number of common passwords</strong> (e.g., <em>Summer2024!</em>, <em>Welcome1</em>) against a <strong>large number of accounts</strong>. By trying only 1–3 passwords per account, it stays below per-account lockout thresholds.</p>
  <h4>Why it works</h4>
  <p>In any large organization, a percentage of users will have weak, common passwords. Spraying finds those accounts without triggering lockouts on any individual account.</p>
  <h4>Defense</h4>
  <p>Monitor for the distributed pattern: many different accounts each having 1–2 failures over a short window. Ban known-common passwords. Enforce MFA. Alert on geographically or temporally anomalous logins.</p>
  <div class="exam-tip">Spraying = few passwords, many accounts. This is the inverse of brute force (many passwords, one account). The key is evading lockout by staying under the per-account threshold.</div>`},

'pass-hash':{title:'Pass the Hash',cat:'Password Attacks',html:`
  <p>In Windows NTLM authentication, the <strong>hash itself is the credential</strong>. An attacker who steals the NTLM hash (via Mimikatz from LSASS memory) can <strong>replay it directly</strong> to authenticate without ever knowing the plaintext password.</p>
  <h4>How the attack works</h4>
  <ol style="padding-left:16px;margin-bottom:8px">
    <li>Attacker compromises one machine and gains SYSTEM or admin rights</li>
    <li>Runs Mimikatz to dump NTLM hashes from LSASS memory</li>
    <li>Uses hash with tools like Impacket to authenticate to other systems as that user</li>
    <li>Moves laterally across the network</li>
  </ol>
  <h4>Defenses</h4>
  <p><strong>Credential Guard</strong> (Windows) isolates LSASS in a protected VM to prevent hash extraction. Protected Users security group. Privileged Access Workstations. Disable NTLMv1/v2 where possible. Resetting the user's password does NOT help — the old hash can still be replayed until the session is invalidated.</p>
  <div class="warn-box">Resetting the user's password does NOT stop a pass-the-hash attack. The attacker cached the hash before the reset and can keep using it. Only invalidating all sessions stops the attack.</div>`},

'birthday-attack':{title:'Birthday Attack',cat:'Password Attacks',html:`
  <p>The <strong>birthday attack</strong> exploits the <strong>birthday paradox</strong>: in a group of 23 people, there's a 50% chance two share a birthday — despite 365 possible birthdays. Applied to hashing: finding any two inputs that produce the same hash (a collision) requires only ~2<sup>n/2</sup> attempts, not 2<sup>n</sup>.</p>
  <h4>Impact on hash security</h4>
  <ul>
    <li>A 128-bit hash (MD5) has only 2<sup>64</sup> collision resistance — far lower than the 2<sup>128</sup> naively expected</li>
    <li>A 256-bit hash (SHA-256) has 2<sup>128</sup> collision resistance — still computationally infeasible</li>
  </ul>
  <p>This is why hash output sizes must be at least 256 bits for strong security — the effective collision resistance is half the bit length.</p>
  <div class="exam-tip">Birthday attacks reduce collision resistance from 2<sup>n</sup> to 2<sup>n/2</sup>. This is why MD5 (128-bit → 64-bit effective) is easily broken, and why SHA-256 (256-bit → 128-bit effective) remains secure.</div>`},

'rainbow-table':{title:'Rainbow Table Attack',cat:'Password Attacks',html:`
  <p>A <strong>rainbow table</strong> is a precomputed lookup table mapping hash values back to their plaintext passwords. Rather than computing hashes at attack time, the attacker precomputes hashes for millions of common passwords and stores them. Lookup is near-instant — find the hash in the table, read the plaintext.</p>
  <h4>Rainbow chains (space-time tradeoff)</h4>
  <p>Traditional precomputed tables are huge. Rainbow tables use reduction functions to chain hash→reduce→hash→reduce, storing only the start and end of each chain. The tradeoff is computation at lookup time for enormous space savings.</p>
  <h4>Defeated completely by salting</h4>
  <p>A <strong>unique random salt per user</strong> means the precomputed table is useless — the attacker would need to compute a separate rainbow table for every possible salt value, which is computationally infeasible.</p>
  <div class="exam-tip">Rainbow tables are defeated by salting. A salt doesn't need to be secret — it just needs to be UNIQUE per user so precomputed tables can't be reused. "Hash + salt" defeats rainbow tables; "hash alone" is vulnerable.</div>`},

/* ── Zone 2: Password Defenses ── */
'salting':{title:'Salting',cat:'Password Defenses',html:`
  <p>A <strong>salt</strong> is a <strong>random unique value</strong> generated and appended (or prepended) to a password before hashing. Each user account receives a different salt, so two users with the same password will have completely different stored hashes.</p>
  <h4>What salting defeats</h4>
  <ul>
    <li><strong>Rainbow table attacks:</strong> Precomputed tables become useless because they don't account for the salt</li>
    <li><strong>Hash comparison:</strong> Identical passwords no longer match in the database — you can't identify duplicate passwords</li>
  </ul>
  <h4>How salts are stored</h4>
  <p>Salts are stored <strong>alongside the hash</strong> in the database in plaintext — they are not secret. Their value is uniqueness, not secrecy. The format is typically: <code>$algorithm$salt$hash</code></p>
  <div class="exam-tip">Salt does NOT need to be secret — it must be UNIQUE per user. A salt defeats rainbow tables even if the attacker knows the salt. The exam may try to trick you into thinking salts are a secret.</div>`},

'key-stretching':{title:'Key Stretching',cat:'Password Defenses',html:`
  <p><strong>Key stretching</strong> deliberately makes the hash function <strong>slow and computationally expensive</strong> by repeating the hash operation thousands or millions of times (plus mixing in the salt repeatedly). A legitimate login might take 100ms — an acceptable delay for users but a massive multiplier for an attacker.</p>
  <h4>Why it works against offline attacks</h4>
  <p>A GPU that computes 10 billion plain SHA-256 hashes per second would compute only ~10,000 bcrypt hashes per second (work factor 12). The attacker's GPU speed advantage is negated — the same GPU takes millions of times longer to crack each password.</p>
  <h4>Tunable work factor</h4>
  <p>bcrypt and Argon2 have a configurable cost parameter that can be increased over time as hardware gets faster, maintaining the same effective resistance.</p>
  <div class="exam-tip">Key stretching is why plain SHA-256 — even with a salt — is NOT suitable for password storage. SHA-256 is too fast. bcrypt, PBKDF2, and Argon2 are designed to be slow on purpose.</div>`},

'bcrypt':{title:'bcrypt',cat:'Password Defenses',html:`
  <p><strong>bcrypt</strong> is a password-hashing algorithm based on the <strong>Blowfish block cipher</strong>. Designed by Niels Provos and David Mazières in 1999. It incorporates salting and key stretching in a single operation and has a tunable <strong>cost (work) factor</strong>.</p>
  <h4>Work factor</h4>
  <p>The cost parameter (typically 10–14) represents 2<sup>cost</sup> iterations. Increasing it by 1 doubles the computation time. This allows bcrypt to remain secure as hardware improves — just increase the work factor.</p>
  <h4>Uses</h4>
  <p>Default password hashing on Linux/BSD systems (<code>/etc/shadow</code>), web application frameworks (Rails, Django, Spring Security), and most Unix authentication.</p>
  <div class="exam-tip">bcrypt is based on Blowfish (a cipher, not a hash). It's memory-intensive enough to resist FPGA cracking. If the exam asks about a password storage algorithm that uses Blowfish, the answer is bcrypt.</div>`},

'pbkdf2':{title:'PBKDF2 — Password-Based Key Derivation Function 2',cat:'Password Defenses',html:`
  <p><strong>PBKDF2</strong> applies a pseudorandom function (typically HMAC-SHA256) to the password + salt repeatedly for a configurable number of iterations. It is <strong>FIPS 140-2 compliant</strong>, making it the required choice for US government and compliance-mandated systems.</p>
  <h4>Parameters</h4>
  <ul>
    <li><strong>PRF:</strong> Usually HMAC-SHA256</li>
    <li><strong>Salt:</strong> Random, unique per user</li>
    <li><strong>Iterations:</strong> At least 600,000 for HMAC-SHA256 (NIST 2023 recommendation)</li>
    <li><strong>Key length:</strong> Desired output length in bytes</li>
  </ul>
  <h4>Used in</h4>
  <p>WPA2/WPA3 Wi-Fi password hashing, iOS device encryption, PKCS#5 standard, Django (with high iteration count), and any environment requiring FIPS compliance.</p>
  <div class="exam-tip">PBKDF2 = FIPS-compliant key stretching. Used in WPA2/WPA3 for Wi-Fi password hashing. If the scenario involves government systems or FIPS compliance, PBKDF2 is often the correct answer.</div>`},

'argon2':{title:'Argon2',cat:'Password Defenses',html:`
  <p><strong>Argon2</strong> won the <strong>Password Hashing Competition (PHC) in 2015</strong> and is considered the modern best-practice choice for password hashing where FIPS compliance is not required. It is configurable across three dimensions: memory usage, time (iterations), and parallelism.</p>
  <h4>Three variants</h4>
  <ul>
    <li><strong>Argon2d:</strong> Maximizes GPU resistance (data-dependent memory access). Vulnerable to side-channel attacks in some contexts.</li>
    <li><strong>Argon2i:</strong> Maximizes side-channel resistance (data-independent access). Slightly less GPU-resistant.</li>
    <li><strong>Argon2id:</strong> Hybrid of both. The <strong>recommended variant</strong> for most applications.</li>
  </ul>
  <div class="exam-tip">Argon2id is the recommended modern password hashing algorithm. It won the PHC in 2015. It is NOT FIPS-compliant — use PBKDF2 when FIPS compliance is required.</div>`},

/* ── Zone 3: Symmetric Encryption ── */
'symmetric-key':{title:'Symmetric Encryption',cat:'Symmetric Encryption',html:`
  <p>In <strong>symmetric encryption</strong>, the <strong>same secret key</strong> both encrypts and decrypts data. Both parties must share an identical key before communication. Symmetric algorithms are far faster than asymmetric — used for bulk data encryption (files, disks, network traffic).</p>
  <h4>Key distribution problem</h4>
  <p>The fundamental challenge: how do two parties securely share the key over an untrusted network before communication begins? This is solved in practice by <strong>hybrid cryptography</strong> — asymmetric crypto is used to exchange the symmetric key, then symmetric crypto handles all bulk data.</p>
  <h4>Algorithm vs. Key</h4>
  <p>Every cipher has an algorithm (the math) and a key (the secret value). The same algorithm with a different key produces completely different ciphertext. Larger key space = exponentially more brute-force work.</p>
  <div class="exam-tip">Symmetric = one shared key, fast, bulk data. Asymmetric = key pair (public/private), slow, key exchange. TLS uses BOTH: asymmetric to exchange a symmetric key, then symmetric for all traffic.</div>`},

'aes':{title:'AES — Advanced Encryption Standard',cat:'Symmetric Encryption',html:`
  <p><strong>AES</strong> was selected by NIST in 2001 through a public competition. It replaced 3DES as the US government encryption standard. AES supports three key sizes — all use a <strong>128-bit block size</strong>.</p>
  <h4>Key sizes</h4>
  <ul>
    <li><strong>AES-128:</strong> 128-bit key — 10 rounds. Default for most applications.</li>
    <li><strong>AES-192:</strong> 192-bit key — 12 rounds.</li>
    <li><strong>AES-256:</strong> 256-bit key — 14 rounds. Used by the US government for TOP SECRET data.</li>
  </ul>
  <h4>Used in</h4>
  <p>TLS (as the bulk cipher), disk encryption (BitLocker, FileVault, VeraCrypt), WPA3 Wi-Fi, S/MIME, IPsec, and virtually every modern system requiring symmetric encryption. No practical attacks against AES are known.</p>
  <div class="exam-tip">AES is the answer for symmetric encryption in any modern system. Note: AES-128 uses a 128-bit KEY and a 128-bit BLOCK — these are coincidentally equal but independent parameters. The block size is always 128-bit regardless of key size.</div>`},

'triple-des':{title:'3DES — Triple DES',cat:'Symmetric Encryption',html:`
  <p><strong>3DES</strong> applies the original DES cipher three times in an Encrypt-Decrypt-Encrypt (EDE) sequence. DES alone was broken in 1997 (56-bit key). 3DES extended its life by tripling the key material to 112 or 168 effective bits.</p>
  <h4>SWEET32 vulnerability</h4>
  <p>3DES uses a <strong>64-bit block size</strong>. At high data volumes (~32GB per session), the birthday attack probability becomes significant — an attacker monitoring a long TLS session can eventually recover portions of plaintext. This attack is called <strong>SWEET32</strong>.</p>
  <h4>Status</h4>
  <p>NIST deprecated 3DES in <strong>2023</strong>. It must not be used in new systems. AES is the replacement.</p>
  <div class="exam-tip">3DES is deprecated due to SWEET32 (64-bit block birthday attack). The 64-bit block is the vulnerability, not the key size. Both 3DES and Blowfish share this weakness.</div>`},

'blowfish':{title:'Blowfish',cat:'Symmetric Encryption',html:`
  <p>Designed by Bruce Schneier in 1993 as a fast, unpatented, freely available alternative to DES. Variable key length (32–448 bits) and a <strong>64-bit block size</strong>.</p>
  <h4>Weaknesses</h4>
  <p>The <strong>64-bit block</strong> shares the SWEET32 birthday-attack vulnerability with 3DES at high data volumes. This makes it unsuitable for high-throughput encryption (e.g., long TLS sessions or large file transfers).</p>
  <h4>Legacy use</h4>
  <p>Blowfish is the basis of bcrypt (password hashing) and was widely used in OpenSSH and OpenVPN. It has been largely superseded by its successor Twofish and by AES.</p>
  <div class="exam-tip">Blowfish is notable as the BASIS of bcrypt (not directly used for password storage but its key schedule is). Don't confuse "Blowfish cipher" with "bcrypt" — bcrypt uses Blowfish's key schedule but is a password hashing function.</div>`},

'twofish':{title:'Twofish',cat:'Symmetric Encryption',html:`
  <p><strong>Twofish</strong> was designed by Bruce Schneier (same author as Blowfish) and was a finalist in the AES competition — losing to Rijndael (which became AES). It uses a <strong>128-bit block size</strong> and supports 128, 192, and 256-bit keys.</p>
  <p>The 128-bit block eliminates the SWEET32 birthday-attack concern that affected Blowfish and 3DES. No practical attacks against Twofish are known. It is available in many encryption libraries but far less common in practice than AES.</p>
  <div class="exam-tip">Twofish = AES finalist, 128-bit block, no known attacks, less common than AES. The exam may ask you to distinguish it from Blowfish (which it replaced) or from AES (which won the competition).</div>`},

'block-cipher':{title:'Block Cipher',cat:'Symmetric Encryption',html:`
  <p>A <strong>block cipher</strong> encrypts data in <strong>fixed-size chunks (blocks)</strong>. AES uses 128-bit blocks. The entire block must be available before encryption begins. For messages longer than one block, a <strong>mode of operation</strong> is required.</p>
  <h4>Common modes of operation</h4>
  <ul>
    <li><strong>ECB (Electronic Codebook):</strong> Each block encrypted independently — same plaintext block = same ciphertext block. NEVER use for real data (patterns are visible).</li>
    <li><strong>CBC (Cipher Block Chaining):</strong> Each block XORed with previous ciphertext before encrypting. Requires an IV. Sequential only.</li>
    <li><strong>CTR (Counter Mode):</strong> Turns block cipher into a stream cipher using a counter. Parallelizable.</li>
    <li><strong>GCM (Galois/Counter Mode):</strong> CTR + authentication tag. Provides authenticated encryption. Used in TLS 1.3.</li>
  </ul>
  <div class="exam-tip">Block cipher algorithms: AES, 3DES, Blowfish, Twofish. Stream cipher algorithms: RC4, ChaCha20. Block ciphers need a mode of operation (CBC, GCM, CTR) to handle variable-length data.</div>`},

'stream-cipher':{title:'Stream Cipher',cat:'Symmetric Encryption',html:`
  <p>A <strong>stream cipher</strong> encrypts data <strong>one bit or byte at a time</strong> as it arrives. It generates a <strong>keystream</strong> (pseudorandom sequence) derived from the key and XORs it with the plaintext. No need to wait for a full block — ideal for real-time applications where data size is unknown.</p>
  <h4>Advantages</h4>
  <ul>
    <li>Low latency — encrypt each byte immediately as it arrives</li>
    <li>Efficient in software (especially on hardware without AES-NI acceleration)</li>
    <li>No padding required (block ciphers need padding to fill the last block)</li>
  </ul>
  <h4>Critical requirement</h4>
  <p>Stream ciphers must <strong>never reuse the same keystream</strong>. XORing two ciphertexts encrypted with the same keystream reveals the XOR of the plaintexts — catastrophic failure.</p>
  <div class="exam-tip">Stream ciphers (RC4, ChaCha20) work bit-by-bit, ideal for low-latency streams. Block ciphers (AES) work on fixed chunks, ideal for files and stored data. TLS 1.3 uses both: ECDHE for key exchange, AES-GCM or ChaCha20-Poly1305 for bulk data.</div>`},

'rc4':{title:'RC4',cat:'Symmetric Encryption',html:`
  <p><strong>RC4</strong> (Rivest Cipher 4) was designed by Ron Rivest in 1987. For years it was the most widely used stream cipher — used in WEP Wi-Fi, early SSL/TLS, and RC4-based protocols. It is now <strong>completely deprecated</strong>.</p>
  <h4>Vulnerabilities</h4>
  <ul>
    <li><strong>Biased keystream:</strong> The first bytes of RC4 output are not truly random — statistical biases allow plaintext recovery</li>
    <li><strong>BEAST attack:</strong> Exploited RC4 in SSL 3.0/TLS 1.0</li>
    <li><strong>WEP failure:</strong> RC4 misuse in WEP (reused IVs) led to WEP being completely broken</li>
    <li>RFC 7465 (2015) prohibits RC4 in TLS</li>
  </ul>
  <div class="exam-tip">RC4 is deprecated and broken. If a question asks about a deprecated stream cipher or why WEP was insecure, RC4 is the answer. ChaCha20 is its modern replacement.</div>`},

'chacha20':{title:'ChaCha20',cat:'Symmetric Encryption',html:`
  <p><strong>ChaCha20</strong> is a modern stream cipher designed by Daniel Bernstein in 2008 as an improvement on his earlier Salsa20. It is used in <strong>TLS 1.3</strong> as <code>ChaCha20-Poly1305</code> (ChaCha20 for encryption + Poly1305 for authentication).</p>
  <h4>Advantages over AES</h4>
  <ul>
    <li><strong>No dedicated hardware needed:</strong> Fast in pure software — important for mobile devices and IoT without AES-NI acceleration</li>
    <li><strong>Constant-time execution:</strong> Not vulnerable to cache-timing side-channel attacks that can affect AES</li>
    <li>256-bit key, no known weaknesses</li>
  </ul>
  <div class="exam-tip">ChaCha20-Poly1305 is the alternative to AES-GCM in TLS 1.3. It's preferred on mobile devices without hardware AES acceleration. If a question mentions TLS 1.3 cipher suites or mobile encryption, ChaCha20 may be the answer.</div>`},

/* ── Zone 4: Asymmetric Encryption ── */
'asymmetric-key':{title:'Asymmetric Encryption',cat:'Asymmetric Encryption',html:`
  <p>In <strong>asymmetric encryption</strong>, mathematically linked <strong>key pairs</strong> are used: a <strong>public key</strong> (freely distributed) and a <strong>private key</strong> (kept secret by the owner). Data encrypted with the public key can only be decrypted with the private key — and vice versa for signatures.</p>
  <h4>Two modes of use</h4>
  <ul>
    <li><strong>Encryption:</strong> Encrypt with recipient's PUBLIC key → only recipient's PRIVATE key can decrypt</li>
    <li><strong>Digital signature:</strong> Sign with sender's PRIVATE key → anyone with sender's PUBLIC key can verify</li>
  </ul>
  <h4>Speed tradeoff</h4>
  <p>Asymmetric operations are 1,000–10,000× slower than symmetric operations. This is why asymmetric is used only for key exchange and signatures, not for bulk data encryption.</p>
  <div class="exam-tip">MEMORIZE: Encrypt with PUBLIC key, decrypt with PRIVATE. Sign with PRIVATE key, verify with PUBLIC. These rules reverse between encryption and signatures — this is the most commonly tested asymmetric fact.</div>`},

'rsa':{title:'RSA',cat:'Asymmetric Encryption',html:`
  <p><strong>RSA</strong> (Rivest–Shamir–Adleman) was published in 1977. It is the most widely deployed asymmetric algorithm, based on the computational difficulty of factoring the product of two large prime numbers.</p>
  <h4>Key sizes</h4>
  <ul>
    <li><strong>2048-bit:</strong> Minimum recommended. Currently secure but should be phased out by 2030.</li>
    <li><strong>3072-bit:</strong> NIST recommended for new systems needing security past 2030.</li>
    <li><strong>4096-bit:</strong> High-security applications. Notably slower than 2048-bit.</li>
  </ul>
  <h4>RSA can both encrypt and sign</h4>
  <p>Unlike DSA (signature only) or ECDH (key exchange only), RSA can be used for both encryption and digital signatures. However, in TLS 1.3, RSA is used only for authentication (signatures in the handshake) — never for key exchange.</p>
  <div class="exam-tip">RSA 2048-bit is the minimum. For equivalent security, ECC needs far fewer bits: 256-bit ECC ≈ 3072-bit RSA. This size advantage makes ECC preferred for TLS certificates and constrained devices.</div>`},

'dsa':{title:'DSA — Digital Signature Algorithm',cat:'Asymmetric Encryption',html:`
  <p><strong>DSA</strong> is a NIST FIPS 186 standard algorithm based on the <strong>discrete logarithm problem</strong>. It is a <strong>signature-only algorithm</strong> — it cannot be used for encryption or key exchange.</p>
  <h4>Status</h4>
  <p>NIST deprecated DSA in FIPS 186-5 (2023). New systems should use ECDSA instead, which provides the same signature capability with much smaller keys and faster operations.</p>
  <h4>Historical note</h4>
  <p>DSA has a known weakness: if the random number (k) used in signing is ever reused or predictable, the private key can be recovered. This was exploited against Sony's PlayStation 3 (they reused k) and against Bitcoin implementations.</p>
  <div class="exam-tip">DSA = signatures ONLY, no encryption. ECDSA is the modern replacement. Both are signature algorithms. RSA can do both. This distinction is testable.</div>`},

'ecc':{title:'ECC — Elliptic Curve Cryptography',cat:'Asymmetric Encryption',html:`
  <p><strong>ECC</strong> is based on the algebraic structure of elliptic curves over finite fields. The security comes from the <strong>elliptic curve discrete logarithm problem</strong>, which is harder than integer factorization — allowing much smaller keys for equivalent security.</p>
  <h4>Key size comparison</h4>
  <ul>
    <li>256-bit ECC ≈ 3072-bit RSA security level</li>
    <li>384-bit ECC ≈ 7680-bit RSA security level</li>
    <li>521-bit ECC ≈ 15360-bit RSA security level</li>
  </ul>
  <h4>Advantages</h4>
  <p>Smaller keys → smaller certificates → faster TLS handshakes → less CPU. Especially important for mobile devices, IoT, and high-traffic servers. The default for new TLS certificates.</p>
  <div class="exam-tip">ECC = same security as RSA with much shorter keys. 256-bit ECC ≈ 3072-bit RSA. This is the most commonly tested ECC fact. TLS 1.3 mandates ECC-based key exchange (ECDHE).</div>`},

'ecdsa':{title:'ECDSA — Elliptic Curve DSA',cat:'Asymmetric Encryption',html:`
  <p><strong>ECDSA</strong> is the elliptic curve variant of DSA — providing the same signature-only functionality as DSA but with the efficiency of ECC. It is the standard digital signature algorithm in modern TLS certificates, Bitcoin transactions, and SSH keys.</p>
  <h4>Comparison to RSA for signatures</h4>
  <ul>
    <li><strong>ECDSA P-256:</strong> 256-bit key, very fast signature/verify, small signature size</li>
    <li><strong>RSA-2048:</strong> 2048-bit key, slower, larger signatures</li>
    <li>At equivalent security levels, ECDSA produces ~10× smaller signatures than RSA</li>
  </ul>
  <div class="exam-tip">ECDSA = ECC-based digital signature. Signatures only — no encryption. Used in TLS 1.3 certificates, Bitcoin, modern SSH. Like DSA, vulnerable to k-reuse attacks (same mitigation: use deterministic ECDSA / RFC 6979).</div>`},

'hybrid-crypto':{title:'Hybrid Cryptography',cat:'Asymmetric Encryption',html:`
  <p><strong>Hybrid cryptography</strong> combines asymmetric and symmetric encryption to get the best of both: asymmetric for secure key exchange, symmetric for fast bulk data encryption. This is the foundation of TLS, S/MIME, and all practical secure communication protocols.</p>
  <h4>TLS example</h4>
  <ol style="padding-left:16px;margin-bottom:8px">
    <li>Client and server perform ECDHE key exchange (asymmetric) to derive a shared session key</li>
    <li>Server's certificate (signed with ECDSA or RSA) authenticates the server</li>
    <li>All subsequent application data encrypted with AES-GCM (symmetric) using the session key</li>
  </ol>
  <p>The asymmetric operation handles the key distribution problem. The symmetric cipher handles performance at scale.</p>
  <div class="exam-tip">Hybrid crypto = asym for key exchange + sym for bulk data. This is how TLS, PGP, and S/MIME all work. Understanding this pattern explains why asymmetric algorithms appear in protocols but don't slow them down.</div>`},

/* ── Zone 4: Key Exchange & PFS ── */
'key-exchange':{title:'Key Exchange',cat:'Key Exchange & PFS',html:`
  <p><strong>Key exchange</strong> is the process of securely establishing a shared secret between two parties over an <strong>untrusted network</strong>, without that secret ever being transmitted directly. The Diffie-Hellman algorithm (1976) solved this problem by allowing two parties to independently compute the same shared secret using only public values.</p>
  <h4>Diffie-Hellman concept (simplified)</h4>
  <p>Alice and Bob each choose a private random number. They combine it with a public shared value and exchange results publicly. Each then combines the other's public result with their own private number — and both arrive at the same shared secret. An eavesdropper who sees all public exchanges cannot compute the secret.</p>
  <div class="exam-tip">Key exchange solves the key distribution problem for symmetric encryption. DH = classic (static). DHE = ephemeral (fresh keys per session, enables PFS). ECDHE = ECC-based DHE (TLS 1.3 default).</div>`},

'static-key':{title:'Static Key',cat:'Key Exchange & PFS',html:`
  <p>A <strong>static key</strong> is a long-lived cryptographic key that is reused across many sessions. In key exchange, using a static key means the same public/private key pair is used to derive session keys for every connection.</p>
  <h4>Risk</h4>
  <p>If the static private key is ever compromised (stolen, legally compelled, or broken), an attacker who recorded past encrypted traffic can <strong>retroactively decrypt all of it</strong>. This was the primary risk with RSA key exchange in TLS 1.2 — if the server's RSA private key leaked, all past sessions could be decrypted.</p>
  <div class="exam-tip">Static keys = no forward secrecy. One key compromise exposes all past and future sessions. This is WHY Perfect Forward Secrecy (PFS) was added to TLS — and why TLS 1.3 mandates ephemeral key exchange.</div>`},

'ephemeral-key':{title:'Ephemeral Key',cat:'Key Exchange & PFS',html:`
  <p>An <strong>ephemeral key</strong> is a <strong>temporary key pair generated fresh for each session</strong> and immediately discarded after use. Even if the long-term certificate private key is later compromised, past sessions are safe because they used unique, now-destroyed session keys.</p>
  <h4>In TLS context</h4>
  <p>With DHE or ECDHE, the server generates a new temporary DH key pair for each TLS handshake. The shared session key is derived from this temporary pair. The temporary private key is discarded after the handshake. The long-term certificate key is used only for authentication (signing the ephemeral public key).</p>
  <div class="exam-tip">Ephemeral = per-session, throw-away keys. The long-term certificate key only proves identity — it never touches the session key derivation when DHE/ECDHE is used. This is the mechanism of PFS.</div>`},

'pfs':{title:'PFS — Perfect Forward Secrecy',cat:'Key Exchange & PFS',html:`
  <p><strong>Perfect Forward Secrecy (PFS)</strong> is the property that compromise of long-term keys cannot retroactively decrypt past recorded sessions. It is achieved by using <strong>ephemeral Diffie-Hellman key exchange</strong> (DHE or ECDHE), where a unique temporary key pair is generated for every session.</p>
  <h4>Why it matters</h4>
  <p>Nation-state adversaries are known to record encrypted traffic and store it hoping to decrypt it later when they acquire the key. PFS defeats this: even with the server's private key, past sessions cannot be decrypted because the ephemeral keys used for each session were never stored.</p>
  <h4>TLS requirement</h4>
  <p>TLS 1.3 mandates PFS — all TLS 1.3 cipher suites use ECDHE. TLS 1.2 allows both PFS and non-PFS cipher suites — look for DHE or ECDHE in the cipher suite name.</p>
  <div class="exam-tip">PFS = TLS 1.3 requirement. Look for DHE or ECDHE in cipher suite names (e.g., TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384). If "ECDHE" or "DHE" is present = PFS. If "RSA" key exchange = no PFS.</div>`},

'dhe':{title:'DHE — Diffie-Hellman Ephemeral',cat:'Key Exchange & PFS',html:`
  <p><strong>DHE</strong> is the ephemeral version of the classic Diffie-Hellman key exchange. A fresh temporary DH key pair is generated for each session, providing Perfect Forward Secrecy.</p>
  <p>DHE based on classic discrete logarithm math (modular arithmetic). Requires large key sizes (2048+ bit DH groups) for security. Computationally slower than ECDHE for equivalent security. In TLS 1.3, DHE groups must be at least 2048-bit (ffdhe2048 or larger).</p>
  <div class="exam-tip">DHE vs. ECDHE: both provide PFS. ECDHE is preferred because it achieves the same security with much smaller keys and faster computation. TLS 1.3 supports both but ECDHE is the common default.</div>`},

'ecdhe':{title:'ECDHE — Elliptic Curve Diffie-Hellman Ephemeral',cat:'Key Exchange & PFS',html:`
  <p><strong>ECDHE</strong> combines ECC efficiency with the ephemeral key exchange of DHE. It provides Perfect Forward Secrecy using elliptic curve math. It is the <strong>standard key exchange mechanism in TLS 1.3</strong>.</p>
  <h4>Common ECDHE curves in TLS</h4>
  <ul>
    <li><strong>P-256 (secp256r1):</strong> 128-bit security. Widely supported. Most common in practice.</li>
    <li><strong>P-384 (secp384r1):</strong> 192-bit security. Used in higher-security contexts.</li>
    <li><strong>X25519:</strong> Bernstein's Curve25519. Fast, constant-time, no known weaknesses. Preferred in modern TLS 1.3 implementations.</li>
  </ul>
  <div class="exam-tip">ECDHE = ECC + DHE + Ephemeral = PFS. If a question describes a TLS 1.3 cipher suite, ECDHE will be in the key exchange component. X25519 is the curve used in most modern TLS 1.3 implementations.</div>`},

/* ── Zone 5: Data States & Protection ── */
'data-at-rest':{title:'Data at Rest',cat:'Data Protection',html:`
  <p><strong>Data at rest</strong> is data stored on a medium — hard disk, SSD, USB drive, database, backup tape, or cloud storage — that is not actively being transmitted or processed.</p>
  <h4>Threats</h4>
  <ul>
    <li>Device theft (laptop stolen, USB left in parking lot)</li>
    <li>Unauthorized storage system access (DBA with excessive privileges)</li>
    <li>Insider threat — malicious employee copying data</li>
    <li>Physical access to storage media</li>
  </ul>
  <h4>Controls</h4>
  <p>Full-disk encryption (BitLocker, FileVault, VeraCrypt) with AES-256, database encryption, access controls, DLP (Data Loss Prevention), secure key management.</p>
  <div class="exam-tip">Data at rest = stored, not moving. Primary control = encryption of the storage medium. BitLocker = Windows FDE, FileVault = macOS FDE. Both use AES-128 or AES-256.</div>`},

'data-in-transit':{title:'Data in Transit',cat:'Data Protection',html:`
  <p><strong>Data in transit</strong> (also called <em>data in motion</em>) is data actively moving across a network — between a browser and web server, two servers, or over a VPN tunnel. Any unencrypted data in transit is readable by anyone with network access.</p>
  <h4>Threats</h4>
  <ul>
    <li>Eavesdropping / packet sniffing (Wireshark on the same network segment)</li>
    <li>Man-in-the-middle attacks (intercept and potentially modify traffic)</li>
    <li>Replay attacks (capture and retransmit authenticated packets)</li>
  </ul>
  <h4>Controls</h4>
  <p>TLS/HTTPS for web traffic, IPsec VPN for network tunneling, SSH for remote administration, SFTP/FTPS for file transfers, S/MIME for email. The rule: never transmit sensitive data without encryption.</p>
  <div class="exam-tip">Data in transit = always encrypt with TLS, IPsec, SSH, or equivalent. HTTP (no S), FTP, Telnet, and SMTP transmit in plaintext — never use these for sensitive data.</div>`},

'data-in-use':{title:'Data in Use',cat:'Data Protection',html:`
  <p><strong>Data in use</strong> is data actively being processed — loaded into RAM, being decrypted by an application, being computed on by a CPU. It is the <strong>hardest state to protect</strong> because the data must be decrypted to be usable.</p>
  <h4>Threats</h4>
  <ul>
    <li><strong>Memory scraping:</strong> Malware reads process memory to extract plaintext credentials or keys</li>
    <li><strong>Cold-boot attack:</strong> RAM retains data for seconds–minutes after power loss; attacker freezes DRAM, transplants it, and reads keys</li>
    <li><strong>DMA attack:</strong> Devices with direct memory access (Thunderbolt, FireWire) can read RAM directly</li>
    <li><strong>Pass the hash:</strong> NTLM hashes extracted from LSASS memory</li>
  </ul>
  <h4>Controls</h4>
  <p>Trusted Execution Environments (TEE), Secure Enclaves (Intel SGX, ARM TrustZone), Credential Guard (Windows), minimal privilege, memory encryption.</p>
  <div class="exam-tip">Data in use = RAM. Attacks target the decrypted data in memory. Credential Guard protects against pass-the-hash by isolating LSASS in a VM. Data in use is hardest to protect because encryption must be removed for processing.</div>`},

'obfuscation':{title:'Obfuscation',cat:'Data Protection',html:`
  <p><strong>Obfuscation</strong> makes data or code <strong>difficult to understand or analyze</strong> without actually encrypting it. The goal is to increase the effort required for reverse engineering, analysis, or unauthorized use — through concealment rather than mathematical protection.</p>
  <h4>Techniques</h4>
  <ul>
    <li><strong>Code obfuscation:</strong> Variable renaming, dead code insertion, control flow flattening</li>
    <li><strong>Data masking:</strong> Replacing real data with realistic-looking fake data (e.g., 4111-1111-1111-1111 instead of real card number) in non-production environments</li>
    <li><strong>Minification:</strong> Removing whitespace and shortening names in JavaScript — incidental obfuscation as a side effect of optimization</li>
  </ul>
  <h4>Limitations</h4>
  <p>Obfuscation alone is <strong>security through obscurity</strong> — not a strong security control. A determined analyst with enough time can reverse-engineer obfuscated code. Always combine with encryption for sensitive data.</p>
  <div class="exam-tip">Obfuscation ≠ encryption. Obfuscation makes things harder to read; encryption makes them mathematically impossible to read without the key. Both can be used together, but obfuscation alone is not a security control.</div>`},

'steganography':{title:'Steganography',cat:'Data Protection',html:`
  <p><strong>Steganography</strong> is the practice of <strong>hiding data inside other data</strong> — concealing the very existence of a message within an innocent-looking carrier file. Unlike encryption (which protects content but reveals communication exists), steganography hides the fact that communication is occurring at all.</p>
  <h4>Carrier types</h4>
  <ul>
    <li><strong>Image:</strong> Data embedded in least-significant bits (LSBs) of pixel color values. A 1-bit change per pixel is visually imperceptible.</li>
    <li><strong>Audio:</strong> Data hidden in inaudible frequencies or low-order bits of audio samples</li>
    <li><strong>Video:</strong> Data hidden within individual frames or inter-frame differences</li>
    <li><strong>Network:</strong> Data hidden in packet headers, timing, or unused protocol fields</li>
  </ul>
  <h4>Malicious use</h4>
  <p>Attackers use steganography to exfiltrate data through DLP tools (an image with embedded sensitive data looks like an ordinary photo) and to hide C2 commands inside innocuous images on social media.</p>
  <div class="exam-tip">Steganography = hiding the existence of data (concealment). Encryption = hiding the content of data (confidentiality). Both can be combined — encrypt first, then steganographically embed.</div>`},

'tokenization':{title:'Tokenization',cat:'Data Protection',html:`
  <p><strong>Tokenization</strong> replaces sensitive data (e.g., a credit card number) with a <strong>non-sensitive surrogate value called a token</strong>. The token has no mathematical relationship to the original data — it cannot be reversed without access to the secure token vault that maintains the mapping.</p>
  <h4>How it works</h4>
  <p>A tokenization system stores the real value (PAN) in a secure vault and issues a random token (e.g., 8742-xxxx-xxxx-9823). Applications process and store only the token. Even if the token database is stolen, the tokens are worthless — the vault is the only place the mapping exists.</p>
  <h4>PCI-DSS context</h4>
  <p>Tokenization is a standard approach to reduce PCI-DSS scope — applications that only handle tokens (not real PANs) have a dramatically reduced compliance burden.</p>
  <div class="exam-tip">Tokenization ≠ encryption. Encrypted data can be decrypted with the key. A token can only be reversed by querying the vault — and the vault can be air-gapped. Tokenization reduces compliance scope (PCI-DSS). This is testable.</div>`},

/* ── Zone 6: Digital Certificates ── */
'x509':{title:'X.509 Digital Certificate',cat:'Digital Certificates',html:`
  <p>An <strong>X.509 certificate</strong> is an electronic document that <strong>binds a public key to an identity</strong> (a server, person, device, or organization). It is digitally signed by a Certificate Authority (CA). X.509 is the ITU-T standard — virtually all TLS certificates, S/MIME email certificates, and code signing certificates follow this format.</p>
  <h4>What a certificate proves</h4>
  <p>A certificate answers: "This public key belongs to this identity, and a trusted CA has verified that claim." When your browser connects to HTTPS, it validates the site's X.509 certificate to confirm it's talking to the real server, not an impersonator.</p>
  <div class="exam-tip">X.509 V3 is current. Key extensions added in V3: Subject Alternative Names (SAN), BasicConstraints (marks CA certs), Key Usage, and CDP/OCSP URLs for revocation. Know that V1/V2 are legacy — V3 is the standard.</div>`},

'cert-cn':{title:'Distinguished Name (DN) Attributes',cat:'Digital Certificates',html:`
  <p>The <strong>Distinguished Name</strong> identifies the certificate subject (and issuer) using X.500 attribute codes. The most important attribute is the <strong>Common Name (CN)</strong>.</p>
  <h4>DN attributes</h4>
  <ul>
    <li><strong>CN</strong> — Common Name: domain name (<code>www.example.com</code>) or person's name. For wildcard certs: <code>*.example.com</code>.</li>
    <li><strong>O</strong> — Organization: legal company name</li>
    <li><strong>OU</strong> — Organizational Unit: department (deprecated in new public TLS certs)</li>
    <li><strong>C</strong> — Country: 2-letter ISO code (e.g., <code>US</code>)</li>
    <li><strong>ST</strong> — State/Province: full name (e.g., <code>California</code>)</li>
    <li><strong>L</strong> — Locality: city</li>
  </ul>
  <h4>Subject Alternative Name (SAN)</h4>
  <p>Modern certificates use the SAN extension (not just CN) to list all valid hostnames. A certificate may cover <code>example.com</code>, <code>www.example.com</code>, <code>api.example.com</code> in its SAN list.</p>
  <div class="exam-tip">CN is the most tested DN attribute. Know the abbreviations: CN, O, OU, C, ST, L. Wildcard certs (*) cover one subdomain level — <code>*.example.com</code> covers <code>www.example.com</code> but NOT <code>sub.www.example.com</code>.</div>`},

'cert-serial':{title:'Certificate Serial Number',cat:'Digital Certificates',html:`
  <p>A <strong>serial number</strong> is a unique integer assigned by the issuing CA when signing a certificate. It uniquely identifies this certificate within the issuing CA's records.</p>
  <h4>Uses</h4>
  <ul>
    <li><strong>CRL lookups:</strong> Certificate Revocation Lists list revoked serial numbers. Clients check if the certificate's serial appears in the CRL.</li>
    <li><strong>OCSP queries:</strong> The client sends the serial number to the OCSP Responder to check current revocation status.</li>
    <li><strong>Audit trails:</strong> Logs reference certificate serial numbers to identify which cert was used in a transaction.</li>
  </ul>
  <div class="exam-tip">Serial number = unique per issuing CA. Two different CAs could issue certificates with the same serial number — but within a single CA's issuance, serials are unique. The serial + issuer DN uniquely identifies any certificate globally.</div>`},

'cert-validity':{title:'Validity Period',cat:'Digital Certificates',html:`
  <p>Every X.509 certificate includes two timestamps: <strong>Not Before</strong> (earliest valid date/time) and <strong>Not After</strong> (expiration date/time). Clients <strong>reject certificates outside this window</strong>.</p>
  <h4>Current trends</h4>
  <p>Public TLS certificate maximum validity has been progressively shortened: 5 years → 3 years → 2 years (2018) → 1 year (2020 Apple requirement). The industry is moving toward 90-day certificates (as promoted by Let's Encrypt) to limit exposure windows after compromise.</p>
  <h4>Why short validity matters</h4>
  <p>A compromised certificate is dangerous until it expires or is revoked. Shorter lifetimes mean a compromised cert automatically expires sooner. Also forces organizations to maintain certificate renewal hygiene.</p>
  <div class="exam-tip">Expired certificates cause "certificate error" warnings in browsers and connection failures. Monitor certificate expiration proactively — certificate expiry is a common cause of outages and is one of the first things to check when HTTPS breaks.</div>`},

'cert-pubkey':{title:'Subject Public Key',cat:'Digital Certificates',html:`
  <p>The <strong>Subject Public Key</strong> field contains the actual public key (RSA or ECC) being certified, along with the algorithm identifier. This is the key that relying parties will use to encrypt data for the subject or verify the subject's digital signatures.</p>
  <h4>Key Usage extension</h4>
  <p>The Key Usage extension (a V3 extension) uses bit flags to restrict what the key may be used for:</p>
  <ul>
    <li><code>digitalSignature</code> — for TLS authentication and S/MIME signing</li>
    <li><code>keyEncipherment</code> — for RSA key exchange (TLS 1.2 RSA)</li>
    <li><code>keyCertSign</code> — marks a CA certificate (the key signs other certificates)</li>
    <li><code>cRLSign</code> — the key signs CRLs</li>
  </ul>
  <div class="exam-tip">Key Usage restricts how a certificate can be used. A TLS server certificate should NOT have <code>keyCertSign</code> set — that would make it a CA certificate. Misuse of key usage fields is a common misconfiguration.</div>`},

'cert-ca-sig':{title:'CA Digital Signature',cat:'Digital Certificates',html:`
  <p>The final field of an X.509 certificate is the <strong>CA's digital signature</strong> over all other certificate fields (using the CA's private key). This signature is what makes the certificate trustworthy — it proves the certificate was issued by a CA and has not been tampered with since.</p>
  <h4>Verification process</h4>
  <ol style="padding-left:16px;margin-bottom:8px">
    <li>Client retrieves the issuing CA's certificate (from the certificate chain or its own trust store)</li>
    <li>Client uses the CA's public key to verify the signature on the end-entity certificate</li>
    <li>If verification passes: the certificate is authentic and unmodified</li>
    <li>Process repeats up the chain until reaching a trusted root CA</li>
  </ol>
  <div class="exam-tip">The CA signature is what links trust. A self-signed certificate (root CA) has no external signature — it signs itself. Clients trust self-signed certs only if the cert is in their trusted root store.</div>`},

'cert-pem':{title:'PEM Certificate Format',cat:'Digital Certificates',html:`
  <p><strong>PEM (Privacy Enhanced Mail)</strong> is the most common certificate format for Linux systems and OpenSSL. PEM-encoded certificates are <strong>Base64-encoded DER bytes</strong> wrapped in text header and footer lines.</p>
  <h4>Identifying PEM files</h4>
  <p>Headers distinguish the content type:</p>
  <ul>
    <li><code>-----BEGIN CERTIFICATE-----</code> … <code>-----END CERTIFICATE-----</code></li>
    <li><code>-----BEGIN PRIVATE KEY-----</code> (PKCS#8 unencrypted)</li>
    <li><code>-----BEGIN ENCRYPTED PRIVATE KEY-----</code></li>
    <li><code>-----BEGIN CERTIFICATE REQUEST-----</code> (CSR)</li>
  </ul>
  <h4>File extensions</h4>
  <p><code>.pem</code>, <code>.crt</code>, <code>.cer</code> (confusingly — <code>.cer</code> can be PEM or DER), <code>.key</code></p>
  <div class="exam-tip">PEM = human-readable Base64 text with BEGIN/END headers. Can hold a certificate, private key, or full chain in one file. Default format for OpenSSL, Apache, Nginx, and most Linux/Unix systems.</div>`},

'cert-der':{title:'DER / CER Format',cat:'Digital Certificates',html:`
  <p><strong>DER (Distinguished Encoding Rules)</strong> is the binary encoding of X.509 certificates — raw bytes in ASN.1 DER format. <strong>CER</strong> (.cer extension) typically refers to the same binary format in Windows contexts. Not human-readable; cannot be opened in a text editor.</p>
  <h4>DER vs. PEM</h4>
  <ul>
    <li><strong>DER:</strong> Binary, compact, single certificate per file, required for cryptographic signing operations</li>
    <li><strong>PEM:</strong> Base64 text version of DER, human-readable, can hold multiple certs or a full chain</li>
  </ul>
  <p>PEM is just DER bytes encoded as Base64 with header/footer lines added. Converting between them: <code>openssl x509 -in cert.pem -outform DER -out cert.der</code></p>
  <div class="exam-tip">DER = binary single certificate (common on Windows). PEM = Base64 text (common on Linux). The .cer extension can be EITHER format — check the file content to know which. OpenSSL can convert between all formats.</div>`},

'cert-p7b':{title:'P7B / PKCS#7 Format',cat:'Digital Certificates',html:`
  <p><strong>P7B</strong> (also called PKCS#7 or CMS) is a format that can contain <strong>one or more certificates or a certificate chain</strong> — but <strong>never includes a private key</strong>. It uses Base64 encoding with a distinctive header.</p>
  <h4>Identifying P7B</h4>
  <p>Header: <code>-----BEGIN PKCS7-----</code></p>
  <p>File extensions: <code>.p7b</code>, <code>.p7c</code></p>
  <h4>Common uses</h4>
  <ul>
    <li>Distributing CA certificate chains (intermediate + root) to configure servers</li>
    <li>Java KeyStore / keytool import format</li>
    <li>Windows certificate import (MMC) format for certificate-only imports</li>
  </ul>
  <div class="exam-tip">P7B = chain only, NO private key. If you need to move a certificate WITH its private key, use P12/PFX. This distinction is commonly tested — P7B is chain-only, P12 includes the private key.</div>`},

'cert-p12':{title:'P12 / PFX Format',cat:'Digital Certificates',html:`
  <p><strong>P12</strong> (PKCS#12) is an archive format that bundles a certificate, its complete chain, AND the <strong>private key</strong> in a single file, protected by a password. Microsoft's implementation uses the <code>.pfx</code> extension — functionally identical to <code>.p12</code>.</p>
  <h4>When to use P12/PFX</h4>
  <ul>
    <li>Moving a certificate + private key between servers</li>
    <li>Importing into Windows IIS or other Windows services</li>
    <li>Backing up a certificate with its key</li>
    <li>Deploying client certificates to user devices</li>
  </ul>
  <h4>Security warning</h4>
  <p>The private key is inside the file — always use a strong password. Compromise of the PFX file without a password = immediate private key exposure requiring certificate revocation.</p>
  <div class="warn-box">P12/PFX contains the PRIVATE KEY. This file must be password-protected and treated with the same security as the private key itself. Exporting without a password is catastrophically insecure.</div>`},

'openssl':{title:'OpenSSL',cat:'Digital Certificates',html:`
  <p><strong>OpenSSL</strong> is the most widely used open-source toolkit for TLS/SSL and general cryptographic operations. It is the backbone of most Linux/Unix PKI operations.</p>
  <h4>Key commands to know</h4>
  <ul>
    <li><code>openssl req -new -key priv.key -out csr.csr</code> — Generate a CSR</li>
    <li><code>openssl req -x509 -key priv.key -days 365 -out cert.pem</code> — Create self-signed cert</li>
    <li><code>openssl x509 -in cert.pem -text -noout</code> — Inspect/parse a certificate</li>
    <li><code>openssl s_client -connect host:443</code> — Test TLS handshake, view cert chain</li>
    <li><code>openssl pkcs12 -export -in cert.pem -inkey key.pem -out bundle.p12</code> — Create P12</li>
    <li><code>openssl x509 -in cert.pem -outform DER -out cert.der</code> — Convert PEM→DER</li>
  </ul>
  <div class="exam-tip">OpenSSL is the reference implementation for testing TLS. The exam may describe a command to "view the certificate chain from a server" — that's <code>openssl s_client -connect host:443</code>.</div>`},

/* ── Zone 7: PKI Infrastructure ── */
'root-ca':{title:'Root CA',cat:'PKI Infrastructure',html:`
  <p>The <strong>Root CA</strong> is the top-level Certificate Authority in a PKI hierarchy. It issues a <strong>self-signed certificate</strong> (signs its own cert using its own private key) and is the <strong>root of trust</strong> for the entire hierarchy.</p>
  <h4>Why it must be offline</h4>
  <p>The Root CA's private key is the most valuable key in the entire PKI — compromise means the entire hierarchy must be rebuilt. The Root CA is kept <strong>offline and air-gapped</strong>, brought online only to sign Intermediate CA certificates (perhaps once a year or less). No network connection = no remote attack surface.</p>
  <h4>Key storage</h4>
  <p>Root CA private key typically stored in an HSM in a physically secured, access-controlled vault. Multiple ceremony participants required (key ceremony) to prevent insider threats.</p>
  <div class="exam-tip">Root CA = self-signed, offline, root of trust. NEVER online for day-to-day operations. If Root CA private key is compromised, the ENTIRE PKI is compromised and must be rebuilt from scratch.</div>`},

'intermediate-ca':{title:'Intermediate CA',cat:'PKI Infrastructure',html:`
  <p>An <strong>Intermediate CA</strong> (also called a Subordinate CA or Issuing CA) is a CA whose certificate is signed by the Root CA. It handles <strong>day-to-day certificate issuance</strong> — TLS certificates for servers, client certificates, code signing certificates, etc.</p>
  <h4>Why use intermediates?</h4>
  <p>If the Root CA signed all end-entity certificates directly, it would need to be online constantly — exposing its private key to network attacks. Intermediates absorb this risk: if an Intermediate CA is compromised, only that intermediate's certificates are revoked. The Root CA and other intermediates remain intact.</p>
  <h4>Certificate chain</h4>
  <p>Most TLS server certificates have a chain: End-entity cert → Intermediate CA cert → Root CA cert. Servers must send the full chain (excluding the root — clients have it in their trust store).</p>
  <div class="exam-tip">Intermediate CA = online, issues end-entity certs. Compromising intermediate requires only revoking that intermediate — root is safe. Most production PKIs have 1-2 intermediate CAs between root and end-entity certificates.</div>`},

'ca':{title:'Certificate Authority (CA)',cat:'PKI Infrastructure',html:`
  <p>A <strong>Certificate Authority</strong> is the trusted entity responsible for <strong>issuing, signing, and managing digital certificates</strong>. The CA verifies that the certificate requester is who they claim to be, then binds their public key to their identity by signing the certificate.</p>
  <h4>Types of CAs</h4>
  <ul>
    <li><strong>Public CA:</strong> DigiCert, Let's Encrypt, GlobalSign, Sectigo. Their root certificates are pre-installed in browsers and operating systems — certificates they issue are automatically trusted.</li>
    <li><strong>Private/Enterprise CA:</strong> Internal CA for an organization (Microsoft ADCS, open-source EJBCA). Used for internal services, VPNs, device certificates. Must be manually deployed to client trust stores.</li>
  </ul>
  <h4>Validation levels (public CAs)</h4>
  <ul>
    <li><strong>DV (Domain Validation):</strong> CA verifies domain control only. Automated (Let's Encrypt).</li>
    <li><strong>OV (Organization Validation):</strong> CA verifies organization identity. Manual verification.</li>
    <li><strong>EV (Extended Validation):</strong> Rigorous legal entity verification. Historically showed green bar.</li>
  </ul>
  <div class="exam-tip">Know the three CA validation levels: DV (domain only), OV (org verified), EV (rigorous identity check). Let's Encrypt issues DV certificates only, automated via the ACME protocol.</div>`},

'ra':{title:'Registration Authority (RA)',cat:'PKI Infrastructure',html:`
  <p>A <strong>Registration Authority</strong> performs <strong>identity verification on behalf of the CA</strong>. The RA validates who the certificate requester is — checking government IDs, verifying domain ownership, confirming organizational identity — but the CA does the actual signing.</p>
  <h4>Why separate RA from CA?</h4>
  <p>Separating identity verification (RA) from key operations (CA) is a principle of <strong>separation of duties</strong>. The RA may be geographically distributed or managed by a different team, while the CA signing infrastructure remains centralized and secured. An RA compromise does not expose the CA's private key.</p>
  <div class="exam-tip">RA verifies IDENTITY; CA issues the CERTIFICATE. The RA can reject requests but cannot sign certificates — only the CA can sign. This separation of duties is a PKI design principle.</div>`},

'csr':{title:'CSR — Certificate Signing Request',cat:'PKI Infrastructure',html:`
  <p>A <strong>Certificate Signing Request</strong> is a message sent from an applicant to a CA, requesting a certificate. It contains:</p>
  <ul>
    <li>The applicant's <strong>public key</strong></li>
    <li>The requested <strong>Distinguished Name</strong> (CN, O, C, etc.)</li>
    <li>The <strong>Subject Alternative Names</strong> (hostnames to include)</li>
    <li>A digital signature made with the applicant's <strong>private key</strong> (proves the applicant possesses the corresponding private key — "proof of possession")</li>
  </ul>
  <p>The CA verifies the request, validates identity, and returns a signed certificate. The private key <strong>never</strong> leaves the applicant's system — only the public key travels in the CSR.</p>
  <div class="exam-tip">The private key NEVER leaves the system — only the public key is in the CSR. Generated with: <code>openssl req -new -key private.key -out request.csr</code>. The CA signs the CSR and returns a certificate.</div>`},

'cert-store':{title:'Certificate Store',cat:'PKI Infrastructure',html:`
  <p>A <strong>certificate store</strong> is a repository where trusted root CA certificates and personal certificates are kept. Operating systems maintain a built-in trusted root CA store — any certificate whose chain leads to one of those trusted roots is automatically trusted by the OS and its applications.</p>
  <h4>Platform-specific stores</h4>
  <ul>
    <li><strong>Windows:</strong> Windows Certificate Store, managed via MMC (certmgr.msc) or GPO. Stores: Trusted Root CAs, Intermediate CAs, Personal, etc.</li>
    <li><strong>macOS:</strong> Keychain (System Roots, System, Login)</li>
    <li><strong>Linux:</strong> /etc/ssl/certs/ (varies by distro), update-ca-certificates tool</li>
    <li><strong>Firefox:</strong> Maintains its own independent certificate store — does not use the OS store</li>
  </ul>
  <div class="exam-tip">Firefox has its own certificate store independent of the OS. This means adding a private CA cert to the Windows cert store does NOT automatically make Firefox trust it — you must import it separately into Firefox.</div>`},

'root-of-trust':{title:'Root of Trust',cat:'PKI Infrastructure',html:`
  <p>A <strong>root of trust</strong> is the foundational component that all trust in a system ultimately derives from. In PKI, the Root CA certificate is the root of trust — everything chains back to it. In hardware security, the root of trust is a physical component.</p>
  <h4>Hardware roots of trust</h4>
  <ul>
    <li><strong>TPM (Trusted Platform Module):</strong> A hardware chip that provides cryptographic key storage, measured boot, and attestation. TPM is the hardware root of trust in most enterprise PCs and laptops.</li>
    <li><strong>Secure Boot:</strong> Uses a root of trust (TPM or UEFI keys) to verify boot components haven't been tampered with.</li>
    <li><strong>HSM:</strong> Hardware Security Module — provides a hardware root of trust for key management operations.</li>
  </ul>
  <div class="exam-tip">Root of trust = the starting point that everything else trusts. For PKI: Root CA certificate. For device security: TPM chip. For software: Secure Boot signing keys. If the root of trust is compromised, everything built on it is compromised.</div>`},

'cert-chain':{title:'Certificate Chain',cat:'PKI Infrastructure',html:`
  <p>A <strong>certificate chain</strong> (also called a trust chain or chain of trust) is the sequence of certificates from an end-entity certificate back to a trusted root CA. Each certificate in the chain is signed by the one above it.</p>
  <h4>Validation process</h4>
  <ol style="padding-left:16px;margin-bottom:8px">
    <li>Client receives the server's end-entity certificate</li>
    <li>Client checks the issuer field and retrieves the intermediate CA's certificate</li>
    <li>Client verifies the end-entity cert using the intermediate CA's public key</li>
    <li>Client checks the intermediate CA's issuer and retrieves the root CA certificate</li>
    <li>Client verifies the intermediate CA cert using the root CA's public key</li>
    <li>Root CA is in the client's trust store → chain is valid → connection proceeds</li>
  </ol>
  <div class="exam-tip">A broken certificate chain (missing intermediate) causes "untrusted certificate" errors even if the root CA is trusted. Servers must send the full chain (end-entity + all intermediates). The root CA cert is NOT sent — clients already have it.</div>`},

/* ── Zone 8: Certificate Revocation ── */
'crl':{title:'CRL — Certificate Revocation List',cat:'Cert Revocation',html:`
  <p>A <strong>CRL</strong> is a signed list published by the CA containing the serial numbers of all certificates it has revoked before their expiration date. The URL of the CRL Distribution Point (CDP) is embedded in the certificate's extensions field.</p>
  <h4>Reasons for revocation</h4>
  <p>Private key compromise, CA compromise, subject is no longer authorized, certificate issued to the wrong entity, or the certificate contains incorrect information.</p>
  <h4>Limitations</h4>
  <ul>
    <li><strong>Not real-time:</strong> CRLs are published periodically (every 24h–7d). A certificate revoked immediately after the last CRL update remains trusted until clients download the next CRL.</li>
    <li><strong>Large file size:</strong> High-volume CAs have large CRLs — downloading them on every connection wastes bandwidth.</li>
  </ul>
  <div class="exam-tip">CRL = periodic list of revoked serial numbers. Not real-time. Clients download and cache it. OCSP is the real-time alternative. OCSP Stapling is the optimized version of OCSP.</div>`},

'ocsp':{title:'OCSP — Online Certificate Status Protocol',cat:'Cert Revocation',html:`
  <p><strong>OCSP</strong> provides <strong>real-time certificate revocation checking</strong>. Instead of downloading a full CRL, the client sends the certificate's serial number to an OCSP Responder (operated by the CA) and receives a signed response: <strong>Good</strong>, <strong>Revoked</strong>, or <strong>Unknown</strong>.</p>
  <h4>Advantages over CRL</h4>
  <ul>
    <li>Real-time status — revocation is reflected immediately</li>
    <li>Small response — just the status for one certificate</li>
  </ul>
  <h4>Disadvantages</h4>
  <ul>
    <li><strong>Privacy concern:</strong> The CA's OCSP server sees which certificates clients are checking — revealing which websites you visit</li>
    <li><strong>Latency:</strong> Adds a network round-trip to every TLS handshake</li>
    <li><strong>Availability dependency:</strong> If the OCSP Responder is down, TLS connections may fail or soft-fail</li>
  </ul>
  <div class="exam-tip">OCSP = real-time status check. Privacy problem (CA sees all checks). Latency problem (extra round-trip). OCSP Stapling solves both by moving the OCSP check to the server.</div>`},

'ocsp-stapling':{title:'OCSP Stapling',cat:'Cert Revocation',html:`
  <p>With <strong>OCSP Stapling</strong>, the <em>web server</em> — not the client — fetches and caches a signed OCSP response from the CA. During the TLS handshake, the server "staples" (appends) this cached response to the Certificate message. The client receives revocation proof without making a separate OCSP request.</p>
  <h4>Benefits</h4>
  <ul>
    <li><strong>Privacy:</strong> CA never sees the client's IP — only the server communicates with the OCSP Responder</li>
    <li><strong>Performance:</strong> No additional client-side round-trip — the OCSP response is already in the TLS handshake</li>
    <li><strong>Availability:</strong> If the OCSP Responder is temporarily down, the server can serve its cached (still-valid) response</li>
  </ul>
  <h4>Freshness</h4>
  <p>Stapled OCSP responses have a short validity period (24–48 hours) and must be periodically refreshed by the server.</p>
  <div class="exam-tip">OCSP Stapling = server pre-fetches and includes the OCSP response in the handshake. Client gets fresh revocation info without a privacy-leaking CA query. This is the modern best practice for revocation checking.</div>`},

/* ── Zone 8: Advanced PKI ── */
'cert-pinning':{title:'Certificate Pinning',cat:'Advanced PKI',html:`
  <p><strong>Certificate pinning</strong> (or public key pinning) is a technique where an application <strong>hardcodes the expected certificate or public key fingerprint</strong>. The application rejects any certificate presented by the server — even a valid CA-signed one — if it does not match the pinned value.</p>
  <h4>What it protects against</h4>
  <ul>
    <li>Rogue CAs issuing fraudulent certificates for your domain</li>
    <li>Compromised CA that issues a MITM certificate</li>
    <li>Attacker who has obtained a seemingly valid certificate through social engineering of a CA</li>
  </ul>
  <h4>Risk</h4>
  <p>If the pinned certificate expires and the app is not updated in time, the application cannot connect until the pin is updated. This has caused production outages. High-security mobile apps (banking, healthcare) use pinning despite this risk.</p>
  <div class="exam-tip">Cert pinning protects against rogue CAs — even a certificate trusted by the OS is rejected if it doesn't match the pin. Risk: certificate rotation requires app update. The exam may describe this as a "defense against fraudulent CA certificates."</div>`},

'key-escrow':{title:'Key Escrow',cat:'Advanced PKI',html:`
  <p><strong>Key escrow</strong> is the practice of storing a copy of a cryptographic private key with a <strong>trusted third party</strong> (the escrow agent). This allows key recovery if the key holder loses access or leaves the organization.</p>
  <h4>Legitimate use cases</h4>
  <ul>
    <li>Enterprise environments where employees may leave without surrendering keys</li>
    <li>Data recovery when a user forgets their encryption password</li>
    <li>Legal/compliance hold requirements for encrypted communications</li>
  </ul>
  <h4>Controversy</h4>
  <p>Governments have historically pushed for mandatory key escrow to enable lawful interception. Security experts strongly oppose this — an escrow store is an extremely high-value target, and the existence of a backdoor weakens security for everyone, legitimate users and adversaries alike.</p>
  <div class="exam-tip">Key escrow enables recovery but creates a high-value attack target. The security community opposes government-mandated key escrow because it creates systemic vulnerabilities. The exam tests that you know what key escrow IS and why it's controversial.</div>`},

'kms':{title:'KMS — Key Management System',cat:'Advanced PKI',html:`
  <p>A <strong>Key Management System (KMS)</strong> is a centralized platform for the full cryptographic key lifecycle: <strong>creation, storage, distribution, rotation, and revocation</strong>. It enforces policy — who can use which keys, for what operations, and with what audit logging.</p>
  <h4>Cloud KMS providers</h4>
  <ul>
    <li><strong>AWS KMS:</strong> Customer Master Keys (CMKs) managed in AWS. Keys never leave AWS in plaintext — all crypto happens inside KMS.</li>
    <li><strong>Azure Key Vault:</strong> Secrets, keys, and certificates managed by Microsoft Azure.</li>
    <li><strong>Google Cloud KMS:</strong> FIPS 140-2 Level 1 by default; Level 3 with Cloud HSM.</li>
  </ul>
  <h4>HSM integration</h4>
  <p>KMS systems typically store master keys inside HSMs — tamper-resistant hardware that performs cryptographic operations without ever exposing the raw key material to software.</p>
  <div class="exam-tip">KMS = software/service layer for managing key lifecycle. HSM = hardware device that stores keys and performs crypto. KMS typically USES HSMs internally. Cloud KMS allows applications to request crypto operations without ever seeing the raw key.</div>`},

'hsm':{title:'HSM — Hardware Security Module',cat:'Advanced PKI',html:`
  <p>An <strong>HSM</strong> is a <strong>tamper-resistant hardware device</strong> that provides secure cryptographic key storage and performs cryptographic operations internally. Private keys generated inside an HSM <strong>never leave the device in plaintext</strong>.</p>
  <h4>Tamper resistance features</h4>
  <ul>
    <li>Physical tamper detection (drilling, opening the case triggers key destruction)</li>
    <li>Cryptographic processing happens inside the secure boundary</li>
    <li>FIPS 140-2 Level 3 or 4 certified (highest assurance levels)</li>
  </ul>
  <h4>Use cases</h4>
  <p>Root CA private key storage, TLS acceleration (offloading RSA/ECDSA operations), payment processing (HSMs in ATMs, point-of-sale terminals), code signing infrastructure.</p>
  <div class="exam-tip">HSM = tamper-resistant hardware, keys never exported in plaintext, FIPS 140-2 certified. The Root CA's private key should always be stored in an HSM. HSMs are also used by banks and payment processors for PCI-DSS compliance.</div>`},

'entropy':{title:'Entropy',cat:'Advanced PKI',html:`
  <p><strong>Entropy</strong> is the measure of <strong>unpredictability (randomness)</strong> available for cryptographic key generation. All cryptographic security depends on keys being generated from a truly random source — if an attacker can predict or reduce the key space, they can break the cryptography regardless of algorithm strength.</p>
  <h4>Sources of entropy</h4>
  <ul>
    <li><strong>Hardware RNG:</strong> CPU instructions (RDRAND on Intel/AMD), thermal noise, radioactive decay</li>
    <li><strong>OS entropy pools:</strong> <code>/dev/urandom</code> and <code>/dev/random</code> on Linux, collecting entropy from hardware events</li>
    <li><strong>TRNG (True Random Number Generator):</strong> Hardware random number generators in HSMs — highest quality entropy for key generation</li>
  </ul>
  <h4>Low entropy attacks</h4>
  <p>Virtual machines and containers that boot identically may have low initial entropy — keys generated at boot time may be predictable. This was exploited in 2012 (Debian OpenSSL vulnerability) to factor RSA keys across the internet.</p>
  <div class="exam-tip">Low entropy = predictable keys = weak cryptography even with a strong algorithm. HSMs use TRNGs for highest-quality entropy. The exam may describe a scenario where weak keys were generated — root cause is often insufficient entropy at key generation time.</div>`},

/* ── Zone 9: Protocols & Encoding ── */
'smime':{title:'S/MIME — Secure/Multipurpose Internet Mail Extensions',cat:'Protocols & Encoding',html:`
  <p><strong>S/MIME</strong> provides <strong>email encryption and digital signing</strong> using X.509 certificates. It extends the MIME standard to support cryptographic operations on email content.</p>
  <h4>Security services provided</h4>
  <ul>
    <li><strong>Confidentiality:</strong> Encrypts the email body so only the recipient (with the private key) can read it</li>
    <li><strong>Integrity:</strong> Detects any modification to the email after signing</li>
    <li><strong>Authentication:</strong> Proves the email came from the owner of the signing certificate</li>
    <li><strong>Non-repudiation:</strong> The sender cannot deny signing — only their private key could have created the signature</li>
  </ul>
  <h4>Requirement</h4>
  <p>Both sender and recipient must have X.509 certificates. To encrypt to someone, you need their public key (from their certificate). Widely deployed in enterprise email (Outlook, Exchange).</p>
  <div class="exam-tip">S/MIME provides all four security services: confidentiality, integrity, authentication, AND non-repudiation. The four-property combo (email security) = S/MIME. PGP is an alternative approach using a "web of trust" rather than CA hierarchy.</div>`},

'cms':{title:'CMS — Cryptographic Message Syntax',cat:'Protocols & Encoding',html:`
  <p><strong>CMS</strong> (RFC 5652) is the underlying ASN.1-based data format that S/MIME uses. It defines how to structure signed, encrypted, and authenticated data objects. S/MIME is essentially an email application of CMS.</p>
  <h4>CMS data types</h4>
  <ul>
    <li><strong>SignedData:</strong> Data with one or more digital signatures</li>
    <li><strong>EnvelopedData:</strong> Encrypted data with encrypted key for each recipient</li>
    <li><strong>DigestedData:</strong> Data with a message digest (integrity only)</li>
    <li><strong>AuthenticatedData:</strong> Data authenticated with HMAC</li>
  </ul>
  <div class="exam-tip">CMS is the underlying format for S/MIME. The exam rarely tests CMS directly — but knowing that S/MIME uses CMS/PKCS#7 format helps with format questions. P7B files use PKCS#7 (CMS) format.</div>`},

'tls':{title:'TLS — Transport Layer Security',cat:'Protocols & Encoding',html:`
  <p><strong>TLS</strong> is the cryptographic protocol that secures most internet communication — HTTPS, SMTPS, IMAPS, FTPS, and more. It provides <strong>confidentiality, integrity, and server authentication</strong> (optionally mutual authentication).</p>
  <h4>TLS 1.3 vs. 1.2 key differences</h4>
  <ul>
    <li><strong>PFS mandatory:</strong> TLS 1.3 only supports ECDHE/DHE — no static RSA key exchange</li>
    <li><strong>Faster handshake:</strong> 1-RTT (one round trip) vs. 2-RTT in TLS 1.2</li>
    <li><strong>Weak ciphers removed:</strong> No RC4, 3DES, MD5, SHA-1, or export-grade ciphers</li>
    <li><strong>0-RTT resumption:</strong> Session resumption can be instant (with replay attack caveats)</li>
  </ul>
  <h4>Deprecated versions</h4>
  <p>TLS 1.0 and 1.1 are deprecated (RFC 8996, 2021). SSL 3.0 has been prohibited since 2015 (RFC 7568, POODLE attack).</p>
  <div class="exam-tip">TLS 1.3 = PFS mandatory, 1-RTT handshake, weak ciphers removed. TLS 1.0/1.1 = deprecated. SSL 3.0 = prohibited. If asked about a "downgrade attack," the defense is enforcing minimum TLS version on the server.</div>`},

'blockchain':{title:'Blockchain',cat:'Protocols & Encoding',html:`
  <p>A <strong>blockchain</strong> is a <strong>distributed, append-only ledger</strong> secured by cryptographic hashing. Each <strong>block</strong> contains a set of transactions, a timestamp, and the <strong>hash of the previous block</strong> — creating an unbreakable chain.</p>
  <h4>Tamper-evidence by design</h4>
  <p>Altering any block would change its hash, which would invalidate the "previous block hash" stored in the next block, cascading through all subsequent blocks. An attacker would need to recompute every block after the tampered one — computationally infeasible in a live network.</p>
  <h4>Cryptographic components</h4>
  <ul>
    <li><strong>SHA-256:</strong> Used in Bitcoin proof-of-work and block hashing</li>
    <li><strong>ECDSA:</strong> Signs transactions (proves wallet ownership)</li>
    <li><strong>Merkle trees:</strong> Efficient hashing of all transactions in a block</li>
  </ul>
  <div class="exam-tip">Blockchain = tamper-evident via chained SHA-256 hashes. No central authority needed. Key security property: altering any past block invalidates all subsequent blocks. The exam tests that you understand why blockchain is tamper-evident (the chained hash structure).</div>`},

'asn1':{title:'ASN.1 — Abstract Syntax Notation One',cat:'Protocols & Encoding',html:`
  <p><strong>ASN.1</strong> is an ISO/ITU-T standard for describing data structures in a way that is independent of programming language or platform. X.509 certificates, PKCS key formats, and CRLs are all <em>defined</em> in ASN.1 notation.</p>
  <h4>ASN.1 is a schema language, not an encoding</h4>
  <p>ASN.1 describes WHAT the data structure contains. Separate encoding rules (BER, DER, PEM) specify HOW to serialize that structure to bytes. An ASN.1 structure can be encoded in BER, DER, or CER — all represent the same data, just serialized differently.</p>
  <h4>Example</h4>
  <p>An X.509 certificate is defined in ASN.1 as a structure containing a TBSCertificate, SignatureAlgorithm, and Signature. The TBSCertificate itself contains version, serial, issuer, validity, subject, public key, and extensions — all described in ASN.1.</p>
  <div class="exam-tip">ASN.1 = the schema/description language. DER/BER/CER = the serialization/encoding rules. "The certificate is encoded in DER" means the ASN.1 structure was serialized using Distinguished Encoding Rules into binary bytes.</div>`},

'ber-enc':{title:'BER — Basic Encoding Rules',cat:'Protocols & Encoding',html:`
  <p><strong>BER</strong> is the original serialization rule for ASN.1 structures. BER allows <strong>multiple valid encodings</strong> for the same ASN.1 value — for example, a boolean TRUE can be represented as 0x01 or 0xFF under BER.</p>
  <h4>Problem for cryptography</h4>
  <p>If two different parties encode the same data and get different byte sequences, they will compute different hashes — making digital signatures impossible. Cryptographic signing requires that every party produce <strong>identical bytes</strong> for identical data.</p>
  <p>BER's flexibility makes it unsuitable for signing. This is why DER was defined — as a strict canonical subset of BER where every ASN.1 value has exactly one valid encoding.</p>
  <div class="exam-tip">BER = flexible but NOT suitable for digital signatures (multiple valid encodings). DER = canonical (exactly one encoding) and used for crypto operations. "Canonical" means: given the same ASN.1 data, DER always produces identical bytes on any system.</div>`},

'der-enc':{title:'DER — Distinguished Encoding Rules',cat:'Protocols & Encoding',html:`
  <p><strong>DER</strong> is a strict, canonical subset of BER. It eliminates BER's flexibility by specifying that every ASN.1 value has <strong>exactly one valid byte representation</strong>. This is essential for cryptographic operations where all parties must produce identical bytes.</p>
  <h4>Use in X.509 PKI</h4>
  <ul>
    <li>X.509 certificates are DER-encoded before being signed by the CA</li>
    <li>Private keys in PKCS#8 format are DER-encoded</li>
    <li>CRLs are DER-encoded</li>
    <li>The <code>.der</code> and <code>.cer</code> file extensions typically indicate DER-encoded certificates</li>
  </ul>
  <p>PEM format is simply DER bytes encoded as Base64 with header/footer lines. Converting: <code>openssl x509 -inform DER -in cert.der -outform PEM -out cert.pem</code></p>
  <div class="exam-tip">DER = canonical binary format for certificates. Required for crypto signing. PEM = Base64-encoded DER. So PEM and DER represent the SAME data — PEM is just a text-safe wrapper around DER binary.</div>`},

'pem-enc':{title:'PEM — Privacy Enhanced Mail (Encoding)',cat:'Protocols & Encoding',html:`
  <p><strong>PEM encoding</strong> is the text representation of DER-encoded binary data. DER bytes are Base64-encoded and wrapped with human-readable header/footer lines. Originally defined for email transmission of binary cryptographic objects — hence "Privacy Enhanced Mail."</p>
  <h4>The structure</h4>
  <pre style="background:var(--surface2);padding:8px;border-radius:4px;font-size:10px;margin:6px 0;overflow-x:auto">-----BEGIN CERTIFICATE-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
(Base64-encoded DER bytes)
-----END CERTIFICATE-----</pre>
  <h4>What PEM can contain</h4>
  <p>Any binary ASN.1/DER object: certificates, private keys, CSRs, CRLs, PKCS#7 chains. The header line identifies the content type (CERTIFICATE, PRIVATE KEY, CERTIFICATE REQUEST, etc.).</p>
  <div class="exam-tip">PEM wraps binary DER in Base64 text. The relationship: ASN.1 (schema) → DER (binary serialization) → PEM (Base64 text of DER). PEM is just DER made text-safe for email and config files. All three describe the same certificate data.</div>`}
};

/* ═══ CATEGORIES ═══ */
const CATEGORIES = [
  {id:'hashing',    label:'Hashing & Integrity',   color:'#1abc9c', nodes:['hash-function','md5','sha1','sha256','sha3','hmac','non-repudiation','checksum','hash-collision']},
  {id:'pwattacks',  label:'Password Attacks',       color:'#e74c3c', nodes:['online-attack','offline-attack','dict-attack','brute-force-pw','spraying','pass-hash','birthday-attack','rainbow-table']},
  {id:'pwdefense',  label:'Password Defenses',      color:'#2ecc71', nodes:['salting','key-stretching','bcrypt','pbkdf2','argon2']},
  {id:'symmetric',  label:'Symmetric Encryption',   color:'#3498db', nodes:['symmetric-key','aes','triple-des','blowfish','twofish','block-cipher','stream-cipher','rc4','chacha20']},
  {id:'asymmetric', label:'Asymmetric Encryption',  color:'#9b59b6', nodes:['asymmetric-key','rsa','dsa','ecc','ecdsa','hybrid-crypto']},
  {id:'pfs',        label:'Key Exchange & PFS',     color:'#e67e22', nodes:['key-exchange','static-key','ephemeral-key','pfs','dhe','ecdhe']},
  {id:'dataprotect',label:'Data Protection',        color:'#f1c40f', nodes:['data-at-rest','data-in-transit','data-in-use','obfuscation','steganography','tokenization']},
  {id:'certs',      label:'Digital Certificates',   color:'#3498db', nodes:['x509','cert-cn','cert-serial','cert-validity','cert-pubkey','cert-ca-sig','cert-pem','cert-der','cert-p7b','cert-p12','openssl']},
  {id:'pki',        label:'PKI Infrastructure',     color:'#f1c40f', nodes:['root-ca','intermediate-ca','ca','ra','csr','cert-store','root-of-trust','cert-chain']},
  {id:'revocation', label:'Cert Revocation',        color:'#1abc9c', nodes:['crl','ocsp','ocsp-stapling']},
  {id:'advpki',     label:'Advanced PKI',           color:'#e74c3c', nodes:['cert-pinning','key-escrow','kms','hsm','entropy']},
  {id:'protocols',  label:'Protocols & Encoding',   color:'#9b59b6', nodes:['smime','cms','tls','blockchain','asn1','ber-enc','der-enc','pem-enc']},
];

/* ═══ GRAPH NODES ═══ */
function gn(id,label,color,nodeId,x,y){return{id,label,color,nodeId:nodeId||null,x,y,vx:0,vy:0,r:20,pinned:false}}
function ge(s,t,type,label){return{s,t,type:type||'relates',label:label||null}}

const GNODES = [
  gn('cat-hashing',   'Hashing\n& Integrity',    '#1abc9c',null,-700,-400),
  gn('cat-pwattacks', 'Password\nAttacks',        '#e74c3c',null,-150,-490),
  gn('cat-pwdefense', 'Password\nDefenses',       '#2ecc71',null, 250,-490),
  gn('cat-symmetric', 'Symmetric\nEncryption',    '#3498db',null,-700,-100),
  gn('cat-asymmetric','Asymmetric\nEncryption',   '#9b59b6',null,-150,-100),
  gn('cat-pfs',       'Key Exchange\n& PFS',      '#e67e22',null, 250,-100),
  gn('cat-dataprotect','Data\nProtection',        '#f1c40f',null, 620,-200),
  gn('cat-certs',     'Digital\nCertificates',    '#3498db',null,-500, 250),
  gn('cat-pki',       'PKI\nInfrastructure',      '#f1c40f',null,   0, 350),
  gn('cat-revocation','Cert\nRevocation',         '#1abc9c',null, 350, 300),
  gn('cat-advpki',    'Advanced\nPKI',            '#e74c3c',null, 620, 300),
  gn('cat-protocols', 'Protocols\n& Encoding',    '#9b59b6',null, 100, 500),

  /* Hashing & Integrity */
  gn('hash-function',  'Hash\nFunction',    '#1abc9c','hash-function', -770,-450),
  gn('md5',            'MD5',              '#e74c3c','md5',            -680,-470),
  gn('sha1',           'SHA-1',            '#e67e22','sha1',           -770,-380),
  gn('sha256',         'SHA-256',          '#2ecc71','sha256',         -680,-400),
  gn('sha3',           'SHA-3',            '#2ecc71','sha3',           -640,-450),
  gn('hmac',           'HMAC',             '#3498db','hmac',           -800,-340),
  gn('non-repudiation','Non-\nRepudiation','#9b59b6','non-repudiation',-720,-350),
  gn('checksum',       'Checksum',         '#95a5a6','checksum',       -640,-380),
  gn('hash-collision', 'Hash\nCollision',  '#e67e22','hash-collision', -780,-310),

  /* Password Attacks */
  gn('online-attack',  'Online\nAttack',   '#e67e22','online-attack',  -230,-550),
  gn('offline-attack', 'Offline\nAttack',  '#e74c3c','offline-attack', -140,-570),
  gn('dict-attack',    'Dictionary\nAttack','#e74c3c','dict-attack',    -60,-545),
  gn('brute-force-pw', 'Brute\nForce',     '#e74c3c','brute-force-pw', -230,-470),
  gn('spraying',       'Spraying',         '#e67e22','spraying',       -150,-490),
  gn('pass-hash',      'Pass\nthe Hash',   '#e74c3c','pass-hash',       -70,-470),
  gn('birthday-attack','Birthday\nAttack', '#e67e22','birthday-attack', -200,-445),
  gn('rainbow-table',  'Rainbow\nTable',   '#e74c3c','rainbow-table',   -110,-445),

  /* Password Defenses */
  gn('salting',        'Salting',          '#2ecc71','salting',         170,-550),
  gn('key-stretching', 'Key\nStretching',  '#2ecc71','key-stretching',  270,-560),
  gn('bcrypt',         'bcrypt',           '#1abc9c','bcrypt',          360,-540),
  gn('pbkdf2',         'PBKDF2',           '#3498db','pbkdf2',          190,-475),
  gn('argon2',         'Argon2',           '#1abc9c','argon2',          310,-475),

  /* Symmetric Encryption */
  gn('symmetric-key',  'Symmetric\nKey',   '#3498db','symmetric-key',  -800,-155),
  gn('aes',            'AES',              '#2ecc71','aes',             -700,-185),
  gn('triple-des',     '3DES',             '#e67e22','triple-des',      -820, -90),
  gn('blowfish',       'Blowfish',         '#e74c3c','blowfish',        -795, -50),
  gn('twofish',        'Twofish',          '#3498db','twofish',         -690, -60),
  gn('block-cipher',   'Block\nCipher',    '#3498db','block-cipher',    -600,-170),
  gn('stream-cipher',  'Stream\nCipher',   '#9b59b6','stream-cipher',   -600, -90),
  gn('rc4',            'RC4',              '#e74c3c','rc4',             -640, -40),
  gn('chacha20',       'ChaCha20',         '#2ecc71','chacha20',        -640,-135),

  /* Asymmetric Encryption */
  gn('asymmetric-key', 'Asymmetric\nKey',  '#9b59b6','asymmetric-key', -240,-155),
  gn('rsa',            'RSA',              '#3498db','rsa',             -145,-180),
  gn('dsa',            'DSA',              '#95a5a6','dsa',              -60,-155),
  gn('ecc',            'ECC',              '#2ecc71','ecc',             -235, -80),
  gn('ecdsa',          'ECDSA',            '#2ecc71','ecdsa',           -140, -70),
  gn('hybrid-crypto',  'Hybrid\nCrypto',   '#1abc9c','hybrid-crypto',    -60, -80),

  /* Key Exchange & PFS */
  gn('key-exchange',   'Key\nExchange',    '#3498db','key-exchange',     165,-155),
  gn('static-key',     'Static\nKey',      '#e74c3c','static-key',       265,-165),
  gn('ephemeral-key',  'Ephemeral\nKey',   '#2ecc71','ephemeral-key',    360,-145),
  gn('pfs',            'PFS',              '#1abc9c','pfs',               180, -80),
  gn('dhe',            'DHE',              '#3498db','dhe',               280, -80),
  gn('ecdhe',          'ECDHE',            '#3498db','ecdhe',             370, -70),

  /* Data Protection */
  gn('data-at-rest',   'Data at\nRest',    '#3498db','data-at-rest',     530,-255),
  gn('data-in-transit','Data in\nTransit', '#1abc9c','data-in-transit',  635,-270),
  gn('data-in-use',    'Data in\nUse',     '#e67e22','data-in-use',      720,-245),
  gn('obfuscation',    'Obfuscation',      '#9b59b6','obfuscation',      545,-175),
  gn('steganography',  'Stegano-\ngraphy', '#3498db','steganography',    650,-180),
  gn('tokenization',   'Tokenization',     '#2ecc71','tokenization',     730,-160),

  /* Digital Certificates */
  gn('x509',           'X.509\nCert',      '#3498db','x509',            -590, 200),
  gn('cert-cn',        'Distinguished\nName','#1abc9c','cert-cn',       -495, 185),
  gn('cert-serial',    'Serial\nNumber',   '#95a5a6','cert-serial',     -400, 205),
  gn('cert-validity',  'Validity\nPeriod', '#e67e22','cert-validity',   -590, 270),
  gn('cert-pubkey',    'Subject\nPubKey',  '#3498db','cert-pubkey',     -495, 290),
  gn('cert-ca-sig',    'CA\nSignature',    '#9b59b6','cert-ca-sig',     -400, 270),
  gn('cert-pem',       'PEM\nFormat',      '#2ecc71','cert-pem',        -565, 335),
  gn('cert-der',       'DER/CER\nFormat',  '#3498db','cert-der',        -470, 345),
  gn('cert-p7b',       'P7B\nPKCS#7',      '#e67e22','cert-p7b',        -380, 335),
  gn('cert-p12',       'P12/PFX',          '#e74c3c','cert-p12',        -525, 385),
  gn('openssl',        'OpenSSL',          '#95a5a6','openssl',         -430, 385),

  /* PKI Infrastructure */
  gn('root-ca',        'Root CA',          '#f1c40f','root-ca',           -85, 295),
  gn('intermediate-ca','Intermediate\nCA', '#1abc9c','intermediate-ca',    20, 285),
  gn('ca',             'Certificate\nAuth','#3498db','ca',                105, 305),
  gn('ra',             'Registration\nAuth','#95a5a6','ra',               -85, 370),
  gn('csr',            'CSR',              '#e67e22','csr',                20, 380),
  gn('cert-store',     'Cert\nStore',      '#2ecc71','cert-store',        110, 380),
  gn('root-of-trust',  'Root of\nTrust',   '#f1c40f','root-of-trust',    -65, 425),
  gn('cert-chain',     'Cert\nChain',      '#3498db','cert-chain',        60, 425),

  /* Cert Revocation */
  gn('crl',            'CRL',              '#e67e22','crl',               280, 280),
  gn('ocsp',           'OCSP',             '#3498db','ocsp',              375, 270),
  gn('ocsp-stapling',  'OCSP\nStapling',   '#1abc9c','ocsp-stapling',    450, 290),

  /* Advanced PKI */
  gn('cert-pinning',   'Cert\nPinning',    '#9b59b6','cert-pinning',     545, 260),
  gn('key-escrow',     'Key\nEscrow',      '#e74c3c','key-escrow',       645, 260),
  gn('kms',            'KMS',              '#2ecc71','kms',               730, 260),
  gn('hsm',            'HSM',              '#1abc9c','hsm',               585, 325),
  gn('entropy',        'Entropy',          '#95a5a6','entropy',           685, 330),

  /* Protocols & Encoding */
  gn('smime',          'S/MIME',           '#3498db','smime',              15, 470),
  gn('cms',            'CMS',              '#9b59b6','cms',               100, 460),
  gn('tls',            'TLS',              '#2ecc71','tls',               185, 460),
  gn('blockchain',     'Blockchain',       '#f1c40f','blockchain',        265, 480),
  gn('asn1',           'ASN.1',            '#95a5a6','asn1',               20, 535),
  gn('ber-enc',        'BER',              '#95a5a6','ber-enc',           110, 545),
  gn('der-enc',        'DER',              '#3498db','der-enc',           200, 535),
  gn('pem-enc',        'PEM',              '#2ecc71','pem-enc',           290, 545),
];

const GEDGES = [
  /* category membership */
  ge('cat-hashing','hash-function','member'), ge('cat-hashing','md5','member'),
  ge('cat-hashing','sha1','member'), ge('cat-hashing','sha256','member'),
  ge('cat-hashing','sha3','member'), ge('cat-hashing','hmac','member'),
  ge('cat-hashing','non-repudiation','member'), ge('cat-hashing','checksum','member'),
  ge('cat-hashing','hash-collision','member'),

  ge('cat-pwattacks','online-attack','member'), ge('cat-pwattacks','offline-attack','member'),
  ge('cat-pwattacks','dict-attack','member'), ge('cat-pwattacks','brute-force-pw','member'),
  ge('cat-pwattacks','spraying','member'), ge('cat-pwattacks','pass-hash','member'),
  ge('cat-pwattacks','birthday-attack','member'), ge('cat-pwattacks','rainbow-table','member'),

  ge('cat-pwdefense','salting','member'), ge('cat-pwdefense','key-stretching','member'),
  ge('cat-pwdefense','bcrypt','member'), ge('cat-pwdefense','pbkdf2','member'),
  ge('cat-pwdefense','argon2','member'),

  ge('cat-symmetric','symmetric-key','member'), ge('cat-symmetric','aes','member'),
  ge('cat-symmetric','triple-des','member'), ge('cat-symmetric','blowfish','member'),
  ge('cat-symmetric','twofish','member'), ge('cat-symmetric','block-cipher','member'),
  ge('cat-symmetric','stream-cipher','member'), ge('cat-symmetric','rc4','member'),
  ge('cat-symmetric','chacha20','member'),

  ge('cat-asymmetric','asymmetric-key','member'), ge('cat-asymmetric','rsa','member'),
  ge('cat-asymmetric','dsa','member'), ge('cat-asymmetric','ecc','member'),
  ge('cat-asymmetric','ecdsa','member'), ge('cat-asymmetric','hybrid-crypto','member'),

  ge('cat-pfs','key-exchange','member'), ge('cat-pfs','static-key','member'),
  ge('cat-pfs','ephemeral-key','member'), ge('cat-pfs','pfs','member'),
  ge('cat-pfs','dhe','member'), ge('cat-pfs','ecdhe','member'),

  ge('cat-dataprotect','data-at-rest','member'), ge('cat-dataprotect','data-in-transit','member'),
  ge('cat-dataprotect','data-in-use','member'), ge('cat-dataprotect','obfuscation','member'),
  ge('cat-dataprotect','steganography','member'), ge('cat-dataprotect','tokenization','member'),

  ge('cat-certs','x509','member'), ge('cat-certs','cert-cn','member'),
  ge('cat-certs','cert-serial','member'), ge('cat-certs','cert-validity','member'),
  ge('cat-certs','cert-pubkey','member'), ge('cat-certs','cert-ca-sig','member'),
  ge('cat-certs','cert-pem','member'), ge('cat-certs','cert-der','member'),
  ge('cat-certs','cert-p7b','member'), ge('cat-certs','cert-p12','member'),
  ge('cat-certs','openssl','member'),

  ge('cat-pki','root-ca','member'), ge('cat-pki','intermediate-ca','member'),
  ge('cat-pki','ca','member'), ge('cat-pki','ra','member'), ge('cat-pki','csr','member'),
  ge('cat-pki','cert-store','member'), ge('cat-pki','root-of-trust','member'),
  ge('cat-pki','cert-chain','member'),

  ge('cat-revocation','crl','member'), ge('cat-revocation','ocsp','member'),
  ge('cat-revocation','ocsp-stapling','member'),

  ge('cat-advpki','cert-pinning','member'), ge('cat-advpki','key-escrow','member'),
  ge('cat-advpki','kms','member'), ge('cat-advpki','hsm','member'),
  ge('cat-advpki','entropy','member'),

  ge('cat-protocols','smime','member'), ge('cat-protocols','cms','member'),
  ge('cat-protocols','tls','member'), ge('cat-protocols','blockchain','member'),
  ge('cat-protocols','asn1','member'), ge('cat-protocols','ber-enc','member'),
  ge('cat-protocols','der-enc','member'), ge('cat-protocols','pem-enc','member'),

  /* cross-links */
  ge('md5','hash-collision','causes'),
  ge('sha1','hash-collision','causes'),
  ge('hmac','hash-function','uses'),
  ge('birthday-attack','hash-collision','uses'),
  ge('rainbow-table','offline-attack','uses'),
  ge('spraying','online-attack','type-of'),
  ge('rainbow-table','salting','mitigates'),
  ge('brute-force-pw','key-stretching','mitigates'),
  ge('bcrypt','key-stretching','implements'),
  ge('pbkdf2','key-stretching','implements'),
  ge('argon2','key-stretching','implements'),
  ge('aes','block-cipher','type-of'),
  ge('triple-des','block-cipher','type-of'),
  ge('rc4','stream-cipher','type-of'),
  ge('chacha20','stream-cipher','type-of'),
  ge('hybrid-crypto','symmetric-key','uses'),
  ge('hybrid-crypto','asymmetric-key','uses'),
  ge('ecc','ecdsa','enables'),
  ge('ephemeral-key','pfs','enables'),
  ge('pfs','ecdhe','requires'),
  ge('pfs','dhe','requires'),
  ge('ecdhe','ecc','uses'),
  ge('tls','pfs','requires'),
  ge('tls','hybrid-crypto','uses'),
  ge('data-in-transit','tls','protects'),
  ge('blockchain','sha256','uses'),
  ge('smime','cms','uses'),
  ge('smime','non-repudiation','provides'),
  ge('asn1','ber-enc','encodes-with'),
  ge('asn1','der-enc','encodes-with'),
  ge('ber-enc','der-enc','subset'),
  ge('der-enc','pem-enc','encodes-with'),
  ge('x509','cert-der','encoded-as'),
  ge('root-ca','intermediate-ca','signs'),
  ge('root-ca','root-of-trust','is'),
  ge('intermediate-ca','cert-chain','part-of'),
  ge('ra','ca','delegates-to'),
  ge('crl','ocsp','relates'),
  ge('ocsp','ocsp-stapling','improves'),
  ge('hsm','kms','part-of'),
  ge('chacha20','tls','used-in'),
];

/* ═══ SIDEBAR BUILD ═══ */
let activeCat = null;
document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('cat-list');
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.dataset.catId = cat.id;
    btn.innerHTML = `<span class="cat-dot" style="background:${cat.color}"></span>${cat.label}`;
    btn.onclick = () => activeCat === cat.id ? clearFilter() : applyFilter(cat.id);
    list.appendChild(btn);
  });
});

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
  document.querySelectorAll('.node').forEach(n => n.classList.remove('cat-match','cat-dim'));
  document.querySelectorAll('.zone').forEach(z => z.classList.remove('zone-all-dim'));
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('filter-banner').style.display = 'none';
  document.getElementById('clear-btn').style.display = 'none';
}

/* ═══ DETAIL PANEL ═══ */
let selectedNode = null;
function openDetail(id) {
  const d = NODE_DATA[id]; if (!d) return;
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

/* ═══ GRAPH VIEW ═══ */
const G_REPEL=18000,G_SPRING=0.03,G_IDEAL=120,G_GRAVITY=0.003,G_DAMPING=0.80;
let gNodes=[],gNodeMap={},gGraphInited=false,gGraphActive=false;
let gDragNode=null,gDragOff={},gPanning=false,gPanStart={};
let gTx={x:0,y:0,k:1};

function gTick(){
  const ns=gNodes;
  for(let i=0;i<ns.length;i++){
    const a=ns[i];if(a.pinned)continue;
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
    const a=gNodeMap[e.s],b=gNodeMap[e.t];if(!a||!b)continue;
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
function runGraphLayout(steps){gNodes.forEach(n=>{n.pinned=false;n.vx=0;n.vy=0;});for(let i=0;i<steps;i++)gTick();gRender();}

const GESTYLE={
  member:{color:'#1e3a5f',w:1,dash:'3,7',mk:null},
  'type-of':{color:'#222c44',w:1,dash:'',mk:'ga-gray'},
  uses:{color:'#222c44',w:1.5,dash:'',mk:'ga-gray'},
  causes:{color:'#e74c3c',w:1.5,dash:'5,3',mk:'ga-red'},
  enables:{color:'#e67e22',w:1.5,dash:'',mk:'ga-gray'},
  mitigates:{color:'#2ecc71',w:1.5,dash:'',mk:'ga-green'},
  implements:{color:'#3498db',w:1,dash:'',mk:'ga-blue'},
  protects:{color:'#1abc9c',w:1.5,dash:'',mk:'ga-teal'},
  requires:{color:'#e67e22',w:1.5,dash:'',mk:'ga-gray'},
  'encoded-as':{color:'#3498db',w:1,dash:'4,4',mk:'ga-blue'},
  'encodes-with':{color:'#95a5a6',w:1,dash:'4,4',mk:'ga-gray'},
  subset:{color:'#9b59b6',w:1,dash:'4,4',mk:null},
  signs:{color:'#f1c40f',w:1.5,dash:'',mk:'ga-gray'},
  is:{color:'#f1c40f',w:1,dash:'4,4',mk:null},
  'part-of':{color:'#1abc9c',w:1,dash:'4,4',mk:'ga-teal'},
  'delegates-to':{color:'#95a5a6',w:1,dash:'',mk:'ga-gray'},
  improves:{color:'#1abc9c',w:1.5,dash:'',mk:'ga-teal'},
  provides:{color:'#2ecc71',w:1,dash:'',mk:'ga-green'},
  'used-in':{color:'#3498db',w:1,dash:'',mk:'ga-blue'},
  relates:{color:'#475569',w:1,dash:'4,4',mk:null},
};

function gRender(){
  const svgGe=document.getElementById('ge'),svgGn=document.getElementById('gn');
  svgGe.innerHTML='';svgGn.innerHTML='';
  function el(tag,attrs){
    const e=document.createElementNS('http://www.w3.org/2000/svg',tag);
    for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);return e;
  }
  for(const e of GEDGES){
    const a=gNodeMap[e.s],b=gNodeMap[e.t];if(!a||!b)continue;
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
    const g=el('g',{transform:`translate(${n.x.toFixed(1)},${n.y.toFixed(1)})`,cursor:'pointer','data-g-node-id':n.id});
    const circle=el('circle',{r:n.r,fill:n.color+'22',stroke:n.color,'stroke-width':isCat?'2.5':'1.5'});
    g.appendChild(circle);
    const lines=n.label.split('\n');
    const lh=11,sy=-(lines.length-1)*lh/2;
    lines.forEach((lbl,i)=>{
      const t=el('text',{'text-anchor':'middle','dominant-baseline':'middle',y:sy+i*lh,'font-size':n.r>28?'10':'9','font-family':'Segoe UI,system-ui,sans-serif','font-weight':'700',fill:n.color,'pointer-events':'none'});
      t.textContent=lbl;g.appendChild(t);
    });
    g.addEventListener('mouseenter',()=>{circle.setAttribute('fill',n.color+'44');circle.setAttribute('stroke-width','2.5');});
    g.addEventListener('mouseleave',()=>{if(gDragNode!==n){circle.setAttribute('fill',n.color+'22');circle.setAttribute('stroke-width',isCat?'2.5':'1.5');}});
    g.addEventListener('mousedown',ev=>{ev.stopPropagation();gDragNode=n;n.pinned=true;const pt=gSvgPt(ev);gDragOff={x:pt.x-n.x,y:pt.y-n.y};});
    g.addEventListener('click',ev=>{ev.stopPropagation();if(n.nodeId&&NODE_DATA[n.nodeId])openDetail(n.nodeId);});
    svgGn.appendChild(g);
  }
  gApplyTx();
  if(activeCat)applyGraphFilter(activeCat);
}
function gSvgPt(e){const r=document.getElementById('graph-svg').getBoundingClientRect();return{x:(e.clientX-r.left-gTx.x)/gTx.k,y:(e.clientY-r.top-gTx.y)/gTx.k};}
function gApplyTx(){document.getElementById('graph-root').setAttribute('transform',`translate(${gTx.x.toFixed(1)},${gTx.y.toFixed(1)}) scale(${gTx.k.toFixed(4)})`);}
function fitGraph(){
  if(!gNodes.length)return;
  const svg=document.getElementById('graph-svg');
  const{width:W,height:H}=svg.getBoundingClientRect();
  let mnx=1e9,mxx=-1e9,mny=1e9,mxy=-1e9;
  gNodes.forEach(n=>{mnx=Math.min(mnx,n.x-n.r);mxx=Math.max(mxx,n.x+n.r);mny=Math.min(mny,n.y-n.r);mxy=Math.max(mxy,n.y+n.r);});
  const pad=50,k=Math.min((W-pad*2)/(mxx-mnx),(H-pad*2)/(mxy-mny),1.8);
  gTx.k=k;gTx.x=W/2-(mnx+mxx)/2*k;gTx.y=H/2-(mny+mxy)/2*k;gApplyTx();
}
function gSetupInteraction(){
  const svg=document.getElementById('graph-svg');
  svg.addEventListener('wheel',e=>{
    e.preventDefault();
    const r=svg.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;
    const f=e.deltaY<0?1.12:0.89;
    gTx.x=mx-(mx-gTx.x)*f;gTx.y=my-(my-gTx.y)*f;
    gTx.k=Math.max(0.12,Math.min(4,gTx.k*f));gApplyTx();
  },{passive:false});
  svg.addEventListener('mousedown',e=>{
    const tgt=e.target;
    if(tgt===svg||tgt.id==='graph-root'||tgt.id==='ge'||tgt.id==='gn'){gPanning=true;gPanStart={x:e.clientX-gTx.x,y:e.clientY-gTx.y};}
  });
  window.addEventListener('mousemove',e=>{
    if(gDragNode){const pt=gSvgPt(e);gDragNode.x=pt.x-gDragOff.x;gDragNode.y=pt.y-gDragOff.y;gRender();}
    else if(gPanning){gTx.x=e.clientX-gPanStart.x;gTx.y=e.clientY-gPanStart.y;gApplyTx();}
  });
  window.addEventListener('mouseup',()=>{gDragNode=null;gPanning=false;});
}
function applyGraphFilter(catId){
  const cat=CATEGORIES.find(c=>c.id===catId);if(!cat)return;
  const matchSet=new Set(cat.nodes);
  document.querySelectorAll('#gn > g[data-g-node-id]').forEach(g=>{
    const nid=g.dataset.gNodeId,isCat=nid.startsWith('cat-');
    const nodeId=GNODES.find(n=>n.id===nid)?.nodeId;
    const vis=isCat||(nodeId&&matchSet.has(nodeId));
    g.style.opacity=vis?'1':'0.05';g.style.pointerEvents=vis?'auto':'none';
  });
  document.querySelectorAll('#ge > line[data-gs][data-gt]').forEach(line=>{
    const sNode=GNODES.find(n=>n.id===line.dataset.gs),tNode=GNODES.find(n=>n.id===line.dataset.gt);
    const sVis=!sNode||sNode.id.startsWith('cat-')||(sNode.nodeId&&matchSet.has(sNode.nodeId));
    const tVis=!tNode||tNode.id.startsWith('cat-')||(tNode.nodeId&&matchSet.has(tNode.nodeId));
    line.style.opacity=(sVis&&tVis)?'0.6':'0.04';
  });
}
function clearGraphFilter(){
  document.querySelectorAll('#gn > g[data-g-node-id]').forEach(g=>{g.style.opacity='';g.style.pointerEvents='';});
  document.querySelectorAll('#ge > line').forEach(l=>l.style.opacity='');
}
function toggleGraphView(){
  gGraphActive=!gGraphActive;
  const btn=document.getElementById('btn-graph');
  const gview=document.getElementById('graph-view');
  const canvas=document.getElementById('canvas');
  if(gGraphActive){
    btn.style.cssText='border-color:var(--teal);color:var(--teal);background:rgba(26,188,156,.1)';
    gview.classList.add('visible');canvas.style.display='none';
    if(!gGraphInited){
      gNodes=GNODES.map(n=>({...n}));gNodeMap={};gNodes.forEach(n=>gNodeMap[n.id]=n);
      const deg={};gNodes.forEach(n=>deg[n.id]=0);
      GEDGES.forEach(e=>{if(deg[e.s]!==undefined)deg[e.s]++;if(deg[e.t]!==undefined)deg[e.t]++;});
      gNodes.forEach(n=>{const isCat=n.id.startsWith('cat-');n.r=isCat?36:Math.max(18,Math.min(34,18+((deg[n.id]||0)*1.6)));});
      runGraphLayout(300);gSetupInteraction();gGraphInited=true;
    }
    setTimeout(fitGraph,60);if(activeCat)applyGraphFilter(activeCat);
  }else{
    btn.style.cssText='';gview.classList.remove('visible');canvas.style.display='';
  }
}
const _origApply=applyFilter;
applyFilter=function(catId){_origApply(catId);if(gGraphActive&&gGraphInited)applyGraphFilter(catId);};
const _origClear=clearFilter;
clearFilter=function(){_origClear();if(gGraphActive&&gGraphInited)clearGraphFilter();};

let studyMode=false;
function toggleStudyMode(){
  studyMode=!studyMode;
  const btn=document.getElementById('btn-study');
  if(studyMode){
    document.querySelectorAll('.node-label,.node-sub').forEach(el=>el.style.opacity='0');
    btn.style.cssText='border-color:var(--teal);color:var(--teal);background:rgba(26,188,156,.1)';
    btn.textContent='👁 Labels Hidden';
  }else{
    document.querySelectorAll('.node-label,.node-sub').forEach(el=>el.style.opacity='');
    btn.style.cssText='';btn.textContent='👁 Study Mode';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var b = document.getElementById('btn-graph');
  if (!b) return;
  function upd() {
    var cv = document.getElementById('canvas'), gv = document.getElementById('graph-view');
    var active = (cv && cv.style.display === 'none') || (gv && gv.classList.contains('visible'));
    b.textContent = active ? '🫧 Bubble View' : '🗺 Graph View';
  }
  if (!gGraphActive) { toggleGraphView(); }
  b.addEventListener('click', function () { setTimeout(upd, 0); });
  upd();
});
