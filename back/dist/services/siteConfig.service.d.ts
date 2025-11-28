import { SiteConfig, CreateConfigDTO, UpdateConfigDTO, ThemeConfigDTO, CreateThemeDTO, UpdateThemeDTO } from '../types/shared.types';
import { ISiteConfigService } from '../types/service.types';
export declare class SiteConfigService implements ISiteConfigService {
    getAllConfigs(): Promise<SiteConfig[]>;
    getActiveConfigs(): Promise<SiteConfig[]>;
    getConfigByKey(key: string): Promise<SiteConfig | null>;
    getConfigById(id: string): Promise<SiteConfig | null>;
    createConfig(data: CreateConfigDTO): Promise<SiteConfig>;
    updateConfig(id: string, data: UpdateConfigDTO): Promise<SiteConfig | null>;
    deleteConfig(id: string): Promise<boolean>;
    toggleConfigActive(id: string): Promise<SiteConfig | null>;
    getTheme(): Promise<ThemeConfigDTO>;
    createTheme(data: CreateThemeDTO): Promise<ThemeConfigDTO>;
    updateTheme(data: UpdateThemeDTO): Promise<ThemeConfigDTO>;
    private formatConfig;
}
export declare const siteConfigService: SiteConfigService;
//# sourceMappingURL=siteConfig.service.d.ts.map