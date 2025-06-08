'use client'

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { addDays, format } from 'date-fns';
import { useData } from './DataProvider';

export interface Domain {
  id: string;
  name: string;
  creationDate: string;
  website: string;
  paymentPeriod: string;
  expirationDate: string;
  baseCost: number;
  maintenanceFee: number;
  totalCost: number;
}

interface DomainContextType {
  domains: Domain[];
  addDomain: (domain: Omit<Domain, 'id' | 'expirationDate'>) => Promise<Domain>;
  removeDomain: (id: string) => Promise<void>;
  checkDomainAvailability: (name: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { domains: initialDomains, loading, isReadOnly } = useData();
  const [domains, setDomains] = useState<Domain[]>(initialDomains || []);
  const [error, setError] = useState<string | null>(null);

  // Sincronizar dominios cuando cambien en DataProvider
  useEffect(() => {
    setDomains(initialDomains || []);
  }, [initialDomains]);

  const fetchDomains = async () => {
    if (isReadOnly) return; // No hacer fetch si es de solo lectura
    
    try {
      const response = await fetch('/api/domains');
      if (!response.ok) {
        throw new Error('Error al cargar dominios');
      }
      const data = await response.json();
      setDomains(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching domains:', err);
      throw err;
    }
  };

  const addDomain = async (domainData: Omit<Domain, 'id' | 'expirationDate'>) => {
    if (isReadOnly) {
      // Si es de solo lectura, solo actualizar localmente para la sesión actual
      const newDomain = {
        ...domainData,
        id: `mock-${Date.now()}`,
        expirationDate: new Date().toISOString(),
      };
      setDomains(prev => [...prev, newDomain as Domain]);
      return newDomain;
    }

    try {
      const response = await fetch('/api/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(domainData),
      });

      if (!response.ok) {
        throw new Error('Error al crear dominio');
      }

      const newDomain = await response.json();
      setDomains(prev => [...prev, newDomain]);
      setError(null);
      return newDomain;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error adding domain:', err);
      throw err;
    }
  };

  const removeDomain = async (id: string) => {
    if (isReadOnly) {
      // Si es de solo lectura, solo actualizar localmente
      setDomains(prev => prev.filter(domain => domain.id !== id));
      return;
    }

    try {
      const response = await fetch(`/api/domains/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar dominio');
      }

      setDomains(prev => prev.filter(domain => domain.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error removing domain:', err);
      throw err;
    }
  };

  // Mock function to simulate API check for domain availability
  const checkDomainAvailability = async (name: string): Promise<boolean> => {
    // Para usuarios de solo lectura, verificar solo en los datos locales
    if (isReadOnly) {
      return !domains.some(domain => domain.name === name);
    }
    
    // Para administradores, verificar en el servidor
    try {
      const response = await fetch(`/api/domains/check?name=${encodeURIComponent(name)}`);
      if (!response.ok) {
        throw new Error('Error al verificar disponibilidad');
      }
      const { available } = await response.json();
      return available;
    } catch (err) {
      console.error('Error checking domain availability:', err);
      return false;
    }
  };

  return (
    <DomainContext.Provider value={{ 
      domains, 
      addDomain, 
      removeDomain, 
      checkDomainAvailability,
      loading,
      error
    }}>
      {children}
    </DomainContext.Provider>
  );
};

export const useDomainContext = (): DomainContextType => {
  const context = useContext(DomainContext);
  if (context === undefined) {
    throw new Error('useDomainContext must be used within a DomainProvider');
  }
  return context;
};