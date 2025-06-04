'use client'

import React from 'react';
import { Globe, Server, Bell, Home, X } from 'lucide-react';

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
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentPage, onClose }) => {
  return (
    <aside className="w-full h-full bg-card border-r border-border flex flex-col shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img src="/favicon.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">TrackingDude</h1>
              <p className="text-xs text-muted-foreground">Gestión de Dominios</p>
            </div>
          </div>
          
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
          <div className="mb-4 px-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
        <div className="text-xs text-muted-foreground text-center">
          © 2024 TrackingDude
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;