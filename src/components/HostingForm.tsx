'use client'

import React, { useState } from 'react';
import { Server, Plus } from 'lucide-react';
import { useHostingContext } from '../contexts/HostingContext';
import { getTodayDateString } from '../lib/utils';

const HostingForm: React.FC = () => {
  const { addHosting } = useHostingContext();
  
  const [domain, setDomain] = useState('');
  const [provider, setProvider] = useState('');
  const [paymentType, setPaymentType] = useState('Monthly');
  const [includesHosting, setIncludesHosting] = useState(true);
  const [registrationDate, setRegistrationDate] = useState(getTodayDateString());
  const [baseCost, setBaseCost] = useState('');
  
  // Obtener la fecha actual en formato YYYY-MM-DD para restricción
  const today = getTodayDateString();
  
  const handleIncludesHostingChange = (checked: boolean) => {
    setIncludesHosting(checked);
    // Si se desmarca el checkbox, limpiar el campo dominio
    if (!checked) {
      setDomain('');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!provider || !paymentType || !registrationDate || !baseCost) {
      return;
    }
    
    // Solo requerir dominio si includesHosting está marcado
    if (includesHosting && !domain) {
      return;
    }
    
    try {
      await addHosting({
        domain: includesHosting ? domain : '',
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
      setRegistrationDate(getTodayDateString());
      setBaseCost('');
    } catch (error) {
      console.error('Error al agregar hosting:', error);
    }
  };
  
  return (
    <div className="form-section">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Server className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">New Hosting</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Checkbox para hosting incluido - movido arriba */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="includes-hosting"
            checked={includesHosting}
            onChange={(e) => handleIncludesHostingChange(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
          />
          <label htmlFor="includes-hosting" className="text-sm text-muted-foreground leading-relaxed">
            The service includes web hosting (not just domain)
          </label>
        </div>

        {/* Campo de dominio libre - condicionalmente habilitado */}
        <div className="form-group">
          <label htmlFor="domain" className="form-label">
            Domain {includesHosting && '*'}
          </label>
          <input
            id="domain"
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className={`form-input ${!includesHosting ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder={includesHosting ? "example.com" : "No domain required"}
            disabled={!includesHosting}
            required={includesHosting}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {includesHosting 
              ? "Enter the domain name for which you'll configure hosting"
              : "Field disabled because the service doesn't include web hosting"
            }
          </p>
        </div>

        {/* Grid responsive de campos principales */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="provider" className="form-label">
              Provider *
            </label>
            <input
              id="provider"
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="form-input"
              placeholder="e.g., HostGator, SiteGround"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="payment-type" className="form-label">
              Payment Type *
            </label>
            <select
              id="payment-type"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="form-input"
              required
            >
              <option value="Monthly">Monthly</option>
              <option value="Annual">Annual</option>
              <option value="Biennial">Biennial</option>
            </select>
          </div>
        </div>

        {/* Grid responsive de fecha y costo */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="registration-date" className="form-label">
              Registration Date *
            </label>
            <input
              id="registration-date"
              type="date"
              value={registrationDate}
              onChange={(e) => setRegistrationDate(e.target.value)}
              max={today}
              className="form-input"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Only dates up to today are allowed
            </p>
          </div>
          
          <div className="form-group">
            <label htmlFor="base-cost" className="form-label">
              Base Cost *
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
              A 15% maintenance fee will be automatically calculated
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end pt-4 gap-3">
          <button
            type="submit"
            className="btn-primary w-full sm:w-auto min-w-[120px]"
            disabled={!provider || !paymentType || !registrationDate || !baseCost || (includesHosting && !domain)}
          >
            Add Hosting
          </button>
        </div>
      </form>
    </div>
  );
};

export default HostingForm;