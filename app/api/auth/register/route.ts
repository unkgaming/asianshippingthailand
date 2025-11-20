import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { generateVerificationToken } from "@/lib/auth";

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
    const verificationToken = generateVerificationToken();
    
    // Skip email verification in development if SMTP is not configured
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
    
    const user = await prisma.user.create({
      data: {
        email,
        name: name ?? null,
        password: hashed,
        provider: "credentials",
        verificationToken,
        // Auto-verify in development if no SMTP configured
        emailVerified: (isDevelopment && !hasSmtpConfig) ? new Date() : null,
      },
    });

    await prisma.userConfig.create({
      data: { userId: user.id, preferences: { phone: phone ?? null, company: company ?? null } },
    });

    // Send verification email only if email service is configured
    if (hasSmtpConfig || process.env.RESEND_API_KEY) {
      try {
        const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/verify-email?token=${verificationToken}`;

        const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#222">
          <h2 style="color:#c53030">Verify Your Email - Asian Shipping</h2>
          <p>Hi ${name || "there"},</p>
          <p>Thank you for signing up! Please verify your email address to complete your registration and access your account.</p>
          <p style="margin:20px 0"><a href="${verificationUrl}" style="background:#c53030;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;display:inline-block">Verify Email Address</a></p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color:#666;font-size:12px;word-break:break-all">${verificationUrl}</p>
          <p style="margin-top:20px;color:#666;font-size:12px">This verification link will expire in 24 hours. If you did not create this account, please ignore this email.</p>
          <p>— Asian Shipping Team</p>
        </div>`;

        const textContent = `Please verify your email by clicking this link: ${verificationUrl}`;

        // Try Resend first (supports custom from address with verified domain)
        if (process.env.RESEND_API_KEY) {
          const { Resend } = await import("resend");
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: "Asian Shipping <noreply@asianshippingthai.com>",
            to: email,
            subject: "Verify Your Email - Asian Shipping",
            html,
            text: textContent,
          });
        } 
        // Fallback to Gmail SMTP with proper display name
        else if (hasSmtpConfig) {
          const smtpPort = Number(process.env.SMTP_PORT) || 587;
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          await transporter.sendMail({
            from: `"Asian Shipping" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Verify Your Email - Asian Shipping",
            html,
            text: textContent,
          });
        }
        
        return NextResponse.json({ ok: true, message: "Please check your email to verify your account." });
      } catch (mailErr) {
        console.error("Verification email failed", mailErr);
        // Delete the user if email sending fails
        await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
        return NextResponse.json({ ok: false, error: "Failed to send verification email. Please try again." }, { status: 500 });
      }
    } else {
      // Development mode without SMTP - account is auto-verified
      console.log(`[DEV MODE] Account auto-verified for ${email}. Verification token: ${verificationToken}`);
      return NextResponse.json({ ok: true, message: "Account created successfully. You can now sign in." });
    }
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
