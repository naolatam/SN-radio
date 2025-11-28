import { ILikeRepository, ArticleLike, ArticleLikeWithUser } from '../types/repository.types';
export declare class LikeRepository implements ILikeRepository {
    findLike(articleId: string, userId: string): Promise<ArticleLike | null>;
    createLike(articleId: string, userId: string): Promise<ArticleLike>;
    deleteLike(articleId: string, userId: string): Promise<ArticleLike>;
    countLikes(articleId: string): Promise<number>;
    getUserLikes(userId: string): Promise<Array<{
        articleId: string;
    }>>;
    getArticleLikers(articleId: string): Promise<ArticleLikeWithUser[]>;
}
export declare const likeRepository: LikeRepository;
//# sourceMappingURL=like.repository.d.ts.map