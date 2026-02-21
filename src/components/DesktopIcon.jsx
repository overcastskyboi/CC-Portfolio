import { memo } from 'react';

/* Min 44x44px touch target on mobile (iOS/Android); desktop hover/active preserved */
const DesktopIcon = memo(({ icon: Icon, label, onClick }) => (
  <div
    role="button"
    tabIndex={0}
    className="flex flex-col items-center justify-center w-28 min-w-[44px] min-h-[44px] md:w-32 gap-2 md:gap-3 p-2 md:p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all group active:scale-95 pointer-events-auto touch-manipulation border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
    style={{ WebkitTapHighlightColor: 'transparent' }}
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    aria-label={`Open ${label}`}
  >
    <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-b from-gray-800 to-black rounded-2xl shadow-xl flex items-center justify-center border border-gray-700 group-hover:border-yellow-500/50 transition-colors relative">
      <Icon size={40} className="text-yellow-500 shrink-0" aria-hidden />
    </div>
    <span className="text-xs md:text-sm text-gray-200 text-center font-semibold tracking-wide bg-black/40 px-2 py-0.5 md:px-3 md:py-1 rounded-full">{label}</span>
  </div>
));

DesktopIcon.displayName = 'DesktopIcon';
export default DesktopIcon;
