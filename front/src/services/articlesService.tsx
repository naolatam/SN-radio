/**
 * Articles Service (Legacy compatibility layer)
 * @deprecated Use articleService from './article.service.ts' instead
 */

import { articleService} from './article.service';
import { Article, CreateArticleDTO, UpdateArticleDTO } from '../types/shared.types';
class ArticlesService {
  async getAllArticles(): Promise<Article[]> {
    return articleService.getAll();
  }

  async createArticle(articleData: CreateArticleDTO): Promise<{ success: boolean; article?: Article; error?: string }> {
    const response = await articleService.create(articleData);
    
    if (response.success && response.data) {
      return { success: true, article: response.data.article };
    }
    
    return { success: false, error: response.error };
  }

  async updateArticle(articleId: string, articleData: UpdateArticleDTO): Promise<{ success: boolean; article?: Article; error?: string }> {
    const response = await articleService.update(articleId, articleData);
    
    if (response.success && response.data) {
      return { success: true, article: response.data.article };
    }
    
    return { success: false, error: response.error };
  }

  async deleteArticle(articleId: string): Promise<{ success: boolean; error?: string }> {
    const response = await articleService.delete(articleId);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error };
  }

  async likeArticle(articleId: string): Promise<{ success: boolean; error?: string }> {
    const response = await articleService.like(articleId);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error };
  }

  async unlikeArticle(articleId: string): Promise<{ success: boolean; error?: string }> {
    const response = await articleService.unlike(articleId);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error };
  }
}

export const articlesService = new ArticlesService();
