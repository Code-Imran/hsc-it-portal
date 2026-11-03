import json
import re
import pdfplumber

def parse_tps_mcqs(pdf_path, output_json_path):
    questions = []
    current_q = None
    q_id = 7  # Start after your initial seed questions

    # Regex patterns matching TPS formatting
    q_start_pattern = re.compile(r'^\s*(\d+)\.\s+(.*)')
    opt_pattern = re.compile(r'\(([a-f])\)\s*([^(\n]+)')
    ans_pattern = re.compile(r'Ans\s*[:\.]\s*\(?([a-f,\s]+)\)?', re.IGNORECASE)

    with pdfplumber.open(pdf_path) as pdf:
        full_text = ""
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                full_text += text + "\n"

    lines = full_text.splitlines()

    for line in lines:
        line_str = line.strip()
        if not line_str:
            continue

        # Check for new question
        match_q = q_start_pattern.match(line_str)
        if match_q:
            if current_q and current_q.get("options") and current_q.get("answer") is not None:
                questions.append(current_q)
            
            current_q = {
                "id": q_id,
                "chapter": "Advanced Web Designing",
                "type": "mcq_single",
                "question": match_q.group(2).strip(),
                "options": [],
                "answer": None,
                "explanation": "TPS Chapter 1 Board Question"
            }
            q_id += 1
            continue

        # Check for options: (a) text (b) text
        if current_q and "(" in line_str:
            opts = opt_pattern.findall(line_str)
            if opts:
                for letter, val in opts:
                    current_q["options"].append(val.strip())
                continue

        # Check for Answer line
        match_ans = ans_pattern.search(line_str)
        if match_ans and current_q:
            raw_ans = match_ans.group(1).replace(" ", "").split(",")
            # Map 'a' -> 0, 'b' -> 1, 'c' -> 2, 'd' -> 3, 'e' -> 4
            mapped = [ord(char.lower()) - ord('a') for char in raw_ans if 'a' <= char.lower() <= 'f']
            
            if len(mapped) == 1:
                current_q["type"] = "mcq_single"
                current_q["answer"] = mapped[0]
            elif len(mapped) == 2:
                current_q["type"] = "mcq_two"
                current_q["answer"] = mapped
            elif len(mapped) >= 3:
                current_q["type"] = "mcq_three"
                current_q["answer"] = mapped

    # Append the last question
    if current_q and current_q.get("options") and current_q.get("answer") is not None:
        questions.append(current_q)

    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)

    print(f"Extracted {len(questions)} questions successfully into {output_json_path}!")

if __name__ == "__main__":
    parse_tps_mcqs("tps_ch1.pdf", "web-designing-tps.json")