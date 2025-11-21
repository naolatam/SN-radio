import { siteConfigRepository } from '../repositories/siteConfig.repository';
import { SiteConfig, CreateConfigDTO, UpdateConfigDTO } from '../types/shared.types';
import { ISiteConfigService } from '../types/service.types';

export class SiteConfigService implements ISiteConfigService {
  async getAllConfigs(): Promise<SiteConfig[]> {
    const configs = await siteConfigRepository.findAll();
    return configs.map(config => this.formatConfig(config));
  }

  async getActiveConfigs(): Promise<SiteConfig[]> {
    const configs = await siteConfigRepository.findActive();
    return configs.map(config => this.formatConfig(config));
  }

  async getConfigByKey(key: string): Promise<SiteConfig | null> {
    const config = await siteConfigRepository.findByKey(key);
    if (!config) return null;
    return this.formatConfig(config);
  }

  async getConfigById(id: string): Promise<SiteConfig | null> {
    const config = await siteConfigRepository.findById(id);
    if (!config) return null;
    return this.formatConfig(config);
  }

  async createConfig(data: CreateConfigDTO): Promise<SiteConfig> {
    // Check if key already exists
    const existing = await siteConfigRepository.findByKey(data.key);
    if (existing) {
      throw new Error('Configuration with this key already exists');
    }

    const config = await siteConfigRepository.create(data);
    return this.formatConfig(config);
  }

  async updateConfig(id: string, data: UpdateConfigDTO): Promise<SiteConfig | null> {
    const existing = await siteConfigRepository.findById(id);
    if (!existing) return null;

    const config = await siteConfigRepository.update(id, data);
    return this.formatConfig(config);
  }

  async deleteConfig(id: string): Promise<boolean> {
    const existing = await siteConfigRepository.findById(id);
    if (!existing) return false;

    await siteConfigRepository.delete(id);
    return true;
  }

  async toggleConfigActive(id: string): Promise<SiteConfig | null> {
    const config = await siteConfigRepository.toggleActive(id);
    if (!config) return null;
    return this.formatConfig(config);
  }

  private formatConfig(config: any): SiteConfig {
    return {
      id: config.id,
      key: config.key,
      name: config.name,
      description: config.description || undefined,
      isActive: config.isActive,
      values: config.values.map((value: any) => ({
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

export const siteConfigService = new SiteConfigService();
