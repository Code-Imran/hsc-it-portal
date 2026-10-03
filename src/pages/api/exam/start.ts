import type { APIRoute } from 'astro';
import questions from '../../../data/questions.json';

export const GET: APIRoute = async () => {
  const sanitized = questions.map(({ server_only, ...safe }) => safe);
  return new Response(JSON.stringify({
    success: true,
    totalQuestions: sanitized.length,
    questions: sanitized
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};