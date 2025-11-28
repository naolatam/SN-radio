"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleService = exports.ArticleService = void 0;
const article_repository_1 = require("../repositories/article.repository");
const like_repository_1 = require("../repositories/like.repository");
const shared_types_1 = require("../types/shared.types");
const contentSanitizer_1 = require("../utils/contentSanitizer");
class ArticleService {
    async getAllArticles(filters, currentUserId) {
        const result = await article_repository_1.articleRepository.findAll(filters, currentUserId);
        return result;
    }
    async getArticleById(articleId, currentUserId) {
        return article_repository_1.articleRepository.findById(articleId, currentUserId);
    }
    async getArticlesByAuthor(authorId, currentUserId) {
        return article_repository_1.articleRepository.findByAuthor(authorId, currentUserId);
    }
    async createArticle(data, authorId, userRole) {
        // Validate content
        const validation = contentSanitizer_1.ContentSanitizer.validateContent(data.content);
        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }
        // Convert markdown to sanitized HTML
        const contentHtml = await contentSanitizer_1.ContentSanitizer.markdownToHtml(data.content);
        const article = await article_repository_1.articleRepository.create({
            ...data,
            authorId,
            contentHtml,
        }, authorId);
        return article;
    }
    async updateArticle(articleId, data, userId, userRole) {
        // Check if article exists
        const existingArticle = await article_repository_1.articleRepository.findById(articleId, userId);
        if (!existingArticle)
            return null; // Only author, staff, or admin can update
        const canUpdate = existingArticle.authorId === userId ||
            userRole === shared_types_1.UserRole.ADMIN ||
            userRole === shared_types_1.UserRole.STAFF;
        if (!canUpdate) {
            throw new Error('Unauthorized to update this article');
        }
        // If content is being updated, sanitize it
        let contentHtml = "";
        if (data.content) {
            const validation = contentSanitizer_1.ContentSanitizer.validateContent(data.content);
            contentHtml = await contentSanitizer_1.ContentSanitizer.markdownToHtml(data.content);
        }
        const article = await article_repository_1.articleRepository.update(articleId, {
            ...data,
            ...(contentHtml && { contentHtml }),
        }, userId);
        return article;
    }
    async deleteArticle(articleId, userId, userRole) {
        const article = await article_repository_1.articleRepository.findById(articleId, userId);
        if (!article)
            return false;
        // Only author, staff, or admin can delete
        const canDelete = article.authorId === userId ||
            userRole === shared_types_1.UserRole.ADMIN ||
            userRole === shared_types_1.UserRole.STAFF;
        if (!canDelete) {
            throw new Error('Unauthorized to delete this article');
        }
        await article_repository_1.articleRepository.delete(articleId);
        return true;
    }
    async toggleLike(articleId, userId) {
        const existingLike = await like_repository_1.likeRepository.findLike(articleId, userId);
        if (existingLike) {
            // Unlike
            await like_repository_1.likeRepository.deleteLike(articleId, userId);
            const likes = await like_repository_1.likeRepository.countLikes(articleId);
            return { liked: false, likes };
        }
        else {
            // Like
            await like_repository_1.likeRepository.createLike(articleId, userId);
            const likes = await like_repository_1.likeRepository.countLikes(articleId);
            return { liked: true, likes };
        }
    }
    async getArticleCount() {
        return article_repository_1.articleRepository.count();
    }
    async getLikedArticles(userId, currentUserId) {
        return article_repository_1.articleRepository.findLikedByUser(userId, currentUserId);
    }
}
exports.ArticleService = ArticleService;
exports.articleService = new ArticleService();
//# sourceMappingURL=article.service.js.map