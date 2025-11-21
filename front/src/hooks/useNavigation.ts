/**
 * useNavigation - Custom hook for navigation logic
 * Following DRY principle - centralized navigation logic
 * Single Responsibility: Handle all navigation concerns
 */
import { useNavigate } from 'react-router-dom';
import { ROUTES, buildArticleRoute, buildLegalRoute } from '@/config/routes.config';

export function useNavigation() {
  const navigate = useNavigate();

  return {
    // Home navigation
    goHome: () => navigate(ROUTES.HOME),
    
    // News navigation
    goToNews: () => navigate(ROUTES.NEWS),
    goToArticle: (articleId: string) => navigate(buildArticleRoute(articleId)),
    
    // Auth navigation
    goToAuth: () => navigate(ROUTES.AUTH),
    
    // Admin navigation
    goToAdmin: () => navigate(ROUTES.ADMIN),
    
    // Legal navigation
    goToLegal: (page: 'mentions' | 'privacy' | 'terms') => navigate(buildLegalRoute(page)),
    
    // Generic navigation
    goTo: (path: string) => navigate(path),
    goBack: () => navigate(-1),
    
    // Scroll to section (for home page)
    scrollToSection: (sectionId: string) => {
      // First navigate to home
      navigate(ROUTES.HOME);
      // Then scroll after a brief delay to allow page load
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    },
  };
}
