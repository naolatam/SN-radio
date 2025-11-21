import prisma from '../config/database.config';
import { CreateArticleDTO, UpdateArticleDTO, ArticleFilters, Article, UserRole, User } from '../types/shared.types';
import {
  IArticleRepository,
  ArticleListResult,
  CreateArticleData,
  UpdateArticleData,
} from '../types/repository.types';

// Helper to transform Prisma article result to Article type
const transformPrismaArticle = (prismaArticle: any, currentUserId?: string): Article => ({
  ...prismaArticle,
  author: {
    ...prismaArticle.author,
    role: prismaArticle.author.role as UserRole,
  },
  categories: prismaArticle.categories.map((ac: any) => ac.category),
  likes: prismaArticle.likes.length,
  isLikedByCurrentUser: currentUserId ? prismaArticle.likes.some((like: any) => like.userId === currentUserId) : undefined,
});


export class ArticleRepository implements IArticleRepository {
  async findAll(filters?: ArticleFilters, currentUserId?: string): Promise<ArticleListResult> {
    const {
      page = 1,
      pageSize = 20,
      categoryId,
      authorId,
      isHeadline,
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc',
    } = filters || {};

    const where: any = {};

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
      prisma.article.findMany({
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
      prisma.article.count({ where }),
    ]);

    const articles = prismaArticles.map(article => transformPrismaArticle(article, currentUserId));

    return { articles, total, page, pageSize };
  }

  async findById(id: string, currentUserId?: string): Promise<Article | null> {
    const article = await prisma.article.findUnique({
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

    if (!article) return null;

    return transformPrismaArticle(article, currentUserId);
  }

  async findByAuthor(authorId: string, currentUserId?: string): Promise<Article[]> {
    const articles = await prisma.article.findMany({
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

  async create(data: CreateArticleData, currentUserId?: string): Promise<Article> {
    const { categoryIds, ...articleData } = data;

    const article = await prisma.article.create({
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

  async update(id: string, data: UpdateArticleData, currentUserId?: string): Promise<Article> {
    const { categoryIds, ...updateData } = data;

    // If categories need to be updated
    if (categoryIds) {
      // Delete existing category associations
      await prisma.articleCategory.deleteMany({
        where: { articleId: id },
      });
    }

    const article = await prisma.article.update({
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

  async delete(id: string): Promise<void> {
    await prisma.article.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return prisma.article.count();
  }
}

export const articleRepository = new ArticleRepository();
