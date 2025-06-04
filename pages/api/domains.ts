import { NextApiRequest, NextApiResponse } from 'next'
import { addDays } from 'date-fns'

// Importación dinámica de Prisma para evitar problemas en build
async function getPrisma() {
  try {
    const { prisma } = await import('@/lib/prisma')
    return prisma
  } catch (error) {
    console.error('Error importing Prisma:', error)
    throw new Error('Database connection failed')
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const prisma = await getPrisma()
      const domains = await prisma.domain.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Formatear las fechas para que coincidan con el formato esperado por el frontend
      const formattedDomains = domains.map((domain: any) => ({
        ...domain,
        creationDate: domain.creationDate.toISOString().split('T')[0],
        expirationDate: domain.expirationDate.toISOString().split('T')[0]
      }))

      return res.status(200).json(formattedDomains)
    } catch (error) {
      console.error('Error fetching domains:', error)
      return res.status(500).json({ error: 'Error al obtener dominios' })
    }
  }

  if (req.method === 'POST') {
    try {
      const prisma = await getPrisma()
      const { name, creationDate, website, paymentPeriod } = req.body

      // Calcular la fecha de expiración basada en el período de pago
      let daysToAdd = 365 // Por defecto 1 año
      if (paymentPeriod.includes('2')) {
        daysToAdd = 730 // 2 años
      } else if (paymentPeriod.includes('3')) {
        daysToAdd = 1095 // 3 años
      }

      const expirationDate = addDays(new Date(creationDate), daysToAdd)

      const domain = await prisma.domain.create({
        data: {
          name,
          creationDate: new Date(creationDate),
          website,
          paymentPeriod,
          expirationDate
        }
      })

      // Formatear las fechas para el frontend
      const formattedDomain = {
        ...domain,
        creationDate: domain.creationDate.toISOString().split('T')[0],
        expirationDate: domain.expirationDate.toISOString().split('T')[0]
      }

      return res.status(201).json(formattedDomain)
    } catch (error) {
      console.error('Error creating domain:', error)
      return res.status(500).json({ error: 'Error al crear dominio' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'ID de dominio requerido' })
      }

      const prisma = await getPrisma()

      await prisma.domain.delete({
        where: {
          id: id
        }
      })

      return res.status(200).json({ message: 'Dominio eliminado correctamente' })
    } catch (error) {
      console.error('Error deleting domain:', error)
      return res.status(500).json({ error: 'Error al eliminar dominio' })
    }
  }

  return res.status(405).json({ error: 'Método no permitido' })
} 