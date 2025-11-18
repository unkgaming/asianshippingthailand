const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkInquiries() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    console.log('\n=== INQUIRIES IN DATABASE ===');
    console.log(`Total found: ${inquiries.length}\n`);
    
    if (inquiries.length === 0) {
      console.log('❌ No inquiries found in database');
    } else {
      inquiries.forEach((inq, idx) => {
        console.log(`${idx + 1}. ID: ${inq.id}`);
        console.log(`   Name: ${inq.name}`);
        console.log(`   Email: ${inq.email}`);
        console.log(`   Service: ${inq.service}`);
        console.log(`   Message: ${inq.message?.substring(0, 50)}...`);
        console.log(`   Created: ${inq.createdAt}`);
        console.log('');
      });
    }
    
    // Also check EmailMessage
    const emails = await prisma.emailMessage.findMany({
      where: { direction: 'incoming' },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    console.log('\n=== INCOMING EMAIL MESSAGES ===');
    console.log(`Total found: ${emails.length}\n`);
    
    if (emails.length === 0) {
      console.log('❌ No incoming email messages found');
    } else {
      emails.forEach((email, idx) => {
        console.log(`${idx + 1}. ID: ${email.id}`);
        console.log(`   From: ${email.fromEmail}`);
        console.log(`   To: ${email.toEmail}`);
        console.log(`   Subject: ${email.subject}`);
        console.log(`   Status: ${email.status}`);
        console.log(`   Created: ${email.createdAt}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkInquiries();
