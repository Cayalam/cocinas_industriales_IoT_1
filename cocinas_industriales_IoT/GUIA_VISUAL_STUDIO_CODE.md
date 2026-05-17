# Guía: Cómo correr el proyecto desde Visual Studio Code

## Requisitos previos

Antes de comenzar, tener instalado:

- **Python 3.9+** → https://www.python.org/downloads/
- **Node.js 18+** → https://nodejs.org/
- **Visual Studio Code** → https://code.visualstudio.com/
- **Extensión Python** (de Microsoft) instalada en VS Code

---

## Paso 1 — Abrir el proyecto en VS Code

1. Abrir VS Code
2. Ir a **File → Open Folder...**
3. Seleccionar la carpeta `cocinas_industriales_IoT_1`
4. Hacer clic en **Open**

El explorador de la izquierda debe mostrar las carpetas `Backend_cocina/` y `frontend/`.

---

## Paso 2 — Abrir dos terminales integradas

VS Code permite tener varias terminales abiertas al mismo tiempo. Se necesitan dos: una para el backend y otra para el frontend.

1. Ir al menú **Terminal → New Terminal** (o presionar `` Ctrl+` ``)
2. Se abre la primera terminal en la parte inferior
3. Para abrir la segunda: hacer clic en el ícono **+** que aparece en la esquina superior derecha del panel de terminal

> **Consejo:** renombrar cada terminal "Backend" y "Frontend" para no confundirlas (clic derecho sobre el nombre).

---

## Paso 3 — Configurar y ejecutar el Backend

En la terminal **Backend**, ejecutar los siguientes comandos uno por uno:

### 3.1 Entrar a la carpeta del backend

```bash
cd Backend_cocina
```

### 3.2 Crear el entorno virtual

```bash
python -m venv venv
```

### 3.3 Activar el entorno virtual

En **Windows**:
```bash
venv\Scripts\activate
```

En **Mac / Linux**:
```bash
source venv/bin/activate
```

> El prompt de la terminal debe mostrar `(venv)` al inicio.

### 3.4 Instalar las dependencias

```bash
pip install -r requirements.txt
```

### 3.5 Crear el archivo de configuración

En **Windows**:
```bash
copy .env.example .env
```

En **Mac / Linux**:
```bash
cp .env.example .env
```

### 3.6 Crear la base de datos y aplicar migraciones

```bash
python manage.py migrate
```

La consola mostrará una lista de migraciones aplicadas, incluyendo la nueva tabla `Dispositivo`.

### 3.7 Crear el usuario administrador

```bash
python manage.py createsuperuser
```

El sistema pedirá:
- **Username** (ej: `admin`)
- **Email** (puede dejarse vacío)
- **Password** (mínimo 8 caracteres)

> Este usuario se usará para iniciar sesión en la aplicación web y en el panel de administración.

### 3.8 Registrar el primer ESP32 desde el panel de administración

Con el servidor corriendo (paso 3.9), abrir el navegador e ir a:

```
http://localhost:8000/admin/
```

1. Iniciar sesión con el usuario creado en el paso 3.7
2. Ir a **Cocina → Dispositivos ESP32 → Agregar**
3. Completar:
   - **Nombre:** `Cocina Planta 1`
   - **Código:** `ESP32-A1`
   - **Api key:** copiar y guardar esta clave — es la que va en el ESP32
   - **Ubicación:** `Área de cocción, piso 1`
   - **Activo:** ✓
   - **Usuarios:** seleccionar el usuario administrador
4. Hacer clic en **Guardar**

### 3.9 Iniciar el servidor Django

```bash
python manage.py runserver
```

Si todo está bien, la terminal muestra:

```
Starting development server at http://127.0.0.1:8000/
```

El backend está corriendo. **No cerrar esta terminal.**

---

## Paso 4 — Configurar y ejecutar el Frontend

En la terminal **Frontend**, ejecutar:

### 4.1 Entrar a la carpeta del frontend

```bash
cd frontend/cocina-frontend
```

### 4.2 Instalar las dependencias

```bash
npm install
```

> Este paso puede tomar 1-2 minutos la primera vez.

### 4.3 Iniciar el servidor de desarrollo

```bash
npm run dev
```

La terminal muestra:

```
  VITE v5.x.x  ready

  ➜  Local:   http://localhost:5173/
```

**No cerrar esta terminal.**

---

## Paso 5 — Usar la aplicación

### 5.1 Iniciar sesión

Abrir el navegador e ir a:
```
http://localhost:5173
```

La aplicación mostrará la pantalla de **inicio de sesión**. Ingresar el usuario y contraseña creados en el paso 3.7.

### 5.2 Seleccionar el dispositivo

Después del login, la aplicación muestra la pantalla de **selección de dispositivo**. Aquí aparece el ESP32 registrado en el paso 3.8 con su estado actual.

Hacer clic sobre el dispositivo para ver su dashboard en tiempo real.

### 5.3 Navegar por las secciones

Desde el panel lateral izquierdo:

| Sección | Contenido |
|---------|-----------|
| **Dashboard** | Lecturas actuales de sensores y ventiladores |
| **Historial** | Tabla con las últimas 100 lecturas del dispositivo |
| **Alertas** | Eventos fuera de rango y historial de alertas |

---

## Cómo envía datos el ESP32

El ESP32 hace un `POST` a:

```
http://<IP-del-PC>:8000/api/ingesta/
```

Con el header:
```
X-API-Key: <api_key copiada del admin>
```

Y el cuerpo JSON:
```json
{
  "temperatura": 45.2,
  "nivel_gas": 320,
  "presion": 1013.5,
  "llama_detectada": false,
  "ventilador_extraccion": true,
  "ventilador_inyeccion_1": false,
  "ventilador_inyeccion_2": false
}
```

El backend identifica automáticamente el dispositivo por la api_key y calcula el estado del sistema.

---

## ¿Qué hace cada terminal?

| Terminal | Comando final | Puerto | Función |
|----------|---------------|--------|---------|
| Backend  | `python manage.py runserver` | 8000 | API REST, base de datos, autenticación |
| Frontend | `npm run dev` | 5173 | Interfaz web, login, dashboard |

Ambas deben estar corriendo al mismo tiempo.

---

## Panel de administración

Disponible en `http://localhost:8000/admin/` para el superusuario. Desde allí se puede:

- Crear y gestionar dispositivos ESP32
- Asignar usuarios a dispositivos
- Ver todas las lecturas almacenadas
- Activar o desactivar dispositivos

---

## Errores frecuentes

**"No module named django"**
→ El entorno virtual no está activado. Ejecutar nuevamente el paso 3.3.

**"venv\Scripts\activate no se reconoce"** (Windows PowerShell)
→ Ejecutar primero:
```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

**El dashboard muestra "API Desconectada"**
→ Verificar que la terminal del backend esté corriendo sin errores en el puerto 8000.

**"Invalid token" al intentar ver el dashboard**
→ El token JWT expiró. Cerrar sesión y volver a iniciar sesión.

**El ESP32 recibe 401 al enviar datos**
→ Verificar que el header `X-API-Key` sea exactamente igual al guardado en el admin, y que el dispositivo esté marcado como **Activo**.

**"npm: command not found"**
→ Node.js no está instalado o no está en el PATH. Reinstalar desde https://nodejs.org/

---

## Para detener el proyecto

En cada terminal presionar **Ctrl+C**.
