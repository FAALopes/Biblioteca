# 📚 Biblioteca - Sistema de Inventário

Uma aplicação web para inventariar livros de biblioteca com suporte a análise de fotos via OCR, importação de Excel e inferência automática de localizações.

## 🚀 Tecnologias

- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Frontend**: React 18 + TypeScript + Vite + Ant Design
- **Database**: PostgreSQL (ou SQLite para desenvolvimento)
- **OCR**: Tesseract.js (local, gratuito)
- **Deploy**: Railway + GitHub Actions

## 📋 Requisitos

- Node.js 20+
- PostgreSQL (ou SQLite para dev)
- npm/pnpm

## 🛠️ Setup Local

### 1. Clone e instale dependências

```bash
git clone https://github.com/FAALopes/Biblioteca.git
cd Biblioteca
npm run install:all
```

### 2. Configure o banco de dados

Crie um arquivo `.env.local` com:

```env
DATABASE_URL="file:./dev.db"
NODE_ENV=development
PORT=3001
UPLOAD_DIR=./backend/uploads
```

Ou para PostgreSQL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/biblioteca"
```

### 3. Migrate do Prisma

```bash
cd backend
npx prisma migrate dev --name init
```

### 4. Inicie o desenvolvimento

```bash
npm run dev
```

- Backend rodará em: http://localhost:3001
- Frontend rodará em: http://localhost:5173

## 📦 Build & Deploy

### Build local

```bash
npm run build
```

### Deploy no Railway

1. Conecte seu repositório GitHub ao Railway
2. Configure as variáveis de ambiente:
   - `DATABASE_URL` - URL do PostgreSQL
   - `NODE_ENV` - "production"

3. Railway detectará automaticamente e fará deploy

## 🎨 Tema

Cores baseadas em verde suave:
- **Primário**: #2d6a4f (verde escuro)
- **Sucesso**: #52b788 (verde médio)
- **Info**: #40916c (verde info)
- **Aviso**: #d4a574 (bege suave)

## 📊 Estrutura do Projeto

```
Biblioteca/
├── backend/          # API Express + Prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── theme/
│   │   └── App.tsx
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml
└── railway.json
```

## 🔄 Fluxo de Funcionalidades

1. **Upload de Fotos**: Fotografias das prateleiras
2. **OCR**: Extração automática de títulos/autores via Tesseract.js
3. **Import Excel**: Catalogação baseada em ficheiro Excel
4. **Merge**: Combinação de dados de fotos + Excel
5. **Catálogo**: Visualização e edição de livros

## 📝 API Endpoints

### Books
- `GET /api/books` - Listar livros
- `GET /api/books/:id` - Detalhes do livro
- `POST /api/books` - Criar livro
- `PUT /api/books/:id` - Atualizar livro
- `DELETE /api/books/:id` - Remover livro
- `GET /api/books/stats` - Estatísticas

### Shelves
- `GET /api/shelves` - Listar prateleiras
- `GET /api/shelves/:id` - Detalhes da prateleira
- `POST /api/shelves` - Criar prateleira
- `PUT /api/shelves/:id` - Atualizar prateleira
- `DELETE /api/shelves/:id` - Remover prateleira

### Photos
- `POST /api/photos` - Upload foto
- `GET /api/photos` - Listar fotos
- `DELETE /api/photos/:id` - Remover foto

### OCR
- `POST /api/ocr/analyze` - Analisar foto
- `GET /api/ocr/pending` - Fotos pendentes

### Import
- `POST /api/import/excel` - Upload Excel
- `POST /api/import/excel/merge` - Merge com BD
- `GET /api/import/logs` - Histórico

## 👨‍💻 Desenvolvimento

### Adicionar nova feature

1. Backend:
   - Criar rota em `backend/src/routes/`
   - Criar controller em `backend/src/controllers/`
   - Criar service em `backend/src/services/`

2. Frontend:
   - Criar página em `frontend/src/pages/` ou componente em `frontend/src/components/`
   - Usar API client em `frontend/src/services/api.ts`

### Estrutura de dados

Veja `backend/prisma/schema.prisma` para o schema do Prisma.

## 🐛 Troubleshooting

### Erro de conexão ao banco de dados

Verifique se o PostgreSQL está rodando ou se está usando SQLite local:

```bash
# Para SQLite local
DATABASE_URL="file:./dev.db"
```

### Porta 3001 ou 5173 já em uso

Mude a porta em `.env.local`:

```env
PORT=3002  # backend
# Frontend usa VITE_PORT em vite.config.ts
```

## 📄 Licença

MIT

## 👤 Autor

FAALopes
