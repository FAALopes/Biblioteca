"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ocrService = void 0;
const index_1 = require("../index");
const errorHandler_1 = require("../middleware/errorHandler");
const Tesseract = __importStar(require("tesseract.js"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
exports.ocrService = {
    async analyzePhoto(photoId) {
        // Validar que foto existe
        const photo = await index_1.prisma.photo.findUnique({
            where: { id: photoId },
        });
        if (!photo) {
            throw new errorHandler_1.AppError(404, "Foto não encontrada");
        }
        // Ler arquivo de imagem
        const imagePath = path.join(process.cwd(), photo.filePath);
        let imageBuffer;
        try {
            imageBuffer = await fs.readFile(imagePath);
        }
        catch (err) {
            throw new errorHandler_1.AppError(500, "Erro ao ler arquivo de imagem");
        }
        // Usar Tesseract.js para extrair texto
        let ocrResult;
        try {
            console.log("[OCR] Iniciando análise de foto", photoId);
            const result = await Tesseract.recognize(imageBuffer, "por");
            const text = result.data.text || "";
            const confidence = (result.data.confidence || 0) / 100; // Converter para 0-1
            const lines = text
                .split("\n")
                .map((l) => l.trim())
                .filter((l) => l.length > 2);
            ocrResult = {
                extractedText: lines.slice(0, 20), // Primeiras 20 linhas
                confidence,
                rawText: text,
            };
            console.log("[OCR] Análise completa", { confidence, linhas: lines.length });
        }
        catch (err) {
            console.error("[OCR] Erro na análise", err);
            throw new errorHandler_1.AppError(500, "Erro ao analisar foto com OCR");
        }
        // Salvar resultado na BD
        await index_1.prisma.ocrResult.create({
            data: {
                photoId,
                rawText: ocrResult.rawText,
                confidence: ocrResult.confidence,
            },
        });
        return ocrResult;
    },
    async getPendingPhotos() {
        // Fotos sem resultados OCR
        return await index_1.prisma.photo.findMany({
            where: {
                ocrResults: {
                    none: {},
                },
            },
            orderBy: { uploadedAt: "asc" },
        });
    },
    async extractBooksFromText(text) {
        // Simples heurística: linhas que parecem ser títulos/autores
        // Em produção, usar ML ou parser mais sofisticado
        const books = [];
        let currentTitle = "";
        for (const line of text) {
            // Linhas muito curtas provavelmente não são títulos
            if (line.length < 5)
                continue;
            // Verificar se parece um ISBN (números com hífen)
            if (/^\d{3}-\d{10}/.test(line)) {
                if (currentTitle) {
                    books.push({
                        title: currentTitle,
                        isbn: line,
                    });
                    currentTitle = "";
                }
                continue;
            }
            // Se a linha tem TODAS LETRAS MAIÚSCULAS, é provável que seja título
            if (line === line.toUpperCase() && line.length > 5) {
                if (currentTitle) {
                    books.push({ title: currentTitle });
                }
                currentTitle = line;
            }
        }
        if (currentTitle) {
            books.push({ title: currentTitle });
        }
        return books;
    },
};
//# sourceMappingURL=ocr.service.js.map