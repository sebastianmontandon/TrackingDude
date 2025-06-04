'use client'

import React, { useState } from 'react';
import { Check, X, Loader2, Plus } from 'lucide-react';
import { useDomainContext } from '../contexts/DomainContext';
import { getTodayDateString } from '../lib/utils';

const DomainForm: React.FC = () => {
  const { addDomain, checkDomainAvailability } = useDomainContext();
  const [name, setName] = useState('');
  const [creationDate, setCreationDate] = useState(getTodayDateString());
  const [website, setWebsite] = useState('');
  const [paymentPeriod, setPaymentPeriod] = useState('1 year');
  const [baseCost, setBaseCost] = useState('');
  const [checkAvailability, setCheckAvailability] = useState(false);
  
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  
  // Obtener la fecha actual en formato YYYY-MM-DD para restricción
  const today = getTodayDateString();
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setIsAvailable(null);
  };
  
  const handleDomainCheck = async () => {
    if (!name) return;
    
    setIsChecking(true);
    const available = await checkDomainAvailability(name);
    setIsAvailable(available);
    setIsChecking(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !creationDate || !website || !paymentPeriod || !baseCost) {
      return;
    }
    
    try {
      const baseCostNum = parseFloat(baseCost);
      const maintenanceFee = baseCostNum * 0.2; // 20% de mantenimiento
      const totalCost = baseCostNum + maintenanceFee;
      
      await addDomain({
        name,
        creationDate,
        website,
        paymentPeriod,
        baseCost: baseCostNum,
        maintenanceFee,
        totalCost,
      });
      
      // Reset form
      setName('');
      setCreationDate(getTodayDateString());
      setWebsite('');
      setPaymentPeriod('1 year');
      setBaseCost('');
      setIsAvailable(null);
    } catch (error) {
      console.error('Error al agregar dominio:', error);
    }
  };
  
  return (
    <div className="form-section">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Plus className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Nuevo Dominio</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Nombre del dominio con verificación */}
        <div className="form-group">
          <label htmlFor="domain-name" className="form-label">
            Nombre del dominio *
          </label>
          <div className="relative">
            <input
              id="domain-name"
              type="text"
              value={name}
              onChange={handleNameChange}
              onBlur={handleDomainCheck}
              className="form-input pr-10"
              placeholder="ejemplo.com"
              required
            />
            {isChecking && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 size={16} className="text-muted-foreground animate-spin" />
              </div>
            )}
            {isAvailable !== null && !isChecking && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isAvailable ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <X size={16} className="text-red-500" />
                )}
              </div>
            )}
          </div>
          {isAvailable === false && (
            <p className="text-sm text-red-500 mt-1">
              Este dominio no está disponible
            </p>
          )}
        </div>

        {/* Checkbox para verificación */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="check-availability"
            checked={checkAvailability}
            onChange={() => setCheckAvailability(!checkAvailability)}
            className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
          />
          <label htmlFor="check-availability" className="text-sm text-muted-foreground leading-relaxed">
            Verificar disponibilidad del dominio usando la API de Hostinger
          </label>
        </div>
        
        {/* Grid responsive de campos del formulario */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="creation-date" className="form-label">
              Fecha de creación *
            </label>
            <input
              id="creation-date"
              type="date"
              value={creationDate}
              onChange={(e) => setCreationDate(e.target.value)}
              max={today}
              className="form-input"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Solo se permiten fechas hasta el día de hoy
            </p>
          </div>
          
          <div className="form-group">
            <label htmlFor="payment-period" className="form-label">
              Período de pago *
            </label>
            <select
              id="payment-period"
              value={paymentPeriod}
              onChange={(e) => setPaymentPeriod(e.target.value)}
              className="form-input"
              required
            >
              <option value="1 year">1 año</option>
              <option value="2 years">2 años</option>
              <option value="3 years">3 años</option>
            </select>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="website" className="form-label">
              Sitio web de registro *
            </label>
            <input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="form-input"
              placeholder="https://ejemplo.com"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              URL del proveedor donde registraste el dominio
            </p>
          </div>
          
          <div className="form-group">
            <label htmlFor="base-cost" className="form-label">
              Costo base *
            </label>
            <div className="relative">
              <input
                id="base-cost"
                type="number"
                value={baseCost}
                onChange={(e) => setBaseCost(e.target.value)}
                className="form-input pl-8"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Se calculará automáticamente una tarifa de mantenimiento del 20%
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end pt-4 gap-3">
          <button
            type="submit"
            className="btn-primary w-full sm:w-auto min-w-[120px]"
            disabled={!name || !creationDate || !website || !paymentPeriod || !baseCost || (checkAvailability && isAvailable === false)}
          >
            Agregar Dominio
          </button>
        </div>
      </form>
    </div>
  );
};

export default DomainForm;