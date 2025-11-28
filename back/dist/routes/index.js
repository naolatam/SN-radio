"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const article_routes_1 = __importDefault(require("./article.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const theme_routes_1 = __importDefault(require("./theme.routes"));
const staff_routes_1 = __importDefault(require("./staff.routes"));
const router = (0, express_1.Router)();
// Mount routes
router.use('/users', user_routes_1.default);
router.use('/articles', article_routes_1.default);
router.use('/categories', category_routes_1.default);
router.use('/themes', theme_routes_1.default);
router.use('/staff', staff_routes_1.default);
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API is running and responsive
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "API is running"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map