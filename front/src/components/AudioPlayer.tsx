'use client';

import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { useAudio } from './AudioContext';

export default function AudioPlayer() {
  const { isPlaying, isMuted, volume, togglePlay, toggleMute, setVolume, isOnline } = useAudio();

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  return (
    <div className="backdrop-blur-sm rounded-2xl p-4 md:p-6 border" style={{backgroundColor: '#12171C80', borderColor: '#ffffff20'}}>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <div className="flex items-center space-x-3 md:space-x-4">
          <Button
            onClick={togglePlay}
            size="lg"
            className="w-14 h-14 md:w-16 md:h-16 rounded-full text-white hover:opacity-90 transition-opacity"
            style={{background: 'linear-gradient(135deg, #007EFF, #FFBB62)'}}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 md:h-8 md:w-8" />
            ) : (
              <Play className="h-6 w-6 md:h-8 md:w-8 ml-1" />
            )}
          </Button>
          
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold text-lg md:text-xl">SN-Radio Live</h3>
            <p className="text-gray-400 text-sm">{isOnline ? 'En direct' : 'HORS-LIGNE'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="text-gray-400 hover:text-white h-8 w-8 md:h-10 md:w-10"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <Volume2 className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </Button>
          
          <div className="w-20 md:w-24">
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Live Status */}
      <div className="flex items-center justify-center space-x-2">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
          <span className={`text-sm ${isOnline ? 'text-red-400' : 'text-gray-400'}`}>{isOnline ? 'EN DIRECT' : 'HORS-LIGNE'}</span>
        </div>
      </div>
    </div>
  );
}
