import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body || {};

    if (!token) {
      return NextResponse.json({ ok: false, error: "Verification token is required" }, { status: 400 });
    }

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        emailVerified: null, // Only unverified users
      },
    });

    if (!user) {
      return NextResponse.json({ ok: false, error: "Invalid or expired verification token" }, { status: 400 });
    }

    // Mark email as verified and clear the token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null, // Clear token after use
      },
    });

    return NextResponse.json({ ok: true, message: "Email verified successfully! You can now sign in." });
  } catch (err: any) {
    console.error("Email verification error:", err);
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
