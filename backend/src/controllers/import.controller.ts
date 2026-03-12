import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { importService } from "../services/import.service";
import { AppError } from "../middleware/errorHandler";
import multer from "multer";
import * as fs from "fs/promises";
import * as path from "path";
import { prisma } from "../index";

// Configuração multer para Excel
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de ficheiro não permitido. Use Excel ou CSV."));
    }
  },
});

export const importController = {
  uploadExcel: [
    upload.single("file"),
    asyncHandler(async (req: Request, res: Response) => {
      if (!req.file) {
        throw new AppError(400, "Nenhum ficheiro foi enviado");
      }

      // Guardar ficheiro temporário
      const tempPath = path.join(process.cwd(), "temp_upload.xlsx");
      try {
        await fs.writeFile(tempPath, req.file.buffer);

        // Parse do ficheiro
        const rows = await importService.parseExcelFile(tempPath);

        // Detectar colunas
        const columnMapping = await importService.detectColumns(rows);

        res.json({
          success: true,
          data: {
            rowCount: rows.length,
            firstRows: rows.slice(0, 5),
            columnMapping,
          },
        });
      } finally {
        // Limpar ficheiro temporário
        try {
          await fs.unlink(tempPath);
        } catch (err) {
          console.error("Erro ao remover ficheiro temporário", err);
        }
      }
    }),
  ],

  merge: asyncHandler(async (req: Request, res: Response) => {
    const { fileBase64, columnMapping } = req.body;

    if (!fileBase64 || !columnMapping) {
      throw new AppError(400, "Ficheiro e columnMapping são obrigatórios");
    }

    // Decodificar base64
    const buffer = Buffer.from(fileBase64, "base64");
    const tempPath = path.join(process.cwd(), "temp_merge.xlsx");

    try {
      await fs.writeFile(tempPath, buffer);

      // Parse do ficheiro
      const rows = await importService.parseExcelFile(tempPath);

      // Merge
      const result = await importService.mergeExcelData(rows, columnMapping);

      res.json({
        success: true,
        data: result,
      });
    } finally {
      try {
        await fs.unlink(tempPath);
      } catch (err) {
        console.error("Erro ao remover ficheiro temporário", err);
      }
    }
  }),

  logs: asyncHandler(async (req: Request, res: Response) => {
    const logs = await prisma.excelImportLog.findMany({
      orderBy: { importedAt: "desc" },
      take: 20,
    });

    res.json({
      success: true,
      data: logs,
    });
  }),
};
