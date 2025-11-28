/**
 * Staff Service
 * Domain service for managing staff operations
 */

import { StaffPresenterDTO, CreateStaffDTO, UpdateStaffDTO } from '@/types/shared.types';
import { httpClient, HttpResponse } from '../lib/http.client';

class StaffService {
  private readonly basePath = '/staff';

  /**
   * Get all staff members
   */
  async getAll(): Promise<StaffPresenterDTO[]> {
    const response = await httpClient.get<{ staff: StaffPresenterDTO[] }>(this.basePath);
    
    if (response.success && response.data) {
      return response.data.staff || [];
    }
    
    return [];
  }

  /**
   * Get staff member by ID
   */
  async getById(id: string): Promise<StaffPresenterDTO | null> {
    const response = await httpClient.get<{ staff: StaffPresenterDTO }>(`${this.basePath}/${id}`);
    
    if (response.success && response.data) {
      return response.data.staff;
    }
    
    return null;
  }

  /**
   * Get staff member by user ID
   */
  async getByUserId(userId: string): Promise<StaffPresenterDTO | null> {
    const response = await httpClient.get<{ staff: StaffPresenterDTO }>(`${this.basePath}/user/${userId}`);
    
    if (response.success && response.data) {
      return response.data.staff;
    }
    
    return null;
  }

  /**
   * Create a new staff member (admin only)
   */
  async create(data: CreateStaffDTO): Promise<HttpResponse<{ staff: StaffPresenterDTO }>> {
    return httpClient.post<{ staff: StaffPresenterDTO }>(this.basePath, data);
  }

  /**
   * Update staff member (admin only)
   */
  async update(id: string, data: UpdateStaffDTO): Promise<HttpResponse<{ staff: StaffPresenterDTO }>> {
    return httpClient.put<{ staff: StaffPresenterDTO }>(`${this.basePath}/${id}`, data);
  }

  /**
   * Delete staff member (admin only)
   */
  async delete(id: string): Promise<HttpResponse<void>> {
    return httpClient.delete<void>(`${this.basePath}/${id}`);
  }

  /**
   * Get staff count (admin only)
   */
  async getCount(): Promise<number> {
    const response = await httpClient.get<{ count: number }>(`${this.basePath}/count`);
    
    if (response.success && response.data) {
      return response.data.count || 0;
    }
    
    return 0;
  }
}

export const staffService = new StaffService();
