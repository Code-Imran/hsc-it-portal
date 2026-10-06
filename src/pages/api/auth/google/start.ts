import type { APIRoute } from 'astro';
import { safeReturnPath } from '../../../../lib/auth/http';
import type { GoogleOAuthFlow } from '../../../../lib/auth/profile';
import { env } from 'cloudflare:workers';

export const prerender = false;

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export const GET: APIRoute = async ({ request, session, redirect }) => {
  const clientId = env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = env.GOOGLE_CLIENT_SECRET?.trim();
  const origin = new URL(request.url).origin;
  const returnTo = safeReturnPath(new URL(request.url).searchParams.get('returnTo'), origin);
  if (!clientId || !clientSecret) {
    const destination = new URL(returnTo, origin);
    destination.searchParams.set('auth_error', 'not_configured');
    return Response.redirect(destination, 303);
  }

  const state = toBase64Url(crypto.getRandomValues(new Uint8Array(32)));
  const verifier = toBase64Url(crypto.getRandomValues(new Uint8Array(48)));
  const challengeDigest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  const flow: GoogleOAuthFlow = {
    state,
    verifier,
    returnTo,
    createdAt: Date.now(),
  };

  await session.set('googleOAuthFlow', flow, { ttl: 600 });

  const authorization = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authorization.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: new URL('/api/auth/google/callback', origin).href,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    code_challenge: toBase64Url(new Uint8Array(challengeDigest)),
    code_challenge_method: 'S256',
    prompt: 'select_account',
  }).toString();

  return redirect(authorization.href, 302);
};
