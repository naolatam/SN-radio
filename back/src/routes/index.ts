import { Router, Request, Response } from 'express';
import userRoutes from './user.routes';
import articleRoutes from './article.routes';
import categoryRoutes from './category.routes';
import themeRoutes from './theme.routes';
import staffRoutes from './staff.routes';

const router = Router();

// Mount routes
router.use('/users', userRoutes);
router.use('/articles', articleRoutes);
router.use('/categories', categoryRoutes);
router.use('/themes', themeRoutes);
router.use('/staff', staffRoutes);

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
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;

