'use client'

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export interface Hosting {
  id: string;
  domain: string;
  provider: string;
  paymentType: string;
  includesHosting: boolean;
  registrationDate: string;
  baseCost: number;
  maintenanceFee: number;
  totalCost: number;
}

interface HostingContextType {
  hostings: Hosting[];
  addHosting: (hosting: Omit<Hosting, 'id' | 'maintenanceFee' | 'totalCost'>) => Promise<void>;
  removeHosting: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const HostingContext = createContext<HostingContextType | undefined>(undefined);

export const HostingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hostings, setHostings] = useState<Hosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar hostings al inicializar
  useEffect(() => {
    fetchHostings();
  }, []);

  const fetchHostings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hostings');
      if (!response.ok) {
        throw new Error('Error al cargar hostings');
      }
      const data = await response.json();
      setHostings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching hostings:', err);
    } finally {
      setLoading(false);
    }
  };

  const addHosting = async (hostingData: Omit<Hosting, 'id' | 'maintenanceFee' | 'totalCost'>) => {
    try {
      setLoading(true);
      const response = await fetch('/api/hostings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hostingData),
      });

      if (!response.ok) {
        throw new Error('Error al crear hosting');
      }

      const newHosting = await response.json();
      setHostings(prevHostings => [...prevHostings, newHosting]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error adding hosting:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeHosting = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hostings?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar hosting');
      }

      setHostings(prevHostings => prevHostings.filter(hosting => hosting.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error removing hosting:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <HostingContext.Provider value={{ 
      hostings, 
      addHosting, 
      removeHosting,
      loading,
      error
    }}>
      {children}
    </HostingContext.Provider>
  );
};

export const useHostingContext = (): HostingContextType => {
  const context = useContext(HostingContext);
  if (context === undefined) {
    throw new Error('useHostingContext must be used within a HostingProvider');
  }
  return context;
};