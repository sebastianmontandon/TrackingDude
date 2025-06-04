import { NextRequest, NextResponse } from 'next/server'

// Importación dinámica de Prisma para evitar problemas en build
async function getPrisma() {
  const { prisma } = await import('@/lib/prisma')
  return prisma
}

export async function GET() {
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

    return NextResponse.json(formattedNotifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Error al obtener notificaciones' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const prisma = await getPrisma()
    const body = await request.json()
    const { type, domain, provider, notificationDate, notificationMethod } = body

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

    return NextResponse.json(formattedNotification, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Error al crear notificación' },
      { status: 500 }
    )
  }
} 