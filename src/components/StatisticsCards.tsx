'use client'

import React from 'react';
import { Globe, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { useDomainContext } from '../contexts/DomainContext';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, description }) => {
  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 group">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground">
            {value}
          </p>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        <div className={`p-4 rounded-full ${color} group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const StatisticsCards: React.FC = () => {
  const { domains } = useDomainContext();
  
  const totalDomains = domains.length;
  
  // Calcular estados basándose en fechas de expiración
  const today = new Date();
  
  const expiredDomains = domains.filter(domain => {
    const expiration = new Date(domain.expirationDate);
    return expiration < today;
  }).length;

  const expiringDomains = domains.filter(domain => {
    const expiration = new Date(domain.expirationDate);
    const daysRemaining = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 && daysRemaining <= 30;
  }).length;

  const activeDomains = totalDomains - expiredDomains - expiringDomains;
  
  return (
    <>
      <StatCard
        title="Total de Dominios"
        value={totalDomains}
        icon={<Globe className="w-6 h-6 text-white" />}
        color="bg-blue-500"
        description="Dominios registrados"
      />
      <StatCard
        title="Dominios Activos"
        value={activeDomains}
        icon={<CheckCircle className="w-6 h-6 text-white" />}
        color="bg-green-500"
        description="Funcionando correctamente"
      />
      <StatCard
        title="Por Vencer"
        value={expiringDomains}
        icon={<Calendar className="w-6 h-6 text-white" />}
        color="bg-yellow-500"
        description="Próximos a expirar"
      />
      <StatCard
        title="Vencidos"
        value={expiredDomains}
        icon={<AlertTriangle className="w-6 h-6 text-white" />}
        color="bg-red-500"
        description="Requieren renovación"
      />
    </>
  );
};

export default StatisticsCards;