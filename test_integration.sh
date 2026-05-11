#!/bin/bash
# Script para probar la integración Backend-Frontend

echo "🧪 Prueba de Integración Backend-Frontend"
echo "=========================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si el backend está ejecutándose
echo "🔍 Verificando Backend en http://localhost:8000..."
if curl -s http://localhost:8000/api/lecturas/ultima/ > /dev/null; then
    echo -e "${GREEN}✅ Backend está corriendo${NC}"
else
    echo -e "${RED}❌ Backend no responde en localhost:8000${NC}"
    echo "   Asegúrate de ejecutar: python manage.py runserver"
    exit 1
fi

echo ""
echo "📊 Pruebas de API..."
echo ""

# Test 1: Obtener última lectura
echo -n "1️⃣ GET /api/lecturas/ultima/ ... "
RESPONSE=$(curl -s http://localhost:8000/api/lecturas/ultima/)
if echo "$RESPONSE" | grep -q "temperatura"; then
    echo -e "${GREEN}✅${NC}"
    echo "   Datos: $RESPONSE" | head -c 100
    echo "..."
else
    echo -e "${RED}❌${NC}"
fi

echo ""

# Test 2: Obtener resumen
echo -n "2️⃣ GET /api/lecturas/resumen/ ... "
RESPONSE=$(curl -s http://localhost:8000/api/lecturas/resumen/)
if echo "$RESPONSE" | grep -q "estado_actual"; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${YELLOW}⚠️${NC} (No hay datos en la BD)"
fi

echo ""

# Test 3: Obtener alertas
echo -n "3️⃣ GET /api/lecturas/alertas/ ... "
RESPONSE=$(curl -s http://localhost:8000/api/lecturas/alertas/)
if echo "$RESPONSE" | grep -q "\["; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${YELLOW}⚠️${NC} (Sin alertas actuales)"
fi

echo ""

# Test 4: Crear una lectura de prueba
echo -n "4️⃣ POST /api/lecturas/ (crear lectura) ... "
RESPONSE=$(curl -s -X POST http://localhost:8000/api/lecturas/ \
  -H "Content-Type: application/json" \
  -d '{
    "temperatura": 35.5,
    "nivel_gas": 450,
    "llama_detectada": false,
    "ventilador_extraccion": true,
    "ventilador_inyeccion_1": true,
    "ventilador_inyeccion_2": false,
    "estado_sistema": "NORMAL"
  }')

if echo "$RESPONSE" | grep -q "id"; then
    echo -e "${GREEN}✅${NC}"
    ID=$(echo "$RESPONSE" | grep -oP '"id":\s*\K[^,}]+')
    echo "   ID creada: $ID"
else
    echo -e "${RED}❌${NC}"
    echo "   Error: $RESPONSE"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✨ Pruebas completadas${NC}"
echo ""
echo "📱 Próximo paso:"
echo "Abre http://localhost:5173 en tu navegador"
echo "(Asegúrate de ejecutar 'npm run dev' en la carpeta frontend)"
