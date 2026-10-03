import type { APIRoute } from 'astro';
import questions from '../../../data/questions.json';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { submissions } = await request.json();
    let totalMarks = 0;
    let scoredMarks = 0;
    const review = [];

    for (const q of questions) {
      totalMarks += q.marks;
      const studentAns = submissions[q.id];
      const correctAns = q.server_only.answer;
      let isCorrect = false;

      if (Array.isArray(correctAns)) {
        if (Array.isArray(studentAns)) {
          const sortedStudent = [...studentAns].sort();
          const sortedCorrect = [...correctAns].sort();
          isCorrect = JSON.stringify(sortedStudent) === JSON.stringify(sortedCorrect);
        }
      } else {
        isCorrect = studentAns === correctAns;
      }

      if (isCorrect) scoredMarks += q.marks;

      review.push({
        id: q.id,
        isCorrect,
        awardedMarks: isCorrect ? q.marks : 0,
        explanation: q.server_only.explanation,
        source: q.server_only.source_reference,
        years: q.server_only.board_exam_years
      });
    }

    return new Response(JSON.stringify({
      success: true,
      scoredMarks,
      totalMarks,
      percentage: ((scoredMarks / totalMarks) * 100).toFixed(1),
      review
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Grading failed" }), { status: 400 });
  }
};