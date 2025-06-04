'use server'

import { NextRequest, NextResponse } from 'next/server'

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar que tenemos un ID válido
    if (!params?.id) {
      return NextResponse.json(
        { error: 'ID de dominio requerido' },
        { status: 400 }
      )
    }

    const { id } = params
    const prisma = await getPrisma()

    await prisma.domain.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json({ message: 'Dominio eliminado correctamente' })
  } catch (error) {
    console.error('Error deleting domain:', error)
    return NextResponse.json(
      { error: 'Error al eliminar dominio' },
      { status: 500 }
    )
  }
}

// Añadir un manejador GET para evitar errores de método no permitido
export async function GET() {
  return NextResponse.json(
    { error: 'Método no permitido' },
    { status: 405 }
  )
} 