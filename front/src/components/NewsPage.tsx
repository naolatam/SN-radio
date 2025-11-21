import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import defaultLogo from 'figma:asset/2139041d24232c172eb80f7428131e88b26c339b.png';
import getTimeAgo from '@/utils/date.utils';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  Search, 
  Filter,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import LikeButton from './LikeButton';
import { Article, Category } from '@/types/shared.types';
import { useAuth } from './AuthContext';

interface NewsPageProps {
  onBack: () => void;
  initialArticleId?: string;
  articles: Article[];
  onLoginRequired?: () => void;
}


export default function NewsPage({ onBack, initialArticleId, articles, onLoginRequired }: NewsPageProps) {
  const { user } = useAuth();
  
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(
    initialArticleId ? articles.find(article => article.id === initialArticleId) || null : null
  );

  // Extract unique categories from articles
  const allCategories = useMemo(() => {
    const categoryMap = new Map<string, Category>();
    articles.forEach(article => {
      article.categories.forEach(cat => {
        if (cat.id && !categoryMap.has(cat.id)) {
          categoryMap.set(cat.id, cat);
        }
      });
    });
    return Array.from(categoryMap.values());
  }, [articles]);

  const filteredNews = articles.filter(article => {
    if (!article) return false;
    const matchesCategory = selectedCategory === "Tous" || article.categories.some(c => c.name === selectedCategory);
    const matchesSearch = (article.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (article.resume || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredNews = articles.filter(article => article && article.isHeadline);

  if (selectedArticle) {
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
                onClick={() => setSelectedArticle(null)}
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
                <ImageWithFallback className='w-full h-full object-cover' src={selectedArticle.pictureUrl || defaultLogo}>
                </ImageWithFallback>
                  
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  { selectedArticle.categories.map((category) => (
                    <span 
                      key={category.id}
                      className="px-3 py-1 rounded-full text-white text-xs font-medium"
                      style={{backgroundColor: category.color || '#6b7280'}}
                    >
                      {category.name || 'Non classé'}
                    </span>))}
                </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {selectedArticle.title || 'Titre non disponible'}
                  </h1>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-6 text-gray-400 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{selectedArticle.author.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(selectedArticle.publishedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{getTimeAgo(new Date(selectedArticle.publishedAt))}</span>
                    </div>
                  </div>
                  <LikeButton 
                    articleId={selectedArticle.id}
                    onLoginRequired={onLoginRequired}
                    initialLiked={selectedArticle.isLikedByCurrentUser}
                    initialLikesCount={selectedArticle.likes}
                  />
                </div>

                <div className="text-gray-300 leading-relaxed space-y-4">
                  <p className="text-lg text-gray-200">{selectedArticle.resume}</p>
                  <p>{selectedArticle.content || 'Contenu non disponible'}</p>
                  <p>Cette actualité représente une étape importante dans le développement de SN-Radio. Notre équipe continue de travailler pour vous offrir le meilleur contenu et les meilleures expériences musicales.</p>
                  <p>Restez connectés sur nos réseaux sociaux et notre site web pour ne manquer aucune de nos nouvelles actualités et découvertes musicales. SN-Radio, votre compagnon musical de tous les instants.</p>
                </div>
              </div>
            </div>
          </motion.div>
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
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={onBack}
                className="mr-4 text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Actualités SN-Radio
              </h1>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "Tous" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("Tous")}
                  className={selectedCategory === "Tous" 
                    ? "bg-[#007EFF] text-white hover:bg-[#005bbf]" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-800"
                  }
                >
                  Tous
                </Button>
                {allCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.name)}
                    style={selectedCategory === category.name ? {
                      backgroundColor: category.color,
                      color: '#fff',
                      borderColor: category.color
                    } : {
                      borderColor: category.color,
                      color: category.color
                    }}
                    className="hover:opacity-80 transition-opacity"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Articles */}
          {selectedCategory === "Tous" && searchTerm === "" && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span style={{ color: '#FFBB62' }}>À la Une</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredNews.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card 
                      className="cursor-pointer overflow-hidden border transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: '#12171C80', borderColor: '#ffffff20' }}
                      onClick={() => setSelectedArticle(article)}
                    >
                      <div className="relative h-48">
                        <ImageWithFallback
                          src={article.pictureUrl || defaultLogo}
                          alt={article.title || 'Article'}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <Badge 
                          className="absolute top-4 left-4"
                          style={{ backgroundColor: article.categories[0]?.color || '#6b7280', color: '#fff' }}
                        >
                          {article.categories[0]?.name || 'Non classé'}
                        </Badge>
                      </div>
                      <CardContent className="pl-6 pr-4 pb-6">
                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-300 mb-4 line-clamp-3">
                          {article.resume}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center space-x-4">
                            <span>{article.author.name}</span>
                            <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <LikeButton 
                              articleId={article.id}
                              onLoginRequired={onLoginRequired}
                              variant="compact"
                              activate={false}
                              initialLiked={article.isLikedByCurrentUser}
                              initialLikesCount={article.likes}
                            />
                            <div className="flex items-center space-x-1" style={{ color: '#007EFF' }}>
                              <span>Lire plus</span>
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* All Articles */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {selectedCategory === "Tous" ? "Tous les articles" : `Articles - ${selectedCategory}`}
              <span className="text-gray-400 text-lg ml-2">({filteredNews.length})</span>
            </h2>
            
            {filteredNews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Aucun article trouvé pour votre recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card 
                      className="cursor-pointer overflow-hidden border transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: '#12171C80', borderColor: '#ffffff20' }}
                      onClick={() => setSelectedArticle(article)}
                    >
                      <div className="relative h-40">
                        <ImageWithFallback
                          src={article.pictureUrl || defaultLogo}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <Badge 
                          className="absolute top-3 left-3 text-xs"
                          style={{ backgroundColor: article.categories[0]?.color || '#6b7280', color: '#fff' }}
                        >
                          {article.categories[0]?.name || 'Non classé'}
                        </Badge>
                      </div>
                      <CardContent className="pl-6 pr-4 pb-4">
                        <h3 className="font-bold text-white mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                          {article.resume}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{getTimeAgo(new Date(article.publishedAt))}</span>
                            </div>
                          </div>
                          <LikeButton 
                            articleId={article.id}
                            onLoginRequired={onLoginRequired}
                            variant="compact"
                            activate={false}
                            initialLiked={article.isLikedByCurrentUser}
                            initialLikesCount={article.likes}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}