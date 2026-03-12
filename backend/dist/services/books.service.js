"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksService = void 0;
const index_1 = require("../index");
const errorHandler_1 = require("../middleware/errorHandler");
exports.booksService = {
    async listBooks(query) {
        const skip = query.skip || (query.page ? query.page * (query.limit || 10) : 0);
        const take = query.take || query.limit || 10;
        const whereClause = {
            deletedAt: null, // exclude soft-deleted books
        };
        if (query.status)
            whereClause.status = query.status;
        if (query.shelfId)
            whereClause.shelfId = query.shelfId;
        if (query.search) {
            whereClause.OR = [
                { title: { contains: query.search, mode: "insensitive" } },
                { author: { contains: query.search, mode: "insensitive" } },
                { isbn: { contains: query.search, mode: "insensitive" } },
            ];
        }
        const [books, total] = await Promise.all([
            index_1.prisma.book.findMany({
                where: whereClause,
                include: { shelf: true },
                skip,
                take,
                orderBy: { createdAt: "desc" },
            }),
            index_1.prisma.book.count({ where: whereClause }),
        ]);
        return {
            books,
            total,
            page: query.page || 0,
            limit: take,
        };
    },
    async getBook(id) {
        const book = await index_1.prisma.book.findUnique({
            where: { id },
            include: {
                shelf: true,
                photos: true,
                ocrResults: true,
            },
        });
        if (!book || book.deletedAt) {
            throw new errorHandler_1.AppError(404, "Livro não encontrado");
        }
        return book;
    },
    async createBook(data) {
        // Validar ISBN único (se fornecido)
        if (data.isbn) {
            const existing = await index_1.prisma.book.findUnique({
                where: { isbn: data.isbn },
            });
            if (existing && !existing.deletedAt) {
                throw new errorHandler_1.AppError(409, "ISBN já existe");
            }
        }
        return await index_1.prisma.book.create({
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
    async updateBook(id, data) {
        const book = await this.getBook(id);
        // Se ISBN mudou, validar unicidade
        if (data.isbn && data.isbn !== book.isbn) {
            const existing = await index_1.prisma.book.findUnique({
                where: { isbn: data.isbn },
            });
            if (existing && !existing.deletedAt) {
                throw new errorHandler_1.AppError(409, "ISBN já existe");
            }
        }
        return await index_1.prisma.book.update({
            where: { id },
            data: {
                ...data,
                statusUpdatedAt: data.status ? new Date() : undefined,
            },
            include: { shelf: true },
        });
    },
    async deleteBook(id) {
        await this.getBook(id); // Validar existência
        // Soft delete
        return await index_1.prisma.book.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    },
    async getBookByIsbn(isbn) {
        return await index_1.prisma.book.findUnique({
            where: { isbn },
            include: { shelf: true },
        });
    },
    async getStats() {
        const [total, catalogued, byStatus, byShelves] = await Promise.all([
            index_1.prisma.book.count({ where: { deletedAt: null } }),
            index_1.prisma.book.count({ where: { deletedAt: null, status: { not: "nao-catalogado" } } }),
            index_1.prisma.book.groupBy({
                by: ["status"],
                where: { deletedAt: null },
                _count: true,
            }),
            index_1.prisma.book.groupBy({
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
//# sourceMappingURL=books.service.js.map