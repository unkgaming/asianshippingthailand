import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

async function auth(req: NextRequest, ctx: any) {
  console.log('[NextAuth] Request URL:', req.url);
  console.log('[NextAuth] NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  console.log('[NextAuth] Request method:', req.method);
  return NextAuth(authOptions)(req, ctx);
}

export { auth as GET, auth as POST };
