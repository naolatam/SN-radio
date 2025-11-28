import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env.config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SN-Radio API Documentation',
      version: '1.0.0',
      description: 'REST API documentation for SN-Radio platform - A radio streaming and news management system',
      contact: {
        name: 'SN-Radio Team',
        email: 'contact@snradio.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: config.BETTER_AUTH_URL || 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your BetterAuth session token',
        },
        CookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'better-auth.session_token',
          description: 'Session cookie from BetterAuth',
        },
      },
      schemas: {
        Session: {
          type: 'object',
          properties: {
            session: {
              type: 'object',
              properties: {
                token: { type: 'string' },
                expiresAt: { type: 'string', format: 'date-time' },
              },
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                email: { type: 'string', format: 'email' },
                emailVerified: { type: 'boolean' },
                pseudo: { type: 'string' },
                picture: { type: 'string', format: 'uri', nullable: true },
                role: { $ref: '#/components/schemas/UserRole' },
                createdAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
        UserRole: {
          type: 'string',
          enum: ['ADMIN', 'STAFF', 'MEMBER'],
          description: 'User role in the system',
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            pseudo: { type: 'string' },
            email: { type: 'string', format: 'email' },
            emailVerified: { type: 'boolean' },
            picture: { type: 'string', format: 'uri', nullable: true },
            description: { type: 'string', nullable: true },
            role: { $ref: '#/components/schemas/UserRole' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            lastLogin: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        UserProfile: {
          allOf: [
            { $ref: '#/components/schemas/User' },
            {
              type: 'object',
              properties: {
                articlesCount: { type: 'integer' },
                likesCount: { type: 'integer' },
              },
            },
          ],
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            slug: { type: 'string' },
          },
        },
        Article: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            resume: { type: 'string' },
            content: { type: 'string', description: 'Markdown content' },
            contentHtml: { type: 'string', description: 'Sanitized HTML output' },
            pictureUrl: { type: 'string', format: 'uri', nullable: true },
            isHeadline: { type: 'boolean' },
            publishedAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            authorId: { type: 'string', format: 'uuid' },
            author: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                pseudo: { type: 'string' },
                picture: { type: 'string', format: 'uri', nullable: true },
                role: { $ref: '#/components/schemas/UserRole' },
              },
            },
            categories: {
              type: 'array',
              items: { $ref: '#/components/schemas/Category' },
            },
            likes: { type: 'integer' },
            likedBy: {
              type: 'array',
              items: { type: 'string', format: 'uuid' },
            },
          },
        },
        CreateArticleDTO: {
          type: 'object',
          required: ['title', 'resume', 'content', 'categoryIds'],
          properties: {
            title: { type: 'string', minLength: 1, maxLength: 255 },
            resume: { type: 'string', minLength: 1, maxLength: 500 },
            content: { type: 'string', minLength: 1, description: 'Markdown content' },
            pictureUrl: { type: 'string', format: 'uri' },
            isHeadline: { type: 'boolean', default: false },
            categoryIds: {
              type: 'array',
              items: { type: 'string', format: 'uuid' },
              minItems: 1,
            },
          },
        },
        UpdateArticleDTO: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 1, maxLength: 255 },
            resume: { type: 'string', minLength: 1, maxLength: 500 },
            content: { type: 'string', minLength: 1, description: 'Markdown content' },
            pictureUrl: { type: 'string', format: 'uri' },
            isHeadline: { type: 'boolean' },
            categoryIds: {
              type: 'array',
              items: { type: 'string', format: 'uuid' },
              minItems: 1,
            },
          },
        },
        CreateCategoryDTO: {
          type: 'object',
          required: ['name', 'slug'],
          properties: {
            name: { type: 'string', minLength: 1 },
            slug: { type: 'string', minLength: 1, pattern: '^[a-z0-9-]+$' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
          },
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: 'System health check endpoints',
      },
      {
        name: 'Authentication',
        description: 'BetterAuth authentication endpoints - OAuth, session management, and user registration',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Articles',
        description: 'Article/News management endpoints',
      },
      {
        name: 'Categories',
        description: 'Category management endpoints',
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
