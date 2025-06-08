import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyReadOnlyUser() {
  try {
    console.log('Verificando configuración de usuario de solo lectura...');
    
    // Verificar si existe el usuario de solo lectura
    const users = await prisma.$queryRaw`
      SELECT id, email, name, role
      FROM users
      WHERE email = 'lector@ejemplo.com';
    ` as any[];
    
    const readonlyUser = users[0];

    if (!readonlyUser) {
      console.log('❌ No se encontró el usuario de solo lectura.');
      console.log('Ejecuta el siguiente comando para crearlo:');
      console.log('npm run create:readonly-user');
      return;
    }

    console.log('✅ Usuario de solo lectura encontrado:');
    console.log(`- ID: ${readonlyUser.id}`);
    console.log(`- Email: ${readonlyUser.email}`);
    console.log(`- Nombre: ${readonlyUser.name || 'No definido'}`);
    console.log(`- Rol: ${readonlyUser.role || 'No definido'}`);

    // Verificar si el rol es READ_ONLY
    if (readonlyUser.role !== 'READ_ONLY') {
      console.log('⚠️  Advertencia: El usuario no tiene el rol READ_ONLY');
      console.log('Ejecuta el siguiente comando para actualizar el rol:');
      console.log('npm run db:update-schema');
    } else {
      console.log('✅ El usuario tiene el rol READ_ONLY correctamente configurado');
    }

    console.log('\n🔍 Verificación completada.');
    
  } catch (error) {
    console.error('❌ Error al verificar el usuario de solo lectura:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyReadOnlyUser();
