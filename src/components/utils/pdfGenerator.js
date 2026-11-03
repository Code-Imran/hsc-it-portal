import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Assign virtual font storage safely for browser environments
if (pdfMake && pdfMake.vfs) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

export function generateBoardPaperPDF(questionBank) {
  const blueprint = [
    { section: "Q1", type: "FILL_BLANKS", title: "Fill in the Blanks", count: 10, marks: 1 },
    { section: "Q2", type: "TRUE_FALSE", title: "State True or False", count: 10, marks: 1 },
    { section: "Q3", type: "MCQ_correct1", title: "Multiple Choice (1 Correct Answer)", count: 10, marks: 1 },
    { section: "Q4", type: "MCQ_correct2", title: "Multiple Choice (2 Correct Answers)", count: 5, marks: 2 },
    { section: "Q5", type: "MCQ_correct3", title: "Multiple Choice (3 Correct Answers)", count: 2, marks: 3 },
    { section: "Q6", type: "MATCH_PAIRS", title: "Match the Following Pairs", count: 4, marks: 1 },
    { section: "Q7", type: "THEORY_BRIEF", title: "Answer in Brief", count: 8, required: 5, marks: 2, isChoice: true },
    { section: "Q8", type: "CODE_WRITING", title: "Write Programs / SOP Tasks", count: 4, required: 2, marks: 10, isChoice: true }
  ];

  let docContent = [
    { text: "MAHARASHTRA STATE BOARD - PRACTICE EXAMINATION", style: "mainHeader" },
    { text: "Class XII - Information Technology (Science & Commerce)", style: "subHeader" },
    { text: "Maximum Marks: 80 | Time: 3 Hours\n", style: "subHeader" },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
    { text: "\n" }
  ];

  blueprint.forEach(sec => {
    let pool = questionBank.filter(q => q.exam_section === sec.section || q.type === sec.type);
    let shuffled = pool.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, sec.count);

    let subText = sec.isChoice 
      ? `[Attempt any ${sec.required} out of ${sec.count} | Marks: ${sec.required * sec.marks}]`
      : `[Marks: ${sec.count * sec.marks}]`;

    docContent.push({
      text: `${sec.section}. ${sec.title}  ${subText}`,
      style: "sectionHeader"
    });

    if (sec.isChoice) {
      docContent.push({
        text: `Attempt any ${sec.required} of the following questions:`,
        style: "instructionText"
      });
    }

    selected.forEach((q, idx) => {
      docContent.push({ text: `${idx + 1}. ${q.question}`, style: "questionText" });

      if (q.options && q.options.length > 0 && q.type !== "TRUE_FALSE") {
        q.options.forEach((opt, oIdx) => {
          let label = String.fromCharCode(97 + oIdx);
          docContent.push({ text: `     (${label}) ${opt}`, style: "optionText" });
        });
      }

      if (q.type === "MATCH_PAIRS" && q.pairs) {
        q.pairs.forEach((pair, pIdx) => {
          let pLabel = String.fromCharCode(97 + pIdx);
          docContent.push({ text: `     (${pLabel}) ${pair.premise}  --->  ________`, style: "optionText" });
        });
      }

      docContent.push({ text: "", margin: [0, 3] });
    });

    docContent.push({ text: "\n" });
  });

  const docDefinition = {
    content: docContent,
    styles: {
      mainHeader: { fontSize: 16, bold: true, alignment: 'center', color: '#1f2937' },
      subHeader: { fontSize: 11, italics: true, alignment: 'center', color: '#4b5563', margin: [0, 2, 0, 8] },
      sectionHeader: { fontSize: 11, bold: true, color: '#111827', fillColor: '#f3f4f6', margin: [0, 8, 0, 4] },
      instructionText: { fontSize: 9, italics: true, color: '#6b7280', margin: [0, 0, 0, 4] },
      questionText: { fontSize: 10, bold: false, color: '#1f2937', margin: [0, 4, 0, 2] },
      optionText: { fontSize: 9, color: '#374151', margin: [12, 1, 0, 1] }
    },
    defaultStyle: { font: 'Roboto' }
  };

  pdfMake.createPdf(docDefinition).download(`HSC_IT_Board_Paper_${Date.now()}.pdf`);
}