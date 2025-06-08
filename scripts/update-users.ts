import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function updateUsers() {
  try {
    console.log('Actualizando usuarios...');
    
    // 1. Actualizar el usuario lector@ejemplo.com a READ_ONLY
    await prisma.$executeRaw`
      UPDATE users 
      SET role = 'READ_ONLY', 
          name = 'Usuario de Solo Lectura'
      WHERE email = 'lector@ejemplo.com';
    `;
    
    console.log('Usuario de solo lectura actualizado');

    // 2. Verificar si el usuario admin ya existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'sam171990@gmail.com' }
    });

    const hashedPassword = await hash('jere@070411', 12);
    
    if (existingAdmin) {
      // Actualizar usuario existente
      await prisma.$executeRaw`
        UPDATE users 
        SET password = ${hashedPassword},
            name = 'Administrador',
            role = 'ADMIN'
        WHERE email = 'sam171990@gmail.com';
      `;
      console.log('Usuario administrador actualizado');
    } else {
      // Crear nuevo usuario admin
      await prisma.user.create({
        data: {
          email: 'sam171990@gmail.com',
          name: 'Administrador',
          password: hashedPassword,
          emailVerified: new Date(),
        }
      });
      
      // Actualizar el rol a ADMIN usando raw query
      await prisma.$executeRaw`
        UPDATE users 
        SET role = 'ADMIN'
        WHERE email = 'sam171990@gmail.com';
      `;
      console.log('Nuevo usuario administrador creado');
    }
    
    console.log('✅ Usuarios actualizados correctamente');
    
  } catch (error) {
    console.error('Error al actualizar usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUsers();
