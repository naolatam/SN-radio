"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeRepository = exports.LikeRepository = void 0;
const database_config_1 = __importDefault(require("../config/database.config"));
class LikeRepository {
    async findLike(articleId, userId) {
        return database_config_1.default.articleLike.findUnique({
            where: {
                articleId_userId: {
                    articleId,
                    userId,
                },
            },
        });
    }
    async createLike(articleId, userId) {
        return database_config_1.default.articleLike.create({
            data: {
                articleId,
                userId,
            },
        });
    }
    async deleteLike(articleId, userId) {
        return database_config_1.default.articleLike.delete({
            where: {
                articleId_userId: {
                    articleId,
                    userId,
                },
            },
        });
    }
    async countLikes(articleId) {
        return database_config_1.default.articleLike.count({
            where: { articleId },
        });
    }
    async getUserLikes(userId) {
        return database_config_1.default.articleLike.findMany({
            where: { userId },
            select: {
                articleId: true,
            },
        });
    }
    async getArticleLikers(articleId) {
        return database_config_1.default.articleLike.findMany({
            where: { articleId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });
    }
}
exports.LikeRepository = LikeRepository;
exports.likeRepository = new LikeRepository();
//# sourceMappingURL=like.repository.js.map