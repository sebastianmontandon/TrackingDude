import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NotificationType, NotificationMethod } from '@prisma/client'

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Formatear las fechas y enums para el frontend
    const formattedNotifications = notifications.map(notification => ({
      ...notification,
      type: notification.type.toLowerCase(),
      notificationMethod: notification.notificationMethod.toLowerCase(),
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
    const body = await request.json()
    const { type, domain, provider, notificationDate, notificationMethod } = body

    // Convertir los valores del frontend a los enums de la base de datos
    const dbType = type.toUpperCase() as NotificationType
    const dbMethod = notificationMethod.toUpperCase() as NotificationMethod

    const notification = await prisma.notification.create({
      data: {
        type: dbType,
        domain,
        provider,
        notificationDate: new Date(notificationDate),
        notificationMethod: dbMethod
      }
    })

    // Formatear para el frontend
    const formattedNotification = {
      ...notification,
      type: notification.type.toLowerCase(),
      notificationMethod: notification.notificationMethod.toLowerCase(),
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