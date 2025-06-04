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

    await prisma.hosting.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json({ message: 'Hosting eliminado correctamente' })
  } catch (error) {
    console.error('Error deleting hosting:', error)
    return NextResponse.json(
      { error: 'Error al eliminar hosting' },
      { status: 500 }
    )
  }
} 