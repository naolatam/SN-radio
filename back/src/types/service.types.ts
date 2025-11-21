import {
  User,
  UserProfile,
  Article,
  Category,
  SiteConfig,
  UserRole,
  ArticleFilters,
  CreateArticleDTO,
  UpdateArticleDTO,
  UpdateUserDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CreateConfigDTO,
  UpdateConfigDTO,
} from './shared.types';

/**
 * Service Interfaces
 * Define strict return types for all service methods
 */

// User Service Types
export interface ArticlesWithPagination {
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ToggleLikeResult {
  liked: boolean;
  likes: number;
}

export interface IUserService {
  getUserById(userId: string): Promise<User | null>;
  getUserProfile(userId: string): Promise<UserProfile | null>;
  getAllUsers(): Promise<User[]>;
  updateUser(userId: string, data: UpdateUserDTO): Promise<User | null>;
  updateUserRole(userId: string, role: UserRole): Promise<User | null>;
  deleteUser(userId: string): Promise<void>;
  updateLastLogin(userId: string): Promise<void>;
  getUserCount(): Promise<number>;
}

// Article Service Types
export interface IArticleService {
  getAllArticles(filters?: ArticleFilters, currentUserId?: string): Promise<ArticlesWithPagination>;
  getArticleById(articleId: string, currentUserId?: string): Promise<Article | null>;
  getArticlesByAuthor(authorId: string, currentUserId?: string): Promise<Article[]>;
  createArticle(
    data: CreateArticleDTO,
    authorId: string,
    userRole: UserRole
  ): Promise<Article>;
  updateArticle(
    articleId: string,
    data: UpdateArticleDTO,
    userId: string,
    userRole: UserRole
  ): Promise<Article | null>;
  deleteArticle(articleId: string, userId: string, userRole: UserRole): Promise<boolean>;
  toggleLike(articleId: string, userId: string): Promise<ToggleLikeResult>;
  getArticleCount(): Promise<number>;
}

// Category Service Types
export interface ICategoryService {
  getAllCategories(): Promise<Category[]>;
  getCategoryById(categoryId: string): Promise<Category | null>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
  createCategory(data: CreateCategoryDTO): Promise<Category>;
  updateCategory(categoryId: string, data: UpdateCategoryDTO): Promise<Category | null>;
  deleteCategory(categoryId: string): Promise<boolean>;
  getArticleCount(categoryId: string): Promise<number>;
}

// SiteConfig Service Types
export interface ISiteConfigService {
  getAllConfigs(): Promise<SiteConfig[]>;
  getActiveConfigs(): Promise<SiteConfig[]>;
  getConfigByKey(key: string): Promise<SiteConfig | null>;
  getConfigById(id: string): Promise<SiteConfig | null>;
  createConfig(data: CreateConfigDTO): Promise<SiteConfig>;
  updateConfig(id: string, data: UpdateConfigDTO): Promise<SiteConfig | null>;
  deleteConfig(id: string): Promise<boolean>;
  toggleConfigActive(id: string): Promise<SiteConfig | null>;
}
