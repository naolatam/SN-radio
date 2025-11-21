import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import config from '../config/env.config';

interface AudioContextType {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  togglePlay: () => Promise<void>;
  toggleMute: () => void;
  isOnline: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: React.ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const streamUrl = config.radioStreamUrl;

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Charger l'audio si nécessaire
        if (audioRef.current.readyState === 0) {
          audioRef.current.load();
        }
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Erreur de lecture audio:', error);
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    const newMuted = !isMuted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
      if (audioRef.current.muted && newVolume > 0) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume / 100;

      const handleError = () => {
        setIsOnline(false);
        setIsPlaying(false);
      };

      const handleCanPlay = () => {
        setIsOnline(true);
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener('error', handleError);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [volume]);

  const contextValue: AudioContextType = {
    audioRef,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume: handleVolumeChange,
    isMuted,
    setIsMuted,
    togglePlay,
    toggleMute,
    isOnline,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
      {/* Audio element global - ne se recrée jamais */}
      <audio
        ref={audioRef}
        src={streamUrl}
        preload="metadata"
        crossOrigin="anonymous"
        style={{ display: 'none' }}
      />
    </AudioContext.Provider>
  );
};