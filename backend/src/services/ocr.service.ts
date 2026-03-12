import { prisma } from "../index";
import { AppError } from "../middleware/errorHandler";
import * as Tesseract from "tesseract.js";
import * as path from "path";
import * as fs from "fs/promises";
import { OcrAnalysisResult } from "../types";

export const ocrService = {
  async analyzePhoto(photoId: number): Promise<OcrAnalysisResult> {
    // Validar que foto existe
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      throw new AppError(404, "Foto não encontrada");
    }

    // Ler arquivo de imagem
    const imagePath = path.join(process.cwd(), photo.filePath);
    let imageBuffer: Buffer;

    try {
      imageBuffer = await fs.readFile(imagePath);
    } catch (err) {
      throw new AppError(500, "Erro ao ler arquivo de imagem");
    }

    // Usar Tesseract.js para extrair texto
    let ocrResult: OcrAnalysisResult;
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

      console.log(
        "[OCR] Análise completa",
        { confidence, linhas: lines.length }
      );
    } catch (err) {
      console.error("[OCR] Erro na análise", err);
      throw new AppError(500, "Erro ao analisar foto com OCR");
    }

    // Salvar resultado na BD
    await prisma.ocrResult.create({
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
    return await prisma.photo.findMany({
      where: {
        ocrResults: {
          none: {},
        },
      },
      orderBy: { uploadedAt: "asc" },
    });
  },

  async extractBooksFromText(text: string[]) {
    // Simples heurística: linhas que parecem ser títulos/autores
    // Em produção, usar ML ou parser mais sofisticado

    const books = [];
    let currentTitle = "";

    for (const line of text) {
      // Linhas muito curtas provavelmente não são títulos
      if (line.length < 5) continue;

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
