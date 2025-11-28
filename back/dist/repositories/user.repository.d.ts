import { User, UserRole } from '../types/shared.types';
import { IUserRepository, UpdateUserData } from '../types/repository.types';
import { Prisma } from '@prisma/client';
export declare class UserRepository implements IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<Prisma.UserGetPayload<{}> | null>;
    findsByPseudo(pseudo: string): Promise<Prisma.UserGetPayload<{}>[] | null>;
    findByPseudo(pseudo: string): Promise<Prisma.UserGetPayload<{}> | null>;
    findAll(): Promise<User[]>;
    updateRole(userId: string, role: UserRole): Promise<User>;
    update(userId: string, data: UpdateUserData): Promise<User>;
    updateLastLogin(userId: string): Promise<Prisma.UserGetPayload<{}>>;
    delete(userId: string): Promise<Prisma.UserGetPayload<{}>>;
    count(): Promise<number>;
    getArticlesCount(userId: string): Promise<number>;
    getLikesCount(userId: string): Promise<number>;
}
export declare const userRepository: UserRepository;
//# sourceMappingURL=user.repository.d.ts.map