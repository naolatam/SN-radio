/**
 * API Client for SN-Radio Backend
 * Handles all HTTP requests to the backend API with BetterAuth integration
 */

import config from '../../config/env.config';

const API_BASE = config.apiBaseUrl;
const AUTH_BASE = config.apiUrl;

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class APIClient {
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('/api/auth') 
      ? `${AUTH_BASE}${endpoint}`
      : `${API_BASE}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include', // Important for BetterAuth cookies
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || `HTTP ${response.status}`,
        };
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // ============================================
  // Authentication Methods (BetterAuth)
  // ============================================

  async signInWithGoogle(): Promise<{ url?: string; error?: string }> {
    const response = await this.request<{ url: string }>('/api/auth/sign-in/social', {
      method: 'POST',
      body: JSON.stringify({
        provider: 'google',
        callbackURL: `${config.frontendUrl}/auth/callback`,
      }),
    });

    if (response.success && response.data) {
      return { url: response.data.url };
    }

    return { error: response.error || 'Failed to initiate OAuth' };
  }

  async signin(email: string, password: string): Promise<ApiResponse> {
    return this.request('/api/auth/sign-in/email', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(pseudo: string, email: string, password: string): Promise<ApiResponse> {
    return this.request('/api/auth/sign-up/email', {
      method: 'POST',
      body: JSON.stringify({ 
        name: pseudo,
        email, 
        password 
      }),
    });
  }

  async getSession(): Promise<ApiResponse<{ user: any; session: any }>> {
    return this.request('/api/auth/get-session');
  }

  async getProfile(): Promise<ApiResponse> {
    return this.request('/users/profile');
  }

  signout(): void {
    this.request('/api/auth/sign-out', {
      method: 'POST',
    });
    // Clear any stored session data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sn-radio-session');
    }
  }

  // ============================================
  // Theme Methods
  // ============================================

  async getTheme(): Promise<ApiResponse> {
    return this.request('/theme');
  }

  async setTheme(theme: string): Promise<ApiResponse> {
    return this.request('/theme', {
      method: 'POST',
      body: JSON.stringify({ theme }),
    });
  }

  // ============================================
  // Article Methods
  // ============================================

  async getArticles(): Promise<ApiResponse> {
    return this.request('/articles');
  }

  async createArticle(articleData: any): Promise<ApiResponse> {
    return this.request('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  }

  async deleteArticle(articleId: string): Promise<ApiResponse> {
    return this.request(`/articles/${articleId}`, {
      method: 'DELETE',
    });
  }

  async likeArticle(articleId: string): Promise<ApiResponse> {
    return this.request(`/articles/${articleId}/like`, {
      method: 'POST',
    });
  }

  // ============================================
  // Admin/User Management Methods
  // ============================================

  async getUsers(): Promise<ApiResponse> {
    return this.request('/users');
  }

  async deleteUser(userId: string): Promise<ApiResponse> {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async updateUserRole(userId: string, role: string): Promise<ApiResponse> {
    return this.request(`/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async getUserLikes(userId: string): Promise<ApiResponse> {
    return this.request(`/users/${userId}/likes`);
  }
}

export const apiClient = new APIClient();
export default apiClient;