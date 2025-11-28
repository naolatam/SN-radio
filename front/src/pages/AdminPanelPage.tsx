/**
 * AdminPage - Single Responsibility: Admin panel access
 * Protected by route guard
 */
import { useNavigate } from 'react-router-dom';
import AdminPage from '@/components/AdminPage';
import { ROUTES } from '@/config/routes.config';
import { useAuth } from '@/components/AuthContext';
import { toast } from 'sonner';

export default function AdminPanelPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleBack = () => {
    navigate(ROUTES.HOME);
  };

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
  };


  return (
    <AdminPage 
      onBack={handleBack}
      onLogout={handleLogout}
    />
  );
}
