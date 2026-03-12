import { prisma } from "../index";
import { CreateShelfInput } from "../types";
import { AppError } from "../middleware/errorHandler";

export const shelvesService = {
  async listShelves() {
    return await prisma.shelf.findMany({
      include: {
        _count: {
          select: { books: true },
        },
      },
      orderBy: [{ sectionLetter: "asc" }, { shelfNumber: "asc" }],
    });
  },

  async getShelf(id: number) {
    const shelf = await prisma.shelf.findUnique({
      where: { id },
      include: {
        books: {
          where: { deletedAt: null },
          orderBy: { positionIndex: "asc" },
        },
      },
    });

    if (!shelf) {
      throw new AppError(404, "Prateleira não encontrada");
    }

    return shelf;
  },

  async getShelfByLabel(label: string) {
    return await prisma.shelf.findUnique({
      where: { label },
      include: {
        books: {
          where: { deletedAt: null },
          orderBy: { positionIndex: "asc" },
        },
      },
    });
  },

  async createShelf(data: CreateShelfInput) {
    // Validar label único
    const existing = await prisma.shelf.findUnique({
      where: { label: data.label },
    });

    if (existing) {
      throw new AppError(409, "Prateleira com este rótulo já existe");
    }

    // Validar combinação sectionLetter + shelfNumber única
    const existingCombination = await prisma.shelf.findUnique({
      where: {
        sectionLetter_shelfNumber: {
          sectionLetter: data.sectionLetter,
          shelfNumber: data.shelfNumber,
        },
      },
    });

    if (existingCombination) {
      throw new AppError(
        409,
        "Já existe uma prateleira nesta secção e posição"
      );
    }

    return await prisma.shelf.create({
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

  async updateShelf(
    id: number,
    data: Partial<CreateShelfInput>
  ) {
    const shelf = await this.getShelf(id);

    // Validar se novo label já existe
    if (data.label && data.label !== shelf.label) {
      const existing = await prisma.shelf.findUnique({
        where: { label: data.label },
      });
      if (existing) {
        throw new AppError(409, "Prateleira com este rótulo já existe");
      }
    }

    return await prisma.shelf.update({
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

  async deleteShelf(id: number) {
    const shelf = await this.getShelf(id);

    // Validar que prateleira está vazia
    const booksCount = await prisma.book.count({
      where: {
        shelfId: id,
        deletedAt: null,
      },
    });

    if (booksCount > 0) {
      throw new AppError(
        409,
        "Não é possível remover uma prateleira com livros"
      );
    }

    return await prisma.shelf.delete({
      where: { id },
    });
  },
};
