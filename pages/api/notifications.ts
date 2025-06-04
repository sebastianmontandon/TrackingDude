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
      const notifications = await prisma.notification.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Formatear las fechas para que coincidan con el formato esperado por el frontend
      const formattedNotifications = notifications.map((notification: any) => ({
        ...notification,
        notificationDate: notification.notificationDate.toISOString().split('T')[0]
      }))

      return res.status(200).json(formattedNotifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return res.status(500).json({ error: 'Error al obtener notificaciones' })
    }
  }

  if (req.method === 'POST') {
    try {
      const prisma = await getPrisma()
      const { type, domain, provider, notificationDate, notificationMethod } = req.body

      const notification = await prisma.notification.create({
        data: {
          type,
          domain,
          provider,
          notificationDate: new Date(notificationDate),
          notificationMethod
        }
      })

      // Formatear las fechas para el frontend
      const formattedNotification = {
        ...notification,
        notificationDate: notification.notificationDate.toISOString().split('T')[0]
      }

      return res.status(201).json(formattedNotification)
    } catch (error) {
      console.error('Error creating notification:', error)
      return res.status(500).json({ error: 'Error al crear notificación' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'ID de notificación requerido' })
      }

      const prisma = await getPrisma()

      await prisma.notification.delete({
        where: {
          id: id
        }
      })

      return res.status(200).json({ message: 'Notificación eliminada correctamente' })
    } catch (error) {
      console.error('Error deleting notification:', error)
      return res.status(500).json({ error: 'Error al eliminar notificación' })
    }
  }

  return res.status(405).json({ error: 'Método no permitido' })
} 