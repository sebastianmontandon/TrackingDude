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
    prisma.domain.create({
      data: {
        name: 'example.com',
        creationDate: new Date('2023-01-15'),
        website: 'https://example.com',
        paymentPeriod: '1 year',
        expirationDate: new Date('2024-01-15'),
      },
    }),
    prisma.domain.create({
      data: {
        name: 'mydomain.net',
        creationDate: new Date('2022-11-20'),
        website: 'https://mydomain.net',
        paymentPeriod: '2 years',
        expirationDate: new Date('2024-11-20'),
      },
    }),
    prisma.domain.create({
      data: {
        name: 'webproject.org',
        creationDate: new Date('2023-03-05'),
        website: 'https://webproject.org',
        paymentPeriod: '1 year',
        expirationDate: new Date('2024-03-05'),
      },
    }),
    prisma.domain.create({
      data: {
        name: 'designstudio.co',
        creationDate: new Date('2023-05-12'),
        website: 'https://designstudio.co',
        paymentPeriod: '3 years',
        expirationDate: new Date('2026-05-12'),
      },
    }),
    prisma.domain.create({
      data: {
        name: 'techblog.io',
        creationDate: new Date('2022-08-30'),
        website: 'https://techblog.io',
        paymentPeriod: '1 year',
        expirationDate: new Date('2023-08-30'),
      },
    }),
  ])

  console.log(`✅ Creados ${domains.length} dominios`)

  // Crear hostings
  const hostings = await Promise.all([
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
  ])

  console.log(`✅ Creados ${hostings.length} hostings`)

  // Crear notificaciones
  const notifications = await Promise.all([
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