"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.briefingRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const runBriefing_1 = require("../agent/runBriefing");
exports.briefingRouter = (0, express_1.Router)();
const BodySchema = zod_1.z.object({
    city: zod_1.z.string().min(1),
    countryCode: zod_1.z.string().optional().or(zod_1.z.literal('')).transform(v => v || undefined),
    tickers: zod_1.z.array(zod_1.z.string().min(1)).default([]),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal('')).transform(v => v || undefined),
});
exports.briefingRouter.post('/', async (req, res) => {
    const parsed = BodySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
        const result = await (0, runBriefing_1.runBriefing)(parsed.data);
        res.json(result);
    }
    catch (e) {
        res.status(500).json({ error: 'Failed to generate briefing' });
    }
});
//# sourceMappingURL=briefing.js.map