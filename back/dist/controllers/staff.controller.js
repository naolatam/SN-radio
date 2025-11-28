"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffController = exports.StaffController = void 0;
const staff_service_1 = require("../services/staff.service");
const shared_types_1 = require("../types/shared.types");
class StaffController {
    /**
     * Get all staff members
     * Public endpoint - anyone can view staff
     */
    async getAllStaff(req, res) {
        try {
            const staff = await staff_service_1.staffService.getAllStaff();
            res.json({
                success: true,
                data: { staff },
            });
        }
        catch (error) {
            console.error('Error in getAllStaff:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    /**
     * Get staff member by ID
     * Public endpoint
     */
    async getStaffById(req, res) {
        try {
            const { id } = req.params;
            const staff = await staff_service_1.staffService.getStaffById(id);
            if (!staff) {
                res.status(404).json({
                    success: false,
                    error: 'Staff member not found',
                });
                return;
            }
            res.json({
                success: true,
                data: { staff },
            });
        }
        catch (error) {
            console.error('Error in getStaffById:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    /**
     * Get staff member by user ID
     * Public endpoint
     */
    async getStaffByUserId(req, res) {
        try {
            const { userId } = req.params;
            const staff = await staff_service_1.staffService.getStaffByUserId(userId);
            if (!staff) {
                res.status(404).json({
                    success: false,
                    error: 'Staff member not found',
                });
                return;
            }
            res.json({
                success: true,
                data: { staff },
            });
        }
        catch (error) {
            console.error('Error in getStaffByUserId:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    /**
     * Create a new staff member
     * Admin only
     */
    async createStaff(req, res) {
        try {
            if (!req.user || req.user.role !== shared_types_1.UserRole.ADMIN) {
                res.status(403).json({
                    success: false,
                    error: 'Admin access required',
                });
                return;
            }
            const { userId, role, description } = req.body;
            if (!userId || !role) {
                res.status(400).json({
                    success: false,
                    error: 'userId and role are required',
                });
                return;
            }
            const staff = await staff_service_1.staffService.createStaff({
                userId,
                role,
                description,
            });
            res.status(201).json({
                success: true,
                data: { staff },
            });
        }
        catch (error) {
            console.error('Error in createStaff:', error);
            if (error instanceof Error && error.message === 'User is already a staff member') {
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
    /**
     * Update staff member
     * Admin only
     */
    async updateStaff(req, res) {
        try {
            if (!req.user || req.user.role !== shared_types_1.UserRole.ADMIN) {
                res.status(403).json({
                    success: false,
                    error: 'Admin access required',
                });
                return;
            }
            const { id } = req.params;
            const { role, description } = req.body;
            const staff = await staff_service_1.staffService.updateStaff(id, {
                role,
                description,
            });
            if (!staff) {
                res.status(404).json({
                    success: false,
                    error: 'Staff member not found',
                });
                return;
            }
            res.json({
                success: true,
                data: { staff },
            });
        }
        catch (error) {
            console.error('Error in updateStaff:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    /**
     * Delete staff member
     * Admin only
     */
    async deleteStaff(req, res) {
        try {
            if (!req.user || req.user.role !== shared_types_1.UserRole.ADMIN) {
                res.status(403).json({
                    success: false,
                    error: 'Admin access required',
                });
                return;
            }
            const { id } = req.params;
            const success = await staff_service_1.staffService.deleteStaff(id);
            if (!success) {
                res.status(404).json({
                    success: false,
                    error: 'Staff member not found',
                });
                return;
            }
            res.json({
                success: true,
                message: 'Staff member deleted successfully',
            });
        }
        catch (error) {
            console.error('Error in deleteStaff:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    /**
     * Get staff count
     * Admin only
     */
    async getStaffCount(req, res) {
        try {
            if (!req.user || req.user.role !== shared_types_1.UserRole.ADMIN) {
                res.status(403).json({
                    success: false,
                    error: 'Admin access required',
                });
                return;
            }
            const count = await staff_service_1.staffService.getStaffCount();
            res.json({
                success: true,
                data: { count },
            });
        }
        catch (error) {
            console.error('Error in getStaffCount:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}
exports.StaffController = StaffController;
exports.staffController = new StaffController();
//# sourceMappingURL=staff.controller.js.map