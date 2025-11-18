import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, company } = body || {};

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ ok: false, error: "User already exists" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        name: name ?? null,
        password: hashed,
        provider: "credentials",
      },
    });

    await prisma.userConfig.create({
      data: { userId: user.id, preferences: { phone: phone ?? null, company: company ?? null } },
    });

    // Send welcome email (non-blocking attempt)
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#222">
        <h2 style="color:#c53030">Welcome to Asian Shipping</h2>
        <p>Hi ${name || "there"},</p>
        <p>Your account has been successfully created. You can now log in and start managing your shipments.</p>
        <p style="margin:20px 0"><a href="${process.env.NEXT_PUBLIC_BASE_URL || ""}" style="background:#c53030;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;display:inline-block">Go to Dashboard</a></p>
        <p>If you did not create this account, please reply to this email immediately.</p>
        <p>— Asian Shipping Team</p>
      </div>`;

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Welcome to Asian Shipping",
        html,
        text: `Welcome to Asian Shipping. Your account is ready. ${process.env.NEXT_PUBLIC_BASE_URL || ""}`,
      });
    } catch (mailErr) {
      console.error("Signup email failed", mailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
