import { userRepository } from '../repositories/user.repository';
import { User, UserProfile, UserRole, UpdateUserDTO } from '../types/shared.types';
import { IUserService } from '../types/service.types';
import { UserWithProfile } from '../types/repository.types';

export class UserService implements IUserService {
  async getUserById(userId: string): Promise<User | null> {
    const user = await userRepository.findById(userId);
    if (!user) return null;
    return this.formatUser(user);
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const user = await userRepository.findById(userId);
    if (!user) return null;

    const [articlesCount, likesCount] = await Promise.all([
      userRepository.getArticlesCount(userId),
      userRepository.getLikesCount(userId),
    ]);

    return {
      ...this.formatUser(user),
      articlesCount,
      likesCount,
    };
  }

  async getAllUsers(): Promise<User[]> {
    const users = await userRepository.findAll();
    return users.map(user => this.formatUser(user));
  }

  async updateUser(userId: string, data: UpdateUserDTO): Promise<User | null> {
    const user = await userRepository.update(userId, data);
    if (!user) return null;
    return this.formatUser(user);
  }

  async updateUserRole(userId: string, role: UserRole): Promise<User | null> {
    const user = await userRepository.updateRole(userId, role);
    if (!user) return null;
    return this.formatUser(user);
  }

  async deleteUser(userId: string): Promise<void> {
    await userRepository.delete(userId);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await userRepository.updateLastLogin(userId);
  }

  async getUserCount(): Promise<number> {
    return userRepository.count();
  }

  private formatUser(user: UserWithProfile): User {
    return {
      id: user.id,
      name: user.name, // Map database 'name' to application 'name'
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image || undefined, // Map database 'image' to application 'image'
      description: user.description || undefined,
      role: user.role as UserRole,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLogin: user.lastLogin?.toISOString(),
    };
  }
}

export const userService = new UserService();
