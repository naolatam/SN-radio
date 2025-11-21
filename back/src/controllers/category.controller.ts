import { Response } from 'express';
import { categoryService } from '../services/category.service';
import { AuthRequest } from '../types/controller.types';
import { ApiResponse, Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types/shared.types';
import { UserRole } from '../types/shared.types';

export class CategoryController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const categories = await categoryService.getAllCategories();
      
      res.json({
        success: true,
        data: { categories },
      } as ApiResponse);
    } catch (error) {
      console.error('Error in getAll:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const category = await categoryService.getCategoryById(id);
      
      if (!category) {
        res.status(404).json({
          success: false,
          error: 'Category not found',
        } as ApiResponse);
        return;
      }
      
      res.json({
        success: true,
        data: { category },
      } as ApiResponse);
    } catch (error) {
      console.error('Error in getById:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Check authentication
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        } as ApiResponse);
        return;
      }

      // Only ADMIN and STAFF can create categories
      if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.STAFF) {
        res.status(403).json({
          success: false,
          error: 'Only administrators and staff can create categories',
        } as ApiResponse);
        return;
      }

      const createCategory: CreateCategoryDTO = req.body;

      if (createCategory.name == null || createCategory.slug == null) {
        res.status(400).json({
          success: false,
          error: 'Name and slug are required',
        } as ApiResponse);
        return;
      }

      const category = await categoryService.createCategory(createCategory);
      
      res.status(201).json({
        success: true,
        data: { category },
      } as ApiResponse);
    } catch (error) {
      console.error('Error in create:', error);
      
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({
          success: false,
          error: error.message,
        } as ApiResponse);
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Check authentication
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        } as ApiResponse);
        return;
      }


      const { id } = req.params;
      const { name, slug } = req.body;

      const updateData: UpdateCategoryDTO = req.body;

      const category = await categoryService.updateCategory(id, updateData);
      
      if (!category) {
        res.status(404).json({
          success: false,
          error: 'Category not found',
        } as ApiResponse);
        return;
      }
      
      res.json({
        success: true,
        data: { category },
      } as ApiResponse);
    } catch (error) {
      console.error('Error in update:', error);
      
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({
          success: false,
          error: error.message,
        } as ApiResponse);
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Check authentication
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        } as ApiResponse);
        return;
      }

      // Only ADMIN can delete categories (NOT STAFF)
      if (req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          error: 'Only administrators can delete categories',
        } as ApiResponse);
        return;
      }

      const { id } = req.params;

      const success = await categoryService.deleteCategory(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Category not found',
        } as ApiResponse);
        return;
      }
      
      res.json({
        success: true,
        data: null,
      } as ApiResponse);
    } catch (error) {
      console.error('Error in delete:', error);
      
      if (error instanceof Error && error.message.includes('Cannot delete category')) {
        res.status(409).json({
          success: false,
          error: error.message,
        } as ApiResponse);
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }
}

export const categoryController = new CategoryController();
