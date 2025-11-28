import { IStaffRepository, StaffWithUser, CreateStaffData, UpdateStaffData } from '../types/repository.types';
export declare class StaffRepository implements IStaffRepository {
    findAll(): Promise<StaffWithUser[]>;
    findById(id: string): Promise<StaffWithUser | null>;
    findByUserId(userId: string): Promise<StaffWithUser | null>;
    create(data: CreateStaffData): Promise<StaffWithUser>;
    update(id: string, data: UpdateStaffData): Promise<StaffWithUser>;
    delete(id: string): Promise<void>;
    count(): Promise<number>;
}
export declare const staffRepository: StaffRepository;
//# sourceMappingURL=staff.repository.d.ts.map