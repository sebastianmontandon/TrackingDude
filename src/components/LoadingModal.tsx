'use client'

import React from 'react';
import { Loader2, Database, Globe, Server, Bell } from 'lucide-react';

interface LoadingModalProps {
  isOpen: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full mx-4">
        {/* Loading Animation Container */}
        <div className="text-center">
          {/* Main loader */}
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
              <Database className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Cargando TrackingDude
          </h2>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Conectando con la base de datos y cargando tus datos...
          </p>

          {/* Loading Steps */}
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-gray-700 dark:text-gray-300">Cargando dominios</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <Server className="w-4 h-4 text-primary" />
              <span className="text-gray-700 dark:text-gray-300">Cargando servicios de hosting</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <Bell className="w-4 h-4 text-primary" />
              <span className="text-gray-700 dark:text-gray-300">Cargando notificaciones</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
          </div>

          {/* Footer text */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Esto solo tomará unos segundos...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal; 