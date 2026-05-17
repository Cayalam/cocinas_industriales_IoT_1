# 🍳 Guía de Ejecución - Sistema de Monitoreo IoT (Windows)

Instrucciones paso a paso para ejecutar el sistema completo en **Windows 10/11**.

## 📋 Requisitos

### Instalar Python
1. Descargar desde https://www.python.org/downloads/
2. **IMPORTANTE**: Marcar ✅ "Add Python to PATH"
3. Instalar

### Instalar Node.js
1. Descargar desde https://nodejs.org/ (versión LTS recomendada)
2. Instalar
3. Verificar en PowerShell:
```powershell
node --version
npm --version
```

## 🚀 Ejecución Paso a Paso

### Paso 1: Backend en Terminal 1

#### 1. Abrir PowerShell en la carpeta del proyecto
```
Navega a: C:\Users\<TuUsuario>\OneDrive\...\Proyecto_microcontroladores\Backend_cocina
```

O abre PowerShell aquí:
```
Shift + Click Derecho → "Abrir PowerShell aquí"
```

#### 2. Crear y activar virtual environment
```powershell
python -m venv venv
.\venv\Scripts\activate
```

Verás: `(venv)` al inicio de la línea de comandos ✅

#### 3. Instalar dependencias
```powershell
pip install -r requirements.txt
```

Espera a que termine (puede tomar 1-2 minutos)

#### 4. Ejecutar migraciones
```powershell
python manage.py migrate
```

Debería mostrar: `Running migrations...` y luego `OK`

#### 5. Iniciar servidor Django
```powershell
python manage.py runserver
```

Verás:
```
Starting development server at http://127.0.0.1:8000/
```

✅ **Déjalo ejecutándose en esta terminal**

---

### Paso 2: Frontend en Terminal 2

#### 1. Abrir **OTRA** ventana de PowerShell
```
Navega a: C:\Users\<TuUsuario>\OneDrive\...\Proyecto_microcontroladores\frontend\cocina-frontend
```

#### 2. Instalar dependencias
```powershell
npm install
```

Espera a que termine (puede tomar unos minutos)

#### 3. Ejecutar servidor Vite
```powershell
npm run dev
```

Verás algo como:
```
 Local:   http://localhost:5173/
```

✅ **Déjalo ejecutándose en esta terminal**

---

### Paso 3: Abrir en Navegador

1. Abre un navegador (Chrome, Firefox, Edge)
2. Escribe: **http://localhost:5173**
3. ¡Deberías ver el dashboard! 🎉

---

## 🧪 Probar la Conexión

### Opción 1: Script de Prueba
En PowerShell (terminal 3), en la carpeta raíz del proyecto:
```powershell
.\test_integration.ps1
```

### Opción 2: Manual
```powershell
# Probar que backend responde
curl http://localhost:8000/api/lecturas/ultima/

# Debería mostrar JSON con datos
```

---

## ✨ Lo que Deberías Ver

### Dashboard
- 📊 Temperatura actual
- 🌡️ Nivel de gas
- 🔥 Detección de llama
- ⚡ Estado de ventiladores
- 🎨 Gráficas de histórico
- 🚨 Alertas activas

### Actualización
- Se actualiza cada 5 segundos automáticamente
- Si no hay datos, muestra valores de prueba

---

## 🛠️ Solucionar Problemas

### ❌ "No puedo instalar pip packages"
```powershell
# Actualizar pip
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### ❌ "El venv no se activa"
```powershell
# Cambiar política de ejecución
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\venv\Scripts\activate
```

### ❌ "npm install no funciona"
```powershell
# Limpiar caché
npm cache clean --force
npm install
```

### ❌ "Puerto 8000 ya está en uso"
```powershell
# Cambiar puerto
python manage.py runserver 8001
# Luego en api.js cambiar: const API_BASE_URL = 'http://localhost:8001/api'
```

### ❌ "Puerto 5173 no está disponible"
```powershell
# Vite automáticamente usa otro puerto, revisa la terminal
# Ejemplo: http://localhost:5174
```

### ❌ "Error: No hay base de datos"
```powershell
# Ejecutar nuevamente las migraciones
python manage.py migrate
```

---

## 📁 Estructura de Carpetas

```
C:\Users\<TuUsuario>\OneDrive\...\Proyecto_microcontroladores\
│
├── Backend_cocina/
│   ├── venv/              ← Virtual environment (IGNORAR en Git)
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   └── ...
│
├── frontend/
│   └── cocina-frontend/
│       ├── node_modules/  ← Paquetes Node (IGNORAR en Git)
│       ├── src/
│       ├── package.json
│       └── ...
│
├── README_EJECUCION.md    ← Guía general
├── SETUP_WINDOWS.md       ← Este archivo
└── test_integration.ps1   ← Script de pruebas
```

---

## 🔄 Flujo Normal de Trabajo

### Cada día:
```powershell
# Terminal 1 - Backend
cd Backend_cocina
.\venv\Scripts\activate
python manage.py runserver

# Terminal 2 - Frontend
cd frontend\cocina-frontend
npm run dev
```

### Abrir navegador:
```
http://localhost:5173
```

### Cuando termines:
```
Ctrl+C en cada terminal para detener los servidores
```

---

## 📚 Comandos Útiles

### Backend
```powershell
# Ver admin panel
http://localhost:8000/admin/

# Crear superusuario (usuario admin)
python manage.py createsuperuser

# Hacer migraciones si cambias modelos
python manage.py makemigrations
python manage.py migrate

# Borrar datos de prueba
python manage.py flush
```

### Frontend
```powershell
# Build para producción
npm run build

# Ver errores de linting
npm run lint

# Limpiar node_modules
rm node_modules -Recurse
npm install
```

---

## 🔐 Notas Importantes

1. ✅ El backend usa **SQLite3** por defecto (sin configuración adicional)
2. ✅ CORS está habilitado para `localhost:3000` y `localhost:5173`
3. ✅ Los datos de prueba se muestran si no hay conexión al backend
4. ✅ No edites `.env` sin guardar una copia
5. ⚠️ Nunca hagas commit de `.env` con credenciales reales

---

## 🚀 Próximos Pasos

1. ✅ Verificar que el sistema funciona
2. 📝 Conectar ESP32 para enviar datos reales
3. 🔧 Configurar PostgreSQL en lugar de SQLite (opcional)
4. 📦 Preparar para producción

---

**¡Sistema listo para usar! 🎉**

Si tienes dudas, revisa:
- README.md en Backend_cocina/
- README.md en frontend/cocina-frontend/
- README_EJECUCION.md (versión general)
