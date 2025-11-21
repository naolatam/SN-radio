/**
 * Shared TypeScript Interfaces for SN-Radio
 * These interfaces can be used in both frontend and backend
 * 
 * This file is synchronized with the backend types
 */

// ============================================
// User & Authentication
// ============================================

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  MEMBER = 'MEMBER',
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
  // Extended profile information
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

// ============================================
// Authentication
// ============================================

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

// ============================================
// Categories
// ============================================

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

// ============================================
// Articles
// ============================================

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
    role: UserRole; // Prisma UserRole
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
  content: string; // Markdown
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

// ============================================
// Site Configuration
// ============================================

export enum ConfigType {
  TEXT = 'TEXT',
  URL = 'URL',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  HTML = 'HTML',
  JSON = 'JSON',
}

export interface ConfigValue {
  id: string;
  key: string;
  value: string;
  valueType: ConfigType;
  displayOrder: number;
}

export interface SiteConfig {
  id: string;
  key: string;
  name: string;
  description?: string;
  isActive: boolean;
  values: ConfigValue[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateConfigDTO {
  key: string;
  name: string;
  description?: string;
  values: Array<{
    key: string;
    value: string;
    valueType: ConfigType;
    displayOrder?: number;
  }>;
}

export interface UpdateConfigDTO {
  name?: string;
  description?: string;
  isActive?: boolean;
  values?: Array<{
    id?: string;
    key: string;
    value: string;
    valueType: ConfigType;
    displayOrder?: number;
  }>;
}

// Predefined config keys
export const CONFIG_KEYS = {
  FOOTER: 'footer',
  CONTACT: 'contact',
  QUICK_LINKS: 'quick_links',
  LEGAL_TERMS: 'legal_terms',
  PRIVACY_POLICY: 'privacy_policy',
  TERMS_OF_USE: 'terms_of_use',
  SOCIAL_MEDIA: 'social_media',
} as const;

// ============================================
// API Response Wrappers
// ============================================

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

// ============================================
// Pagination & Filtering
// ============================================

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

// ============================================
// Utility Types
// ============================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
