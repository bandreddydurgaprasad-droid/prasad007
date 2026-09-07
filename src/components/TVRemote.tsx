import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Undo2,
  Home,
  Menu,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  Star,
  Tv,
  Power,
  Info,
  Maximize2,
  Hash,
  RotateCcw,
  Minimize2,
  Keyboard,
  X
} from 'lucide-react';
import { soundEffects } from '../utils/sound';
import { APP_LOGO } from '../assets/logo';

interface TVRemoteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onSelect: () => void;
  onBack: () => void;
  onHome: () => void;
  onMenu: () => void;
  onChannelChange: (delta: number) => void;
  onVolumeChange: (delta: number) => void;
  onToggleMute: () => void;
  onToggleFavorite: () => void;
  onNumberPress: (num: number) => void;
  onToggleFullscreen?: () => void;
  onRecall?: () => void;
  onMinimize?: () => void;
  onOpenShortcuts?: () => void;
  isMuted: boolean;
}

export const TVRemote: React.FC<TVRemoteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelect,
  onBack,
  onHome,
  onMenu,
  onChannelChange,
  onVolumeChange,
  onToggleMute,
  onToggleFavorite,
  onNumberPress,
  onToggleFullscreen,
  onRecall,
  onMinimize,
  onOpenShortcuts,
  isMuted,
}) => {
  const [activeBtn, setActiveBtn] = useState<string | null>(null);
  const [showKeypad, setShowKeypad] = useState(false);

  if (!isOpen) return null;

  const trigger = (name: string, fn: () => void, sound: 'nav' | 'select' | 'back' = 'nav') => {
    setActiveBtn(name);
    if (sound === 'select') soundEffects.playSelectChime();
    else if (sound === 'back') soundEffects.playBackTone();
    else soundEffects.playNavTick();
    fn();
    setTimeout(() => setActiveBtn(null), 150);
  };

  return (
    <div
      id="android-tv-virtual-remote"
      className="fixed bottom-4 right-4 z-50 w-72 bg-[#080808]/98 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-4 text-[#E0E0E0] select-none transition-all duration-200"
    >
      {/* Remote Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <img
            src={APP_LOGO}
            alt="App Logo"
            className="w-5 h-5 rounded object-cover border border-orange-500/40 shrink-0"
            referrerPolicy="no-referrer"
          />
          <span className="text-xs font-bold tracking-wider uppercase text-white font-mono flex items-center gap-1.5">
            Telugu Ultra Remote
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            id="remote-btn-keypad-toggle"
            onClick={() => setShowKeypad(!showKeypad)}
            title="Toggle Number Pad"
            className={`p-1.5 rounded-md text-xs transition-colors ${
              showKeypad ? 'bg-orange-500 text-black font-bold' : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Hash className="w-4 h-4" />
          </button>
          <button
            id="remote-btn-close"
            onClick={onClose}
            className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Power & Quick Utility Row */}
      <div className="flex items-center justify-between mt-3 px-1 gap-1.5">
        <button
          id="remote-btn-power"
          onClick={() => trigger('power', onHome, 'back')}
          className={`p-2 rounded-lg border transition-all ${
            activeBtn === 'power'
              ? 'bg-red-600 text-white scale-95 border-red-500'
              : 'bg-[#121212] hover:bg-red-950/60 text-red-400 border-white/5'
          }`}
          title="TV Home / Sleep"
        >
          <Power className="w-3.5 h-3.5" />
        </button>

        {onRecall && (
          <button
            id="remote-btn-recall"
            onClick={() => trigger('recall', onRecall, 'select')}
            className={`p-2 rounded-lg border transition-all ${
              activeBtn === 'recall'
                ? 'bg-orange-500 text-black scale-95 border-orange-400'
                : 'bg-[#121212] hover:bg-white/10 text-orange-400 border-white/5'
            }`}
            title="Recall Last Channel (Q)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          id="remote-btn-fav"
          onClick={() => trigger('fav', onToggleFavorite, 'select')}
          className={`p-2 rounded-lg border transition-all ${
            activeBtn === 'fav'
              ? 'bg-orange-500 text-black scale-95 border-orange-400'
              : 'bg-[#121212] hover:bg-white/10 text-orange-400 border-white/5'
          }`}
          title="Add / Remove Favorite (F)"
        >
          <Star className="w-3.5 h-3.5" />
        </button>

        {onMinimize && (
          <button
            id="remote-btn-minimize"
            onClick={() => trigger('mini', onMinimize, 'nav')}
            className={`p-2 rounded-lg border transition-all ${
              activeBtn === 'mini'
                ? 'bg-white text-black scale-95 border-white'
                : 'bg-[#121212] hover:bg-white/10 text-white/70 border-white/5'
            }`}
            title="Float Mini-Player"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        )}

        {onToggleFullscreen && (
          <button
            id="remote-btn-fullscreen"
            onClick={() => trigger('fs', onToggleFullscreen, 'select')}
            className={`p-2 rounded-lg border transition-all ${
              activeBtn === 'fs'
                ? 'bg-white text-black scale-95 border-white'
                : 'bg-[#121212] hover:bg-white/10 text-white/70 border-white/5'
            }`}
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}

        {onOpenShortcuts && (
          <button
            id="remote-btn-shortcuts"
            onClick={() => trigger('shortcuts', onOpenShortcuts, 'nav')}
            className={`p-2 rounded-lg border transition-all ${
              activeBtn === 'shortcuts'
                ? 'bg-orange-500 text-black scale-95 border-orange-400'
                : 'bg-[#121212] hover:bg-white/10 text-white/60 border-white/5'
            }`}
            title="Keyboard / TV Controls (?)"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Number Pad view (optional toggle) */}
      {showKeypad ? (
        <div className="my-4 grid grid-cols-3 gap-2 px-1 animate-fadeIn">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <button
              key={num}
              id={`remote-key-${num}`}
              onClick={() => trigger(`key-${num}`, () => onNumberPress(num), 'select')}
              className={`py-2 rounded-lg text-sm font-mono font-bold transition-all border ${
                activeBtn === `key-${num}`
                  ? 'bg-orange-500 text-black border-orange-400 scale-95'
                  : 'bg-[#121212] hover:bg-white/10 text-white border-white/5'
              } ${num === 0 ? 'col-start-2' : ''}`}
            >
              {num}
            </button>
          ))}
        </div>
      ) : (
        /* D-Pad Directional Pad - Geometric Balance */
        <div className="my-5 flex items-center justify-center">
          <div className="relative w-44 h-44 rounded-full bg-[#121212] border border-white/10 p-2 shadow-inner flex items-center justify-center">
            {/* UP */}
            <button
              id="remote-dpad-up"
              onClick={() => trigger('up', () => onNavigate('up'), 'nav')}
              className={`absolute top-2 left-1/2 -translate-x-1/2 w-16 h-10 flex items-center justify-center rounded-t-2xl transition-all ${
                activeBtn === 'up' ? 'bg-orange-500 text-black scale-95' : 'text-white/80 hover:bg-white/10'
              }`}
              title="Navigate Up (ArrowUp)"
            >
              <ChevronUp className="w-6 h-6" />
            </button>

            {/* DOWN */}
            <button
              id="remote-dpad-down"
              onClick={() => trigger('down', () => onNavigate('down'), 'nav')}
              className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-10 flex items-center justify-center rounded-b-2xl transition-all ${
                activeBtn === 'down' ? 'bg-orange-500 text-black scale-95' : 'text-white/80 hover:bg-white/10'
              }`}
              title="Navigate Down (ArrowDown)"
            >
              <ChevronDown className="w-6 h-6" />
            </button>

            {/* LEFT */}
            <button
              id="remote-dpad-left"
              onClick={() => trigger('left', () => onNavigate('left'), 'nav')}
              className={`absolute left-2 top-1/2 -translate-y-1/2 w-10 h-16 flex items-center justify-center rounded-l-2xl transition-all ${
                activeBtn === 'left' ? 'bg-orange-500 text-black scale-95' : 'text-white/80 hover:bg-white/10'
              }`}
              title="Navigate Left (ArrowLeft)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* RIGHT */}
            <button
              id="remote-dpad-right"
              onClick={() => trigger('right', () => onNavigate('right'), 'nav')}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-16 flex items-center justify-center rounded-r-2xl transition-all ${
                activeBtn === 'right' ? 'bg-orange-500 text-black scale-95' : 'text-white/80 hover:bg-white/10'
              }`}
              title="Navigate Right (ArrowRight)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* CENTER OK BUTTON - Gradient Orange to Red-600 */}
            <button
              id="remote-dpad-ok"
              onClick={() => trigger('ok', onSelect, 'select')}
              className={`w-18 h-18 rounded-full font-black text-xs tracking-widest flex items-center justify-center shadow-lg transition-all ${
                activeBtn === 'ok'
                  ? 'bg-orange-400 text-black scale-90 ring-4 ring-orange-500/50'
                  : 'bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white hover:scale-105 shadow-orange-950/40'
              }`}
              title="OK / Select (Enter)"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Navigation Buttons: Back, Home, Menu */}
      <div className="grid grid-cols-3 gap-2 px-1 mb-4">
        <button
          id="remote-btn-back"
          onClick={() => trigger('back', onBack, 'back')}
          className={`py-2 rounded-lg border border-white/5 flex flex-col items-center justify-center gap-0.5 text-xs transition-all ${
            activeBtn === 'back' ? 'bg-white/20 scale-95' : 'bg-[#121212] hover:bg-white/10 text-white/80'
          }`}
          title="Back (Esc / Backspace)"
        >
          <Undo2 className="w-4 h-4" />
          <span className="text-[10px] text-white/50 font-mono">Back</span>
        </button>
        <button
          id="remote-btn-home"
          onClick={() => trigger('home', onHome, 'nav')}
          className={`py-2 rounded-lg border border-white/5 flex flex-col items-center justify-center gap-0.5 text-xs transition-all ${
            activeBtn === 'home' ? 'bg-white/20 scale-95' : 'bg-[#121212] hover:bg-white/10 text-white/80'
          }`}
          title="Home Screen"
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] text-white/50 font-mono">Home</span>
        </button>
        <button
          id="remote-btn-menu"
          onClick={() => trigger('menu', onMenu, 'nav')}
          className={`py-2 rounded-lg border border-white/5 flex flex-col items-center justify-center gap-0.5 text-xs transition-all ${
            activeBtn === 'menu' ? 'bg-white/20 scale-95' : 'bg-[#121212] hover:bg-white/10 text-white/80'
          }`}
          title="Menu / OSD (M)"
        >
          <Menu className="w-4 h-4" />
          <span className="text-[10px] text-white/50 font-mono">Menu</span>
        </button>
      </div>

      {/* Dual Rockers: Volume & Channel */}
      <div className="grid grid-cols-2 gap-3 px-1 pt-2 border-t border-white/10">
        {/* Volume Rocker */}
        <div className="bg-[#121212] rounded-xl p-1.5 flex flex-col items-center justify-between h-28 border border-white/5">
          <button
            id="remote-vol-up"
            onClick={() => trigger('vol-up', () => onVolumeChange(10), 'nav')}
            className={`w-full py-1.5 flex items-center justify-center rounded-lg transition-all ${
              activeBtn === 'vol-up' ? 'bg-orange-500 text-black' : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title="Volume Up"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            id="remote-vol-mute"
            onClick={() => trigger('vol-mute', onToggleMute, 'select')}
            className="text-[11px] font-mono font-bold text-white/60 hover:text-orange-400 flex items-center gap-1"
            title="Mute / Unmute"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-orange-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>VOL</span>
          </button>
          <button
            id="remote-vol-down"
            onClick={() => trigger('vol-down', () => onVolumeChange(-10), 'nav')}
            className={`w-full py-1.5 flex items-center justify-center rounded-lg transition-all ${
              activeBtn === 'vol-down' ? 'bg-orange-500 text-black' : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title="Volume Down"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Channel Rocker */}
        <div className="bg-[#121212] rounded-xl p-1.5 flex flex-col items-center justify-between h-28 border border-white/5">
          <button
            id="remote-ch-up"
            onClick={() => trigger('ch-up', () => onChannelChange(1), 'nav')}
            className={`w-full py-1.5 flex items-center justify-center rounded-lg transition-all ${
              activeBtn === 'ch-up' ? 'bg-orange-500 text-black' : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title="Channel Next (PageDown)"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <div className="text-[11px] font-mono font-bold text-white/60 flex items-center gap-1">
            <Tv className="w-3.5 h-3.5 text-orange-400" />
            <span>CH</span>
          </div>
          <button
            id="remote-ch-down"
            onClick={() => trigger('ch-down', () => onChannelChange(-1), 'nav')}
            className={`w-full py-1.5 flex items-center justify-center rounded-lg transition-all ${
              activeBtn === 'ch-down' ? 'bg-orange-500 text-black' : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title="Channel Prev (PageUp)"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Keyboard Shortcut Hint for PC Users */}
      <div className="mt-3 text-[10px] text-center text-white/40 px-1 font-mono">
        Remote Keys: <span className="text-orange-400">↑ ↓ ← →</span> | <span className="text-white/80">Enter</span>: OK | <span className="text-white/80">Esc</span>: Back | <span className="text-orange-400">0-9</span>: Tune
      </div>
    </div>
  );
};
