'use client'

import React, { useState } from 'react';
import { Trash2, ArrowUpDown, CheckCircle, XCircle, DollarSign, Server } from 'lucide-react';
import { useHostingContext, Hosting } from '../contexts/HostingContext';
import ConfirmDialog from './ConfirmDialog';

const HostingTable: React.FC = () => {
  const { hostings, removeHosting } = useHostingContext();
  const [sortField, setSortField] = useState<keyof Hosting>('domain');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    hostingId: string;
    hostingDomain: string;
  }>({
    isOpen: false,
    hostingId: '',
    hostingDomain: ''
  });

  const handleSort = (field: keyof Hosting) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedHostings = () => {
    return [...hostings].sort((a, b) => {
      let comparison = 0;
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPaymentTypeColor = (paymentType: string) => {
    switch (paymentType) {
      case 'Monthly': return 'bg-blue-500';
      case 'Annual': return 'bg-green-500';
      case 'Biennial': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentTypeLabel = (paymentType: string) => {
    switch (paymentType) {
      case 'Monthly': return 'Mensual';
      case 'Annual': return 'Anual';
      case 'Biennial': return 'Bienal';
      default: return paymentType;
    }
  };

  const handleDeleteClick = (hostingId: string, hostingDomain: string) => {
    setDeleteDialog({
      isOpen: true,
      hostingId,
      hostingDomain
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await removeHosting(deleteDialog.hostingId);
    } catch (error) {
      console.error('Error eliminando hosting:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({
      isOpen: false,
      hostingId: '',
      hostingDomain: ''
    });
  };

  const sortedHostings = getSortedHostings();

  return (
    <>
      <div className="form-section hosting-table">
        <div className="table-container">
          <table className="table-responsive">
            <thead className="table-header">
              <tr>
                <th 
                  scope="col" 
                  className="table-header-cell col-domain"
                  onClick={() => handleSort('domain')}
                >
                  <div className="flex items-center gap-1">
                    <span className="hidden sm:inline">Dominio</span>
                    <span className="sm:hidden">Dom.</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="table-header-cell col-provider hidden md:table-cell"
                  onClick={() => handleSort('provider')}
                >
                  <div className="flex items-center gap-1">
                    <span>Proveedor</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="table-header-cell col-payment hidden lg:table-cell"
                  onClick={() => handleSort('paymentType')}
                >
                  <div className="flex items-center gap-1">
                    <span>Tipo</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="table-header-cell col-includes hidden xl:table-cell"
                  onClick={() => handleSort('includesHosting')}
                >
                  <div className="flex items-center gap-1">
                    <span>Host.</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="table-header-cell col-date hidden lg:table-cell"
                  onClick={() => handleSort('registrationDate')}
                >
                  <div className="flex items-center gap-1">
                    <span>Fecha</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="table-header-cell col-base-cost hidden md:table-cell"
                  onClick={() => handleSort('baseCost')}
                >
                  <div className="flex items-center gap-1">
                    <span>Base</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="table-header-cell col-maintenance hidden xl:table-cell"
                >
                  <span>Mant.</span>
                </th>
                <th 
                  scope="col" 
                  className="table-header-cell col-total"
                  onClick={() => handleSort('totalCost')}
                >
                  <div className="flex items-center gap-1">
                    <span className="hidden sm:inline">Total</span>
                    <span className="sm:hidden">$</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th scope="col" className="table-header-cell col-actions">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {sortedHostings.map((hosting) => (
                <tr key={hosting.id} className="table-row">
                  <td className="table-cell col-domain">
                    <div className="min-w-0">
                      <div className="table-cell-text-primary truncate">{hosting.domain}</div>
                      <div className="md:hidden table-cell-text-secondary text-xs mt-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{hosting.provider}</span>
                          <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${getPaymentTypeColor(hosting.paymentType)}`}></span>
                        </div>
                        <div className="flex items-center gap-1">
                          {hosting.includesHosting ? (
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                          )}
                          <span className="text-xs truncate">{hosting.includesHosting ? 'Con hosting' : 'Solo dominio'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell col-provider hidden md:table-cell">
                    <div className="table-cell-text-secondary truncate">{hosting.provider}</div>
                  </td>
                  <td className="table-cell col-payment hidden lg:table-cell">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium text-white ${getPaymentTypeColor(hosting.paymentType)}`}>
                      {getPaymentTypeLabel(hosting.paymentType).substring(0, 3)}
                    </span>
                  </td>
                  <td className="table-cell col-includes hidden xl:table-cell">
                    <div className="flex items-center justify-center">
                      {hosting.includesHosting ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="table-cell col-date hidden lg:table-cell">
                    <div className="table-cell-text-secondary truncate text-xs">{hosting.registrationDate}</div>
                  </td>
                  <td className="table-cell col-base-cost hidden md:table-cell">
                    <div className="table-cell-text-secondary text-xs truncate">
                      {formatCurrency(hosting.baseCost)}
                    </div>
                  </td>
                  <td className="table-cell col-maintenance hidden xl:table-cell">
                    <div className="text-xs text-green-600 dark:text-green-400 truncate">
                      {formatCurrency(hosting.maintenanceFee)}
                    </div>
                  </td>
                  <td className="table-cell col-total">
                    <div className="min-w-0">
                      <div className="table-cell-text font-semibold text-primary truncate text-sm">
                        {formatCurrency(hosting.totalCost)}
                      </div>
                      <div className="md:hidden table-cell-text-secondary text-xs mt-1">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">Base: {formatCurrency(hosting.baseCost)}</span>
                        </div>
                        <div className="lg:hidden mt-1 text-xs truncate">
                          {hosting.registrationDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell col-actions text-right">
                    <button
                      onClick={() => handleDeleteClick(hosting.id, hosting.domain)}
                      className="text-red-500 hover:text-red-400 transition-colors p-1.5 rounded-md hover:bg-red-900"
                      title="Eliminar hosting"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {hostings.length === 0 && (
                <tr>
                  <td colSpan={9} className="table-cell text-center text-muted-foreground py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <Server className="w-8 h-8 text-muted-foreground/50" />
                      <span>No hay servicios de hosting registrados</span>
                      <span className="text-xs">¡Agrega tu primer hosting arriba!</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que quieres eliminar el hosting para "${deleteDialog.hostingDomain}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </>
  );
};

export default HostingTable;