import React from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Star, ExternalLink, Radio } from 'lucide-react';
import { Channel, Movie } from '../types';
import { soundEffects } from '../utils/sound';
import { generateLogoUrl } from '../data/defaultChannels';

interface MiniPlayerProps {
  item: Channel | Movie;
  itemType: 'channel' | 'movie';
  onMaximize: () => void;
  onClose: () => void;
  onNextChannel?: () => void;
  onPrevChannel?: () => void;
  onToggleFavorite?: () => void;
  isFavorite: boolean;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  item,
  itemType,
  onMaximize,
  onClose,
  onNextChannel,
  onPrevChannel,
  onToggleFavorite,
  isFavorite,
}) => {
  const isChannel = itemType === 'channel';
  const channel = isChannel ? (item as Channel) : null;
  const movie = !isChannel ? (item as Movie) : null;

  const embedSource = (() => {
    if (isChannel) {
      return channel?.embedUrl || channel?.streamUrl || '';
    }
    const url = movie?.videoUrl || '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('v=')) {
        videoId = url.split('v=')[1]?.split('&')[0] || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      } else if (url.includes('embed/')) {
        videoId = url.split('embed/')[1]?.split('?')[0] || '';
      }
      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1`;
      }
    }
    return url;
  })();

  return (
    <div
      id="android-tv-mini-player"
      className="fixed bottom-20 sm:bottom-6 right-4 z-40 w-80 sm:w-96 bg-[#0a0a0a] border border-orange-500/30 rounded-2xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col animate-slideUp transition-all select-none ring-1 ring-white/10"
    >
      {/* Mini Player Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#121212] border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          {isChannel && channel && (
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500 text-black shrink-0">
              CH {String(channel.number).padStart(2, '0')}
            </span>
          )}
          <span className="text-xs font-bold text-white truncate">
            {isChannel ? channel?.name : movie?.title}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            id="mini-player-btn-maximize"
            onClick={() => {
              soundEffects.playSelectChime();
              onMaximize();
            }}
            className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Expand to Full Player"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            id="mini-player-btn-close"
            onClick={() => {
              soundEffects.playBackTone();
              onClose();
            }}
            className="p-1 rounded-md text-white/70 hover:text-red-400 hover:bg-white/10 transition-colors"
            title="Close Player"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mini Video Frame */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
        {channel?.streamUrl?.includes('.m3u8') ? (
          <video
            src={channel.streamUrl}
            className="w-full h-full object-contain"
            autoPlay
            playsInline
            controls={false}
          />
        ) : embedSource ? (
          <iframe
            src={embedSource}
            title={item.title || (item as Channel).name}
            className="w-full h-full border-none pointer-events-auto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <Radio className="w-8 h-8 text-neutral-600 mb-1" />
            <span className="text-xs text-neutral-400">Playing Live Audio & Video</span>
          </div>
        )}
      </div>

      {/* Mini Player Bottom Controls */}
      <div className="px-3 py-2 bg-[#0e0e0e] flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1">
          {onPrevChannel && (
            <button
              onClick={() => {
                soundEffects.playNavTick();
                onPrevChannel();
              }}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white transition-colors"
              title="Previous Channel"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
          {onNextChannel && (
            <button
              onClick={() => {
                soundEffects.playNavTick();
                onNextChannel();
              }}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white transition-colors"
              title="Next Channel"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
          {onToggleFavorite && (
            <button
              onClick={() => {
                soundEffects.playSelectChime();
                onToggleFavorite();
              }}
              className={`p-1.5 rounded transition-colors ${
                isFavorite ? 'text-orange-400 bg-orange-500/10' : 'text-white/60 hover:text-white bg-white/5'
              }`}
              title="Favorite"
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {isChannel && channel && (channel.officialWebsite || channel.livePortalUrl) && (
          <a
            href={channel.officialWebsite || channel.livePortalUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[10px] font-semibold text-orange-400 hover:underline"
          >
            <span>Live TV Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
