import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'lector@ejemplo.com'
  const password = 'Password123!'
  const hashedPassword = await bcrypt.hash(password, 12)

  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('El usuario de solo lectura ya existe')
      return
    }

    // Crear el usuario con el rol READ_ONLY
    await prisma.user.create({
      data: {
        email,
        name: 'Usuario de Solo Lectura',
        password: hashedPassword,
        emailVerified: new Date()
      }
    })

    console.log('Usuario de solo lectura creado exitosamente:')
    console.log(`Email: ${email}`)
    console.log(`Contraseña: ${password}`)
    console.log('\nIMPORTANTE: Cambia la contraseña después del primer inicio de sesión.')
  } catch (error) {
    console.error('Error al crear el usuario de solo lectura:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
