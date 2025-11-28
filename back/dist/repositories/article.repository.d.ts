import { ArticleFilters, Article } from '../types/shared.types';
import { IArticleRepository, ArticleListResult, CreateArticleData, UpdateArticleData } from '../types/repository.types';
export declare class ArticleRepository implements IArticleRepository {
    findAll(filters?: ArticleFilters, currentUserId?: string): Promise<ArticleListResult>;
    findById(id: string, currentUserId?: string): Promise<Article | null>;
    findByAuthor(authorId: string, currentUserId?: string): Promise<Article[]>;
    create(data: CreateArticleData, currentUserId?: string): Promise<Article>;
    update(id: string, data: UpdateArticleData, currentUserId?: string): Promise<Article>;
    delete(id: string): Promise<void>;
    count(): Promise<number>;
    findLikedByUser(userId: string, currentUserId?: string): Promise<Article[]>;
}
export declare const articleRepository: ArticleRepository;
//# sourceMappingURL=article.repository.d.ts.map