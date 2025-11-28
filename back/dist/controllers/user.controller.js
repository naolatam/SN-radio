"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const shared_types_1 = require("../types/shared.types");
class UserController {
    async getProfile(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated',
                });
                return;
            }
            const user = await user_service_1.userService.getUserProfile(req.user.id);
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found',
                });
                return;
            }
            res.json({
                success: true,
                data: { user },
            });
        }
        catch (error) {
            console.error('Error in getProfile:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    async updateProfile(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated',
                });
                return;
            }
            const { name, email, description, image } = req.body;
            const updateData = {};
            if (name !== undefined)
                updateData.name = name;
            if (email !== undefined)
                updateData.email = email;
            if (description !== undefined)
                updateData.description = description;
            if (image !== undefined)
                updateData.image = image;
            const user = await user_service_1.userService.updateUser(req.user.id, updateData);
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found',
                });
                return;
            }
            res.json({
                success: true,
                data: { user },
            });
        }
        catch (error) {
            console.error('Error in updateProfile:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    async getAllUsers(req, res) {
        try {
            if (!req.user || req.user.role !== shared_types_1.UserRole.ADMIN) {
                res.status(403).json({
                    success: false,
                    error: 'Admin access required',
                });
                return;
            }
            const users = await user_service_1.userService.getAllUsers();
            res.json({
                success: true,
                data: { users },
            });
        }
        catch (error) {
            console.error('Error in getAllUsers:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    async getUsersByName(req, res) {
        try {
            if (!req.user || req.user.role !== shared_types_1.UserRole.ADMIN) {
                res.status(403).json({
                    success: false,
                    error: 'Admin access required',
                });
                return;
            }
            const { name } = req.query;
            if (typeof name !== 'string' || !name.trim()) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid name parameter',
                });
                return;
            }
            const users = await user_service_1.userService.getUsersByName(name);
            res.json({
                success: true,
                data: { users },
            });
        }
        catch (error) {
            console.error('Error in getUserByName:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    async updateUserRole(req, res) {
        try {
            if (!req.user || req.user.role !== shared_types_1.UserRole.ADMIN) {
                res.status(403).json({
                    success: false,
                    error: 'Admin access required',
                });
                return;
            }
            const { userId } = req.params;
            const { role } = req.body;
            if (!role || !Object.values(shared_types_1.UserRole).includes(role)) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid role',
                });
                return;
            }
            const user = await user_service_1.userService.updateUserRole(userId, role);
            res.json({
                success: true,
                data: { user },
            });
        }
        catch (error) {
            console.error('Error in updateUserRole:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    async deleteUser(req, res) {
        try {
            if (!req.user || req.user.role !== shared_types_1.UserRole.ADMIN) {
                res.status(403).json({
                    success: false,
                    error: 'Admin access required',
                });
                return;
            }
            const { userId } = req.params;
            await user_service_1.userService.deleteUser(userId);
            res.json({
                success: true,
                message: 'User deleted successfully',
            });
        }
        catch (error) {
            console.error('Error in deleteUser:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
//# sourceMappingURL=user.controller.js.map