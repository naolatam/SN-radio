"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const prisma_1 = require("better-auth/adapters/prisma");
const database_config_1 = __importDefault(require("./database.config"));
const env_config_1 = require("./env.config");
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, prisma_1.prismaAdapter)(database_config_1.default, {
        provider: 'mysql',
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Set to true in production with email service
    },
    socialProviders: {
        google: {
            clientId: env_config_1.config.GOOGLE_CLIENT_ID || '',
            clientSecret: env_config_1.config.GOOGLE_CLIENT_SECRET || '',
            enabled: !!(env_config_1.config.GOOGLE_CLIENT_ID && env_config_1.config.GOOGLE_CLIENT_SECRET),
        },
        // You can add more providers here:
        // github: { ... },
        // facebook: { ... },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },
    secret: env_config_1.config.BETTER_AUTH_SECRET,
    baseURL: env_config_1.config.BETTER_AUTH_URL,
    trustedOrigins: [env_config_1.config.FRONTEND_URL],
    advanced: {
        useSecureCookies: env_config_1.config.NODE_ENV === 'production',
    },
});
//# sourceMappingURL=auth.config.js.map