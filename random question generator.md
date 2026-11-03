# Reference Guide: HSC IT Portal — Random 80-Mark Board Paper & Answer Key Generator

## 1. System Architecture & Overview
The Random Question Paper & Answer Key Generator is a client-server hybrid feature within the **HSC IT Portal**[cite: 2]. It bridges the static frontend homepage (`src/pages/index.astro`) with the dynamic exam session API routes (`/api/exam/start` and `/api/exam/answer-key`) to compile official Maharashtra State Board Class 12 Information Technology exam papers (Science Code 97 & Commerce Code 99) into downloadable PDF documents on the fly[cite: 2].

### Key Characteristics:
* **Dynamic Randomization (Session-Synced Sets):** Employs a unique active session ID generated on-the-fly during paper export. This ensures that the companion answer-key endpoint (`/api/exam/answer-key`) utilizes the exact same seed to generate and match solutions for that identical random paper.
* **Anti-Scraping / Security Isolation:** Live student mock exams strip correct answers and server-only solution details on the server side (`start.ts`), shielding question items and keys from client-side inspection[cite: 2].
* **Server-Side Answer Normalization:** Answers are resolved into clean human-readable strings (e.g., option indices mapped to letters and text values) directly within the backend answer-key endpoint before reaching the client.
* **Client-Side PDF Compilation:** Uses `pdfmake` loaded via CDN (`vfs_fonts.js` and `pdfmake.min.js`) directly in the browser to handle page breaks, headers, clean text sanitization, and automatic downloads[cite: 2].

---

## 2. Execution Workflow & Data Flow

1. **User Action:** The user selects their stream and clicks **"Download Board Paper (PDF)"** on the homepage hero section[cite: 2].
2. **Session Initialization & API Request:** The browser generates a unique session ID (`pdf-sess-...`) and executes an asynchronous `POST` request to `/api/exam/start` passing the active stream code and session ID[cite: 2].
3. **Payload Reception:** The backend exam generator returns a structured JSON payload containing sections `Q1` through `Q8`, with randomized item pools, marks, and choices[cite: 2].
4. **PDF Compilation (`pdfmake`):** 
   * A professional examination layout header is constructed (Maximum Marks: 80, Time: 3 Hours)[cite: 2].
   * Sections are looped sequentially, appending item numbers, question statements, option arrays (`(a)`, `(b)`, etc.), and choice instructions[cite: 2].
5. **Trigger Download & Unlock Key:** `pdfMake.createPdf(docDefinition).download(...)` initiates an instant browser download, and the **"Download Answer Key (PDF)"** button unlocks (turns red).
6. **Answer Key Fetch & Generation:** When clicked, the browser sends a `POST` request to `/api/exam/answer-key` with the stored session ID. The server retrieves the identical randomized paper instance, normalizes the correct answers and explanations server-side, and compiles the companion Answer Key PDF[cite: 2].

---

## 3. Official 80-Mark Board Blueprint

The paper strictly adheres to the Maharashtra State Board evaluation scheme:

| Section | Question Type | Format Rule | Total Items | Marks Each | Section Total |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Q1** | Fill in the Blanks | Objective | 10 | 1 Mark | 10 Marks[cite: 2] |
| **Q2** | State True or False | Objective | 10 | 1 Mark | 10 Marks[cite: 2] |
| **Q3** | Multiple Choice (1 Correct) | Objective | 10 | 1 Mark | 10 Marks[cite: 2] |
| **Q4** | Multiple Choice (2 Correct) | Objective | 5 | 2 Marks | 10 Marks[cite: 2] |
| **Q5** | Multiple Choice (3 Correct) | Objective | 2 | 3 Marks | 6 Marks[cite: 2] |
| **Q6** | Match the Following Pairs | Objective | 4 | 1 Mark | 4 Marks[cite: 2] |
| **Q7** | Answer in Brief | Subjective with Choice | 8 (Attempt 5) | 2 Marks | 10 Marks[cite: 2] |
| **Q8** | Write Programs / SOP Tasks | Practical with Choice | 4 (Attempt 2) | 10 Marks | 20 Marks[cite: 2] |

---

## 4. Future Scaling & Maintenance Guidelines

* **Adding New Questions / Changing Content:** Modify the backend question repository or database tied to the exam data provider. Randomized sets will automatically incorporate new entries[cite: 2].
* **Adjusting PDF Styling:** Modify the `styles` object dictionary inside `src/pages/index.astro` under `docDefinition` to alter fonts, padding, colors (`#0f766e` for answer keys, `#1f2937` for question papers), or table borders[cite: 2].
* **Maintaining Endpoints:** Keep `start.ts` secure by stripping answers for general sessions, and use `answer-key.ts` solely for resolved server-side solution lookups mapped to valid session seeds[cite: 2].