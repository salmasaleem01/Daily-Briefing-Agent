"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const isDev = process.env.NODE_ENV === 'development';
const options = {
    level: process.env.LOG_LEVEL || 'info',
    ...(isDev ? { transport: { target: 'pino-pretty' } } : {}),
};
exports.logger = (0, pino_1.default)(options);
//# sourceMappingURL=logger.js.map