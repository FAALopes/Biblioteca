"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ocr_controller_1 = require("../controllers/ocr.controller");
const router = (0, express_1.Router)();
router.post("/analyze", ocr_controller_1.ocrController.analyze);
router.get("/pending", ocr_controller_1.ocrController.pending);
exports.default = router;
//# sourceMappingURL=ocr.routes.js.map