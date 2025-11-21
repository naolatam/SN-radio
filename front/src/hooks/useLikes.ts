import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { articlesService } from '../services/articlesService';
import { apiClient } from '../utils/api/client';

export interface UseLikesReturn {
  likeArticle: (articleId: string, onUpdate: (liked: boolean, likesCount: number) => void) => Promise<boolean>;
  unlikeArticle: (articleId: string, onUpdate: (liked: boolean, likesCount: number) => void) => Promise<boolean>;
  toggleLike: (articleId: string, currentLiked: boolean, onUpdate: (liked: boolean, likesCount: number) => void) => Promise<boolean>;
  isLiked: (articleId: string, article: any) => boolean;
  getLikesCount: (article: any) => number;
  getUserLikes: (userId: string) => any[];
  isLoading: boolean;
}

export function useLikes(): UseLikesReturn {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userLikesCache, setUserLikesCache] = useState<{[userId: string]: any[]}>({});
  const [loadingUsers, setLoadingUsers] = useState<Set<string>>(new Set());

  const toggleLike = useCallback(async (articleId: string, currentLiked: boolean, onUpdate: (liked: boolean, likesCount: number) => void) => {
    if (!user || isLoading) return false;

    setIsLoading(true);
    try {
      const result = await articlesService.toggleLike(articleId);
      if (result.success && typeof result.liked === 'boolean' && typeof result.likes === 'number') {
        onUpdate(result.liked, result.likes);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors du toggle like:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, isLoading]);

  const likeArticle = useCallback(async (articleId: string, onUpdate: (liked: boolean, likesCount: number) => void) => {
    return toggleLike(articleId, false, onUpdate);
  }, [toggleLike]);

  const unlikeArticle = useCallback(async (articleId: string, onUpdate: (liked: boolean, likesCount: number) => void) => {
    return toggleLike(articleId, true, onUpdate);
  }, [toggleLike]);

  // Ces fonctions vérifient l'état directement dans l'article
  const isLiked = (articleId: string, article: any): boolean => {
    if (!user || !article) return false;
    return article.likedBy?.includes(user.id) || false;
  };

  const getLikesCount = (article: any): number => {
    return article?.likes || 0;
  };

  // Fonction pour obtenir les articles likés par un utilisateur
  const getUserLikes = useCallback((userId: string): any[] => {
    if (!userId) return [];
    
    // Retourner depuis le cache si disponible
    if (userLikesCache[userId]) {
      return userLikesCache[userId];
    }

    // Si pas en cache et pas en cours de chargement, déclencher le chargement
    if ((user?.id === userId || user?.role === 'admin') && !loadingUsers.has(userId)) {
      setLoadingUsers(prev => new Set(prev).add(userId));
      
      apiClient.getUserLikes(userId)
        .then(response => {
          if (response.likes) {
            setUserLikesCache(prev => ({
              ...prev,
              [userId]: response.likes
            }));
          }
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des likes:', error);
          setUserLikesCache(prev => ({
            ...prev,
            [userId]: []
          }));
        })
        .finally(() => {
          setLoadingUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
        });
    }

    return userLikesCache[userId] || [];
  }, [user, userLikesCache, loadingUsers]);

  return {
    likeArticle,
    unlikeArticle,
    toggleLike,
    isLiked,
    getLikesCount,
    getUserLikes,
    isLoading
  };
}