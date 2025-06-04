'use client'

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar notificaciones al inicializar
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications');
      if (!response.ok) {
        throw new Error('Error al cargar notificaciones');
      }
      const data = await response.json();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = async (notificationData: Omit<Notification, 'id'>) => {
    try {
      setLoading(true);
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
      setNotifications(prevNotifications => [...prevNotifications, newNotification]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error adding notification:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeNotification = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar notificación');
      }

      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== id)
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error removing notification:', err);
      throw err;
    } finally {
      setLoading(false);
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