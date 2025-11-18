const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const customerEmail = '67011602@kmitl.ac.th';
  
  console.log('Creating mock shipments...');
  
  // Mock shipment 1: ABC Electronics Ltd
  const shipment1 = await prisma.shipment.create({
    data: {
      code: 'TRK-2025-001',
      customerName: 'ABC Electronics Ltd',
      customerEmail: 'contact@abcelectronics.com',
      origin: 'Shanghai, China',
      destination: 'Los Angeles, USA',
      serviceType: 'Airfreight',
      status: 'In Transit',
      paymentStatus: 'Paid',
      price: 2450.00,
      weight: 500,
      packageType: 'Cartons',
      containerContents: 'Electronics',
      bookingDate: new Date('2025-11-01'),
      estimatedDelivery: new Date('2025-11-20'),
    },
  });
  console.log('✓ Created:', shipment1.code);

  // Mock shipment 2: Fashion Imports Co
  const shipment2 = await prisma.shipment.create({
    data: {
      code: 'TRK-2025-002',
      customerName: 'Fashion Imports Co',
      customerEmail: 'orders@fashionimports.com',
      origin: 'Mumbai, India',
      destination: 'New York, USA',
      serviceType: 'Seafreight LCL',
      status: 'Pending Pickup',
      paymentStatus: 'Pending',
      price: 1850.00,
      weight: 800,
      packageType: 'Cartons',
      containerContents: 'Textiles',
      bookingDate: new Date('2025-11-08'),
      estimatedDelivery: new Date('2025-12-15'),
    },
  });
  console.log('✓ Created:', shipment2.code);

  console.log('\nMock data seeded successfully!');
  console.log('Total shipments:', 2);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
