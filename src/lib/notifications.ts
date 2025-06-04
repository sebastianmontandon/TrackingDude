import nodemailer from 'nodemailer'
import twilio from 'twilio'

// Email configuration
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// WhatsApp/SMS configuration with Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export interface EmailNotification {
  to: string
  subject: string
  html: string
  text?: string
}

export interface WhatsAppNotification {
  to: string // Format: +1234567890
  body: string
}

export const sendEmailNotification = async (notification: EmailNotification) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Email credentials not configured')
    }

    const info = await emailTransporter.sendMail({
      from: `"TrackingDude" <${process.env.EMAIL_USER}>`,
      to: notification.to,
      subject: notification.subject,
      text: notification.text,
      html: notification.html,
    })

    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export const sendWhatsAppNotification = async (notification: WhatsAppNotification) => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_WHATSAPP_FROM) {
      throw new Error('Twilio credentials not configured')
    }

    const message = await twilioClient.messages.create({
      body: notification.body,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${notification.to}`,
    })

    console.log('WhatsApp message sent:', message.sid)
    return { success: true, messageId: message.sid }
  } catch (error) {
    console.error('Error sending WhatsApp:', error)
    throw error
  }
}

// Email templates
export const generateDomainExpirationEmail = (domainName: string, expirationDate: string, provider: string) => {
  const subject = `⚠️ Dominio ${domainName} próximo a vencer`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
        .alert { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .footer { text-align: center; color: #666; margin-top: 30px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌐 TrackingDude</h1>
          <h2>Notificación de Vencimiento</h2>
        </div>
        
        <div class="alert">
          <h3>⚠️ Tu dominio está próximo a vencer</h3>
          <p><strong>Dominio:</strong> ${domainName}</p>
          <p><strong>Proveedor:</strong> ${provider}</p>
          <p><strong>Fecha de vencimiento:</strong> ${expirationDate}</p>
        </div>
        
        <p>Tu dominio <strong>${domainName}</strong> vencerá el <strong>${expirationDate}</strong>. Es importante que renueves tu dominio antes de la fecha de vencimiento para evitar interrupciones en tu servicio.</p>
        
        <p>Te recomendamos que:</p>
        <ul>
          <li>Contactes a tu proveedor ${provider} para renovar el dominio</li>
          <li>Verifiques que tus datos de pago estén actualizados</li>
          <li>Considera configurar la renovación automática</li>
        </ul>
        
        <div class="footer">
          <p>Este mensaje fue enviado automáticamente por TrackingDude</p>
          <p>Sistema de gestión de dominios y hosting</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  const text = `
    TrackingDude - Notificación de Vencimiento
    
    Tu dominio ${domainName} está próximo a vencer.
    
    Detalles:
    - Dominio: ${domainName}
    - Proveedor: ${provider}
    - Fecha de vencimiento: ${expirationDate}
    
    Por favor, contacta a tu proveedor para renovar el dominio antes de la fecha de vencimiento.
  `
  
  return { subject, html, text }
}

export const generateHostingExpirationEmail = (domain: string, expirationDate: string, provider: string) => {
  const subject = `⚠️ Hosting ${domain} próximo a vencer`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
        .alert { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; margin-top: 30px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🖥️ TrackingDude</h1>
          <h2>Notificación de Vencimiento de Hosting</h2>
        </div>
        
        <div class="alert">
          <h3>⚠️ Tu servicio de hosting está próximo a vencer</h3>
          <p><strong>Dominio:</strong> ${domain}</p>
          <p><strong>Proveedor:</strong> ${provider}</p>
          <p><strong>Fecha de vencimiento:</strong> ${expirationDate}</p>
        </div>
        
        <p>Tu servicio de hosting para <strong>${domain}</strong> vencerá el <strong>${expirationDate}</strong>. Es importante que renueves tu hosting antes de la fecha de vencimiento para evitar que tu sitio web se desconecte.</p>
        
        <div class="footer">
          <p>Este mensaje fue enviado automáticamente por TrackingDude</p>
          <p>Sistema de gestión de dominios y hosting</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  const text = `
    TrackingDude - Notificación de Vencimiento de Hosting
    
    Tu hosting ${domain} está próximo a vencer.
    
    Detalles:
    - Dominio: ${domain}
    - Proveedor: ${provider}
    - Fecha de vencimiento: ${expirationDate}
    
    Por favor, contacta a tu proveedor para renovar el hosting antes de la fecha de vencimiento.
  `
  
  return { subject, html, text }
}

// WhatsApp message templates
export const generateWhatsAppMessage = (type: 'domain' | 'hosting', name: string, expirationDate: string, provider: string) => {
  const emoji = type === 'domain' ? '🌐' : '🖥️'
  const service = type === 'domain' ? 'dominio' : 'hosting'
  
  return `${emoji} *TrackingDude - Alerta de Vencimiento*

⚠️ Tu ${service} *${name}* está próximo a vencer.

📅 *Fecha de vencimiento:* ${expirationDate}
🏢 *Proveedor:* ${provider}

Por favor, renueva tu ${service} antes de la fecha de vencimiento para evitar interrupciones en el servicio.

_Mensaje automático de TrackingDude_`
}

// Test notification functions
export const sendTestEmail = async (to: string) => {
  const emailData = generateDomainExpirationEmail(
    'ejemplo.com',
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
    'Proveedor de Ejemplo'
  )
  
  return await sendEmailNotification({
    to,
    subject: '[PRUEBA] ' + emailData.subject,
    html: emailData.html,
    text: emailData.text,
  })
}

export const sendTestWhatsApp = async (to: string) => {
  const message = generateWhatsAppMessage(
    'domain',
    'ejemplo.com',
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
    'Proveedor de Ejemplo'
  )
  
  return await sendWhatsAppNotification({
    to,
    body: '[PRUEBA] ' + message,
  })
} 