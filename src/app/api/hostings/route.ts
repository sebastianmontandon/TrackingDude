import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const hostings = await prisma.hosting.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Formatear las fechas para el frontend
    const formattedHostings = hostings.map(hosting => ({
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
    const body = await request.json()
    const { domain, provider, paymentType, includesHosting, registrationDate, baseCost } = body

    // Calcular las tarifas
    const maintenanceFee = baseCost * 0.2
    const totalCost = baseCost + maintenanceFee

    const hosting = await prisma.hosting.create({
      data: {
        domain,
        provider,
        paymentType,
        includesHosting,
        registrationDate: new Date(registrationDate),
        baseCost,
        maintenanceFee,
        totalCost
      }
    })

    // Formatear la fecha para el frontend
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