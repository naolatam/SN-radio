import { Response } from 'express';
import { AuthRequest } from '../types/controller.types';
export declare class ArticleController {
    getAllArticles(req: AuthRequest, res: Response): Promise<void>;
    getArticleById(req: AuthRequest, res: Response): Promise<void>;
    createArticle(req: AuthRequest, res: Response): Promise<void>;
    updateArticle(req: AuthRequest, res: Response): Promise<void>;
    deleteArticle(req: AuthRequest, res: Response): Promise<void>;
    toggleLike(req: AuthRequest, res: Response): Promise<void>;
    getLikedArticles(req: AuthRequest, res: Response): Promise<void>;
}
export declare const articleController: ArticleController;
//# sourceMappingURL=article.controller.d.ts.map