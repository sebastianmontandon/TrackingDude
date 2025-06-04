'use client'

import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Dashboard from '../components/pages/Dashboard'
import Hosting from '../components/pages/Hosting'
import Notifications from '../components/pages/Notifications'
import { DomainProvider } from '../contexts/DomainContext'
import { HostingProvider } from '../contexts/HostingContext'
import { NotificationProvider } from '../contexts/NotificationContext'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'domains' | 'hosting' | 'notifications'>('domains');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page: 'domains' | 'hosting' | 'notifications') => {
    setCurrentPage(page);
    // Cerrar sidebar en móvil después de navegar
    setSidebarOpen(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'domains':
        return <Dashboard />;
      case 'hosting':
        return <Hosting />;
      case 'notifications':
        return <Notifications />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DomainProvider>
      <HostingProvider>
        <NotificationProvider>
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
              />
            </div>
            
            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Header móvil */}
              <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between flex-shrink-0">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-lg font-semibold text-foreground">TrackingDude</h1>
                <div className="w-10" /> {/* Spacer */}
              </div>
              
              {/* Content */}
              <main className="flex-1 overflow-y-auto bg-background">
                {renderCurrentPage()}
              </main>
            </div>
          </div>
        </NotificationProvider>
      </HostingProvider>
    </DomainProvider>
  )
} 