import { Response, NextFunction } from 'express';
import { auth } from '../config/auth.config';
import { AuthRequest, Middleware } from '../types/controller.types';
import { UserRole } from '../types/shared.types';
import { BetterAuthSession, IAuthMiddleware } from '../types/middleware.types';
import { userService } from '../services/user.service';

/**
 * Auth Middleware Helper Class
 * Implements IAuthMiddleware interface
 */
class AuthMiddlewareHelper implements IAuthMiddleware {
  /**
   * Extract and format user from BetterAuth session
   */
  authenticateUser(session: BetterAuthSession): {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
  } {
    
    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      emailVerified: session.user.emailVerified,
      role: session.user.role || UserRole.MEMBER,
      createdAt: session.user.createdAt.toISOString(),
      updatedAt: session.user.updatedAt.toISOString(),
    };
  }
}

const authHelper = new AuthMiddlewareHelper();

export const authMiddleware: Middleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Attach user to request
    req.user = authHelper.authenticateUser(session as BetterAuthSession);
    const fullUser = await userService.getUserById(req.user.id);
    if(!fullUser) {
      next();
      return;
    }
    req.user.role = fullUser.role;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid or expired session',
    });
  }
};

export const optionalAuthMiddleware: Middleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  auth.api.getSession({
    headers: req.headers as any,
  })
    .then((session: BetterAuthSession | null) => {
      if (session) {
        req.user = authHelper.authenticateUser(session);
      }
      next();
    })
    .catch(() => {
      // Continue without user
      next();
    });
};

export const adminMiddleware: Middleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
    return;
  }

  if (req.user.role !== UserRole.ADMIN) {
    res.status(403).json({
      success: false,
      error: 'Admin access required',
    });
    return;
  }

  next();
};
export const staffMiddleware: Middleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
    return;
  }
  if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.STAFF) {
    res.status(403).json({
      success: false,
      error: 'Staff access required',
    });
    return;
  }

  next();
};
