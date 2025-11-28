"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteConfigController = exports.SiteConfigController = void 0;
const siteConfig_service_1 = require("../services/siteConfig.service");
class SiteConfigController {
    async getActiveConfigs(req, res) {
        try {
            const configs = await siteConfig_service_1.siteConfigService.getActiveConfigs();
            res.json({
                success: true,
                data: configs,
            });
        }
        catch (error) {
            console.error('Error in getActiveConfigs:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    async getAllConfigs(req, res) {
        try {
            const configs = await siteConfig_service_1.siteConfigService.getAllConfigs();
            res.json({
                success: true,
                data: configs,
            });
        }
        catch (error) {
            console.error('Error in getAllConfigs:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    // ============================================
    // Theme endpoints
    // ============================================
    async getTheme(req, res) {
        try {
            const theme = await siteConfig_service_1.siteConfigService.getTheme();
            res.json({
                success: true,
                data: theme,
            });
        }
        catch (error) {
            console.error('Error in getTheme:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    async createTheme(req, res) {
        try {
            const themeData = req.body;
            // Validate required fields
            if (!themeData.primaryColor || !themeData.secondaryColor || !themeData.backgroundColor) {
                res.status(400).json({
                    success: false,
                    error: 'Missing required fields: primaryColor, secondaryColor, backgroundColor',
                });
                return;
            }
            if (!themeData.siteName) {
                res.status(400).json({
                    success: false,
                    error: 'Missing required field: siteName',
                });
                return;
            }
            const theme = await siteConfig_service_1.siteConfigService.createTheme(themeData);
            res.status(201).json({
                success: true,
                data: theme,
                message: 'Theme created successfully',
            });
        }
        catch (error) {
            console.error('Error in createTheme:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    async updateTheme(req, res) {
        try {
            const themeData = req.body;
            const theme = await siteConfig_service_1.siteConfigService.updateTheme(themeData);
            res.json({
                success: true,
                data: theme,
                message: 'Theme updated successfully',
            });
        }
        catch (error) {
            console.error('Error in updateTheme:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}
exports.SiteConfigController = SiteConfigController;
exports.siteConfigController = new SiteConfigController();
//# sourceMappingURL=siteConfig.controller.js.map