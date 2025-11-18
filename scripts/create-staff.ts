import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createStaffAccount() {
  const email = process.argv[2] || 'staff@asianshippingthai.com';
  const password = process.argv[3] || 'StaffPassword123!';
  const name = process.argv[4] || 'Staff Admin';

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.log(`❌ User with email ${email} already exists`);
      
      // Update to staff role if not already
      if (existing.role !== 'employee') {
        await prisma.user.update({
          where: { email },
          data: { role: 'employee' },
        });
        console.log(`✅ Updated ${email} to staff role`);
      }
      
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create staff user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'employee',
        provider: 'credentials',
      },
    });

    // Create user config
    await prisma.userConfig.create({
      data: {
        userId: user.id,
        preferences: {},
      },
    });

    console.log('✅ Staff account created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Name:', name);
    console.log('🎭 Role: employee (staff)');
    console.log('\n⚠️  Please change the password after first login!');
  } catch (error) {
    console.error('❌ Error creating staff account:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createStaffAccount();
