/**
 * Shared TypeScript Interfaces for SN-Radio
 * These interfaces can be used in both frontend and backend
 *
 * This file is synchronized with the backend types
 */
export declare enum UserRole {
    ADMIN = "ADMIN",
    STAFF = "STAFF",
    MEMBER = "MEMBER"
}
export interface User {
    id: string;
    name: string;
    email?: string;
    emailVerified: boolean;
    image?: string | null;
    description?: string | null;
    role: UserRole;
    createdAt?: string;
    updatedAt?: string;
    lastLogin?: string | null;
}
export interface UserProfile extends User {
    articlesCount?: number;
    likesCount?: number;
}
export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    description?: string;
}
export interface UpdateUserDTO {
    name?: string;
    email?: string;
    description?: string;
    image?: string;
}
export interface UpdateUserRoleDTO {
    role: UserRole;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}
export interface AuthResponse {
    success: boolean;
    user?: User;
    session?: {
        token: string;
        expiresAt: string;
    };
    error?: string;
}
export interface Category {
    id?: string;
    name: string;
    slug: string;
    color: string;
}
export interface CreateCategoryDTO {
    name: string;
    slug: string;
    color: string;
}
export interface UpdateCategoryDTO {
    name?: string;
    slug?: string;
    color?: string;
}
export interface Article {
    id: string;
    title: string;
    resume: string;
    content: string;
    contentHtml: string | null;
    pictureUrl: string | null;
    isHeadline: boolean;
    publishedAt: Date;
    updatedAt: Date;
    authorId: string;
    author: {
        id: string;
        name: string;
        emailVerified: boolean;
        image: string | null;
        role: UserRole;
        description?: string | null;
    };
    categories: Category[];
    likes: number;
    isLikedByCurrentUser?: boolean;
}
export interface ArticleListItem {
    id: string;
    title: string;
    resume: string;
    pictureUrl?: string;
    isHeadline: boolean;
    publishedAt: string;
    author: {
        id: string;
        name: string;
        picture?: string;
    };
    categories: Category[];
    likes: number;
    isLikedByCurrentUser?: boolean;
}
export interface CreateArticleDTO {
    title: string;
    resume: string;
    content: string;
    pictureUrl?: string;
    categoryIds: string[];
    isHeadline?: boolean;
}
export interface UpdateArticleDTO {
    title?: string;
    resume?: string;
    content?: string;
    pictureUrl?: string;
    categoryIds?: string[];
    isHeadline?: boolean;
}
export interface Theme {
    id: string;
    name: string;
    slug: string;
    description?: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    favicon?: string;
    icon?: string;
    logo?: string;
    siteName: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}
export interface CreateThemeDTO {
    name: string;
    slug: string;
    description?: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    favicon?: string;
    icon?: string;
    logo?: string;
    siteName: string;
}
export interface UpdateThemeDTO {
    name?: string;
    slug?: string;
    description?: string;
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    favicon?: string;
    icon?: string;
    logo?: string;
    siteName?: string;
}
export interface ThemeConfigDTO {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    favicon: string;
    icon: string;
    logo: string;
    siteName: string;
}
export interface Staff {
    id: string;
    description?: string | null;
    role: string;
    userId: string;
    user?: User;
    createdAt?: string;
    updatedAt?: string;
}
export interface StaffPresenterDTO {
    id: string;
    description?: string;
    role: string;
    user: {
        id: string;
        name: string;
        email?: string;
        image?: string;
        role: UserRole;
    };
    createdAt: string;
    updatedAt: string;
}
export interface CreateStaffDTO {
    userId: string;
    role: string;
    description?: string;
}
export interface UpdateStaffDTO {
    role?: string;
    description?: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}
export interface PaginationParams {
    page?: number;
    pageSize?: number;
}
export interface ArticleFilters extends PaginationParams {
    categoryId?: string;
    authorId?: string;
    isHeadline?: boolean;
    search?: string;
    sortBy?: 'publishedAt' | 'updatedAt' | 'likes';
    sortOrder?: 'asc' | 'desc';
}
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
//# sourceMappingURL=shared.types.d.ts.map