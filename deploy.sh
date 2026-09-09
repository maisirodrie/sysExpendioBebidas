#!/bin/bash
# =============================================================
# deploy.sh — Script de deploy completo para sysExpendioBebidas
# Uso: bash deploy.sh
# =============================================================

set -e  # Detener si cualquier comando falla

# Obtener ruta absoluta del directorio del script
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$REPO_DIR/ExpendioBebidas"
BACKEND_NAME="backendExpendio"

echo ""
echo "======================================"
echo "  sysExpendioBebidas — Deploy en Producción"
echo "======================================"
echo ""

# 1. Actualizar código del repositorio
echo ">>> [1/5] Actualizando código desde GitHub..."
cd "$REPO_DIR"
git reset --hard HEAD
git pull origin main
echo "    ✓ Código actualizado."
echo ""

# 2. Instalar dependencias del backend (sin dependencias de desarrollo)
echo ">>> [2/5] Instalando dependencias del backend..."
cd "$REPO_DIR"
npm install --omit=dev
echo "    ✓ Dependencias del backend OK."
echo ""

# 3. Reiniciar el backend con PM2
echo ">>> [3/5] Reiniciando backend ($BACKEND_NAME)..."
cd "$REPO_DIR"
pm2 delete $BACKEND_NAME 2>/dev/null || true
NODE_ENV=production pm2 start src/index.js --name $BACKEND_NAME
echo "    ✓ Backend reiniciado."
echo ""

# 4. Instalar dependencias del frontend
echo ">>> [4/5] Instalando dependencias del frontend..."
cd "$FRONTEND_DIR"
npm install
echo "    ✓ Dependencias del frontend OK."
echo ""

# 5. Compilar frontend para Nginx
echo ">>> [5/5] Compilando frontend..."
cd "$FRONTEND_DIR"
# Copiar el .env.production de la raíz al frontend para que Vite compile con la URL correcta
cp "$REPO_DIR/.env.production" "$FRONTEND_DIR/.env.production" 2>/dev/null || true
npm run build
cp -r logos/ build/ 2>/dev/null || true
cp -r fondos/ build/ 2>/dev/null || true
echo "    ✓ Frontend compilado en build/ para Nginx."
echo ""

# Guardar lista PM2 para sobrevivir reinicios del servidor
pm2 save

echo "======================================"
echo "  ✅ Deploy completado exitosamente!"
echo "======================================"
echo ""
echo "  Estado de procesos PM2:"
pm2 list
echo ""
