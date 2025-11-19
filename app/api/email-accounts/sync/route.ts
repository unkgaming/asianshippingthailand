import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

// POST: Bulk-sync EmailAccounts -> Users (roles + hashed passwords)
export async function POST() {
  try {
    const accounts = await prisma.emailAccount.findMany({});
    let updated = 0;

    for (const acc of accounts) {
      const email = acc.address.toLowerCase();
      const role = acc.accountType === 'staff' ? 'employee' : 'customer';
      const name = acc.username || email.split('@')[0];
      const hashed = await bcrypt.hash(acc.password, 12);

      await prisma.user.upsert({
        where: { email },
        update: { role, password: hashed, name },
        create: { email, name, password: hashed, provider: 'credentials', role },
      });
      updated += 1;
    }

    return NextResponse.json({ ok: true, updated });
  } catch (e: any) {
    console.error('EmailAccounts sync failed:', e);
    return NextResponse.json({ ok: false, error: e?.message || 'Sync failed' }, { status: 500 });
  }
}
