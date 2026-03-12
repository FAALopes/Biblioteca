"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shelves_controller_1 = require("../controllers/shelves.controller");
const router = (0, express_1.Router)();
router.get("/", shelves_controller_1.shelvesController.list);
router.get("/:id", shelves_controller_1.shelvesController.get);
router.post("/", shelves_controller_1.shelvesController.create);
router.put("/:id", shelves_controller_1.shelvesController.update);
router.delete("/:id", shelves_controller_1.shelvesController.delete);
exports.default = router;
//# sourceMappingURL=shelves.routes.js.map