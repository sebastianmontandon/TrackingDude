'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';

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
  addHosting: (hosting: Omit<Hosting, 'id' | 'maintenanceFee' | 'totalCost'>) => void;
  removeHosting: (id: string) => void;
}

const HostingContext = createContext<HostingContextType | undefined>(undefined);

const initialHostings: Hosting[] = [
  {
    id: '1',
    domain: 'example.com',
    provider: 'HostGator',
    paymentType: 'Annual',
    includesHosting: true,
    registrationDate: '2023-01-15',
    baseCost: 120,
    maintenanceFee: 24,
    totalCost: 144,
  },
  {
    id: '2',
    domain: 'mydomain.net',
    provider: 'Bluehost',
    paymentType: 'Monthly',
    includesHosting: true,
    registrationDate: '2023-06-20',
    baseCost: 15,
    maintenanceFee: 3,
    totalCost: 18,
  },
];

export const HostingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hostings, setHostings] = useState<Hosting[]>(initialHostings);

  const calculateFees = (baseCost: number) => {
    const maintenanceFee = baseCost * 0.2;
    const totalCost = baseCost + maintenanceFee;
    return { maintenanceFee, totalCost };
  };

  const addHosting = (hostingData: Omit<Hosting, 'id' | 'maintenanceFee' | 'totalCost'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const { maintenanceFee, totalCost } = calculateFees(hostingData.baseCost);
    
    const newHosting: Hosting = {
      ...hostingData,
      id,
      maintenanceFee,
      totalCost,
    };
    
    setHostings(prevHostings => [...prevHostings, newHosting]);
  };

  const removeHosting = (id: string) => {
    setHostings(prevHostings => prevHostings.filter(hosting => hosting.id !== id));
  };

  return (
    <HostingContext.Provider value={{ hostings, addHosting, removeHosting }}>
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