// Datos de ejemplo para el usuario de solo lectura
export const mockDomains = [
  {
    id: 'mock-1',
    name: 'ejemplo.com',
    creationDate: new Date('2024-01-15'),
    website: 'https://ejemplo.com',
    paymentPeriod: 'Anual',
    expirationDate: new Date('2025-01-15'),
    baseCost: 15.99,
    maintenanceFee: 2.99,
    totalCost: 18.98,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'mock-2',
    name: 'otroejemplo.com',
    creationDate: new Date('2024-03-10'),
    website: 'https://otroejemplo.com',
    paymentPeriod: 'Mensual',
    expirationDate: new Date('2024-04-10'),
    baseCost: 12.99,
    maintenanceFee: 2.99,
    totalCost: 15.98,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: 'mock-3',
    name: 'miweb.cl',
    creationDate: new Date('2023-11-20'),
    website: 'https://miweb.cl',
    paymentPeriod: 'Bianual',
    expirationDate: new Date('2025-11-20'),
    baseCost: 29.99,
    maintenanceFee: 3.99,
    totalCost: 33.98,
    createdAt: new Date('2023-11-20'),
    updatedAt: new Date('2023-11-20')
  },
  {
    id: 'mock-4',
    name: 'negocioonline.net',
    creationDate: new Date('2024-02-05'),
    website: 'https://negocioonline.net',
    paymentPeriod: 'Anual',
    expirationDate: new Date('2025-02-05'),
    baseCost: 18.50,
    maintenanceFee: 3.50,
    totalCost: 22.00,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: 'mock-5',
    name: 'blogpersonal.org',
    creationDate: new Date('2023-09-15'),
    website: 'https://blogpersonal.org',
    paymentPeriod: 'Mensual',
    expirationDate: new Date('2024-10-15'),
    baseCost: 10.99,
    maintenanceFee: 1.99,
    totalCost: 12.98,
    createdAt: new Date('2023-09-15'),
    updatedAt: new Date('2023-09-15')
  },
  {
    id: 'mock-6',
    name: 'tiendaonline.shop',
    creationDate: new Date('2024-04-01'),
    website: 'https://tiendaonline.shop',
    paymentPeriod: 'Anual',
    expirationDate: new Date('2025-04-01'),
    baseCost: 24.99,
    maintenanceFee: 4.99,
    totalCost: 29.98,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01')
  },
  {
    id: 'mock-7',
    name: 'portafolio.dev',
    creationDate: new Date('2024-01-30'),
    website: 'https://portafolio.dev',
    paymentPeriod: 'Bianual',
    expirationDate: new Date('2026-01-30'),
    baseCost: 45.00,
    maintenanceFee: 5.00,
    totalCost: 50.00,
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30')
  }
];

export const mockHostings = [
  {
    id: 'mock-h1',
    domain: 'ejemplo.com',
    provider: 'Hostinger',
    paymentType: 'Anual',
    includesHosting: true,
    registrationDate: new Date('2024-01-15'),
    baseCost: 89.99,
    maintenanceFee: 9.99,
    totalCost: 99.98,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'mock-h2',
    domain: 'miweb.cl',
    provider: 'HostGator',
    paymentType: 'Bianual',
    includesHosting: true,
    registrationDate: new Date('2023-11-20'),
    baseCost: 150.00,
    maintenanceFee: 15.00,
    totalCost: 165.00,
    createdAt: new Date('2023-11-20'),
    updatedAt: new Date('2023-11-20')
  },
  {
    id: 'mock-h3',
    domain: 'negocioonline.net',
    provider: 'Bluehost',
    paymentType: 'Mensual',
    includesHosting: true,
    registrationDate: new Date('2024-02-05'),
    baseCost: 12.99,
    maintenanceFee: 2.50,
    totalCost: 15.49,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: 'mock-h4',
    domain: 'tiendaonline.shop',
    provider: 'SiteGround',
    paymentType: 'Anual',
    includesHosting: true,
    registrationDate: new Date('2024-04-01'),
    baseCost: 120.00,
    maintenanceFee: 12.00,
    totalCost: 132.00,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01')
  },
  {
    id: 'mock-h5',
    domain: 'portafolio.dev',
    provider: 'DigitalOcean',
    paymentType: 'Mensual',
    includesHosting: true,
    registrationDate: new Date('2024-01-30'),
    baseCost: 5.00,
    maintenanceFee: 1.00,
    totalCost: 6.00,
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30')
  }
];

export const mockNotifications = [
  // Notificaciones por email
  {
    id: 'mock-n1',
    type: 'DOMAIN',
    domain: 'ejemplo.com',
    provider: 'GoDaddy',
    notificationDate: new Date('2025-01-01'),
    notificationMethod: 'EMAIL',
    sent: true,
    sentAt: new Date('2025-01-01T10:00:00Z'),
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: 'mock-n2',
    type: 'HOSTING',
    domain: 'miweb.cl',
    provider: 'HostGator',
    notificationDate: new Date('2025-02-15'),
    notificationMethod: 'EMAIL',
    sent: true,
    sentAt: new Date('2025-02-15T09:30:00Z'),
    createdAt: new Date('2025-02-15'),
    updatedAt: new Date('2025-02-15')
  },
  {
    id: 'mock-n3',
    type: 'DOMAIN',
    domain: 'negocioonline.net',
    provider: 'Namecheap',
    notificationDate: new Date('2025-03-10'),
    notificationMethod: 'EMAIL',
    sent: true,
    sentAt: new Date('2025-03-10T14:20:00Z'),
    createdAt: new Date('2025-03-10'),
    updatedAt: new Date('2025-03-10')
  },
  // Notificaciones por WhatsApp
  {
    id: 'mock-n4',
    type: 'HOSTING',
    domain: 'tiendaonline.shop',
    provider: 'SiteGround',
    notificationDate: new Date('2025-04-05'),
    notificationMethod: 'WHATSAPP',
    sent: true,
    sentAt: new Date('2025-04-05T11:15:00Z'),
    createdAt: new Date('2025-04-05'),
    updatedAt: new Date('2025-04-05')
  },
  {
    id: 'mock-n5',
    type: 'DOMAIN',
    domain: 'portafolio.dev',
    provider: 'Google Domains',
    notificationDate: new Date('2025-05-20'),
    notificationMethod: 'WHATSAPP',
    sent: true,
    sentAt: new Date('2025-05-20T16:45:00Z'),
    createdAt: new Date('2025-05-20'),
    updatedAt: new Date('2025-05-20')
  },
  {
    id: 'mock-n6',
    type: 'HOSTING',
    domain: 'ejemplo.com',
    provider: 'Hostinger',
    notificationDate: new Date('2025-06-01'),
    notificationMethod: 'WHATSAPP',
    sent: true,
    sentAt: new Date('2025-06-01T10:00:00Z'),
    createdAt: new Date('2025-06-01'),
    updatedAt: new Date('2025-06-01')
  },
  {
    id: 'mock-n7',
    type: 'DOMAIN',
    domain: 'miweb.cl',
    provider: 'Namecheap',
    notificationDate: new Date('2025-06-10'),
    notificationMethod: 'WHATSAPP',
    sent: true,
    sentAt: new Date('2025-06-10T15:30:00Z'),
    createdAt: new Date('2025-06-10'),
    updatedAt: new Date('2025-06-10')
  },
  {
    id: 'mock-n8',
    type: 'HOSTING',
    domain: 'negocioonline.net',
    provider: 'Bluehost',
    notificationDate: new Date('2025-06-15'),
    notificationMethod: 'WHATSAPP',
    sent: true,
    sentAt: new Date('2025-06-15T11:20:00Z'),
    createdAt: new Date('2025-06-15'),
    updatedAt: new Date('2025-06-15')
  }
];

// Función para obtener datos mock con un pequeño retardo para simular una petición a la API
export async function fetchMockData<T>(data: T[], delay = 500): Promise<T[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(data)));
    }, delay);
  });
}
