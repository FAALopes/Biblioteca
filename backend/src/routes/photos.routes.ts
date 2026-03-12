import { Router } from "express";
import { photosController } from "../controllers/photos.controller";

const router = Router();

// Upload é um array [middleware, handler]
router.post("/", photosController.upload);
router.get("/", photosController.list);
router.get("/:id", photosController.get);
router.delete("/:id", photosController.delete);

export default router;
