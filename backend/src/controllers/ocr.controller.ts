import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";

export const ocrController = {
  analyze: asyncHandler(async (req: Request, res: Response) => {
    res.status(501).json({
      success: false,
      error: "Não implementado ainda",
    });
  }),

  pending: asyncHandler(async (req: Request, res: Response) => {
    res.status(501).json({
      success: false,
      error: "Não implementado ainda",
    });
  }),
};
