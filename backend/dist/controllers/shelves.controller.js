"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shelvesController = void 0;
const shelves_service_1 = require("../services/shelves.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.shelvesController = {
    list: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const shelves = await shelves_service_1.shelvesService.listShelves();
        res.json({
            success: true,
            data: shelves,
        });
    }),
    get: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const shelf = await shelves_service_1.shelvesService.getShelf(parseInt(id));
        res.json({
            success: true,
            data: shelf,
        });
    }),
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const data = req.body;
        const shelf = await shelves_service_1.shelvesService.createShelf({
            label: data.label,
            sectionLetter: data.sectionLetter,
            shelfNumber: parseInt(data.shelfNumber),
            capacity: data.capacity ? parseInt(data.capacity) : undefined,
            notes: data.notes,
        });
        res.status(201).json({
            success: true,
            data: shelf,
        });
    }),
    update: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const shelf = await shelves_service_1.shelvesService.updateShelf(parseInt(id), {
            label: data.label,
            sectionLetter: data.sectionLetter,
            shelfNumber: data.shelfNumber ? parseInt(data.shelfNumber) : undefined,
            capacity: data.capacity ? parseInt(data.capacity) : undefined,
            notes: data.notes,
        });
        res.json({
            success: true,
            data: shelf,
        });
    }),
    delete: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        await shelves_service_1.shelvesService.deleteShelf(parseInt(id));
        res.json({
            success: true,
            message: "Prateleira removida",
        });
    }),
};
//# sourceMappingURL=shelves.controller.js.map