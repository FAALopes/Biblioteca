"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const photos_controller_1 = require("../controllers/photos.controller");
const router = (0, express_1.Router)();
// Upload é um array [middleware, handler]
router.post("/", photos_controller_1.photosController.upload);
router.get("/", photos_controller_1.photosController.list);
router.get("/:id", photos_controller_1.photosController.get);
router.delete("/:id", photos_controller_1.photosController.delete);
exports.default = router;
//# sourceMappingURL=photos.routes.js.map