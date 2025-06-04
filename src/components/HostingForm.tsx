'use client'

import React, { useState } from 'react';
import { Server, Plus } from 'lucide-react';
import { useHostingContext } from '../contexts/HostingContext';
import { useDomainContext } from '../contexts/DomainContext';

const HostingForm: React.FC = () => {
  const { addHosting } = useHostingContext();
  const { domains } = useDomainContext();
  
  const [domain, setDomain] = useState('');
  const [provider, setProvider] = useState('');
  const [paymentType, setPaymentType] = useState('Monthly');
  const [includesHosting, setIncludesHosting] = useState(true);
  const [registrationDate, setRegistrationDate] = useState(new Date().toISOString().split('T')[0]);
  const [baseCost, setBaseCost] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain || !provider || !paymentType || !registrationDate || !baseCost) {
      return;
    }
    
    addHosting({
      domain,
      provider,
      paymentType,
      includesHosting,
      registrationDate,
      baseCost: parseFloat(baseCost),
    });
    
    // Reset form
    setDomain('');
    setProvider('');
    setPaymentType('Monthly');
    setIncludesHosting(true);
    setRegistrationDate(new Date().toISOString().split('T')[0]);
    setBaseCost('');
  };
  
  return (
    <div className="form-section">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Server className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Nuevo Hosting</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Selección de dominio */}
        <div className="form-group">
          <label htmlFor="domain" className="form-label">
            Dominio *
          </label>
          <select
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="form-input"
            required
          >
            <option value="">Selecciona un dominio</option>
            {domains.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Selecciona el dominio para el cual configurarás el hosting
          </p>
        </div>

        {/* Grid responsive de campos principales */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="provider" className="form-label">
              Proveedor *
            </label>
            <input
              id="provider"
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="form-input"
              placeholder="ej. HostGator, SiteGround"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="payment-type" className="form-label">
              Tipo de pago *
            </label>
            <select
              id="payment-type"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="form-input"
              required
            >
              <option value="Monthly">Mensual</option>
              <option value="Annual">Anual</option>
              <option value="Biennial">Bienal</option>
            </select>
          </div>
        </div>

        {/* Checkbox para hosting incluido */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="includes-hosting"
            checked={includesHosting}
            onChange={(e) => setIncludesHosting(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
          />
          <label htmlFor="includes-hosting" className="text-sm text-muted-foreground leading-relaxed">
            El servicio incluye hosting web (no solo dominio)
          </label>
        </div>

        {/* Grid responsive de fecha y costo */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="registration-date" className="form-label">
              Fecha de alta *
            </label>
            <input
              id="registration-date"
              type="date"
              value={registrationDate}
              onChange={(e) => setRegistrationDate(e.target.value)}
              className="form-input"
              required
            />
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
            disabled={!domain || !provider || !paymentType || !registrationDate || !baseCost}
          >
            Agregar Hosting
          </button>
        </div>
      </form>
    </div>
  );
};

export default HostingForm;