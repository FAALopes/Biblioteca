import { Router } from "express";
import { shelvesController } from "../controllers/shelves.controller";

const router = Router();

router.get("/", shelvesController.list);
router.get("/:id", shelvesController.get);
router.post("/", shelvesController.create);
router.put("/:id", shelvesController.update);
router.delete("/:id", shelvesController.delete);

export default router;
