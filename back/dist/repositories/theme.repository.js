"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.themeRepository = exports.ThemeRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ThemeRepository {
    /**
     * Find all themes
     */
    async findAll() {
        return await prisma.theme.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }
    /**
     * Find active theme
     */
    async findActive() {
        return await prisma.theme.findFirst({
            where: { isActive: true }
        });
    }
    /**
     * Find theme by ID
     */
    async findById(id) {
        return await prisma.theme.findUnique({
            where: { id }
        });
    }
    /**
     * Find theme by slug
     */
    async findBySlug(slug) {
        return await prisma.theme.findUnique({
            where: { slug }
        });
    }
    /**
     * Create new theme
     */
    async create(data) {
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
        });
    }
    /**
     * Update theme
     */
    async update(id, data) {
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
        });
    }
    /**
     * Delete theme
     */
    async delete(id) {
        await prisma.theme.delete({
            where: { id }
        });
    }
    /**
     * Set theme as active (deactivates all others)
     */
    async setActive(id) {
        // Deactivate all themes first
        await prisma.theme.updateMany({
            where: { isActive: true },
            data: { isActive: false }
        });
        // Activate the selected theme
        return await prisma.theme.update({
            where: { id },
            data: { isActive: true }
        });
    }
    /**
     * Duplicate a theme
     */
    async duplicate(id, newName, newSlug) {
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
        });
    }
}
exports.ThemeRepository = ThemeRepository;
exports.themeRepository = new ThemeRepository();
//# sourceMappingURL=theme.repository.js.map