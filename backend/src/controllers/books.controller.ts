import { Request, Response } from "express";
import { booksService } from "../services/books.service";
import { asyncHandler } from "../utils/asyncHandler";

export const booksController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { skip, take, page, limit, status, shelfId, search } = req.query;

    const books = await booksService.listBooks({
      skip: skip ? parseInt(skip as string) : undefined,
      take: take ? parseInt(take as string) : undefined,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as string,
      shelfId: shelfId ? parseInt(shelfId as string) : undefined,
      search: search as string,
    });

    res.json({
      success: true,
      data: books,
    });
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const book = await booksService.getBook(parseInt(id));

    res.json({
      success: true,
      data: book,
    });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;

    const book = await booksService.createBook({
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

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;

    const book = await booksService.updateBook(parseInt(id), {
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

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await booksService.deleteBook(parseInt(id));

    res.json({
      success: true,
      message: "Livro removido",
    });
  }),

  stats: asyncHandler(async (req: Request, res: Response) => {
    const stats = await booksService.getStats();

    res.json({
      success: true,
      data: stats,
    });
  }),
};
