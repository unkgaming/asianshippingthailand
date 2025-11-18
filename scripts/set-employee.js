const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2] || '67011602@kmitl.ac.th';
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log('User not found for', email);
    return;
  }
  await prisma.user.update({ where: { email }, data: { role: 'employee' } });
  const updated = await prisma.user.findUnique({ where: { email } });
  console.log('Updated role:', updated.email, '->', updated.role);
}

main().catch(console.error).finally(() => prisma.$disconnect());
