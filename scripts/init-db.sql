-- Eliminar tablas si existen
DROP TABLE IF EXISTS "notifications" CASCADE;
DROP TABLE IF EXISTS "hostings" CASCADE;
DROP TABLE IF EXISTS "domains" CASCADE;
DROP TABLE IF EXISTS "notification_configs" CASCADE;
DROP TABLE IF EXISTS "verificationtokens" CASCADE;
DROP TABLE IF EXISTS "accounts" CASCADE;
DROP TABLE IF EXISTS "sessions" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Crear enumeraciones
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'READ_ONLY');
CREATE TYPE "NotificationType" AS ENUM ('DOMAIN', 'HOSTING');
CREATE TYPE "NotificationMethod" AS ENUM ('EMAIL', 'WHATSAPP');

-- Crear tabla de usuarios
CREATE TABLE "users" (
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

-- Crear índices para usuarios
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Crear tabla de sesiones
CREATE TABLE "sessions" (
  "id" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "sessions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Crear índices para sesiones
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- Crear tabla de cuentas
CREATE TABLE "accounts" (
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

-- Crear índices para cuentas
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- Crear tabla de tokens de verificación
CREATE TABLE "verificationtokens" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "verificationtokens_pkey" PRIMARY KEY ("token"),
  CONSTRAINT "verificationtokens_identifier_token_key" UNIQUE ("identifier", "token")
);

-- Crear tabla de configuraciones de notificación
CREATE TABLE "notification_configs" (
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

-- Crear tabla de dominios
CREATE TABLE "domains" (
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

-- Crear índices para dominios
CREATE UNIQUE INDEX "domains_name_key" ON "domains"("name");

-- Crear tabla de hostings
CREATE TABLE "hostings" (
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

-- Crear tabla de notificaciones
CREATE TABLE "notifications" (
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

-- Insertar usuarios por defecto
INSERT INTO "users" ("id", "name", "email", "password", "role", "emailVerified", "createdAt", "updatedAt")
VALUES 
  ('user_2fY3nZvX5kL9mN1pQ', 'Administrador', 'sam171990@gmail.com', '$2a$12$X5kL9mN1pQ3rT7vY8w2z.9eBdFgHjKl', 'ADMIN', NOW(), NOW(), NOW()),
  ('user_7tG8hVbN2mK9jL0pZ', 'Usuario de Solo Lectura', 'lector@ejemplo.com', '$2a$12$2mK9jL0pZ5xR7tY8w2z.9eBdFgHjKl', 'READ_ONLY', NOW(), NOW(), NOW());

-- Nota: Las contraseñas son hasheadas con bcrypt. Deberás establecer las contraseñas correctamente después de la creación.
