import { Suspense, lazy } from 'react';
import { Gamepad2, Headphones, Sliders, Terminal, Tv } from 'lucide-react';
import { useOS } from '../context/OSContext';
import DesktopIcon from './DesktopIcon';
import WindowFrame from './WindowFrame';
import Taskbar from './Taskbar';
import MobileNav from './MobileNav';

// Lazy load apps for performance optimization
const TerminalApp = lazy(() => import('../apps/TerminalApp'));
const MySongsApp = lazy(() => import('../apps/MySongsApp'));
const WatchLogApp = lazy(() => import('../apps/WatchLogApp'));
const GameCenterApp = lazy(() => import('../apps/GameCenterApp'));
const StudioRackApp = lazy(() => import('../apps/StudioRackApp'));

const Desktop = () => {
  const { openWindow, isMobile, windows } = useOS();
  const APPS = [
    { id: 'songs', title: 'My Songs', icon: Headphones, component: MySongsApp },
    { id: 'watch', title: 'Watch Log', icon: Tv, component: WatchLogApp },
    { id: 'games', title: 'Game Center', icon: Gamepad2, component: GameCenterApp },
    { id: 'studio', title: 'Studio Rack', icon: Sliders, component: StudioRackApp },
    { id: 'term', title: 'Terminal', icon: Terminal, component: TerminalApp },
  ];

  return (
    <div className="h-screen w-screen bg-[#050505] overflow-hidden relative font-sans select-none">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]" />
      </div>
      <div className="relative z-10 p-4 pb-24 md:p-10 grid grid-cols-3 md:flex md:flex-col md:flex-wrap md:h-[calc(100vh-80px)] gap-6 md:gap-8 content-start items-start min-h-0">
        {APPS.map((app) => (
          <DesktopIcon key={app.id} icon={app.icon} label={app.title} onClick={() => openWindow(app.id, app.component, app.title, app.icon)} />
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="relative w-full h-full pointer-events-none">
          {windows.map((win) => (
            <Suspense key={win.id} fallback={<div className="absolute w-[550px] h-[450px] rounded-xl bg-[#0f0f0f]/80 border border-gray-700/50 animate-pulse" aria-hidden />}>
              <WindowFrame window={win} />
            </Suspense>
          ))}
        </div>
      </div>
      {isMobile ? <MobileNav /> : <Taskbar />}
    </div>
  );
};

export default Desktop;
