import { prisma } from "../index";
import * as XLSX from "xlsx";
import * as fs from "fs/promises";
import { AppError } from "../middleware/errorHandler";
import { booksService } from "./books.service";
import { shelvesService } from "./shelves.service";

interface ExcelRow {
  [key: string]: any;
}

interface ImportResult {
  successCount: number;
  errorCount: number;
  skippedCount: number;
  errors: Array<{ row: number; error: string }>;
  newBooks: Array<{ title: string; author?: string; isbn?: string }>;
}

export const importService = {
  async parseExcelFile(filePath: string): Promise<ExcelRow[]> {
    try {
      // Ler ficheiro
      const fileBuffer = await fs.readFile(filePath);

      // Parse com XLSX
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];

      if (!sheetName) {
        throw new AppError(400, "Ficheiro Excel vazio");
      }

      const sheet = workbook.Sheets[sheetName];
      const rows: ExcelRow[] = XLSX.utils.sheet_to_json(sheet);

      return rows;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(500, "Erro ao fazer parse do ficheiro Excel");
    }
  },

  async detectColumns(rows: ExcelRow[]): Promise<{
    titleCol: string | null;
    authorCol: string | null;
    isbnCol: string | null;
    locationCol: string | null;
  }> {
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

    const titleCol = columns.find((c) =>
      c.toLowerCase().includes("title") || c.toLowerCase().includes("título")
    );
    const authorCol = columns.find((c) =>
      c.toLowerCase().includes("author") || c.toLowerCase().includes("autor")
    );
    const isbnCol = columns.find((c) =>
      c.toLowerCase().includes("isbn")
    );
    const locationCol = columns.find((c) =>
      c.toLowerCase().includes("location") ||
      c.toLowerCase().includes("prateleira") ||
      c.toLowerCase().includes("shelf")
    );

    return {
      titleCol: titleCol || null,
      authorCol: authorCol || null,
      isbnCol: isbnCol || null,
      locationCol: locationCol || null,
    };
  },

  async mergeExcelData(
    rows: ExcelRow[],
    columnMapping: {
      titleCol: string | null;
      authorCol: string | null;
      isbnCol: string | null;
      locationCol: string | null;
    }
  ): Promise<ImportResult> {
    const errors: Array<{ row: number; error: string }> = [];
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
        let book = isbn ? await booksService.getBookByIsbn(isbn) : null;

        if (book) {
          // Atualizar existente: preencher campos vazios
          await booksService.updateBook(book.id, {
            title: title || book.title,
            author: author || book.author,
            isbn: isbn || book.isbn,
          });
        } else {
          // Criar novo
          book = await booksService.createBook({
            title,
            author,
            isbn,
          });
          newBooks.push({ title, author, isbn });
        }

        // Atualizar localização se foi fornecida
        if (location) {
          // Tentar encontrar ou criar prateleira
          let shelf = await shelvesService.getShelfByLabel(location);

          if (!shelf) {
            // Parse automático: "A1" → sectionLetter="A", shelfNumber=1
            const match = location.match(/^([A-Z])(\d+)$/);
            if (match) {
              const sectionLetter = match[1];
              const shelfNumber = parseInt(match[2]);

              try {
                shelf = await shelvesService.createShelf({
                  label: location,
                  sectionLetter,
                  shelfNumber,
                });
              } catch (err) {
                // Se falhar na criação, apenas não atualizar localização
                console.warn(
                  `Não conseguiu criar prateleira ${location}`,
                  err
                );
              }
            }
          }

          if (shelf) {
            await booksService.updateBook(book.id, {
              shelfId: shelf.id,
              status: "catalogado",
            });
          }
        }

        successCount++;
      } catch (err) {
        errors.push({
          row: rowNum,
          error: err instanceof Error ? err.message : "Erro desconhecido",
        });
      }
    }

    // Guardar log de import
    await prisma.excelImportLog.create({
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
