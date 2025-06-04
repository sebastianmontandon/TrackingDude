# TrackingDude - Gestión de Dominios y Hosting

Una aplicación moderna y completamente responsive para gestionar dominios, servicios de hosting y notificaciones, construida con Next.js 14, Tailwind CSS y base de datos PostgreSQL con Neon.

## 🛠️ Tecnologías

- **Next.js 14** - Framework de React con App Router
- **TypeScript** - Tipado estático para desarrollo robusto
- **Tailwind CSS** - Framework CSS utilitario con sistema de diseño custom
- **Prisma ORM** - ORM moderno para TypeScript y Node.js
- **PostgreSQL** - Base de datos relacional (Neon)
- **Lucide React** - Iconos modernos y consistentes
- **React Context** - Gestión de estado global
- **CSS Grid & Flexbox** - Layouts avanzados y responsive

## 🗄️ Configuración de Base de Datos

### Configurar Neon (Recomendado)

1. **Crear cuenta en Neon:**
   - Ve a [neon.tech](https://neon.tech)
   - Crea una cuenta gratuita
   - Crea un nuevo proyecto

2. **Obtener la URL de conexión:**
   - En tu dashboard de Neon, ve a "Connection Details"
   - Copia la URL de conexión que se ve así:
   ```
   postgresql://username:password@host:port/database?sslmode=require
   ```

3. **Configurar variables de entorno:**
   - Crea un archivo `.env.local` en la raíz del proyecto
   - Agrega tu URL de conexión:
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
   ```

### Configuración Local (Alternativa)

Si prefieres usar PostgreSQL local:

1. **Instalar PostgreSQL:**
   ```bash
   # En macOS con Homebrew
   brew install postgresql
   
   # En Ubuntu/Debian
   sudo apt-get install postgresql
   ```

2. **Crear base de datos:**
   ```bash
   createdb trackingdude
   ```

3. **Configurar variable de entorno:**
   ```env
   DATABASE_URL="postgresql://localhost:5432/trackingdude"
   ```

## 📦 Instalación y Uso

1. **Clona el repositorio:**
```bash
git clone <repository-url>
cd TrackingDude
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Configura la base de datos:**
```bash
# Generar el cliente de Prisma
npm run db:generate

# Crear las tablas en la base de datos
npm run db:push

# Poblar con datos de ejemplo (opcional)
npm run db:seed
```

4. **Ejecuta el servidor de desarrollo:**
```bash
npm run dev
```

5. **Accede a la aplicación:**
   - Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/                      # App Router de Next.js 14
│   ├── api/                 # API Routes para operaciones CRUD
│   │   ├── domains/         # Endpoints para dominios
│   │   ├── hostings/        # Endpoints para hostings
│   │   └── notifications/   # Endpoints para notificaciones
│   ├── globals.css          # Sistema de diseño CSS con clases responsive
│   ├── layout.tsx           # Layout principal con favicon configurado
│   └── page.tsx             # Página principal con sidebar responsive
├── components/              # Componentes modulares
│   ├── pages/              # Páginas principales (versión responsive)
│   │   ├── Dashboard.tsx   # Dashboard con estadísticas y gestión de dominios
│   │   ├── Hosting.tsx     # Gestión completa de servicios de hosting
│   │   └── Notifications.tsx # Centro de notificaciones con configuración
│   ├── DomainForm.tsx      # Formulario responsive de dominios
│   ├── DomainTable.tsx     # Tabla responsive con ocultación progresiva
│   ├── HostingForm.tsx     # Formulario adaptativo de hosting
│   ├── HostingTable.tsx    # Tabla optimizada sin overflow horizontal
│   ├── NotificationTable.tsx # Tabla de notificaciones con badges
│   ├── Sidebar.tsx         # Barra lateral colapsible
│   └── StatisticsCards.tsx # Tarjetas de estadísticas responsive
├── contexts/               # Gestión de estado global con APIs
│   ├── DomainContext.tsx   # Estado y operaciones de dominios
│   ├── HostingContext.tsx  # Estado y operaciones de hosting
│   └── NotificationContext.tsx # Estado y operaciones de notificaciones
├── lib/                    # Utilidades y configuraciones
│   └── prisma.ts          # Cliente de Prisma configurado
└── public/
    └── favicon.png         # Favicon configurado automáticamente

prisma/
├── schema.prisma          # Esquema de base de datos
└── seed.ts               # Script para poblar datos iniciales
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo (localhost:3000)
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Análisis de código

# Scripts de base de datos
npm run db:generate  # Generar cliente de Prisma
npm run db:push      # Sincronizar esquema con la base de datos
npm run db:studio    # Abrir Prisma Studio (interfaz visual)
npm run db:seed      # Poblar base de datos con datos de ejemplo
```

## 🚀 Optimizaciones Implementadas

### ⚡ **Performance**
- **Componentes Optimizados**: Renderizado eficiente con React Context
- **CSS Minificado**: Tailwind CSS con purge automático
- **API Optimizada**: Endpoints RESTful con manejo de errores
- **Base de Datos**: Consultas optimizadas con Prisma ORM

### 🎯 **UX/UI**
- **Transiciones Suaves**: 200ms en todas las interacciones
- **Estados Hover**: Feedback visual inmediato
- **Loading States**: Elementos disabled durante operaciones
- **Feedback Visual**: Colores semánticos para estados
- **Manejo de Errores**: Mensajes informativos para el usuario

### ♿ **Accesibilidad**
- **Navegación por Teclado**: Todos los elementos interactivos accesibles
- **Labels Semánticos**: Asociaciones correctas entre labels e inputs
- **Contraste Optimizado**: Colores que cumplen estándares WCAG
- **Estructuras HTML**: Fieldsets, legends y roles apropiados

## 🗃️ Modelo de Datos

### Dominios
- Información básica del dominio
- Fechas de creación y expiración
- Período de pago y sitio web asociado

### Hostings
- Proveedor y tipo de pago
- Costos base, mantenimiento y totales
- Relación con dominios

### Notificaciones
- Tipo (dominio o hosting)
- Método de notificación (Email, SMS, WhatsApp, Push)
- Fechas programadas

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**TrackingDude** - Desarrollado con ❤️ para la gestión eficiente y moderna de dominios y hosting.

---

*Aplicación 100% responsive, optimizada para todos los dispositivos y tamaños de pantalla con persistencia completa en PostgreSQL.* 