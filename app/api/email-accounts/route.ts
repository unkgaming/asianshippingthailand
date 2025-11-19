import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    const accounts = await prisma.emailAccount.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
    return NextResponse.json({ ok: true, data: accounts });
  } catch (error) {
    console.error('Error fetching email accounts:', error);
    return NextResponse.json({ ok: false, error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null) as any;
    if (!body) return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });

    const address = String(body.address || '').trim().toLowerCase();
    const username = String(body.username || '').trim();
    const password = String(body.password || '').trim();
    const accountType = (body.accountType === 'staff' ? 'staff' : 'customer');
    const active = body.active === false ? false : true;

    if (!address || !username || !password) {
      return NextResponse.json({ ok: false, error: 'address, username, password are required' }, { status: 400 });
    }

    const created = await prisma.emailAccount.create({
      data: { address, username, password, accountType, active },
    });

    // Sync to auth Users so credentials can log in
    try {
      const role = accountType === 'staff' ? 'employee' : 'customer';
      const hashed = await bcrypt.hash(password, 12);
      await prisma.user.upsert({
        where: { email: address },
        update: { password: hashed, role },
        create: {
          email: address,
          name: username || address.split('@')[0],
          password: hashed,
          provider: 'credentials',
          role,
        },
      });
    } catch (e) {
      console.error('Warning: failed to sync EmailAccount to User login:', e);
    }
    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating email account:', error);
    return NextResponse.json({ ok: false, error: 'Failed to create account' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ ok: false, error: 'Account ID is required' }, { status: 400 });

    const existing = await prisma.emailAccount.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ ok: false, error: 'Account not found' }, { status: 404 });

    const body = await req.json().catch(() => null) as any;
    if (!body) return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });

    const data: any = {};
    if (typeof body.address === 'string') data.address = body.address.trim().toLowerCase();
    if (typeof body.username === 'string') data.username = body.username.trim();
    if (typeof body.password === 'string') data.password = body.password;
    if (typeof body.accountType === 'string') data.accountType = body.accountType === 'staff' ? 'staff' : 'customer';
    if (typeof body.active === 'boolean') data.active = body.active;

    const updated = await prisma.emailAccount.update({ where: { id }, data });

    // Sync changes to Users for login
    try {
      const newAddress = (data.address ?? existing.address).toLowerCase();
      const newUsername = data.username ?? existing.username;
      const acctType = data.accountType ?? existing.accountType;
      const role = acctType === 'staff' ? 'employee' : 'customer';

      // If email changed, try to update existing user; else upsert
      if (existing.address.toLowerCase() !== newAddress) {
        const hashed = typeof data.password === 'string' ? await bcrypt.hash(data.password, 12) : undefined;
        // Attempt update old user first
        const updateData: any = { email: newAddress, role };
        if (hashed) updateData.password = hashed;
        await prisma.user.update({ where: { email: existing.address.toLowerCase() }, data: updateData })
          .catch(async () => {
            // If no old user, create or update by new address
            await prisma.user.upsert({
              where: { email: newAddress },
              update: { role, ...(hashed ? { password: hashed } : {}) },
              create: {
                email: newAddress,
                name: newUsername || newAddress.split('@')[0],
                password: hashed || (await bcrypt.hash(existing.password, 12)),
                provider: 'credentials',
                role,
              },
            });
          });
      } else {
        // Same email, just update role/password/name as needed
        const hashed = typeof data.password === 'string' ? await bcrypt.hash(data.password, 12) : undefined;
        const updateData: any = { role };
        if (hashed) updateData.password = hashed;
        if (newUsername) updateData.name = newUsername;
        await prisma.user.upsert({
          where: { email: newAddress },
          update: updateData,
          create: {
            email: newAddress,
            name: newUsername || newAddress.split('@')[0],
            password: hashed || (await bcrypt.hash(existing.password, 12)),
            provider: 'credentials',
            role,
          },
        });
      }
    } catch (e) {
      console.error('Warning: failed to sync updated EmailAccount to User login:', e);
    }
    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    console.error('Error updating email account:', error);
    return NextResponse.json({ ok: false, error: 'Failed to update account' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ ok: false, error: 'Account ID is required' }, { status: 400 });

    // Find address before delete to remove corresponding User login
    const existing = await prisma.emailAccount.findUnique({ where: { id } });
    await prisma.emailAccount.delete({ where: { id } });

    if (existing?.address) {
      try {
        await prisma.user.delete({ where: { email: existing.address.toLowerCase() } });
      } catch (e) {
        // If no user, ignore
      }
    }
    return NextResponse.json({ ok: true, message: 'Account deleted' });
  } catch (error) {
    console.error('Error deleting email account:', error);
    return NextResponse.json({ ok: false, error: 'Failed to delete account' }, { status: 500 });
  }
}
