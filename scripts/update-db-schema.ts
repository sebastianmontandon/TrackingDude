import { PrismaClient } from '@prisma/client';

// Extender el tipo User para incluir el campo role
type UserWithRole = {
  id: string;
  email: string;
  name: string | null;
  role?: string;
};

const prisma = new PrismaClient();

async function updateDatabaseSchema() {
  try {
    console.log('Actualizando esquema de la base de datos...');
    
    // Verificar si la columna 'role' ya existe
    const columnExists = await prisma.$queryRaw`
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'users' 
      AND column_name = 'role';
    `;

    if (Array.isArray(columnExists) && columnExists.length === 0) {
      console.log('Agregando columna role a la tabla users...');
      
      // Agregar la columna role con valor por defecto 'ADMIN'
      await prisma.$executeRaw`
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'ADMIN';
      `;
      
      // Agregar comentario a la columna
      await prisma.$executeRaw`
        COMMENT ON COLUMN users.role IS 'Rol del usuario: ADMIN o READ_ONLY';
      `;
      
      console.log('Columna role agregada exitosamente a la tabla users');
    } else {
      console.log('La columna role ya existe en la tabla users');
    }
    
    // Verificar si el usuario de solo lectura ya existe
        // Usar una consulta SQL directa para evitar problemas de tipos
    const users = await prisma.$queryRaw<Array<{ id: string; email: string; name: string | null; role: string | null }>>`
      SELECT id, email, name, role
      FROM users
      WHERE email = 'lector@ejemplo.com';
    `;
    
    const readonlyUser = users[0] || null;
    
    if (!readonlyUser) {
      console.log('\nNo se encontró el usuario de solo lectura.');
      console.log('Puedes crearlo ejecutando: npm run create:readonly-user');
    } else {
      console.log('\nUsuario de solo lectura encontrado:');
      console.log(`- Email: ${readonlyUser.email}`);
      console.log(`- Rol: ${readonlyUser.role || 'No definido'}`);
      
      // Actualizar el rol si es necesario
      if (readonlyUser.role !== 'READ_ONLY') {
        console.log('\nActualizando el rol a READ_ONLY...');
        await prisma.$executeRaw`
          UPDATE users
          SET role = 'READ_ONLY'
          WHERE id = ${readonlyUser.id};
        `;
        console.log('Rol actualizado exitosamente a READ_ONLY');
      }
    }
    
  } catch (error) {
    console.error('Error al actualizar el esquema de la base de datos:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateDatabaseSchema();
