import { StaffPresenterDTO, CreateStaffDTO, UpdateStaffDTO } from '../types/shared.types';
import { IStaffService } from '../types/service.types';
export declare class StaffService implements IStaffService {
    getAllStaff(): Promise<StaffPresenterDTO[]>;
    getStaffById(staffId: string): Promise<StaffPresenterDTO | null>;
    getStaffByUserId(userId: string): Promise<StaffPresenterDTO | null>;
    createStaff(data: CreateStaffDTO): Promise<StaffPresenterDTO>;
    updateStaff(staffId: string, data: UpdateStaffDTO): Promise<StaffPresenterDTO | null>;
    deleteStaff(staffId: string): Promise<boolean>;
    getStaffCount(): Promise<number>;
    private formatStaffPresenter;
}
export declare const staffService: StaffService;
//# sourceMappingURL=staff.service.d.ts.map