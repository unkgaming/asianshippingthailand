const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const shipments = await prisma.shipment.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  console.log('Total shipments in database:', shipments.length);
  console.log('');
  
  shipments.forEach(ship => {
    console.log(`${ship.code} | ${ship.customerName} | ${ship.customerEmail} | ${ship.status}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
