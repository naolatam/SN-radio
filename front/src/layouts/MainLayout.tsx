/**
 * MainLayout - Single Responsibility: Provide common page structure
 * Following DRY principle - Header and Footer shared across all pages
 * Open/Closed Principle: Open for extension (Outlet), closed for modification
 */
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useThemeManager } from '@/components/ThemeManagerContext';

export default function MainLayout() {
  const { theme } = useThemeManager();
  
  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh' }}>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
