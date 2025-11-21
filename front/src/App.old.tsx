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
import { Toaster } from './components/ui/sonner';
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
        <Route path={ROUTES.NEWS_ARTICLE} element={<NewsListPage />} />
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


  // OAuth callback page
  if (showOAuthCallback) {
    return (
      <OAuthCallback 
        onSuccess={resetToHome}
        onError={resetToHome}
      />
    );
  }

  // Si la page admin est sélectionnée et l'utilisateur est admin
  if (showAdminPage && (user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF)) {
    return (
      <>
        <AdminPage 
          onBack={resetToHome}
          onLogout={handleAdminLogout}
        />
        <Toaster />
      </>
    );
  }

  // Si la page d'authentification utilisateur est sélectionnée
  if (showUserAuthPage) {
    return (
      <>
        <Header 
          onNewsClick={() => setShowNewsPage(true)}
          onUserAuthClick={() => setShowUserAuthPage(true)}
          onAdminAccess={handleAdminAccess}
          onHomeClick={handleHomeClick}
          onTeamClick={handleTeamClick}
        />
        <UserAuth 
          onBack={resetToHome}
          onSuccess={resetToHome}
        />
        <Toaster />
      </>
    );
  }

  // Si une page légale est sélectionnée, l'afficher
  if (currentLegalPage) {
    return (
      <>
        <Header 
          onNewsClick={() => setShowNewsPage(true)}
          onUserAuthClick={() => setShowUserAuthPage(true)}
          onAdminAccess={handleAdminAccess}
          onHomeClick={handleHomeClick}
          onTeamClick={handleTeamClick}
        />
        <LegalPages 
          currentPage={currentLegalPage} 
          onBack={() => setCurrentLegalPage(null)} 
        />
        <Toaster />
      </>
    );
  }

  // Si la page actualités est sélectionnée, l'afficher
  if (showNewsPage) {
    return (
      <>
        <Header 
          onNewsClick={() => setShowNewsPage(true)}
          onUserAuthClick={() => setShowUserAuthPage(true)}
          onAdminAccess={handleAdminAccess}
          onHomeClick={handleHomeClick}
          onTeamClick={handleTeamClick}
        />
        <NewsPage 
          onBack={() => {
            setShowNewsPage(false);
            setSelectedArticleId(undefined);
          }} 
          initialArticleId={selectedArticleId}
          articles={articles}
        />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen" style={{background: themeColors.backgroundGradient}}>
      <Header 
        onNewsClick={() => setShowNewsPage(true)}
        onUserAuthClick={() => setShowUserAuthPage(true)}
        onAdminAccess={handleAdminAccess}
        onHomeClick={handleHomeClick}
        onTeamClick={handleTeamClick}
      />
      
      {/* Hero Section */}
      <section id="accueil" className="pt-20 pb-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
              Bienvenue sur SN-Radio
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6 md:mb-8 px-2">
              Votre radio en ligne préférée. Écoutez vos émissions favorites, découvrez de nouveaux podcasts 
              et restez connectés avec notre équipe passionnée.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {/* Audio Player - Takes 2 columns on large screens */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <AudioPlayer />
            </motion.div>

            {/* Now Playing - Takes 1 column */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <NowPlaying />
            </motion.div>
          </div>

          {/* Floating Animation Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/4 left-10 w-4 h-4 rounded-full"
              style={{ backgroundColor: '#007EFF20' }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute top-1/2 right-20 w-6 h-6 rounded-full"
              style={{ backgroundColor: '#FFBB6220' }}
              animate={{
                y: [0, 30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
            <motion.div
              className="absolute bottom-1/4 left-1/3 w-3 h-3 rounded-full"
              style={{ backgroundColor: '#CE8E2030' }}
              animate={{
                y: [0, -15, 0],
                x: [0, 10, 0],
                opacity: [0.4, 0.9, 0.4],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </div>
        </div>
      </section>

      {/* News */}
      <section id="actualites">
        <NewsSection 
          onNewsClick={() => setShowNewsPage(true)}
          onArticleClick={(articleId) => {
            setSelectedArticleId(articleId);
            setShowNewsPage(true);
          }}
          articles={articles}
        />
      </section>

      {/* Team */}
      <section id="equipe">
        <TeamSection />
      </section>

      {/* Footer */}
      <Footer onLegalPageClick={setCurrentLegalPage} />

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <AudioProvider>
            <MainApp />
            <FloatingPlayer />
          </AudioProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  );
}
