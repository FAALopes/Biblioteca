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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importController = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const import_service_1 = require("../services/import.service");
const errorHandler_1 = require("../middleware/errorHandler");
const multer_1 = __importDefault(require("multer"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const index_1 = require("../index");
// Configuração multer para Excel
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Tipo de ficheiro não permitido. Use Excel ou CSV."));
        }
    },
});
exports.importController = {
    uploadExcel: [
        upload.single("file"),
        (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            if (!req.file) {
                throw new errorHandler_1.AppError(400, "Nenhum ficheiro foi enviado");
            }
            // Guardar ficheiro temporário
            const tempPath = path.join(process.cwd(), "temp_upload.xlsx");
            try {
                await fs.writeFile(tempPath, req.file.buffer);
                // Parse do ficheiro
                const rows = await import_service_1.importService.parseExcelFile(tempPath);
                // Detectar colunas
                const columnMapping = await import_service_1.importService.detectColumns(rows);
                res.json({
                    success: true,
                    data: {
                        rowCount: rows.length,
                        firstRows: rows.slice(0, 5),
                        columnMapping,
                    },
                });
            }
            finally {
                // Limpar ficheiro temporário
                try {
                    await fs.unlink(tempPath);
                }
                catch (err) {
                    console.error("Erro ao remover ficheiro temporário", err);
                }
            }
        }),
    ],
    merge: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { fileBase64, columnMapping } = req.body;
        if (!fileBase64 || !columnMapping) {
            throw new errorHandler_1.AppError(400, "Ficheiro e columnMapping são obrigatórios");
        }
        // Decodificar base64
        const buffer = Buffer.from(fileBase64, "base64");
        const tempPath = path.join(process.cwd(), "temp_merge.xlsx");
        try {
            await fs.writeFile(tempPath, buffer);
            // Parse do ficheiro
            const rows = await import_service_1.importService.parseExcelFile(tempPath);
            // Merge
            const result = await import_service_1.importService.mergeExcelData(rows, columnMapping);
            res.json({
                success: true,
                data: result,
            });
        }
        finally {
            try {
                await fs.unlink(tempPath);
            }
            catch (err) {
                console.error("Erro ao remover ficheiro temporário", err);
            }
        }
    }),
    logs: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const logs = await index_1.prisma.excelImportLog.findMany({
            orderBy: { importedAt: "desc" },
            take: 20,
        });
        res.json({
            success: true,
            data: logs,
        });
    }),
};
//# sourceMappingURL=import.controller.js.map