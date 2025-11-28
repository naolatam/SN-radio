"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteConfigRepository = exports.SiteConfigRepository = void 0;
const database_config_1 = __importDefault(require("../config/database.config"));
class SiteConfigRepository {
    async findAll() {
        return database_config_1.default.siteConfig.findMany({
            include: {
                values: {
                    orderBy: { displayOrder: 'asc' },
                },
            },
            orderBy: { key: 'asc' },
        });
    }
    async findActive() {
        return database_config_1.default.siteConfig.findMany({
            where: { isActive: true },
            include: {
                values: {
                    orderBy: { displayOrder: 'asc' },
                },
            },
            orderBy: { key: 'asc' },
        });
    }
    async findByKey(key) {
        return database_config_1.default.siteConfig.findUnique({
            where: { key },
            include: {
                values: {
                    orderBy: { displayOrder: 'asc' },
                },
            },
        });
    }
    async findById(id) {
        return database_config_1.default.siteConfig.findUnique({
            where: { id },
            include: {
                values: {
                    orderBy: { displayOrder: 'asc' },
                },
            },
        });
    }
    async create(data) {
        const { values, ...configData } = data;
        return database_config_1.default.siteConfig.create({
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
    async update(id, data) {
        const { values, ...configData } = data;
        // If values are provided, we need to handle them separately
        if (values) {
            // Delete values that are not in the new list
            const newValueIds = values.filter((v) => v.id).map((v) => v.id);
            if (newValueIds.length > 0) {
                await database_config_1.default.configValue.deleteMany({
                    where: {
                        configId: id,
                        id: { notIn: newValueIds },
                    },
                });
            }
            // Update existing values and create new ones
            for (const [index, value] of values.entries()) {
                if (value.id) {
                    // Update existing
                    await database_config_1.default.configValue.update({
                        where: { id: value.id },
                        data: {
                            key: value.key,
                            value: value.value,
                            valueType: value.valueType,
                            displayOrder: value.displayOrder ?? index,
                        },
                    });
                }
                else {
                    // Create new
                    await database_config_1.default.configValue.create({
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
        return database_config_1.default.siteConfig.update({
            where: { id },
            data: configData,
            include: {
                values: {
                    orderBy: { displayOrder: 'asc' },
                },
            },
        });
    }
    async delete(id) {
        return database_config_1.default.siteConfig.delete({
            where: { id },
        });
    }
    async toggleActive(id) {
        const config = await database_config_1.default.siteConfig.findUnique({
            where: { id },
            select: { isActive: true },
        });
        if (!config)
            throw new Error('Config not found');
        return database_config_1.default.siteConfig.update({
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
exports.SiteConfigRepository = SiteConfigRepository;
exports.siteConfigRepository = new SiteConfigRepository();
//# sourceMappingURL=siteConfig.repository.js.map