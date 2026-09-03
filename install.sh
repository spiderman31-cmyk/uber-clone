#!/bin/bash

# Script de instalación rápida para desarrollo local

echo "🚀 Configurando Uber Clone..."

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Descargarlo desde https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detectado: $(node -v)"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Crear archivo .env
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    echo "⚠️  Edita .env con tus credenciales de Supabase"
fi

echo ""
echo "✅ ¡Instalación completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Abre https://supabase.com y crea un proyecto gratis"
echo "2. Edita el archivo .env con tus credenciales"
echo "3. Ejecuta las consultas SQL del README.md en Supabase"
echo "4. Inicia el servidor: npm run dev"
echo ""
echo "🌐 El servidor estará en http://localhost:3000"
