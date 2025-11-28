/**
 * Theme Service
 * Handles theme CRUD operations
 */

import { httpClient } from '../lib/http.client';
import { Theme, CreateThemeDTO, UpdateThemeDTO } from '@/types/shared.types';

class ThemeService {
  private readonly basePath = '/themes';

  /**
   * Get all themes
   */
  async getAllThemes(): Promise<Theme[]> {
    const response = await httpClient.get<Theme[]>(this.basePath);
    
    if (response.success && response.data) {
      return Array.isArray(response.data) ? response.data : [];
    }
    
    return [];
  }

  /**
   * Get active theme
   */
  async getActiveTheme(): Promise<Theme | null> {
    const response = await httpClient.get<Theme>(`${this.basePath}/active`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return null;
  }

  /**
   * Get theme by ID
   */
  async getThemeById(id: string): Promise<Theme | null> {
    const response = await httpClient.get<Theme>(`${this.basePath}/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return null;
  }

  /**
   * Create new theme
   */
  async createTheme(theme: CreateThemeDTO): Promise<Theme | null> {
    const response = await httpClient.post<Theme>(this.basePath, theme);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return null;
  }

  /**
   * Update theme
   */
  async updateTheme(id: string, theme: UpdateThemeDTO): Promise<Theme | null> {
    const response = await httpClient.put<Theme>(`${this.basePath}/${id}`, theme);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return null;
  }

  /**
   * Delete theme
   */
  async deleteTheme(id: string): Promise<boolean> {
    const response = await httpClient.delete(`${this.basePath}/${id}`);
    return response.success;
  }

  /**
   * Activate theme
   */
  async activateTheme(id: string): Promise<Theme | null> {
    const response = await httpClient.post<Theme>(`${this.basePath}/${id}/activate`, {});
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return null;
  }

  /**
   * Duplicate theme
   */
  async duplicateTheme(id: string, name: string, slug: string): Promise<Theme | null> {
    const response = await httpClient.post<Theme>(`${this.basePath}/${id}/duplicate`, { name, slug });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return null;
  }
}

export const themeService = new ThemeService();
