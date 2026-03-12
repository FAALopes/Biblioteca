import { prisma } from "../index";
import { CreateBookInput, UpdateBookInput, PaginationQuery } from "../types";
import { AppError } from "../middleware/errorHandler";

export const booksService = {
  async listBooks(query: PaginationQuery & { status?: string; shelfId?: number; search?: string }) {
    const skip = query.skip || (query.page ? query.page * (query.limit || 10) : 0);
    const take = query.take || query.limit || 10;

    const whereClause: any = {
      deletedAt: null, // exclude soft-deleted books
    };

    if (query.status) whereClause.status = query.status;
    if (query.shelfId) whereClause.shelfId = query.shelfId;
    if (query.search) {
      whereClause.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { author: { contains: query.search, mode: "insensitive" } },
        { isbn: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where: whereClause,
        include: { shelf: true },
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.book.count({ where: whereClause }),
    ]);

    return {
      books,
      total,
      page: query.page || 0,
      limit: take,
    };
  },

  async getBook(id: number) {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        shelf: true,
        photos: true,
        ocrResults: true,
      },
    });

    if (!book || book.deletedAt) {
      throw new AppError(404, "Livro não encontrado");
    }

    return book;
  },

  async createBook(data: CreateBookInput) {
    // Validar ISBN único (se fornecido)
    if (data.isbn) {
      const existing = await prisma.book.findUnique({
        where: { isbn: data.isbn },
      });
      if (existing && !existing.deletedAt) {
        throw new AppError(409, "ISBN já existe");
      }
    }

    return await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        notes: data.notes,
        shelfId: data.shelfId,
        positionIndex: data.positionIndex,
      },
      include: { shelf: true },
    });
  },

  async updateBook(id: number, data: UpdateBookInput) {
    const book = await this.getBook(id);

    // Se ISBN mudou, validar unicidade
    if (data.isbn && data.isbn !== book.isbn) {
      const existing = await prisma.book.findUnique({
        where: { isbn: data.isbn },
      });
      if (existing && !existing.deletedAt) {
        throw new AppError(409, "ISBN já existe");
      }
    }

    return await prisma.book.update({
      where: { id },
      data: {
        ...data,
        statusUpdatedAt: data.status ? new Date() : undefined,
      },
      include: { shelf: true },
    });
  },

  async deleteBook(id: number) {
    await this.getBook(id); // Validar existência

    // Soft delete
    return await prisma.book.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async getBookByIsbn(isbn: string) {
    return await prisma.book.findUnique({
      where: { isbn },
      include: { shelf: true },
    });
  },

  async getStats() {
    const [total, catalogued, byStatus, byShelves] = await Promise.all([
      prisma.book.count({ where: { deletedAt: null } }),
      prisma.book.count({ where: { deletedAt: null, status: { not: "nao-catalogado" } } }),
      prisma.book.groupBy({
        by: ["status"],
        where: { deletedAt: null },
        _count: true,
      }),
      prisma.book.groupBy({
        by: ["shelfId"],
        where: { deletedAt: null, shelfId: { not: null } },
        _count: true,
      }),
    ]);

    return {
      total,
      catalogued,
      percentCatalogued: total > 0 ? Math.round((catalogued / total) * 100) : 0,
      byStatus: byStatus.map((s) => ({
        status: s.status,
        count: s._count,
      })),
      byShelf: byShelves.map((s) => ({
        shelfId: s.shelfId,
        count: s._count,
      })),
    };
  },
};
