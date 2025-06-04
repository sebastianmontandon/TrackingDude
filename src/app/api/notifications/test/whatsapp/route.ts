import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { sendTestWhatsApp } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { phone } = await request.json()
    
    if (!phone) {
      return NextResponse.json(
        { error: 'Número de teléfono es requerido' },
        { status: 400 }
      )
    }

    const result = await sendTestWhatsApp(phone)
    
    return NextResponse.json({
      message: 'Mensaje de WhatsApp de prueba enviado exitosamente',
      messageId: result.messageId
    })
  } catch (error: any) {
    console.error('Error sending test WhatsApp:', error)
    return NextResponse.json(
      { error: error.message || 'Error enviando mensaje de WhatsApp de prueba' },
      { status: 500 }
    )
  }
} 