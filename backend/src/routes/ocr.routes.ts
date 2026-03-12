import { Router } from "express";
import { ocrController } from "../controllers/ocr.controller";

const router = Router();

router.post("/analyze", ocrController.analyze);
router.get("/pending", ocrController.pending);

export default router;
