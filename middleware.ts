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
    // Removed redirect from .vercel.app hosts to canonical domain
  }

  return NextResponse.next();
}

// Exclude static assets and common files from middleware processing
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|assets).*)',
  ],
};
export const config = {
  matcher: [
    '/((?!api/).*)',
  ],
};
