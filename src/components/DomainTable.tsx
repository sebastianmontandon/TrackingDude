'use client'

import React, { useState } from 'react';
import { Trash2, ArrowUpDown, Info, AlertCircle, ExternalLink, Globe } from 'lucide-react';
import { useDomainContext, Domain } from '../contexts/DomainContext';

const DomainTable: React.FC = () => {
  const { domains, removeDomain } = useDomainContext();
  const [sortField, setSortField] = useState<keyof Domain>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Domain) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedDomains = () => {
    return [...domains].sort((a, b) => {
      let comparison = 0;
      
      if (a[sortField] < b[sortField]) {
        comparison = -1;
      } else if (a[sortField] > b[sortField]) {
        comparison = 1;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const getExpirationStatus = (expirationDate: string) => {
    const today = new Date();
    const expiration = new Date(expirationDate);
    const daysRemaining = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 0) {
      return { status: 'expired', color: 'text-red-500', bgColor: 'bg-red-500' };
    } else if (daysRemaining < 30) {
      return { status: 'expiring soon', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
    } else {
      return { status: 'active', color: 'text-green-500', bgColor: 'bg-green-500' };
    }
  };

  const sortedDomains = getSortedDomains();

  return (
    <div className="form-section">
      <div className="table-container">
        <table className="table-responsive">
          <thead className="table-header">
            <tr>
              <th 
                scope="col" 
                className="table-header-cell"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline">Nombre</span>
                  <span className="sm:hidden">Dom.</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th 
                scope="col" 
                className="table-header-cell hidden md:table-cell"
                onClick={() => handleSort('creationDate')}
              >
                <div className="flex items-center gap-2">
                  Fecha de creación
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th 
                scope="col" 
                className="table-header-cell hidden lg:table-cell"
                onClick={() => handleSort('website')}
              >
                <div className="flex items-center gap-2">
                  Sitio web
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th 
                scope="col" 
                className="table-header-cell hidden sm:table-cell"
                onClick={() => handleSort('paymentPeriod')}
              >
                <div className="flex items-center gap-2">
                  Período
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th 
                scope="col" 
                className="table-header-cell"
                onClick={() => handleSort('expirationDate')}
              >
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline">Vencimiento</span>
                  <span className="sm:hidden">Venc.</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th scope="col" className="table-header-cell">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="table-body">
            {sortedDomains.map((domain) => {
              const expirationStatus = getExpirationStatus(domain.expirationDate);
              
              return (
                <tr key={domain.id} className="table-row">
                  <td className="table-cell">
                    <div className="min-w-0">
                      <div className="table-cell-text-primary truncate">{domain.name}</div>
                      <div className="md:hidden table-cell-text-secondary text-xs mt-1">
                        {domain.creationDate}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell hidden md:table-cell">
                    <div className="table-cell-text-secondary">{domain.creationDate}</div>
                  </td>
                  <td className="table-cell hidden lg:table-cell">
                    <a 
                      href={domain.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="table-cell-text text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 max-w-[200px] truncate"
                    >
                      <span className="truncate">{domain.website}</span>
                      <ExternalLink size={12} className="flex-shrink-0" />
                    </a>
                  </td>
                  <td className="table-cell hidden sm:table-cell">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {domain.paymentPeriod}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${expirationStatus.bgColor}`}></span>
                      <div className="min-w-0">
                        <span className={`table-cell-text ${expirationStatus.color} font-medium block truncate`}>
                          {domain.expirationDate}
                        </span>
                        <div className="sm:hidden table-cell-text-secondary text-xs mt-1">
                          {domain.paymentPeriod}
                        </div>
                      </div>
                      {expirationStatus.status !== 'active' && (
                        <span className="flex-shrink-0">
                          {expirationStatus.status === 'expired' ? 
                            <AlertCircle size={16} className="text-red-500" /> : 
                            <Info size={16} className="text-yellow-500" />
                          }
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="table-cell text-right">
                    <button
                      onClick={() => removeDomain(domain.id)}
                      className="text-red-500 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-red-900"
                      title="Eliminar dominio"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {domains.length === 0 && (
              <tr>
                <td colSpan={6} className="table-cell text-center text-muted-foreground py-8">
                  <div className="flex flex-col items-center space-y-2">
                    <Globe className="w-8 h-8 text-muted-foreground/50" />
                    <span>No hay dominios registrados</span>
                    <span className="text-xs">¡Agrega tu primer dominio arriba!</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DomainTable;