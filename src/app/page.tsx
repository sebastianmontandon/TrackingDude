'use client'

import React, { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Sidebar from '../components/Sidebar'
import NewDashboard from '../components/pages/NewDashboard'
import Dashboard from '../components/pages/Dashboard'
import Hosting from '../components/pages/Hosting'
import Notifications from '../components/pages/Notifications'
import LoadingModal from '../components/LoadingModal'
import { DomainProvider, useDomainContext } from '../contexts/DomainContext'
import { HostingProvider, useHostingContext } from '../contexts/HostingContext'
import { NotificationProvider, useNotificationContext } from '../contexts/NotificationContext'
import { LogOut, User } from 'lucide-react'

// Componente interno que tiene acceso a los contextos
const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'domains' | 'hosting' | 'notifications'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Estados de loading de todos los contextos
  const { loading: domainsLoading } = useDomainContext();
  const { loading: hostingsLoading } = useHostingContext();
  const { loading: notificationsLoading } = useNotificationContext();
  
  // Mostrar loading si alguno de los contextos está cargando
  const isLoading = domainsLoading || hostingsLoading || notificationsLoading;

  const handleNavigate = (page: 'dashboard' | 'domains' | 'hosting' | 'notifications') => {
    setCurrentPage(page);
    // Cerrar sidebar en móvil después de navegar
    setSidebarOpen(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <NewDashboard />;
      case 'domains':
        return <Dashboard />;
      case 'hosting':
        return <Hosting />;
      case 'notifications':
        return <Notifications />;
      default:
        return <NewDashboard />;
    }
  };

  return (
    <>
      {/* Loading Modal */}
      <LoadingModal isOpen={isLoading} />
      
      <div className="flex h-screen bg-background">
        {/* Overlay para móvil */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:transition-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar 
            onNavigate={handleNavigate} 
            currentPage={currentPage}
            onClose={() => setSidebarOpen(false)}
            onSignOut={() => signOut()}
          />
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header móvil */}
          <div className="lg:hidden bg-card border-b border-border p-3 flex items-center justify-between flex-shrink-0">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <img src="/favicon.png" alt="Logo" className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">TrackingDude</h1>
          </div>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>
          
          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-background">
            {renderCurrentPage()}
          </main>
        </div>
      </div>
    </>
  );
};

// Header component with user info
// const UserHeader: React.FC = () => {
//   return (
//     <div className="bg-card border-b border-border flex items-center justify-between px-6 py-3">
//       <div className="flex items-center gap-2">
//         <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
//           <img src="/favicon.png" alt="Logo" className="w-5 h-5" />
//         </div>
//         <div>
//           <h1 className="text-sm font-semibold text-foreground">TrackingDude</h1>
//           <p className="text-xs text-muted-foreground">Gestión de Dominios</p>
//         </div>
//       </div>
//     </div>
//   );
// };

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full">
      {/* <UserHeader/> */}
      <DomainProvider>
        <HostingProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </HostingProvider>
      </DomainProvider>
    </div>
  )
} 