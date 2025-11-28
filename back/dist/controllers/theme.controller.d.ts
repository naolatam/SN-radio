import { Request, Response } from 'express';
export declare class ThemeController {
    /**
     * GET /api/themes
     * Get all themes
     */
    getAllThemes(req: Request, res: Response): Promise<Response>;
    /**
     * GET /api/themes/active
     * Get active theme
     */
    getActiveTheme(req: Request, res: Response): Promise<Response>;
    /**
     * GET /api/themes/:id
     * Get theme by ID
     */
    getThemeById(req: Request, res: Response): Promise<Response>;
    /**
     * POST /api/themes
     * Create new theme
     */
    createTheme(req: Request, res: Response): Promise<Response>;
    /**
     * PUT /api/themes/:id
     * Update theme
     */
    updateTheme(req: Request, res: Response): Promise<Response>;
    /**
     * DELETE /api/themes/:id
     * Delete theme
     */
    deleteTheme(req: Request, res: Response): Promise<Response>;
    /**
     * POST /api/themes/:id/activate
     * Activate theme
     */
    activateTheme(req: Request, res: Response): Promise<Response>;
    /**
     * POST /api/themes/:id/duplicate
     * Duplicate theme
     */
    duplicateTheme(req: Request, res: Response): Promise<Response>;
}
export declare const themeController: ThemeController;
//# sourceMappingURL=theme.controller.d.ts.map