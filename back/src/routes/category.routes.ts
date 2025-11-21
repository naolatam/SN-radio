import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { adminMiddleware, authMiddleware, staffMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all categories
 */
router.get('/', categoryController.getAll.bind(categoryController));

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */
router.get('/:id', categoryController.getById.bind(categoryController));

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category (Admin/Staff only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
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
 *         description: Category created successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 *       409:
 *         description: Category with this slug already exists
 */
router.post('/', authMiddleware, staffMiddleware, categoryController.create.bind(categoryController));

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category (Admin/Staff only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category with this slug already exists
 */
router.put('/:id', authMiddleware, staffMiddleware, categoryController.update.bind(categoryController));

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Only administrators can delete categories
 *       404:
 *         description: Category not found
 *       409:
 *         description: Cannot delete category - articles are using it
 */
router.delete('/:id', authMiddleware, adminMiddleware, categoryController.delete.bind(categoryController));

export default router;
