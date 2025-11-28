import { CreateCategoryDTO, UpdateCategoryDTO, Category } from '../types/shared.types';
import { ICategoryRepository } from '../types/repository.types';
export declare class CategoryRepository implements ICategoryRepository {
    findAll(): Promise<Category[]>;
    findById(id: string): Promise<Category | null>;
    findBySlug(slug: string): Promise<Category | null>;
    create(data: CreateCategoryDTO): Promise<Category>;
    update(id: string, data: UpdateCategoryDTO): Promise<Category>;
    delete(id: string): Promise<Category>;
    getArticleCount(categoryId: string): Promise<number>;
}
export declare const categoryRepository: CategoryRepository;
//# sourceMappingURL=category.repository.d.ts.map