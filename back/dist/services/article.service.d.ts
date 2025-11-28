import { CreateArticleDTO, UpdateArticleDTO, Article, ArticleFilters, UserRole } from '../types/shared.types';
import { IArticleService, ArticlesWithPagination, ToggleLikeResult } from '../types/service.types';
export declare class ArticleService implements IArticleService {
    getAllArticles(filters?: ArticleFilters, currentUserId?: string): Promise<ArticlesWithPagination>;
    getArticleById(articleId: string, currentUserId?: string): Promise<Article | null>;
    getArticlesByAuthor(authorId: string, currentUserId?: string): Promise<Article[]>;
    createArticle(data: CreateArticleDTO, authorId: string, userRole: UserRole): Promise<Article>;
    updateArticle(articleId: string, data: UpdateArticleDTO, userId: string, userRole: UserRole): Promise<Article | null>;
    deleteArticle(articleId: string, userId: string, userRole: UserRole): Promise<boolean>;
    toggleLike(articleId: string, userId: string): Promise<ToggleLikeResult>;
    getArticleCount(): Promise<number>;
    getLikedArticles(userId: string, currentUserId?: string): Promise<Article[]>;
}
export declare const articleService: ArticleService;
//# sourceMappingURL=article.service.d.ts.map