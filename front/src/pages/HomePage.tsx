/**
 * HomePage - Single Responsibility: Display home page content
 * Following KISS principle - simple, focused component
 */
import { motion } from 'motion/react';
import AudioPlayer from '@/components/AudioPlayer';
import NowPlaying from '@/components/NowPlaying';
import NewsSection from '@/components/NewsSection';
import TeamSection from '@/components/TeamSection';
import { useTheme } from '@/components/ThemeContext';
import { useArticles } from '@/hooks/useArticles';
import { useNavigate } from 'react-router-dom';
import { ROUTES, buildArticleRoute } from '@/config/routes.config';

export default function HomePage() {
  const { themeColors } = useTheme();
  const { articles } = useArticles();
  const navigate = useNavigate();

  const handleArticleClick = (articleId: string) => {
    navigate(buildArticleRoute(articleId));
  };

  return (
    <div className="min-h-screen" style={{ background: themeColors.backgroundGradient }}>
      {/* Hero Section */}
      <section id="accueil" className="pt-20 pb-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
              Bienvenue sur SN-Radio
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6 md:mb-8 px-2">
              Votre radio en ligne préférée. Écoutez vos émissions favorites, découvrez de nouveaux podcasts 
              et restez connectés avec notre équipe passionnée.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {/* Audio Player - Takes 2 columns on large screens */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <AudioPlayer />
            </motion.div>

            {/* Now Playing - Takes 1 column */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <NowPlaying />
            </motion.div>
          </div>

          {/* Floating Animation Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/4 left-10 w-4 h-4 rounded-full"
              style={{ backgroundColor: '#007EFF20' }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute top-1/2 right-20 w-6 h-6 rounded-full"
              style={{ backgroundColor: '#FFBB6220' }}
              animate={{
                y: [0, 30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
            <motion.div
              className="absolute bottom-1/4 left-1/3 w-3 h-3 rounded-full"
              style={{ backgroundColor: '#CE8E2030' }}
              animate={{
                y: [0, -15, 0],
                x: [0, 10, 0],
                opacity: [0.4, 0.9, 0.4],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </div>
        </div>
      </section>

      {/* News */}
      <section id="actualites">
        <NewsSection 
          onNewsClick={() => navigate(ROUTES.NEWS)}
          onArticleClick={handleArticleClick}
          articles={articles}
        />
      </section>

      {/* Team */}
      <section id="equipe">
        <TeamSection />
      </section>
    </div>
  );
}
