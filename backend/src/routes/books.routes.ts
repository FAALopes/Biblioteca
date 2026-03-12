import { Router } from "express";
import { booksController } from "../controllers/books.controller";

const router = Router();

router.get("/", booksController.list);
router.get("/stats", booksController.stats);
router.get("/:id", booksController.get);
router.post("/", booksController.create);
router.put("/:id", booksController.update);
router.delete("/:id", booksController.delete);

export default router;
