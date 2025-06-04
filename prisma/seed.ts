import { PrismaClient, NotificationType, NotificationMethod } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seeding de la base de datos...')

  // Limpiar datos existentes
  await prisma.notification.deleteMany({})
  await prisma.hosting.deleteMany({})
  await prisma.domain.deleteMany({})

  // Crear dominios
  const domains = await Promise.all([
    // Primer set de dominios
    prisma.domain.create({
      data: {
        name: 'example.com',
        creationDate: new Date('2023-01-15'),
        website: 'https://example.com',
        paymentPeriod: '1 year',
        expirationDate: new Date('2024-01-15'),
        baseCost: 12.99,
        maintenanceFee: 2.60,
        totalCost: 15.59,
      },
    }),
    prisma.domain.create({
      data: {
        name: 'mydomain.net',
        creationDate: new Date('2022-11-20'),
        website: 'https://mydomain.net',
        paymentPeriod: '2 years',
        expirationDate: new Date('2024-11-20'),
        baseCost: 24.99,
        maintenanceFee: 5.00,
        totalCost: 29.99,
      },
    }),
    prisma.domain.create({
      data: {
        name: 'webproject.org',
        creationDate: new Date('2023-03-05'),
        website: 'https://webproject.org',
        paymentPeriod: '1 year',
        expirationDate: new Date('2024-03-05'),
        baseCost: 15.99,
        maintenanceFee: 3.20,
        totalCost: 19.19,
      },
    }),
    prisma.domain.create({
      data: {
        name: 'designstudio.co',
        creationDate: new Date('2023-05-12'),
        website: 'https://designstudio.co',
        paymentPeriod: '3 years',
        expirationDate: new Date('2026-05-12'),
        baseCost: 35.99,
        maintenanceFee: 7.20,
        totalCost: 43.19,
      },
    }),
    prisma.domain.create({
      data: {
        name: 'techblog.io',
        creationDate: new Date('2022-08-30'),
        website: 'https://techblog.io',
        paymentPeriod: '1 year',
        expirationDate: new Date('2023-08-30'),
        baseCost: 22.99,
        maintenanceFee: 4.60,
        totalCost: 27.59,
      },
    }),
    // Segundo set de dominios
    prisma.domain.create({
      data: {
        name: 'portfolio.dev',
        creationDate: new Date('2023-02-10'),
        website: 'https://namecheap.com',
        paymentPeriod: '1 year',
        expirationDate: new Date('2024-02-10'),
        baseCost: 18.88,
        maintenanceFee: 3.78,
        totalCost: 22.66,
      },
    }),
    prisma.domain.create({
      data: {
        name: 'shopify-store.com',
        creationDate: new Date('2023-04-18'),
        website: 'https://godaddy.com',
        paymentPeriod: '2 years',
        expirationDate: new Date('2025-04-18'),
        baseCost: 28.99,
        maintenanceFee: 5.80,
        totalCost: 34.79,
      },
    }),
    prisma.domain.create({
      data: {
        name: 'startup.ai',
        creationDate: new Date('2023-06-25'),
        website: 'https://hover.com',
        paymentPeriod: '1 year',
        expirationDate: new Date('2024-06-25'),
        baseCost: 45.00,
        maintenanceFee: 9.00,
        totalCost: 54.00,
      },
    }),
    prisma.domain.create({
      data: {
        name: 'consulting.biz',
        creationDate: new Date('2022-12-05'),
        website: 'https://domain.com',
        paymentPeriod: '3 years',
        expirationDate: new Date('2025-12-05'),
        baseCost: 40.50,
        maintenanceFee: 8.10,
        totalCost: 48.60,
      },
    }),
    prisma.domain.create({
      data: {
        name: 'newsletter.co',
        creationDate: new Date('2023-09-12'),
        website: 'https://porkbun.com',
        paymentPeriod: '1 year',
        expirationDate: new Date('2024-09-12'),
        baseCost: 16.99,
        maintenanceFee: 3.40,
        totalCost: 20.39,
      },
    }),
    // Tercer set de dominios
    prisma.domain.create({
      data: {
        name: 'restaurant.menu',
        creationDate: new Date('2023-07-08'),
        website: 'https://namecheap.com',
        paymentPeriod: '2 years',
        expirationDate: new Date('2025-07-08'),
        baseCost: 32.99,
        maintenanceFee: 6.60,
        totalCost: 39.59,
      },
    }),
    prisma.domain.create({
      data: {
        name: 'fitness-app.health',
        creationDate: new Date('2023-08-15'),
        website: 'https://gandi.net',
        paymentPeriod: '1 year',
        expirationDate: new Date('2024-08-15'),
        baseCost: 25.99,
        maintenanceFee: 5.20,
        totalCost: 31.19,
      },
    }),
    prisma.domain.create({
      data: {
        name: 'crypto-tracker.finance',
        creationDate: new Date('2022-10-22'),
        website: 'https://cloudflare.com',
        paymentPeriod: '3 years',
        expirationDate: new Date('2025-10-22'),
        baseCost: 55.00,
        maintenanceFee: 11.00,
        totalCost: 66.00,
      },
    }),
    prisma.domain.create({
      data: {
        name: 'travel-blog.world',
        creationDate: new Date('2023-11-03'),
        website: 'https://dynadot.com',
        paymentPeriod: '1 year',
        expirationDate: new Date('2024-11-03'),
        baseCost: 19.95,
        maintenanceFee: 3.99,
        totalCost: 23.94,
      },
    }),
    prisma.domain.create({
      data: {
        name: 'online-course.education',
        creationDate: new Date('2023-05-30'),
        website: 'https://enom.com',
        paymentPeriod: '2 years',
        expirationDate: new Date('2025-05-30'),
        baseCost: 48.99,
        maintenanceFee: 9.80,
        totalCost: 58.79,
      },
    }),
  ])

  console.log(`✅ Creados ${domains.length} dominios`)

  // Crear hostings (triplicados también)
  const hostings = await Promise.all([
    // Primer set de hostings
    prisma.hosting.create({
      data: {
        domain: 'example.com',
        provider: 'HostGator',
        paymentType: 'Annual',
        includesHosting: true,
        registrationDate: new Date('2023-01-15'),
        baseCost: 120,
        maintenanceFee: 24,
        totalCost: 144,
      },
    }),
    prisma.hosting.create({
      data: {
        domain: 'mydomain.net',
        provider: 'Bluehost',
        paymentType: 'Monthly',
        includesHosting: true,
        registrationDate: new Date('2023-06-20'),
        baseCost: 15,
        maintenanceFee: 3,
        totalCost: 18,
      },
    }),
    // Segundo set de hostings
    prisma.hosting.create({
      data: {
        domain: 'portfolio.dev',
        provider: 'SiteGround',
        paymentType: 'Annual',
        includesHosting: true,
        registrationDate: new Date('2023-02-10'),
        baseCost: 95.88,
        maintenanceFee: 19.18,
        totalCost: 115.06,
      },
    }),
    prisma.hosting.create({
      data: {
        domain: 'shopify-store.com',
        provider: 'A2 Hosting',
        paymentType: 'Biennial',
        includesHosting: true,
        registrationDate: new Date('2023-04-18'),
        baseCost: 180.00,
        maintenanceFee: 36.00,
        totalCost: 216.00,
      },
    }),
    // Tercer set de hostings
    prisma.hosting.create({
      data: {
        domain: 'restaurant.menu',
        provider: 'InMotion Hosting',
        paymentType: 'Monthly',
        includesHosting: true,
        registrationDate: new Date('2023-07-08'),
        baseCost: 12.99,
        maintenanceFee: 2.60,
        totalCost: 15.59,
      },
    }),
    prisma.hosting.create({
      data: {
        domain: 'fitness-app.health',
        provider: 'DreamHost',
        paymentType: 'Annual',
        includesHosting: true,
        registrationDate: new Date('2023-08-15'),
        baseCost: 83.40,
        maintenanceFee: 16.68,
        totalCost: 100.08,
      },
    }),
  ])

  console.log(`✅ Creados ${hostings.length} hostings`)

  // Crear notificaciones (triplicadas también)
  const notifications = await Promise.all([
    // Primer set de notificaciones
    prisma.notification.create({
      data: {
        type: NotificationType.DOMAIN,
        domain: 'example.com',
        provider: 'GoDaddy',
        notificationDate: new Date('2024-03-15'),
        notificationMethod: NotificationMethod.EMAIL,
      },
    }),
    prisma.notification.create({
      data: {
        type: NotificationType.HOSTING,
        domain: 'mydomain.net',
        provider: 'HostGator',
        notificationDate: new Date('2024-04-20'),
        notificationMethod: NotificationMethod.WHATSAPP,
      },
    }),
    // Segundo set de notificaciones
    prisma.notification.create({
      data: {
        type: NotificationType.DOMAIN,
        domain: 'portfolio.dev',
        provider: 'Namecheap',
        notificationDate: new Date('2024-05-10'),
        notificationMethod: NotificationMethod.EMAIL,
      },
    }),
    prisma.notification.create({
      data: {
        type: NotificationType.HOSTING,
        domain: 'shopify-store.com',
        provider: 'A2 Hosting',
        notificationDate: new Date('2024-06-18'),
        notificationMethod: NotificationMethod.WHATSAPP,
      },
    }),
    // Tercer set de notificaciones
    prisma.notification.create({
      data: {
        type: NotificationType.DOMAIN,
        domain: 'restaurant.menu',
        provider: 'Namecheap',
        notificationDate: new Date('2024-07-08'),
        notificationMethod: NotificationMethod.EMAIL,
      },
    }),
    prisma.notification.create({
      data: {
        type: NotificationType.HOSTING,
        domain: 'fitness-app.health',
        provider: 'DreamHost',
        notificationDate: new Date('2024-08-15'),
        notificationMethod: NotificationMethod.WHATSAPP,
      },
    }),
  ])

  console.log(`✅ Creadas ${notifications.length} notificaciones`)
  console.log('🎉 Seeding completado exitosamente!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error durante el seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  }) 