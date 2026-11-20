// Who may put the portal in a frame.
//
// Everything is `frame-ancestors 'none'` (no clickjacking of the portal), except
// /embed/*, which partner websites registered in Developers → Apps may frame.
// Native WebViews are not frames, so they are unaffected either way.
import { NextResponse, type NextRequest } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.mambandamarket.com';
let cache: { at: number; origins: string[] } | null = null;

async function embedOrigins(): Promise<string[]> {
  if (cache && Date.now() - cache.at < 300_000) return cache.origins;
  try {
    const res = await fetch(`${API}/embed/origins`, { signal: AbortSignal.timeout(2000) });
    const json = (await res.json()) as { origins?: string[] };
    const origins = (json.origins ?? []).filter((o) => /^https:\/\/[a-z0-9.-]+(:\d+)?$/i.test(o));
    cache = { at: Date.now(), origins };
    return origins;
  } catch {
    return cache?.origins ?? [];
  }
}

export async function proxy(request: NextRequest) {
  const res = NextResponse.next();
  const isEmbed = request.nextUrl.pathname.startsWith('/embed');
  const ancestors = isEmbed ? ["'self'", ...(await embedOrigins())].join(' ') : "'none'";
  res.headers.set('Content-Security-Policy', `frame-ancestors ${ancestors}`);
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (!isEmbed) res.headers.set('X-Frame-Options', 'DENY');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
