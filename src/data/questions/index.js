import ch1Web from "./tps-ch1-web-designing.json";
import ch2Seo from "./tps-ch2-seo.json";
import ch4Tech from "./tps-ch4-emerging-tech.json";
import ch5Php from "./tps-ch5-php.json";
import ch6Ecomm from "./tps-ch6-ecommerce.json";
import commCh2Marketing from "./tps-comm-ch2-digital-marketing.json";
import commCh3Acct from "./tps-comm-ch3-accounting-gst.json";
import commCh5Db from "./tps-comm-ch5-libreoffice-base.json";

const scienceSources = [ch1Web, ch2Seo, ch4Tech, ch5Php, ch6Ecomm];
const commerceSources = [ch1Web, commCh2Marketing, commCh3Acct, commCh5Db, ch6Ecomm];

function seededRandom(seed) {
  let state = 2166136261;
  for (const character of String(seed)) {
    state ^= character.charCodeAt(0);
    state = Math.imul(state, 16777619);
  }
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled(items, random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function collect(sources, type) {
  return sources.flatMap((source) => source.filter((item) => item.type === type));
}

function choose(sources, type, count, random) {
  const available = collect(sources, type);
  if (available.length < count) {
    throw new Error(`The question bank needs ${count} ${type} questions but has ${available.length}.`);
  }
  return shuffled(available, random).slice(0, count);
}

function normalizeChoiceAnswer(answer, options) {
  const answers = Array.isArray(answer) ? answer : [answer];
  return answers.map((entry) => {
    const value = typeof entry === "number" ? options[entry] : entry;
    if (typeof value !== "string" || !options.includes(value)) {
      throw new Error("A question has an answer that does not match its options.");
    }
    return value;
  });
}

function buildChoiceItems(sources, type, count, sectionKey, prefix, random, multiple) {
  return choose(sources, type, count, random).map((item, index) => {
    const sourceOptions = item.options;
    if (!Array.isArray(sourceOptions) || sourceOptions.some((option) => typeof option !== "string")) {
      throw new Error(`Question ${item.id} has an invalid option list.`);
    }
    const correctAnswers = normalizeChoiceAnswer(item.answer, sourceOptions);
    const options = shuffled(sourceOptions, random);
    const answers = correctAnswers;
    return {
      id: `${prefix}-${sectionKey.slice(1)}-${index + 1}`,
      q: item.question,
      opts: options,
      ans: multiple ? answers : answers[0]
    };
  });
}

function normalizeTrueFalse(item) {
  if (typeof item.answer === "boolean") return item.answer;
  if (typeof item.answer === "number" && Number.isInteger(item.answer)) {
    const option = item.options?.[item.answer];
    if (typeof option === "string") {
      const normalized = option.trim().toLowerCase();
      if (normalized === "true") return true;
      if (normalized === "false") return false;
    }
    if (item.answer === 0 || item.answer === 1) return item.answer === 0;
  }
  if (typeof item.answer === "string") {
    const normalized = item.answer.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  throw new Error(`Question ${item.id} has an invalid true/false answer.`);
}

function buildMatchItems(sources, prefix, random) {
  const groups = collect(sources, "match").filter((item) =>
    Array.isArray(item.pairs) && item.pairs.length >= 4
  );
  if (groups.length === 0) throw new Error("The question bank has no four-pair match question.");
  const group = shuffled(groups, random)[0];
  const pairs = shuffled(group.pairs, random).slice(0, 4);
  const options = shuffled([...new Set(group.pairs.map((pair) => pair.right))], random);
  if (options.length < 4) throw new Error("A match question must have four unique right-side answers.");
  return pairs.map((pair, index) => ({
    id: `${prefix}-6-${index + 1}`,
    q: group.question,
    left: pair.left,
    opts: options,
    ans: pair.right
  }));
}

function buildTextItems(items, sectionKey, prefix, questionField, answerMapper) {
  return items.map((item, index) => ({
    id: `${prefix}-${sectionKey.slice(1)}-${index + 1}`,
    q: item[questionField],
    ans: answerMapper ? answerMapper(item) : item.answer
  }));
}

function scienceWrittenSections() {
  return [
    {
      key: "q7", label: "Q. 7 - Answer in brief", marks: "10M",
      sub: "Answer all 5 questions (2 Marks each). Written practice is not automatically graded.",
      items: [
        { id: "s-7-1", q: "Explain the difference between Client-Side Scripting and Server-Side Scripting." },
        { id: "s-7-2", q: "What is White Hat SEO and Black Hat SEO? State two examples of each." },
        { id: "s-7-3", q: "Describe the three cloud computing service models (IaaS, PaaS, SaaS)." },
        { id: "s-7-4", q: "Explain Section 66 of the Information Technology Act 2000." },
        { id: "s-7-5", q: "What is Client-Side Image Mapping? Explain <map> and <area> tags with coordinates." }
      ]
    },
    {
      key: "q8", label: "Q. 8 - Programming Code Slips", marks: "20M",
      sub: "Attempt 2 out of 4 slips (10 Marks each). Written practice is not automatically graded.",
      items: [
        { id: "s-8-1", title: "Program 1: HTML5 Form Design", q: "Design an online Admission Form collecting Name, Tel (10 digits), DOB, Email, and Course with submit and reset buttons." },
        { id: "s-8-2", title: "Program 2: JavaScript Parallelogram Calculator", q: "Write a JavaScript function to accept base and height and calculate the perimeter and area of a parallelogram on button click." }
      ]
    }
  ];
}

function commerceWrittenSections() {
  return [
    {
      key: "q7", label: "Q. 7 - Answer in brief", marks: "10M",
      sub: "Answer all 5 questions (2 Marks each). Written practice is not automatically graded.",
      items: [
        { id: "c-7-1", q: "What is a Primary Key in LibreOffice Base? State its features." },
        { id: "c-7-2", q: "Explain the common voucher types in Computerized Accounting (F4, F5, F6, F8, F9)." },
        { id: "c-7-3", q: "Differentiate between B2B and B2C E-Commerce models with examples." },
        { id: "c-7-4", q: "Explain Electronic Data Interchange (EDI) and its commercial benefits." },
        { id: "c-7-5", q: "What is a Digital Signature? State the role of Certifying Authorities (CAs)." }
      ]
    },
    {
      key: "q8", label: "Q. 8 - Programming & Software Slips", marks: "20M",
      sub: "Attempt 2 out of 4 slips (10 Marks each). Written practice is not automatically graded.",
      items: [
        { id: "c-8-1", title: "Program 1: HTML5 E-Commerce Order Form", q: "Design a customer order form collecting Name, Mobile (10 digits), Order Date, Quantity (1-10), and Rating slider." },
        { id: "c-8-2", title: "Program 2: JavaScript GST Tax Invoice Calculator", q: "Write a JavaScript function to accept Item Name, Price, and Quantity, calculating Subtotal, 9% CGST, 9% SGST, and Net Total on button click." }
      ]
    }
  ];
}

function buildExam(stream, sessionId) {
  const isCommerce = stream === "commerce";
  const prefix = isCommerce ? "c" : "s";
  const sources = isCommerce ? commerceSources : scienceSources;
  const random = seededRandom(`${stream}:${sessionId}`);
  const fillItems = choose(sources, "fill_in_the_blanks", 10, random);
  const trueFalseItems = choose(sources, "true_false", 10, random);
  const singleItems = buildChoiceItems(sources, "mcq_single", 10, "q3", prefix, random, false);
  const twoItems = buildChoiceItems(sources, "mcq_two", 5, "q4", prefix, random, true);
  const threeItems = buildChoiceItems(sources, "mcq_three", 2, "q5", prefix, random, true);
  const matchSources = isCommerce ? [commCh5Db] : [ch4Tech];
  const matchItems = buildMatchItems(matchSources, prefix, random);

  return {
    streamTitle: isCommerce ? "Commerce (Code 99)" : "Science (Code 97)",
    sections: [
      { key: "q1", label: "Q. 1 - Fill in the blanks", marks: "10M", sub: "Type the exact keyword. Answers are checked without case or surrounding-space differences.", items: buildTextItems(fillItems, "q1", prefix, "question") },
      { key: "q2", label: "Q. 2 - State True or False", marks: "10M", sub: "Select True or False for each statement.", items: buildTextItems(trueFalseItems, "q2", prefix, "question", normalizeTrueFalse) },
      { key: "q3", label: "Q. 3 - Multiple Choice (Single)", marks: "10M", sub: "Select the single best answer for each question.", items: singleItems },
      { key: "q4", label: "Q. 4 - MCQ (Two Answers)", marks: "10M", sub: "Select exactly TWO correct options (2 Marks each).", items: twoItems },
      { key: "q5", label: "Q. 5 - MCQ (Three Answers)", marks: "6M", sub: "Select exactly THREE correct options (3 Marks each).", items: threeItems },
      { key: "q6", label: "Q. 6 - Match the following", marks: "4M", sub: "Select the corresponding match for each item in column A.", items: matchItems },
      ...(isCommerce ? commerceWrittenSections() : scienceWrittenSections())
    ]
  };
}

export function getExamData(stream = "science", sessionId) {
  if (stream !== "science" && stream !== "commerce") {
    throw new Error("A valid exam stream is required.");
  }
  if (typeof sessionId !== "string" || sessionId.length < 8 || sessionId.length > 128) {
    throw new Error("A valid exam session ID is required.");
  }
  return buildExam(stream, sessionId);
}
