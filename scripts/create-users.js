const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function createUsers() {
  try {
    console.log('Creando usuarios en la base de datos...');
    
    // Hashear contraseñas
    const adminPassword = await hash('jere@070411', 12);
    const readonlyPassword = await hash('lector123', 12);
    
    // Crear o actualizar usuario administrador
    const adminUser = await prisma.$executeRaw`
      INSERT INTO "users" (
        "id",
        "name",
        "email",
        "password",
        "role",
        "emailVerified",
        "createdAt",
        "updatedAt"
      ) VALUES (
        'user_admin_123',
        'Administrador',
        'sam171990@gmail.com',
        ${adminPassword},
        'ADMIN'::"UserRole",
        NOW(),
        NOW(),
        NOW()
      )
      ON CONFLICT ("email") 
      DO UPDATE SET
        "name" = EXCLUDED."name",
        "password" = EXCLUDED."password",
        "role" = EXCLUDED."role",
        "updatedAt" = NOW()
      RETURNING *;
    `;
    
    // Crear o actualizar usuario de solo lectura
    const readonlyUser = await prisma.$executeRaw`
      INSERT INTO "users" (
        "id",
        "name",
        "email",
        "password",
        "role",
        "emailVerified",
        "createdAt",
        "updatedAt"
      ) VALUES (
        'user_reader_456',
        'Usuario de Solo Lectura',
        'lector@ejemplo.com',
        ${readonlyPassword},
        'READ_ONLY'::"UserRole",
        NOW(),
        NOW(),
        NOW()
      )
      ON CONFLICT ("email") 
      DO UPDATE SET
        "name" = EXCLUDED."name",
        "password" = EXCLUDED."password",
        "role" = EXCLUDED."role",
        "updatedAt" = NOW()
      RETURNING *;
    `;
    
    console.log('✅ Usuarios creados/actualizados correctamente');
    
    // Mostrar los usuarios creados
    const users = await prisma.$queryRaw`
      SELECT id, email, name, role, "createdAt"
      FROM "users"
      WHERE email IN ('sam171990@gmail.com', 'lector@ejemplo.com')
      ORDER BY email;
    `;
    
    console.log('\nDetalles de los usuarios:');
    console.table(users);
    
  } catch (error) {
    console.error('❌ Error al crear usuarios:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createUsers()
  .then(() => {
    console.log('\n✅ Proceso completado con éxito');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error durante el proceso:', error);
    process.exit(1);
  });
