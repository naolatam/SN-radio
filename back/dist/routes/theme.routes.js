"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const theme_controller_1 = require("../controllers/theme.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/themes:
 *   get:
 *     summary: Get all themes
 *     tags: [Themes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all themes
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, theme_controller_1.themeController.getAllThemes.bind(theme_controller_1.themeController));
/**
 * @swagger
 * /api/themes/active:
 *   get:
 *     summary: Get active theme
 *     tags: [Themes]
 *     responses:
 *       200:
 *         description: Active theme configuration
 *       404:
 *         description: No active theme found
 */
router.get('/active', theme_controller_1.themeController.getActiveTheme.bind(theme_controller_1.themeController));
/**
 * @swagger
 * /api/themes/{id}:
 *   get:
 *     summary: Get theme by ID
 *     tags: [Themes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Theme details
 *       404:
 *         description: Theme not found
 */
router.get('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, theme_controller_1.themeController.getThemeById.bind(theme_controller_1.themeController));
/**
 * @swagger
 * /api/themes:
 *   post:
 *     summary: Create new theme
 *     tags: [Themes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *               - primaryColor
 *               - secondaryColor
 *               - backgroundColor
 *               - siteName
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               primaryColor:
 *                 type: string
 *               secondaryColor:
 *                 type: string
 *               backgroundColor:
 *                 type: string
 *               favicon:
 *                 type: string
 *               icon:
 *                 type: string
 *               logo:
 *                 type: string
 *               siteName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Theme created
 *       400:
 *         description: Invalid input
 */
router.post('/', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, theme_controller_1.themeController.createTheme.bind(theme_controller_1.themeController));
/**
 * @swagger
 * /api/themes/{id}:
 *   put:
 *     summary: Update theme
 *     tags: [Themes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Theme updated
 *       404:
 *         description: Theme not found
 */
router.put('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, theme_controller_1.themeController.updateTheme.bind(theme_controller_1.themeController));
/**
 * @swagger
 * /api/themes/{id}:
 *   delete:
 *     summary: Delete theme
 *     tags: [Themes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Theme deleted
 *       404:
 *         description: Theme not found
 */
router.delete('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, theme_controller_1.themeController.deleteTheme.bind(theme_controller_1.themeController));
/**
 * @swagger
 * /api/themes/{id}/activate:
 *   post:
 *     summary: Activate theme
 *     tags: [Themes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Theme activated
 *       404:
 *         description: Theme not found
 */
router.post('/:id/activate', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, theme_controller_1.themeController.activateTheme.bind(theme_controller_1.themeController));
/**
 * @swagger
 * /api/themes/{id}/duplicate:
 *   post:
 *     summary: Duplicate theme
 *     tags: [Themes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       201:
 *         description: Theme duplicated
 *       400:
 *         description: Invalid input
 */
router.post('/:id/duplicate', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, theme_controller_1.themeController.duplicateTheme.bind(theme_controller_1.themeController));
exports.default = router;
//# sourceMappingURL=theme.routes.js.map