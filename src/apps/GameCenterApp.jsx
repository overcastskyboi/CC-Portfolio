import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GAMING_DATA } from '../data/constants';

const GameCenterApp = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-[#0f0f0f] h-full flex flex-col font-sans text-gray-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <div className="bg-gray-900/80 backdrop-blur-xl sticky top-0 z-30 border-b border-gray-800 px-4 py-3 flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors text-yellow-500"
          aria-label="Back to Desktop"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-white">Game Center</h1>
      </div>

      <div className="flex flex-wrap border-b border-gray-800">
        <div className="flex-1 min-w-[80px] p-2 md:p-3 text-center border-b-2 border-blue-500 bg-gray-800/30">
          <span className="text-[10px] md:text-xs font-bold whitespace-nowrap">STEAM / PC</span>
        </div>
        <div className="flex-1 min-w-[80px] p-2 md:p-3 text-center text-gray-500">
          <span className="text-[10px] md:text-xs whitespace-nowrap">RETRO</span>
        </div>
        <div className="flex-1 min-w-[80px] p-2 md:p-3 text-center text-gray-500">
          <span className="text-[10px] md:text-xs whitespace-nowrap">XBOX</span>
        </div>
      </div>
      <div className="flex-1 p-4 md:p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-900 rounded flex items-center justify-center">
              <Gamepad2 size={24} className="text-blue-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{GAMING_DATA.steam.user}</h2>
              <p className="text-xs text-blue-400">
                Level {GAMING_DATA.steam.level} • {GAMING_DATA.steam.gamesCount} Games
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase">Top Played</h3>
          {GAMING_DATA.steam.topPlayed.map((game) => (
            <div key={game.name} className="flex items-center bg-gray-800/40 p-3 rounded-lg border border-gray-700">
              <div className={`w-12 h-12 rounded ${game.icon} mr-4 shadow-lg`} />
              <div className="flex-1">
                <h4 className="font-bold text-sm">{game.name}</h4>
                <div className="w-full bg-gray-700 h-1.5 rounded-full mt-2">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-sm font-mono text-gray-300">{game.hours}h</div>
                <div className="text-[10px] text-gray-500">Playtime</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 bg-yellow-900/10 border border-yellow-700/30 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-yellow-500">RETROACHIEVEMENTS</span>
            <span className="text-xs font-mono text-yellow-400">{GAMING_DATA.retro.user}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Hardcore Points: {GAMING_DATA.retro.hardcorePoints}</span>
            <span className="text-white font-bold">Mastered: {GAMING_DATA.retro.recentMastery}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCenterApp;
