"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const getEnvVar = (key, defaultValue) => {
    const value = process.env[key];
    if (!value && !defaultValue) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value || defaultValue;
};
const getOptionalEnvVar = (key) => {
    return process.env[key];
};
exports.config = {
    NODE_ENV: getEnvVar('NODE_ENV', 'development'),
    PORT: parseInt(getEnvVar('PORT', '5000'), 10),
    DATABASE_URL: getEnvVar('DATABASE_URL'),
    BETTER_AUTH_SECRET: getEnvVar('BETTER_AUTH_SECRET'),
    BETTER_AUTH_URL: getEnvVar('BETTER_AUTH_URL'),
    FRONTEND_URL: getEnvVar('FRONTEND_URL', 'http://localhost:3000'),
    API_URL: getEnvVar('API_URL', 'http://localhost:5000'),
    GOOGLE_CLIENT_ID: getOptionalEnvVar('GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: getOptionalEnvVar('GOOGLE_CLIENT_SECRET'),
};
//# sourceMappingURL=env.config.js.map