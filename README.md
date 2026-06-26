# CompTIA Security+ SY0-701 Study Guide

An interactive, browser-based study guide built to help pass the CompTIA Security+ (SY0-701) exam. Covers all five weighted domains across 11 chapters with force-directed interactive diagrams, a 500-question practice quiz, glossary, and a local AI assistant.

**Live site:** [securityplus-studyguide.vercel.app](https://securityplus-studyguide.vercel.app)

---

## Chapters

| # | Title | Topics |
|---|-------|--------|
| 1–2 | Fundamentals & IAM | CIA triad, authentication, MFA, access control models |
| 3 | Network Security | Protocols, firewalls, VPNs, network segmentation |
| 4–5 | Network Defense & Host Security | IDS/IPS, hardening, patch management, endpoint protection |
| 6 | Threats & Vulnerabilities | Malware types, social engineering, vulnerability scanning |
| 7 | Advanced Attacks | DoS, on-path, DNS attacks, injection, secure coding |
| 8 | Risk Management | Risk frameworks, supply chain, pen testing, audits |
| 9 | Security Controls | Physical security, asset management, HA, backups, BCP/DR |
| 10 | Cryptography & PKI | Hashing, symmetric/asymmetric encryption, certs, PKI |
| 11 | Policies & Governance | Data classification, incident response, forensics, SOAR, legal agreements |

---

## Features

- **Interactive diagrams** — force-directed graph view (default) and bubble canvas view for every chapter; filter by topic category
- **500-question practice quiz** — covers all five SY0-701 domains (D1 General 14%, D2 Threats 20%, D3 Architecture 26%, D4 Operations 23%, D5 GRC 15%)
- **Performance-Based Questions (PBQ)** — drag-and-drop and scenario-style questions
- **Glossary** — searchable definitions for every key term across all 11 chapters
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
├── practice.html               # 500-question practice quiz
├── glossary.html               # Full glossary
├── diagrams/                   # Interactive chapter diagrams (Ch 1–11)
├── styles.css                  # Site-wide styles
├── guide.js                    # Sidebar / study mode behavior
├── quiz.js                     # Practice quiz engine
├── questions.js                # Generated question bank (500 questions)
├── build-questions.js          # Question bank generator (run with node)
├── glossary.js                 # Glossary data
├── assistant.js                # AI assistant routing & page context
├── glossary-page.js            # Glossary page rendering
├── pbq.js                      # PBQ engine
└── lib/web-llm.js              # Local LLM runtime
```
