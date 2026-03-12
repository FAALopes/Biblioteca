import { Request, Response } from "express";
import { shelvesService } from "../services/shelves.service";
import { asyncHandler } from "../utils/asyncHandler";

export const shelvesController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const shelves = await shelvesService.listShelves();

    res.json({
      success: true,
      data: shelves,
    });
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const shelf = await shelvesService.getShelf(parseInt(id));

    res.json({
      success: true,
      data: shelf,
    });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;

    const shelf = await shelvesService.createShelf({
      label: data.label,
      sectionLetter: data.sectionLetter,
      shelfNumber: parseInt(data.shelfNumber),
      capacity: data.capacity ? parseInt(data.capacity) : undefined,
      notes: data.notes,
    });

    res.status(201).json({
      success: true,
      data: shelf,
    });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;

    const shelf = await shelvesService.updateShelf(parseInt(id), {
      label: data.label,
      sectionLetter: data.sectionLetter,
      shelfNumber: data.shelfNumber ? parseInt(data.shelfNumber) : undefined,
      capacity: data.capacity ? parseInt(data.capacity) : undefined,
      notes: data.notes,
    });

    res.json({
      success: true,
      data: shelf,
    });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await shelvesService.deleteShelf(parseInt(id));

    res.json({
      success: true,
      message: "Prateleira removida",
    });
  }),
};
