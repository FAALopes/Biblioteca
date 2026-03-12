# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm run install:all

# Build backend and frontend
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Copy prisma schema
COPY backend/prisma ./backend/prisma

# Install production dependencies only
RUN cd backend && npm install --omit=dev && \
    npm install -g prisma

# Copy built files from builder
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start backend
CMD cd backend && npx prisma migrate deploy && node dist/index.js
