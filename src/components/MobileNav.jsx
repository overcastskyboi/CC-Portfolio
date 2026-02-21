import { Activity, LayoutGrid, Power } from 'lucide-react';
import { useOS } from '../context/OSContext';

/* Min 44x44px touch targets (iOS HIG / Android); safe-area for notches/home indicator */
const MobileNav = () => {
  const { setBootState } = useOS();
  return (
    <div
      className="min-h-[72px] bg-black/90 backdrop-blur-xl border-t border-gray-800 flex items-center justify-around px-4 fixed bottom-0 left-0 right-0 w-full z-[9999] md:hidden pointer-events-auto pb-[env(safe-area-inset-bottom,0)] pt-2 touch-manipulation"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <button
        type="button"
        onClick={() => setBootState('locked')}
        className="min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-white active:bg-white/5 rounded-lg transition-colors"
        style={{ WebkitTapHighlightColor: 'transparent' }}
        aria-label="Lock screen"
      >
        <Power size={22} aria-hidden />
        <span className="text-[10px]">Lock</span>
      </button>
      <div className="min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-yellow-500 pointer-events-none">
        <div className="w-12 h-12 bg-yellow-600/20 rounded-full flex items-center justify-center border border-yellow-600">
          <LayoutGrid size={24} aria-hidden />
        </div>
      </div>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-white active:bg-white/5 rounded-lg transition-colors"
        style={{ WebkitTapHighlightColor: 'transparent' }}
        aria-label="Reset app"
      >
        <Activity size={22} aria-hidden />
        <span className="text-[10px]">Reset</span>
      </button>
    </div>
  );
};

export default MobileNav;
