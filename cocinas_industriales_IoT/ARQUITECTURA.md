# 🏗️ Arquitectura del Sistema IoT Cocina

Diagrama y explicación de cómo funciona el sistema integrado.

## 📊 Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR WEB                            │
│                    http://localhost:5173                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND (React + Vite)                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │  │
│  │  │ Dashboard    │  │ Alertas      │  │ Historial    │     │  │
│  │  │ - Temperatura│  │ - Listado    │  │ - Tabla      │     │  │
│  │  │ - Gas        │  │ - Filtrado   │  │ - Búsqueda   │     │  │
│  │  │ - Ventilador │  │              │  │              │     │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              ↓                                    │
│                    services/api.js (Axios)                        │
│                              ↓                                    │
│                    HTTP Requests/Responses                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌──────────────────────┐
                    │  PROXY VITE (Dev)    │
                    │  :5173 → :8000       │
                    └──────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Django)                            │
│                   http://localhost:8000                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              API REST (Django REST Framework)              │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Rutas:                                             │  │  │
│  │  │  GET  /api/lecturas/          → Lista pagada      │  │  │
│  │  │  GET  /api/lecturas/ultima/   → Última lectura    │  │  │
│  │  │  GET  /api/lecturas/alertas/  → Solo alertas      │  │  │
│  │  │  GET  /api/lecturas/resumen/  → Resumen estado    │  │  │
│  │  │  POST /api/lecturas/          → Crear lectura     │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  ViewSets & Serializers:                           │  │  │
│  │  │  - LecturaViewSet                                  │  │  │
│  │  │  - LecturaSerializer                              │  │  │
│  │  │  - AlertaSerializer                               │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              ↓                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              MODELS & DATABASE                            │  │
│  │                                                             │  │
│  │  Lectura (Model):                                          │  │
│  │  - temperatura (Float)                                     │  │
│  │  - nivel_gas (Integer)                                     │  │
│  │  - llama_detectada (Boolean)                              │  │
│  │  - ventilador_extraccion (Boolean)                        │  │
│  │  - ventilador_inyeccion_1 (Boolean)                       │  │
│  │  - ventilador_inyeccion_2 (Boolean)                       │  │
│  │  - estado_sistema (CharField)                            │  │
│  │  - timestamp (DateTime - Indexed)                        │  │
│  │                                                             │  │
│  │  Database: SQLite3 (db.sqlite3)                            │  │
│  │  [Configurable a PostgreSQL en .env]                       │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   DISPOSITIVOS EXTERNOS                          │
│                                                                   │
│  ┌─────────────────┐         ┌─────────────────┐               │
│  │     ESP32       │         │   App Móvil     │               │
│  │   (Sensores)    │         │   (Futuro)      │               │
│  │                 │         │                 │               │
│  │ - Temperatura   │         │ - Consultar     │               │
│  │ - Gas           │         │ - Ver alertas   │               │
│  │ - Llama         │         │                 │               │
│  │                 │         │                 │               │
│  └────────┬────────┘         └─────────────────┘               │
│           │                                                      │
│      POST /api/lecturas/                                        │
│           │                                                      │
└───────────┴──────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos

### 1. **Lectura Normal del Sistema**

```
Cliente (Navegador)
        ↓
[1] onClick → Cargar datos
        ↓
[2] Axios GET /api/lecturas/ultima/
        ↓
Backend recibe petición
        ↓
[3] LecturaViewSet.ultima() ejecuta
        ↓
[4] Query: Lectura.objects.latest('timestamp')
        ↓
[5] LecturaSerializer serializa
        ↓
[6] Response JSON → Backend
        ↓
Axios intercepta respuesta
        ↓
[7] useState → setLectura(datos)
        ↓
[8] Componentes React re-renderean
        ↓
Usuario ve datos actualizados
```

### 2. **Crear Lectura (ESP32 → Backend → Frontend)**

```
ESP32 envía POST
        ↓
Backend recibe en /api/lecturas/
        ↓
[1] LecturaViewSet.create() ejecuta
        ↓
[2] Serializer valida datos
        ↓
[3] Lectura.objects.create()
        ↓
[4] Guarda en DB.sqlite3
        ↓
[5] Response con ID + datos
        ↓
Frontend actualiza cada 5 segundos
        ↓
[1] GET /api/lecturas/ultima/ → obtiene nueva lectura
        ↓
[2] Dashboard muestra datos actualizados
        ↓
Usuario ve cambios en tiempo real
```

### 3. **Filtrar Alertas**

```
Usuario hace click "Mostrar alertas"
        ↓
Frontend: crearAlerta.js → queryParams tipo="EMERGENCIA"
        ↓
GET /api/lecturas/alertas/?tipo=EMERGENCIA
        ↓
Backend: views.py → alertas_query.filter(estado_sistema='EMERGENCIA')
        ↓
Solo devuelve lecturas que son alertas
        ↓
Frontend renderea en página Alertas
```

---

## 🎯 Componentes Clave

### Backend

| Componente | Ubicación | Función |
|-----------|-----------|---------|
| LecturaViewSet | cocina/views.py | Gestiona requests HTTP |
| LecturaSerializer | cocina/serializers.py | Convierte Model → JSON |
| Lectura Model | cocina/models.py | Estructura de datos |
| urls.py | cocina/urls.py | Rutas URL |
| settings.py | backend/settings.py | Configuración global |

### Frontend

| Componente | Ubicación | Función |
|-----------|-----------|---------|
| api.js | src/services/api.js | Cliente HTTP (Axios) |
| Dashboard | src/components/Dashboard.jsx | Página principal |
| LecturaActual | src/components/LecturaActual.jsx | Muestra datos actuales |
| Alertas | src/components/Alertas.jsx | Muestra estado alertas |
| App | src/App.jsx | Router principal |

---

## 🔐 Seguridad

### CORS (Cross-Origin Resource Sharing)

```
Frontend (localhost:5173) ← CORS ← Backend (localhost:8000)
   ↑
   └─ CORS_ALLOWED_ORIGINS en settings.py
      [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        ...
      ]
```

### Autenticación (Configurada pero opcional)

- SessionAuthentication: Cookies
- JWT: Token en header Authorization
- AllowAny: Por defecto (desarrollo)

---

## 🚀 Estados del Sistema

```
┌──────────────┐
│    NORMAL    │ ← Temperatura OK, Gas OK, Sin llama
└──────────────┘
       ↓
┌──────────────────────┐
│ TEMPERATURA_ALTA     │ ← Temperatura > límite
└──────────────────────┘
       ↓
┌──────────────────────┐
│  GAS_DETECTADO       │ ← Nivel gas > límite
└──────────────────────┘
       ↓
┌──────────────────────┐
│ LLAMA_DETECTADA      │ ← Sensores detectan llama
└──────────────────────┘
       ↓
┌──────────────────────┐
│    EMERGENCIA        │ ← Combinación crítica
└──────────────────────┘
```

---

## ⏱️ Ciclo de Actualización

```
┌────────────────────────────────────────────────┐
│  Frontend carga (useEffect)                    │
│  ↓                                             │
│  Llama obtenerUltimaLectura()                 │
│  ↓                                             │
│  setState(lectura)                            │
│  ↓                                             │
│  Renderea UI                                  │
│  ↓                                             │
│  Espera 5 segundos (setInterval)             │
│  ↓                                             │
│  Vuelve al inicio (loop infinito)            │
└────────────────────────────────────────────────┘
```

---

## 📦 Stack Tecnológico

### Backend
```
Python 3.9+
├── Django 5.2.7
├── Django REST Framework 3.15.2
├── django-cors-headers 4.4.0
├── django-filter 25.1
└── SQLite3 / PostgreSQL
```

### Frontend
```
Node.js 16+
├── React 19
├── Vite 8
├── Axios 1.6.0
├── React Router 7.15.0
├── Recharts 2.10.0
└── ESLint
```

---

## 🔗 Integración de Terceros (Futuro)

```
┌─────────────────────────────────────────────────┐
│         Dashboard Frontend Actual                │
│         (localhost:5173)                        │
└─────────────────────────────────────────────────┘
                    ↓
                    ↓ (Puede servir datos a)
                    ↓
┌──────────────────────────────────────────────────────┐
│  Posibles Integraciones:                             │
│  - App móvil (iOS/Android)                          │
│  - Otro dashboard (escritorio)                      │
│  - Sistema de alertas (Email/SMS)                   │
│  - Integración con cloud (Azure, AWS)              │
│  - Base de datos de reporting (Power BI)           │
└──────────────────────────────────────────────────────┘
```

---

## 📊 Flujo de Datos en Tiempo Real (Cada 5 segundos)

```
Tiempo: 0s
├─ GET /api/lecturas/ultima/
├─ GET /api/lecturas/alertas/
└─ Renderear UI
   ↓
Tiempo: 5s
├─ GET /api/lecturas/ultima/          ← Nuevos datos
├─ GET /api/lecturas/alertas/         ← Nuevas alertas
└─ Renderear UI con datos actualizados
   ↓
Tiempo: 10s
├─ GET /api/lecturas/ultima/
├─ GET /api/lecturas/alertas/
└─ Renderear UI
   ↓
... (continúa indefinidamente)
```

---

## 🎨 Arquitectura de Componentes Frontend

```
┌─────────────────────────────────────────┐
│         App.jsx (Router)                │
│                                         │
│  ├─ Navbar.jsx                         │
│  │  └─ Links a páginas                 │
│  │                                     │
│  ├─ DashboardPage.jsx                  │
│  │  └─ Dashboard.jsx                   │
│  │     ├─ LecturaActual.jsx            │
│  │     ├─ EstadoVentiladores.jsx       │
│  │     ├─ Alertas.jsx                  │
│  │     ├─ Graficas.jsx                 │
│  │     └─ HistorialLecturas.jsx        │
│  │                                     │
│  ├─ AlertasPage.jsx                    │
│  │  └─ (Listado de alertas)            │
│  │                                     │
│  └─ HistorialPage.jsx                  │
│     └─ (Tabla historial)               │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🌊 Despliegue en Producción (Futuro)

```
┌──────────────────────────────────────────────────────┐
│           Servidor Producción                        │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  Frontend (Build estático en nginx)            │ │
│  │  - npm run build → dist/                       │ │
│  │  - Servido por nginx en :80                    │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  Backend (Gunicorn + Supervisor)               │ │
│  │  - gunicorn backend.wsgi:application           │ │
│  │  - Escuchando en :8000                         │ │
│  │  - PostgreSQL en RDS                           │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  Base de Datos (PostgreSQL)                    │ │
│  │  - Replicación automática                      │ │
│  │  - Backups diarios                             │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

**Arquitectura Actual: Desarrollo Local** ✨

Cada componente está claramente separado permitiendo desarrollo independiente y
escalable a futuro.
