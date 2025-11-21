import prisma from '../config/database.config';
import { CreateCategoryDTO, UpdateCategoryDTO, Category } from '../types/shared.types';
import { ICategoryRepository } from '../types/repository.types';

export class CategoryRepository implements ICategoryRepository {
  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { slug },
    });
  }

  async create(data: CreateCategoryDTO): Promise<Category> {
    return prisma.category.create({
      data,
    });
  }

  async update(id: string, data: UpdateCategoryDTO): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Category> {
    return prisma.category.delete({
      where: { id },
    });
  }

  async getArticleCount(categoryId: string): Promise<number> {
    return prisma.articleCategory.count({
      where: { categoryId },
    });
  }
}

export const categoryRepository = new CategoryRepository();
