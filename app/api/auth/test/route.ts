import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function GET() {
  const results: any = { tests: [] };

  // 1. Test Prisma connectivity
  try {
    const users = await prisma.user.findMany({ take: 1 });
    results.tests.push({
      name: 'Prisma Connectivity',
      status: 'success',
      userCount: users.length,
    });
  } catch (e: any) {
    results.tests.push({
      name: 'Prisma Connectivity',
      status: 'error',
      error: e.message,
    });
  }

  // 2. Test Credentials provider (manual password check)
  try {
    const testEmail = process.env.TEST_LOGIN_EMAIL || '';
    const testPassword = process.env.TEST_LOGIN_PASSWORD || '';
    if (testEmail && testPassword) {
      const user = await prisma.user.findUnique({ where: { email: testEmail } });
      if (user && user.password) {
        const valid = await bcrypt.compare(testPassword, user.password);
        results.tests.push({
          name: 'Credentials Provider',
          status: valid ? 'success' : 'error',
          email: testEmail,
          valid,
        });
      } else {
        results.tests.push({
          name: 'Credentials Provider',
          status: 'error',
          error: 'User not found or missing password',
        });
      }
    } else {
      results.tests.push({
        name: 'Credentials Provider',
        status: 'skipped',
        error: 'TEST_LOGIN_EMAIL or TEST_LOGIN_PASSWORD not set',
      });
    }
  } catch (e: any) {
    results.tests.push({
      name: 'Credentials Provider',
      status: 'error',
      error: e.message,
    });
  }

  // 3. Test Google provider config
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  results.tests.push({
    name: 'Google Provider Config',
    status: googleClientId && googleClientSecret ? 'success' : 'error',
    googleClientId,
    googleClientSecret,
  });

  // 4. Test required environment variables
  const requiredEnv = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
  ];
  const missingEnv = requiredEnv.filter((key) => !process.env[key]);
  results.tests.push({
    name: 'Required Environment Variables',
    status: missingEnv.length === 0 ? 'success' : 'error',
    missingEnv,
  });

  // 5. Test Prisma Adapter setup
  try {
    // Try a simple PrismaAdapter operation
    const users = await prisma.user.findMany({ take: 1 });
    results.tests.push({
      name: 'Prisma Adapter Setup',
      status: 'success',
      userCount: users.length,
    });
  } catch (e: any) {
    results.tests.push({
      name: 'Prisma Adapter Setup',
      status: 'error',
      error: e.message,
    });
  }

  return NextResponse.json(results);
}
