/**
 * OAuthCallbackPage - Single Responsibility: Handle OAuth redirect
 * Following KISS principle
 */
import { useNavigate } from 'react-router-dom';
import OAuthCallback from '@/components/OAuthCallback';
import { ROUTES } from '@/config/routes.config';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(ROUTES.HOME);
  };

  const handleError = () => {
    navigate(ROUTES.AUTH);
  };

  return (
    <OAuthCallback 
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
