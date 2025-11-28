"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRepository = exports.CategoryRepository = void 0;
const database_config_1 = __importDefault(require("../config/database.config"));
class CategoryRepository {
    async findAll() {
        return database_config_1.default.category.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async findById(id) {
        return database_config_1.default.category.findUnique({
            where: { id },
        });
    }
    async findBySlug(slug) {
        return database_config_1.default.category.findUnique({
            where: { slug },
        });
    }
    async create(data) {
        return database_config_1.default.category.create({
            data,
        });
    }
    async update(id, data) {
        return database_config_1.default.category.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return database_config_1.default.category.delete({
            where: { id },
        });
    }
    async getArticleCount(categoryId) {
        return database_config_1.default.articleCategory.count({
            where: { categoryId },
        });
    }
}
exports.CategoryRepository = CategoryRepository;
exports.categoryRepository = new CategoryRepository();
//# sourceMappingURL=category.repository.js.map