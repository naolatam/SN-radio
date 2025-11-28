import { Prisma } from '@prisma/client';
import { User, Article, Category, CreateArticleDTO, UpdateArticleDTO, ArticleFilters, CreateCategoryDTO, UpdateCategoryDTO, UserRole } from './shared.types';
/**
 * Repository Interfaces
 * Define strict return types for all repository methods
 */
export interface UpdateUserData {
    name?: string;
    email?: string;
    description?: string;
    image?: string;
}
export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<Prisma.UserGetPayload<{}> | null>;
    findByPseudo(pseudo: string): Promise<Prisma.UserGetPayload<{}> | null>;
    findAll(): Promise<User[]>;
    updateRole(userId: string, role: UserRole): Promise<User>;
    update(userId: string, data: UpdateUserData): Promise<User>;
    updateLastLogin(userId: string): Promise<Prisma.UserGetPayload<{}>>;
    delete(userId: string): Promise<Prisma.UserGetPayload<{}>>;
    count(): Promise<number>;
    getArticlesCount(userId: string): Promise<number>;
    getLikesCount(userId: string): Promise<number>;
}
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
export interface ICategoryRepository {
    findAll(): Promise<Category[]>;
    findById(id: string): Promise<Category | null>;
    findBySlug(slug: string): Promise<Category | null>;
    create(data: CreateCategoryDTO): Promise<Category>;
    update(id: string, data: UpdateCategoryDTO): Promise<Category>;
    delete(id: string): Promise<Category>;
    getArticleCount(categoryId: string): Promise<number>;
}
export interface ArticleLike {
    id: string;
    articleId: string;
    userId: string;
    createdAt: Date;
}
export interface ArticleLikeWithUser extends ArticleLike {
    user: {
        id: string;
        name: string;
        email: string | null;
        image: string | null;
    };
}
export interface ILikeRepository {
    findLike(articleId: string, userId: string): Promise<ArticleLike | null>;
    createLike(articleId: string, userId: string): Promise<ArticleLike>;
    deleteLike(articleId: string, userId: string): Promise<ArticleLike>;
    countLikes(articleId: string): Promise<number>;
    getUserLikes(userId: string): Promise<Array<{
        articleId: string;
    }>>;
    getArticleLikers(articleId: string): Promise<ArticleLikeWithUser[]>;
}
export interface StaffWithUser {
    id: string;
    description: string | null;
    role: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
        role: UserRole;
    };
}
export interface CreateStaffData {
    userId: string;
    role: string;
    description?: string;
}
export interface UpdateStaffData {
    role?: string;
    description?: string;
}
export interface IStaffRepository {
    findAll(): Promise<StaffWithUser[]>;
    findById(id: string): Promise<StaffWithUser | null>;
    findByUserId(userId: string): Promise<StaffWithUser | null>;
    create(data: CreateStaffData): Promise<StaffWithUser>;
    update(id: string, data: UpdateStaffData): Promise<StaffWithUser>;
    delete(id: string): Promise<void>;
    count(): Promise<number>;
}
//# sourceMappingURL=repository.types.d.ts.map