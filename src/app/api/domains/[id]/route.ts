import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

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