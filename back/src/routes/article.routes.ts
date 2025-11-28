import { Router } from 'express';
import { articleController } from '../controllers/article.controller';
import { authMiddleware, adminMiddleware, staffMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Get all articles
 *     description: Retrieve a list of all published articles with author, categories, and likes information
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: List of articles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', optionalAuthMiddleware, articleController.getAllArticles.bind(articleController));

/**
 * @swagger
 * /api/articles/liked:
 *   get:
 *     summary: Get liked articles
 *     description: Retrieve all articles that the authenticated user has liked
 *     tags: [Articles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of liked articles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.get('/liked', authMiddleware, articleController.getLikedArticles.bind(articleController));

/**
 * @swagger
 * /api/articles/{articleId}:
 *   get:
 *     summary: Get article by ID
 *     description: Retrieve a single article by its ID with full details
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The article ID
 *     responses:
 *       200:
 *         description: Article retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:articleId', optionalAuthMiddleware, articleController.getArticleById.bind(articleController));

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Create new article (Admin only)
 *     description: Create a new article with markdown content. Requires ADMIN or STAFF role.
 *     tags: [Articles]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateArticleDTO'
 *     responses:
 *       201:
 *         description: Article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Bad request - Invalid input or malicious content detected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - No valid session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - User is not admin or staff
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authMiddleware, staffMiddleware, articleController.createArticle.bind(articleController));

/**
 * @swagger
 * /api/articles/{articleId}:
 *   patch:
 *     summary: Update article
 *     description: Update an existing article. Authors can update their own articles, admins can update any article.
 *     tags: [Articles]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The article ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateArticleDTO'
 *     responses:
 *       200:
 *         description: Article updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Bad request - Invalid input or malicious content detected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - No valid session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - User does not own this article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:articleId', authMiddleware, staffMiddleware, articleController.updateArticle.bind(articleController));

/**
 * @swagger
 * /api/articles/{articleId}:
 *   delete:
 *     summary: Delete article
 *     description: Delete an article. Authors can delete their own articles, admins can delete any article.
 *     tags: [Articles]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The article ID
 *     responses:
 *       200:
 *         description: Article deleted successfully
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
 *                   example: "Article deleted successfully"
 *       401:
 *         description: Unauthorized - No valid session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - User does not own this article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:articleId', authMiddleware, articleController.deleteArticle.bind(articleController));

/**
 * @swagger
 * /api/articles/{articleId}/like:
 *   post:
 *     summary: Toggle like on article
 *     description: Like or unlike an article. If user has already liked the article, it will be unliked.
 *     tags: [Articles]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The article ID
 *     responses:
 *       200:
 *         description: Like toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     liked:
 *                       type: boolean
 *                       description: True if article was liked, false if unliked
 *                     likesCount:
 *                       type: integer
 *                       description: Updated total likes count
 *       401:
 *         description: Unauthorized - No valid session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:articleId/like', authMiddleware, articleController.toggleLike.bind(articleController));

export default router;

