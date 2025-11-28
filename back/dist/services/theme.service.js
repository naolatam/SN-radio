"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.themeService = exports.ThemeService = void 0;
const theme_repository_1 = require("../repositories/theme.repository");
class ThemeService {
    /**
     * Get all themes
     */
    async getAllThemes() {
        return await theme_repository_1.themeRepository.findAll();
    }
    /**
     * Get active theme
     */
    async getActiveTheme() {
        return await theme_repository_1.themeRepository.findActive();
    }
    /**
     * Get theme by ID
     */
    async getThemeById(id) {
        return await theme_repository_1.themeRepository.findById(id);
    }
    /**
     * Get theme by slug
     */
    async getThemeBySlug(slug) {
        return await theme_repository_1.themeRepository.findBySlug(slug);
    }
    /**
     * Create new theme
     */
    async createTheme(data) {
        // Validate required fields
        if (!data.name || !data.slug) {
            throw new Error('Name and slug are required');
        }
        if (!data.primaryColor || !data.secondaryColor || !data.backgroundColor) {
            throw new Error('All colors are required');
        }
        if (!data.siteName) {
            throw new Error('Site name is required');
        }
        // Check if slug already exists
        const existing = await theme_repository_1.themeRepository.findBySlug(data.slug);
        if (existing) {
            throw new Error('A theme with this slug already exists');
        }
        return await theme_repository_1.themeRepository.create(data);
    }
    /**
     * Update theme
     */
    async updateTheme(id, data) {
        const existing = await theme_repository_1.themeRepository.findById(id);
        if (!existing) {
            throw new Error('Theme not found');
        }
        // If updating slug, check for conflicts
        if (data.slug && data.slug !== existing.slug) {
            const slugExists = await theme_repository_1.themeRepository.findBySlug(data.slug);
            if (slugExists) {
                throw new Error('A theme with this slug already exists');
            }
        }
        return await theme_repository_1.themeRepository.update(id, data);
    }
    /**
     * Delete theme
     */
    async deleteTheme(id) {
        const existing = await theme_repository_1.themeRepository.findById(id);
        if (!existing) {
            throw new Error('Theme not found');
        }
        if (existing.isActive) {
            throw new Error('Cannot delete active theme. Please activate another theme first.');
        }
        await theme_repository_1.themeRepository.delete(id);
    }
    /**
     * Activate theme
     */
    async activateTheme(id) {
        const existing = await theme_repository_1.themeRepository.findById(id);
        if (!existing) {
            throw new Error('Theme not found');
        }
        return await theme_repository_1.themeRepository.setActive(id);
    }
    /**
     * Duplicate theme
     */
    async duplicateTheme(id, newName, newSlug) {
        // Check if new slug already exists
        const slugExists = await theme_repository_1.themeRepository.findBySlug(newSlug);
        if (slugExists) {
            throw new Error('A theme with this slug already exists');
        }
        return await theme_repository_1.themeRepository.duplicate(id, newName, newSlug);
    }
}
exports.ThemeService = ThemeService;
exports.themeService = new ThemeService();
//# sourceMappingURL=theme.service.js.map