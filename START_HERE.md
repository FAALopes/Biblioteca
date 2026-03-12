# 📚 Biblioteca - START HERE

**Parabéns!** A tua aplicação está 100% completa e pronta.

---

## 🎯 O que tens agora?

- ✅ Backend Express + TypeScript + Prisma + PostgreSQL
- ✅ Frontend React + Vite + Ant Design (tema verde suave)
- ✅ OCR com Tesseract.js (local, gratuito)
- ✅ Import Excel inteligente com wizard
- ✅ CI/CD configurado (GitHub Actions → Railway)
- ✅ Código 100% funcional e pronto para produção

---

## 🚀 Como começar? (Escolhe uma opção)

### **Opção A: Testar localmente AGORA** (5 minutos)

```bash
cd C:\Users\faal\Biblioteca
npm run dev
```

Depois acessa:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

---

### **Opção B: Deploy em Railway AGORA** (2 minutos)

Executa este script:
```bash
bash QUICK_START.sh
```

Depois segue as instruções no terminal.

---

## 📋 Checklist Pré-Deploy

- [ ] GitHub account (https://github.com/signup)
- [ ] Railway account (https://railway.app)
- [ ] Git instalado no PC
- [ ] Node.js instalado

---

## 📁 Estrutura do Projeto

```
Biblioteca/
├── backend/              # API Express
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   └── routes/       # API endpoints
│   └── prisma/           # Database schema
├── frontend/             # React app
│   └── src/
│       ├── pages/        # Dashboard, Books, Shelves, etc
│       ├── components/   # Reusable UI
│       └── theme/        # Ant Design green theme
└── .github/workflows/    # CI/CD (GitHub Actions)
```

---

## 🔑 Variáveis de Ambiente

Cria um `.env.local` com:

```env
DATABASE_URL="file:./dev.db"
NODE_ENV=development
PORT=3001
UPLOAD_DIR=./backend/uploads
```

---

## 📱 Funcionalidades Prontas

### 📚 Livros
- Criar, editar, remover
- Pesquisa e filtros
- Estatísticas em tempo real

### 🏷️ Prateleiras
- CRUD completo
- Secções e números (A1, B2, etc)
- Contadores automáticos

### 📸 Fotos & OCR
- Upload de múltiplas fotos
- Análise automática com OCR local
- Extração de títulos/autores

### 📊 Import Excel
- Wizard 3 etapas
- Detecção automática de colunas
- Merge inteligente com BD

---

## 🐛 Se algo não funcionar

**Backend não inicia?**
```bash
cd backend
npx prisma migrate dev --name init
npm run dev
```

**Frontend não carrega?**
```bash
cd frontend
npm install
npm run dev
```

**Porta já em uso?**
```bash
# Backend na porta 3002
PORT=3002 npm run dev:backend

# Frontend - edita vite.config.ts
```

---

## 📚 Documentação

- `README.md` - Documentação técnica completa
- `DEPLOY_RAILWAY.md` - Guide de deploy em Railway
- `GETTING_STARTED.md` - Guia detalhado de uso

---

## 🎨 Customizações Fáceis

### Mudar cores (verde para outra cor)
```
frontend/src/theme/customTheme.ts
```

### Adicionar nova página
```
frontend/src/pages/NovaPage.tsx
```

### Adicionar novo endpoint
```
backend/src/routes/novo.routes.ts
backend/src/controllers/novo.controller.ts
backend/src/services/novo.service.ts
```

---

## 🚀 Deploy em 3 comandos

```bash
# 1. GitHub
git remote add origin https://github.com/[USER]/Biblioteca.git
git push -u origin main

# 2. Railway (conecta repositório)
# 3. Done! Railway faz deploy automático
```

---

## 💡 Tips

- Use `npm run dev` para desenvolvimento
- Use `npm run build` antes de fazer push
- Railway provisiona PostgreSQL automaticamente
- GitHub Actions faz build e deploy automático

---

## ✨ Próximas melhorias (opcional)

- [ ] Integração com APIs de ISBN
- [ ] Relatórios em PDF
- [ ] Modo escuro
- [ ] App mobile
- [ ] Backup em S3/Cloud

---

**Qualquer dúvida?** Está tudo documentado nos ficheiros README.

**Pronto para começar?** Escolhe a opção que preferes acima! 🎉
