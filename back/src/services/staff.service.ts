import { staffRepository } from '../repositories/staff.repository';
import { StaffPresenterDTO, CreateStaffDTO, UpdateStaffDTO, UserRole } from '../types/shared.types';
import { IStaffService } from '../types/service.types';
import { StaffWithUser } from '../types/repository.types';
import { userService } from './user.service';

export class StaffService implements IStaffService {
  async getAllStaff(isStaff: boolean): Promise<StaffPresenterDTO[]> {
    const staffMembers = await staffRepository.findAll({ withEmail: isStaff });
    return staffMembers.map(staff => this.formatStaffPresenter(staff));
  }

  async getStaffById(staffId: string): Promise<StaffPresenterDTO | null> {
    const staff = await staffRepository.findById(staffId);
    if (!staff) return null;
    return this.formatStaffPresenter(staff);
  }

  async getStaffByUserId(userId: string): Promise<StaffPresenterDTO | null> {
    const staff = await staffRepository.findByUserId(userId);
    if (!staff) return null;
    return this.formatStaffPresenter(staff);
  }

  async createStaff(data: CreateStaffDTO): Promise<StaffPresenterDTO> {
    // Check if user is already a staff member
    const existingStaff = await staffRepository.findByUserId(data.userId);
    if (existingStaff) {
      throw new Error('User is already a staff member');
    }
    const user = await userService.getUserById(data.userId);
    if (!user) {
      throw new Error('User not found');
    }
    await userService.updateUserRole(data.userId, "STAFF" as UserRole);
    const staff = await staffRepository.create({
      userId: data.userId,
      role: data.role,
      description: data.description,
    });

    return this.formatStaffPresenter(staff);
  }

  async updateStaff(staffId: string, data: UpdateStaffDTO): Promise<StaffPresenterDTO | null> {
    const existingStaff = await staffRepository.findById(staffId);
    if (!existingStaff) return null;

    const staff = await staffRepository.update(staffId, {
      role: data.role,
      description: data.description,
    });

    return this.formatStaffPresenter(staff);
  }

  async deleteStaff(staffId: string): Promise<boolean> {
    const staff = await staffRepository.findById(staffId);
    if (!staff) return false;

    await staffRepository.delete(staffId);
    return true;
  }

  async getStaffCount(): Promise<number> {
    return staffRepository.count();
  }

  private formatStaffPresenter(staff: StaffWithUser): StaffPresenterDTO {
    return {
      id: staff.id,
      description: staff.description || undefined,
      role: staff.role,
      user: {
        id: staff.user.id,
        name: staff.user.name,
        email: staff.user.email,
        image: staff.user.image || undefined,
        role: staff.user.role,
      },
      createdAt: staff.createdAt.toISOString(),
      updatedAt: staff.updatedAt.toISOString(),
    };
  }
}

export const staffService = new StaffService();
