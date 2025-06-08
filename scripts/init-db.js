const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Inicializando la base de datos...');
  
  try {
    // 1. Crear tablas si no existen
    await prisma.$executeRaw`
      -- Crear enumeraciones si no existen
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
          CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'READ_ONLY');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NotificationType') THEN
          CREATE TYPE "NotificationType" AS ENUM ('DOMAIN', 'HOSTING');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NotificationMethod') THEN
          CREATE TYPE "NotificationMethod" AS ENUM ('EMAIL', 'WHATSAPP');
        END IF;
      END $$;
    `;

    // 2. Crear tablas con el orden correcto de dependencias
    await prisma.$executeRaw`
      -- Tabla de usuarios
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL,
        "name" TEXT,
        "email" TEXT NOT NULL,
        "password" TEXT,
        "emailVerified" TIMESTAMP(3),
        "image" TEXT,
        "phone" TEXT,
        "role" "UserRole" NOT NULL DEFAULT 'USER',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      );
      
      -- Índices para usuarios
      CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
      
      -- Tabla de sesiones
      CREATE TABLE IF NOT EXISTS "sessions" (
        "id" TEXT NOT NULL,
        "sessionToken" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "sessions_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      
      -- Índices para sesiones
      CREATE UNIQUE INDEX IF NOT EXISTS "sessions_sessionToken_key" ON "sessions"("sessionToken");
      
      -- Tabla de cuentas
      CREATE TABLE IF NOT EXISTS "accounts" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        CONSTRAINT "accounts_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      
      -- Índices para cuentas
      CREATE UNIQUE INDEX IF NOT EXISTS "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");
      
      -- Tabla de tokens de verificación
      CREATE TABLE IF NOT EXISTS "verificationtokens" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "verificationtokens_pkey" PRIMARY KEY ("token"),
        CONSTRAINT "verificationtokens_identifier_token_key" UNIQUE ("identifier", "token")
      );
      
      -- Tabla de configuraciones de notificación
      CREATE TABLE IF NOT EXISTS "notification_configs" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "emailConfig" JSONB,
        "whatsappConfig" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "notification_configs_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "notification_configs_userId_key" UNIQUE ("userId"),
        CONSTRAINT "notification_configs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      
      -- Tabla de dominios
      CREATE TABLE IF NOT EXISTS "domains" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "creationDate" TIMESTAMP(3) NOT NULL,
        "website" TEXT NOT NULL,
        "paymentPeriod" TEXT NOT NULL,
        "expirationDate" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "baseCost" DOUBLE PRECISION NOT NULL,
        "maintenanceFee" DOUBLE PRECISION NOT NULL,
        "totalCost" DOUBLE PRECISION NOT NULL,
        CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
      );
      
      -- Índices para dominios
      CREATE UNIQUE INDEX IF NOT EXISTS "domains_name_key" ON "domains"("name");
      
      -- Tabla de hostings
      CREATE TABLE IF NOT EXISTS "hostings" (
        "id" TEXT NOT NULL,
        "domain" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "paymentType" TEXT NOT NULL,
        "includesHosting" BOOLEAN NOT NULL,
        "registrationDate" TIMESTAMP(3) NOT NULL,
        "baseCost" DOUBLE PRECISION NOT NULL,
        "maintenanceFee" DOUBLE PRECISION NOT NULL,
        "totalCost" DOUBLE PRECISION NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "hostings_pkey" PRIMARY KEY ("id")
      );
      
      -- Tabla de notificaciones
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" TEXT NOT NULL,
        "type" "NotificationType" NOT NULL,
        "domain" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "notificationDate" TIMESTAMP(3) NOT NULL,
        "notificationMethod" "NotificationMethod" NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "sent" BOOLEAN NOT NULL DEFAULT false,
        "sentAt" TIMESTAMP(3),
        CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
      );
    `;
    
    console.log('✅ Tablas creadas correctamente');
    
    // 3. Crear usuarios por defecto si no existen
    const adminPassword = await hash('jere@070411', 12);
    const readonlyPassword = await hash('lector123', 12);
    
    await prisma.$executeRaw`
      -- Insertar usuario administrador si no existe
      INSERT INTO "users" ("id", "name", "email", "password", "role", "emailVerified", "createdAt", "updatedAt")
      VALUES (
        'user_2fY3nZvX5kL9mN1pQ',
        'Administrador',
        'sam171990@gmail.com',
        ${adminPassword},
        'ADMIN'::"UserRole",
        NOW(),
        NOW(),
        NOW()
      )
      ON CONFLICT ("email") DO UPDATE SET
        "name" = EXCLUDED."name",
        "password" = EXCLUDED."password",
        "role" = EXCLUDED."role",
        "updatedAt" = NOW();
      
      -- Insertar usuario de solo lectura si no existe
      INSERT INTO "users" ("id", "name", "email", "password", "role", "emailVerified", "createdAt", "updatedAt")
      VALUES (
        'user_7tG8hVbN2mK9jL0pZ',
        'Usuario de Solo Lectura',
        'lector@ejemplo.com',
        ${readonlyPassword},
        'READ_ONLY'::"UserRole",
        NOW(),
        NOW(),
        NOW()
      )
      ON CONFLICT ("email") DO UPDATE SET
        "name" = EXCLUDED."name",
        "password" = EXCLUDED."password",
        "role" = EXCLUDED."role",
        "updatedAt" = NOW();
    `;
    
    console.log('✅ Usuarios por defecto creados correctamente');
    
    // 4. Verificar las tablas creadas
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    console.log('\nTablas en la base de datos:');
    console.table(tables);
    
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\n✅ Base de datos inicializada correctamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error durante la inicialización:', error);
    process.exit(1);
  });
