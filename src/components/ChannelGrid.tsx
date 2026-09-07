import React, { useState } from 'react';
import {
  Play,
  Star,
  Radio,
  Sparkles,
  Tv2,
  Maximize2,
  Grid3X3,
  LayoutGrid,
  History,
  GraduationCap
} from 'lucide-react';
import { Channel, ChannelCategory } from '../types';
import { generateLogoUrl } from '../data/defaultChannels';

export type GridDensity = 'fit' | 'compact' | 'detailed';

interface ChannelGridProps {
  channels: Channel[];
  recentChannels?: Channel[];
  selectedCategory: ChannelCategory;
  onSelectCategory: (cat: ChannelCategory) => void;
  onSelectChannel: (channel: Channel) => void;
  onToggleFavorite: (channelId: string, e?: React.MouseEvent) => void;
  focusedChannelIndex: number;
  focusedZone: 'categories' | 'channels';
  density?: GridDensity;
  onChangeDensity?: (density: GridDensity) => void;
}

const CATEGORIES: ChannelCategory[] = [
  'All',
  'News',
  'Cable TV',
  'Education',
  'Devotional',
  'Entertainment',
  'Music',
  'Movies',
  'Favorites',
];

export const ChannelGrid: React.FC<ChannelGridProps> = ({
  channels,
  recentChannels = [],
  selectedCategory,
  onSelectCategory,
  onSelectChannel,
  onToggleFavorite,
  focusedChannelIndex,
  focusedZone,
  density: controlledDensity,
  onChangeDensity,
}) => {
  const [internalDensity, setInternalDensity] = useState<GridDensity>('fit');
  const currentDensity = controlledDensity || internalDensity;

  const setDensity = (d: GridDensity) => {
    if (onChangeDensity) {
      onChangeDensity(d);
    } else {
      setInternalDensity(d);
    }
  };

  return (
    <div id="tv-channel-section" className="space-y-2 pb-6">
      {/* Top Controls Bar: Category Pills + Density Toggle */}
      <div className="flex items-center justify-between gap-2.5 flex-wrap">
        {/* Category Navigation Pills - Compact Sleek Design */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none flex-1 min-w-0">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const isCategoryFocused = focusedZone === 'categories' && isSelected;
            return (
              <button
                key={cat}
                id={`cat-pill-${cat.toLowerCase()}`}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-[13px] font-semibold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#F8F9FA] text-neutral-900 shadow-md font-bold border border-neutral-200 ring-2 ring-orange-500/40'
                    : 'bg-[#141414] text-[#E0E0E0]/70 hover:text-white hover:bg-white/10 border border-white/5'
                } ${isCategoryFocused ? 'ring-2 ring-orange-500 scale-105' : ''}`}
              >
                {cat === 'Favorites' && <Star className="w-3.5 h-3.5 fill-current text-orange-500" />}
                {cat === 'News' && <Radio className="w-3.5 h-3.5 text-red-400" />}
                {cat === 'Cable TV' && <Tv2 className="w-3.5 h-3.5 text-cyan-400" />}
                {cat === 'Education' && <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />}
                {cat === 'Devotional' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* View Density / Fit Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest hidden sm:inline">
            {channels.length} CHANNELS
          </span>
          <div className="flex items-center bg-[#121212] border border-white/10 rounded-md p-0.5">
            <button
              id="btn-density-fit"
              onClick={() => setDensity('fit')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all flex items-center gap-1 ${
                currentDensity === 'fit'
                  ? 'bg-orange-500 text-black font-bold shadow'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Fit to screen without scrolling down (Ultra-Compact)"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden md:inline">Fit Screen</span>
            </button>
            <button
              id="btn-density-compact"
              onClick={() => setDensity('compact')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all flex items-center gap-1 ${
                currentDensity === 'compact'
                  ? 'bg-orange-500 text-black font-bold shadow'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Compact tiles"
            >
              <Grid3X3 className="w-3 h-3" />
              <span className="hidden md:inline">Compact</span>
            </button>
            <button
              id="btn-density-detailed"
              onClick={() => setDensity('detailed')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all flex items-center gap-1 ${
                currentDensity === 'detailed'
                  ? 'bg-orange-500 text-black font-bold shadow'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Detailed cards with EPG"
            >
              <LayoutGrid className="w-3 h-3" />
              <span className="hidden md:inline">Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recently Watched Quick Strip (if available and viewing All) */}
      {recentChannels.length > 0 && selectedCategory === 'All' && (
        <div className="bg-[#101010] border border-white/5 rounded-xl px-3 py-2 flex items-center gap-3 overflow-x-auto scrollbar-none animate-fadeIn">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-orange-400 shrink-0 pr-2 border-r border-white/10">
            <History className="w-3.5 h-3.5" />
            <span>Recent:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
            {recentChannels.map((ch) => (
              <button
                key={`recent-${ch.id}`}
                onClick={() => onSelectChannel(ch)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-medium text-white/90 shrink-0 transition-all hover:border-orange-500/40 hover:scale-[1.02]"
              >
                <span className="font-mono text-[10px] text-orange-400 font-bold">
                  CH {String(ch.number).padStart(2, '0')}
                </span>
                <span className="truncate max-w-[120px]">{ch.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Channel Cards Grid */}
      {channels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-[#121212] rounded-xl border border-white/5 text-center px-4">
          <Tv2 className="w-12 h-12 text-neutral-600 mb-2" />
          <h3 className="text-base font-bold text-neutral-300 mb-1">No Channels Found</h3>
          <p className="text-xs text-neutral-500 max-w-sm">
            No channels match your current filter or search. Check the Notepad &amp; IPTV tab to add or customize streams.
          </p>
        </div>
      ) : currentDensity === 'fit' ? (
        /* Fit to Screen: Ultra-compact, fits channels on screen with no scroll */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-1.5 sm:gap-2">
          {channels.map((channel, index) => {
            const isFocused = focusedZone === 'channels' && focusedChannelIndex === index;

            return (
              <div
                key={channel.id}
                id={`channel-card-${channel.id}`}
                onClick={() => onSelectChannel(channel)}
                className={`group relative flex items-center gap-2.5 bg-[#121212] rounded-xl px-2.5 py-2 transition-all duration-150 cursor-pointer text-left overflow-hidden select-none ${
                  isFocused
                    ? 'border-2 border-orange-500 shadow-xl shadow-orange-500/20 scale-[1.02] bg-[#1a1a1a] z-10'
                    : 'border border-white/5 hover:border-orange-500/50 hover:bg-[#181818]'
                }`}
              >
                {/* Channel Number Badge */}
                <span className="font-mono text-[10px] font-bold text-orange-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 shrink-0">
                  {String(channel.number).padStart(2, '0')}
                </span>

                {/* Channel Logo */}
                <div className="w-8.5 h-8.5 rounded-lg bg-[#080808] p-0.5 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden group-hover:border-orange-500/40 transition-colors shadow-inner">
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="w-full h-full object-contain rounded-md"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = generateLogoUrl(channel.name, '#ea580c');
                    }}
                  />
                </div>

                {/* Channel Title & Info */}
                <div className="min-w-0 flex-1 flex flex-col justify-center">
                  <h4 className="text-xs font-bold text-white truncate tracking-tight group-hover:text-orange-400 transition-colors leading-tight">
                    {channel.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/50 leading-none mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                    <span className="truncate">{channel.category}</span>
                  </div>
                </div>

                {/* Actions: Favorite Star & Quick Play */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    id={`fav-btn-${channel.id}`}
                    onClick={(e) => onToggleFavorite(channel.id, e)}
                    className={`p-1 rounded transition-colors ${
                      channel.isFavorite
                        ? 'text-orange-400 hover:text-orange-300'
                        : 'text-white/20 hover:text-white/70'
                    }`}
                    title="Add to Favorites"
                  >
                    <Star className={`w-3.5 h-3.5 ${channel.isFavorite ? 'fill-orange-400' : ''}`} />
                  </button>
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                      isFocused
                        ? 'bg-orange-500 text-black'
                        : 'bg-white/5 text-white/50 group-hover:bg-white group-hover:text-black'
                    }`}
                  >
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : currentDensity === 'compact' ? (
        /* Compact Grid: Medium sleek tiles */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5">
          {channels.map((channel, index) => {
            const isFocused = focusedZone === 'channels' && focusedChannelIndex === index;

            return (
              <div
                key={channel.id}
                id={`channel-card-${channel.id}`}
                onClick={() => onSelectChannel(channel)}
                className={`group relative flex flex-col justify-between bg-[#121212] rounded-lg p-2.5 transition-all duration-150 cursor-pointer text-left overflow-hidden ${
                  isFocused
                    ? 'border-2 border-orange-500 shadow-xl shadow-orange-500/20 scale-[1.02] bg-[#181818] z-10'
                    : 'border border-white/5 hover:border-white/20 hover:bg-[#161616]'
                }`}
              >
                {/* Top Row: Channel Number, Live, Favorite */}
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-orange-400 border border-white/5">
                    CH {String(channel.number).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1 bg-red-600 px-1.5 py-0.5 rounded text-[9px] font-bold text-white tracking-wide">
                      <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                      <span>LIVE</span>
                    </div>
                    <button
                      id={`fav-btn-${channel.id}`}
                      onClick={(e) => onToggleFavorite(channel.id, e)}
                      className={`p-0.5 rounded transition-colors ${
                        channel.isFavorite
                          ? 'text-orange-400'
                          : 'text-white/20 hover:text-white/60'
                      }`}
                      title="Add to Favorites"
                    >
                      <Star className={`w-3.5 h-3.5 ${channel.isFavorite ? 'fill-orange-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Middle: Logo & Name */}
                <div className="flex items-center gap-2 my-1">
                  <div className="w-9 h-9 rounded bg-[#080808] p-1 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-full h-full object-contain rounded"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = generateLogoUrl(channel.name, '#ea580c');
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate tracking-tight group-hover:text-orange-400 transition-colors">
                      {channel.name}
                    </h4>
                    <span className="text-[10px] font-mono text-white/50 block truncate">
                      {channel.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Cards (4 Columns) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {channels.map((channel, index) => {
            const isFocused = focusedZone === 'channels' && focusedChannelIndex === index;

            return (
              <div
                key={channel.id}
                id={`channel-card-${channel.id}`}
                onClick={() => onSelectChannel(channel)}
                className={`group relative flex flex-col justify-between bg-[#121212] rounded-xl p-3.5 transition-all duration-200 cursor-pointer text-left overflow-hidden ${
                  isFocused
                    ? 'border-3 border-orange-500 shadow-2xl shadow-orange-500/20 scale-[1.02] bg-[#161616] z-10'
                    : 'border border-white/5 hover:border-white/20 hover:bg-[#161616]'
                }`}
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white/10 text-orange-400 border border-white/5">
                      CH {String(channel.number).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-white/70 border border-white/5">
                      {channel.quality}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold text-white tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>LIVE</span>
                    </div>

                    <button
                      id={`fav-btn-${channel.id}`}
                      onClick={(e) => onToggleFavorite(channel.id, e)}
                      className={`p-1 rounded-md transition-colors ${
                        channel.isFavorite
                          ? 'text-orange-400 hover:text-orange-300'
                          : 'text-white/30 hover:text-white/70'
                      }`}
                      title="Add to Favorites"
                    >
                      <Star className={`w-4 h-4 ${channel.isFavorite ? 'fill-orange-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Channel Center Logo & Title */}
                <div className="flex items-center gap-3 my-1.5">
                  <div className="w-12 h-12 rounded-lg bg-[#080808] p-1.5 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-orange-500/50 transition-colors">
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-full h-full object-contain rounded-md"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = generateLogoUrl(channel.name, '#ea580c');
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate tracking-tight group-hover:text-orange-400 transition-colors">
                      {channel.name}
                    </h4>
                    <span className="inline-block text-[10px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded mt-0.5 border border-white/5">
                      {channel.category}
                    </span>
                  </div>
                </div>

                {/* Broadcast Progress Bar */}
                <div className="w-full h-1 bg-white/10 mt-2 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-orange-500"></div>
                </div>

                {/* Bottom EPG Guide snippet & Quick Play Action */}
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-white/50 truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                      {channel.epgCurrent || 'Live Transmission'}
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                      isFocused
                        ? 'bg-orange-500 text-black scale-110 shadow-md shadow-orange-500/30'
                        : 'bg-white/10 text-white group-hover:bg-white group-hover:text-black'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

