"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const books_controller_1 = require("../controllers/books.controller");
const router = (0, express_1.Router)();
router.get("/", books_controller_1.booksController.list);
router.get("/stats", books_controller_1.booksController.stats);
router.get("/:id", books_controller_1.booksController.get);
router.post("/", books_controller_1.booksController.create);
router.put("/:id", books_controller_1.booksController.update);
router.delete("/:id", books_controller_1.booksController.delete);
exports.default = router;
//# sourceMappingURL=books.routes.js.map