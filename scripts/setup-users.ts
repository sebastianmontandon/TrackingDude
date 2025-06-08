import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function setupUsers() {
  try {
    console.log('Configurando usuarios...');
    
    // 1. Asegurarse de que la columna role existe
    try {
      await prisma.$executeRaw`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name='users' AND column_name='role') THEN
            ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'USER';
          END IF;
        END $$;
      `;
      console.log('✅ Columna de rol verificada/creada');
    } catch (error) {
      console.error('Error al verificar la columna de rol:', error);
      throw error;
    }
    
    // 2. Crear o actualizar el usuario administrador
    const adminEmail = 'sam171990@gmail.com';
    const adminPassword = await hash('jere@070411', 12);
    
    await prisma.$executeRaw`
      INSERT INTO users (email, name, password, "emailVerified", role, "createdAt", "updatedAt")
      VALUES (${adminEmail}, 'Administrador', ${adminPassword}, NOW(), 'ADMIN', NOW(), NOW())
      ON CONFLICT (email) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        password = EXCLUDED.password,
        role = 'ADMIN',
        "updatedAt" = NOW()
    `;
    
    console.log('✅ Usuario administrador configurado:', adminEmail);
    
    // 3. Crear o actualizar el usuario de solo lectura
    const readonlyEmail = 'lector@ejemplo.com';
    const readonlyPassword = await hash('lector123', 12);
    
    await prisma.$executeRaw`
      INSERT INTO users (email, name, password, "emailVerified", role, "createdAt", "updatedAt")
      VALUES (${readonlyEmail}, 'Usuario de Solo Lectura', ${readonlyPassword}, NOW(), 'READ_ONLY', NOW(), NOW())
      ON CONFLICT (email) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        password = EXCLUDED.password,
        role = 'READ_ONLY',
        "updatedAt" = NOW()
    `;
    
    console.log('✅ Usuario de solo lectura configurado:', readonlyEmail);
    
    // 4. Verificar los usuarios creados usando consulta SQL directa
    const users = await prisma.$queryRaw`
      SELECT email, name, role 
      FROM users 
      WHERE email IN (${adminEmail}, ${readonlyEmail})
    `;
    
    console.log('\nUsuarios configurados:');
    console.table(users);
    
  } catch (error) {
    console.error('❌ Error al configurar usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupUsers();
