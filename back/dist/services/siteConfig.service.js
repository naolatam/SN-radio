"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteConfigService = exports.SiteConfigService = void 0;
const siteConfig_repository_1 = require("../repositories/siteConfig.repository");
const shared_types_1 = require("../types/shared.types");
class SiteConfigService {
    async getAllConfigs() {
        const configs = await siteConfig_repository_1.siteConfigRepository.findAll();
        return configs.map(config => this.formatConfig(config));
    }
    async getActiveConfigs() {
        const configs = await siteConfig_repository_1.siteConfigRepository.findActive();
        return configs.map(config => this.formatConfig(config));
    }
    async getConfigByKey(key) {
        const config = await siteConfig_repository_1.siteConfigRepository.findByKey(key);
        if (!config)
            return null;
        return this.formatConfig(config);
    }
    async getConfigById(id) {
        const config = await siteConfig_repository_1.siteConfigRepository.findById(id);
        if (!config)
            return null;
        return this.formatConfig(config);
    }
    async createConfig(data) {
        // Check if key already exists
        const existing = await siteConfig_repository_1.siteConfigRepository.findByKey(data.key);
        if (existing) {
            throw new Error('Configuration with this key already exists');
        }
        const config = await siteConfig_repository_1.siteConfigRepository.create(data);
        return this.formatConfig(config);
    }
    async updateConfig(id, data) {
        const existing = await siteConfig_repository_1.siteConfigRepository.findById(id);
        if (!existing)
            return null;
        const config = await siteConfig_repository_1.siteConfigRepository.update(id, data);
        return this.formatConfig(config);
    }
    async deleteConfig(id) {
        const existing = await siteConfig_repository_1.siteConfigRepository.findById(id);
        if (!existing)
            return false;
        await siteConfig_repository_1.siteConfigRepository.delete(id);
        return true;
    }
    async toggleConfigActive(id) {
        const config = await siteConfig_repository_1.siteConfigRepository.toggleActive(id);
        if (!config)
            return null;
        return this.formatConfig(config);
    }
    // ============================================
    // Theme-specific methods
    // ============================================
    async getTheme() {
        const configs = await siteConfig_repository_1.siteConfigRepository.findActive();
        const themeConfig = {
            primaryColor: '#007EFF',
            secondaryColor: '#FFBB62',
            backgroundColor: '#12171C',
            favicon: '/favicon.ico',
            icon: '/icon.png',
            logo: '/logo.png',
            siteName: 'SN-Radio'
        };
        configs.forEach((config) => {
            const value = config.values && config.values.length > 0 ? config.values[0].value : null;
            if (!value)
                return;
            switch (config.key) {
                case shared_types_1.CONFIG_KEYS.THEME_PRIMARY_COLOR:
                    themeConfig.primaryColor = value;
                    break;
                case shared_types_1.CONFIG_KEYS.THEME_SECONDARY_COLOR:
                    themeConfig.secondaryColor = value;
                    break;
                case shared_types_1.CONFIG_KEYS.THEME_BACKGROUND_COLOR:
                    themeConfig.backgroundColor = value;
                    break;
                case shared_types_1.CONFIG_KEYS.BRANDING_FAVICON:
                    themeConfig.favicon = value;
                    break;
                case shared_types_1.CONFIG_KEYS.BRANDING_ICON:
                    themeConfig.icon = value;
                    break;
                case shared_types_1.CONFIG_KEYS.BRANDING_LOGO:
                    themeConfig.logo = value;
                    break;
                case shared_types_1.CONFIG_KEYS.SITE_NAME:
                    themeConfig.siteName = value;
                    break;
            }
        });
        return themeConfig;
    }
    async createTheme(data) {
        // Create or update all theme-related configs
        const configsToCreate = [
            { key: shared_types_1.CONFIG_KEYS.THEME_PRIMARY_COLOR, name: 'Primary Color', value: data.primaryColor },
            { key: shared_types_1.CONFIG_KEYS.THEME_SECONDARY_COLOR, name: 'Secondary Color', value: data.secondaryColor },
            { key: shared_types_1.CONFIG_KEYS.THEME_BACKGROUND_COLOR, name: 'Background Color', value: data.backgroundColor },
            { key: shared_types_1.CONFIG_KEYS.BRANDING_FAVICON, name: 'Favicon URL', value: data.favicon },
            { key: shared_types_1.CONFIG_KEYS.BRANDING_ICON, name: 'Icon URL', value: data.icon },
            { key: shared_types_1.CONFIG_KEYS.BRANDING_LOGO, name: 'Logo URL', value: data.logo },
            { key: shared_types_1.CONFIG_KEYS.SITE_NAME, name: 'Site Name', value: data.siteName },
        ];
        for (const configData of configsToCreate) {
            const existing = await siteConfig_repository_1.siteConfigRepository.findByKey(configData.key);
            if (existing) {
                // Update existing
                await siteConfig_repository_1.siteConfigRepository.update(existing.id, {
                    values: [{
                            key: configData.key,
                            value: configData.value,
                            valueType: configData.key.includes('url') || configData.key.includes('favicon') || configData.key.includes('icon') || configData.key.includes('logo')
                                ? shared_types_1.ConfigType.URL
                                : shared_types_1.ConfigType.TEXT,
                            displayOrder: 0
                        }]
                });
            }
            else {
                // Create new
                await siteConfig_repository_1.siteConfigRepository.create({
                    key: configData.key,
                    name: configData.name,
                    description: `Theme configuration: ${configData.name}`,
                    values: [{
                            key: configData.key,
                            value: configData.value,
                            valueType: configData.key.includes('url') || configData.key.includes('favicon') || configData.key.includes('icon') || configData.key.includes('logo')
                                ? shared_types_1.ConfigType.URL
                                : shared_types_1.ConfigType.TEXT,
                            displayOrder: 0
                        }]
                });
            }
        }
        return this.getTheme();
    }
    async updateTheme(data) {
        const updates = [];
        if (data.primaryColor)
            updates.push({ key: shared_types_1.CONFIG_KEYS.THEME_PRIMARY_COLOR, value: data.primaryColor });
        if (data.secondaryColor)
            updates.push({ key: shared_types_1.CONFIG_KEYS.THEME_SECONDARY_COLOR, value: data.secondaryColor });
        if (data.backgroundColor)
            updates.push({ key: shared_types_1.CONFIG_KEYS.THEME_BACKGROUND_COLOR, value: data.backgroundColor });
        if (data.favicon)
            updates.push({ key: shared_types_1.CONFIG_KEYS.BRANDING_FAVICON, value: data.favicon });
        if (data.icon)
            updates.push({ key: shared_types_1.CONFIG_KEYS.BRANDING_ICON, value: data.icon });
        if (data.logo)
            updates.push({ key: shared_types_1.CONFIG_KEYS.BRANDING_LOGO, value: data.logo });
        if (data.siteName)
            updates.push({ key: shared_types_1.CONFIG_KEYS.SITE_NAME, value: data.siteName });
        for (const update of updates) {
            const existing = await siteConfig_repository_1.siteConfigRepository.findByKey(update.key);
            if (existing) {
                await siteConfig_repository_1.siteConfigRepository.update(existing.id, {
                    values: [{
                            key: update.key,
                            value: update.value,
                            valueType: update.key.includes('url') || update.key.includes('favicon') || update.key.includes('icon') || update.key.includes('logo')
                                ? shared_types_1.ConfigType.URL
                                : shared_types_1.ConfigType.TEXT,
                            displayOrder: 0
                        }]
                });
            }
        }
        return this.getTheme();
    }
    formatConfig(config) {
        return {
            id: config.id,
            key: config.key,
            name: config.name,
            description: config.description || undefined,
            isActive: config.isActive,
            values: config.values.map((value) => ({
                id: value.id,
                key: value.key,
                value: value.value,
                valueType: value.valueType,
                displayOrder: value.displayOrder,
            })),
            createdAt: config.createdAt.toISOString(),
            updatedAt: config.updatedAt.toISOString(),
        };
    }
}
exports.SiteConfigService = SiteConfigService;
exports.siteConfigService = new SiteConfigService();
//# sourceMappingURL=siteConfig.service.js.map