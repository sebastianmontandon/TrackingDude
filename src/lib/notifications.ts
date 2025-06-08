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
  const subject = `⚠️ Domain ${domainName} Expiring Soon`
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const favicon = `${baseUrl}/favicon.png`
  
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
          <h1><img style="width: 32px; height: 32px; vertical-align: middle; margin-right: 10px;" src="${favicon}" alt="" /> TrackingDude</h1>
          <h2>Expiration Notification</h2>
        </div>
        
        <div class="alert">
          <h3>⚠️ Your domain is about to expire</h3>
          <p><strong>Domain:</strong> ${domainName}</p>
          <p><strong>Proveedor:</strong> ${provider}</p>
          <p><strong>Fecha de vencimiento:</strong> ${expirationDate}</p>
        </div>
        
        <p>Your domain <strong>${domainName}</strong> will expire on <strong>${expirationDate}</strong>. It's important to renew your domain before the expiration date to avoid service interruptions.</p>
        
        <div class="footer">
          <p>Este mensaje fue enviado automáticamente por TrackingDude</p>
          <p>Sistema de gestión de dominios y hosting</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  const text = `
    TrackingDude - Expiration Notification
    
    Your domain ${domainName} is about to expire.
    
    Details:
    - Domain: ${domainName}
    - Provider: ${provider}
    - Expiration Date: ${expirationDate}
    
    Please contact your provider to renew the domain before the expiration date.
  `
  
  return { subject, html, text }
}

export const generateHostingExpirationEmail = (domain: string, expirationDate: string, provider: string) => {
  const subject = `⚠️ Hosting ${domain} Expiration Notification`
  
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
          <h2>Hosting Expiration Notification</h2>
        </div>
        
        <div class="alert">
          <h3>⚠️ Your hosting service is about to expire</h3>
          <p><strong>Domain:</strong> ${domain}</p>
          <p><strong>Provider:</strong> ${provider}</p>
          <p><strong>Expiration Date:</strong> ${expirationDate}</p>
        </div>
        
        <p>Your hosting service for <strong>${domain}</strong> will expire on <strong>${expirationDate}</strong>. It's important to renew your hosting before the expiration date to prevent your website from going offline.</p>
        
        <div class="footer">
          <p>This message was sent automatically by TrackingDude</p>
          <p>Domain and hosting management system</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  const text = `
    TrackingDude - Hosting Expiration Notification
    
    Your hosting ${domain} is about to expire.
    
    Details:
    - Domain: ${domain}
    - Provider: ${provider}
    - Expiration Date: ${expirationDate}
    
    Please contact your provider to renew the hosting before the expiration date.
  `
  
  return { subject, html, text }
}

// WhatsApp message templates
export const generateWhatsAppMessage = (type: 'domain' | 'hosting', name: string, expirationDate: string, provider: string) => {
  const emoji = type === 'domain' ? '🌐' : '🖥️'
  const service = type === 'domain' ? 'domain' : 'hosting'
  
  return `${emoji} *TrackingDude - Expiration Alert*

⚠️ Your ${service} *${name}* is about to expire.

📅 *Expiration Date:* ${expirationDate}
🏢 *Provider:* ${provider}

Please renew your ${service} before the expiration date to avoid service interruptions.

_Automated message from TrackingDude_`
}

// Test notification functions
export const sendTestEmail = async (to: string) => {
  const emailData = generateDomainExpirationEmail(
    'example.com',
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US'),
    'Example Provider'
  )
  
  return await sendEmailNotification({
    to,
    subject: '[TEST] ' + emailData.subject,
    html: emailData.html,
    text: emailData.text,
  })
}

export const sendTestWhatsApp = async (to: string) => {
  const message = generateWhatsAppMessage(
    'domain',
    'example.com',
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US'),
    'Example Provider'
  )
  
  return await sendWhatsAppNotification({
    to,
    body: '[TEST] ' + message,
  })
} 