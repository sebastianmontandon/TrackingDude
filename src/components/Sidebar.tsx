'use client'

import React from 'react';
import { Globe, Server, Bell, Home, X, LogOut, Lock } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick }) => {
  return (
    <li>
      <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
          active 
            ? 'bg-primary text-primary-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        }`}
      >
        <span className="text-lg">{icon}</span>
        <span className="font-medium">{label}</span>
      </button>
    </li>
  );
};

interface SidebarProps {
  onNavigate: (page: 'dashboard' | 'domains' | 'hosting' | 'notifications') => void;
  currentPage: 'dashboard' | 'domains' | 'hosting' | 'notifications';
  onClose?: () => void;
  onSignOut?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentPage, onClose, onSignOut }) => {
  const { data: session } = useSession();
  const isReadOnly = session?.user?.role === 'READ_ONLY';
  return (
    <aside className="w-full h-full bg-card border-r border-border flex flex-col shadow-sm">
      <div>
        <div className="flex items-center justify-between">
          
          {/* Botón cerrar en móvil */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 px-3 py-2">
        <nav>
        <div className="bg-card border-b border-border flex items-center justify-between px-6 py-3">
       <div className="flex items-center gap-2">
         <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
           <img src="/favicon.png" alt="Logo" className="w-10 h-10" />
         </div>
         <div>
           <h1 className="text-sm font-semibold text-foreground">TrackingDude</h1>
           <p className="text-xs text-muted-foreground">Gestión de Dominios</p>
         </div>
       </div>
     </div>
          <div className="mb-4 px-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-9">
              Menú Principal
            </p>
          </div>
          <ul className="space-y-1">
            <NavItem 
              icon={<Home size={18} />} 
              label="Dashboard" 
              active={currentPage === 'dashboard'}
              onClick={() => onNavigate('dashboard')}
            />
            <NavItem 
              icon={<Globe size={18} />} 
              label="Dominios" 
              active={currentPage === 'domains'}
              onClick={() => onNavigate('domains')}
            />
            <NavItem 
              icon={<Server size={18} />} 
              label="Hosting" 
              active={currentPage === 'hosting'}
              onClick={() => onNavigate('hosting')}
            />
            <NavItem 
              icon={<Bell size={18} />} 
              label="Notificaciones" 
              active={currentPage === 'notifications'}
              onClick={() => onNavigate('notifications')}
            />
          </ul>
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        {onSignOut && (
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-900/40 transition-colors"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        )}
        {isReadOnly && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md mb-3">
            <div className="flex items-start">
              <Lock className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-xs text-yellow-700">
                Modo de solo lectura. Los cambios no se guardarán permanentemente.
              </p>
            </div>
          </div>
        )}
        <div className="text-xs text-muted-foreground text-center mt-2">
          2025 TrackingDude
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;