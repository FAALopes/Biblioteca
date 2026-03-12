"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shelvesService = void 0;
const index_1 = require("../index");
const errorHandler_1 = require("../middleware/errorHandler");
exports.shelvesService = {
    async listShelves() {
        return await index_1.prisma.shelf.findMany({
            include: {
                _count: {
                    select: { books: true },
                },
            },
            orderBy: [{ sectionLetter: "asc" }, { shelfNumber: "asc" }],
        });
    },
    async getShelf(id) {
        const shelf = await index_1.prisma.shelf.findUnique({
            where: { id },
            include: {
                books: {
                    where: { deletedAt: null },
                    orderBy: { positionIndex: "asc" },
                },
            },
        });
        if (!shelf) {
            throw new errorHandler_1.AppError(404, "Prateleira não encontrada");
        }
        return shelf;
    },
    async getShelfByLabel(label) {
        return await index_1.prisma.shelf.findUnique({
            where: { label },
            include: {
                books: {
                    where: { deletedAt: null },
                    orderBy: { positionIndex: "asc" },
                },
            },
        });
    },
    async createShelf(data) {
        // Validar label único
        const existing = await index_1.prisma.shelf.findUnique({
            where: { label: data.label },
        });
        if (existing) {
            throw new errorHandler_1.AppError(409, "Prateleira com este rótulo já existe");
        }
        // Validar combinação sectionLetter + shelfNumber única
        const existingCombination = await index_1.prisma.shelf.findUnique({
            where: {
                sectionLetter_shelfNumber: {
                    sectionLetter: data.sectionLetter,
                    shelfNumber: data.shelfNumber,
                },
            },
        });
        if (existingCombination) {
            throw new errorHandler_1.AppError(409, "Já existe uma prateleira nesta secção e posição");
        }
        return await index_1.prisma.shelf.create({
            data: {
                label: data.label,
                sectionLetter: data.sectionLetter,
                shelfNumber: data.shelfNumber,
                capacity: data.capacity,
                notes: data.notes,
            },
            include: {
                books: {
                    where: { deletedAt: null },
                    orderBy: { positionIndex: "asc" },
                },
            },
        });
    },
    async updateShelf(id, data) {
        const shelf = await this.getShelf(id);
        // Validar se novo label já existe
        if (data.label && data.label !== shelf.label) {
            const existing = await index_1.prisma.shelf.findUnique({
                where: { label: data.label },
            });
            if (existing) {
                throw new errorHandler_1.AppError(409, "Prateleira com este rótulo já existe");
            }
        }
        return await index_1.prisma.shelf.update({
            where: { id },
            data: {
                label: data.label ?? shelf.label,
                sectionLetter: data.sectionLetter ?? shelf.sectionLetter,
                shelfNumber: data.shelfNumber ?? shelf.shelfNumber,
                capacity: data.capacity ?? shelf.capacity,
                notes: data.notes ?? shelf.notes,
            },
        });
    },
    async deleteShelf(id) {
        const shelf = await this.getShelf(id);
        // Validar que prateleira está vazia
        const booksCount = await index_1.prisma.book.count({
            where: {
                shelfId: id,
                deletedAt: null,
            },
        });
        if (booksCount > 0) {
            throw new errorHandler_1.AppError(409, "Não é possível remover uma prateleira com livros");
        }
        return await index_1.prisma.shelf.delete({
            where: { id },
        });
    },
};
//# sourceMappingURL=shelves.service.js.map