import { NextResponse } from 'next/server';

export function middleware(req: Request) {
  const url = new URL(req.url);
  const host = url.host;

  // Only enforce in production to avoid interfering with local dev
  if (process.env.NODE_ENV === 'production') {
    const canonical = 'asianshippingthai.com';

    // Redirect www to apex
    if (host === `www.${canonical}`) {
      url.host = canonical;
      return NextResponse.redirect(url, 308);
    }

    // Redirect any vercel.app host (preview or project domain) to canonical
    if (host.endsWith('.vercel.app') && host !== canonical) {
      url.host = canonical;
      return NextResponse.redirect(url, 308);
    }
  }

  return NextResponse.next();
}

// Exclude static assets and common files from middleware processing
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|assets).*)',
  ],
};
