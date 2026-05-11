# 🍳 Sistema de Monitoreo IoT - Cocina Industrial

Guía completa para ejecutar el sistema integrado de **Backend + Frontend**.

## 📋 Requisitos Previos

### Para el Backend
- Python 3.9+
- pip (gestor de paquetes Python)
- PostgreSQL 12+ (opcional - por defecto usa SQLite3)

### Para el Frontend
- Node.js 16+
- npm o yarn

## 🚀 Instalación y Ejecución

### Paso 1: Configurar el Backend

#### 1.1 Navegar a la carpeta del backend
```bash
cd Backend_cocina
```

#### 1.2 Crear y activar virtual environment
```bash
# En Windows:
python -m venv venv
venv\Scripts\activate

# En Linux/Mac:
python -m venv venv
source venv/bin/activate
```

#### 1.3 Instalar dependencias
```bash
pip install -r requirements.txt
```

#### 1.4 Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tu editor favorito
# (Por defecto usa SQLite3, que no requiere configuración especial)
```

Si quieres usar PostgreSQL, edita `.env`:
```env
DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=cocina_db
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_contraseña
```

#### 1.5 Realizar migraciones de base de datos
```bash
python manage.py makemigrations
python manage.py migrate
```

#### 1.6 (Opcional) Crear superusuario para admin
```bash
python manage.py createsuperuser
# Seguir las instrucciones en pantalla
```

#### 1.7 Ejecutar servidor Django
```bash
python manage.py runserver
```

✅ El backend estará disponible en: **http://localhost:8000**

- API: http://localhost:8000/api/
- Admin Panel: http://localhost:8000/admin/

### Paso 2: Configurar el Frontend

#### 2.1 Abrir otra terminal y navegar a frontend
```bash
cd frontend/cocina-frontend
```

#### 2.2 Instalar dependencias
```bash
npm install
```

#### 2.3 Ejecutar servidor de desarrollo
```bash
npm run dev
```

✅ El frontend estará disponible en: **http://localhost:5173** (o el puerto que indique Vite)

---

## 🔗 Verificar Conexión Backend-Frontend

### 1. Abrir el Frontend
Accede a: **http://localhost:5173**

### 2. Abrir DevTools (F12)
Observa la consola para:
- ✅ Mensajes de "Cargando..." si está conectando al backend
- ✅ Los datos mostrados en pantalla

### 3. Probar API directamente
```bash
# Obtener última lectura
curl http://localhost:8000/api/lecturas/ultima/

# Obtener resumen
curl http://localhost:8000/api/lecturas/resumen/

# Obtener alertas
curl http://localhost:8000/api/lecturas/alertas/
```

---

## 📊 Rutas API Disponibles

### Lecturas
- **GET** `/api/lecturas/` - Todas las lecturas
- **GET** `/api/lecturas/ultima/` - Última lectura
- **POST** `/api/lecturas/` - Crear nueva lectura

### Alertas
- **GET** `/api/lecturas/alertas/` - Todas las alertas
- **GET** `/api/lecturas/alertas/?tipo=EMERGENCIA` - Filtrar por tipo

### Estado del Sistema
- **GET** `/api/lecturas/resumen/` - Resumen actual del sistema

---

## 🔄 Pruebas Rápidas

### Crear una lectura de prueba
```bash
curl -X POST http://localhost:8000/api/lecturas/ \
  -H "Content-Type: application/json" \
  -d '{
    "temperatura": 32.5,
    "nivel_gas": 420,
    "llama_detectada": false,
    "ventilador_extraccion": true,
    "ventilador_inyeccion_1": true,
    "ventilador_inyeccion_2": false,
    "estado_sistema": "NORMAL"
  }'
```

### Ver el estado actual en frontend
El frontend se actualizará automáticamente cada 5 segundos mostrando:
- Temperatura actual
- Nivel de gas
- Estado de ventiladores
- Alertas activas

---

## 🛠️ Troubleshooting

### Problema: "Error al conectar con el servidor"

**Solución 1:** Verificar que el backend está ejecutándose
```bash
# En terminal del backend, deberías ver:
# Starting development server at http://127.0.0.1:8000/
```

**Solución 2:** Verificar CORS en settings.py
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",  # puerto de Vite
    "http://127.0.0.1:5173",
]
```

**Solución 3:** Limpiar caché del navegador (Ctrl+Shift+R)

### Problema: "ModuleNotFoundError: No module named 'django'"

**Solución:**
```bash
# Asegúrate de que venv está activado
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

# Luego instala de nuevo
pip install -r requirements.txt
```

### Problema: Base de datos vacía

**Solución:**
```bash
# Vuelve a ejecutar las migraciones
python manage.py migrate

# O borra la DB y comienza de nuevo:
rm db.sqlite3
python manage.py migrate
```

---

## 📱 Integración con ESP32

El ESP32 puede enviar datos al backend:

```cpp
// Ejemplo en Arduino/ESP32
POST /api/lecturas/
Content-Type: application/json

{
  "temperatura": 34.5,
  "nivel_gas": 420,
  "llama_detectada": false,
  "ventilador_extraccion": true,
  "ventilador_inyeccion_1": true,
  "ventilador_inyeccion_2": false,
  "estado_sistema": "NORMAL"
}
```

---

## 📁 Estructura del Proyecto

```
Proyecto_microcontroladores/
├── Backend_cocina/          # API REST Django
│   ├── cocina/              # App principal
│   ├── backend/             # Configuración
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── frontend/                # React + Vite
│   └── cocina-frontend/
│       ├── src/
│       │   ├── components/  # Componentes React
│       │   ├── pages/       # Páginas principales
│       │   ├── services/    # Servicios (api.js)
│       │   └── styles/      # Estilos CSS
│       ├── package.json
│       ├── vite.config.js
│       └── README.md
│
├── database_cocina.sql      # Schema de base de datos
└── README_EJECUCION.md      # Este archivo
```

---

## 🎯 Casos de Uso

### Desarrollo Local
```bash
# Terminal 1 (Backend)
cd Backend_cocina
source venv/bin/activate  # o: venv\Scripts\activate en Windows
python manage.py runserver

# Terminal 2 (Frontend)
cd frontend/cocina-frontend
npm run dev
```

### Pruebas de Producción
```bash
# Build del frontend
npm run build

# Ejecutar con gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

---

## 🔐 Configuración para Producción

### Backend
1. Cambiar `DEBUG=False` en `.env`
2. Configurar `SECRET_KEY` fuerte
3. Usar PostgreSQL en lugar de SQLite3
4. Configurar `ALLOWED_HOSTS` correctamente

### Frontend
1. Cambiar `API_BASE_URL` en `src/services/api.js` al dominio real
2. Ejecutar `npm run build`
3. Servir con un servidor web (nginx, Apache)

---

## 📞 Soporte

Para problemas específicos:
1. Revisa los logs del backend: `python manage.py runserver`
2. Abre DevTools en el navegador (F12) → Consola
3. Revisa el archivo de red (Network tab) para ver peticiones HTTP

---

## ✨ Características Implementadas

✅ API REST completa con Django REST Framework
✅ CORS habilitado para desarrollo local
✅ Componentes React funcionales con Hooks
✅ Actualización en tiempo real cada 5 segundos
✅ Datos de prueba si no hay conexión
✅ Respuesiva y amigable
✅ Rutas para filtrar por estado y tipo de alerta
✅ Panel de admin en Django

---

**¡Sistema listo para usar! 🎉**
