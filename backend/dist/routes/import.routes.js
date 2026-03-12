"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const import_controller_1 = require("../controllers/import.controller");
const router = (0, express_1.Router)();
// uploadExcel é um array [middleware, handler]
router.post("/excel", import_controller_1.importController.uploadExcel);
router.post("/excel/merge", import_controller_1.importController.merge);
router.get("/logs", import_controller_1.importController.logs);
exports.default = router;
//# sourceMappingURL=import.routes.js.map