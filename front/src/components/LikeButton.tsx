import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { articleService } from '../services/article.service';
import { useAuth } from './AuthContext';

interface LikeButtonProps {
  articleId: string;
  onLoginRequired?: () => void;
  className?: string;
  showCount?: boolean;
  variant?: 'default' | 'compact';
  activate?: boolean;
  initialLiked?: boolean;
  initialLikesCount?: number;
}

export default function LikeButton({ 
  articleId, 
  onLoginRequired, 
  className = '',
  showCount = true,
  variant = 'default',
  activate = true,
  initialLiked = false,
  initialLikesCount = 0
}: LikeButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);

  // Update state when initial values change
  useEffect(() => {
    setLiked(initialLiked);
    setLikesCount(initialLikesCount);
  }, [initialLiked, initialLikesCount]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking like button
    
    if (!isAuthenticated || !user) {
      toast.error('Connexion requise', {
        description: 'Connectez-vous pour liker cet article',
        action: {
          label: 'Se connecter',
          onClick: () => onLoginRequired?.()
        }
      });
      return;
    }

    if (isLoading) return;

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    setIsLoading(true);

    try {
      const response = await articleService.toggleLike(articleId);
      
      if (response.success && response.data) {
        setLiked(response.data.liked);
        setLikesCount(response.data.likes);
        
        if (response.data.liked) {
          toast.success('Article liké !');
        } else {
          toast.success('Like retiré');
        }
      } else {
        toast.error('Erreur lors de l\'action');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Erreur lors de l\'action');
    } finally {
      setIsLoading(false);
    }
  };

  const isCompact = variant === 'compact';

  return (
    <div className={`flex items-center ${className}`}>
      <Button
        variant="ghost"
        size={isCompact ? "sm" : "default"}
        onClick={handleLike}
        disabled={!activate}
        className={`relative transition-all duration-300 ${
          liked 
            ? 'text-red-500 hover:text-red-400' 
            : 'text-gray-400 hover:text-red-500'
        } ${isCompact ? 'h-8 px-2' : 'h-10 px-3'}`}
      >
        <motion.div
          className="relative"
          animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <Heart 
            className={`${isCompact ? 'h-4 w-4' : 'h-5 w-5'} ${
              liked ? 'fill-current' : ''
            }`}
          />
          
          {/* Animation de particules lors du like */}
          {isAnimating && liked && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full"
                  initial={{ 
                    opacity: 1, 
                    scale: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{ 
                    opacity: 0,
                    scale: 1,
                    x: (Math.cos((i * 60) * Math.PI / 180) * 20),
                    y: (Math.sin((i * 60) * Math.PI / 180) * 20)
                  }}
                  transition={{ 
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
        
        {showCount && (
          <span className={`ml-1 ${isCompact ? 'text-xs' : 'text-sm'}`}>
            {likesCount}
          </span>
        )}
      </Button>

      {!isAuthenticated && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onLoginRequired}
          className="ml-1 text-gray-500 hover:text-[#007EFF] transition-colors"
        >
          <LogIn className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}