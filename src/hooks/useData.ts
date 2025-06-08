import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { mockDomains, mockHostings, mockNotifications, fetchMockData } from "@/mocks/mockData"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export function useData() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    domains: any[]
    hostings: any[]
    notifications: any[]
  }>({ domains: [], hostings: [], notifications: [] })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      try {
        if (session?.user.role === 'READ_ONLY') {
          // Usuario de solo lectura: usar datos mock
          const [domains, hostings, notifications] = await Promise.all([
            fetchMockData(mockDomains),
            fetchMockData(mockHostings),
            fetchMockData(mockNotifications)
          ])
          
          setData({ domains, hostings, notifications })
        } else {
          // Usuario administrador: obtener datos reales de la base de datos
          const [domains, hostings, notifications] = await Promise.all([
            prisma.domain.findMany(),
            prisma.hosting.findMany(),
            prisma.notification.findMany({
              orderBy: { notificationDate: 'desc' },
              take: 10
            })
          ])
          
          setData({ domains, hostings, notifications })
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchData()
    }
  }, [session])

  return {
    ...data,
    loading,
    isReadOnly: session?.user.role === 'READ_ONLY'
  }
}
