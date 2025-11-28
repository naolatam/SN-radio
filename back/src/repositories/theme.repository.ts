import { Prisma, PrismaClient } from '@prisma/client';
import { Theme, CreateThemeDTO, UpdateThemeDTO } from '../types/shared.types';

const prisma = new PrismaClient();

export class ThemeRepository {
  /**
   * Find all themes
   */
  async findAll(): Promise<Theme[]> {
    return await prisma.theme.findMany({
      orderBy: { createdAt: 'desc' }
    }) as unknown as Promise<Theme[]>;
  }

  /**
   * Find active theme
   */
  async findActive(): Promise<Theme | null> {
    return await prisma.theme.findFirst({
      where: { isActive: true }
    }) as unknown as Promise<Theme | null>;
  }

  /**
   * Find theme by ID
   */
  async findById(id: string): Promise<Theme | null> {
    return await prisma.theme.findUnique({
      where: { id }
    }) as unknown as Promise<Theme | null>;
  }

  /**
   * Find theme by slug
   */
  async findBySlug(slug: string): Promise<Theme | null> {
    return await prisma.theme.findUnique({
      where: { slug }
    }) as unknown as Promise<Theme | null>;
  }

  /**
   * Create new theme
   */
  async create(data: CreateThemeDTO): Promise<Theme> {
    return await prisma.theme.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        backgroundColor: data.backgroundColor,
        favicon: data.favicon,
        icon: data.icon,
        logo: data.logo,
        siteName: data.siteName,
        isActive: false
      }
    }) as unknown as Promise<Theme>;
  }

  /**
   * Update theme
   */
  async update(id: string, data: UpdateThemeDTO): Promise<Theme> {
    return await prisma.theme.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.primaryColor && { primaryColor: data.primaryColor }),
        ...(data.secondaryColor && { secondaryColor: data.secondaryColor }),
        ...(data.backgroundColor && { backgroundColor: data.backgroundColor }),
        ...(data.favicon !== undefined && { favicon: data.favicon }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.logo !== undefined && { logo: data.logo }),
        ...(data.siteName && { siteName: data.siteName })
      }
    }) as unknown as Promise<Theme>;
  }

  /**
   * Delete theme
   */
  async delete(id: string): Promise<void> {
    await prisma.theme.delete({
      where: { id }
    });
  }

  /**
   * Set theme as active (deactivates all others)
   */
  async setActive(id: string): Promise<Theme> {
    // Deactivate all themes first
    await prisma.theme.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });

    // Activate the selected theme
    return await prisma.theme.update({
      where: { id },
      data: { isActive: true }
    }) as unknown as Promise<Theme>;
  }

  /**
   * Duplicate a theme
   */
  async duplicate(id: string, newName: string, newSlug: string): Promise<Theme> {
    const original = await this.findById(id);
    if (!original) {
      throw new Error('Theme not found');
    }

    return await prisma.theme.create({
      data: {
        name: newName,
        slug: newSlug,
        description: original.description,
        primaryColor: original.primaryColor,
        secondaryColor: original.secondaryColor,
        backgroundColor: original.backgroundColor,
        favicon: original.favicon,
        icon: original.icon,
        logo: original.logo,
        siteName: original.siteName,
        isActive: false
      }
    }) as unknown as Promise<Theme>;
  }
}

export const themeRepository = new ThemeRepository();
