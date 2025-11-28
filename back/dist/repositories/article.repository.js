"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleRepository = exports.ArticleRepository = void 0;
const database_config_1 = __importDefault(require("../config/database.config"));
// Helper to transform Prisma article result to Article type
const transformPrismaArticle = (prismaArticle, currentUserId) => ({
    ...prismaArticle,
    author: {
        ...prismaArticle.author,
        role: prismaArticle.author.role,
    },
    categories: prismaArticle.categories.map((ac) => ac.category),
    likes: prismaArticle.likes.length,
    isLikedByCurrentUser: currentUserId ? prismaArticle.likes.some((like) => like.userId === currentUserId) : undefined,
});
class ArticleRepository {
    async findAll(filters, currentUserId) {
        const { page = 1, pageSize = 20, categoryId, authorId, isHeadline, search, sortBy = 'publishedAt', sortOrder = 'desc', } = filters || {};
        const where = {};
        if (categoryId) {
            where.categories = {
                some: { categoryId },
            };
        }
        if (authorId) {
            where.authorId = authorId;
        }
        if (isHeadline !== undefined) {
            where.isHeadline = isHeadline;
        }
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { resume: { contains: search } },
                { content: { contains: search } },
            ];
        }
        const skip = (page - 1) * pageSize;
        const [prismaArticles, total] = await Promise.all([
            database_config_1.default.article.findMany({
                where,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            role: true,
                            emailVerified: true,
                            description: true,
                        },
                    },
                    categories: {
                        include: {
                            category: true,
                        },
                    },
                    likes: {
                        select: {
                            userId: true,
                        },
                    },
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: pageSize,
            }),
            database_config_1.default.article.count({ where }),
        ]);
        const articles = prismaArticles.map(article => transformPrismaArticle(article, currentUserId));
        return { articles, total, page, pageSize };
    }
    async findById(id, currentUserId) {
        const article = await database_config_1.default.article.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        emailVerified: true,
                        image: true,
                        role: true,
                        description: true,
                    },
                },
                categories: {
                    include: {
                        category: true,
                    },
                },
                likes: {
                    select: {
                        userId: true,
                    },
                },
            },
        });
        if (!article)
            return null;
        return transformPrismaArticle(article, currentUserId);
    }
    async findByAuthor(authorId, currentUserId) {
        const articles = await database_config_1.default.article.findMany({
            where: { authorId },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        emailVerified: true,
                        image: true,
                        role: true,
                        description: true,
                    },
                },
                categories: {
                    include: {
                        category: true,
                    },
                },
                likes: {
                    select: {
                        userId: true,
                    },
                },
            },
            orderBy: { publishedAt: 'desc' },
        });
        return articles.map(article => transformPrismaArticle(article, currentUserId));
    }
    async create(data, currentUserId) {
        const { categoryIds, ...articleData } = data;
        const article = await database_config_1.default.article.create({
            data: {
                ...articleData,
                categories: {
                    create: categoryIds.map((categoryId) => ({
                        category: { connect: { id: categoryId } },
                    })),
                },
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        emailVerified: true,
                        image: true,
                        role: true,
                        description: true,
                    },
                },
                categories: {
                    include: {
                        category: true,
                    },
                },
                likes: {
                    select: {
                        userId: true,
                    },
                },
            },
        });
        return transformPrismaArticle(article);
    }
    async update(id, data, currentUserId) {
        const { categoryIds, ...updateData } = data;
        // If categories need to be updated
        if (categoryIds) {
            // Delete existing category associations
            await database_config_1.default.articleCategory.deleteMany({
                where: { articleId: id },
            });
        }
        const article = await database_config_1.default.article.update({
            where: { id },
            data: {
                ...updateData,
                ...(categoryIds && {
                    categories: {
                        create: categoryIds.map((categoryId) => ({
                            category: { connect: { id: categoryId } },
                        })),
                    },
                }),
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        emailVerified: true,
                        image: true,
                        role: true,
                        description: true,
                    },
                },
                categories: {
                    include: {
                        category: true,
                    },
                },
                likes: {
                    select: {
                        userId: true,
                    },
                },
            },
        });
        return transformPrismaArticle(article);
    }
    async delete(id) {
        await database_config_1.default.article.delete({
            where: { id },
        });
    }
    async count() {
        return database_config_1.default.article.count();
    }
    async findLikedByUser(userId, currentUserId) {
        const prismaArticles = await database_config_1.default.article.findMany({
            where: {
                likes: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        role: true,
                        emailVerified: true,
                        description: true,
                    },
                },
                categories: {
                    include: {
                        category: true,
                    },
                },
                likes: {
                    select: {
                        userId: true,
                    },
                },
            },
            orderBy: {
                publishedAt: 'desc',
            },
        });
        return prismaArticles.map((article) => transformPrismaArticle(article, currentUserId));
    }
}
exports.ArticleRepository = ArticleRepository;
exports.articleRepository = new ArticleRepository();
//# sourceMappingURL=article.repository.js.map