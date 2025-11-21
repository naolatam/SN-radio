import { useState, useEffect } from 'react';
import { articlesService } from '../services/articlesService';
import { Article, CreateArticleDTO } from '@/types/shared.types';

export interface UseArticlesReturn {
  articles: Article[];
  isLoading: boolean;
  addArticle: (article: CreateArticleDTO) => Promise<{ success: boolean; error?: string }>;
  deleteArticle: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateArticle: (id: string, article: {
    title: string;
    content: string;
    imageUrl?: string;
    category: string;
    tags?: string[];
  }) => Promise<{ success: boolean; error?: string }>;
  loadArticles: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useArticles(): UseArticlesReturn {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les articles depuis Supabase au démarrage
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      const data = await articlesService.getAllArticles();
      setArticles(data);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addArticle = async (newArticle: CreateArticleDTO) => {
    try {
      const result = await articlesService.createArticle(newArticle);
      if (result.success && result.article) {
        setArticles(prev => [result.article!, ...prev]);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      return { success: false, error: 'Erreur de réseau' };
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      const result = await articlesService.deleteArticle(id);
      if (result.success) {
        setArticles(prev => prev.filter(article => article.id !== id));
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      return { success: false, error: 'Erreur de réseau' };
    }
  };

  const updateArticle = async (id: string, updatedData: {
    title: string;
    content: string;
    imageUrl?: string;
    category: string;
    tags?: string[];
  }) => {
    // Pour l'instant, nous n'avons pas d'endpoint de mise à jour
    // On pourrait l'ajouter plus tard si nécessaire
    console.log('Mise à jour d\'article non implémentée:', id, updatedData);
    return { success: false, error: 'Mise à jour non implémentée' };
  };

  return {
    articles,
    isLoading,
    addArticle,
    deleteArticle,
    updateArticle,
    loadArticles,
    refetch: loadArticles
  };
}