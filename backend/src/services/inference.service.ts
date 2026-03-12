import { prisma } from "../index";
import { booksService } from "./books.service";

interface InferenceResult {
  shelfId: number | null;
  confidence: number;
  reasoning: string;
}

export const inferenceService = {
  async inferShelfPosition(bookId: number): Promise<InferenceResult> {
    const book = await booksService.getBook(bookId);

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
      const similarBook = await prisma.book.findFirst({
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
      const authorBooks = await prisma.book.findMany({
        where: {
          author: book.author,
          shelfId: { not: null },
          deletedAt: null,
        },
        take: 5,
      });

      if (authorBooks.length > 0) {
        const shelves: any = {};
        authorBooks.forEach((b) => {
          if (b.shelfId) {
            shelves[b.shelfId] = (shelves[b.shelfId] || 0) + 1;
          }
        });

        const mostCommonShelfId = Object.entries(shelves).sort(
          (a: any, b: any) => b[1] - a[1]
        )[0]?.[0];

        if (mostCommonShelfId) {
          return {
            shelfId: parseInt(mostCommonShelfId as string),
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

  async suggestPositionIndex(shelfId: number): Promise<number> {
    // Encontrar próxima posição disponível na prateleira
    const maxPosition = await prisma.book.aggregate({
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
