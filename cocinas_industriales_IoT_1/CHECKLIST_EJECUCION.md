# ✅ Checklist de Ejecución - Sistema IoT Cocina

Usa esta lista de verificación para asegurar que todo está configurado correctamente.

## 📋 Antes de Ejecutar

### Verificar Requisitos
- [ ] Python 3.9+ instalado: `python --version`
- [ ] Node.js 16+ instalado: `node --version`
- [ ] npm instalado: `npm --version`
- [ ] Git instalado (opcional pero recomendado)

### Verificar Estructura de Carpetas
```
Proyecto_microcontroladores/
├── Backend_cocina/           ← Carpeta del backend
├── frontend/
│   └── cocina-frontend/      ← Carpeta del frontend
├── database_cocina.sql       ← SQL de referencia
├── SETUP_WINDOWS.md          ← Guía Windows
├── README_EJECUCION.md       ← Guía general
├── DOCUMENTACION.md          ← Índice de docs
├── CAMBIOS_TECNICOS.md       ← Cambios realizados
└── test_integration.ps1      ← Script de pruebas
```

- [ ] Todas las carpetas existen
- [ ] Archivo `manage.py` está en `Backend_cocina/`
- [ ] Archivo `package.json` está en `frontend/cocina-frontend/`

---

## 🚀 Instalación del Backend

### En Terminal 1

```powershell
# [ ] Navegar a Backend_cocina
cd Backend_cocina

# [ ] Crear virtual environment
python -m venv venv

# [ ] Activar virtual environment
.\venv\Scripts\activate
# Deberías ver (venv) al inicio de la línea

# [ ] Instalar dependencias
pip install -r requirements.txt
# Espera a que termine (1-2 minutos)

# [ ] Ejecutar migraciones
python manage.py migrate
# Deberías ver "OK"

# [ ] Iniciar servidor
python manage.py runserver
# Deberías ver: "Starting development server at http://127.0.0.1:8000/"
```

✅ Backend ejecutándose: No cierres esta terminal

---

## 🚀 Instalación del Frontend

### En Terminal 2 (NUEVA)

```powershell
# [ ] Navegar a frontend
cd frontend/cocina-frontend

# [ ] Instalar dependencias
npm install
# Espera a que termine (1-2 minutos)

# [ ] Iniciar servidor
npm run dev
# Deberías ver: "Local: http://localhost:5173/"
```

✅ Frontend ejecutándose: No cierres esta terminal

---

## 🧪 Prueba de Conexión

### En Terminal 3 (NUEVA)

```powershell
# [ ] Navegar a raíz del proyecto
cd ..\..

# [ ] Ejecutar script de pruebas
.\test_integration.ps1

# Deberías ver:
# ✅ Backend está corriendo
# ✅ GET /api/lecturas/ultima/ ... ✅
# ✅ GET /api/lecturas/resumen/ ... ✅
# ✅ GET /api/lecturas/alertas/ ... ✅
# ✅ POST /api/lecturas/ ... ✅
```

Si todos son ✅, continuamos

---

## 🌐 Abrir en Navegador

- [ ] Abrir navegador (Chrome, Firefox, Edge)
- [ ] Ir a: **http://localhost:5173**
- [ ] Deberías ver:
  - [ ] Navbar con 3 opciones (Dashboard, Alertas, Historial)
  - [ ] Dashboard con datos (aunque sean de prueba)
  - [ ] Secciones de:
    - [ ] Última Lectura (temperatura, gas, etc)
    - [ ] Estado de Ventiladores
    - [ ] Estado de Alertas
    - [ ] Gráficas

---

## 🔍 Verificación de Funcionamiento

### Prueba 1: Actualización Automática
- [ ] Espera 5 segundos
- [ ] Verifica que el timestamp cambió
- [ ] Las gráficas se actualizan

### Prueba 2: Navegación
- [ ] Click en "Dashboard" → Se carga
- [ ] Click en "Alertas" → Se carga
- [ ] Click en "Historial" → Se carga
- [ ] Vuelve a "Dashboard"

### Prueba 3: Crear Datos
En Terminal 3, crea una lectura con temperatura alta:
```powershell
$body = @{
    temperatura = 45.5
    nivel_gas = 450
    llama_detectada = $false
    ventilador_extraccion = $true
    ventilador_inyeccion_1 = $true
    ventilador_inyeccion_2 = $false
    estado_sistema = "TEMPERATURA_ALTA"
} | ConvertTo-Json

curl -X POST http://localhost:8000/api/lecturas/ `
  -H "Content-Type: application/json" `
  -Body $body
```

- [ ] Recibiste respuesta con ID
- [ ] En el navegador, el estado cambió a "TEMPERATURA_ALTA"
- [ ] El color cambió a naranja

---

## 🐛 Troubleshooting Quick

Si algo falla, revisa:

### ❌ Backend no responde
```powershell
# En Terminal 1:
# ¿Ves "Starting development server"?
# Si no: python manage.py runserver
```

### ❌ Frontend en blanco
```powershell
# En navegador, presiona F12 → Console
# ¿Hay errores rojos?
# Si sí: verifica URL en api.js es http://localhost:8000/api
```

### ❌ Puerto ocupado
```powershell
# Terminal 1 (Backend):
python manage.py runserver 8001

# En api.js cambiar:
# const API_BASE_URL = 'http://localhost:8001/api'
```

### ❌ npm no funciona
```powershell
npm cache clean --force
npm install
npm run dev
```

---

## 🎯 Uso Normal

### Cada día al iniciar:

Terminal 1:
```powershell
cd Backend_cocina
.\venv\Scripts\activate
python manage.py runserver
```

Terminal 2:
```powershell
cd frontend\cocina-frontend
npm run dev
```

Navegador:
```
http://localhost:5173
```

### Cuando termines:
```
Ctrl+C en cada terminal
```

---

## 📚 Documentación Disponible

Si necesitas ayuda, consulta:
- [ ] **SETUP_WINDOWS.md** - Detalles completos para Windows
- [ ] **README_EJECUCION.md** - Guía general
- [ ] **CAMBIOS_TECNICOS.md** - Qué se modificó
- [ ] **Backend_cocina/README.md** - Documentación API
- [ ] **frontend/cocina-frontend/README.md** - Documentación Frontend

---

## ✨ Próximos Pasos (Opcional)

- [ ] Leer `CAMBIOS_TECNICOS.md` para entender qué se hizo
- [ ] Conectar ESP32 para enviar datos reales
- [ ] Crear `.env` real (no `.env.example`)
- [ ] Configurar PostgreSQL (en lugar de SQLite3)
- [ ] Preparar para producción

---

## 📊 Estado Final

Si has completado todo este checklist y viste:
- ✅ Backend corriendo
- ✅ Frontend corriendo
- ✅ Datos en el navegador
- ✅ Pruebas de integración pasadas

**¡Tu sistema está 100% funcional! 🎉**

---

## 🆘 Soporte

Si algo no funciona:
1. Revisa la terminal para mensajes de error
2. Consulta la documentación relevante
3. Intenta el script `test_integration.ps1`
4. Verifica que ambas terminales siguen ejecutándose

**Recordatorio**: Nunca cierres las terminales del backend o frontend mientras estés usando el sistema.

---

**Checklist completado: 11 de mayo de 2026** ✨
