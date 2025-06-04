import { NextRequest, NextResponse } from 'next/server'

// Importación dinámica de Prisma para evitar problemas en build
async function getPrisma() {
  const { prisma } = await import('@/lib/prisma')
  return prisma
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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