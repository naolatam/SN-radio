import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { auth } from './config/auth.config';
import { config } from './config/env.config';
import { swaggerSpec } from './config/swagger.config';
import apiRoutes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Better Auth routes (handles /api/auth/*)
app.all('/api/auth/*', async (req: Request, res: Response) => {
  try {
    // Convert Express request to Web API Request
    const url = new URL(req.url, `${req.protocol}://${req.get('host')}`);
    
    const webRequest = new globalThis.Request(url, {
      method: req.method,
      headers: req.headers as Record<string, string>,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    const response = await auth.handler(webRequest);
    
    // Set headers from Better Auth response
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    // Set status and send body
    res.status(response.status);
    
    // Handle different response types
    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error('Better Auth error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
});

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SN-Radio API Documentation',
}));

// API routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
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
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = config.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on ${config.API_URL}`);
  console.log(`📝 Environment: ${config.NODE_ENV}`);
  console.log(`🔐 Better Auth URL: ${config.BETTER_AUTH_URL}`);
  console.log(`🌐 Frontend URL: ${config.FRONTEND_URL}`);
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

export default app;
