import { themeRepository } from '../repositories/theme.repository';
import { Theme, CreateThemeDTO, UpdateThemeDTO } from '../types/shared.types';

export class ThemeService {
  /**
   * Get all themes
   */
  async getAllThemes(): Promise<Theme[]> {
    return await themeRepository.findAll();
  }

  /**
   * Get active theme
   */
  async getActiveTheme(): Promise<Theme | null> {
    return await themeRepository.findActive();
  }

  /**
   * Get theme by ID
   */
  async getThemeById(id: string): Promise<Theme | null> {
    return await themeRepository.findById(id);
  }

  /**
   * Get theme by slug
   */
  async getThemeBySlug(slug: string): Promise<Theme | null> {
    return await themeRepository.findBySlug(slug);
  }

  /**
   * Create new theme
   */
  async createTheme(data: CreateThemeDTO): Promise<Theme> {
    // Validate required fields
    if (!data.name || !data.slug) {
      throw new Error('Name and slug are required');
    }

    if (!data.primaryColor || !data.secondaryColor || !data.backgroundColor) {
      throw new Error('All colors are required');
    }

    if (!data.siteName) {
      throw new Error('Site name is required');
    }

    // Check if slug already exists
    const existing = await themeRepository.findBySlug(data.slug);
    if (existing) {
      throw new Error('A theme with this slug already exists');
    }

    return await themeRepository.create(data);
  }

  /**
   * Update theme
   */
  async updateTheme(id: string, data: UpdateThemeDTO): Promise<Theme> {
    const existing = await themeRepository.findById(id);
    if (!existing) {
      throw new Error('Theme not found');
    }

    // If updating slug, check for conflicts
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await themeRepository.findBySlug(data.slug);
      if (slugExists) {
        throw new Error('A theme with this slug already exists');
      }
    }

    return await themeRepository.update(id, data);
  }

  /**
   * Delete theme
   */
  async deleteTheme(id: string): Promise<void> {
    const existing = await themeRepository.findById(id);
    if (!existing) {
      throw new Error('Theme not found');
    }

    if (existing.isActive) {
      throw new Error('Cannot delete active theme. Please activate another theme first.');
    }

    await themeRepository.delete(id);
  }

  /**
   * Activate theme
   */
  async activateTheme(id: string): Promise<Theme> {
    const existing = await themeRepository.findById(id);
    if (!existing) {
      throw new Error('Theme not found');
    }

    return await themeRepository.setActive(id);
  }

  /**
   * Duplicate theme
   */
  async duplicateTheme(id: string, newName: string, newSlug: string): Promise<Theme> {
    // Check if new slug already exists
    const slugExists = await themeRepository.findBySlug(newSlug);
    if (slugExists) {
      throw new Error('A theme with this slug already exists');
    }

    return await themeRepository.duplicate(id, newName, newSlug);
  }
}

export const themeService = new ThemeService();
