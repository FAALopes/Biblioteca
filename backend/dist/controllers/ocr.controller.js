"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ocrController = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ocr_service_1 = require("../services/ocr.service");
exports.ocrController = {
    analyze: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { photoId } = req.body;
        const result = await ocr_service_1.ocrService.analyzePhoto(photoId);
        res.json({
            success: true,
            data: result,
        });
    }),
    pending: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const photos = await ocr_service_1.ocrService.getPendingPhotos();
        res.json({
            success: true,
            data: photos,
        });
    }),
};
//# sourceMappingURL=ocr.controller.js.map