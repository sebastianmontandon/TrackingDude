import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create test user
  const hashedPassword = await bcrypt.hash('123456', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@trackingdude.com' },
    update: {},
    create: {
      email: 'admin@trackingdude.com',
      name: 'Administrador',
      password: hashedPassword,
      phone: '+59899999999',
    },
  })

  console.log('Usuario creado:', user)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 