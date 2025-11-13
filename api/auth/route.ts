import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Line from "next-auth/providers/line";
import { NextResponse } from 'next/server';

// Build providers only if env vars are present to avoid runtime crashes
const providers: any[] = [];
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  );
}
if (process.env.LINE_CLIENT_ID && process.env.LINE_CLIENT_SECRET) {
  providers.push(
    Line({
      clientId: process.env.LINE_CLIENT_ID,
      clientSecret: process.env.LINE_CLIENT_SECRET
    })
  );
}

export const authOptions = {
  providers,
  pages: {
    signIn: "/auth/login"
  },
  session: { strategy: "jwt" }
};

// If no providers are configured, return a helpful 500 response instead of crashing
const handler = NextAuth(authOptions as any);

export async function GET(req: Request) {
  if (providers.length === 0) {
    return NextResponse.json(
      { error: 'No auth providers configured. Set GOOGLE_CLIENT_ID/SECRET or LINE_CLIENT_ID/SECRET in your environment.' },
      { status: 500 }
    );
  }
  // handler is the NextAuth request handler
  return handler(req as any);
}

export async function POST(req: Request) {
  if (providers.length === 0) {
    return NextResponse.json(
      { error: 'No auth providers configured. Set GOOGLE_CLIENT_ID/SECRET or LINE_CLIENT_ID/SECRET in your environment.' },
      { status: 500 }
    );
  }
  return handler(req as any);
}
