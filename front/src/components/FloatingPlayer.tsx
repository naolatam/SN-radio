import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { useAudio } from "./AudioContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useThemeManager } from "./ThemeManagerContext";

export default function FloatingPlayer() {
  const { theme } = useThemeManager();
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const playerRef = useRef<HTMLDivElement>(null);
  const {
    isPlaying,
    isMuted,
    volume,
    togglePlay,
    toggleMute,
    setVolume,
  } = useAudio();

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
  };

  // Initialiser la position au coin inférieur droit avec responsive
  useEffect(() => {
    const updatePosition = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const isMobile = windowWidth < 768;

      // Tailles adaptées selon l'écran
      const compactSize = isMobile ? 60 : 80;
      const expandedWidth = isMobile ? 280 : 320;
      const expandedHeight = isMobile ? 180 : 200;
      const margin = isMobile ? 16 : 24;

      setPosition({
        x:
          windowWidth -
          (isExpanded ? expandedWidth : compactSize) -
          margin,
        y:
          windowHeight -
          (isExpanded ? expandedHeight : compactSize) -
          margin,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () =>
      window.removeEventListener("resize", updatePosition);
  }, [isExpanded]);

  // Gestionnaires de drag (souris et tactile)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      e.target !== e.currentTarget &&
      !e.currentTarget.contains(e.target as Node)
    )
      return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (
      e.target !== e.currentTarget &&
      !e.currentTarget.contains(e.target as Node)
    )
      return;

    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;

      const newX = clientX - dragStart.x;
      const newY = clientY - dragStart.y;

      // Contraintes pour rester dans l'écran avec responsive
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const isMobile = windowWidth < 768;

      const playerWidth = isExpanded
        ? isMobile
          ? 280
          : 320
        : isMobile
          ? 60
          : 80;
      const playerHeight = isExpanded
        ? isMobile
          ? 180
          : 200
        : isMobile
          ? 60
          : 80;

      const constrainedX = Math.max(
        0,
        Math.min(newX, windowWidth - playerWidth),
      );
      const constrainedY = Math.max(
        0,
        Math.min(newY, windowHeight - playerHeight),
      );

      setPosition({ x: constrainedX, y: constrainedY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Empêcher le scroll de la page
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleEnd);
      document.body.style.userSelect = "none"; // Empêcher la sélection de texte
    }

    return () => {
      document.removeEventListener(
        "mousemove",
        handleMouseMove,
      );
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener(
        "touchmove",
        handleTouchMove,
      );
      document.removeEventListener("touchend", handleEnd);
      document.body.style.userSelect = "";
    };
  }, [isDragging, dragStart, isExpanded]);

  return (
    <AnimatePresence>
      <motion.div
        ref={playerRef}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: position.x,
          y: position.y,
        }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          type: isDragging ? "tween" : "spring",
          stiffness: 260,
          damping: 20,
          duration: isDragging ? 0 : 0.3,
        }}
        className="fixed top-0 left-0 z-50 floating-player-mobile"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          transform: `translate(${position.x}px, ${position.y}px)`,
          touchAction: "none",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          className={`backdrop-blur-md border rounded-2xl shadow-2xl transition-all duration-300 ${
            isExpanded
              ? "w-70 sm:w-72 md:w-80"
              : "w-15 h-15 sm:w-16 sm:h-16"
          }`}
          style={{
            backgroundColor: `${theme.colors.background}dd`,
            borderColor: `${theme.colors.primary}40`,
            boxShadow:
              `0 25px 50px -12px ${theme.colors.primary}40`,
          }}
        >
          {!isExpanded ? (
            /* Mode compact - Bulle circulaire */
            <motion.div
              className="w-15 h-15 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center cursor-pointer relative overflow-hidden"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              whileHover={{ scale: isDragging ? 1 : 1.05 }}
              whileTap={{ scale: isDragging ? 1 : 0.95 }}
              
            >
              {/* Animation du cercle */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    `linear-gradient(135deg, ${theme.colors.primary}40, ${theme.colors.secondary}40)`,
                  filter: "blur(8px)",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <ImageWithFallback
                src="https://zupimages.net/up/25/39/odnn.png"
                alt="SN-Radio Logo"
                className="w-6 h-6 object-contain relative z-10"
              />

              {/* Indicateur live */}
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                <motion.div
                  className="w-2 h-2 rounded-full bg-white"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
              </div>
            </motion.div>
          ) : (
            /* Mode étendu - Lecteur complet */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-2 sm:p-3 md:p-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-red-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  />
                  <ImageWithFallback
                    src="https://zupimages.net/up/25/39/odnn.png"
                    alt="SN-Radio Logo"
                    className="w-6 h-6 object-contain"
                  />
                  <div>
                    <h4 className="text-white font-medium text-sm">
                      SN-Radio
                    </h4>
                    <span className="text-xs text-gray-400">
                      En direct
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(false);
                    }}
                    className="text-gray-400 hover:text-white h-8 w-8 p-0"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-3 mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="text-white hover:bg-white/10 h-10 w-10 p-0 rounded-full"
                  style={{
                    background: isPlaying
                      ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
                      : "transparent",
                  }}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>

                <div className="flex-1 flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="text-gray-400 hover:text-white h-8 w-8 p-0"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>

                  <Slider
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="flex-1"
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {/* Visualiseur simple */}
              {isPlaying && (
                <div className="flex items-center justify-center space-x-1 h-8">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 rounded-full"
                      style={{ backgroundColor: theme.colors.primary }}
                      animate={{
                        height: [8, Math.random() * 20 + 8, 8],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 0.8 + Math.random() * 0.4,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}