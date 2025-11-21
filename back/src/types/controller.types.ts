import { Request, Response, NextFunction } from 'express';
import { User } from './shared.types';

/**
 * Controller Types
 * Define request and response types for controllers
 */

// Extend Express Request with user authentication
export interface AuthRequest extends Request {
  user?: User;
  session?: {
    userId: string;
    sessionId: string;
  };
}

// Generic controller method type
export type ControllerMethod = (
  req: Request | AuthRequest,
  res: Response,
  next?: NextFunction
) => Promise<void> | void;

// Auth controller method type
export type AuthControllerMethod = (
  req: AuthRequest,
  res: Response,
  next?: NextFunction
) => Promise<void> | void;

// Middleware types
export type Middleware = (
  req: Request | AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export type ErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;
