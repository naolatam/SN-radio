/**
 * Middleware Type Definitions
 */

import { UserRole } from './shared.types';

/**
 * BetterAuth Session User
 * Represents the user object returned from BetterAuth session
 */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null; // Better Auth uses 'image', mapped to 'picture' in application
  createdAt: Date;
  updatedAt: Date;
  role?: UserRole;
}

/**
 * BetterAuth Session
 * Represents the full session object from BetterAuth
 */
export interface BetterAuthSession {
  user: SessionUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
}

/**
 * Auth Middleware Helper Interface
 */
export interface IAuthMiddleware {
  /**
   * Extract user from BetterAuth session and attach to request
   */
   authenticateUser(session: BetterAuthSession): {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
  };
}
