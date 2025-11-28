import { User, UserProfile, UserRole, UpdateUserDTO } from '../types/shared.types';
import { IUserService } from '../types/service.types';
export declare class UserService implements IUserService {
    getUserById(userId: string): Promise<User | null>;
    getUserProfile(userId: string): Promise<UserProfile | null>;
    getAllUsers(): Promise<User[]>;
    getUsersByName(name: string): Promise<User[]>;
    updateUser(userId: string, data: UpdateUserDTO): Promise<User | null>;
    updateUserRole(userId: string, role: UserRole): Promise<User | null>;
    deleteUser(userId: string): Promise<void>;
    updateLastLogin(userId: string): Promise<void>;
    getUserCount(): Promise<number>;
    private formatUser;
}
export declare const userService: UserService;
//# sourceMappingURL=user.service.d.ts.map