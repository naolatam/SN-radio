import { Response } from 'express';
import { AuthRequest } from '../types/controller.types';
export declare class UserController {
    getProfile(req: AuthRequest, res: Response): Promise<void>;
    updateProfile(req: AuthRequest, res: Response): Promise<void>;
    getAllUsers(req: AuthRequest, res: Response): Promise<void>;
    getUsersByName(req: AuthRequest, res: Response): Promise<void>;
    updateUserRole(req: AuthRequest, res: Response): Promise<void>;
    deleteUser(req: AuthRequest, res: Response): Promise<void>;
}
export declare const userController: UserController;
//# sourceMappingURL=user.controller.d.ts.map