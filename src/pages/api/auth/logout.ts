import type { APIRoute } from 'astro';
import { isSameOriginRequest, jsonResponse } from '../../../lib/auth/http';

export const prerender = false;

export const POST: APIRoute = async ({ request, session }) => {
  if (!isSameOriginRequest(request)) {
    return jsonResponse({ error: 'Request origin could not be verified.' }, 403);
  }

  await session.destroy();
  return jsonResponse({ success: true });
};
