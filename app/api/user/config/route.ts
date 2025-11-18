import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });

  const config = await prisma.userConfig.findUnique({ where: { userId: user.id } });
  return NextResponse.json({ ok: true, config });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });

  const body = await req.json();
  const { phone, company, preferences } = body || {};

  const updated = await prisma.userConfig.upsert({
    where: { userId: user.id },
    update: { phone, company, preferences },
    create: { userId: user.id, phone, company, preferences },
  });
  return NextResponse.json({ ok: true, config: updated });
}
