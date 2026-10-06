import type { APIRoute } from 'astro';
import type { GoogleOAuthFlow, PortalProfile } from '../../../../lib/auth/profile';
import { safeReturnPath } from '../../../../lib/auth/http';
import { env } from 'cloudflare:workers';

export const prerender = false;

function redirectWithError(origin: string, code: string, returnTo = '/'): Response {
  const destination = new URL(safeReturnPath(returnTo, origin), origin);
  destination.searchParams.set('auth_error', code);
  return Response.redirect(destination, 303);
}

export const GET: APIRoute = async ({ request, session }) => {
  const origin = new URL(request.url).origin;
  const params = new URL(request.url).searchParams;
  const flow = await session.get<GoogleOAuthFlow>('googleOAuthFlow');
  const receivedState = params.get('state');

  if (!flow || !receivedState || receivedState !== flow.state || Date.now() - flow.createdAt > 10 * 60 * 1000) {
    await session.delete('googleOAuthFlow');
    return redirectWithError(origin, 'invalid_state');
  }

  await session.delete('googleOAuthFlow');
  const returnTo = safeReturnPath(flow.returnTo, origin);
  if (params.has('error')) {
    const destination = new URL(returnTo, origin);
    destination.searchParams.set('auth_error', 'google_cancelled');
    return Response.redirect(destination, 303);
  }

  const code = params.get('code');
  const clientId = env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = env.GOOGLE_CLIENT_SECRET?.trim();
  if (!code || !clientId || !clientSecret) {
    return redirectWithError(origin, 'not_configured', returnTo);
  }

  let tokenResponse: Response;
  try {
    tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: new URL('/api/auth/google/callback', origin).href,
        grant_type: 'authorization_code',
        code_verifier: flow.verifier,
      }),
    });
  } catch (error) {
    console.error('Google OAuth token exchange request failed:', error);
    return redirectWithError(origin, 'google_exchange_failed', returnTo);
  }

  if (!tokenResponse.ok) {
    console.error('Google OAuth token exchange failed with status', tokenResponse.status);
    return redirectWithError(origin, 'google_exchange_failed', returnTo);
  }

  let tokens: { access_token?: string };
  try {
    tokens = (await tokenResponse.json()) as { access_token?: string };
  } catch (error) {
    console.error('Google OAuth token response was invalid:', error);
    return redirectWithError(origin, 'google_exchange_failed', returnTo);
  }
  if (!tokens.access_token) return redirectWithError(origin, 'google_exchange_failed', returnTo);

  let userResponse: Response;
  try {
    userResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
  } catch (error) {
    console.error('Google user profile request failed:', error);
    return redirectWithError(origin, 'google_profile_failed', returnTo);
  }
  if (!userResponse.ok) {
    console.error('Google user profile request failed with status', userResponse.status);
    return redirectWithError(origin, 'google_profile_failed', returnTo);
  }

  let user: {
    sub?: string;
    name?: string;
    email?: string;
    email_verified?: boolean;
    picture?: string;
  };
  try {
    user = (await userResponse.json()) as typeof user;
  } catch (error) {
    console.error('Google user profile response was invalid:', error);
    return redirectWithError(origin, 'google_profile_failed', returnTo);
  }
  if (!user.sub || !user.name || !user.email || user.email_verified !== true) {
    return redirectWithError(origin, 'google_profile_incomplete', returnTo);
  }

  const profile: PortalProfile = {
    kind: 'google',
    authenticated: true,
    sub: user.sub,
    name: user.name,
    email: user.email,
    picture: user.picture ?? null,
    createdAt: new Date().toISOString(),
  };

  await session.regenerate();
  await session.set('portalProfile', profile);
  return Response.redirect(new URL(returnTo, origin), 303);
};
