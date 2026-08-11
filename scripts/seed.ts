import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@amarbn.org.br' },
    });

    if (existingAdmin) {
      console.log('✓ Admin user already exists');
      return;
    }

    // Create admin user with bcrypt hashed password
    const passwordHash = await bcrypt.hash(
      'troque-esta-senha-antes-do-primeiro-acesso',
      12
    );

    const admin = await prisma.user.create({
      data: {
        email: 'admin@amarbn.org.br',
        passwordHash,
        name: 'Administrator',
        role: 'ADMIN',
        member: {
          create: {
            registration: 'ADMIN-001',
            cpf: '00000000001',
            fullName: 'Administrador AMARBN',
            status: 'ATIVO',
          },
        },
      },
      include: { member: true },
    });

    console.log('✓ Admin user created successfully');
    console.log('  Email:', admin.email);
    console.log('  Role:', admin.role);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
