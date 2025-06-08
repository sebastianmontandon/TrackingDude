const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listUsers() {
  try {
    console.log('Listando usuarios de la base de datos...');
    
    // Usar consulta raw para obtener los usuarios
    const users = await prisma.$queryRaw`
      SELECT id, email, name, role, "createdAt", "updatedAt"
      FROM "users"
      ORDER BY email;
    `;
    
    console.log('\nUsuarios en la base de datos:');
    console.table(users);
    
    // Verificar usuarios específicos
    const adminUser = users.find(u => u.email === 'sam171990@gmail.com');
    const readonlyUser = users.find(u => u.email === 'lector@ejemplo.com');
    
    console.log('\nVerificación de usuarios:');
    console.log(`- Usuario administrador (sam171990@gmail.com): ${adminUser ? '✅ Existe' : '❌ No existe'}`);
    if (adminUser) {
      console.log(`  - ID: ${adminUser.id}`);
      console.log(`  - Rol: ${adminUser.role}`);
    }
    
    console.log(`\n- Usuario de solo lectura (lector@ejemplo.com): ${readonlyUser ? '✅ Existe' : '❌ No existe'}`);
    if (readonlyUser) {
      console.log(`  - ID: ${readonlyUser.id}`);
      console.log(`  - Rol: ${readonlyUser.role}`);
    }
    
  } catch (error) {
    console.error('Error al listar usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers()
  .then(() => {
    console.log('\nProceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error durante el proceso:', error);
    process.exit(1);
  });
