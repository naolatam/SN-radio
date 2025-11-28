"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const database_config_1 = __importDefault(require("../config/database.config"));
const shared_types_1 = require("../types/shared.types");
class UserRepository {
    async findById(id) {
        return database_config_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                image: true,
                description: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                lastLogin: true,
            },
        });
    }
    async findByEmail(email) {
        return database_config_1.default.user.findUnique({
            where: { email },
        });
    }
    async findsByPseudo(pseudo) {
        return await database_config_1.default.user.findMany({
            where: { name: { contains: pseudo }, role: shared_types_1.UserRole.MEMBER }, // Map pseudo to name field
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                image: true,
                description: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                lastLogin: true,
            },
        });
    }
    async findByPseudo(pseudo) {
        return database_config_1.default.user.findFirst({
            where: { name: { contains: pseudo, } }, // Map pseudo to name field
        });
    }
    async findAll() {
        return database_config_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                image: true,
                description: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                lastLogin: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateRole(userId, role) {
        return database_config_1.default.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                image: true,
                description: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                lastLogin: true,
            },
        });
    }
    async update(userId, data) {
        return database_config_1.default.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                image: true,
                description: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                lastLogin: true,
            },
        });
    }
    async updateLastLogin(userId) {
        return database_config_1.default.user.update({
            where: { id: userId },
            data: { lastLogin: new Date() },
        });
    }
    async delete(userId) {
        return database_config_1.default.user.delete({
            where: { id: userId },
        });
    }
    async count() {
        return database_config_1.default.user.count();
    }
    async getArticlesCount(userId) {
        return database_config_1.default.article.count({
            where: { authorId: userId },
        });
    }
    async getLikesCount(userId) {
        return database_config_1.default.articleLike.count({
            where: { userId },
        });
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
//# sourceMappingURL=user.repository.js.map