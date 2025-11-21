/**
 * LegalPage - Single Responsibility: Display legal content
 * Following DRY principle - single component for all legal pages
 */
import { useParams, useNavigate } from 'react-router-dom';
import LegalPages from '@/components/LegalPages';

export default function LegalPage() {
  const { type } = useParams<{ type: 'mentions' | 'privacy' | 'terms' }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  // Default to 'mentions' if type is invalid
  const currentPage = (type === 'mentions' || type === 'privacy' || type === 'terms') 
    ? type 
    : 'mentions';

  return (
    <LegalPages 
      currentPage={currentPage}
      onBack={handleBack}
    />
  );
}
