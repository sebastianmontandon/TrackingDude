'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useDomainContext } from './DomainContext';
import { useHostingContext } from './HostingContext';

export interface Notification {
  id: string;
  type: 'domain' | 'hosting';
  domain: string;
  provider: string;
  notificationDate: string;
  notificationMethod: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'domain',
    domain: 'example.com',
    provider: 'GoDaddy',
    notificationDate: '2024-03-15',
    notificationMethod: 'Email',
  },
  {
    id: '2',
    type: 'hosting',
    domain: 'mydomain.net',
    provider: 'HostGator',
    notificationDate: '2024-04-20',
    notificationMethod: 'SMS',
  },
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const { domains } = useDomainContext();
  const { hostings } = useHostingContext();

  const addNotification = (notificationData: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    const newNotification: Notification = {
      ...notificationData,
      id,
    };
    
    setNotifications(prevNotifications => [...prevNotifications, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
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