const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const all = await prisma.shipment.findMany({ select: { id: true, code: true } });
  console.log('Found shipments:', all.length);
  for (const s of all) {
    await prisma.shipment.delete({ where: { id: s.id } });
    console.log('Deleted', s.code);
  }
  const left = await prisma.shipment.count();
  console.log('Remaining shipments:', left);
}

main().catch(console.error).finally(() => prisma.$disconnect());
