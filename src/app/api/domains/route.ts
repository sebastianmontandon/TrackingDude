import { NextRequest, NextResponse } from 'next/server'
import { addDays } from 'date-fns'

// Importación dinámica de Prisma para evitar problemas en build
async function getPrisma() {
  const { prisma } = await import('@/lib/prisma')
  return prisma
}

export async function GET() {
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
    const prisma = await getPrisma()
    const body = await request.json()
    const { name, creationDate, website, paymentPeriod, baseCost, maintenanceFee, totalCost } = body

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
        expirationDate,
        baseCost,
        maintenanceFee,
        totalCost
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