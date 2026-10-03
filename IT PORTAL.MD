# Maharashtra HSC IT Online Exam Portal & Simulator (2027)

> **Document Purpose:** Complete single-source architectural specification, database schema, syllabus mapping, UI/UX interaction blueprint, and exam engine logic for the Maharashtra State Board HSC Information Technology 80-Mark Computerized Mock Exam Portal (`EXAMINFO.HSC.AC.IN SIMULATOR`).

---

## 1. Exam Blueprint & Board Specification

* **Governing Body:** Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE), Pune.
* **Class:** Standard XII (HSC).
* **Subject Codes:**
  * **Science Stream:** Code 97
  * **Commerce Stream:** Code 99
  * **Arts Stream:** Code 98 (shares common theoretical modules)
* **Exam Timing:** 2 Hours 30 Minutes (150 minutes, countdown clock `02:30:00`).
* **Total Marks:** **80 Marks** Online Computerized Exam (+ 20 Marks Practical = 100 Marks Total).

### 80-Mark Paper Pattern Breakdown
* **Section A (Objective — Auto-Graded by Exam Engine, 50 Marks):**
  * `Q. 1` — Fill in the Blanks (10 Questions × 1 Mark = 10M)
  * `Q. 2` — State True or False (10 Questions × 1 Mark = 10M)
  * `Q. 3` — Multiple Choice (Single Correct) (10 Questions × 1 Mark = 10M)
  * `Q. 4` — Multiple Choice (Two Correct) (5 Questions × 2 Marks = 10M)
  * `Q. 5` — Multiple Choice (Three Correct) (2 Questions × 3 Marks = 6M)
  * `Q. 6` — Match the Following (4 Pairs × 1 Mark = 4M)
* **Section B (Subjective & Practical Slips — 30 Marks):**
  * `Q. 7` — Answer in Brief (Attempt 5 out of 8 Questions × 2 Marks = 10M)
  * `Q. 8` — Programming / Practical Slips (Attempt 2 out of 4 Slips × 10 Marks = 20M)

---

## 2. Syllabus Mapping & Cross-Stream Shared Logic

The state board curriculum shares fundamental modules across streams while reserving domain-specific applications:

| Subject Topic | Science (Code 97) | Commerce (Code 99) | Shared Strategy in System |
| :--- | :--- | :--- | :--- |
| **Advanced Web Designing** | Chapter 1 | Chapter 1 | **Shared File:** `tps-ch1-web-designing.json` serves both streams. |
| **Search Engine Optimization (SEO)** | Chapter 2 | Integrated in Ch 2 | `tps-ch2-seo.json` (Science) |
| **Digital Marketing** | — | Chapter 2 | `tps-comm-ch2-digital-marketing.json` (Commerce) |
| **Advanced JavaScript** | Chapter 3 | — | Science exclusive (DOM, Events, Form validation) |
| **Computerized Accounting with GST** | — | Chapter 3 | `tps-comm-ch3-accounting-gst.json` (Vouchers F4-F9, GST ledgers) |
| **Emerging Technologies** | Chapter 4 | — | `tps-ch4-emerging-tech.json` (IoT, Cloud, AI, 5G) |
| **Server-Side Scripting (PHP)** | Chapter 5 | — | `tps-ch5-php.json` (PHP syntax, forms, sessions, PDO) |
| **Database Concepts (LibreOffice Base)**| — | Chapter 5 | `tps-comm-ch5-libreoffice-base.json` (RDBMS, SQL, Base objects) |
| **E-Commerce and E-Governance** | Chapter 6 | Chapter 4 | **Shared File:** `tps-ch6-ecommerce.json` serves both streams. |

---

## 3. Directory Structure & File Hierarchy

```text
your-project-root/
├── IT_PORTAL.md                                     # System documentation (This file)
├── package.json
├── astro.config.mjs
└── src/
    ├── layouts/
    │   └── PortalLayout.astro                       # Main theme wrapper and responsive canvas
    ├── pages/
    │   └── simulator.astro                          # Exam Client Interface (Authentic Board UI)
    └── data/
        └── questions/
            ├── tps-ch1-web-designing.json          # Shared Ch 1
            ├── tps-ch2-seo.json                     # Science Ch 2
            ├── tps-ch4-emerging-tech.json           # Science Ch 4
            ├── tps-ch5-php.json                     # Science Ch 5
            ├── tps-ch6-ecommerce.json               # Shared Ch 6 (Science) / Ch 4 (Commerce)
            ├── tps-comm-ch2-digital-marketing.json  # Commerce Ch 2
            ├── tps-comm-ch3-accounting-gst.json     # Commerce Ch 3
            ├── tps-comm-ch5-libreoffice-base.json   # Commerce Ch 5
            └── index.js                             # Dynamic Exam Aggregator / Assembler