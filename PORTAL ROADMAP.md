# IT PORTAL — System Architecture & Implementation Roadmap

## 1. Project Overview & Target
- **Product:** Online study portal, verified question bank, and 80-mark mock exam simulator for Maharashtra State Board Class 12 Science (Information Technology).
- **Core Value:** Exact board pattern replication, verified solutions, past board exam year tags, anti-scraping security, instant UPI/GPay monetization.
- **Keyword / Context Key:** `IT PORTAL`

---

## 2. Technology Stack & Infrastructure
- **Framework:** Astro (SSR Mode with `@astrojs/cloudflare` adapter).
- **Hosting / Deployment:** GitHub Repo -> Cloudflare Pages / Workers (Auto CI/CD).
- **Storage & State:**
  - **Cloudflare D1 (Serverless SQLite):** User access records, payment logs, institutional licenses.
  - **Cloudflare KV:** Active mock exam timers, device fingerprints, network IP concurrency pools.
- **Edge Security:** Cloudflare WAF, Rate Limiting, Bot Fight Mode.
- **Payments:** Razorpay / Cashfree UPI Intent (GPay, PhonePe, Paytm) via HMAC-SHA256 serverless webhooks.
- **UI Architecture:** Astro Islands (`client:load`) using lightweight vanilla JS / Preact for the exam runner and palette.

---

## 3. Strict Network & Anti-Abuse Policies
1. **Lab Concurrency Hard-Block (Strict NAT Policy):**
   - Track concurrent active devices per public IP using `cf-connecting-ip` + device fingerprint in Cloudflare KV (10-minute sliding window).
   - **Limit:** Maximum **3 concurrent devices** per network IP on standard passes.
   - **Exceeded Action:** Once a 4th device connects from the same IP, all traffic from that IP is instantly blocked with a `403 Lab Lockout Screen` requiring an Institutional License.
2. **Anti-Scraping / Zero-Client-Exposure:**
   - Raw JSON containing answers, marking keys, and explanations MUST NEVER be sent to the browser during exams.
   - Endpoint `/api/exam/start` strips all `server_only` properties before delivering question payloads.
   - Endpoint `/api/exam/submit` receives only `{ questionId, selectedIndices }` and grades strictly on Cloudflare Workers.
3. **Client UI Defenses:**
   - Text selection disabled (`user-select: none`).
   - Copy (`Ctrl+C`), inspect (`Ctrl+U`, `F12`), and context menu disabled during test sessions.
   - Watermark student phone/identifier across the mock test background.

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