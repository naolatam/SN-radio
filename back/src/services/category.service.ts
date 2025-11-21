import { categoryRepository } from '../repositories/category.repository';
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types/shared.types';
import { ICategoryService } from '../types/service.types';

export class CategoryService implements ICategoryService {
  async getAllCategories(): Promise<Category[]> {
    return categoryRepository.findAll();
  }

  async getCategoryById(categoryId: string): Promise<Category | null> {
    return categoryRepository.findById(categoryId);
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return categoryRepository.findBySlug(slug);
  }

  async createCategory(data: CreateCategoryDTO): Promise<Category> {
    // Check if slug already exists
    const existing = await categoryRepository.findBySlug(data.slug);
    if (existing) {
      throw new Error('Category with this slug already exists');
    }

    return categoryRepository.create(data);
  }

  async updateCategory(categoryId: string, data: UpdateCategoryDTO): Promise<Category | null> {
    // Check if category exists
    const existing = await categoryRepository.findById(categoryId);
    if (!existing) return null;

    // If slug is being updated, check if new slug is available
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await categoryRepository.findBySlug(data.slug);
      if (slugExists) {
        throw new Error('Category with this slug already exists');
      }
    }

    return categoryRepository.update(categoryId, data);
  }

  async deleteCategory(categoryId: string): Promise<boolean> {
    // Check if category exists
    const existing = await categoryRepository.findById(categoryId);
    if (!existing) return false;

    // Check if category is used in any articles
    const articleCount = await categoryRepository.getArticleCount(categoryId);
    if (articleCount > 0) {
      throw new Error(`Cannot delete category: ${articleCount} articles are using it`);
    }

    await categoryRepository.delete(categoryId);
    return true;
  }

  async getArticleCount(categoryId: string): Promise<number> {
    return categoryRepository.getArticleCount(categoryId);
  }
}

export const categoryService = new CategoryService();
