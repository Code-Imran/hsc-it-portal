# IT PORTAL — System Architecture & Implementation Roadmap

## 1. Project Overview & Target
- **Product:** Online learning, question bank, and 80-mark mock exam simulator for Maharashtra State Board Class 12 Science (Information Technology).
- **Core Value:** Exact board pattern replication, verified solutions, past board exam year tags, anti-scraping security, instant UPI/GPay monetization.
- **Keyword / Context Key:** `IT PORTAL`

---

## 2. Technology Stack & Infrastructure
- **Framework:** Astro (SSR Mode with `@astrojs/cloudflare` adapter).
- **Hosting / Deployment:** GitHub Repo -> Cloudflare Pages / Workers (Auto CI/CD).
- **Database / Storage:**
  - **Cloudflare D1 (Serverless SQLite):** User profiles, subscription status, test attempts, question bank records.
  - **Cloudflare KV:** Active mock exam session states, timers, and transient auth tokens.
- **Edge Security:** Cloudflare WAF, Rate Limiting, Bot Fight Mode.
- **Payments:** Razorpay / Cashfree UPI Intent (GPay, PhonePe, Paytm) validated via HMAC-SHA256 serverless webhooks.
- **UI Architecture:** Astro Islands (`client:load` / `client:idle`) using Preact/React/Vanilla JS for the exam runner and palette.

---

## 3. Strict Security & Anti-Scraping Contract
1. **Never Expose Answers to Client:**
   - Raw JSON containing answers, explanations, and marking keys MUST NEVER be sent to the browser.
   - Endpoint `/api/exam/start` strips all `server_only` properties before delivering question payloads.
   - Endpoint `/api/exam/submit` receives only `{ questionId, selectedIndices }` and grades strictly on Cloudflare Workers.
2. **UI Defenses:**
   - Disable text selection (`user-select: none`).
   - Intercept copy (`Ctrl+C`), inspect (`Ctrl+U`, `F12`), and context menu during exam sessions.
   - Render student ID / phone watermark across the exam canvas.
3. **Session Integrity:**
   - Server-enforced 150-minute countdown recorded in Cloudflare KV / D1 to prevent local client clock tampering.
   - Local state synced to `localStorage` / `IndexedDB` to survive accidental page refreshes.

---

## 4. Question Bank Schema Specification
Every question across all 6 chapters strictly adheres to this standard:

```json
{
  "id": "IT-C01-MCQ1-001",
  "chapter_id": 1,
  "exam_section": "Q3",
  "type": "MCQ_correct1",
  "marks": 1,
  "difficulty": "medium",
  "question": "______ element used to create a linking image.",
  "options": ["<img>", "<td>", "<map>", "<usemap>"],
  "server_only": {
    "answer": 2,
    "explanation": "The <map> tag defines a client-side image map.",
    "source_reference": "Balbharati Ex Q3.1, Page 24",
    "board_exam_appeared": true,
    "board_exam_years": ["March 2022"]
  }
}