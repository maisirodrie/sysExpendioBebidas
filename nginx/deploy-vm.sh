#!/bin/bash
# ==============================================================================
# Script de Despliegue en VM Debian 13 (IP: 10.10.0.135)
# Sistema: sysExpendioBebidas
# ==============================================================================
set -e

PROJECT_DIR="/home/administrador/sysExpendioBebidas"

echo "🚀 Iniciando despliegue de sysExpendioBebidas..."

# 1. Configuración de Nginx
echo "📋 Configurando Nginx..."
sudo cp "$PROJECT_DIR/nginx/expendiobebidas.conf" /etc/nginx/sites-available/expendiobebidas.conf
if [ ! -f /etc/nginx/sites-enabled/expendiobebidas.conf ]; then
    sudo ln -s /etc/nginx/sites-available/expendiobebidas.conf /etc/nginx/sites-enabled/expendiobebidas.conf
fi

echo "🔍 Verificando sintaxis de Nginx..."
sudo nginx -t
echo "🔄 Recargando Nginx..."
sudo systemctl reload nginx

# 2. Despliegue Backend (Node.js + PM2)
echo "📦 Instalando dependencias backend..."
cd "$PROJECT_DIR"
npm install --production=false

# Habilitar autoarranque de servicios esenciales ante reinicios o cortes de luz
sudo systemctl enable nginx
sudo systemctl enable mongod || sudo systemctl enable mongodb || true

echo "⚙️ Iniciando / Reiniciando Backend con PM2..."
npm run produ:start || npm run produ:restart

# Guardar lista de procesos y configurar servicio systemd para que reviva solo al reiniciar
pm2 startup systemd -u administrador --hp /home/administrador --service-name pm2-administrador || true
pm2 save

# 3. Compilación Frontend (React 18 + Vite + Tailwind CSS)
echo "🎨 Compilando Frontend TailAdmin..."
cd "$PROJECT_DIR/ExpendioBebidas"
npm install
npm run build

echo "✅ ¡Despliegue completado con éxito!"
echo "🌐 Frontend: https://www.expendiobebidas.misiones.gov.ar"
echo "🔌 API:      https://api.expendiobebidas.misiones.gov.ar"
