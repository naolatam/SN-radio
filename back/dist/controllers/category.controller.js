"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = exports.CategoryController = void 0;
const category_service_1 = require("../services/category.service");
const shared_types_1 = require("../types/shared.types");
class CategoryController {
    async getAll(req, res) {
        try {
            const categories = await category_service_1.categoryService.getAllCategories();
            res.json({
                success: true,
                data: { categories },
            });
        }
        catch (error) {
            console.error('Error in getAll:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const category = await category_service_1.categoryService.getCategoryById(id);
            if (!category) {
                res.status(404).json({
                    success: false,
                    error: 'Category not found',
                });
                return;
            }
            res.json({
                success: true,
                data: { category },
            });
        }
        catch (error) {
            console.error('Error in getById:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    async create(req, res) {
        try {
            // Check authentication
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated',
                });
                return;
            }
            // Only ADMIN and STAFF can create categories
            if (req.user.role !== shared_types_1.UserRole.ADMIN && req.user.role !== shared_types_1.UserRole.STAFF) {
                res.status(403).json({
                    success: false,
                    error: 'Only administrators and staff can create categories',
                });
                return;
            }
            const createCategory = req.body;
            if (createCategory.name == null || createCategory.slug == null) {
                res.status(400).json({
                    success: false,
                    error: 'Name and slug are required',
                });
                return;
            }
            const category = await category_service_1.categoryService.createCategory(createCategory);
            res.status(201).json({
                success: true,
                data: { category },
            });
        }
        catch (error) {
            console.error('Error in create:', error);
            if (error instanceof Error && error.message.includes('already exists')) {
                res.status(409).json({
                    success: false,
                    error: error.message,
                });
                return;
            }
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    async update(req, res) {
        try {
            // Check authentication
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated',
                });
                return;
            }
            const { id } = req.params;
            const { name, slug } = req.body;
            const updateData = req.body;
            const category = await category_service_1.categoryService.updateCategory(id, updateData);
            if (!category) {
                res.status(404).json({
                    success: false,
                    error: 'Category not found',
                });
                return;
            }
            res.json({
                success: true,
                data: { category },
            });
        }
        catch (error) {
            console.error('Error in update:', error);
            if (error instanceof Error && error.message.includes('already exists')) {
                res.status(409).json({
                    success: false,
                    error: error.message,
                });
                return;
            }
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    async delete(req, res) {
        try {
            // Check authentication
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated',
                });
                return;
            }
            // Only ADMIN can delete categories (NOT STAFF)
            if (req.user.role !== shared_types_1.UserRole.ADMIN) {
                res.status(403).json({
                    success: false,
                    error: 'Only administrators can delete categories',
                });
                return;
            }
            const { id } = req.params;
            const success = await category_service_1.categoryService.deleteCategory(id);
            if (!success) {
                res.status(404).json({
                    success: false,
                    error: 'Category not found',
                });
                return;
            }
            res.json({
                success: true,
                data: null,
            });
        }
        catch (error) {
            console.error('Error in delete:', error);
            if (error instanceof Error && error.message.includes('Cannot delete category')) {
                res.status(409).json({
                    success: false,
                    error: error.message,
                });
                return;
            }
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}
exports.CategoryController = CategoryController;
exports.categoryController = new CategoryController();
//# sourceMappingURL=category.controller.js.map