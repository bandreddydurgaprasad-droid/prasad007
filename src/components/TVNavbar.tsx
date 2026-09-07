import React, { useState, useEffect } from 'react';
import {
  Tv,
  Film,
  Star,
  FileCode2,
  Calendar,
  Radio,
  SlidersHorizontal,
  Wifi,
  Search,
  Cast,
  Keyboard,
  ShieldCheck
} from 'lucide-react';
import { ActiveScreen } from '../types';
import { APP_LOGO } from '../assets/logo';
import { PWAInstallButton } from './PWAInstallButton';

interface TVNavbarProps {
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
  favoritesCount: number;
  channelsCount: number;
  moviesCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isRemoteOpen: boolean;
  onToggleRemote: () => void;
  onOpenShortcuts?: () => void;
  focusedIndex: number;
}

export const TVNavbar: React.FC<TVNavbarProps> = ({
  activeScreen,
  onSelectScreen,
  favoritesCount,
  channelsCount,
  moviesCount,
  searchQuery,
  onSearchChange,
  isRemoteOpen,
  onToggleRemote,
  onOpenShortcuts,
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems: { id: ActiveScreen; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: 'channels', label: 'Live TV', icon: <Tv className="w-4 h-4" />, badge: channelsCount },
    { id: 'movies', label: 'Telugu Movies', icon: <Film className="w-4 h-4" />, badge: moviesCount },
    { id: 'favorites', label: 'Favorites', icon: <Star className="w-4 h-4 text-orange-400" />, badge: favoritesCount },
    { id: 'guide', label: 'TV Guide (EPG)', icon: <Calendar className="w-4 h-4" /> },
    { id: 'notepad', label: 'Notepad & IPTV', icon: <FileCode2 className="w-4 h-4 text-orange-400" />, badge: 'Config' },
    { id: 'testing', label: 'TV Lab & APK', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, badge: 'USB' },
    { id: 'settings', label: 'Settings', icon: <SlidersHorizontal className="w-4 h-4" /> },
  ];

  return (
    <header
      id="android-tv-navbar"
      className="sticky top-0 z-40 w-full bg-[#080808] border-b border-white/5 px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3"
    >
      {/* Brand & Platform Emblem - Geometric Balance */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden border border-orange-500/40 shadow-md shadow-orange-950/40 bg-[#121212] shrink-0 group">
          <img
            src={APP_LOGO}
            alt="Telugu TV Android App Logo"
            className="w-full h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-sm sm:text-lg tracking-tight text-white font-['Outfit']">
              TELUGU <span className="text-orange-500">ULTRA TV</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/20 font-bold uppercase tracking-wider">
              Android TV
            </span>
          </div>
          <p className="text-[10px] text-white/50 hidden sm:block font-mono tracking-tight leading-none mt-0.5">
            HYDERABAD, TS • FREE LIVE IPTV &amp; CINEMA
          </p>
        </div>
      </div>

      {/* Center Screen Selection Tabs - Geometric TV remote friendly */}
      <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-0.5">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          const isChannelsTab = item.id === 'channels';

          if (isChannelsTab) {
            return (
              <button
                key={item.id}
                id={`tv-nav-tab-${item.id}`}
                onClick={() => onSelectScreen(item.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap bg-[#F8F9FA] text-neutral-900 shadow-md ${
                  isActive
                    ? 'ring-2 ring-orange-500 border-2 border-orange-500 shadow-orange-500/20 scale-[1.03] font-black'
                    : 'border border-neutral-300/80 hover:bg-white hover:scale-[1.01]'
                }`}
                title="Browse all live Telugu IPTV channels"
              >
                <Tv className="w-4 h-4 text-orange-600 stroke-[2.5]" />
                <span className="tracking-tight text-neutral-900 font-extrabold">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="text-[10px] sm:text-xs font-mono font-black px-2 py-0.5 rounded-md bg-orange-500 text-black shadow-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`tv-nav-tab-${item.id}`}
              onClick={() => onSelectScreen(item.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
                isActive
                  ? 'bg-white text-neutral-900 shadow-lg border border-orange-500 ring-2 ring-orange-500/30 font-bold'
                  : 'text-[#E0E0E0]/60 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span
                  className={`text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-orange-500 text-black'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Search, Remote Toggle, Time */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Search Bar */}
        <div className="relative hidden md:block w-44 lg:w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            id="tv-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search channels..."
            className="w-full bg-[#121212] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-sans"
          />
        </div>

        {/* PWA Direct Installation Button */}
        <PWAInstallButton />

        {/* Remote Controller Toggle Button */}
        <button
          id="tv-btn-toggle-remote"
          onClick={onToggleRemote}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            isRemoteOpen
              ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
              : 'bg-[#121212] hover:bg-white/10 text-[#E0E0E0] border border-white/10'
          }`}
          title="Toggle Android TV On-Screen Remote (Shortcut: R)"
        >
          <Cast className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Remote</span>
          <span className="text-[10px] opacity-70 font-mono hidden sm:inline">[R]</span>
        </button>

        {/* Keyboard Shortcuts Helper Button */}
        {onOpenShortcuts && (
          <button
            id="tv-btn-shortcuts-guide"
            onClick={onOpenShortcuts}
            className="p-1.5 rounded-lg bg-[#121212] hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-xs transition-colors"
            title="TV & Keyboard Controls Guide (Press ?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        )}

        {/* Network & Live Clock */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10 text-white/60 text-xs font-mono">
          <Wifi className="w-3.5 h-3.5 text-orange-400" title="Connected in High-Definition" />
          <span className="font-semibold text-white/90">{timeStr}</span>
        </div>
      </div>
    </header>
  );
};
