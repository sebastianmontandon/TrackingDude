'use client'

import React, { useState, useEffect } from 'react'
import { Bell, Plus, Mail, MessageSquare, Calendar, Send, TestTube } from 'lucide-react'
import NotificationTable from '../NotificationTable'
import { useNotificationContext } from '../../contexts/NotificationContext'
import { useDomainContext } from '../../contexts/DomainContext'
import { useHostingContext } from '../../contexts/HostingContext'
import { useSession } from 'next-auth/react'
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
        console.error('Error adding notification:', error);
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
        <h3 className="text-lg font-semibold text-foreground">Configure Notification</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Tipo de servicio */}
        <div className="form-group">
          <label htmlFor="notification-type" className="form-label">
            Service Type *
          </label>
          <select
            id="notification-type"
            value={type}
            onChange={(e) => setType(e.target.value as 'domain' | 'hosting')}
            className="form-input"
            required
          >
            <option value="domain">Domain</option>
            <option value="hosting">Hosting</option>
          </select>
        </div>

        {/* Selector de servicio */}
        <div className="form-group">
          <label htmlFor="service-select" className="form-label">
            {type === 'domain' ? 'Domain' : 'Hosting Service'} *
          </label>
          <select
            id="service-select"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="form-input"
            required
          >
            <option value="">Select {type === 'domain' ? 'a domain' : 'a service'}</option>
            {getAvailableServices().map(service => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
          {selectedService && calculatedExpirationDate && (
            <div className="mt-2 p-3 bg-blue-950/40 rounded-lg border border-blue-800">
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className="text-blue-400" />
                <span className="text-blue-300">
                  <strong>Expiration Date:</strong> {calculatedExpirationDate}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <Bell size={14} className="text-green-400" />
                <span className="text-green-300">
                  <strong>Notification scheduled for:</strong> {notificationDate}
                </span>
              </div>
              <p className="text-xs text-blue-400 mt-1">
                The notification will be sent automatically 1 day before expiration
              </p>
            </div>
          )}
        </div>

        {/* Método de notificación - solo Email y WhatsApp */}
        <fieldset className="form-group">
          <legend className="form-label">
            Notification Method *
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
            Schedule Notification
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

// Component for testing notifications
const NotificationTester: React.FC = () => {
  const { data: session } = useSession()
  const [testEmail, setTestEmail] = useState('')
  const [testPhone, setTestPhone] = useState('')
  const [isTestingEmail, setIsTestingEmail] = useState(false)
  const [isTestingWhatsApp, setIsTestingWhatsApp] = useState(false)
  const [emailResult, setEmailResult] = useState<string | null>(null)
  const [whatsappResult, setWhatsappResult] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.email) {
      setTestEmail(session.user.email)
    }
    if (session?.user?.phone) {
      setTestPhone(session.user.phone)
    }
  }, [session])

  const handleTestEmail = async () => {
    if (!testEmail) return
    
    setIsTestingEmail(true)
    setEmailResult(null)
    
    try {
      const response = await fetch('/api/notifications/test/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: testEmail }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setEmailResult(`✅ Email enviado exitosamente. ID: ${data.messageId}`)
      } else {
        setEmailResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setEmailResult('❌ Error de conexión')
    } finally {
      setIsTestingEmail(false)
    }
  }

  const handleTestWhatsApp = async () => {
    if (!testPhone) return
    
    setIsTestingWhatsApp(true)
    setWhatsappResult(null)
    
    try {
      const response = await fetch('/api/notifications/test/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: testPhone }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setWhatsappResult(`✅ WhatsApp enviado exitosamente. ID: ${data.messageId}`)
      } else {
        setWhatsappResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setWhatsappResult('❌ Error de conexión')
    } finally {
      setIsTestingWhatsApp(false)
    }
  }

  return (
    <div className="form-section">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <TestTube className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Test Notifications</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Test */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-foreground">Email Test</h4>
          </div>
          
          <div className="form-group">
            <label htmlFor="test-email" className="form-label">
              Destination Email
            </label>
            <input
              id="test-email"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="form-input"
              placeholder="your@email.com"
            />
          </div>
          
          <button
            onClick={handleTestEmail}
            disabled={!testEmail || isTestingEmail}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isTestingEmail ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Test Email
              </>
            )}
          </button>
          
          {emailResult && (
            <div className={`p-3 rounded-lg text-sm border ${
              emailResult.startsWith('Email sent successfully') 
                ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                : 'bg-destructive/10 text-destructive border-destructive/20'
            }`}>
              {emailResult}
            </div>
          )}
        </div>

        {/* WhatsApp Test */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-foreground">WhatsApp Test</h4>
          </div>
          
          <div className="form-group">
            <label htmlFor="test-phone" className="form-label">
              Phone Number
            </label>
            <input
              id="test-phone"
              type="tel"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              className="form-input"
              placeholder=""
            />
          </div>
          
          <button
            onClick={handleTestWhatsApp}
            disabled={!testPhone || isTestingWhatsApp}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isTestingWhatsApp ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Test Message
              </>
            )}
          </button>
          
          {whatsappResult && (
            <div className={`p-3 rounded-lg text-sm border ${
              whatsappResult.startsWith('WhatsApp sent successfully') 
                ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                : 'bg-destructive/10 text-destructive border-destructive/20'
            }`}>
              {whatsappResult}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border">
        <h4 className="font-medium text-foreground mb-2">Required Configuration</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Email:</strong> EMAIL_USER and EMAIL_PASSWORD environment variables</p>
          <p><strong>WhatsApp:</strong> TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM environment variables</p>
        </div>
      </div>
    </div>
  )
}

export default function Notifications() {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="section-header">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Notification Management</h1>
        <p className="section-description">
          Configure and manage expiration notifications for your domains and hosting services
        </p>
      </div>
      
      {/* Notification Configuration Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Configure New Notification</h2>
          <p className="section-description">
            Schedule custom notifications for your domains and hosting services. 
            The date is calculated automatically as expiration date - 1 day.
          </p>
        </div>
        <NotificationConfigForm />
      </div>
      
      {/* Domain Notifications Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Your Scheduled Notifications</h2>
          <p className="section-description">
            Review and manage all your scheduled notifications
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
      
      {/* Notification Testing Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Probar Notificaciones</h2>
          <p className="section-description">
            Prueba la configuración de notificaciones antes de enviarlas a los usuarios.
          </p>
        </div>
        <NotificationTester />
      </div>
    </div>
  )
} 