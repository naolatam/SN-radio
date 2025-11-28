import { Theme, CreateThemeDTO, UpdateThemeDTO } from '../types/shared.types';
export declare class ThemeService {
    /**
     * Get all themes
     */
    getAllThemes(): Promise<Theme[]>;
    /**
     * Get active theme
     */
    getActiveTheme(): Promise<Theme | null>;
    /**
     * Get theme by ID
     */
    getThemeById(id: string): Promise<Theme | null>;
    /**
     * Get theme by slug
     */
    getThemeBySlug(slug: string): Promise<Theme | null>;
    /**
     * Create new theme
     */
    createTheme(data: CreateThemeDTO): Promise<Theme>;
    /**
     * Update theme
     */
    updateTheme(id: string, data: UpdateThemeDTO): Promise<Theme>;
    /**
     * Delete theme
     */
    deleteTheme(id: string): Promise<void>;
    /**
     * Activate theme
     */
    activateTheme(id: string): Promise<Theme>;
    /**
     * Duplicate theme
     */
    duplicateTheme(id: string, newName: string, newSlug: string): Promise<Theme>;
}
export declare const themeService: ThemeService;
//# sourceMappingURL=theme.service.d.ts.map