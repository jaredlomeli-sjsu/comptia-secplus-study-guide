# CompTIA Security+ SY0-701 Study Guide

An interactive, browser-based study guide built to help pass the CompTIA Security+ (SY0-701) exam — **passed July 2026**. Covers all five weighted domains across 11 chapters with force-directed interactive diagrams, an 800-question practice quiz, a simulated Linux Lab, glossary, and a local AI assistant.

**Live site:** [securityplus-studyguide.vercel.app](https://securityplus-studyguide.vercel.app)

---

## Chapters

| #   | Title                           | Topics                                                                    |
| --- | ------------------------------- | ------------------------------------------------------------------------- |
| 1–2 | Fundamentals & IAM              | CIA triad, authentication, MFA, access control models                     |
| 3   | Network Security                | Protocols, firewalls, VPNs, network segmentation                          |
| 4–5 | Network Defense & Host Security | IDS/IPS, hardening, patch management, endpoint protection                 |
| 6   | Threats & Vulnerabilities       | Malware types, social engineering, vulnerability scanning                 |
| 7   | Advanced Attacks                | DoS, on-path, DNS attacks, injection, secure coding                       |
| 8   | Risk Management                 | Risk frameworks, supply chain, pen testing, audits                        |
| 9   | Security Controls               | Physical security, asset management, HA, backups, BCP/DR                  |
| 10  | Cryptography & PKI              | Hashing, symmetric/asymmetric encryption, certs, PKI                      |
| 11  | Policies & Governance           | Data classification, incident response, forensics, SOAR, legal agreements |

---

## Features

- **Interactive diagrams** — force-directed graph view (default) and bubble canvas view for every chapter; filter by topic category
- **800-question practice quiz** — covers all five SY0-701 domains (D1 General 14%, D2 Threats 20%, D3 Architecture 26%, D4 Operations 23%, D5 GRC 15%)
- **Performance-Based Questions (PBQ)** — 38 drag-and-drop matching labs + 12 advanced multi-question scenario labs (48 questions) covering architecture, risk, compliance, and operations
- **Linux Lab** — simulated shell environment with 8 guided lessons and 5 Security+ challenges (virtual filesystem, real command parsing)
- **Cram sheet** — final-night review page weighted to the exam domains
- **Glossary** — 1,090 searchable term definitions across all 11 chapters
- **AI study assistant** — powered by WebLLM, runs entirely in the browser with no data sent to any server
- **Sticky horizontal nav** — scroll to access all chapters from any page

---

## Tech Stack

Vanilla HTML · CSS · JavaScript — no build framework, no dependencies. Deployed on [Vercel](https://vercel.com).

---

## Project Structure

```
Webpage/
├── index.html                  # Home / chapter hub
├── chapters1-2.html            # Ch 1–2 study notes
├── chapter3.html               # Ch 3 study notes
├── chapters4-5.html            # Ch 4–5 study notes
├── chapter6.html               # Ch 6 study notes
├── chapter7.html               # Ch 7 study notes
├── chapter8.html               # Ch 8 study notes
├── chapter9.html               # Ch 9 study notes
├── chapter10.html              # Ch 10 study notes
├── chapter11.html              # Ch 11 study notes
├── practice.html               # 800-question practice quiz
├── linux.html                  # Linux Lab: simulated shell
├── cram.html                   # Final-night cram sheet
├── glossary.html               # Full glossary
├── diagrams/                   # Interactive chapter diagrams (Ch 1–11)
├── styles.css                  # Site-wide styles
├── guide.js                    # Sidebar / study mode behavior
├── quiz.js                     # Practice quiz engine (quiz, flashcard, PBQ modes)
├── questions-v2.js             # 800-question practice bank (all five SY0-701 domains)
├── pbq.js                      # 38 drag-and-drop PBQ labs (row-matching schema)
├── pbq2.js                     # 12 advanced scenario PBQ labs (48 questions, new schema)
├── linux-sim.js                # Linux Lab shell engine (virtual FS, command dispatch)
├── linux-lessons.js            # 8 lessons + 5 SEC+ challenges for the Linux Lab
├── glossary.js                 # Glossary data (1,090 terms)
├── assistant.js                # AI assistant routing & page context
├── glossary-page.js            # Glossary page rendering
└── lib/web-llm.js              # Local LLM runtime (WebLLM, runs fully in-browser)
```
