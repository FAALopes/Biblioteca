"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProduction = exports.isDevelopment = exports.config = void 0;
exports.config = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "3001", 10),
    uploadDir: process.env.UPLOAD_DIR || "./uploads",
    apiPrefix: "/api",
};
exports.isDevelopment = exports.config.nodeEnv === "development";
exports.isProduction = exports.config.nodeEnv === "production";
//# sourceMappingURL=config.js.map