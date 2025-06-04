'use client'

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { addDays, format } from 'date-fns';

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
  addDomain: (domain: Omit<Domain, 'id' | 'expirationDate'>) => Promise<void>;
  removeDomain: (id: string) => Promise<void>;
  checkDomainAvailability: (name: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar dominios al inicializar
  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/domains');
      if (!response.ok) {
        throw new Error('Error al cargar dominios');
      }
      const data = await response.json();
      setDomains(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching domains:', err);
    } finally {
      setLoading(false);
    }
  };

  const addDomain = async (domainData: Omit<Domain, 'id' | 'expirationDate'>) => {
    try {
      setLoading(true);
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
      setDomains(prevDomains => [...prevDomains, newDomain]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error adding domain:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeDomain = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/domains/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar dominio');
      }

      setDomains(prevDomains => prevDomains.filter(domain => domain.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error removing domain:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mock function to simulate API check for domain availability
  const checkDomainAvailability = async (name: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple simulation: Domains that exist in our list are unavailable
    const isDomainTaken = domains.some(domain => domain.name.toLowerCase() === name.toLowerCase());
    
    // Random availability for demo purposes - domains not in our list have a 70% chance of being available
    if (!isDomainTaken) {
      return Math.random() > 0.3;
    }
    
    return !isDomainTaken;
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