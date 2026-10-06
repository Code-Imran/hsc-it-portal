# Maharashtra HSC IT Online Exam Portal & Simulator (2027)

> **Document Purpose:** Complete single-source architectural specification, database schema, syllabus mapping, UI/UX interaction blueprint, anti-scraping logic, and exam engine rules for the Maharashtra State Board HSC Information Technology Computerized Exam Portal & Simulator.

---

## 1. Exam Blueprint & Board Specification

* **Governing Body:** Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE), Pune.
* **Class:** Standard XII (HSC).
* **Subject Codes:**
  * **Science Stream:** Subject Code 97
  * **Commerce Stream:** Subject Code 99
  * **Arts Stream:** Subject Code 98 (shares theoretical modules with Science/Commerce)
* **Exam Timing:** 2 Hours 30 Minutes (150 minutes, countdown clock `02:30:00`).
* **Total Marks:** **80 Marks** Online Computerized Exam + **20 Marks** College Practical Exam = **100 Marks Total**.

### 80-Mark Computerized Paper Pattern (Q1 to Q8)
* **Section A (Objective — Auto-Graded by Exam Engine, 50 Marks):**
  * `Q. 1` — Fill in the Blanks (10 Questions × 1 Mark = 10M)
  * `Q. 2` — State True or False (10 Questions × 1 Mark = 10M)
  * `Q. 3` — Multiple Choice (Single Correct) (10 Questions × 1 Mark = 10M)
  * `Q. 4` — Multiple Choice (Two Correct) (5 Questions × 2 Marks = 10M)
  * `Q. 5` — Multiple Choice (Three Correct) (2 Questions × 3 Marks = 6M)
  * `Q. 6` — Match the Following (4 Pairs × 1 Mark = 4M)
* **Section B (Subjective & Practical Programming — 30 Marks):**
  * `Q. 7` — Answer in Brief / Short Notes (Attempt 5 out of 8 Questions × 2 Marks = 10M)
  * `Q. 8` — Programming / Practical Slips (Attempt 2 out of 4 Slips × 10 Marks = 20M)

---

## 2. Practical Examination Blueprint 2027 (20 Marks Total)

Internal lab examination conducted at Junior College centers across Maharashtra:

| Component | Marks | Evaluation Criteria |
| :--- | :---: | :--- |
| **Handwritten Steps & Code** | 5 Marks | Written on the official board practical answer sheet during the lab exam session. |
| **Computer Typing & Syntax** | 5 Marks | Accurate error-free entry of code/queries into the system text editor or RDBMS engine. |
| **Execution & Output Verification** | 3 Marks | Successfully rendering output in browser/terminal and verified by internal/external examiners. |
| **Printout Submission** | 2 Marks | Output hardcopy with Candidate Board Seat Number embedded in the header/body. |
| **Certified Journal / Handbook** | 5 Marks | Fully completed, hand-signed journal book with certified teacher/principal stamps. |
| **Total Practical Score** | **20 Marks** | Internal evaluation uploaded to MSBSHSE board portal. |

---

## 3. Syllabus Mapping & Cross-Stream Logic

| Module Name | Science Stream (Code 97) | Commerce Stream (Code 99) | Shared Strategy in System |
| :--- | :--- | :--- | :--- |
| **Advanced Web Designing** | Chapter 1 | Chapter 1 | **Shared Module:** HTML5 forms, CSS3 Flexbox, Audio/Video, client-side `<map>` and `<area>`. |
| **Digital Marketing & SEO** | Chapter 2 | Chapter 2 | **Shared Module:** On-Page, Off-Page, White/Black Hat, PageRank, meta crawler tags. |
| **Advanced JavaScript** | Chapter 3 | Chapter 3 | **Shared Module:** Client form validation (`onsubmit`, `onblur`), String & Math objects. |
| **Emerging Technologies** | Chapter 4 | Chapter 4 | **Shared Module:** Cloud models (IaaS, PaaS, SaaS), IoT elements, AI, 5G wireless. |
| **Server-Side Scripting (PHP)** | Chapter 5 | — | **Science Exclusive:** Variables, superglobals (`$_POST`, `$_GET`), arrays, custom functions. |
| **Database Concepts (RDBMS)** | — | Chapter 5 | **Commerce Exclusive:** Relational tables, Keys (Primary/Foreign), SQL DDL/DML, LibreOffice Base. |
| **E-Commerce & E-Governance** | Chapter 6 | Chapter 6 | **Shared Module:** B2B/B2C/C2C models, EDI transactions, SSL/SET security, G2C models. |

---

## 4. Complete Directory Hierarchy

```text
your-project-root/
├── ARCHITECTURE.md                               # System documentation (This file)
├── package.json
├── astro.config.mjs
└── src/
    ├── styles/
    │   └── global.css                            # Global Tailwind directives & dark mode rules
    ├── layouts/
    │   └── PortalLayout.astro                    # Shell: SEO, nav menu, and vertical stream switcher
    ├── data/
    │   ├── types.ts                              # TypeScript interfaces for short notes and exam models
    │   └── notes/                                # Scalable JSON datasets for Q7 Answer in Brief
    │       ├── ch1-web-designing-notes.json
    │       ├── ch2-seo-notes.json
    │       ├── ch3-javascript-notes.json
    │       ├── ch4-emerging-tech-notes.json
    │       ├── ch5-php-notes.json                # Science Exclusive (Code 97)
    │       ├── ch5-rdbms-notes.json              # Commerce Exclusive (Code 99)
    │       └── ch6-ecommerce-notes.json
    └── pages/
        ├── index.astro                           # Homepage & syllabus curriculum overview
        ├── simulator.astro                       # 80-Mark full mock exam simulator engine
        ├── practicals/
        │   └── index.astro                       # 20-Mark SOP Solutions Hub + 2027 Practical Blueprint
        ├── mcqs/
        │   ├── index.astro                       # Main MCQs navigation directory
        │   ├── web-designing.astro               # Chapter 1 MCQs
        │   ├── digital-marketing-seo.astro       # Chapter 2 MCQs
        │   ├── advanced-javascript.astro         # Chapter 3 MCQs
        │   ├── emerging-technologies.astro       # Chapter 4 MCQs
        │   ├── server-side-scripting-php.astro   # Chapter 5 Science MCQs (Code 97)
        │   ├── database-concepts-rdbms.astro     # Chapter 5 Commerce MCQs (Code 99)
        │   └── ecommerce-egovernance.astro       # Chapter 6 MCQs
        └── notes/
            ├── index.astro                       # Main Q7 Short Notes directory
            ├── web-designing.astro               # Chapter 1 Short Notes
            ├── digital-marketing-seo.astro       # Chapter 2 Short Notes
            ├── advanced-javascript.astro         # Chapter 3 Short Notes
            ├── emerging-technologies.astro       # Chapter 4 Short Notes
            ├── server-side-scripting-php.astro   # Chapter 5 Science Short Notes (Code 97)
            ├── database-concepts-rdbms.astro     # Chapter 5 Commerce Short Notes (Code 99)
            └── ecommerce-egovernance.astro       # Chapter 6 Short Notes

---

## 5. Project Handoff & Development Notes

Use this section as a concise starting point for future maintenance; confirm current files and git status before editing because this is a shared checkout with user-owned staged and unstaged work.

### Stack and local workflow

- Astro 7 with Tailwind CSS v4; deploy target is the Cloudflare Worker at `https://it-portal.imranshaikh.workers.dev`.
- `npm run dev` starts the local server (normally `http://localhost:4321`). The dev server intentionally uses static output without the Cloudflare adapter to avoid the Windows/Miniflare issue; API routes that need runtime behavior must set `export const prerender = false`.
- `npm run build` runs the Cloudflare server build. Check the build output and smoke-test relevant routes after changing shared layout or APIs.
- Local OAuth settings belong in ignored `.env.local` (see `.env.example`); production values belong in Wrangler secrets. Never put client secrets in source, frontend variables, chat, or committed files.

### Authentication

- `src/components/PortalAuthModal.astro` and `src/pages/api/auth/*` implement portal identity separately from the simulator's seat-number login.
- Google sign-in uses OAuth authorization code + PKCE, one-time state in the server session, verified Google userinfo, and does not persist access tokens or ask for Google passwords. Production Astro sessions use Cloudflare KV; local dev uses an in-memory session driver.
- “Continue without Google” creates a session-only, unverified student profile. It is not password authentication and must not grant protected access by itself.
- Required server variables: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. For the Google OAuth Web client, register `http://localhost:4321/api/auth/google/callback` and each production origin used to start sign-in, such as `https://it-portal.imranshaikh.workers.dev/api/auth/google/callback`. Add `https://<your-custom-domain>/api/auth/google/callback` too if sign-in starts on the custom domain; the `workers.dev` callback remains valid when that host continues to be used. Set production values as Cloudflare Worker secrets with `npx wrangler secret put GOOGLE_CLIENT_ID --name it-portal` and `npx wrangler secret put GOOGLE_CLIENT_SECRET --name it-portal`.

### Navigation and current URL map

- `src/components/PortalNavigation.astro` is the reusable responsive header; `src/layouts/PortalLayout.astro` supplies page content and the legacy desktop Science/Commerce stream switcher.
- Current header design: brand + “Hi Username” profile action, desktop online-time display, then a horizontal link row: Home (desktop only), All MCQs, Short Notes, Q8 Coding, Paper Pattern (desktop only), Practicals, Exam Demo. The username is populated from `/api/auth/profile`; the elapsed-time display is tab-session-only.
- Current links: `/mcqs`, `/notes`, `/q8-vault`, `/#pattern`, `/practicals`, `/simulator`. `/practice` redirects to `/mcqs`; `/mock-exam` redirects to `/simulator`.
- `/downloads` is a download hub. The verified Std 12 textbook PDF URL is `https://ebooks.ebalbharati.in/pdfs/1203010499.pdf`; use the official catalog `https://ebooks.ebalbharati.in/` for other streams/standards instead of guessing direct PDF URLs. External links open with `target="_blank"` and `rel="noopener noreferrer"`.
- The shared layout historically had a mobile bottom dock, a promotional overlay, and hamburger navigation; those were removed when the header was simplified. Check with the user before restoring any of those elements if the desired design is unclear.

### Exam simulator

- `src/pages/simulator.astro` uses the bank assembler in `src/data/questions/index.js`; do not substitute `src/data/questions.json`, which is a separate placeholder bank.
- The paper must be reproducible from the same `sessionId` at both `POST /api/exam/start` and `POST /api/exam/submit`, so server-side grading matches the displayed paper. The GET/start response must not disclose answer keys; numeric MCQ answer indexes and T/F values are normalized before paper option shuffling.
- Keep the session-aware browser recovery flow and student identity/auth system distinct. Browser storage anti-tamper protections are practice-only, not secure proctoring.

### Recent practice features (October 2026)

- The objective mock-exam paper is randomized from a session ID and remains reproducible for grading. Its pattern is 10 fill-in-the-blanks, 10 true/false, 10 single-correct MCQs, 5 two-correct MCQs, 2 three-correct MCQs, and one four-pair match group.
- The seven chapter MCQ quizzes shuffle question order on page load. Quiz and objective mock-exam results count only answered questions/marks, show a personalized score message, and provide a share/copy-link action.
- A completed assessment increments a per-assessment counter in browser `localStorage`; later attempts hide guest registration and require Google sign-in. This is a UX-only restriction, not tamper-proof: clearing browser storage or switching devices resets it.
- Targeted verification was run for Science and Commerce paper patterns/randomization and empty, 1-mark, and 2-mark grading; all changed inline scripts were syntax-checked. These changes were not built or deployed in that work session.

### Deferred task: bare-bones student sign-in log (no email, IP, or location)

When asked to implement this later, keep it simple and do not add an admin dashboard or email notifications:

1. Create a Cloudflare D1 database and bind it to the `it-portal` Worker (for example, binding name `STUDENT_DB`); add a SQL migration for a minimal student sign-in table.
2. On successful Google OAuth callback, record the verified Google subject, name, email, and timestamp. On guest registration, record the submitted name, college/school, city, optional email, and timestamp; clearly treat these as user-entered, unverified details. Decide an idempotent policy for repeat sign-ins (prefer one record per identity with a last-seen timestamp, not a new row on every visit).
3. Do not collect or store request IP addresses, precise or approximate location, or OAuth tokens. Never expose student rows through a public API or frontend route.
4. The owner can browse/query/export records through Cloudflare's D1 dashboard/console. No historical data can be backfilled: existing profiles are session-only and are not currently retained in a central database.
5. Update the privacy notice/profile copy to disclose what fields are stored, why, and for how long. Verify locally with a D1 test binding/migration and a production configuration check before deploying. Keep D1 credentials/bindings in Cloudflare configuration; do not commit secrets.

Cloudflare D1 offers a Free plan; confirm current quotas and account limits during setup. A bare-bones implementation was previously estimated at roughly 1–2 hours once Cloudflare access is ready. Creating the database/binding and deploying are external setup steps; ask the owner to perform or authorize them as needed.

### Safe editing in this checkout

- The configured workspace is the existing `E:\Videos\web\IT PORTAL` checkout on `main`. There may be unrelated staged/unstaged source, content, and Wrangler local-state changes.
- Inspect `git status --short` and targeted diffs before editing. Preserve existing user changes; do not reset, broadly stage, commit, push, or deploy unless the user explicitly asks. Stage/commit only the intended paths when specifically requested.
