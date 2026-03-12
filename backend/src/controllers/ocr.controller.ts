import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ocrService } from "../services/ocr.service";

export const ocrController = {
  analyze: asyncHandler(async (req: Request, res: Response) => {
    const { photoId } = req.body;

    const result = await ocrService.analyzePhoto(photoId);

    res.json({
      success: true,
      data: result,
    });
  }),

  pending: asyncHandler(async (req: Request, res: Response) => {
    const photos = await ocrService.getPendingPhotos();

    res.json({
      success: true,
      data: photos,
    });
  }),
};
