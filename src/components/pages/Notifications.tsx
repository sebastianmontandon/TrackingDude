'use client'

import React, { useState } from 'react'
import { Bell, Plus, Mail, MessageSquare, Smartphone } from 'lucide-react'
import NotificationTable from '../NotificationTable'
import { useNotificationContext } from '../../contexts/NotificationContext'
import { useDomainContext } from '../../contexts/DomainContext'
import { useHostingContext } from '../../contexts/HostingContext'

const NotificationConfigForm: React.FC = () => {
  const { addNotification } = useNotificationContext()
  const { domains } = useDomainContext()
  const { hostings } = useHostingContext()
  
  const [type, setType] = useState<'domain' | 'hosting'>('domain')
  const [selectedService, setSelectedService] = useState('')
  const [notificationDate, setNotificationDate] = useState(new Date().toISOString().split('T')[0])
  const [notificationMethod, setNotificationMethod] = useState('Email')
  
  const getAvailableServices = () => {
    return type === 'domain' 
      ? domains.map(d => ({ id: d.id, name: d.name, provider: d.website }))
      : hostings.map(h => ({ id: h.id, name: h.domain, provider: h.provider }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedService || !notificationDate || !notificationMethod) {
      return
    }
    
    const services = getAvailableServices()
    const service = services.find(s => s.id === selectedService)
    
    if (service) {
      addNotification({
        type,
        domain: service.name,
        provider: service.provider,
        notificationDate,
        notificationMethod,
      })
      
      // Reset form
      setSelectedService('')
      setNotificationDate(new Date().toISOString().split('T')[0])
      setNotificationMethod('Email')
    }
  }
  
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'Email': return <Mail size={16} />
      case 'SMS': return <Smartphone size={16} />
      case 'WhatsApp': return <MessageSquare size={16} />
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

        {/* Grid responsive */}
        <div className="form-grid">
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
          </div>
          
          <div className="form-group">
            <label htmlFor="notification-date" className="form-label">
              Fecha de notificación *
            </label>
            <input
              id="notification-date"
              type="date"
              value={notificationDate}
              onChange={(e) => setNotificationDate(e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>

        <fieldset className="form-group">
          <legend className="form-label">
            Método de notificación *
          </legend>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
            {['Email', 'SMS', 'WhatsApp', 'Push'].map(method => (
              <label 
                key={method} 
                htmlFor={`method-${method.toLowerCase()}`}
                className="flex items-center gap-2 p-3 rounded-lg border border-input cursor-pointer hover:bg-accent transition-colors"
              >
                <input
                  type="radio"
                  id={`method-${method.toLowerCase()}`}
                  name="notificationMethod"
                  value={method}
                  checked={notificationMethod === method}
                  onChange={(e) => setNotificationMethod(e.target.value)}
                  className="sr-only"
                />
                <div className={`flex items-center gap-2 ${notificationMethod === method ? 'text-primary' : 'text-muted-foreground'}`}>
                  {getMethodIcon(method)}
                  <span className="text-sm font-medium">{method}</span>
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
            Programa notificaciones personalizadas para tus dominios y servicios de hosting
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
    </div>
  )
} 