import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TrackingDude - Gestión de Dominios y Hosting',
  description: 'Panel de control para gestionar dominios, hosting y notificaciones',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <SessionProvider>
          <div className="h-full">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  )
} 