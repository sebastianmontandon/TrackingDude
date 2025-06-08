'use client'

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useData } from './DataProvider';

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
  const { hostings: initialHostings, loading, isReadOnly } = useData();
  const [hostings, setHostings] = useState<Hosting[]>(initialHostings || []);
  const [error, setError] = useState<string | null>(null);

  // Sincronizar hostings cuando cambien en DataProvider
  useEffect(() => {
    setHostings(initialHostings || []);
  }, [initialHostings]);

  const fetchHostings = async () => {
    if (isReadOnly) return; // No hacer fetch si es de solo lectura
    
    try {
      const response = await fetch('/api/hostings');
      if (!response.ok) {
        throw new Error('Error al cargar hostings');
      }
      const data = await response.json();
      setHostings(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching hostings:', err);
      throw err;
    }
  };

  const addHosting = async (hostingData: Omit<Hosting, 'id' | 'maintenanceFee' | 'totalCost'>) => {
    if (isReadOnly) {
      // Si es de solo lectura, solo actualizar localmente para la sesión actual
      const newHosting = {
        ...hostingData,
        id: `mock-${Date.now()}`,
        maintenanceFee: 0,
        totalCost: 0,
      };
      setHostings(prev => [...prev, newHosting as Hosting]);
      return newHosting;
    }

    try {
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
      setHostings(prev => [...prev, newHosting]);
      setError(null);
      return newHosting;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error adding hosting:', err);
      throw err;
    }
  };

  const removeHosting = async (id: string) => {
    if (isReadOnly) {
      // Si es de solo lectura, solo actualizar localmente
      setHostings(prev => prev.filter(hosting => hosting.id !== id));
      return;
    }

    try {
      const response = await fetch(`/api/hostings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar hosting');
      }

      setHostings(prev => prev.filter(hosting => hosting.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error removing hosting:', err);
      throw err;
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