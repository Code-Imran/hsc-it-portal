import type { APIRoute } from 'astro';

export const prerender = false;
import { getExamData } from '../../../data/questions/index.js';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });

function startExam(stream: unknown, sessionId: unknown) {
  if ((stream !== 'science' && stream !== 'commerce')
    || typeof sessionId !== 'string'
    || sessionId.length < 8
    || sessionId.length > 128) {
    return jsonResponse({ success: false, error: 'A valid exam stream and session ID are required.' }, 400);
  }

  const exam = getExamData(stream, sessionId);
  const sections = exam.sections.map((section) => ({
    ...section,
    items: section.items.map(({ ans: _answer, ...question }) => question)
  }));

  return jsonResponse({ success: true, streamTitle: exam.streamTitle, sections });
}

export const GET: APIRoute = async ({ request }) => {
  const requestUrl = new URL(request.url);
  const stream = requestUrl.searchParams.get('stream') ?? request.headers.get('X-Exam-Stream');
  const sessionId = requestUrl.searchParams.get('sessionId') ?? request.headers.get('X-Exam-Session-Id');
  return startExam(stream, sessionId);
};

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ success: false, error: 'Request body must be valid JSON.' }, 400);
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return jsonResponse({ success: false, error: 'A valid exam stream and session ID are required.' }, 400);
  }

  const { stream, sessionId } = body as Record<string, unknown>;
  return startExam(stream, sessionId);
};
