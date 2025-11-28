"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const user_repository_1 = require("../repositories/user.repository");
class UserService {
    async getUserById(userId) {
        const user = await user_repository_1.userRepository.findById(userId);
        if (!user)
            return null;
        return user;
    }
    async getUserProfile(userId) {
        const user = await user_repository_1.userRepository.findById(userId);
        if (!user)
            return null;
        const [articlesCount, likesCount] = await Promise.all([
            user_repository_1.userRepository.getArticlesCount(userId),
            user_repository_1.userRepository.getLikesCount(userId),
        ]);
        return {
            ...user,
            articlesCount,
            likesCount,
        };
    }
    async getAllUsers() {
        const users = await user_repository_1.userRepository.findAll();
        return users;
    }
    async getUsersByName(name) {
        const users = await user_repository_1.userRepository.findsByPseudo(name);
        if (!users)
            return [];
        return users.map(user => this.formatUser(user));
    }
    async updateUser(userId, data) {
        const user = await user_repository_1.userRepository.update(userId, data);
        if (!user)
            return null;
        return user;
    }
    async updateUserRole(userId, role) {
        const user = await user_repository_1.userRepository.updateRole(userId, role);
        if (!user)
            return null;
        return user;
    }
    async deleteUser(userId) {
        await user_repository_1.userRepository.delete(userId);
    }
    async updateLastLogin(userId) {
        await user_repository_1.userRepository.updateLastLogin(userId);
    }
    async getUserCount() {
        return user_repository_1.userRepository.count();
    }
    formatUser(user) {
        return {
            id: user.id,
            name: user.name, // Map database 'name' to application 'name'
            email: user.email,
            emailVerified: user.emailVerified,
            image: user.image || undefined, // Map database 'image' to application 'image'
            description: user.description || undefined,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            lastLogin: user.lastLogin?.toISOString(),
        };
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map