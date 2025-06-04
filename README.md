# TrackingDude - Gestión de Dominios y Hosting

Una aplicación moderna y completamente responsive para gestionar dominios, servicios de hosting y notificaciones, construida con Next.js 14 y Tailwind CSS.

## 🛠️ Tecnologías

- **Next.js 14** - Framework de React con App Router
- **TypeScript** - Tipado estático para desarrollo robusto
- **Tailwind CSS** - Framework CSS utilitario con sistema de diseño custom
- **Lucide React** - Iconos modernos y consistentes
- **React Context** - Gestión de estado global
- **CSS Grid & Flexbox** - Layouts avanzados y responsive

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

3. **Ejecuta el servidor de desarrollo:**
```bash
npm run dev
```

4. **Accede a la aplicación:**
   - Abre [http://localhost:3000](http://localhost:3000) en tu navegador
   - La aplicación se ejecuta también en puerto 3001 como alternativa

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/                      # App Router de Next.js 14
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
├── contexts/               # Gestión de estado global
│   ├── DomainContext.tsx   # Estado y operaciones de dominios
│   ├── HostingContext.tsx  # Estado y operaciones de hosting
│   └── NotificationContext.tsx # Estado y operaciones de notificaciones
└── public/
    └── favicon.png         # Favicon configurado automáticamente
```

## 📊 Características por Página

### 🏠 **Dashboard**
- **4 Tarjetas de Estadísticas**: Responsive grid 1→2→4 columnas
- **Formulario de Dominios**: Layout adaptativo con validación
- **Tabla de Dominios**: Ocultación progresiva de columnas
- **Información Móvil**: Datos secundarios en líneas adicionales

### 🖥️ **Gestión de Hosting**
- **Formulario Avanzado**: Grid responsive con selección de dominios
- **Tabla Optimizada**: Sin overflow horizontal en ninguna resolución
- **Distribución de Columnas**: Anchos específicos para cada tipo de datos
- **Indicadores Visuales**: Badges y iconos para estados y tipos

### 🔔 **Notificaciones**
- **Configuración Completa**: Formulario para programar notificaciones
- **Métodos Múltiples**: Radio buttons responsive para Email, SMS, WhatsApp, Push
- **Tablas Separadas**: Notificaciones de dominios y hosting independientes
- **Accesibilidad**: Labels correctamente asociados y navegación por teclado

## 🚀 Optimizaciones Implementadas

### ⚡ **Performance**
- **Componentes Optimizados**: Renderizado eficiente con React Context
- **CSS Minificado**: Tailwind CSS con purge automático
- **Imágenes Optimizadas**: Favicon PNG optimizado para web

### 🎯 **UX/UI**
- **Transiciones Suaves**: 200ms en todas las interacciones
- **Estados Hover**: Feedback visual inmediato
- **Loading States**: Elementos disabled durante operaciones
- **Feedback Visual**: Colores semánticos para estados

### ♿ **Accesibilidad**
- **Navegación por Teclado**: Todos los elementos interactivos accesibles
- **Labels Semánticos**: Asociaciones correctas entre labels e inputs
- **Contraste Optimizado**: Colores que cumplen estándares WCAG
- **Estructuras HTML**: Fieldsets, legends y roles apropiados

## 🔧 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (localhost:3000)
npm run build    # Build para producción
npm run start    # Servidor de producción
npm run lint     # Análisis de código
```

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

*Aplicación 100% responsive, optimizada para todos los dispositivos y tamaños de pantalla.* 