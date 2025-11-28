/**
 * User Service
 * Domain service for managing user operations
 */

import { UserRole, User, UpdateUserDTO,  } from '@/types/shared.types';
import { httpClient, HttpResponse } from '../lib/http.client';



class UserService {
  private readonly basePath = '/users';

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User | null> {
    const response = await httpClient.get<{ user: User }>(`${this.basePath}/profile`);
    
    if (response.success && response.data) {
      return response.data.user;
    }
    
    return null;
  }

  /**
   * Update current user profile
   */
  async updateProfile(data: UpdateUserDTO): Promise<HttpResponse<{ user: User }>> {
    return httpClient.put<{ user: User }>(`${this.basePath}/profile`, data);
  }

  /**
   * Get all users (admin only)
   */
  async getAll(): Promise<User[]> {
    const response = await httpClient.get<{ users: User[] }>(this.basePath);
    
    if (response.success && response.data) {
      return response.data.users || [];
    }
    
    return [];
  }

  /**
   * Get all users (admin only)
   */
  async getByName(name: string): Promise<User[]> {
    const response = await httpClient.get<{ users: User[] }>(`${this.basePath}/byName?name=${encodeURIComponent(name)}`);
    
    if (response.success && response.data) {
      return response.data.users || [];
    }
    
    return [];
  }

  /**
   * Get user by ID (admin only)
   */
  async getById(id: string): Promise<User | null> {
    const response = await httpClient.get<{ user: User }>(`${this.basePath}/${id}`);
    
    if (response.success && response.data) {
      return response.data.user;
    }
    
    return null;
  }

  /**
   * Update user role (admin only)
   */
  async updateRole(id: string, role: UserRole): Promise<HttpResponse<{ user: User }>> {
    return httpClient.patch<{ user: User }>(`${this.basePath}/${id}/role`, { role });
  }

  /**
   * Delete user (admin only)
   */
  async delete(id: string): Promise<HttpResponse<void>> {
    return httpClient.delete<void>(`${this.basePath}/${id}`);
  }
}

export const userService = new UserService();
