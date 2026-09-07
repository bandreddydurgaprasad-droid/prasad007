import React from 'react';
import { Channel } from '../types';
import { Calendar, Play, Radio, Clock } from 'lucide-react';
import { soundEffects } from '../utils/sound';
import { generateLogoUrl } from '../data/defaultChannels';

interface EPGGuideProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
}

export const EPGGuide: React.FC<EPGGuideProps> = ({ channels, onSelectChannel }) => {
  const timeSlots = ['NOW (Live)', '11:00 PM', '12:00 AM', '01:00 AM', '02:00 AM'];

  return (
    <div id="tv-epg-guide-container" className="space-y-6 pb-24">
      <div className="flex items-center justify-between bg-[#121212] border border-white/5 p-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-white/10 text-orange-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-mono uppercase">
              Electronic Program Guide (EPG)
            </h2>
            <p className="text-xs text-white/50">
              Live broadcast schedules for free-to-air Telugu television channels
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
          <Clock className="w-4 h-4 text-orange-400" />
          <span>Real-time Live Sync</span>
        </div>
      </div>

      {/* Guide Schedule Grid */}
      <div className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        {/* Time Header Row */}
        <div className="grid grid-cols-12 bg-[#080808] border-b border-white/10 text-xs font-mono font-bold text-white/50 py-3 px-4 sticky top-0 z-10">
          <div className="col-span-3 sm:col-span-3 uppercase tracking-wider text-white/70">
            Telugu Channel
          </div>
          <div className="col-span-4 sm:col-span-4 flex items-center gap-1.5 text-orange-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>NOW PLAYING</span>
          </div>
          <div className="col-span-3 hidden sm:block text-white/50">
            UP NEXT
          </div>
          <div className="col-span-2 hidden md:block text-right pr-2">
            QUALITY
          </div>
        </div>

        {/* Channels Rows */}
        <div className="divide-y divide-white/5 max-h-[650px] overflow-y-auto scrollbar-thin">
          {channels.filter((c) => !c.isHidden).map((channel) => (
            <div
              key={channel.id}
              onClick={() => {
                soundEffects.playSelectChime();
                onSelectChannel(channel);
              }}
              className="grid grid-cols-12 items-center py-3.5 px-4 hover:bg-white/5 cursor-pointer transition-colors group"
            >
              {/* Channel identity */}
              <div className="col-span-3 flex items-center gap-3 min-w-0 pr-2">
                <span className="font-mono text-xs font-bold text-orange-400 bg-[#080808] px-2 py-1 rounded border border-white/10 shrink-0">
                  {String(channel.number).padStart(2, '0')}
                </span>

                <div className="w-8 h-8 rounded-lg bg-[#080808] p-1 border border-white/10 shrink-0 flex items-center justify-center">
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

                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-orange-400">
                    {channel.name}
                  </h4>
                  <span className="text-[10px] text-white/50 block truncate font-mono">
                    {channel.category}
                  </span>
                </div>
              </div>

              {/* Now Playing Slot */}
              <div className="col-span-4 pr-3">
                <div className="bg-[#080808] border border-white/10 rounded-lg p-2 group-hover:border-orange-500/50 transition-colors">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold text-white/90 truncate">
                      {channel.epgCurrent || 'Live Broadcast Transmission'}
                    </span>
                    <Play className="w-3 h-3 text-orange-400 fill-current shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {/* Progress bar representing broadcast time */}
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${(channel.number * 17) % 70 + 20}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Up Next Slot */}
              <div className="col-span-3 hidden sm:block pr-3">
                <div className="bg-[#080808]/60 border border-white/5 rounded-lg p-2">
                  <span className="text-xs text-white/60 truncate block">
                    {channel.epgNext || `${channel.name} Samacharam`}
                  </span>
                  <span className="text-[10px] text-white/40 mt-0.5 block font-mono">
                    Starting in 25 mins
                  </span>
                </div>
              </div>

              {/* Quality & Action */}
              <div className="col-span-2 hidden md:flex items-center justify-end gap-2 pr-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-white/70 border border-white/5">
                  {channel.quality}
                </span>
                <div className="w-7 h-7 rounded-md bg-white/10 group-hover:bg-orange-500 group-hover:text-black text-white flex items-center justify-center transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
