# Blueprint: HSC IT Portal — Subscription Model & Question Paper Bank

## 1. Overview & Objectives
* **Feature Name:** HSC IT Question Paper Bank & "Most Likely Bundle" Access Pass.
* **Pricing:** Rs. 300 flat fee, valid until the end of the board exams (tentatively March 20).
* **Core Offerings Included in Subscription:**
  * Unlimited Question Paper Set Generation.
  * Unlimited 80-mark Mock Exam Simulator Access.
  * Complete Ebooks & Resource Materials.
  * **"Most Likely Bundle":** Curated high-yield MCQs, model short notes, practical handbooks, and teacher question slips with model source code.

---

## 2. Page Structure & User Flow

### A. Global Navigation & CTA Banner
* **Navbar Addition:** A prominent link pointing to `/paper-bank` labeled **"Question Paper Bank"**.
* **Global CTA Banner:** Rendered in `src/layouts/PortalLayout.astro`. Appears on top of all pages for unsubscribed visitors.
  * *Text:* "Unlock Unlimited Board Paper Sets, Mock Exams & The Most Likely Bundle for only ₹300 (Valid till Mar 20)!"
  * *CTA Button:* "Unlock Full Access →"

### B. Paper Bank Page (`src/pages/paper-bank.astro`)
* **Introduction:** Explains the question paper vault and practice sets.
* **Free Tier Logic:** 
  * Unsubscribed users get **1 Free Practice Paper Set** (tracked via `localStorage`).
  * Subsequent downloads trigger the **Subscription Modal / Checkout Page**.
* **Subscriber Tier Logic:** Unlocks unlimited generation and direct access to the Most Likely Bundle resources.

---

## 3. Implementation Logic & Astro Architecture

### A. State Management (`localStorage`)
To keep things lightweight and client-side friendly without requiring a heavy external database login system immediately:
* `localStorage.getItem('hsc_it_pass')`: Checks if `'active'`.
* `localStorage.getItem('free_paper_used')`: Tracks the single free download.

### B. Security & Anti-Scraping Strategy
* **Endpoint Protection:** The backend exam API (`/api/exam/start`) powers the paper generation, preventing raw bulk JSON scraping from the public static assets.
* **PDF Watermarking:** Automatically embed subtle footers on generated PDFs: *"Licensed Practice Pass — HSC IT Portal (Unauthorized commercial redistribution prohibited)"*.

---

## 4. Production Deployment Stack (GitHub → Cloudflare Pages)
* **Frontend:** Static Astro build hosted globally on Cloudflare Pages.
* **Backend / API Edge:** Serverless functions (`/api/exam/start`) running on Cloudflare Workers edge nodes.
* **CI/CD Pipeline:** Automated build on every `git push` to GitHub (`npm run build`).