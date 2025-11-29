/**
 * OAuth Callback Page
 * Handles OAuth redirects from providers like Google
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from './AuthContext';
import { useThemeManager } from './ThemeManagerContext';
import { Loader2 } from 'lucide-react';

interface OAuthCallbackProps {
  onSuccess: () => void;
  onError?: () => void;
}

export default function OAuthCallback({ onSuccess, onError }: OAuthCallbackProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const { refreshProfile } = useAuth();
  const { theme } = useThemeManager();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Better Auth automatically handles the callback and sets the session cookie
        // We just need to refresh the profile to update the UI
        await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay to ensure cookie is set
        await refreshProfile();
        setStatus('success');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setTimeout(() => {
          onError?.();
        }, 2000);
      }
    };

    handleCallback();
  }, [refreshProfile, onSuccess, onError]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.primary}20 50%, ${theme.colors.background} 100%)`
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {status === 'loading' && (
          <>
            <Loader2 
              className="h-12 w-12 animate-spin mx-auto mb-4" 
              style={{ color: theme.colors.primary }}
            />
            <h2 className="text-2xl font-bold text-white mb-2">Authentification en cours...</h2>
            <p className="text-gray-400">Veuillez patienter</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div 
              className="h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: theme.colors.secondary }}
            >
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Connexion réussie !</h2>
            <p className="text-gray-400">Redirection en cours...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="h-12 w-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Erreur d'authentification</h2>
            <p className="text-gray-400">Redirection en cours...</p>
          </>
        )}
      </motion.div>
    </div>
  );
}
