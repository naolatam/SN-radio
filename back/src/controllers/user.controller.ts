import { Response } from 'express';
import { userService } from '../services/user.service';
import { AuthRequest } from '../types/controller.types';
import { ApiResponse } from '../types/shared.types';
import { UserRole } from '../types/shared.types';

export class UserController {
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        } as ApiResponse);
        return;
      }

      const user = await userService.getUserProfile(req.user.id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: { user },
      } as ApiResponse);
    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        } as ApiResponse);
        return;
      }

      const { name, email, description, image } = req.body;
      const updateData: any = {};

      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (description !== undefined) updateData.description = description;
      if (image !== undefined) updateData.image = image;

      const user = await userService.updateUser(req.user.id, updateData);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: { user },
      } as ApiResponse);
    } catch (error) {
      console.error('Error in updateProfile:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          error: 'Admin access required',
        } as ApiResponse);
        return;
      }

      const users = await userService.getAllUsers();
      res.json({
        success: true,
        data: { users },
      } as ApiResponse);
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async getUsersByName(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          error: 'Admin access required',
        } as ApiResponse);
        return;
      }
      
      const { name } = req.query; 
      if (typeof name !== 'string' || !name.trim()) {
        res.status(400).json({
          success: false,
          error: 'Invalid name parameter',
        } as ApiResponse);
        return;
      }

      const users = await userService.getUsersByName(name);
      res.json({
        success: true,
        data: { users },
      } as ApiResponse);
    } catch (error) {
      console.error('Error in getUserByName:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async updateUserRole(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          error: 'Admin access required',
        } as ApiResponse);
        return;
      }

      const { userId } = req.params;
      const { role } = req.body;

      if (!role || !Object.values(UserRole).includes(role)) {
        res.status(400).json({
          success: false,
          error: 'Invalid role',
        } as ApiResponse);
        return;
      }

      const user = await userService.updateUserRole(userId, role);
      res.json({
        success: true,
        data: { user },
      } as ApiResponse);
    } catch (error) {
      console.error('Error in updateUserRole:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          error: 'Admin access required',
        } as ApiResponse);
        return;
      }

      const { userId } = req.params;
      await userService.deleteUser(userId);
      
      res.json({
        success: true,
        message: 'User deleted successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Error in deleteUser:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }
}

export const userController = new UserController();
