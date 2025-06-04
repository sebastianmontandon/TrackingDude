import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

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