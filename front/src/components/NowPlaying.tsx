'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Music, ChevronDown, ChevronUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useThemeManager } from './ThemeManagerContext';

export default function NowPlaying() {
  const { theme } = useThemeManager();
  const [nowPlaying, setNowPlaying] = useState<{
    title: string;
    artist: string;
    album: string;
    art: string;
  } | null>(null);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchNowPlaying = async () => {
    try {
      const response = await fetch('https://sn-radio.online/api/nowplaying/sn_radio');
      const data = await response.json();
      const song = data.now_playing.song;

      setNowPlaying({
        title: song.title,
        artist: song.artist,
        album: song.album,
        art: song.art,
      });

      setError(false);
      setLoading(false);
    } catch (err) {
      console.error('Impossible de récupérer les données de l’API', err);
      setError(true);
      setLoading(false);
    }
  };

  // Appel au chargement + toutes les 30 secondes
  useEffect(() => {
    fetchNowPlaying(); // Appel initial

    const interval = setInterval(() => {
      fetchNowPlaying(); // Appel régulier
    }, 30000); // 30 secondes

    return () => clearInterval(interval); // Nettoyage à la destruction du composant
  }, []);

  if (loading) {
    return (
      <div
        className="backdrop-blur-sm rounded-xl p-4 md:p-6 border"
        style={{ backgroundColor: `${theme.colors.background}80`, borderColor: `${theme.colors.primary}40` }}
      >
        <h3 className="text-white font-semibold mb-4 flex items-center space-x-2 text-lg md:text-xl">
          <Music className="h-5 w-5" style={{ color: theme.colors.primary }} />
          <span>En direct maintenant</span>
        </h3>
        <p className="text-gray-400">Chargement en cours...</p>
      </div>
    );
  }

  if (error || !nowPlaying) {
    return (
      <div
        className="backdrop-blur-sm rounded-xl p-4 md:p-6 border"
        style={{ backgroundColor: `${theme.colors.background}80`, borderColor: `${theme.colors.primary}40` }}
      >
        <h3 className="text-white font-semibold mb-4 flex items-center space-x-2 text-lg md:text-xl">
          <Music className="h-5 w-5" style={{ color: '#FF4B4B' }} />
          <span>Erreur</span>
        </h3>
        <p className="text-gray-400">Impossible de récupérer la chanson en cours.</p>
      </div>
    );
  }

  return (
    <div
      className="backdrop-blur-sm rounded-xl p-4 md:p-6 border"
      style={{ backgroundColor: `${theme.colors.background}80`, borderColor: `${theme.colors.primary}40` }}
    >
      <h3 className="text-white font-semibold mb-4 flex items-center space-x-2 text-lg md:text-xl">
        <Music className="h-5 w-5" style={{ color: theme.colors.primary }} />
        <span>En direct maintenant</span>
      </h3>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-start space-x-3 md:space-x-4">
          <div className="relative flex-shrink-0">
            <ImageWithFallback
              src={nowPlaying.art}
              alt={`Album Cover - ${nowPlaying.artist}`}
              className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#4FB400' }}></div>
              <span className="text-xs md:text-sm" style={{ color: '#F6F3EF' }}>Titre en cours</span>
            </div>
            
            {/* Titre avec tooltip sur desktop ou bouton voir plus sur mobile */}
            <div className="space-y-2">
              {!isMobile ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h5 className="text-white font-medium text-sm md:text-base cursor-help truncate">
                      {nowPlaying.artist} - {nowPlaying.title}
                    </h5>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">{nowPlaying.artist} - {nowPlaying.title}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <h5 className={`text-white font-medium text-sm cursor-default ${
                  showFullTitle ? 'whitespace-normal' : 'truncate'
                }`}>
                  {nowPlaying.artist} - {nowPlaying.title}
                </h5>
              )}
              
              {/* Bouton voir plus/moins sur mobile */}
              {isMobile && (nowPlaying.artist + ' - ' + nowPlaying.title).length > 30 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullTitle(!showFullTitle)}
                  className="text-xs text-gray-400 hover:text-white h-auto p-1 -ml-1"
                >
                  {showFullTitle ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Voir moins
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Voir plus
                    </>
                  )}
                </Button>
              )}
            </div>
            
            <p className="text-gray-400 text-xs md:text-sm truncate">Album: {nowPlaying.album || 'Inconnu'}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
