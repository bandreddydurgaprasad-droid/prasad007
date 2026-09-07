import React from 'react';
import { X, Keyboard, Tv, Play, Volume2, ArrowUpDown, CornerDownLeft, Star, RotateCcw } from 'lucide-react';
import { soundEffects } from '../utils/sound';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '↑ ↓ ← →', desc: 'Spatial D-Pad navigation across channels and categories' },
    { key: 'Enter / Space', desc: 'Select channel or play / pause' },
    { key: '0 - 9', desc: 'Direct channel number jump (e.g., 10 for TV9, 05 for NTV)' },
    { key: 'PgUp / PgDn', desc: 'Previous channel (CH-) / Next channel (CH+)' },
    { key: 'Q', desc: 'Recall / Jump to last watched channel' },
    { key: 'F', desc: 'Add / remove current channel from Favorites' },
    { key: 'M', desc: 'Mute / unmute audio' },
    { key: 'R', desc: 'Toggle virtual Android TV remote controller' },
    { key: 'Esc / Backspace', desc: 'Back to channel list / Exit player / Close modal' },
    { key: '?', desc: 'Open this keyboard shortcuts guide' },
  ];

  return (
    <div
      id="keyboard-shortcuts-modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono tracking-tight text-white">
                TV &amp; Keyboard Controls
              </h3>
              <p className="text-xs text-white/50">
                Optimized for TV D-Pad remotes, wireless keyboards, and desktop controls
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEffects.playBackTone();
              onClose();
            }}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#141414] border border-white/5"
            >
              <span className="text-xs text-white/80 font-medium leading-snug">{sc.desc}</span>
              <kbd className="px-2 py-1 rounded bg-black border border-white/20 text-orange-400 text-xs font-mono font-bold whitespace-nowrap shadow-inner">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
          <span className="font-mono">Tip: Press [?] anytime to toggle this view</span>
          <button
            onClick={() => {
              soundEffects.playBackTone();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-orange-500 text-black font-bold text-xs hover:bg-orange-400 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
