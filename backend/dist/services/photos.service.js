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
exports.photosService = void 0;
const index_1 = require("../index");
const uuid_1 = require("uuid");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const config_1 = require("../config");
const errorHandler_1 = require("../middleware/errorHandler");
exports.photosService = {
    async uploadPhoto(fileBuffer, filename, bookId) {
        // Criar diretório se não existir
        const uploadDir = path.join(config_1.config.uploadDir, "photos");
        try {
            await fs.mkdir(uploadDir, { recursive: true });
        }
        catch (err) {
            console.error("Erro ao criar diretório", err);
        }
        // Gerar nome único
        const fileExt = path.extname(filename);
        const uniqueName = `${(0, uuid_1.v4)()}${fileExt}`;
        const filePath = path.join(uploadDir, uniqueName);
        // Salvar arquivo
        try {
            await fs.writeFile(filePath, fileBuffer);
        }
        catch (err) {
            throw new errorHandler_1.AppError(500, "Erro ao salvar arquivo");
        }
        // Criar registro no BD
        const photo = await index_1.prisma.photo.create({
            data: {
                filePath: `/uploads/photos/${uniqueName}`,
                bookId: bookId,
            },
        });
        return photo;
    },
    async listPhotos(bookId) {
        return await index_1.prisma.photo.findMany({
            where: bookId ? { bookId } : {},
            include: {
                ocrResults: {
                    select: {
                        id: true,
                        extractedTitle: true,
                        extractedAuthor: true,
                        confidence: true,
                    },
                },
            },
            orderBy: { uploadedAt: "desc" },
        });
    },
    async getPhoto(id) {
        const photo = await index_1.prisma.photo.findUnique({
            where: { id },
            include: {
                ocrResults: true,
                book: true,
            },
        });
        if (!photo) {
            throw new errorHandler_1.AppError(404, "Foto não encontrada");
        }
        return photo;
    },
    async deletePhoto(id) {
        const photo = await this.getPhoto(id);
        // Remover arquivo físico
        try {
            const filepath = path.join(process.cwd(), photo.filePath);
            await fs.unlink(filepath);
        }
        catch (err) {
            console.error("Erro ao remover arquivo físico", err);
        }
        // Remover registro no BD
        return await index_1.prisma.photo.delete({
            where: { id },
        });
    },
    async updatePhotoMetadata(id, metadata) {
        const photo = await this.getPhoto(id);
        const existingMeta = photo.metadata ? Object.assign({}, photo.metadata) : {};
        return await index_1.prisma.photo.update({
            where: { id },
            data: {
                metadata: Object.assign(existingMeta, metadata),
            },
        });
    },
};
//# sourceMappingURL=photos.service.js.map