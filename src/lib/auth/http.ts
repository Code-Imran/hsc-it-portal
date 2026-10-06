export function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function safeReturnPath(value: string | null, origin: string): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/';

  try {
    const destination = new URL(value, origin);
    return destination.origin === origin ? `${destination.pathname}${destination.search}${destination.hash}` : '/';
  } catch {
    return '/';
  }
}
