import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";

export const importController = {
  uploadExcel: asyncHandler(async (req: Request, res: Response) => {
    res.status(501).json({
      success: false,
      error: "Não implementado ainda",
    });
  }),

  merge: asyncHandler(async (req: Request, res: Response) => {
    res.status(501).json({
      success: false,
      error: "Não implementado ainda",
    });
  }),

  logs: asyncHandler(async (req: Request, res: Response) => {
    res.status(501).json({
      success: false,
      error: "Não implementado ainda",
    });
  }),
};
