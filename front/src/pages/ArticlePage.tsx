/**
 * ArticlePage - Single Responsibility: Display a single article
 * Following KISS principle
 */
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import LikeButton from '@/components/LikeButton';
import { useArticles } from '@/hooks/useArticles';
import { ROUTES } from '@/config/routes.config';
import getTimeAgo from '@/utils/date.utils';
import { useThemeManager } from '@/components/ThemeManagerContext';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useMemo } from 'react';

export default function ArticlePage() {
  const { theme } = useThemeManager();
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const { articles } = useArticles();

  const article = articles.find(a => a.id === articleId);

  // Parse markdown content safely
  const parsedContent = useMemo(() => {
    if (!article?.content) return '';
    const rawHtml = marked(article.content);
    return DOMPurify.sanitize(rawHtml as string);
  }, [article?.content]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #12171C 0%, #1a2025 50%, #12171C 100%)'}}>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Article non trouvé</h1>
          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.NEWS)}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux actualités
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #12171C 0%, #1a2025 50%, #12171C 100%)'}}>
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Article Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(ROUTES.NEWS)}
              className="mr-4 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux actualités
            </Button>
          </div>

          {/* Article Content */}
          <div 
            className="backdrop-blur-sm rounded-xl overflow-hidden border"
            style={{ backgroundColor: '#12171C80', borderColor: '#ffffff20' }}
          >
            <div className="relative h-64 md:h-96">
              <ImageWithFallback 
                className='w-full h-full object-cover' 
                src={article.pictureUrl || theme.branding.logo}
                alt={article.title}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {article.categories.map((category) => (
                    <span 
                      key={category.id}
                      className="px-3 py-1 rounded-full text-white text-xs font-medium"
                      style={{backgroundColor: category.color || '#6b7280'}}
                    >
                      {category.name || 'Non classé'}
                    </span>
                  ))}
                </div>
              <div className="absolute bottom-6 left-6 right-6">
                
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {article.title || 'Titre non disponible'}
                </h1>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-6 text-gray-400 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{article.author.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{getTimeAgo(new Date(article.publishedAt))}</span>
                  </div>
                </div>
                <LikeButton 
                  articleId={article.id}
                  initialLiked={article.isLikedByCurrentUser}
                  initialLikesCount={article.likes}
                />
              </div>

              <div className="text-gray-300 leading-relaxed space-y-4">
                <p className="text-lg text-gray-200">{article.resume}</p>
                {parsedContent ? (
                  <div 
                    className="prose prose-invert prose-lg max-w-none
                      prose-headings:text-white prose-headings:font-bold
                      prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                      prose-p:text-gray-300 prose-p:leading-relaxed
                      prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-white prose-strong:font-semibold
                      prose-em:text-gray-200 prose-em:italic
                      prose-ul:text-gray-300 prose-ol:text-gray-300
                      prose-li:text-gray-300 prose-li:marker:text-gray-500
                      prose-blockquote:border-l-blue-500 prose-blockquote:text-gray-400 prose-blockquote:italic
                      prose-code:text-blue-300 prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                      prose-pre:bg-gray-800 prose-pre:text-gray-200"
                    dangerouslySetInnerHTML={{ __html: parsedContent }}
                  />
                ) : (
                  <>
                    <p>Contenu non disponible</p>
                    <p>Cette actualité représente une étape importante dans le développement de SN-Radio. Notre équipe continue de travailler pour vous offrir le meilleur contenu et les meilleures expériences musicales.</p>
                    <p>Restez connectés sur nos réseaux sociaux et notre site web pour ne manquer aucune de nos nouvelles actualités et découvertes musicales. SN-Radio, votre compagnon musical de tous les instants.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
