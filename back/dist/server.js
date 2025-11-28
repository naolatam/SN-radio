"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const auth_config_1 = require("./config/auth.config");
const env_config_1 = require("./config/env.config");
const swagger_config_1 = require("./config/swagger.config");
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
// CORS configuration
app.use((0, cors_1.default)({
    origin: env_config_1.config.FRONTEND_URL,
    credentials: true,
}));
// Body parsing middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Better Auth routes (handles /api/auth/*)
app.all('/api/auth/*', async (req, res) => {
    try {
        // Convert Express request to Web API Request
        const url = new URL(req.url, `${req.protocol}://${req.get('host')}`);
        const webRequest = new globalThis.Request(url, {
            method: req.method,
            headers: req.headers,
            body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
        });
        const response = await auth_config_1.auth.handler(webRequest);
        // Set headers from Better Auth response
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });
        // Set status and send body
        res.status(response.status);
        // Handle different response types
        const body = await response.text();
        res.send(body);
    }
    catch (error) {
        console.error('Better Auth error:', error);
        res.status(500).json({ error: 'Authentication error' });
    }
});
// Swagger API Documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'SN-Radio API Documentation',
}));
// API routes
app.use('/api', routes_1.default);
// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'SN-Radio API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            documentation: '/api-docs',
            auth: '/api/auth/*',
            users: '/api/users',
            articles: '/api/articles',
        },
    });
});
// Error handlers (must be last)
app.use(error_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
// Start server
const PORT = env_config_1.config.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on ${env_config_1.config.API_URL}`);
    console.log(`📝 Environment: ${env_config_1.config.NODE_ENV}`);
    console.log(`🔐 Better Auth URL: ${env_config_1.config.BETTER_AUTH_URL}`);
    console.log(`🌐 Frontend URL: ${env_config_1.config.FRONTEND_URL}`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    process.exit(0);
});
exports.default = app;
//# sourceMappingURL=server.js.map