import type { APIRoute } from 'astro';

export const prerender = false;
import { getExamData } from '../../../data/questions/index.js';

type ExamQuestion = { id: string; ans: unknown };
type QuestionForGrading = { sectionKey: string; question: ExamQuestion };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidAnswer(sectionKey: string, answer: unknown): boolean {
  if (sectionKey === 'q2') return typeof answer === 'boolean';
  if (sectionKey === 'q4' || sectionKey === 'q5') {
    return Array.isArray(answer)
      && answer.length === (sectionKey === 'q4' ? 2 : 3)
      && answer.every((value) => typeof value === 'string' && value.length > 0 && value.length <= 512)
      && new Set(answer).size === answer.length;
  }
  return typeof answer === 'string' && answer.length > 0 && answer.length <= 512;
}

function isCorrectAnswer(sectionKey: string, expected: unknown, actual: unknown): boolean {
  if (sectionKey === 'q1' && typeof expected === 'string' && typeof actual === 'string') {
    return expected.trim().toLowerCase() === actual.trim().toLowerCase();
  }
  if ((sectionKey === 'q4' || sectionKey === 'q5') && Array.isArray(expected) && Array.isArray(actual)) {
    const sortedExpected = [...expected].sort();
    const sortedActual = [...actual].sort();
    return sortedExpected.length === sortedActual.length
      && sortedExpected.every((value, index) => value === sortedActual[index]);
  }
  return expected === actual;
}

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ success: false, error: 'Request body must be valid JSON.' }, 400);
  }

  if (!isRecord(body)
    || (body.stream !== 'science' && body.stream !== 'commerce')
    || typeof body.sessionId !== 'string'
    || body.sessionId.length < 8
    || body.sessionId.length > 128
    || !isRecord(body.submissions)) {
    return jsonResponse({ success: false, error: 'A valid stream, session ID, and answer set are required.' }, 400);
  }

  const exam = getExamData(body.stream, body.sessionId);
  const questionList: QuestionForGrading[] = exam.sections
    .filter((section) => ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'].includes(section.key))
    .flatMap((section) => section.items.map((question) => ({ sectionKey: section.key, question })));
  const questionsById = new Map(questionList.map(({ question, sectionKey }) => [question.id, { question, sectionKey }]));

  for (const [id, answer] of Object.entries(body.submissions)) {
    const entry = questionsById.get(id);
    if (!entry || !isValidAnswer(entry.sectionKey, answer)) {
      return jsonResponse({ success: false, error: 'The answer set contains an invalid question or answer.' }, 400);
    }
  }

  let totalMarks = 0;
  let scoredMarks = 0;
  const review = questionList.map(({ sectionKey, question }) => {
    const marks = sectionKey === 'q4' ? 2 : sectionKey === 'q5' ? 3 : 1;
    const answer = body.submissions[question.id];
    const isCorrect = answer !== undefined && isCorrectAnswer(sectionKey, question.ans, answer);
    totalMarks += marks;
    if (isCorrect) scoredMarks += marks;
    return { id: question.id, isCorrect, awardedMarks: isCorrect ? marks : 0 };
  });

  return jsonResponse({
    success: true,
    scoredMarks,
    totalMarks,
    percentage: ((scoredMarks / totalMarks) * 100).toFixed(1),
    review
  });
};
