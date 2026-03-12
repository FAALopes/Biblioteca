import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { photosService } from "../services/photos.service";
import { AppError } from "../middleware/errorHandler";
import multer from "multer";

// Configuração multer
const upload = multer({
  storage: multer.memoryStorage(),
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
    } else {
      cb(new Error("Tipo de ficheiro não permitido"));
    }
  },
});

export const photosController = {
  upload: [
    upload.single("file"),
    asyncHandler(async (req: Request, res: Response) => {
      if (!req.file) {
        throw new AppError(400, "Nenhum ficheiro foi enviado");
      }

      const { bookId } = req.body;

      const photo = await photosService.uploadPhoto(
        req.file.buffer,
        req.file.originalname,
        bookId ? parseInt(bookId) : undefined
      );

      res.status(201).json({
        success: true,
        data: photo,
      });
    }),
  ],

  list: asyncHandler(async (req: Request, res: Response) => {
    const { bookId } = req.query;

    const photos = await photosService.listPhotos(
      bookId ? parseInt(bookId as string) : undefined
    );

    res.json({
      success: true,
      data: photos,
    });
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const photo = await photosService.getPhoto(parseInt(id));

    res.json({
      success: true,
      data: photo,
    });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await photosService.deletePhoto(parseInt(id));

    res.json({
      success: true,
      message: "Foto removida",
    });
  }),
};
