/**
 * AdminPage - Single Responsibility: Admin panel access
 * Protected by route guard
 */
import { useNavigate } from 'react-router-dom';
import AdminPage from '@/components/AdminPage';
import { ROUTES } from '@/config/routes.config';

export default function AdminPanelPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(ROUTES.HOME);
  };

  const handleLogout = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <AdminPage 
      onBack={handleBack}
      onLogout={handleLogout}
    />
  );
}
