"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const errorHandler_1 = require("./middleware/errorHandler");
const client_1 = require("@prisma/client");
// Routes
const books_routes_1 = __importDefault(require("./routes/books.routes"));
const shelves_routes_1 = __importDefault(require("./routes/shelves.routes"));
const photos_routes_1 = __importDefault(require("./routes/photos.routes"));
const ocr_routes_1 = __importDefault(require("./routes/ocr.routes"));
const import_routes_1 = __importDefault(require("./routes/import.routes"));
const app = (0, express_1.default)();
exports.app = app;
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
// API Routes
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});
app.use(`${config_1.config.apiPrefix}/books`, books_routes_1.default);
app.use(`${config_1.config.apiPrefix}/shelves`, shelves_routes_1.default);
app.use(`${config_1.config.apiPrefix}/photos`, photos_routes_1.default);
app.use(`${config_1.config.apiPrefix}/ocr`, ocr_routes_1.default);
app.use(`${config_1.config.apiPrefix}/import`, import_routes_1.default);
// 404 Handler
app.use(errorHandler_1.notFoundHandler);
// Error Handler (must be last)
app.use(errorHandler_1.errorHandler);
// Graceful shutdown
const server = app.listen(config_1.config.port, () => {
    console.log(`✓ Server running at http://localhost:${config_1.config.port}`);
    console.log(`✓ API: http://localhost:${config_1.config.port}${config_1.config.apiPrefix}`);
    console.log(`✓ Environment: ${config_1.config.nodeEnv}`);
});
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully...");
    server.close(() => {
        console.log("Server closed");
    });
    await prisma.$disconnect();
    process.exit(0);
});
//# sourceMappingURL=index.js.map