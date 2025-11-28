import { Theme, CreateThemeDTO, UpdateThemeDTO } from '../types/shared.types';
export declare class ThemeRepository {
    /**
     * Find all themes
     */
    findAll(): Promise<Theme[]>;
    /**
     * Find active theme
     */
    findActive(): Promise<Theme | null>;
    /**
     * Find theme by ID
     */
    findById(id: string): Promise<Theme | null>;
    /**
     * Find theme by slug
     */
    findBySlug(slug: string): Promise<Theme | null>;
    /**
     * Create new theme
     */
    create(data: CreateThemeDTO): Promise<Theme>;
    /**
     * Update theme
     */
    update(id: string, data: UpdateThemeDTO): Promise<Theme>;
    /**
     * Delete theme
     */
    delete(id: string): Promise<void>;
    /**
     * Set theme as active (deactivates all others)
     */
    setActive(id: string): Promise<Theme>;
    /**
     * Duplicate a theme
     */
    duplicate(id: string, newName: string, newSlug: string): Promise<Theme>;
}
export declare const themeRepository: ThemeRepository;
//# sourceMappingURL=theme.repository.d.ts.map