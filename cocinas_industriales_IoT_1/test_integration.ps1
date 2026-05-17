# Script para probar la integración Backend-Frontend en Windows
# Ejecutar en PowerShell

Write-Host "🧪 Prueba de Integración Backend-Frontend" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Verificar si el backend está ejecutándose
Write-Host "🔍 Verificando Backend en http://localhost:8000..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/lecturas/ultima/" -ErrorAction Stop
    Write-Host "✅ Backend está corriendo" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no responde en localhost:8000" -ForegroundColor Red
    Write-Host "   Asegúrate de ejecutar: python manage.py runserver" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📊 Pruebas de API..." -ForegroundColor Yellow
Write-Host ""

# Test 1: Obtener última lectura
Write-Host -NoNewline "1️⃣ GET /api/lecturas/ultima/ ... "
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/lecturas/ultima/" -ErrorAction Stop
    $content = $response.Content
    if ($content -like "*temperatura*") {
        Write-Host "✅" -ForegroundColor Green
        Write-Host "   Datos: $(($content | ConvertFrom-Json) | ConvertTo-Json -Compress)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌" -ForegroundColor Red
}

Write-Host ""

# Test 2: Obtener resumen
Write-Host -NoNewline "2️⃣ GET /api/lecturas/resumen/ ... "
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/lecturas/resumen/" -ErrorAction Stop
    $content = $response.Content
    if ($content -like "*estado_actual*") {
        Write-Host "✅" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ Sin datos" -ForegroundColor Yellow
}

Write-Host ""

# Test 3: Obtener alertas
Write-Host -NoNewline "3️⃣ GET /api/lecturas/alertas/ ... "
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/lecturas/alertas/" -ErrorAction Stop
    Write-Host "✅" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Sin alertas" -ForegroundColor Yellow
}

Write-Host ""

# Test 4: Crear una lectura de prueba
Write-Host -NoNewline "4️⃣ POST /api/lecturas/ (crear lectura) ... "
$body = @{
    temperatura = 35.5
    nivel_gas = 450
    llama_detectada = $false
    ventilador_extraccion = $true
    ventilador_inyeccion_1 = $true
    ventilador_inyeccion_2 = $false
    estado_sistema = "NORMAL"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/lecturas/" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body `
        -ErrorAction Stop
    
    $responseData = $response.Content | ConvertFrom-Json
    if ($responseData.id) {
        Write-Host "✅" -ForegroundColor Green
        Write-Host "   ID creada: $($responseData.id)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✨ Pruebas completadas" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Próximo paso:" -ForegroundColor Yellow
Write-Host "Abre http://localhost:5173 en tu navegador" -ForegroundColor White
Write-Host "(Asegúrate de ejecutar 'npm run dev' en la carpeta frontend)" -ForegroundColor Gray
