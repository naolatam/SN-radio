/**
 * Centralized route configuration
 * Following DRY principle - all route paths defined in one place
 */

export const ROUTES = {
  HOME: '/',
  NEWS: '/news',
  NEWS_ARTICLE: '/news/:articleId',
  LIKED: '/liked',
  AUTH: '/auth',
  AUTH_CALLBACK: '/auth/callback',
  ADMIN: '/admin',
  LEGAL_MENTIONS: '/legal/mentions',
  LEGAL_PRIVACY: '/legal/privacy',
  LEGAL_TERMS: '/legal/terms',
} as const;

/**
 * Helper function to build article detail route
 */
export const buildArticleRoute = (articleId: string): string => {
  return ROUTES.NEWS_ARTICLE.replace(':articleId', articleId);
};

/**
 * Helper function to build legal route
 */
export const buildLegalRoute = (page: 'mentions' | 'privacy' | 'terms'): string => {
  switch (page) {
    case 'mentions':
      return ROUTES.LEGAL_MENTIONS;
    case 'privacy':
      return ROUTES.LEGAL_PRIVACY;
    case 'terms':
      return ROUTES.LEGAL_TERMS;
  }
};
