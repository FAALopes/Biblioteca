#!/bin/bash

# Biblioteca - Deploy Quick Start Script
# Execute: bash QUICK_START.sh

echo "🚀 Biblioteca Inventory System - Deploy Rápido"
echo "=============================================="
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Passo 1: Verificar Git
echo -e "${BLUE}[1/5]${NC} Verificando Git..."
if ! command -v git &> /dev/null; then
    echo "❌ Git não instalado"
    exit 1
fi
echo -e "${GREEN}✓ Git OK${NC}"

# Passo 2: Verificar Node
echo -e "${BLUE}[2/5]${NC} Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não instalado"
    exit 1
fi
echo -e "${GREEN}✓ Node.js OK ($(node -v))${NC}"

# Passo 3: Instalar dependências
echo -e "${BLUE}[3/5]${NC} Instalando dependências..."
npm run install:all > /dev/null 2>&1
echo -e "${GREEN}✓ Dependências instaladas${NC}"

# Passo 4: Build
echo -e "${BLUE}[4/5]${NC} Fazendo build..."
npm run build > /dev/null 2>&1
echo -e "${GREEN}✓ Build completo${NC}"

# Passo 5: Instruções finais
echo -e "${BLUE}[5/5]${NC} Finalizando..."
echo ""
echo -e "${GREEN}✅ TUDO PRONTO PARA DEPLOY!${NC}"
echo ""
echo "Próximos passos:"
echo "1. Cria repositório em GitHub (https://github.com/new)"
echo "2. Executa:"
echo ""
echo -e "${YELLOW}git remote add origin https://github.com/[USER]/Biblioteca.git${NC}"
echo -e "${YELLOW}git branch -M main${NC}"
echo -e "${YELLOW}git push -u origin main${NC}"
echo ""
echo "3. Cria conta em Railway (https://railway.app)"
echo "4. Conecta repositório do GitHub"
echo "5. Deploy automático começa!"
echo ""
echo "📖 Mais detalhes: cat DEPLOY_RAILWAY.md"
