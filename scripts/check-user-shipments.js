const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const email = '67011602@kmitl.ac.th';
  
  // Check shipments for this user
  const shipments = await prisma.shipment.findMany({
    where: { customerEmail: email },
    orderBy: { createdAt: 'desc' }
  });
  
  console.log(`Shipments for ${email}:`, shipments.length);
  console.log('');
  
  shipments.forEach(ship => {
    console.log(`${ship.code} | ${ship.customerName} | ${ship.status} | ${ship.paymentStatus} | $${ship.price}`);
  });
  
  // Also check all shipments in the database
  console.log('\n--- All shipments in database: ---');
  const all = await prisma.shipment.findMany();
  console.log('Total:', all.length);
  all.forEach(ship => {
    console.log(`${ship.code} | ${ship.customerEmail}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
