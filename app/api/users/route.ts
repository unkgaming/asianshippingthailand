import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'employee') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  try {
    // If email parameter provided, fetch specific user
    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, name: true, role: true },
      });
      return NextResponse.json({ ok: true, user });
    }

    // Otherwise, fetch all users
    const users = await prisma.user.findMany({
      select: { 
        id: true, 
        email: true, 
        name: true, 
        role: true, 
        provider: true,
        createdAt: true,
      },
      orderBy: [
        { role: 'asc' }, // employee first, then customer
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ ok: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
