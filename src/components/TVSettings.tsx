import React from 'react';
import {
  SlidersHorizontal,
  Volume2,
  Tv,
  Cast,
  Keyboard,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Check,
  Download
} from 'lucide-react';
import { soundEffects } from '../utils/sound';
import { APP_LOGO } from '../assets/logo';
import { PWAInstallButton } from './PWAInstallButton';

interface TVSettingsProps {
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  onResetAll: () => void;
  onOpenShortcuts?: () => void;
  onOpenTesting?: () => void;
}

export const TVSettings: React.FC<TVSettingsProps> = ({
  soundEnabled,
  onToggleSound,
  onResetAll,
  onOpenShortcuts,
  onOpenTesting,
}) => {
  return (
    <div id="tv-settings-container" className="space-y-6 pb-24 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 bg-[#121212] border border-white/5 p-6 rounded-xl">
        <div className="p-3 rounded-lg bg-white/10 text-orange-400">
          <SlidersHorizontal className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight font-mono uppercase">
            Android TV Display &amp; Remote Settings
          </h2>
          <p className="text-xs text-white/50">
            Configure playback behavior, remote controller sounds, and shortcut preferences.
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {/* Remote Feedback Audio */}
        <div className="bg-[#121212] border border-white/5 p-5 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#080808] border border-white/10 text-white/70">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">TV Remote Click Audio Feedback</h4>
              <p className="text-xs text-white/50">
                Auditory click and chime ticks when using the D-pad and remote navigation keys.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const next = !soundEnabled;
              soundEffects.enabled = next;
              onToggleSound(next);
              if (next) soundEffects.playSelectChime();
            }}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
              soundEnabled ? 'bg-orange-500' : 'bg-[#080808] border border-white/10'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-black transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Install Telugu Ultra TV as Native / PWA App */}
        <div className="bg-[#121212] border border-orange-500/20 p-5 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Install Application</span>
                <span className="text-[10px] bg-orange-500/10 text-orange-400 font-mono px-1.5 py-0.5 rounded border border-orange-500/20 font-bold uppercase">
                  PWA &amp; Android TV
                </span>
              </h4>
              <p className="text-xs text-white/50">
                Install as a standalone application on your Android TV, Smart TV browser, Phone, or PC.
              </p>
            </div>
          </div>
          <PWAInstallButton />
        </div>

        {/* Security Pentest, TV Hardware Lab & USB APK Hub */}
        {onOpenTesting && (
          <div className="bg-[#121212] border border-emerald-500/20 p-5 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Security Pentest, TV Lab &amp; USB APK</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">
                    Audit Passed
                  </span>
                </h4>
                <p className="text-xs text-white/50">
                  Run penetration test checks, test remote D-pad hardware, and export APK &amp; M3U files for TV USB install.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                soundEffects.playSelectChime();
                onOpenTesting();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-md shrink-0"
            >
              <span>Open TV Lab</span>
            </button>
          </div>
        )}

        {/* Video Quality Default */}
        <div className="bg-[#121212] border border-white/5 p-5 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#080808] border border-white/10 text-white/70">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Default Video Streaming Resolution</h4>
              <p className="text-xs text-white/50">
                Optimized for High Definition TV displays with automatic bandwidth scaling.
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs font-mono font-bold text-orange-400">
            Full HD (1080p / 4K UHD)
          </span>
        </div>

        {/* Remote Keys Quick Reference */}
        <div className="bg-[#121212] border border-white/5 p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-orange-400" />
              <h4 className="text-sm font-bold text-white font-mono uppercase">Android TV Remote Controller Guide</h4>
            </div>
            {onOpenShortcuts && (
              <button
                onClick={onOpenShortcuts}
                className="px-3 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold transition-colors"
              >
                View Full Cheatsheet [?]
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#080808] border border-white/10">
              <span className="text-white/60">Navigate Cards &amp; Menus</span>
              <span className="font-mono bg-white/10 border border-white/10 px-2 py-0.5 rounded text-white font-bold">
                Arrow Keys (↑ ↓ ← →)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#080808] border border-white/10">
              <span className="text-white/60">Select / Watch / OK</span>
              <span className="font-mono bg-white/10 border border-white/10 px-2 py-0.5 rounded text-white font-bold">
                Enter / Space
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#080808] border border-white/10">
              <span className="text-white/60">Recall Previous Channel</span>
              <span className="font-mono bg-white/10 border border-white/10 px-2 py-0.5 rounded text-orange-400 font-bold">
                Q Key
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#080808] border border-white/10">
              <span className="text-white/60">Float Mini-Player / PiP</span>
              <span className="font-mono bg-white/10 border border-white/10 px-2 py-0.5 rounded text-white font-bold">
                P Key
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#080808] border border-white/10">
              <span className="text-white/60">Return / Close Player</span>
              <span className="font-mono bg-white/10 border border-white/10 px-2 py-0.5 rounded text-white font-bold">
                Escape / Backspace
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#080808] border border-white/10">
              <span className="text-white/60">Toggle Virtual Remote</span>
              <span className="font-mono bg-white/10 border border-white/10 px-2 py-0.5 rounded text-white font-bold">
                R Key
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#080808] border border-white/10">
              <span className="text-white/60">Next / Previous Channel</span>
              <span className="font-mono bg-white/10 border border-white/10 px-2 py-0.5 rounded text-white font-bold">
                PageDown / PageUp
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#080808] border border-white/10">
              <span className="text-white/60">Direct Channel Tuning</span>
              <span className="font-mono bg-white/10 border border-white/10 px-2 py-0.5 rounded text-white font-bold">
                Number Keys 0 - 9
              </span>
            </div>
          </div>
        </div>

        {/* Reset */}
        <div className="bg-[#121212] border border-white/5 p-5 rounded-xl flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Reset Application Data</h4>
            <p className="text-xs text-white/50">
              Clears saved favorites and restores default Telugu TV channels and movies.
            </p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Reset all saved settings and channels to default?')) {
                onResetAll();
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-400 text-xs font-mono font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        </div>

        {/* App Identity & Android TV Specifications */}
        <div className="bg-[#121212] border border-white/5 p-6 rounded-xl flex flex-col sm:flex-row items-center gap-5">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-orange-500/40 shadow-2xl shadow-orange-950/40 bg-[#080808] shrink-0">
            <img
              src={APP_LOGO}
              alt="Telugu TV Android App Logo"
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
          </div>
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Telugu Ultra TV
              </h3>
              <span className="text-[10px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded font-bold uppercase">
                v2.4 Pro
              </span>
            </div>
            <p className="text-xs text-white/60">
              High-performance Android TV &amp; Leanback streaming application for free Telugu Live TV broadcasts, Tollywood cinema, and custom IPTV m3u playlists.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-[11px] font-mono text-white/40">
              <span>Resolution: 1080p / 4K UHD</span>
              <span>•</span>
              <span>D-Pad &amp; Remote Key Ready</span>
              <span>•</span>
              <span>Free-to-Air Public Feeds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
