import { Prisma, UserRole, ConfigType } from '@prisma/client';
import {
  User,
  Article,
  Category,
  SiteConfig,
  ConfigValue,
  CreateArticleDTO,
  UpdateArticleDTO,
  ArticleFilters,
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CreateConfigDTO,
  UpdateConfigDTO,
} from './shared.types';

/**
 * Repository Interfaces
 * Define strict return types for all repository methods
 */

// User Repository Types
export interface UserWithProfile {
  id: string;
  name: string; // Database field (Better Auth standard)
  email: string;
  emailVerified: boolean;
  image: string | null; // Database field (Better Auth standard)
  description: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
}

export interface UpdateUserData {
  name?: string; // Database field (Better Auth standard)
  email?: string;
  description?: string;
  image?: string; // Database field (Better Auth standard)
}

export interface IUserRepository {
  findById(id: string): Promise<UserWithProfile | null>;
  findByEmail(email: string): Promise<Prisma.UserGetPayload<{}> | null>;
  findByPseudo(pseudo: string): Promise<Prisma.UserGetPayload<{}> | null>;
  findAll(): Promise<UserWithProfile[]>;
  updateRole(userId: string, role: UserRole): Promise<UserWithProfile>;
  update(userId: string, data: UpdateUserData): Promise<UserWithProfile>;
  updateLastLogin(userId: string): Promise<Prisma.UserGetPayload<{}>>;
  delete(userId: string): Promise<Prisma.UserGetPayload<{}>>;
  count(): Promise<number>;
  getArticlesCount(userId: string): Promise<number>;
  getLikesCount(userId: string): Promise<number>;
}

// Article Repository Types
export interface ArticleListResult {
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateArticleData extends CreateArticleDTO {
  authorId: string;
  contentHtml?: string;
}

export interface UpdateArticleData extends UpdateArticleDTO {
  contentHtml?: string;
}

export interface IArticleRepository {
  findAll(filters?: ArticleFilters, currentUserId?: string): Promise<ArticleListResult>;
  findById(id: string, currentUserId?: string): Promise<Article | null>;
  findByAuthor(authorId: string, currentUserId?: string): Promise<Article[]>;
  create(data: CreateArticleData, currentUserId?: string): Promise<Article>;
  update(id: string, data: UpdateArticleData, currentUserId?: string): Promise<Article>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}

// Category Repository Types
export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  create(data: CreateCategoryDTO): Promise<Category>;
  update(id: string, data: UpdateCategoryDTO): Promise<Category>;
  delete(id: string): Promise<Category>;
  getArticleCount(categoryId: string): Promise<number>;
}

// Like Repository Types
export interface ArticleLike {
  id: string;
  articleId: string;
  userId: string;
  createdAt: Date;
}

export interface ArticleLikeWithUser extends ArticleLike {
  user: {
    id: string;
    name: string; // Database field (Better Auth standard)
    email: string | null;
    image: string | null; // Database field (Better Auth standard)
  };
}

export interface ILikeRepository {
  findLike(articleId: string, userId: string): Promise<ArticleLike | null>;
  createLike(articleId: string, userId: string): Promise<ArticleLike>;
  deleteLike(articleId: string, userId: string): Promise<ArticleLike>;
  countLikes(articleId: string): Promise<number>;
  getUserLikes(userId: string): Promise<Array<{ articleId: string }>>;
  getArticleLikers(articleId: string): Promise<ArticleLikeWithUser[]>;
}

// SiteConfig Repository Types
export interface ConfigValueWithType {
  id: string;
  key: string;
  value: string;
  valueType: ConfigType;
  displayOrder: number;
  configId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteConfigWithValues {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  values: ConfigValueWithType[];
}

export interface ISiteConfigRepository {
  findAll(): Promise<SiteConfigWithValues[]>;
  findActive(): Promise<SiteConfigWithValues[]>;
  findByKey(key: string): Promise<SiteConfigWithValues | null>;
  findById(id: string): Promise<SiteConfigWithValues | null>;
  create(data: CreateConfigDTO): Promise<SiteConfigWithValues>;
  update(id: string, data: UpdateConfigDTO): Promise<SiteConfigWithValues>;
  delete(id: string): Promise<Prisma.SiteConfigGetPayload<{}>>;
  toggleActive(id: string): Promise<SiteConfigWithValues>;
}
