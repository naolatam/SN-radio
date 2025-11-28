import { Response } from 'express';
import { AuthRequest } from '../types/controller.types';
export declare class StaffController {
    /**
     * Get all staff members
     * Public endpoint - anyone can view staff
     */
    getAllStaff(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Get staff member by ID
     * Public endpoint
     */
    getStaffById(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Get staff member by user ID
     * Public endpoint
     */
    getStaffByUserId(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Create a new staff member
     * Admin only
     */
    createStaff(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Update staff member
     * Admin only
     */
    updateStaff(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Delete staff member
     * Admin only
     */
    deleteStaff(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Get staff count
     * Admin only
     */
    getStaffCount(req: AuthRequest, res: Response): Promise<void>;
}
export declare const staffController: StaffController;
//# sourceMappingURL=staff.controller.d.ts.map