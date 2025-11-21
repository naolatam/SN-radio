import { Request, Response } from 'express';
import { articleService } from '../services/article.service';
import { AuthRequest } from '../types/controller.types';
import { ApiResponse, CreateArticleDTO, UpdateArticleDTO, UserRole } from '../types/shared.types';

export class ArticleController {
  async getAllArticles(req: AuthRequest, res: Response): Promise<void> {
    try {
      const currentUserId = req.user?.id;
      const articles = await articleService.getAllArticles(undefined, currentUserId);
      res.json({
        success: true,
        data: articles,
      } as ApiResponse);
    } catch (error) {
      console.error('Error in getAllArticles:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async getArticleById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { articleId } = req.params;
      const currentUserId = req.user?.id;
      const article = await articleService.getArticleById(articleId, currentUserId);
      
      if (!article) {
        res.status(404).json({
          success: false,
          error: 'Article not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: { article },
      } as ApiResponse);
    } catch (error) {
      console.error('Error in getArticleById:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async createArticle(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        } as ApiResponse);
        return;
      }

      const articleData: CreateArticleDTO = req.body;
      const article = await articleService.createArticle(articleData, req.user.id, req.user.role);

      res.status(201).json({
        success: true,
        data: { article },
      } as ApiResponse);
    } catch (error) {
      console.error('Error in createArticle:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async updateArticle(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        } as ApiResponse);
        return;
      }

      const { articleId } = req.params;
      const updateData: UpdateArticleDTO = req.body;

      const article = await articleService.updateArticle(
        articleId,
        updateData,
        req.user.id,
        req.user.role
      );
      
      if (!article) {
        res.status(404).json({
          success: false,
          error: 'Article not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: { article },
      } as ApiResponse);
    } catch (error: any) {
      console.error('Error in updateArticle:', error);
      if (error.message === 'Unauthorized to update this article') {
        res.status(403).json({
          success: false,
          error: error.message,
        } as ApiResponse);
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async deleteArticle(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        } as ApiResponse);
        return;
      }

      const { articleId } = req.params;

      const deleted = await articleService.deleteArticle(
        articleId,
        req.user.id,
        req.user.role
      );
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Article not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        message: 'Article deleted successfully',
      } as ApiResponse);
    } catch (error: any) {
      console.error('Error in deleteArticle:', error);
      if (error.message === 'Unauthorized to delete this article') {
        res.status(403).json({
          success: false,
          error: error.message,
        } as ApiResponse);
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async toggleLike(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        } as ApiResponse);
        return;
      }

      const { articleId } = req.params;
      const result = await articleService.toggleLike(articleId, req.user.id);

      res.json({
        success: true,
        data: result,
      } as ApiResponse);
    } catch (error) {
      console.error('Error in toggleLike:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }
}

export const articleController = new ArticleController();
