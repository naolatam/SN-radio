/**
 * App - Single Responsibility: Application entry point and routing
 * Following SOLID principles:
 * - Single Responsibility: Only handles routing and provider setup
 * - Open/Closed: Open for new routes, closed for modification
 * - Dependency Inversion: Depends on abstractions (Router, Providers)
 * 
 * Following DRY: No repeated Header/Footer thanks to layouts
 * Following KISS: Simple, declarative routing structure
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AudioProvider } from './components/AudioContext';
import { AuthProvider } from './components/AuthContext';
import { TooltipProvider } from './components/ui/tooltip';
import { ThemeProvider } from './components/ThemeContext';
import FloatingPlayer from './components/FloatingPlayer';
import ProtectedRoute from './components/routing/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import MinimalLayout from './layouts/MinimalLayout';
import HomePage from './pages/HomePage';
import NewsListPage from './pages/NewsListPage';
import ArticlePage from './pages/ArticlePage';
import AuthPage from './pages/AuthPage';
import AdminPanelPage from './pages/AdminPanelPage';
import LegalPage from './pages/LegalPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import { ROUTES } from './config/routes.config';
import { UserRole } from './types/shared.types';

function AppRoutes() {
  return (
    <Routes>
      {/* Routes with Main Layout (Header + Footer) */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.NEWS} element={<NewsListPage />} />
        <Route path={ROUTES.NEWS_ARTICLE} element={<ArticlePage />} />
        <Route path="/legal/:type" element={<LegalPage />} />
      </Route>

      {/* Routes with Minimal Layout (No Header/Footer) */}
      <Route element={<MinimalLayout />}>
        <Route path={ROUTES.AUTH} element={<AuthPage />} />
        <Route path={ROUTES.AUTH_CALLBACK} element={<OAuthCallbackPage />} />
        
        {/* Protected Admin Route */}
        <Route 
          path={ROUTES.ADMIN} 
          element={
            <ProtectedRoute requireRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <AdminPanelPage />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Fallback - Redirect to home */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <AudioProvider>
              <AppRoutes />
              <FloatingPlayer />
            </AudioProvider>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </BrowserRouter>
  );
}
