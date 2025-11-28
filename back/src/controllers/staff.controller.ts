import { Response } from 'express';
import { staffService } from '../services/staff.service';
import { AuthRequest } from '../types/controller.types';
import { ApiResponse, UserRole } from '../types/shared.types';

export class StaffController {
  /**
   * Get all staff members
   * Public endpoint - anyone can view staff
   */
  async getAllStaff(req: AuthRequest, res: Response): Promise<void> {
    try {
      const isStaff = req.user?.role === UserRole.STAFF;
      const staff = await staffService.getAllStaff(isStaff);
      res.json({
        success: true,
        data: { staff },
      } as ApiResponse);
    } catch (error) {
      console.error('Error in getAllStaff:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  /**
   * Get staff member by ID
   * Public endpoint
   */
  async getStaffById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const staff = await staffService.getStaffById(id);

      if (!staff) {
        res.status(404).json({
          success: false,
          error: 'Staff member not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: { staff },
      } as ApiResponse);
    } catch (error) {
      console.error('Error in getStaffById:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  /**
   * Get staff member by user ID
   * Public endpoint
   */
  async getStaffByUserId(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const staff = await staffService.getStaffByUserId(userId);

      if (!staff) {
        res.status(404).json({
          success: false,
          error: 'Staff member not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: { staff },
      } as ApiResponse);
    } catch (error) {
      console.error('Error in getStaffByUserId:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  /**
   * Create a new staff member
   * Admin only
   */
  async createStaff(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          error: 'Admin access required',
        } as ApiResponse);
        return;
      }

      const { userId, role, description } = req.body;

      if (!userId || !role) {
        res.status(400).json({
          success: false,
          error: 'userId and role are required',
        } as ApiResponse);
        return;
      }

      const staff = await staffService.createStaff({
        userId,
        role,
        description,
      });

      res.status(201).json({
        success: true,
        data: { staff },
      } as ApiResponse);
    } catch (error) {
      console.error('Error in createStaff:', error);
      if (error instanceof Error && error.message === 'User is already a staff member') {
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

  /**
   * Update staff member
   * Admin only
   */
  async updateStaff(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          error: 'Admin access required',
        } as ApiResponse);
        return;
      }

      const { id } = req.params;
      const { role, description } = req.body;

      const staff = await staffService.updateStaff(id, {
        role,
        description,
      });

      if (!staff) {
        res.status(404).json({
          success: false,
          error: 'Staff member not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: { staff },
      } as ApiResponse);
    } catch (error) {
      console.error('Error in updateStaff:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  /**
   * Delete staff member
   * Admin only
   */
  async deleteStaff(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          error: 'Admin access required',
        } as ApiResponse);
        return;
      }

      const { id } = req.params;
      const success = await staffService.deleteStaff(id);

      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Staff member not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        message: 'Staff member deleted successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Error in deleteStaff:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  /**
   * Get staff count
   * Admin only
   */
  async getStaffCount(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          error: 'Admin access required',
        } as ApiResponse);
        return;
      }

      const count = await staffService.getStaffCount();
      res.json({
        success: true,
        data: { count },
      } as ApiResponse);
    } catch (error) {
      console.error('Error in getStaffCount:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }
}

export const staffController = new StaffController();
