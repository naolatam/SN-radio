"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffRepository = exports.StaffRepository = void 0;
const database_config_1 = __importDefault(require("../config/database.config"));
class StaffRepository {
    async findAll() {
        return database_config_1.default.staff.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findById(id) {
        return database_config_1.default.staff.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    },
                },
            },
        });
    }
    async findByUserId(userId) {
        return database_config_1.default.staff.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    },
                },
            },
        });
    }
    async create(data) {
        return database_config_1.default.staff.create({
            data: {
                userId: data.userId,
                role: data.role,
                description: data.description,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    },
                },
            },
        });
    }
    async update(id, data) {
        return database_config_1.default.staff.update({
            where: { id },
            data: {
                role: data.role,
                description: data.description,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    },
                },
            },
        });
    }
    async delete(id) {
        await database_config_1.default.staff.delete({
            where: { id },
        });
    }
    async count() {
        return database_config_1.default.staff.count();
    }
}
exports.StaffRepository = StaffRepository;
exports.staffRepository = new StaffRepository();
//# sourceMappingURL=staff.repository.js.map