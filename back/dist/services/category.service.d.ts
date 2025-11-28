import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types/shared.types';
import { ICategoryService } from '../types/service.types';
export declare class CategoryService implements ICategoryService {
    getAllCategories(): Promise<Category[]>;
    getCategoryById(categoryId: string): Promise<Category | null>;
    getCategoryBySlug(slug: string): Promise<Category | null>;
    createCategory(data: CreateCategoryDTO): Promise<Category>;
    updateCategory(categoryId: string, data: UpdateCategoryDTO): Promise<Category | null>;
    deleteCategory(categoryId: string): Promise<boolean>;
    getArticleCount(categoryId: string): Promise<number>;
}
export declare const categoryService: CategoryService;
//# sourceMappingURL=category.service.d.ts.map