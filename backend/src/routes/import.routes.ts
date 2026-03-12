import { Router } from "express";
import { importController } from "../controllers/import.controller";

const router = Router();

// uploadExcel é um array [middleware, handler]
router.post("/excel", importController.uploadExcel);
router.post("/excel/merge", importController.merge);
router.get("/logs", importController.logs);

export default router;
