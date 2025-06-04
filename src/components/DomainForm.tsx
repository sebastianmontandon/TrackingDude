'use client'

import React, { useState } from 'react';
import { Check, X, Loader2, Plus } from 'lucide-react';
import { useDomainContext } from '../contexts/DomainContext';

const DomainForm: React.FC = () => {
  const { addDomain, checkDomainAvailability } = useDomainContext();
  const [name, setName] = useState('');
  const [creationDate, setCreationDate] = useState(new Date().toISOString().split('T')[0]);
  const [website, setWebsite] = useState('');
  const [paymentPeriod, setPaymentPeriod] = useState('1 year');
  const [checkAvailability, setCheckAvailability] = useState(true);
  
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !creationDate || !website || !paymentPeriod) {
      return;
    }
    
    addDomain({
      name,
      creationDate,
      website,
      paymentPeriod,
    });
    
    // Reset form
    setName('');
    setCreationDate(new Date().toISOString().split('T')[0]);
    setWebsite('');
    setPaymentPeriod('1 year');
    setIsAvailable(null);
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
              className="form-input"
              required
            />
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
        
        <div className="flex flex-col sm:flex-row justify-end pt-4 gap-3">
          <button
            type="submit"
            className="btn-primary w-full sm:w-auto min-w-[120px]"
            disabled={!name || !creationDate || !website || !paymentPeriod || (checkAvailability && isAvailable === false)}
          >
            Agregar Dominio
          </button>
        </div>
      </form>
    </div>
  );
};

export default DomainForm;