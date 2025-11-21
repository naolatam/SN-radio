/**
 * Services Index
 * Central export point for all domain services
 */

export * from './auth.service';
export * from './article.service';
export * from './category.service';
export * from './user.service';

// Legacy compatibility
export { articlesService } from './articlesService';
