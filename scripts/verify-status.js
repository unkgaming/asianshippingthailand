const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = '67011602@kmitl.ac.th';
  const shipments = await prisma.shipment.count();
  const user = await prisma.user.findUnique({ where: { email } });
  console.log('Shipments in DB:', shipments);
  console.log('User:', user ? `${user.email} role=${user.role||'null'}` : 'not found');
}

main().catch(console.error).finally(() => prisma.$disconnect());
