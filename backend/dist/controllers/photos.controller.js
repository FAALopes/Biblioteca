"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.photosController = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const photos_service_1 = require("../services/photos.service");
const errorHandler_1 = require("../middleware/errorHandler");
const multer_1 = __importDefault(require("multer"));
// Configuração multer
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Tipo de ficheiro não permitido"));
        }
    },
});
exports.photosController = {
    upload: [
        upload.single("file"),
        (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            if (!req.file) {
                throw new errorHandler_1.AppError(400, "Nenhum ficheiro foi enviado");
            }
            const { bookId } = req.body;
            const photo = await photos_service_1.photosService.uploadPhoto(req.file.buffer, req.file.originalname, bookId ? parseInt(bookId) : undefined);
            res.status(201).json({
                success: true,
                data: photo,
            });
        }),
    ],
    list: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { bookId } = req.query;
        const photos = await photos_service_1.photosService.listPhotos(bookId ? parseInt(bookId) : undefined);
        res.json({
            success: true,
            data: photos,
        });
    }),
    get: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const photo = await photos_service_1.photosService.getPhoto(parseInt(id));
        res.json({
            success: true,
            data: photo,
        });
    }),
    delete: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        await photos_service_1.photosService.deletePhoto(parseInt(id));
        res.json({
            success: true,
            message: "Foto removida",
        });
    }),
};
//# sourceMappingURL=photos.controller.js.map