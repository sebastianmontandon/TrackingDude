import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addDays } from 'date-fns'

export async function GET() {
  try {
    const domains = await prisma.domain.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Formatear las fechas para que coincidan con el formato esperado por el frontend
    const formattedDomains = domains.map(domain => ({
      ...domain,
      creationDate: domain.creationDate.toISOString().split('T')[0],
      expirationDate: domain.expirationDate.toISOString().split('T')[0]
    }))

    return NextResponse.json(formattedDomains)
  } catch (error) {
    console.error('Error fetching domains:', error)
    return NextResponse.json(
      { error: 'Error al obtener dominios' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, creationDate, website, paymentPeriod } = body

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

    return NextResponse.json(formattedDomain, { status: 201 })
  } catch (error) {
    console.error('Error creating domain:', error)
    return NextResponse.json(
      { error: 'Error al crear dominio' },
      { status: 500 }
    )
  }
} 