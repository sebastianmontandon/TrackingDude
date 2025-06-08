'use client'

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { mockDomains, mockHostings, mockNotifications, fetchMockData } from '@/mocks/mockData';

interface DataProviderProps {
  children: ReactNode;
}

const DataContext = createContext<{
  domains: any[];
  hostings: any[];
  notifications: any[];
  loading: boolean;
  isReadOnly: boolean;
}>({
  domains: [],
  hostings: [],
  notifications: [],
  loading: true,
  isReadOnly: false,
});

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { data: session } = useSession();
  const [domains, setDomains] = useState<any[]>([]);
  const [hostings, setHostings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isReadOnly = session?.user.role === 'READ_ONLY';

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        if (isReadOnly) {
          // Usar datos mock para usuarios de solo lectura
          const [mockDomainsData, mockHostingsData, mockNotificationsData] = await Promise.all([
            fetchMockData(mockDomains),
            fetchMockData(mockHostings),
            fetchMockData(mockNotifications)
          ]);
          
          setDomains(mockDomainsData);
          setHostings(mockHostingsData);
          setNotifications(mockNotificationsData);
        } else {
          // Obtener datos reales de la API para usuarios administradores
          const [domainsRes, hostingsRes, notificationsRes] = await Promise.all([
            fetch('/api/domains'),
            fetch('/api/hostings'),
            fetch('/api/notifications')
          ]);
          
          const [domainsData, hostingsData, notificationsData] = await Promise.all([
            domainsRes.json(),
            hostingsRes.json(),
            notificationsRes.json()
          ]);
          
          setDomains(domainsData);
          setHostings(hostingsData);
          setNotifications(notificationsData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isReadOnly]);

  return (
    <DataContext.Provider value={{
      domains,
      hostings,
      notifications,
      loading,
      isReadOnly,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
