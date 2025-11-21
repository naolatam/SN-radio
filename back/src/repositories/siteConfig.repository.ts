import { Prisma } from '@prisma/client';
import prisma from '../config/database.config';
import { CreateConfigDTO, UpdateConfigDTO, ConfigType, SiteConfig } from '../types/shared.types';
import { ISiteConfigRepository, SiteConfigWithValues } from '../types/repository.types';

export class SiteConfigRepository implements ISiteConfigRepository {
  async findAll(): Promise<SiteConfigWithValues[]> {
    return prisma.siteConfig.findMany({
      include: {
        values: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { key: 'asc' },
    });
  }

  async findActive(): Promise<SiteConfigWithValues[]> {
    return prisma.siteConfig.findMany({
      where: { isActive: true },
      include: {
        values: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { key: 'asc' },
    });
  }

  async findByKey(key: string): Promise<SiteConfigWithValues | null> {
    return prisma.siteConfig.findUnique({
      where: { key },
      include: {
        values: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }

  async findById(id: string): Promise<SiteConfigWithValues | null> {
    return prisma.siteConfig.findUnique({
      where: { id },
      include: {
        values: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }

  async create(data: CreateConfigDTO): Promise<SiteConfigWithValues> {
    const { values, ...configData } = data;

    return prisma.siteConfig.create({
      data: {
        ...configData,
        values: {
          create: values.map((value, index) => ({
            ...value,
            displayOrder: value.displayOrder ?? index,
          })),
        },
      },
      include: {
        values: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }

  async update(id: string, data: UpdateConfigDTO): Promise<SiteConfigWithValues> {
    const { values, ...configData } = data;

    // If values are provided, we need to handle them separately
    if (values) {
      // Delete values that are not in the new list
      const newValueIds = values.filter((v) => v.id).map((v) => v.id);
      if (newValueIds.length > 0) {
        await prisma.configValue.deleteMany({
          where: {
            configId: id,
            id: { notIn: newValueIds as string[] },
          },
        });
      }

      // Update existing values and create new ones
      for (const [index, value] of values.entries()) {
        if (value.id) {
          // Update existing
          await prisma.configValue.update({
            where: { id: value.id },
            data: {
              key: value.key,
              value: value.value,
              valueType: value.valueType,
              displayOrder: value.displayOrder ?? index,
            },
          });
        } else {
          // Create new
          await prisma.configValue.create({
            data: {
              configId: id,
              key: value.key,
              value: value.value,
              valueType: value.valueType,
              displayOrder: value.displayOrder ?? index,
            },
          });
        }
      }
    }

    return prisma.siteConfig.update({
      where: { id },
      data: configData,
      include: {
        values: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }

  async delete(id: string): Promise<Prisma.SiteConfigGetPayload<{}>> {
    return prisma.siteConfig.delete({
      where: { id },
    });
  }

  async toggleActive(id: string): Promise<SiteConfigWithValues> {
    const config = await prisma.siteConfig.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!config) throw new Error('Config not found');

    return prisma.siteConfig.update({
      where: { id },
      data: { isActive: !config.isActive },
      include: {
        values: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }
}

export const siteConfigRepository = new SiteConfigRepository();
