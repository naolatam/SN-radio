"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.themeController = exports.ThemeController = void 0;
const theme_service_1 = require("../services/theme.service");
class ThemeController {
    /**
     * GET /api/themes
     * Get all themes
     */
    async getAllThemes(req, res) {
        try {
            const themes = await theme_service_1.themeService.getAllThemes();
            const response = {
                success: true,
                data: themes
            };
            return res.status(200).json(response);
        }
        catch (error) {
            console.error('Error fetching themes:', error);
            const response = {
                success: false,
                error: 'Failed to fetch themes'
            };
            return res.status(500).json(response);
        }
    }
    /**
     * GET /api/themes/active
     * Get active theme
     */
    async getActiveTheme(req, res) {
        try {
            const theme = await theme_service_1.themeService.getActiveTheme();
            if (!theme) {
                const response = {
                    success: false,
                    error: 'No active theme found'
                };
                return res.status(404).json(response);
            }
            const response = {
                success: true,
                data: theme
            };
            return res.status(200).json(response);
        }
        catch (error) {
            console.error('Error fetching active theme:', error);
            const response = {
                success: false,
                error: 'Failed to fetch active theme'
            };
            return res.status(500).json(response);
        }
    }
    /**
     * GET /api/themes/:id
     * Get theme by ID
     */
    async getThemeById(req, res) {
        try {
            const { id } = req.params;
            const theme = await theme_service_1.themeService.getThemeById(id);
            if (!theme) {
                const response = {
                    success: false,
                    error: 'Theme not found'
                };
                return res.status(404).json(response);
            }
            const response = {
                success: true,
                data: theme
            };
            return res.status(200).json(response);
        }
        catch (error) {
            console.error('Error fetching theme:', error);
            const response = {
                success: false,
                error: 'Failed to fetch theme'
            };
            return res.status(500).json(response);
        }
    }
    /**
     * POST /api/themes
     * Create new theme
     */
    async createTheme(req, res) {
        try {
            const data = req.body;
            // Validate required fields
            if (!data.name || !data.slug || !data.primaryColor || !data.secondaryColor || !data.backgroundColor || !data.siteName) {
                const response = {
                    success: false,
                    error: 'Missing required fields: name, slug, primaryColor, secondaryColor, backgroundColor, siteName'
                };
                return res.status(400).json(response);
            }
            const theme = await theme_service_1.themeService.createTheme(data);
            const response = {
                success: true,
                data: theme,
                message: 'Theme created successfully'
            };
            return res.status(201).json(response);
        }
        catch (error) {
            console.error('Error creating theme:', error);
            const response = {
                success: false,
                error: error.message || 'Failed to create theme'
            };
            return res.status(400).json(response);
        }
    }
    /**
     * PUT /api/themes/:id
     * Update theme
     */
    async updateTheme(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const theme = await theme_service_1.themeService.updateTheme(id, data);
            const response = {
                success: true,
                data: theme,
                message: 'Theme updated successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            console.error('Error updating theme:', error);
            const response = {
                success: false,
                error: error.message || 'Failed to update theme'
            };
            return res.status(400).json(response);
        }
    }
    /**
     * DELETE /api/themes/:id
     * Delete theme
     */
    async deleteTheme(req, res) {
        try {
            const { id } = req.params;
            await theme_service_1.themeService.deleteTheme(id);
            const response = {
                success: true,
                message: 'Theme deleted successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            console.error('Error deleting theme:', error);
            const response = {
                success: false,
                error: error.message || 'Failed to delete theme'
            };
            return res.status(400).json(response);
        }
    }
    /**
     * POST /api/themes/:id/activate
     * Activate theme
     */
    async activateTheme(req, res) {
        try {
            const { id } = req.params;
            const theme = await theme_service_1.themeService.activateTheme(id);
            const response = {
                success: true,
                data: theme,
                message: 'Theme activated successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            console.error('Error activating theme:', error);
            const response = {
                success: false,
                error: error.message || 'Failed to activate theme'
            };
            return res.status(400).json(response);
        }
    }
    /**
     * POST /api/themes/:id/duplicate
     * Duplicate theme
     */
    async duplicateTheme(req, res) {
        try {
            const { id } = req.params;
            const { name, slug } = req.body;
            if (!name || !slug) {
                const response = {
                    success: false,
                    error: 'Name and slug are required for duplication'
                };
                return res.status(400).json(response);
            }
            const theme = await theme_service_1.themeService.duplicateTheme(id, name, slug);
            const response = {
                success: true,
                data: theme,
                message: 'Theme duplicated successfully'
            };
            return res.status(201).json(response);
        }
        catch (error) {
            console.error('Error duplicating theme:', error);
            const response = {
                success: false,
                error: error.message || 'Failed to duplicate theme'
            };
            return res.status(400).json(response);
        }
    }
}
exports.ThemeController = ThemeController;
exports.themeController = new ThemeController();
//# sourceMappingURL=theme.controller.js.map