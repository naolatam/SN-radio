/**
 * MinimalLayout - Single Responsibility: Provide minimal layout for standalone pages
 * Following KISS principle - No header/footer for auth/admin pages
 */
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

export default function MinimalLayout() {
  return (
    <>
      <main>
        <Outlet />
      </main>
      <Toaster />
    </>
  );
}
