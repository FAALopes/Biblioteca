# 🚀 Guia de Início Rápido - Biblioteca Inventory System

Bem-vindo! Esta é uma aplicação completa para inventariar livros de biblioteca com análise de fotos via OCR.

## 📦 O que foi implementado

✅ **Fase 1**: Setup inicial - estrutura base completa
✅ **Fase 2**: Backend 100% funcional com serviços para fotos, OCR, Excel import
✅ **Fase 3**: Frontend responsivo com páginas e componentes melhorados
✅ **Fase 4-6**: OCR, Photos, Import Excel, Inference integrados
✅ **Fase 7**: CI/CD configurado (pronto para Railway)

## 🛠️ Como começar

### 1. Instalar dependências

```bash
npm run install:all
```

### 2. Criar banco de dados local

```bash
cd backend
npx prisma migrate dev --name init
cd ..
```

### 3. Iniciar desenvolvimento

```bash
npm run dev
```

- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:5173
- **API Health**: http://localhost:3001/api/health

## 📊 Funcionalidades Disponíveis

### Livros
- ✅ Listar, criar, editar, remover livros
- ✅ Busca e filtros (por prateleira, status)
- ✅ Estatísticas em tempo real

### Prateleiras
- ✅ CRUD completo
- ✅ Suporte para secções (A, B, C) e números (1, 2, 3)
- ✅ Contadores automáticos de livros

### Fotos & OCR
- ✅ Upload de múltiplas fotos
- ✅ Análise automática com Tesseract.js (local)
- ✅ Extração de títulos e autores

### Importação Excel
- ✅ Wizard 3 etapas
- ✅ Detecção automática de colunas
- ✅ Merge smart (atualizar existentes ou criar novos)
- ✅ Criação automática de prateleiras
- ✅ Histórico de imports

### Inferência
- ✅ Sugestões automáticas de prateleira baseadas em:
  - ISBN match
  - Livros similares do mesmo autor
  - Padrões de localização

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
# Database (SQLite para local, PostgreSQL para produção)
DATABASE_URL="file:./dev.db"

# Server
NODE_ENV=development
PORT=3001

# Storage
UPLOAD_DIR=./backend/uploads
```

## 📝 Próximos Passos

### Antes de Deploy
1. **Forneça os dados**:
   - Ficheiro Excel com livros catalogados
   - Link para pasta com fotografias (ou fazer upload via UI)

2. **Teste localmente**:
   - Importe um ficheiro Excel de teste
   - Faça upload de algumas fotos
   - Verifique se OCR funciona

3. **Prepare para Production**:
   - Crie conta no Railway
   - Configure PostgreSQL em Railway
   - Defina variáveis de ambiente em Railway

### Deploy em Railway
```bash
# 1. Conectar repositório GitHub ao Railway
# 2. Definir RAILWAY_TOKEN como GitHub Secret
# 3. Push para branch main

git push origin main
```

## 🎨 Tema e Customização

### Cores Principais
- Primário: `#2d6a4f` (verde escuro)
- Sucesso: `#52b788` (verde médio)
- Info: `#40916c` (verde info)
- Aviso: `#d4a574` (bege suave)

Edite em: `frontend/src/theme/customTheme.ts`

## 🔍 API Endpoints

### Books
```
GET    /api/books                  - Listar livros
GET    /api/books/stats            - Estatísticas
GET    /api/books/:id              - Detalhes
POST   /api/books                  - Criar
PUT    /api/books/:id              - Atualizar
DELETE /api/books/:id              - Remover
```

### Shelves
```
GET    /api/shelves                - Listar
GET    /api/shelves/:id            - Detalhes
POST   /api/shelves                - Criar
PUT    /api/shelves/:id            - Atualizar
DELETE /api/shelves/:id            - Remover
```

### Photos
```
POST   /api/photos                 - Upload (multipart/form-data)
GET    /api/photos                 - Listar
GET    /api/photos/:id             - Detalhes
DELETE /api/photos/:id             - Remover
```

### OCR
```
POST   /api/ocr/analyze            - Analisar foto
GET    /api/ocr/pending            - Fotos pendentes
```

### Import
```
POST   /api/import/excel           - Upload Excel
POST   /api/import/excel/merge     - Merge com BD
GET    /api/import/logs            - Histórico
```

## 🐛 Troubleshooting

### Tesseract.js não carrega
Se o OCR não funcionar, pode ser:
1. Primeira vez - está a fazer download de modelo (lento)
2. Verifique a consola do navegador para mensagens de erro

### Porta já em uso
```bash
# Backend
PORT=3002 npm run dev:backend

# Frontend - editar vite.config.ts
```

### Erro de conexão ao DB
Se SQLite não funcionar:
```bash
# Resetar banco de dados
rm backend/dev.db
npx prisma migrate dev --name init
```

## 📚 Stack Completo

- **Runtime**: Node.js 20+
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (prod) / SQLite (dev)
- **ORM**: Prisma
- **Frontend**: React 18 + Vite
- **UI**: Ant Design v5
- **OCR**: Tesseract.js
- **Excel**: XLSX.js
- **Deploy**: Railway + GitHub Actions

## ✨ Melhorias Futuras

- [ ] Edição inline de livros na tabela
- [ ] Drag-drop para reorganizar livros em prateleiras
- [ ] Backup automático para S3/Cloud
- [ ] Integração com APIs de livros (ISBN lookup)
- [ ] Relatórios e exportação em PDF
- [ ] Modo escuro
- [ ] Aplicação mobile nativa
- [ ] Analytics e dashboard avançado

## 📖 Documentação Completa

Veja [README.md](./README.md) para documentação técnica detalhada.

## 💬 Suporte

Se encontrar problemas, verifique:
1. Logs do backend: `npm run dev:backend`
2. Console do navegador (F12)
3. Verifique variáveis de ambiente em `.env.local`

---

**Versão**: 1.0.0
**Última atualização**: 2026-03-12
**Autor**: FAALopes

Bom desenvolvimento! 🚀
