import type { APIRoute } from 'astro';
import type { PortalProfile } from '../../../lib/auth/profile';
import { jsonResponse } from '../../../lib/auth/http';

export const prerender = false;

export const GET: APIRoute = async ({ session }) => {
  const profile = await session.get<PortalProfile>('portalProfile');
  return jsonResponse({ profile: profile ?? null });
};
