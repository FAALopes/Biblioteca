"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksController = void 0;
const books_service_1 = require("../services/books.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.booksController = {
    list: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { skip, take, page, limit, status, shelfId, search } = req.query;
        const books = await books_service_1.booksService.listBooks({
            skip: skip ? parseInt(skip) : undefined,
            take: take ? parseInt(take) : undefined,
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
            status: status,
            shelfId: shelfId ? parseInt(shelfId) : undefined,
            search: search,
        });
        res.json({
            success: true,
            data: books,
        });
    }),
    get: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const book = await books_service_1.booksService.getBook(parseInt(id));
        res.json({
            success: true,
            data: book,
        });
    }),
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const data = req.body;
        const book = await books_service_1.booksService.createBook({
            title: data.title,
            author: data.author,
            isbn: data.isbn,
            notes: data.notes,
            shelfId: data.shelfId ? parseInt(data.shelfId) : undefined,
            positionIndex: data.positionIndex ? parseInt(data.positionIndex) : undefined,
        });
        res.status(201).json({
            success: true,
            data: book,
        });
    }),
    update: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const book = await books_service_1.booksService.updateBook(parseInt(id), {
            title: data.title,
            author: data.author,
            isbn: data.isbn,
            notes: data.notes,
            shelfId: data.shelfId ? parseInt(data.shelfId) : undefined,
            positionIndex: data.positionIndex ? parseInt(data.positionIndex) : undefined,
            status: data.status,
            coverImagePath: data.coverImagePath,
        });
        res.json({
            success: true,
            data: book,
        });
    }),
    delete: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        await books_service_1.booksService.deleteBook(parseInt(id));
        res.json({
            success: true,
            message: "Livro removido",
        });
    }),
    stats: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const stats = await books_service_1.booksService.getStats();
        res.json({
            success: true,
            data: stats,
        });
    }),
};
//# sourceMappingURL=books.controller.js.map