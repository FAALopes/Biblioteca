# 🚀 Deploy em Railway - Guia Automático (2 minutos)

Tudo está pronto. Basta seguir estes 3 passos:

---

## **PASSO 1: Cria repositório no GitHub** (1 minuto)

```bash
# 1. Vai para https://github.com/new
# 2. Nome: Biblioteca
# 3. Descrição: Library Inventory System with OCR
# 4. Public
# 5. Clica "Create repository"
```

Depois volta e executa:
```bash
cd C:\Users\faal\Biblioteca

git remote add origin https://github.com/[SEU_USERNAME]/Biblioteca.git
git branch -M main
git push -u origin main
```

---

## **PASSO 2: Cria conta Railway** (1 minuto)

1. Vai para https://railway.app
2. Sign up com GitHub
3. Autoriza Railway no GitHub

---

## **PASSO 3: Deploy automático** (30 segundos)

```bash
# No Railway dashboard:
1. Clica "+ New"
2. Escolhe "GitHub Repo"
3. Seleciona "Biblioteca"
4. Deixa Railway fazer o resto (automático!)
```

---

## **Configure variáveis (IMPORTANTE)**

No Railway, depois de conectar:

1. Clica no projeto "Biblioteca"
2. Clica na aba "Variables"
3. Adiciona estas variáveis:

```
DATABASE_URL = postgresql://...  (Railway provisiona automaticamente)
NODE_ENV = production
PORT = 3001
UPLOAD_DIR = ./uploads
```

Depois clica "Deploy"

---

## **Pronto! 🎉**

A app estará live em:
```
https://[seu-projeto].railway.app
```

---

## Troubleshooting

❌ **"Module not found"?**
```bash
npm run install:all
git add -A
git commit -m "Install all dependencies"
git push
```

❌ **Erro de database?**
- Railway cria automaticamente PostgreSQL
- Copia a `DATABASE_URL` que aparece em Railway → Variables

❌ **Port in use?**
- Railway ignora a porta local, usa a dela (automático)

---

**Ainda com dúvidas?** Deixa de lado, faço tudo eu agora mesmo se quiseres.
