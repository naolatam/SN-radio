/**
 * Category Service
 * Domain service for managing categories
 */

import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '@/types/shared.types';
import { httpClient, HttpResponse } from '../lib/http.client';

class CategoryService {
  private readonly basePath = '/categories';

  /**
   * Get all categories
   */
  async getAll(): Promise<Category[]> {
    const response = await httpClient.get<{ categories: Category[] }>(this.basePath);
    
    if (response.success && response.data) {
      return response.data.categories || [];
    }
    
    return [];
  }

  /**
   * Get category by ID
   */
  async getById(id: string): Promise<Category | null> {
    const response = await httpClient.get<{ category: Category }>(`${this.basePath}/${id}`);
    
    if (response.success && response.data) {
      return response.data.category;
    }
    
    return null;
  }

  /**
   * Create new category (admin/staff only)
   */
  async create(data: CreateCategoryDTO): Promise<HttpResponse<{ category: Category }>> {
    return httpClient.post<{ category: Category }>(this.basePath, data);
  }

  /**
   * Update category (admin/staff only)
   */
  async update(id: string, data: UpdateCategoryDTO): Promise<HttpResponse<{ category: Category }>> {
    return httpClient.put<{ category: Category }>(`${this.basePath}/${id}`, data);
  }

  /**
   * Delete category (admin only)
   */
  async delete(id: string): Promise<HttpResponse<void>> {
    return httpClient.delete<void>(`${this.basePath}/${id}`);
  }
}

export const categoryService = new CategoryService();
