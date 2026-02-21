import { useState } from 'react';
import { Disc, Pause, Play, SkipForward, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TRACKS } from '../data/constants';

const MySongsApp = () => {
  const navigate = useNavigate();
  const [currentTrack] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-[#111] text-white h-full flex flex-col relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <div className="absolute top-4 left-4 z-20">
        <button 
          onClick={() => navigate('/')}
          className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full transition-colors text-yellow-500 border border-white/10"
          aria-label="Back to Desktop"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 to-black pointer-events-none" />
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 z-10">
        <div className="w-48 h-48 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 flex items-center justify-center relative overflow-hidden group">
          <div className={`absolute inset-0 bg-yellow-500/20 ${isPlaying ? 'animate-pulse' : ''}`} />
          <Disc size={64} className={`text-yellow-500 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{currentTrack.title}</h2>
          <p className="text-gray-400 text-sm tracking-widest uppercase">{currentTrack.artist}</p>
          <p className="text-xs text-gray-500">{currentTrack.duration}</p>
        </div>
        <div className="w-full max-w-xs bg-black/40 p-4 rounded-lg h-32 overflow-y-auto text-center text-xs font-mono text-gray-300 scrollbar-hide border border-gray-800">
          {currentTrack.lyrics.map((l, i) => (
            <p key={i} className="py-1">
              {l}
            </p>
          ))}
        </div>
      </div>
      <div className="h-20 bg-[#0a0a0a] border-t border-gray-800 z-10 flex items-center justify-center space-x-8">
        <button className="hover:text-yellow-500 transition-colors" aria-label="Previous track">
          <SkipForward size={20} className="rotate-180" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-black hover:bg-yellow-500 shadow-[0_0_15px_rgba(218,165,32,0.4)] transition-all transform hover:scale-105"
          aria-label="Play or pause"
        >
          {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-1" />}
        </button>
        <button className="hover:text-yellow-500 transition-colors" aria-label="Next track">
          <SkipForward size={20} />
        </button>
      </div>
    </div>
  );
};

export default MySongsApp;
