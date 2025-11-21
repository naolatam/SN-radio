/**
 * AuthPage - Single Responsibility: Handle user authentication
 * Following KISS principle
 */
import { useNavigate } from 'react-router-dom';
import UserAuth from '@/components/UserAuth';
import { ROUTES } from '@/config/routes.config';

export default function AuthPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(ROUTES.HOME);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <UserAuth 
      onBack={handleBack}
      onSuccess={handleSuccess}
    />
  );
}
