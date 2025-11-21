import prisma from '../config/database.config';
import { ILikeRepository, ArticleLike, ArticleLikeWithUser } from '../types/repository.types';

export class LikeRepository implements ILikeRepository {
  async findLike(articleId: string, userId: string): Promise<ArticleLike | null> {
    return prisma.articleLike.findUnique({
      where: {
        articleId_userId: {
          articleId,
          userId,
        },
      },
    });
  }

  async createLike(articleId: string, userId: string): Promise<ArticleLike> {
    return prisma.articleLike.create({
      data: {
        articleId,
        userId,
      },
    });
  }

  async deleteLike(articleId: string, userId: string): Promise<ArticleLike> {
    return prisma.articleLike.delete({
      where: {
        articleId_userId: {
          articleId,
          userId,
        },
      },
    });
  }

  async countLikes(articleId: string): Promise<number> {
    return prisma.articleLike.count({
      where: { articleId },
    });
  }

  async getUserLikes(userId: string): Promise<Array<{ articleId: string }>> {
    return prisma.articleLike.findMany({
      where: { userId },
      select: {
        articleId: true,
      },
    });
  }

  async getArticleLikers(articleId: string): Promise<ArticleLikeWithUser[]> {
    return prisma.articleLike.findMany({
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

export const likeRepository = new LikeRepository();
