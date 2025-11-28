import { Prisma } from '@prisma/client';
import { CreateConfigDTO, UpdateConfigDTO } from '../types/shared.types';
import { ISiteConfigRepository, SiteConfigWithValues } from '../types/repository.types';
export declare class SiteConfigRepository implements ISiteConfigRepository {
    findAll(): Promise<SiteConfigWithValues[]>;
    findActive(): Promise<SiteConfigWithValues[]>;
    findByKey(key: string): Promise<SiteConfigWithValues | null>;
    findById(id: string): Promise<SiteConfigWithValues | null>;
    create(data: CreateConfigDTO): Promise<SiteConfigWithValues>;
    update(id: string, data: UpdateConfigDTO): Promise<SiteConfigWithValues>;
    delete(id: string): Promise<Prisma.SiteConfigGetPayload<{}>>;
    toggleActive(id: string): Promise<SiteConfigWithValues>;
}
export declare const siteConfigRepository: SiteConfigRepository;
//# sourceMappingURL=siteConfig.repository.d.ts.map