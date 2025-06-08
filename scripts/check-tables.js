const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTables() {
  try {
    console.log('Verificando tablas en la base de datos...');
    
    // Obtener todas las tablas en la base de datos
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('\nTablas encontradas:');
    console.table(tables);
    
    // Verificar si las tablas principales existen
    const requiredTables = [
      'users', 'sessions', 'accounts', 'verificationtokens',
      'notification_configs', 'domains', 'hostings', 'notifications'
    ];
    
    console.log('\nEstado de las tablas requeridas:');
    
    for (const table of requiredTables) {
      const exists = tables.some(t => t.table_name === table);
      console.log(`- ${table}: ${exists ? '✅ Existe' : '❌ No existe'}`);
      
      if (exists) {
        try {
          const columns = await prisma.$queryRaw`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = ${table};
          `;
          
          console.log(`  Columnas en ${table}:`);
          console.table(columns);
        } catch (error) {
          console.error(`  Error al obtener columnas de ${table}:`, error.message);
        }
      }
    }
    
    // Verificar usuarios
    try {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true },
        orderBy: { email: 'asc' }
      });
      
      console.log('\nUsuarios en la base de datos:');
      console.table(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error.message);
    }
    
  } catch (error) {
    console.error('Error al verificar tablas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables()
  .then(() => {
    console.log('\nVerificación completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error durante la verificación:', error);
    process.exit(1);
  });
