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
FRONTEND_NAME="frontendExpendio"
FRONTEND_PORT="80"

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

# 5. Compilar frontend y publicar en Nginx
echo ">>> [5/5] Compilando frontend..."
cd "$FRONTEND_DIR"
# Copiar el .env.production de la raíz al frontend para que Vite compile con la URL correcta
cp "$REPO_DIR/.env.production" "$FRONTEND_DIR/.env.production" 2>/dev/null || true
npm run build
cp -r logos/ build/ 2>/dev/null || true
cp -r fondos/ build/ 2>/dev/null || true

# Publicar archivos en /var/www/expendiobebidas para Nginx
echo ">>> Publicando archivos en /var/www/expendiobebidas..."
mkdir -p /var/www/expendiobebidas
cp -r build/* /var/www/expendiobebidas/
chown -R www-data:www-data /var/www/expendiobebidas 2>/dev/null || true
chmod -R 755 /var/www/expendiobebidas

# Configurar Nginx para que sirva el frontend y haga proxy a la API
if [ -f "$REPO_DIR/nginx/expendiobebidas.conf" ]; then
    echo ">>> Configurando Nginx..."
    cp "$REPO_DIR/nginx/expendiobebidas.conf" /etc/nginx/sites-available/expendiobebidas.conf 2>/dev/null || true
    rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
    ln -sf /etc/nginx/sites-available/expendiobebidas.conf /etc/nginx/sites-enabled/expendiobebidas.conf 2>/dev/null || true
    nginx -t 2>/dev/null && systemctl reload nginx 2>/dev/null || true
fi

# Eliminar frontend de PM2 ya que Nginx es el encargado del puerto 80
pm2 delete frontendExpendio 2>/dev/null || true
echo "    ✓ Frontend compilado y servido por Nginx en el puerto 80."
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
