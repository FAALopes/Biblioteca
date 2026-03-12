import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";

export const photosController = {
  upload: asyncHandler(async (req: Request, res: Response) => {
    res.status(501).json({
      success: false,
      error: "Não implementado ainda",
    });
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    res.status(501).json({
      success: false,
      error: "Não implementado ainda",
    });
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    res.status(501).json({
      success: false,
      error: "Não implementado ainda",
    });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    res.status(501).json({
      success: false,
      error: "Não implementado ainda",
    });
  }),
};
