'use client'

import React, { useState, useEffect } from 'react'
import { Bell, Plus, Mail, MessageSquare, Calendar } from 'lucide-react'
import NotificationTable from '../NotificationTable'
import { useNotificationContext } from '../../contexts/NotificationContext'
import { useDomainContext } from '../../contexts/DomainContext'
import { useHostingContext } from '../../contexts/HostingContext'
import { 
  getTodayDateString, 
  calculateExpirationDate, 
  calculateHostingExpirationDate, 
  subtractDaysFromDate,
  formatDateForInput
} from '../../lib/utils'

const NotificationConfigForm: React.FC = () => {
  const { addNotification } = useNotificationContext()
  const { domains } = useDomainContext()
  const { hostings } = useHostingContext()
  
  const [type, setType] = useState<'domain' | 'hosting'>('domain')
  const [selectedService, setSelectedService] = useState('')
  const [notificationDate, setNotificationDate] = useState(getTodayDateString())
  const [notificationMethod, setNotificationMethod] = useState<'EMAIL' | 'WHATSAPP'>('EMAIL')
  const [calculatedExpirationDate, setCalculatedExpirationDate] = useState('')
  
  // Helper function to convert types
  const convertType = (type: 'domain' | 'hosting'): 'DOMAIN' | 'HOSTING' => {
    return type === 'domain' ? 'DOMAIN' : 'HOSTING';
  };

  const getAvailableServices = () => {
    return type === 'domain' 
      ? domains.map(d => ({ 
          id: d.id, 
          name: d.name, 
          provider: d.website,
          // Para dominios, usar expirationDate si existe, sino calcular
          expirationDate: d.expirationDate || calculateExpirationDate(d.creationDate, d.paymentPeriod),
          creationDate: d.creationDate,
          paymentPeriod: d.paymentPeriod
        }))
      : hostings.map(h => ({ 
          id: h.id, 
          name: h.domain, 
          provider: h.provider,
          // Para hostings, calcular fecha de vencimiento
          expirationDate: calculateHostingExpirationDate(h.registrationDate, h.paymentType),
          registrationDate: h.registrationDate,
          paymentType: h.paymentType
        }))
  }

  // Efecto para calcular la fecha de notificación cuando cambia el servicio seleccionado
  useEffect(() => {
    if (selectedService) {
      const services = getAvailableServices()
      const service = services.find(s => s.id === selectedService)
      
      if (service && service.expirationDate) {
        // Calcular fecha de vencimiento - 1 día
        const notificationDateCalculated = subtractDaysFromDate(service.expirationDate, 1)
        setNotificationDate(notificationDateCalculated)
        setCalculatedExpirationDate(service.expirationDate)
      }
    } else {
      setNotificationDate(getTodayDateString())
      setCalculatedExpirationDate('')
    }
  }, [selectedService, type, domains, hostings])

  // Efecto para resetear selección cuando cambia el tipo
  useEffect(() => {
    setSelectedService('')
    setNotificationDate(getTodayDateString())
    setCalculatedExpirationDate('')
  }, [type])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedService || !notificationDate || !notificationMethod) {
      return
    }
    
    const services = getAvailableServices()
    const service = services.find(s => s.id === selectedService)
    
    if (service) {
      try {
        await addNotification({
          type: convertType(type),
          domain: service.name,
          provider: service.provider,
          notificationDate,
          notificationMethod,
        })
        
        // Reset form
        setSelectedService('')
        setNotificationDate(getTodayDateString())
        setNotificationMethod('EMAIL')
        setCalculatedExpirationDate('')
      } catch (error) {
        console.error('Error al agregar notificación:', error);
      }
    }
  }
  
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'EMAIL': return <Mail size={16} />
      case 'WHATSAPP': return <MessageSquare size={16} />
      default: return <Bell size={16} />
    }
  }
  
  return (
    <div className="form-section">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Plus className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Configurar Notificación</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Tipo de servicio */}
        <div className="form-group">
          <label htmlFor="notification-type" className="form-label">
            Tipo de servicio *
          </label>
          <select
            id="notification-type"
            value={type}
            onChange={(e) => setType(e.target.value as 'domain' | 'hosting')}
            className="form-input"
            required
          >
            <option value="domain">Dominio</option>
            <option value="hosting">Hosting</option>
          </select>
        </div>

        {/* Selector de servicio */}
        <div className="form-group">
          <label htmlFor="service-select" className="form-label">
            {type === 'domain' ? 'Dominio' : 'Servicio de Hosting'} *
          </label>
          <select
            id="service-select"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="form-input"
            required
          >
            <option value="">Selecciona {type === 'domain' ? 'un dominio' : 'un servicio'}</option>
            {getAvailableServices().map(service => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
          {selectedService && calculatedExpirationDate && (
            <div className="mt-2 p-3 bg-blue-950/40 rounded-lg border border-blue-800">
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className="text-blue-400" />
                <span className="text-blue-300">
                  <strong>Fecha de vencimiento:</strong> {calculatedExpirationDate}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <Bell size={14} className="text-green-400" />
                <span className="text-green-300">
                  <strong>Notificación programada para:</strong> {notificationDate}
                </span>
              </div>
              <p className="text-xs text-blue-400 mt-1">
                La notificación se enviará automáticamente 1 día antes del vencimiento
              </p>
            </div>
          )}
        </div>

        {/* Método de notificación - solo Email y WhatsApp */}
        <fieldset className="form-group">
          <legend className="form-label">
            Método de notificación *
          </legend>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              { value: 'EMAIL', label: 'Email' },
              { value: 'WHATSAPP', label: 'WhatsApp' }
            ].map(method => (
              <label 
                key={method.value} 
                htmlFor={`method-${method.value.toLowerCase()}`}
                className="flex items-center gap-2 p-3 rounded-lg border border-input cursor-pointer hover:bg-accent transition-colors"
              >
                <input
                  type="radio"
                  id={`method-${method.value.toLowerCase()}`}
                  name="notificationMethod"
                  value={method.value}
                  checked={notificationMethod === method.value}
                  onChange={(e) => setNotificationMethod(e.target.value as 'EMAIL' | 'WHATSAPP')}
                  className="sr-only"
                />
                <div className={`flex items-center gap-2 ${notificationMethod === method.value ? 'text-primary' : 'text-muted-foreground'}`}>
                  {getMethodIcon(method.value)}
                  <span className="text-sm font-medium">{method.label}</span>
                </div>
              </label>
            ))}
          </div>
        </fieldset>
        
        <div className="flex flex-col sm:flex-row justify-end pt-4 gap-3">
          <button
            type="submit"
            className="btn-primary w-full sm:w-auto min-w-[140px]"
            disabled={!selectedService || !notificationDate || !notificationMethod}
          >
            Programar Notificación
          </button>
        </div>
      </form>
    </div>
  )
}

// Debug component to show notification context state
const NotificationDebug: React.FC = () => {
  const { notifications, loading, error } = useNotificationContext();
  
  return (
    <div className="bg-yellow-900 p-4 rounded-lg mb-4">
      <h3 className="font-bold text-yellow-200">Debug Info:</h3>
      <p>Loading: {loading ? 'true' : 'false'}</p>
      <p>Error: {error || 'none'}</p>
      <p>Total notifications: {notifications.length}</p>
      <p>Domain notifications: {notifications.filter(n => n.type === 'DOMAIN').length}</p>
      <p>Hosting notifications: {notifications.filter(n => n.type === 'HOSTING').length}</p>
      {notifications.length > 0 && (
        <details className="mt-2">
          <summary className="cursor-pointer">Ver datos completos</summary>
          <pre className="text-xs mt-2 overflow-auto max-h-40">
            {JSON.stringify(notifications, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default function Notifications() {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="section-header">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Centro de Notificaciones</h1>
        <p className="section-description">
          Revisa todas las notificaciones y alertas del sistema. Mantente informado sobre el estado de tus servicios.
        </p>
      </div>
      
      {/* Notification Configuration Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Configurar Nueva Notificación</h2>
          <p className="section-description">
            Programa notificaciones personalizadas para tus dominios y servicios de hosting. 
            La fecha se calcula automáticamente como fecha de vencimiento - 1 día.
          </p>
        </div>
        <NotificationConfigForm />
      </div>
      
      {/* Domain Notifications Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Notificaciones de Dominios</h2>
          <p className="section-description">
            Alertas y notificaciones relacionadas con tus dominios
          </p>
        </div>
        <NotificationTable type="domain" />
      </div>
      
      {/* Hosting Notifications Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Notificaciones de Hosting</h2>
          <p className="section-description">
            Alertas y notificaciones sobre tus servicios de hosting
          </p>
        </div>
        <NotificationTable type="hosting" />
      </div>
      
      {/* Notification Debug Section */}
      {/* <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Información de Depuración</h2>
          <p className="section-description">
            Información sobre el estado del contexto de notificaciones
          </p>
        </div>
        <NotificationDebug />
      </div>
      */}
    </div>
  )
} 