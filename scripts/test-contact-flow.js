const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testContactFlow() {
  console.log('Testing contact form database flow...\n');
  
  // Test 1: Create inquiry
  console.log('1. Creating test inquiry...');
  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '123-456-7890',
        company: 'Test Company',
        service: 'airfreight',
        productType: 'Electronics',
        weight: 100,
        weightUnit: 'kg',
        message: 'Test inquiry message',
        status: 'new',
      },
    });
    console.log('✓ Inquiry created:', inquiry.id);
  } catch (e) {
    console.error('✗ Failed to create inquiry:', e.message);
  }
  
  // Test 2: Create incoming email message
  console.log('\n2. Creating test incoming email...');
  try {
    const email = await prisma.emailMessage.create({
      data: {
        direction: 'incoming',
        from: 'test@example.com',
        to: 'support@asianshippingthai.com',
        subject: 'Test inquiry',
        text: 'Test message',
        html: '<p>Test message</p>',
        status: 'received',
        sentAt: new Date(),
      },
    });
    console.log('✓ Email created:', email.id);
  } catch (e) {
    console.error('✗ Failed to create email:', e.message);
  }
  
  // Test 3: Query inquiries
  console.log('\n3. Querying inquiries...');
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    console.log(`✓ Found ${inquiries.length} inquiries`);
    inquiries.forEach(i => console.log(`  - ${i.name} (${i.email}) - ${i.service}`));
  } catch (e) {
    console.error('✗ Failed to query inquiries:', e.message);
  }
  
  // Test 4: Query email messages
  console.log('\n4. Querying email messages...');
  try {
    const emails = await prisma.emailMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    console.log(`✓ Found ${emails.length} email messages`);
    emails.forEach(e => console.log(`  - ${e.direction}: ${e.from} → ${e.to} | ${e.status}`));
  } catch (e) {
    console.error('✗ Failed to query emails:', e.message);
  }
  
  console.log('\n✓ All tests complete!');
}

testContactFlow()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
