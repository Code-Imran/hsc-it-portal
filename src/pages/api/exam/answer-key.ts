import type { APIRoute } from 'astro';

export const prerender = false;
import { getExamData } from '../../../data/questions/index.js';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });

function resolveAnswer(q: any): string {
  // DEBUG: Let's inspect what properties are present on the question object
  console.log("Evaluating question item:", JSON.stringify({
    q: q.question || q.q,
    answer: q.answer,
    ans: q.ans,
    server_only: q.server_only
  }));

  const serverData = q.server_only || {};
  const a = serverData.answer !== undefined ? serverData.answer : (q.answer !== undefined ? q.answer : q.ans);

  if (a === undefined || a === null) return 'Refer to marking scheme.';

  if (typeof a === 'number' && Array.isArray(q.options) && q.options[a]) {
    const letter = String.fromCharCode(65 + a);
    return `(${letter}) ${q.options[a]}`;
  }

  if (Array.isArray(a) && Array.isArray(q.options)) {
    return a.map(i => {
      if (typeof i === 'number' && q.options[i]) {
        return `(${String.fromCharCode(65 + i)}) ${q.options[i]}`;
      }
      return String(i);
    }).join(', ');
  }

  return String(a);
}

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

  if ((stream !== 'science' && stream !== 'commerce')
    || typeof sessionId !== 'string'
    || sessionId.length < 8
    || sessionId.length > 128) {
    return jsonResponse({ success: false, error: 'A valid exam stream and session ID are required.' }, 400);
  }

  const exam = getExamData(stream, sessionId);

  const sections = exam.sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      resolvedAnswer: resolveAnswer(item),
      resolvedExplanation: item.server_only?.explanation || item.explanation || ''
    }))
  }));

  return jsonResponse({ success: true, streamTitle: exam.streamTitle, sections });
};