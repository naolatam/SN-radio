"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffService = exports.StaffService = void 0;
const staff_repository_1 = require("../repositories/staff.repository");
const user_service_1 = require("./user.service");
class StaffService {
    async getAllStaff() {
        const staffMembers = await staff_repository_1.staffRepository.findAll();
        return staffMembers.map(staff => this.formatStaffPresenter(staff));
    }
    async getStaffById(staffId) {
        const staff = await staff_repository_1.staffRepository.findById(staffId);
        if (!staff)
            return null;
        return this.formatStaffPresenter(staff);
    }
    async getStaffByUserId(userId) {
        const staff = await staff_repository_1.staffRepository.findByUserId(userId);
        if (!staff)
            return null;
        return this.formatStaffPresenter(staff);
    }
    async createStaff(data) {
        // Check if user is already a staff member
        const existingStaff = await staff_repository_1.staffRepository.findByUserId(data.userId);
        if (existingStaff) {
            throw new Error('User is already a staff member');
        }
        const user = await user_service_1.userService.getUserById(data.userId);
        if (!user) {
            throw new Error('User not found');
        }
        await user_service_1.userService.updateUserRole(data.userId, "STAFF");
        const staff = await staff_repository_1.staffRepository.create({
            userId: data.userId,
            role: data.role,
            description: data.description,
        });
        return this.formatStaffPresenter(staff);
    }
    async updateStaff(staffId, data) {
        const existingStaff = await staff_repository_1.staffRepository.findById(staffId);
        if (!existingStaff)
            return null;
        const staff = await staff_repository_1.staffRepository.update(staffId, {
            role: data.role,
            description: data.description,
        });
        return this.formatStaffPresenter(staff);
    }
    async deleteStaff(staffId) {
        const staff = await staff_repository_1.staffRepository.findById(staffId);
        if (!staff)
            return false;
        await staff_repository_1.staffRepository.delete(staffId);
        return true;
    }
    async getStaffCount() {
        return staff_repository_1.staffRepository.count();
    }
    formatStaffPresenter(staff) {
        return {
            id: staff.id,
            description: staff.description || undefined,
            role: staff.role,
            user: {
                id: staff.user.id,
                name: staff.user.name,
                email: staff.user.email,
                image: staff.user.image || undefined,
                role: staff.user.role,
            },
            createdAt: staff.createdAt.toISOString(),
            updatedAt: staff.updatedAt.toISOString(),
        };
    }
}
exports.StaffService = StaffService;
exports.staffService = new StaffService();
//# sourceMappingURL=staff.service.js.map