'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { addDays, format } from 'date-fns';

export interface Domain {
  id: string;
  name: string;
  creationDate: string;
  website: string;
  paymentPeriod: string;
  expirationDate: string;
}

interface DomainContextType {
  domains: Domain[];
  addDomain: (domain: Omit<Domain, 'id' | 'expirationDate'>) => void;
  removeDomain: (id: string) => void;
  checkDomainAvailability: (name: string) => Promise<boolean>;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

const initialDomains: Domain[] = [
  {
    id: '1',
    name: 'example.com',
    creationDate: '2023-01-15',
    website: 'https://example.com',
    paymentPeriod: '1 year',
    expirationDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'mydomain.net',
    creationDate: '2022-11-20',
    website: 'https://mydomain.net',
    paymentPeriod: '2 years',
    expirationDate: '2024-11-20',
  },
  {
    id: '3',
    name: 'webproject.org',
    creationDate: '2023-03-05',
    website: 'https://webproject.org',
    paymentPeriod: '1 year',
    expirationDate: '2024-03-05',
  },
  {
    id: '4',
    name: 'designstudio.co',
    creationDate: '2023-05-12',
    website: 'https://designstudio.co',
    paymentPeriod: '3 years',
    expirationDate: '2026-05-12',
  },
  {
    id: '5',
    name: 'techblog.io',
    creationDate: '2022-08-30',
    website: 'https://techblog.io',
    paymentPeriod: '1 year',
    expirationDate: '2023-08-30',
  }
];

export const DomainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [domains, setDomains] = useState<Domain[]>(initialDomains);

  const addDomain = (domainData: Omit<Domain, 'id' | 'expirationDate'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Calculate expiration date based on payment period
    let daysToAdd = 365; // Default to 1 year
    if (domainData.paymentPeriod.includes('2')) {
      daysToAdd = 730; // 2 years
    } else if (domainData.paymentPeriod.includes('3')) {
      daysToAdd = 1095; // 3 years
    }
    
    const expirationDate = format(
      addDays(new Date(domainData.creationDate), daysToAdd),
      'yyyy-MM-dd'
    );
    
    const newDomain: Domain = {
      ...domainData,
      id,
      expirationDate,
    };
    
    setDomains(prevDomains => [...prevDomains, newDomain]);
  };

  const removeDomain = (id: string) => {
    setDomains(prevDomains => prevDomains.filter(domain => domain.id !== id));
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
    <DomainContext.Provider value={{ domains, addDomain, removeDomain, checkDomainAvailability }}>
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