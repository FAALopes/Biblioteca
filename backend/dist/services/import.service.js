"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.importService = void 0;
const index_1 = require("../index");
const XLSX = __importStar(require("xlsx"));
const fs = __importStar(require("fs/promises"));
const errorHandler_1 = require("../middleware/errorHandler");
const books_service_1 = require("./books.service");
const shelves_service_1 = require("./shelves.service");
exports.importService = {
    async parseExcelFile(filePath) {
        try {
            // Ler ficheiro
            const fileBuffer = await fs.readFile(filePath);
            // Parse com XLSX
            const workbook = XLSX.read(fileBuffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            if (!sheetName) {
                throw new errorHandler_1.AppError(400, "Ficheiro Excel vazio");
            }
            const sheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(sheet);
            return rows;
        }
        catch (err) {
            if (err instanceof errorHandler_1.AppError)
                throw err;
            throw new errorHandler_1.AppError(500, "Erro ao fazer parse do ficheiro Excel");
        }
    },
    async detectColumns(rows) {
        // Heurística simples: procurar colunas com nomes parecidos
        if (rows.length === 0) {
            return {
                titleCol: null,
                authorCol: null,
                isbnCol: null,
                locationCol: null,
            };
        }
        const firstRow = rows[0];
        const columns = Object.keys(firstRow);
        const titleCol = columns.find((c) => c.toLowerCase().includes("title") || c.toLowerCase().includes("título"));
        const authorCol = columns.find((c) => c.toLowerCase().includes("author") || c.toLowerCase().includes("autor"));
        const isbnCol = columns.find((c) => c.toLowerCase().includes("isbn"));
        const locationCol = columns.find((c) => c.toLowerCase().includes("location") ||
            c.toLowerCase().includes("prateleira") ||
            c.toLowerCase().includes("shelf"));
        return {
            titleCol: titleCol || null,
            authorCol: authorCol || null,
            isbnCol: isbnCol || null,
            locationCol: locationCol || null,
        };
    },
    async mergeExcelData(rows, columnMapping) {
        const errors = [];
        const newBooks = [];
        let successCount = 0;
        let skippedCount = 0;
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            const row = rows[rowIndex];
            const rowNum = rowIndex + 2; // +2 porque header é linha 1, dados começam em linha 2
            try {
                // Extrair campos
                const title = columnMapping.titleCol
                    ? row[columnMapping.titleCol]?.toString().trim()
                    : null;
                const author = columnMapping.authorCol
                    ? row[columnMapping.authorCol]?.toString().trim()
                    : null;
                const isbn = columnMapping.isbnCol
                    ? row[columnMapping.isbnCol]?.toString().trim()
                    : null;
                const location = columnMapping.locationCol
                    ? row[columnMapping.locationCol]?.toString().trim()
                    : null;
                // Validar título obrigatório
                if (!title || title.length < 2) {
                    skippedCount++;
                    errors.push({
                        row: rowNum,
                        error: "Título obrigatório ou inválido",
                    });
                    continue;
                }
                // Smart merge: se ISBN existe, atualizar; senão, criar novo
                let book = isbn ? await books_service_1.booksService.getBookByIsbn(isbn) : null;
                if (book) {
                    // Atualizar existente: preencher campos vazios
                    await books_service_1.booksService.updateBook(book.id, {
                        title: title || book.title,
                        author: author || book.author,
                        isbn: isbn || book.isbn,
                    });
                }
                else {
                    // Criar novo
                    book = await books_service_1.booksService.createBook({
                        title,
                        author,
                        isbn,
                    });
                    newBooks.push({ title, author, isbn });
                }
                // Atualizar localização se foi fornecida
                if (location) {
                    // Tentar encontrar ou criar prateleira
                    let shelf = await shelves_service_1.shelvesService.getShelfByLabel(location);
                    if (!shelf) {
                        // Parse automático: "A1" → sectionLetter="A", shelfNumber=1
                        const match = location.match(/^([A-Z])(\d+)$/);
                        if (match) {
                            const sectionLetter = match[1];
                            const shelfNumber = parseInt(match[2]);
                            try {
                                shelf = await shelves_service_1.shelvesService.createShelf({
                                    label: location,
                                    sectionLetter,
                                    shelfNumber,
                                });
                            }
                            catch (err) {
                                // Se falhar na criação, apenas não atualizar localização
                                console.warn(`Não conseguiu criar prateleira ${location}`, err);
                            }
                        }
                    }
                    if (shelf) {
                        await books_service_1.booksService.updateBook(book.id, {
                            shelfId: shelf.id,
                            status: "catalogado",
                        });
                    }
                }
                successCount++;
            }
            catch (err) {
                errors.push({
                    row: rowNum,
                    error: err instanceof Error ? err.message : "Erro desconhecido",
                });
            }
        }
        // Guardar log de import
        await index_1.prisma.excelImportLog.create({
            data: {
                filename: "import.xlsx",
                totalRows: rows.length,
                successCount,
                errorCount: errors.length,
                errors: { errors },
            },
        });
        return {
            successCount,
            errorCount: errors.length,
            skippedCount,
            errors,
            newBooks,
        };
    },
};
//# sourceMappingURL=import.service.js.map