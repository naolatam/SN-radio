import prisma from '../config/database.config';
import { User, UserRole } from '../types/shared.types';
import { IUserRepository, UpdateUserData } from '../types/repository.types';
import { Prisma } from '@prisma/client';

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
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
    }) as Promise<User | null>;
  }

  async findByEmail(email: string): Promise<Prisma.UserGetPayload<{}> | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }
  async findsByPseudo(pseudo: string): Promise<Prisma.UserGetPayload<{}>[] | null> {
    return await prisma.user.findMany({
      where: { name: { contains: pseudo }, role: UserRole.MEMBER }, // Map pseudo to name field
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
  async findByPseudo(pseudo: string): Promise<Prisma.UserGetPayload<{}> | null> {
    return prisma.user.findFirst({
      where: { name: { contains: pseudo,  } }, // Map pseudo to name field
    });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
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
    }) as unknown as Promise<User[]>;
  }

  async updateRole(userId: string, role: UserRole): Promise<User> {
    return prisma.user.update({
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
    }) as unknown as Promise<User>;
  }

  async update(userId: string, data: UpdateUserData): Promise<User> {
    return prisma.user.update({
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
    }) as unknown as Promise<User>;
  }

  async updateLastLogin(userId: string): Promise<Prisma.UserGetPayload<{}>> {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });
  }

  async delete(userId: string): Promise<Prisma.UserGetPayload<{}>> {
    return prisma.user.delete({
      where: { id: userId },
    });
  }

  async count(): Promise<number> {
    return prisma.user.count();
  }

  async getArticlesCount(userId: string): Promise<number> {
    return prisma.article.count({
      where: { authorId: userId },
    });
  }

  async getLikesCount(userId: string): Promise<number> {
    return prisma.articleLike.count({
      where: { userId },
    });
  }
}

export const userRepository = new UserRepository();
