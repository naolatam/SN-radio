import { Router } from 'express';
import { themeController } from '../controllers/theme.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

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
router.get('/', authMiddleware, adminMiddleware, themeController.getAllThemes.bind(themeController));

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
router.get('/active', themeController.getActiveTheme.bind(themeController));

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
router.get('/:id', authMiddleware, adminMiddleware, themeController.getThemeById.bind(themeController));

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
router.post('/', authMiddleware, adminMiddleware, themeController.createTheme.bind(themeController));

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
router.put('/:id', authMiddleware, adminMiddleware, themeController.updateTheme.bind(themeController));

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
router.delete('/:id', authMiddleware, adminMiddleware, themeController.deleteTheme.bind(themeController));

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
router.post('/:id/activate', authMiddleware, adminMiddleware, themeController.activateTheme.bind(themeController));

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
router.post('/:id/duplicate', authMiddleware, adminMiddleware, themeController.duplicateTheme.bind(themeController));

export default router;
