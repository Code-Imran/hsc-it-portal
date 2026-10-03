// Master Question Bank Aggregator for HSC IT Online Exam (Science 97 & Commerce 99)
import ch1Web from "./tps-ch1-web-designing.json";
import ch2Seo from "./tps-ch2-seo.json";
import ch4Tech from "./tps-ch4-emerging-tech.json";
import ch5Php from "./tps-ch5-php.json";
import ch6Ecomm from "./tps-ch6-ecommerce.json";

// Commerce Specific Chapters
import commCh2Marketing from "./tps-comm-ch2-digital-marketing.json";
import commCh3Acct from "./tps-comm-ch3-accounting-gst.json";
import commCh5Db from "./tps-comm-ch5-libreoffice-base.json";

export function getExamData(stream = "science") {
  const isCommerce = stream.toLowerCase() === "commerce";

  if (isCommerce) {
    return {
      streamTitle: "Commerce (Code 99)",
      sections: [
        {
          key: "q1",
          label: "Q. 1 - Fill in the blanks",
          marks: "10M",
          sub: "Type exact keyword. Avoid leading/trailing spaces.",
          items: [
            ...ch1Web.q1_fill_in_the_blanks.slice(0, 2),
            ...commCh2Marketing.q1_fill_in_the_blanks.slice(0, 2),
            ...commCh3Acct.q1_fill_in_the_blanks.slice(0, 3),
            ...commCh5Db.q1_fill_in_the_blanks.slice(0, 2),
            ...ch6Ecomm.q1_fill_in_the_blanks.slice(0, 1)
          ].map((item, idx) => ({ id: `c-1-${idx + 1}`, q: item.question, ans: item.answer }))
        },
        {
          key: "q2",
          label: "Q. 2 - State True or False",
          marks: "10M",
          sub: "Select True or False for each statement.",
          items: [
            ...ch1Web.q2_true_false.slice(0, 2),
            ...commCh2Marketing.q2_true_false.slice(0, 2),
            ...commCh3Acct.q2_true_false.slice(0, 3),
            ...commCh5Db.q2_true_false.slice(0, 2),
            ...ch6Ecomm.q2_true_false.slice(0, 1)
          ].map((item, idx) => ({ id: `c-2-${idx + 1}`, q: item.statement, ans: item.answer }))
        },
        {
          key: "q3",
          label: "Q. 3 - Multiple Choice (Single)",
          marks: "10M",
          sub: "Select the single best answer for each question.",
          items: [
            ...ch1Web.q3_mcq_single.slice(0, 2),
            ...commCh2Marketing.q3_mcq_single.slice(0, 2),
            ...commCh3Acct.q3_mcq_single.slice(0, 3),
            ...commCh5Db.q3_mcq_single.slice(0, 2),
            ...ch6Ecomm.q3_mcq_single.slice(0, 1)
          ].map((item, idx) => ({ id: `c-3-${idx + 1}`, q: item.question, opts: item.options, ans: item.answer }))
        },
        {
          key: "q4",
          label: "Q. 4 - MCQ (Two Answers)",
          marks: "10M",
          sub: "Select exactly TWO correct options (2 Marks each).",
          items: [
            ch1Web.q4_mcq_two_correct[0],
            commCh2Marketing.q4_mcq_two_correct[0],
            commCh3Acct.q4_mcq_two_correct[0],
            commCh5Db.q4_mcq_two_correct[0],
            ch6Ecomm.q4_mcq_two_correct[0]
          ].map((item, idx) => ({ id: `c-4-${idx + 1}`, q: item.question, opts: item.options, ans: item.answer }))
        },
        {
          key: "q5",
          label: "Q. 5 - MCQ (Three Answers)",
          marks: "6M",
          sub: "Select exactly THREE correct options (3 Marks each).",
          items: [
            commCh3Acct.q5_mcq_three_correct[0],
            commCh5Db.q5_mcq_three_correct[0]
          ].map((item, idx) => ({ id: `c-5-${idx + 1}`, q: item.question, opts: item.options, ans: item.answer }))
        },
        {
          key: "q6",
          label: "Q. 6 - Match the following",
          marks: "4M",
          sub: "Select corresponding match for each item in column A.",
          items: commCh3Acct.q6_match_following[0].pairs.map((p, idx) => ({
            id: `c-6-${idx + 1}`,
            left: p.left,
            opts: ["Contra Voucher (Cash & Bank transfer)", "Payment Voucher", "Receipt Voucher", "Sales Voucher"],
            ans: p.right
          }))
        },
        {
          key: "q7",
          label: "Q. 7 - Answer in brief",
          marks: "10M",
          sub: "Attempt any 5 out of 8 questions (2 Marks each).",
          items: [
            { id: "c-7-1", q: "What is a Primary Key in LibreOffice Base? State its features." },
            { id: "c-7-2", q: "Explain the common voucher types in Computerized Accounting (F4, F5, F6, F8, F9)." },
            { id: "c-7-3", q: "Differentiate between B2B and B2C E-Commerce models with examples." },
            { id: "c-7-4", q: "Explain Electronic Data Interchange (EDI) and its commercial benefits." },
            { id: "c-7-5", q: "What is a Digital Signature? State the role of Certifying Authorities (CAs)." }
          ]
        },
        {
          key: "q8",
          label: "Q. 8 - Programming & Software Slips",
          marks: "20M",
          sub: "Attempt 2 out of 4 slips (10 Marks each).",
          items: [
            { id: "c-8-1", title: "Program 1: HTML5 E-Commerce Order Form", q: "Design a customer order form collecting Name, Mobile (10 digits), Order Date, Quantity (1-10), and Rating slider." },
            { id: "c-8-2", title: "Program 2: JavaScript GST Tax Invoice Calculator", q: "Write a JavaScript function to accept Item Name, Price, and Quantity, calculating Subtotal, 9% CGST, 9% SGST, and Net Total on button click." }
          ]
        }
      ]
    };
  }

  // Science Stream (Code 97)
  return {
    streamTitle: "Science (Code 97)",
    sections: [
      {
        key: "q1",
        label: "Q. 1 - Fill in the blanks",
        marks: "10M",
        sub: "Type exact keyword. Avoid leading/trailing spaces.",
        items: [
          ...ch1Web.q1_fill_in_the_blanks.slice(0, 3),
          ...ch2Seo.q1_fill_in_the_blanks.slice(0, 2),
          ...ch4Tech.q1_fill_in_the_blanks.slice(0, 2),
          ...ch5Php.q1_fill_in_the_blanks.slice(0, 2),
          ...ch6Ecomm.q1_fill_in_the_blanks.slice(0, 1)
        ].map((item, idx) => ({ id: `s-1-${idx + 1}`, q: item.question, ans: item.answer }))
      },
      {
        key: "q2",
        label: "Q. 2 - State True or False",
        marks: "10M",
        sub: "Select True or False for each statement.",
        items: [
          ...ch1Web.q2_true_false.slice(0, 2),
          ...ch2Seo.q2_true_false.slice(0, 2),
          ...ch4Tech.q2_true_false.slice(0, 2),
          ...ch5Php.q2_true_false.slice(0, 2),
          ...ch6Ecomm.q2_true_false.slice(0, 2)
        ].map((item, idx) => ({ id: `s-2-${idx + 1}`, q: item.statement, ans: item.answer }))
      },
      {
        key: "q3",
        label: "Q. 3 - Multiple Choice (Single)",
        marks: "10M",
        sub: "Select the single best answer for each question.",
        items: [
          ...ch1Web.q3_mcq_single.slice(0, 2),
          ...ch2Seo.q3_mcq_single.slice(0, 2),
          ...ch4Tech.q3_mcq_single.slice(0, 2),
          ...ch5Php.q3_mcq_single.slice(0, 2),
          ...ch6Ecomm.q3_mcq_single.slice(0, 2)
        ].map((item, idx) => ({ id: `s-3-${idx + 1}`, q: item.question, opts: item.options, ans: item.answer }))
      },
      {
        key: "q4",
        label: "Q. 4 - MCQ (Two Answers)",
        marks: "10M",
        sub: "Select exactly TWO correct options (2 Marks each).",
        items: [
          ch1Web.q4_mcq_two_correct[0],
          ch2Seo.q4_mcq_two_correct[0],
          ch4Tech.q4_mcq_two_correct[0],
          ch5Php.q4_mcq_two_correct[0],
          ch6Ecomm.q4_mcq_two_correct[0]
        ].map((item, idx) => ({ id: `s-4-${idx + 1}`, q: item.question, opts: item.options, ans: item.answer }))
      },
      {
        key: "q5",
        label: "Q. 5 - MCQ (Three Answers)",
        marks: "6M",
        sub: "Select exactly THREE correct options (3 Marks each).",
        items: [
          ch1Web.q5_mcq_three_correct[0],
          ch5Php.q5_mcq_three_correct[0]
        ].map((item, idx) => ({ id: `s-5-${idx + 1}`, q: item.question, opts: item.options, ans: item.answer }))
      },
      {
        key: "q6",
        label: "Q. 6 - Match the following",
        marks: "4M",
        sub: "Select corresponding match for each item in column A.",
        items: ch4Tech.q6_match_following[0].pairs.slice(0, 4).map((p, idx) => ({
          id: `s-6-${idx + 1}`,
          left: p.left,
          opts: ["Infrastructure as a Service", "Platform as a Service", "Software as a Service", "Data protected behind firewall"],
          ans: p.right
        }))
      },
      {
        key: "q7",
        label: "Q. 7 - Answer in brief",
        marks: "10M",
        sub: "Attempt any 5 out of 8 questions (2 Marks each).",
        items: [
          { id: "s-7-1", q: "Explain the difference between Client-Side Scripting and Server-Side Scripting." },
          { id: "s-7-2", q: "What is White Hat SEO and Black Hat SEO? State two examples of each." },
          { id: "s-7-3", q: "Describe the three cloud computing service models (IaaS, PaaS, SaaS)." },
          { id: "s-7-4", q: "Explain Section 66 of the Information Technology Act 2000." },
          { id: "s-7-5", q: "What is Client-Side Image Mapping? Explain <map> and <area> tags with coordinates." }
        ]
      },
      {
        key: "q8",
        label: "Q. 8 - Programming Code Slips",
        marks: "20M",
        sub: "Write standard markup or script (Attempt 2 out of 4 programs, 10 Marks each).",
        items: [
          { id: "s-8-1", title: "Program 1: HTML5 Form Design", q: "Design an online Admission Form collecting Name, Tel (10 digits), DOB, Email, and Course with submit and reset buttons." },
          { id: "s-8-2", title: "Program 2: JavaScript Parallelogram Calculator", q: "Write a JavaScript function to accept base and height and calculate the perimeter and area of a parallelogram on button click." }
        ]
      }
    ]
  };
}