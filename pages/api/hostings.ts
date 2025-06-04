import { NextApiRequest, NextApiResponse } from 'next'

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
      const hostings = await prisma.hosting.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Formatear las fechas para que coincidan con el formato esperado por el frontend
      const formattedHostings = hostings.map((hosting: any) => ({
        ...hosting,
        registrationDate: hosting.registrationDate.toISOString().split('T')[0]
      }))

      return res.status(200).json(formattedHostings)
    } catch (error) {
      console.error('Error fetching hostings:', error)
      return res.status(500).json({ error: 'Error al obtener hostings' })
    }
  }

  if (req.method === 'POST') {
    try {
      const prisma = await getPrisma()
      const { domain, provider, paymentType, includesHosting, registrationDate, baseCost } = req.body

      // Calcular tarifas automáticamente
      const maintenanceFee = baseCost * 0.2 // 20% de tarifa de mantenimiento
      const totalCost = baseCost + maintenanceFee

      const hosting = await prisma.hosting.create({
        data: {
          domain,
          provider,
          paymentType,
          includesHosting,
          registrationDate: new Date(registrationDate),
          baseCost: parseFloat(baseCost),
          maintenanceFee,
          totalCost
        }
      })

      // Formatear las fechas para el frontend
      const formattedHosting = {
        ...hosting,
        registrationDate: hosting.registrationDate.toISOString().split('T')[0]
      }

      return res.status(201).json(formattedHosting)
    } catch (error) {
      console.error('Error creating hosting:', error)
      return res.status(500).json({ error: 'Error al crear hosting' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'ID de hosting requerido' })
      }

      const prisma = await getPrisma()

      await prisma.hosting.delete({
        where: {
          id: id
        }
      })

      return res.status(200).json({ message: 'Hosting eliminado correctamente' })
    } catch (error) {
      console.error('Error deleting hosting:', error)
      return res.status(500).json({ error: 'Error al eliminar hosting' })
    }
  }

  return res.status(405).json({ error: 'Método no permitido' })
} 