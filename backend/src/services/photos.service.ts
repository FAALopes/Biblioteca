import { prisma } from "../index";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs/promises";
import * as path from "path";
import { config } from "../config";
import { AppError } from "../middleware/errorHandler";

export const photosService = {
  async uploadPhoto(
    fileBuffer: Buffer,
    filename: string,
    bookId?: number
  ) {
    // Criar diretório se não existir
    const uploadDir = path.join(config.uploadDir, "photos");
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error("Erro ao criar diretório", err);
    }

    // Gerar nome único
    const fileExt = path.extname(filename);
    const uniqueName = `${uuidv4()}${fileExt}`;
    const filePath = path.join(uploadDir, uniqueName);

    // Salvar arquivo
    try {
      await fs.writeFile(filePath, fileBuffer);
    } catch (err) {
      throw new AppError(500, "Erro ao salvar arquivo");
    }

    // Criar registro no BD
    const photo = await prisma.photo.create({
      data: {
        filePath: `/uploads/photos/${uniqueName}`,
        bookId: bookId,
      },
    });

    return photo;
  },

  async listPhotos(bookId?: number) {
    return await prisma.photo.findMany({
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

  async getPhoto(id: number) {
    const photo = await prisma.photo.findUnique({
      where: { id },
      include: {
        ocrResults: true,
        book: true,
      },
    });

    if (!photo) {
      throw new AppError(404, "Foto não encontrada");
    }

    return photo;
  },

  async deletePhoto(id: number) {
    const photo = await this.getPhoto(id);

    // Remover arquivo físico
    try {
      const filepath = path.join(process.cwd(), photo.filePath);
      await fs.unlink(filepath);
    } catch (err) {
      console.error("Erro ao remover arquivo físico", err);
    }

    // Remover registro no BD
    return await prisma.photo.delete({
      where: { id },
    });
  },

  async updatePhotoMetadata(id: number, metadata: any) {
    const photo = await this.getPhoto(id);
    const existingMeta = photo.metadata ? Object.assign({}, photo.metadata) : {};

    return await prisma.photo.update({
      where: { id },
      data: {
        metadata: Object.assign(existingMeta, metadata),
      },
    });
  },
};
