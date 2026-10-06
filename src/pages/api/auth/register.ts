import type { APIRoute } from 'astro';
import type { PortalProfile } from '../../../lib/auth/profile';
import { isSameOriginRequest, jsonResponse } from '../../../lib/auth/http';

export const prerender = false;

function clean(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const result = value.trim().replace(/\s+/g, ' ');
  return result.length > 0 && result.length <= maxLength ? result : null;
}

export const POST: APIRoute = async ({ request, session }) => {
  if (!isSameOriginRequest(request)) {
    return jsonResponse({ error: 'Request origin could not be verified.' }, 403);
  }
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return jsonResponse({ error: 'Send registration details as JSON.' }, 415);
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 4096) return jsonResponse({ error: 'Registration details are too large.' }, 413);

  let input: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > 4096) {
      return jsonResponse({ error: 'Registration details are too large.' }, 413);
    }
    input = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return jsonResponse({ error: 'Registration details are not valid JSON.' }, 400);
  }

  const name = clean(input.name, 80);
  const school = clean(input.school, 120);
  const city = clean(input.city, 80);
  const whatsapp = clean(input.whatsapp, 24);
  const email = clean(input.email, 254);
  const phoneDigits = whatsapp?.replace(/\D/g, '') ?? '';

  if (
    !name ||
    name.split(' ').length < 2 ||
    !/\p{L}/u.test(name) ||
    !school ||
    !city ||
    !whatsapp ||
    !/^\+?[\d\s().-]+$/.test(whatsapp) ||
    phoneDigits.length < 8 ||
    phoneDigits.length > 15
  ) {
    return jsonResponse(
      { error: 'Enter your full name, a valid WhatsApp number, school or college, and city.' },
      400,
    );
  }
  if (input.email !== '' && input.email !== undefined && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return jsonResponse({ error: 'Enter a valid email address or leave it blank.' }, 400);
  }

  const profile: PortalProfile = {
    kind: 'student',
    authenticated: false,
    name,
    email: email || null,
    whatsapp,
    school,
    city,
    createdAt: new Date().toISOString(),
  };

  await session.regenerate();
  await session.set('portalProfile', profile);
  return jsonResponse({ profile });
};
