"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleController = exports.ArticleController = void 0;
const article_service_1 = require("../services/article.service");
class ArticleController {
    async getAllArticles(req, res) {
        try {
            const currentUserId = req.user?.id;
            const articles = await article_service_1.articleService.getAllArticles(undefined, currentUserId);
            res.json({
                success: true,
                data: articles,
            });
        }
        catch (error) {
            console.error('Error in getAllArticles:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    async getArticleById(req, res) {
        try {
            const { articleId } = req.params;
            const currentUserId = req.user?.id;
            const article = await article_service_1.articleService.getArticleById(articleId, currentUserId);
            if (!article) {
                res.status(404).json({
                    success: false,
                    error: 'Article not found',
                });
                return;
            }
            res.json({
                success: true,
                data: { article },
            });
        }
        catch (error) {
            console.error('Error in getArticleById:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    async createArticle(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required',
                });
                return;
            }
            const articleData = req.body;
            const article = await article_service_1.articleService.createArticle(articleData, req.user.id, req.user.role);
            res.status(201).json({
                success: true,
                data: { article },
            });
        }
        catch (error) {
            console.error('Error in createArticle:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    async updateArticle(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required',
                });
                return;
            }
            const { articleId } = req.params;
            const updateData = req.body;
            const article = await article_service_1.articleService.updateArticle(articleId, updateData, req.user.id, req.user.role);
            if (!article) {
                res.status(404).json({
                    success: false,
                    error: 'Article not found',
                });
                return;
            }
            res.json({
                success: true,
                data: { article },
            });
        }
        catch (error) {
            console.error('Error in updateArticle:', error);
            if (error.message === 'Unauthorized to update this article') {
                res.status(403).json({
                    success: false,
                    error: error.message,
                });
                return;
            }
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    async deleteArticle(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required',
                });
                return;
            }
            const { articleId } = req.params;
            const deleted = await article_service_1.articleService.deleteArticle(articleId, req.user.id, req.user.role);
            if (!deleted) {
                res.status(404).json({
                    success: false,
                    error: 'Article not found',
                });
                return;
            }
            res.json({
                success: true,
                message: 'Article deleted successfully',
            });
        }
        catch (error) {
            console.error('Error in deleteArticle:', error);
            if (error.message === 'Unauthorized to delete this article') {
                res.status(403).json({
                    success: false,
                    error: error.message,
                });
                return;
            }
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    async toggleLike(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required',
                });
                return;
            }
            const { articleId } = req.params;
            const result = await article_service_1.articleService.toggleLike(articleId, req.user.id);
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            console.error('Error in toggleLike:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    async getLikedArticles(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required',
                });
                return;
            }
            const currentUserId = req.user.id;
            const articles = await article_service_1.articleService.getLikedArticles(currentUserId, currentUserId);
            res.json({
                success: true,
                data: articles,
            });
        }
        catch (error) {
            console.error('Error in getLikedArticles:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}
exports.ArticleController = ArticleController;
exports.articleController = new ArticleController();
//# sourceMappingURL=article.controller.js.map