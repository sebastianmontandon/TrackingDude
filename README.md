# TrackingDude - Gestión de Dominios y Hosting

Una aplicación moderna para gestionar dominios, servicios de hosting y notificaciones, construida con Next.js 14 y Tailwind CSS.

## 🚀 Características

- **Dashboard Moderno**: Interfaz limpia y moderna con estadísticas en tiempo real
- **Modo Oscuro/Claro**: Alternador de tema con detección automática de preferencia del sistema
- **Layout Vertical**: Secciones organizadas de arriba hacia abajo para mejor flujo de trabajo
- **Gestión de Dominios**: Agregar, editar y monitorear dominios con verificación de disponibilidad
- **Gestión de Hosting**: Administrar servicios de hosting y servidores
- **Sistema de Notificaciones**: Centro centralizado para todas las alertas y notificaciones
- **Diseño Responsivo**: Optimizado para desktop, tablet y móvil
- **Formularios Modernos**: Formularios bien alineados con validación en tiempo real
- **Transiciones Suaves**: Animaciones fluidas para cambios de tema y interacciones

## 🌙 Modo Oscuro

La aplicación incluye un sistema completo de modo oscuro con:

- **Toggle en Sidebar**: Botón para alternar entre modo claro y oscuro
- **Detección Automática**: Respeta la preferencia del sistema operativo
- **Persistencia**: Guarda la preferencia del usuario en localStorage
- **Transiciones Suaves**: Cambios de tema con animaciones fluidas
- **Optimización Visual**: Colores y contrastes optimizados para ambos modos

### Cómo usar el Modo Oscuro:
1. Haz clic en el icono de luna/sol en la parte superior derecha del sidebar
2. El tema se aplicará inmediatamente con transiciones suaves
3. Tu preferencia se guardará automáticamente

## 🛠️ Tecnologías

- **Next.js 14** - Framework de React con App Router
- **TypeScript** - Tipado estático para mejor desarrollo
- **Tailwind CSS** - Framework de CSS utilitario
- **Lucide React** - Iconos modernos y consistentes
- **Date-fns** - Manipulación de fechas
- **Recharts** - Gráficos y visualizaciones
- **Radix UI** - Componentes accesibles y sin estilos

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd TrackingDude
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales y variables CSS
│   ├── layout.tsx         # Layout principal con ThemeProvider
│   └── page.tsx           # Página principal
├── components/            # Componentes reutilizables
│   ├── pages/            # Componentes de páginas
│   │   ├── Dashboard.tsx # Dashboard con layout vertical
│   │   ├── Hosting.tsx   # Gestión de hosting
│   │   └── Notifications.tsx # Centro de notificaciones
│   ├── DomainForm.tsx    # Formulario de dominios modernizado
│   ├── DomainTable.tsx   # Tabla de dominios con modo oscuro
│   ├── HostingForm.tsx   # Formulario de hosting
│   ├── HostingTable.tsx  # Tabla de hosting modernizada
│   ├── NotificationTable.tsx # Tabla de notificaciones
│   ├── Sidebar.tsx       # Barra lateral con theme toggle
│   ├── StatisticsCards.tsx # Tarjetas de estadísticas mejoradas
│   └── ThemeToggle.tsx   # Componente para alternar tema
├── contexts/             # Contextos de React
│   ├── DomainContext.tsx
│   ├── HostingContext.tsx
│   ├── NotificationContext.tsx
│   └── ThemeContext.tsx  # Contexto para manejo de temas
└── lib/
    └── utils.ts          # Utilidades para CSS
```

## 🎨 Sistema de Diseño

### Colores
El proyecto utiliza un sistema de colores basado en variables CSS que soporta temas claro y oscuro:

- **Primary**: Azul principal para acciones importantes
- **Secondary**: Gris para elementos secundarios
- **Muted**: Colores apagados para texto secundario
- **Border**: Bordes sutiles
- **Card**: Fondo de tarjetas y componentes
- **Accent**: Color de énfasis para hover y focus

### Modo Oscuro
Variables CSS específicas para modo oscuro con:
- Fondos oscuros optimizados
- Texto con contraste adecuado
- Bordes sutiles
- Colores de acento adaptados

### Componentes de Formulario
Clases CSS personalizadas para formularios consistentes:

- `.form-section`: Contenedor principal de formularios
- `.form-group`: Grupo de campos
- `.form-label`: Etiquetas de campos
- `.form-input`: Campos de entrada
- `.btn-primary`: Botón principal
- `.btn-secondary`: Botón secundario

## 📱 Características de la Interfaz

### Layout Vertical
- **Dashboard**: Secciones organizadas de arriba hacia abajo
- **Flujo Natural**: Navegación intuitiva siguiendo patrones de lectura
- **Separación Clara**: Cada sección tiene su propio espacio definido
- **Títulos Descriptivos**: Headers claros para cada sección

### Dashboard
- **4 Tarjetas de Estadísticas**: Total, Activos, Por Vencer y Vencidos
- **Formulario de Dominios**: Sección dedicada para agregar nuevos dominios
- **Tabla de Dominios**: Lista completa con funciones de ordenamiento
- **Diseño Responsivo**: Se adapta a diferentes tamaños de pantalla

### Gestión de Dominios
- **Verificación de Disponibilidad**: Integración con API de Hostinger (simulada)
- **Estados Visuales**: Indicadores de color para dominios activos, por vencer y vencidos
- **Formulario Moderno**: Campos bien organizados con validación en tiempo real
- **Tabla Interactiva**: Ordenamiento por cualquier columna

### Gestión de Hosting
- **Selección de Dominios**: Dropdown con dominios existentes
- **Cálculo Automático**: Tarifas de mantenimiento calculadas automáticamente
- **Tipos de Pago**: Badges de colores para diferentes tipos de pago
- **Indicadores Visuales**: Iconos para servicios que incluyen hosting

### Centro de Notificaciones
- **Vista Unificada**: Todas las notificaciones en un solo lugar
- **Filtrado por Tipo**: Separación entre notificaciones de dominios y hosting
- **Diseño Limpio**: Tablas modernas con información clara
- **Layout Vertical**: Secciones separadas para mejor organización

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en modo producción
- `npm run lint` - Ejecuta el linter de código

## 🚀 Migración y Mejoras Recientes

### Migración de Vite a Next.js 14
Este proyecto fue migrado exitosamente de Vite a Next.js 14 con mejoras significativas:

#### Cambios Principales
1. **Estructura de Archivos**: Migración al App Router de Next.js
2. **Configuración**: Nuevos archivos de configuración para Next.js
3. **Estilos**: Sistema de variables CSS mejorado
4. **Componentes**: Directiva `'use client'` agregada donde es necesario
5. **Formularios**: Mejor alineación y diseño responsivo

### Nuevas Características v2.0
1. **Modo Oscuro Completo**: Sistema de temas con toggle y persistencia
2. **Layout Vertical**: Reorganización de secciones para mejor UX
3. **Transiciones Suaves**: Animaciones fluidas en todos los componentes
4. **Componentes Modernizados**: Tablas y formularios con mejor diseño
5. **Scrollbar Personalizado**: Adaptado para ambos modos de tema

### Beneficios de las Mejoras
- **UX Mejorada**: Layout más intuitivo y navegación natural
- **Accesibilidad**: Modo oscuro para reducir fatiga visual
- **Performance**: Optimizaciones automáticas de Next.js
- **Mantenibilidad**: Código más limpio y organizado
- **Escalabilidad**: Estructura robusta para crecimiento futuro

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ para la gestión eficiente de dominios y hosting.

---

## 🎉 Estado Actual

✅ **Migración Completa a Next.js 14**  
✅ **Modo Oscuro Implementado**  
✅ **Layout Vertical Reorganizado**  
✅ **Formularios Modernizados**  
✅ **Tablas Interactivas Mejoradas**  
✅ **Sistema de Temas Persistente**  
✅ **Transiciones Suaves**  
✅ **Diseño Responsivo Optimizado**

¡La aplicación está lista para usar con todas las nuevas características! 