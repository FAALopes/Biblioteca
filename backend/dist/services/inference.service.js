"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferenceService = void 0;
const index_1 = require("../index");
const books_service_1 = require("./books.service");
exports.inferenceService = {
    async inferShelfPosition(bookId) {
        const book = await books_service_1.booksService.getBook(bookId);
        // Estratégia 1: Se já tem localização, retornar com alta confiança
        if (book.shelfId) {
            return {
                shelfId: book.shelfId,
                confidence: 0.95,
                reasoning: "Livro já tem localização atribuída",
            };
        }
        // Estratégia 2: Se ISBN existe, procurar por ISBN em livros já catalogados
        if (book.isbn) {
            const similarBook = await index_1.prisma.book.findFirst({
                where: {
                    isbn: book.isbn,
                    shelfId: { not: null },
                    deletedAt: null,
                },
            });
            if (similarBook) {
                return {
                    shelfId: similarBook.shelfId,
                    confidence: 0.9,
                    reasoning: "Inferido pelo ISBN",
                };
            }
        }
        // Estratégia 3: Se têm o mesmo autor, procurar autor em livros já catalogados
        if (book.author) {
            const authorBooks = await index_1.prisma.book.findMany({
                where: {
                    author: book.author,
                    shelfId: { not: null },
                    deletedAt: null,
                },
                take: 5,
            });
            if (authorBooks.length > 0) {
                const shelves = {};
                authorBooks.forEach((b) => {
                    if (b.shelfId) {
                        shelves[b.shelfId] = (shelves[b.shelfId] || 0) + 1;
                    }
                });
                const mostCommonShelfId = Object.entries(shelves).sort((a, b) => b[1] - a[1])[0]?.[0];
                if (mostCommonShelfId) {
                    return {
                        shelfId: parseInt(mostCommonShelfId),
                        confidence: 0.6,
                        reasoning: `Inferido pela prateleira comum do autor "${book.author}"`,
                    };
                }
            }
        }
        // Sem inferência possível
        return {
            shelfId: null,
            confidence: 0,
            reasoning: "Dados insuficientes para inferência",
        };
    },
    async suggestPositionIndex(shelfId) {
        // Encontrar próxima posição disponível na prateleira
        const maxPosition = await index_1.prisma.book.aggregate({
            where: {
                shelfId,
                deletedAt: null,
            },
            _max: {
                positionIndex: true,
            },
        });
        return (maxPosition._max.positionIndex || 0) + 1;
    },
};
//# sourceMappingURL=inference.service.js.map