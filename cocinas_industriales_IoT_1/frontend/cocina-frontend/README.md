# Frontend - Sistema de Monitoreo IoT Cocina

Frontend moderno con React + Vite para el sistema de monitoreo de cocina industrial.

## 📋 Descripción

Interfaz web responsiva para visualizar en tiempo real:
- 📊 Lecturas actuales de sensores
- 📈 Gráficas de historial
- 🚨 Alertas del sistema
- 🌡️ Estado de ventiladores
- 📋 Historial completo de lecturas

## 🎯 Características

### Páginas
1. **Dashboard** - Vista principal con estado actual y gráficas
2. **Alertas** - Historial de todas las alertas generadas
3. **Historial** - Detalles completos de todas las lecturas

### Componentes
- `LecturaActual` - Mostrar última lectura con sensores
- `EstadoVentiladores` - Estado de los 3 ventiladores
- `Alertas` - Indicador visual de alertas
- `Graficas` - Gráficas de temperatura y gas
- `HistorialLecturas` - Tabla con historial
- `Navbar` - Navegación entre páginas

## 🚀 Instalación

### Requisitos
- Node.js 16+
- npm o yarn

### Pasos

1. **Instalar dependencias**
```bash
cd cocina-frontend
npm install
```

2. **Configurar URL del API** (en `src/services/api.js`)
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

3. **Ejecutar servidor de desarrollo**
```bash
npm run dev
```

El frontend estará en: `http://localhost:5173/`

## 🔧 Configuración

### Variables de Entorno (si las necesitas)
Crear archivo `.env` en la raíz del proyecto:
```
VITE_API_URL=http://localhost:8000/api
```

### Proxy de Desarrollo
El archivo `vite.config.js` incluye proxy automático para `/api`:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
},
```

## 🛠️ Comandos

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de la build
npm run preview

# Linting
npm run lint
```

## 📡 API Disponible (desde `src/services/api.js`)

```javascript
// Obtener última lectura
obtenerUltimaLectura()

// Obtener todas las lecturas
obtenerLecturas(limit)

// Obtener solo alertas
obtenerAlertas()

// Obtener resumen del sistema
obtenerResumen()

// Crear nueva lectura (para ESP32)
crearLectura(datos)

// Obtener alertas filtradas por tipo
obtenerAlertusPorTipo(tipo)

// Obtener lecturas filtradas por estado
obtenerLecturasPorEstado(estado)
```

## 🎨 Estilos

Los estilos CSS están organizados por componente:
- `App.css` - Estilos globales
- `Dashboard.css` - Estilos del dashboard
- `LecturaActual.css` - Lecturas actuales
- `Alertas.css` - Alertas
- Y más en `styles/`

## 📦 Tecnologías

- **React 19** - UI framework
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Router** - Routing
- **Recharts** - Gráficas
- **ESLint** - Linting

## 🚨 Notas Importantes

1. El frontend por defecto intenta conectar a `http://localhost:8000/api`
2. Si el backend no está disponible, usa datos de prueba automáticamente
3. Se actualiza cada 5 segundos
4. CORS debe estar habilitado en el backend

## 📝 Estructura de Proyecto

```
cocina-frontend/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Páginas principales
│   ├── services/       # Servicios (API, etc)
│   ├── styles/         # Estilos CSS
│   ├── App.jsx         # Componente principal
│   ├── main.jsx        # Entry point
│   └── index.css       # Estilos globales
├── public/             # Recursos estáticos
├── vite.config.js      # Configuración Vite
├── eslint.config.js    # Configuración ESLint
└── package.json        # Dependencias

```

## 🔗 Conexión con Backend

El frontend se conecta al backend a través de:
- **Desarrollo**: `http://localhost:8000/api` (con proxy Vite)
- **Producción**: Ajustar en `src/services/api.js`

### Flujo de Datos

```
ESP32 → Backend API → Frontend
                   ↓
              React State
                   ↓
              Componentes
                   ↓
              Usuario
```

## 📄 Licencia

Proyecto para Universidad Industrial de Santander

