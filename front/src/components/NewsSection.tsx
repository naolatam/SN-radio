import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink, Clock, Calendar, ArrowRight, Eye } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import LikeButton from './LikeButton';
import { Article } from '@/types/shared.types';
import defaultLogo from 'figma:asset/2139041d24232c172eb80f7428131e88b26c339b.png';
import getTimeAgo from '@/utils/date.utils';

interface NewsSectionProps {
  onNewsClick?: () => void;
  onArticleClick?: (articleId: string) => void;
  onLoginRequired?: () => void;
  articles: Article[];
}

export default function NewsSection({ onNewsClick, onArticleClick, onLoginRequired, articles = [] }: NewsSectionProps) {
  const handleArticleClick = (articleId: string) => {
    if (onArticleClick) {
      onArticleClick(articleId);
    } else if (onNewsClick) {
      // Si pas de handler spécifique pour l'article, aller à la page actualités
      onNewsClick();
    }
  };

  const formatDate = (date: Date): string => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  

  return (
    <section id="actualites" className="py-16 px-4" style={{backgroundColor: '#12171C80'}}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Actualités</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Restez informés avec les dernières nouvelles et analyses de notre équipe de journalistes
          </p>
          {onNewsClick && (
            <Button
              onClick={onNewsClick}
              className="bg-transparent border-2 hover:bg-white/10 text-white transition-all duration-300"
              style={{ borderColor: '#007EFF' }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Voir toutes les actualités
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(articles) && articles.slice(0, 3).map((article) => (
            <Card 
              key={article.id} 
              className="overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer group" 
              style={{backgroundColor: '#12171C80', borderColor: '#ffffff20'}}
              onClick={() => handleArticleClick(article.id)}
            >
              <div className="relative">
                <ImageWithFallback
                  src={article.pictureUrl || defaultLogo}
                  alt={article.title || 'Article'}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  { article.categories.map((category) => (
                    <span 
                      key={category.id}
                      className="px-3 py-1 rounded-full text-white text-xs font-medium"
                      style={{backgroundColor: category.color || '#6b7280'}}
                    >
                      {category.name || 'Non classé'}
                    </span>
                  ))}
                </div>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="lg"
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full w-16 h-16"
                  >
                    <ExternalLink className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-[#FFBB62] transition-colors duration-300">
                  {article.title || 'Titre non disponible'}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {article.resume}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{getTimeAgo(article.publishedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                  <LikeButton 
                    articleId={article.id}
                    onLoginRequired={onLoginRequired}
                    initialLikesCount={article.likes}
                    initialLiked={article.isLikedByCurrentUser}
                    variant="compact"
                    activate={false}
                  />
                </div>
                
                <Button 
                  className="w-full text-white hover:opacity-90 transition-opacity group-hover:scale-105"
                  style={{background: 'linear-gradient(135deg, #007EFF, #FFBB62)'}}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Lire l'article
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}