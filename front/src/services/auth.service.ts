/**
 * Authentication Service
 * Domain service for handling authentication operations using Better Auth
 */

import { authClient } from '../lib/auth.client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: any;
}

class AuthService {
  /**
   * Sign in with email and password
   */
  async signIn(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const { data, error } = await authClient.signIn.email({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Failed to sign in',
        };
      }

      return {
        success: true,
        user: data?.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign in failed',
      };
    }
  }

  /**
   * Sign up with email and password
   */
  async signUp(data: RegisterData): Promise<AuthResult> {
    try {
      const { data: responseData, error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Failed to sign up',
        };
      }

      return {
        success: true,
        user: responseData?.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign up failed',
      };
    }
  }

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<void> {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/auth/callback`,
      });
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data } = await authClient.getSession();
      return data;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  /**
   * Use Better Auth React hook for session management
   */
  useSession() {
    return authClient.useSession();
  }
}

export const authService = new AuthService();
