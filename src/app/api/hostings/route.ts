import { NextRequest, NextResponse } from 'next/server'

// Importación dinámica de Prisma para evitar problemas en build
async function getPrisma() {
  const { prisma } = await import('@/lib/prisma')
  return prisma
}

export async function GET() {
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

    return NextResponse.json(formattedHostings)
  } catch (error) {
    console.error('Error fetching hostings:', error)
    return NextResponse.json(
      { error: 'Error al obtener hostings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const prisma = await getPrisma()
    const body = await request.json()
    const { domain, provider, paymentType, includesHosting, registrationDate, baseCost } = body

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

    return NextResponse.json(formattedHosting, { status: 201 })
  } catch (error) {
    console.error('Error creating hosting:', error)
    return NextResponse.json(
      { error: 'Error al crear hosting' },
      { status: 500 }
    )
  }
} 