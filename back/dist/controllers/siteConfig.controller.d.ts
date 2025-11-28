import { Request, Response } from 'express';
export declare class SiteConfigController {
    getActiveConfigs(req: Request, res: Response): Promise<void>;
    getAllConfigs(req: Request, res: Response): Promise<void>;
    getTheme(req: Request, res: Response): Promise<void>;
    createTheme(req: Request, res: Response): Promise<void>;
    updateTheme(req: Request, res: Response): Promise<void>;
}
export declare const siteConfigController: SiteConfigController;
//# sourceMappingURL=siteConfig.controller.d.ts.map