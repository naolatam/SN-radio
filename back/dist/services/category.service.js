"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = exports.CategoryService = void 0;
const category_repository_1 = require("../repositories/category.repository");
class CategoryService {
    async getAllCategories() {
        return category_repository_1.categoryRepository.findAll();
    }
    async getCategoryById(categoryId) {
        return category_repository_1.categoryRepository.findById(categoryId);
    }
    async getCategoryBySlug(slug) {
        return category_repository_1.categoryRepository.findBySlug(slug);
    }
    async createCategory(data) {
        // Check if slug already exists
        const existing = await category_repository_1.categoryRepository.findBySlug(data.slug);
        if (existing) {
            throw new Error('Category with this slug already exists');
        }
        return category_repository_1.categoryRepository.create(data);
    }
    async updateCategory(categoryId, data) {
        // Check if category exists
        const existing = await category_repository_1.categoryRepository.findById(categoryId);
        if (!existing)
            return null;
        // If slug is being updated, check if new slug is available
        if (data.slug && data.slug !== existing.slug) {
            const slugExists = await category_repository_1.categoryRepository.findBySlug(data.slug);
            if (slugExists) {
                throw new Error('Category with this slug already exists');
            }
        }
        return category_repository_1.categoryRepository.update(categoryId, data);
    }
    async deleteCategory(categoryId) {
        // Check if category exists
        const existing = await category_repository_1.categoryRepository.findById(categoryId);
        if (!existing)
            return false;
        // Check if category is used in any articles
        const articleCount = await category_repository_1.categoryRepository.getArticleCount(categoryId);
        if (articleCount > 0) {
            throw new Error(`Cannot delete category: ${articleCount} articles are using it`);
        }
        await category_repository_1.categoryRepository.delete(categoryId);
        return true;
    }
    async getArticleCount(categoryId) {
        return category_repository_1.categoryRepository.getArticleCount(categoryId);
    }
}
exports.CategoryService = CategoryService;
exports.categoryService = new CategoryService();
//# sourceMappingURL=category.service.js.map