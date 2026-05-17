# 📚 Índice de Documentación - Sistema IoT Cocina

## 🎯 Inicio Rápido

Dependiendo de tu plataforma, elige la guía apropiada:

### 🪟 En Windows
👉 **[SETUP_WINDOWS.md](SETUP_WINDOWS.md)** - Guía paso a paso para Windows 10/11

### 🐧 En Linux/Mac
👉 **[README_EJECUCION.md](README_EJECUCION.md)** - Guía general para todas las plataformas

---

## 📖 Documentación por Componente

### Backend
- 📄 [Backend_cocina/README.md](Backend_cocina/README.md) - Documentación del API
- ⚙️ [Backend_cocina/.env.example](Backend_cocina/.env.example) - Variables de entorno

### Frontend
- 📄 [frontend/cocina-frontend/README.md](frontend/cocina-frontend/README.md) - Documentación del Frontend
- ⚙️ [frontend/cocina-frontend/.env.example](frontend/cocina-frontend/.env.example) - Variables de entorno

---

## 🧪 Pruebas

### Windows (PowerShell)
```powershell
.\test_integration.ps1
```

### Linux/Mac (Bash)
```bash
bash test_integration.sh
```

---

## 🚀 Pasos Generales

### 1. **Backend** (Terminal 1)
```powershell
cd Backend_cocina
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. **Frontend** (Terminal 2)
```powershell
cd frontend\cocina-frontend
npm install
npm run dev
```

### 3. **Abrir Navegador**
```
http://localhost:5173
```

---

## 📋 Archivos Configuración

| Archivo | Descripción | Ubicación |
|---------|-------------|-----------|
| `.env.example` | Variables de entorno Backend | `Backend_cocina/` |
| `.env.example` | Variables de entorno Frontend | `frontend/cocina-frontend/` |
| `vite.config.js` | Configuración Vite con proxy | `frontend/cocina-frontend/` |
| `settings.py` | Configuración Django con paginación | `Backend_cocina/backend/` |

---

## 🔗 Rutas API

```
GET  /api/lecturas/              Todas las lecturas (paginadas)
GET  /api/lecturas/ultima/       Última lectura
GET  /api/lecturas/alertas/      Solo alertas
GET  /api/lecturas/resumen/      Resumen del sistema
POST /api/lecturas/              Crear nueva lectura
```

---

## ✨ Características Implementadas

✅ **Backend**
- Django REST Framework
- CORS configurado
- Paginación automática (100 items/página)
- 4 rutas principales + filtrado

✅ **Frontend**
- React con Vite
- Actualización cada 5 segundos
- Proxy automático para desarrollo
- 6 funciones API en `services/api.js`
- Dashboard con gráficas
- Alertas en tiempo real
- Historial completo

✅ **Documentación**
- Guía completa de ejecución
- Guía específica para Windows
- README actualizado para cada componente
- Scripts de prueba

---

## 🆘 Solucionar Problemas

1. **Backend no responde**: Verificar que `python manage.py runserver` está ejecutándose
2. **Frontend en blanco**: Abrir DevTools (F12) → Console → Ver errores
3. **Puerto en uso**: Cambiar puerto en `manage.py runserver 8001`
4. **CORS error**: Verificar `CORS_ALLOWED_ORIGINS` en `settings.py`

Más detalles en las guías específicas.

---

## 📞 Contacto

Para problemas específicos de:
- **Backend**: Revisar [Backend_cocina/README.md](Backend_cocina/README.md)
- **Frontend**: Revisar [frontend/cocina-frontend/README.md](frontend/cocina-frontend/README.md)
- **Integración**: Revisar [README_EJECUCION.md](README_EJECUCION.md)
- **Windows**: Revisar [SETUP_WINDOWS.md](SETUP_WINDOWS.md)

---

**¡Sistema listo para usar! 🎉**

Última actualización: 11 de mayo de 2026
