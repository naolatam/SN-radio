import { articleRepository } from '../repositories/article.repository';
import { likeRepository } from '../repositories/like.repository';
import { CreateArticleDTO, UpdateArticleDTO, Article, ArticleFilters, UserRole } from '../types/shared.types';
import { ContentSanitizer } from '../utils/contentSanitizer';
import { IArticleService, ArticlesWithPagination, ToggleLikeResult } from '../types/service.types';

export class ArticleService implements IArticleService {
  async getAllArticles(filters?: ArticleFilters, currentUserId?: string): Promise<ArticlesWithPagination> {
    const result = await articleRepository.findAll(filters, currentUserId);
    return result;
  }

  async getArticleById(articleId: string, currentUserId?: string): Promise<Article | null> {
    return articleRepository.findById(articleId, currentUserId);
  }

  async getArticlesByAuthor(authorId: string, currentUserId?: string): Promise<Article[]> {
    return articleRepository.findByAuthor(authorId, currentUserId);
  }

  async createArticle(
    data: CreateArticleDTO,
    authorId: string,
    userRole: UserRole
  ): Promise<Article> {
    // Validate content
    const validation = ContentSanitizer.validateContent(data.content);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Convert markdown to sanitized HTML
    const contentHtml = await ContentSanitizer.markdownToHtml(data.content);

    const article = await articleRepository.create({
      ...data,
      authorId,
      contentHtml,
    }, authorId);

    return article;
  }

  async updateArticle(
    articleId: string,
    data: UpdateArticleDTO,
    userId: string,
    userRole: UserRole
    ): Promise<Article | null> {
    // Check if article exists
    const existingArticle = await articleRepository.findById(articleId, userId);
    if (!existingArticle) return null;    // Only author, staff, or admin can update
    const canUpdate = existingArticle.authorId === userId || 
                     userRole === UserRole.ADMIN || 
                     userRole === UserRole.STAFF;
    
    if (!canUpdate) {
      throw new Error('Unauthorized to update this article');
    }

    // If content is being updated, sanitize it
    let contentHtml: string = "";
    if (data.content) {
      const validation = ContentSanitizer.validateContent(data.content);
      
      contentHtml = await ContentSanitizer.markdownToHtml(data.content);
    }

    const article = await articleRepository.update(articleId, {
      ...data,
      ...(contentHtml && { contentHtml }),
    }, userId);

    return article;
  }

  async deleteArticle(articleId: string, userId: string, userRole: UserRole): Promise<boolean> {
    const article = await articleRepository.findById(articleId, userId);
    if (!article) return false;

    // Only author, staff, or admin can delete
    const canDelete = article.authorId === userId || 
                     userRole === UserRole.ADMIN || 
                     userRole === UserRole.STAFF;
    
    if (!canDelete) {
      throw new Error('Unauthorized to delete this article');
    }

    await articleRepository.delete(articleId);
    return true;
  }

  async toggleLike(articleId: string, userId: string): Promise<ToggleLikeResult> {
    const existingLike = await likeRepository.findLike(articleId, userId);

    if (existingLike) {
      // Unlike
      await likeRepository.deleteLike(articleId, userId);
      const likes = await likeRepository.countLikes(articleId);
      return { liked: false, likes };
    } else {
      // Like
      await likeRepository.createLike(articleId, userId);
      const likes = await likeRepository.countLikes(articleId);
      return { liked: true, likes };
    }
  }

  async getArticleCount(): Promise<number> {
    return articleRepository.count();
  }

  async getLikedArticles(userId: string, currentUserId?: string): Promise<Article[]> {
    return articleRepository.findLikedByUser(userId, currentUserId);
  }
}

export const articleService = new ArticleService();
