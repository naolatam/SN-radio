/**
 * LikedArticlesPage - Single Responsibility: Display user's liked articles
 * Following KISS principle - reuses NewsPage component logic
 */
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Heart, Loader2 } from 'lucide-react';
import { Article } from '@/types/shared.types';
import { articleService } from '@/services/article.service';
import { useAuth } from '@/components/AuthContext';
import NewsPage from '@/components/NewsPage';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';

export default function LikedArticlesPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [likedArticles, setLikedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikedArticles = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const articles = await articleService.getLikedArticles();
        setLikedArticles(articles);
      } catch (err) {
        console.error('Error fetching liked articles:', err);
        setError('Impossible de charger vos articles aimés');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedArticles();
  }, [isAuthenticated]);

  // If not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #12171C 0%, #1a2025 50%, #12171C 100%)'}}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Connexion requise
          </h2>
          <p className="text-gray-400 mb-8">
            Connectez-vous pour voir vos articles aimés
          </p>
          <Button
            onClick={() => navigate(ROUTES.AUTH)}
            className="bg-[#007EFF] hover:bg-[#005bbf] text-white"
          >
            Se connecter
          </Button>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #12171C 0%, #1a2025 50%, #12171C 100%)'}}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-[#007EFF] mb-4" />
          <p className="text-gray-400">Chargement de vos articles aimés...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #12171C 0%, #1a2025 50%, #12171C 100%)'}}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Heart className="h-16 w-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Erreur
          </h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#007EFF] hover:bg-[#005bbf] text-white"
          >
            Réessayer
          </Button>
        </motion.div>
      </div>
    );
  }

  // Empty state
  if (likedArticles.length === 0) {
    return (
      <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #12171C 0%, #1a2025 50%, #12171C 100%)'}}>
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-500" />
                Articles aimés
              </h1>
            </div>
            
            <div className="text-center py-20">
              <Heart className="h-20 w-20 mx-auto mb-6 text-gray-600" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Aucun article aimé
              </h2>
              <p className="text-gray-400 mb-8">
                Commencez à aimer des articles pour les retrouver ici
              </p>
              <Button
                onClick={() => navigate(ROUTES.NEWS)}
                className="bg-[#007EFF] hover:bg-[#005bbf] text-white"
              >
                Découvrir les actualités
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Render liked articles using NewsPage component
  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #12171C 0%, #1a2025 50%, #12171C 100%)'}}>
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500 fill-red-500" />
              Articles aimés
            </h1>
            <Button
              onClick={() => navigate(ROUTES.NEWS)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Toutes les actualités
            </Button>
          </div>
          
          <NewsPage articles={likedArticles} />
        </motion.div>
      </div>
    </div>
  );
}
