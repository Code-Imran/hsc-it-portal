import json
import re
from pathlib import Path
import pdfplumber

PDF_PATH = r"E:\Videos\web\IT PORTAL\pdf\TPS SCIENCE.pdf"
QUESTIONS_DIR = Path(r"E:\Videos\web\IT PORTAL\src\data\questions")

# Actual 1-based PDF page ranges in TPS SCIENCE.pdf (Total 171 pages)
CHAPTER_CONFIGS = [
    {
        "filename": "tps-ch2-seo.json",
        "chapter_name": "Introduction to SEO",
        "pages": (47, 58),
    },
    {
        "filename": "tps-ch3-javascript.json",
        "chapter_name": "Advanced JavaScript",
        "pages": (59, 100),
    },
    {
        "filename": "tps-ch4-emerging-tech.json",
        "chapter_name": "Emerging Technologies",
        "pages": (101, 112),
    },
    {
        "filename": "tps-ch5-php.json",
        "chapter_name": "Server-Side Scripting (PHP)",
        "pages": (113, 138),
    },
    {
        "filename": "tps-ch6-ecommerce.json",
        "chapter_name": "E-Commerce & E-Governance",
        "pages": (139, 157),
    },
]

def clean(text):
    return re.sub(r'\s+', ' ', text).strip()

def parse_chapter_mcqs(pdf, start_page, end_page, chapter_title):
    full_text = ""
    for p in range(start_page - 1, min(end_page, len(pdf.pages))):
        page_text = pdf.pages[p].extract_text()
        if page_text:
            full_text += page_text + "\n"

    # Filter running headers/footers
    lines = []
    for line in full_text.splitlines():
        l = line.strip()
        if not l or "TPS Information Technology" in l or "Chapter at a Glance" in l:
            continue
        lines.append(l)

    questions = []
    current_q = None
    q_num_re = re.compile(r'^(\d+)\.\s+(.*)')
    opt_re = re.compile(r'\(([a-fA-F])\)\s*([^(\n]+)')
    ans_re = re.compile(r'Ans\s*[:\.]\s*\(?([a-fA-F0-9,\s\.\(\)\-]+)\)?', re.IGNORECASE)

    for line in lines:
        # Detect Question start
        m_q = q_num_re.match(line)
        # Check if line looks like a question and not a numbered step inside an explanation
        if m_q and ("?" in line or "...." in line or "____" in line or "which" in line.lower() or "following" in line.lower() or "select" in line.lower()):
            if current_q and current_q["options"] and current_q["answer"] is not None:
                questions.append(current_q)
            current_q = {
                "id": len(questions) + 1,
                "chapter": chapter_title,
                "type": "mcq_single",
                "question": clean(m_q.group(2)),
                "options": [],
                "answer": None,
                "explanation": f"{chapter_title} Board Question"
            }
            continue

        if current_q is not None:
            # Check for Answer
            m_ans = ans_re.search(line)
            if m_ans:
                ans_str = m_ans.group(1).lower()
                letters = re.findall(r'\b([a-f])\b', ans_str)
                if letters:
                    idx_list = [ord(c) - ord('a') for c in letters]
                    if len(idx_list) == 1:
                        current_q["type"] = "mcq_single"
                        current_q["answer"] = idx_list[0]
                    elif len(idx_list) == 2:
                        current_q["type"] = "mcq_two"
                        current_q["answer"] = idx_list
                    elif len(idx_list) >= 3:
                        current_q["type"] = "mcq_three"
                        current_q["answer"] = idx_list
                continue

            # Check for Options
            opts = opt_re.findall(line)
            if opts:
                for _, opt_text in opts:
                    c_opt = clean(opt_text)
                    if c_opt and c_opt not in current_q["options"]:
                        current_q["options"].append(c_opt)
                continue

            # If no options found yet, append multiline question text
            if not current_q["options"] and current_q["answer"] is None:
                current_q["question"] += " " + clean(line)

    if current_q and current_q["options"] and current_q["answer"] is not None:
        questions.append(current_q)

    # Reindex sequential IDs
    for idx, q in enumerate(questions, start=1):
        q["id"] = idx

    return questions

def run():
    print(f"Reading {PDF_PATH}...")
    with pdfplumber.open(PDF_PATH) as pdf:
        print(f"Total PDF pages loaded: {len(pdf.pages)}")
        for cfg in CHAPTER_CONFIGS:
            fname = cfg["filename"]
            cname = cfg["chapter_name"]
            p_start, p_end = cfg["pages"]
            
            qs = parse_chapter_mcqs(pdf, p_start, p_end, cname)
            out_file = QUESTIONS_DIR / fname
            
            with open(out_file, "w", encoding="utf-8") as f:
                json.dump(qs, f, indent=2, ensure_ascii=False)
            print(f"[OK] {fname}: {len(qs)} questions saved.")

if __name__ == "__main__":
    run()