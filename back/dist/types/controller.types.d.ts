import { Request, Response, NextFunction } from 'express';
import { User } from './shared.types';
/**
 * Controller Types
 * Define request and response types for controllers
 */
export interface AuthRequest extends Request {
    user?: User;
    session?: {
        userId: string;
        sessionId: string;
    };
}
export type ControllerMethod = (req: Request | AuthRequest, res: Response, next?: NextFunction) => Promise<void> | void;
export type AuthControllerMethod = (req: AuthRequest, res: Response, next?: NextFunction) => Promise<void> | void;
export type Middleware = (req: Request | AuthRequest, res: Response, next: NextFunction) => Promise<void> | void;
export type ErrorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=controller.types.d.ts.map