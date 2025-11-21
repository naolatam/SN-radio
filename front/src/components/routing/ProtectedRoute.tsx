/**
 * ProtectedRoute - Single Responsibility: Guard routes based on authentication
 * Following Open/Closed Principle: Can be extended for different permission levels
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import { UserRole } from '@/types/shared.types';
import { ROUTES } from '@/config/routes.config';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * ProtectedRoute component that guards routes based on authentication and roles
 * 
 * @param children - The component to render if access is granted
 * @param requireAuth - Whether authentication is required (default: true)
 * @param requireRoles - Array of roles that have access (optional)
 * @param redirectTo - Where to redirect if access is denied (default: home or auth)
 */
export default function ProtectedRoute({ 
  children, 
  requireAuth = true,
  requireRoles,
  redirectTo 
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo || ROUTES.AUTH} replace />;
  }

  // Check role-based access
  if (requireRoles && requireRoles.length > 0) {
    if (!user || !requireRoles.includes(user.role)) {
      return <Navigate to={redirectTo || ROUTES.HOME} replace />;
    }
  }

  return <>{children}</>;
}
