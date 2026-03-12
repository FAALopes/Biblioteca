import express from "express";
import cors from "cors";
import { config } from "./config";
import { errorHandler, notFoundHandler, AppError } from "./middleware/errorHandler";
import { PrismaClient } from "@prisma/client";

// Routes
import booksRoutes from "./routes/books.routes";
import shelvesRoutes from "./routes/shelves.routes";
import photosRoutes from "./routes/photos.routes";
import ocrRoutes from "./routes/ocr.routes";
import importRoutes from "./routes/import.routes";

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// API Routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.use(`${config.apiPrefix}/books`, booksRoutes);
app.use(`${config.apiPrefix}/shelves`, shelvesRoutes);
app.use(`${config.apiPrefix}/photos`, photosRoutes);
app.use(`${config.apiPrefix}/ocr`, ocrRoutes);
app.use(`${config.apiPrefix}/import`, importRoutes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler (must be last)
app.use(errorHandler);

// Graceful shutdown
const server = app.listen(config.port, () => {
  console.log(`✓ Server running at http://localhost:${config.port}`);
  console.log(`✓ API: http://localhost:${config.port}${config.apiPrefix}`);
  console.log(`✓ Environment: ${config.nodeEnv}`);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
  });
  await prisma.$disconnect();
  process.exit(0);
});

export { app, prisma };
