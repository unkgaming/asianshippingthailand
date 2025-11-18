const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const targetEmail = '67011602@kmitl.ac.th';
  
  console.log(`Updating shipments to customerEmail: ${targetEmail}...\n`);
  
  // Update TRK-2025-001
  const ship1 = await prisma.shipment.update({
    where: { code: 'TRK-2025-001' },
    data: { customerEmail: targetEmail },
  });
  console.log('✓ Updated:', ship1.code);

  // Update TRK-2025-002
  const ship2 = await prisma.shipment.update({
    where: { code: 'TRK-2025-002' },
    data: { customerEmail: targetEmail },
  });
  console.log('✓ Updated:', ship2.code);

  console.log('\nShipments updated successfully!');
  
  // Verify
  const all = await prisma.shipment.findMany({ where: { customerEmail: targetEmail } });
  console.log(`\nShipments for ${targetEmail}: ${all.length}`);
  all.forEach(s => console.log(`  ${s.code} | ${s.customerName} | ${s.status}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
