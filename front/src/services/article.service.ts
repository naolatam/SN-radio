/**
 * Article Service
 * Domain service for managing articles
 */

import { Article, CreateArticleDTO, UpdateArticleDTO } from '@/types/shared.types';
import { httpClient, HttpResponse } from '../lib/http.client';


class ArticleService {
  private readonly basePath = '/articles';

  /**
   * Get all articles
   */
  async getAll(): Promise<Article[]> {
    const response = await httpClient.get<{ articles: Article[] }>(this.basePath);
    
    if (response.success && response.data) {
      return response.data.articles || [];
    }
    
    return [];
  }

  /**
   * Get article by ID
   */
  async getById(id: string): Promise<Article | null> {
    const response = await httpClient.get<{ article: Article }>(`${this.basePath}/${id}`);
    
    if (response.success && response.data) {
      return response.data.article;
    }
    
    return null;
  }

  /**
   * Create new article (admin only)
   */
  async create(data: CreateArticleDTO): Promise<HttpResponse<{ article: Article }>> {
    return httpClient.post<{ article: Article }>(this.basePath, data);
  }

  /**
   * Update article (admin only)
   */
  async update(id: string, data: UpdateArticleDTO): Promise<HttpResponse<{ article: Article }>> {
    return httpClient.put<{ article: Article }>(`${this.basePath}/${id}`, data);
  }

  /**
   * Delete article (admin only)
   */
  async delete(id: string): Promise<HttpResponse<void>> {
    return httpClient.delete<void>(`${this.basePath}/${id}`);
  }

  /**
   * Toggle like on an article (like/unlike)
   */
  async toggleLike(id: string): Promise<HttpResponse<{ liked: boolean; likes: number }>> {
    return httpClient.post<{ liked: boolean; likes: number }>(`${this.basePath}/${id}/like`);
  }

  /**
   * Get articles by category
   */
  async getByCategory(category: string): Promise<Article[]> {
    const response = await httpClient.get<{ articles: Article[] }>(
      `${this.basePath}?category=${encodeURIComponent(category)}`
    );
    
    if (response.success && response.data) {
      return response.data.articles || [];
    }
    
    return [];
  }
}

export const articleService = new ArticleService();
