'use client'

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useData } from './DataProvider';

export interface Notification {
  id: string;
  type: 'DOMAIN' | 'HOSTING';
  domain: string;
  provider: string;
  notificationDate: string;
  notificationMethod: 'EMAIL' | 'WHATSAPP';
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { notifications: initialNotifications, loading, isReadOnly } = useData();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications || []);
  const [error, setError] = useState<string | null>(null);

  // Sincronizar notificaciones cuando cambien en DataProvider
  useEffect(() => {
    setNotifications(initialNotifications || []);
  }, [initialNotifications]);

  const fetchNotifications = async () => {
    if (isReadOnly) return; // No hacer fetch si es de solo lectura
    
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) {
        throw new Error('Error al cargar notificaciones');
      }
      const data = await response.json();
      setNotifications(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching notifications:', err);
      throw err;
    }
  };

  const addNotification = async (notificationData: Omit<Notification, 'id'>) => {
    if (isReadOnly) {
      // Si es de solo lectura, solo actualizar localmente para la sesión actual
      const newNotification = {
        ...notificationData,
        id: `mock-${Date.now()}`,
      };
      setNotifications(prev => [...prev, newNotification as Notification]);
      return newNotification;
    }

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        throw new Error('Error al crear notificación');
      }

      const newNotification = await response.json();
      setNotifications(prev => [...prev, newNotification]);
      setError(null);
      return newNotification;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error adding notification:', err);
      throw err;
    }
  };

  const removeNotification = async (id: string) => {
    if (isReadOnly) {
      // Si es de solo lectura, solo actualizar localmente
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      return;
    }

    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar notificación');
      }

      setNotifications(prev => prev.filter(notification => notification.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error removing notification:', err);
      throw err;
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      removeNotification,
      loading,
      error
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};