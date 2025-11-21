/**
 * MainLayout - Single Responsibility: Provide common page structure
 * Following DRY principle - Header and Footer shared across all pages
 * Open/Closed Principle: Open for extension (Outlet), closed for modification
 */
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MainLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </>
  );
}
