import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Star,
  Tv,
  Radio,
  RotateCcw,
  Sparkles,
  Layers,
  X,
  Moon,
  Volume1,
  Minimize2,
  Check,
  Zap,
  Sliders,
  SunMedium
} from 'lucide-react';
import Hls from 'hls.js';
import { Channel, Movie } from '../types';
import { soundEffects } from '../utils/sound';
import { generateLogoUrl, extractYouTubeId } from '../data/defaultChannels';

interface TVPlayerProps {
  item: Channel | Movie;
  itemType: 'channel' | 'movie';
  channels: Channel[];
  recentChannels?: Channel[];
  previousChannel?: Channel | null;
  onClose: () => void;
  onMinimize?: () => void;
  onNextChannel?: () => void;
  onPrevChannel?: () => void;
  onRecallChannel?: () => void;
  onSelectChannel?: (channel: Channel) => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

export const TVPlayer: React.FC<TVPlayerProps> = ({
  item,
  itemType,
  channels,
  recentChannels = [],
  previousChannel,
  onClose,
  onMinimize,
  onNextChannel,
  onPrevChannel,
  onRecallChannel,
  onSelectChannel,
  onToggleFavorite,
  isFavorite,
}) => {
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [volumeBoost, setVolumeBoost] = useState<100 | 150 | 200>(100);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | 'fill' | '4:3'>('16:9');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [ambilightEnabled, setAmbilightEnabled] = useState(true);

  // Sleep Timer State
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimeRemaining, setSleepTimeRemaining] = useState<number | null>(null);
  const [showSleepMenu, setShowSleepMenu] = useState(false);
  const [youtubePrivacyMode, setYoutubePrivacyMode] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isChannel = itemType === 'channel';
  const channel = isChannel ? (item as Channel) : null;
  const movie = !isChannel ? (item as Movie) : null;

  // Auto-hide controls timer
  const resetHideTimer = () => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setShowControls(false);
      setShowSleepMenu(false);
    }, 5000);
  };

  useEffect(() => {
    resetHideTimer();
    const handleActivity = () => resetHideTimer();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [item]);

  // Sleep timer countdown ticker
  useEffect(() => {
    if (sleepTimerMinutes === null) {
      setSleepTimeRemaining(null);
      return;
    }
    setSleepTimeRemaining(sleepTimerMinutes * 60);

    const interval = setInterval(() => {
      setSleepTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          soundEffects.playBackTone();
          onClose();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerMinutes, onClose]);

  // HLS Video initialization if stream is .m3u8
  const videoUrl = isChannel ? (channel?.streamUrl || '') : (movie?.videoUrl || '');
  const isHlsStream = videoUrl.includes('.m3u8');

  useEffect(() => {
    setStreamError(false);
    if (isHlsStream && videoRef.current) {
      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(videoUrl);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current?.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, () => {
          setStreamError(true);
        });
        hlsRef.current = hls;
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoUrl;
        videoRef.current.play().catch(() => {});
      }
    }
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoUrl, isHlsStream, reloadKey]);

  const toggleFullscreen = () => {
    soundEffects.playNavTick();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleNativePiP = async () => {
    soundEffects.playNavTick();
    if (videoRef.current && document.pictureInPictureEnabled) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
        return;
      } catch {
        // fallback
      }
    }
    if (onMinimize) {
      onMinimize();
    }
  };

  const cycleAspectRatio = () => {
    soundEffects.playNavTick();
    setAspectRatio((prev) => {
      if (prev === '16:9') return 'fill';
      if (prev === 'fill') return '4:3';
      return '16:9';
    });
  };

  const cycleVolumeBoost = () => {
    soundEffects.playNavTick();
    setVolumeBoost((prev) => {
      if (prev === 100) return 150;
      if (prev === 150) return 200;
      return 100;
    });
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'fill':
        return 'w-full h-full object-cover scale-105';
      case '4:3':
        return 'max-w-[75vw] h-full object-contain mx-auto';
      case '16:9':
      default:
        return 'w-full h-full object-contain';
    }
  };

  // Extract YouTube ID if current item is a YouTube live stream or video
  const ytVideoId = useMemo(() => {
    const rawUrl = isChannel ? (channel?.streamUrl || channel?.originalUrl || channel?.embedUrl) : movie?.videoUrl;
    return rawUrl ? extractYouTubeId(rawUrl) : null;
  }, [isChannel, channel, movie]);

  // Construct direct watch URL for standard browser playback (bypasses iframe restrictions in Firefox, Edge, Brave)
  const ytWatchUrl = useMemo(() => {
    if (!ytVideoId) return null;
    return `https://www.youtube.com/watch?v=${ytVideoId}`;
  }, [ytVideoId]);

  // Pop-out clean cinema window if popout requested
  const openPopoutPlayer = () => {
    if (ytWatchUrl) {
      soundEffects.playSelectChime();
      const popout = window.open(
        ytWatchUrl,
        'tv_popout_player',
        'width=1080,height=620,menubar=no,toolbar=no,location=no,status=no,resizable=yes'
      );
      if (popout) popout.opener = null;
    }
  };

  // Helper to construct secure, cross-browser compliant embed URL for YouTube or Web video
  const embedSource = useMemo(() => {
    if (ytVideoId) {
      const host = youtubePrivacyMode ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com';
      const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
      const params = new URLSearchParams({
        autoplay: '1',
        mute: isMuted ? '1' : '0',
        rel: '0',
        modestbranding: '1',
        enablejsapi: '1',
        playsinline: '1',
      });
      if (origin) {
        params.set('origin', origin);
        params.set('widget_referrer', window.location.href);
      }
      return `${host}/embed/${ytVideoId}?${params.toString()}`;
    }
    if (isChannel) {
      return channel?.embedUrl || channel?.streamUrl || '';
    }
    return movie?.videoUrl || '';
  }, [ytVideoId, youtubePrivacyMode, isMuted, isChannel, channel, movie]);

  const brandColor = channel?.logoColor || '#ea580c';

  return (
    <div
      ref={containerRef}
      id="android-tv-player-modal"
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* Dynamic Cinema Ambient Glow (Ambilight Effect) */}
      {ambilightEnabled && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40 blur-3xl transition-all duration-700 -z-10"
          style={{
            background: `radial-gradient(circle at center, ${brandColor} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Video Content Canvas */}
      <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
        {isHlsStream ? (
          <video
            key={`hls-video-${reloadKey}`}
            ref={videoRef}
            className={`transition-all duration-300 ${getAspectClass()}`}
            autoPlay
            playsInline
            muted={isMuted}
            controls={false}
          />
        ) : embedSource ? (
          <div className="w-full h-full flex items-center justify-center">
            <iframe
              key={`${embedSource}-${reloadKey}`}
              src={embedSource}
              title={item.title || (item as Channel).name}
              className={`w-full h-full border-none transition-all duration-300 ${
                aspectRatio === 'fill' ? 'scale-105' : aspectRatio === '4:3' ? 'max-w-[75vw]' : ''
              }`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-forms"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <Tv className="w-16 h-16 text-neutral-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Connecting to Live Stream</h3>
            <p className="text-xs text-neutral-400 max-w-md mb-4">
              Stream URL: {isChannel ? channel?.originalUrl : movie?.videoUrl}
            </p>
          </div>
        )}

        {/* Fallback overlay if stream encountered error */}
        {streamError && (
          <div className="absolute inset-0 bg-neutral-950/90 flex flex-col items-center justify-center p-6 text-center z-10">
            <Radio className="w-12 h-12 text-amber-500 mb-3" />
            <h4 className="text-lg font-bold text-white">Stream Signal Re-syncing</h4>
            <p className="text-xs text-neutral-400 max-w-md my-2">
              {ytVideoId
                ? 'Signal re-synchronizing inside the app player. Use in-app retry or switch stream engine.'
                : 'The live broadcast server is establishing link. Retrying stream or switch channel.'}
            </p>
            <div className="flex items-center gap-3 mt-4 flex-wrap justify-center">
              <button
                onClick={() => {
                  soundEffects.playSelectChime();
                  setStreamError(false);
                  setReloadKey(k => k + 1);
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black text-xs font-bold shadow-lg transition-transform hover:scale-105"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry In-App Stream</span>
              </button>
              {ytVideoId && (
                <button
                  onClick={() => {
                    soundEffects.playNavTick();
                    setYoutubePrivacyMode(!youtubePrivacyMode);
                    setStreamError(false);
                    setReloadKey(k => k + 1);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                >
                  Switch to {youtubePrivacyMode ? 'Standard (youtube.com)' : 'Privacy (nocookie)'}
                </button>
              )}
              {onNextChannel && (
                <button
                  onClick={onNextChannel}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors"
                >
                  Next Channel
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 10-foot On-Screen Display (OSD) Overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-8 bg-gradient-to-t from-[#050505]/95 via-transparent to-[#050505]/90 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top OSD Bar: Channel details, Sleep timer, Controls */}
        <div className="flex items-start justify-between gap-3 pointer-events-auto flex-wrap">
          <div className="flex items-center gap-3 max-w-xl">
            <button
              id="player-back-btn"
              onClick={() => {
                soundEffects.playBackTone();
                onClose();
              }}
              className="p-2.5 rounded-lg bg-[#121212] hover:bg-white/10 text-white border border-white/10 shadow-lg transition-all transform hover:scale-105"
              title="Return to Channel List (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            {isChannel && channel && (
              <div className="w-12 h-12 rounded-lg bg-[#080808] p-1 border border-white/10 shrink-0 overflow-hidden shadow-md">
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="w-full h-full object-contain rounded-md"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = generateLogoUrl(channel.name, brandColor);
                  }}
                />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {isChannel && channel && (
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-orange-500 text-black">
                    CH {String(channel.number).padStart(2, '0')}
                  </span>
                )}
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                  {isChannel ? channel?.name : movie?.title}
                </h2>
                <div className="flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>{isChannel ? (ytVideoId ? 'YOUTUBE LIVE' : 'LIVE HD') : movie?.quality || '4K'}</span>
                </div>
              </div>

              <p className="text-xs text-white/70 mt-1 flex items-center gap-2">
                <span className="text-orange-400 font-semibold font-mono">
                  {isChannel ? channel?.category : movie?.genre}
                </span>
                <span>•</span>
                <span className="truncate max-w-xs sm:max-w-md text-white/50 font-sans">
                  {isChannel
                    ? (channel?.epgCurrent || 'Live Transmission')
                    : `${movie?.year} | Director: ${movie?.director}`}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Settings: Sleep Timer, Aspect, Ambient Glow, PiP, Favorites */}
          <div className="flex items-center gap-1.5 sm:gap-2 relative flex-wrap justify-end">
            {/* In-App Stream Engine Controls */}
            {ytVideoId && (
              <div className="flex items-center gap-1 bg-neutral-900/90 border border-white/10 rounded-lg p-1 shadow-md">
                <button
                  id="yt-mode-toggle-btn"
                  onClick={() => {
                    soundEffects.playNavTick();
                    setYoutubePrivacyMode(!youtubePrivacyMode);
                  }}
                  className={`px-2 py-1.5 rounded-md text-[10px] font-mono transition-all ${
                    youtubePrivacyMode
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                      : 'bg-white/5 text-white/70 hover:text-white'
                  }`}
                  title={
                    youtubePrivacyMode
                      ? 'Using Privacy Host (youtube-nocookie.com). Click to switch to Standard.'
                      : 'Using Standard Host (youtube.com). Click to switch to Privacy.'
                  }
                >
                  {youtubePrivacyMode ? 'Privacy' : 'Standard'}
                </button>
                <button
                  id="stream-reload-btn"
                  onClick={() => {
                    soundEffects.playSelectChime();
                    setStreamError(false);
                    setReloadKey(k => k + 1);
                  }}
                  className="px-2 py-1.5 rounded-md bg-white/5 hover:bg-white/15 text-white/90 text-xs font-medium transition-all flex items-center gap-1"
                  title="Reload In-App Stream"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Reload</span>
                </button>
              </div>
            )}
            {/* Sleep Timer Indicator & Toggle */}
            <div className="relative">
              <button
                id="player-sleep-btn"
                onClick={() => {
                  soundEffects.playNavTick();
                  setShowSleepMenu(!showSleepMenu);
                }}
                className={`flex items-center gap-1 px-2.5 py-2 rounded-md border text-xs font-mono font-bold transition-all ${
                  sleepTimerMinutes !== null
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-[#121212] hover:bg-white/10 text-white border-white/10'
                }`}
                title="Sleep Timer"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>
                  {sleepTimeRemaining !== null
                    ? `${Math.floor(sleepTimeRemaining / 60)}m`
                    : 'Sleep'}
                </span>
              </button>

              {/* Sleep Menu Dropdown */}
              {showSleepMenu && (
                <div className="absolute top-full right-0 mt-2 w-44 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                  <div className="px-2 py-1 text-[10px] font-mono text-white/50 uppercase font-bold">
                    Sleep Timer
                  </div>
                  {[
                    { label: 'Off', val: null },
                    { label: '15 Minutes', val: 15 },
                    { label: '30 Minutes', val: 30 },
                    { label: '45 Minutes', val: 45 },
                    { label: '60 Minutes', val: 60 },
                    { label: '90 Minutes', val: 90 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => {
                        soundEffects.playSelectChime();
                        setSleepTimerMinutes(opt.val);
                        setShowSleepMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        sleepTimerMinutes === opt.val
                          ? 'bg-orange-500 text-black font-bold'
                          : 'text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sleepTimerMinutes === opt.val && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cinema Ambient Glow Toggle */}
            <button
              id="player-ambilight-btn"
              onClick={() => {
                soundEffects.playNavTick();
                setAmbilightEnabled(!ambilightEnabled);
              }}
              className={`p-2.5 rounded-md border transition-all ${
                ambilightEnabled
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                  : 'bg-[#121212] hover:bg-white/10 text-white/50 border-white/10'
              }`}
              title="Cinema Ambient Glow (Ambilight)"
            >
              <SunMedium className="w-4 h-4" />
            </button>

            {/* Picture-in-Picture / Floating Mini-Player */}
            {onMinimize && (
              <button
                id="player-pip-btn"
                onClick={handleNativePiP}
                className="p-2.5 rounded-md bg-[#121212] hover:bg-white/10 text-white border border-white/10 transition-all"
                title="Mini-Player / Picture-in-Picture"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            )}

            {/* Aspect Ratio */}
            <button
              id="player-aspect-btn"
              onClick={cycleAspectRatio}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#121212] hover:bg-white/10 text-white border border-white/10 text-xs font-mono font-bold transition-all"
              title="Change Aspect Ratio (16:9 / Fill / 4:3)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{aspectRatio.toUpperCase()}</span>
            </button>

            {/* Favorites Button */}
            <button
              id="player-fav-btn"
              onClick={() => {
                soundEffects.playSelectChime();
                onToggleFavorite();
              }}
              className={`p-2.5 rounded-md border transition-all ${
                isFavorite
                  ? 'bg-orange-500 text-black border-orange-500'
                  : 'bg-[#121212] hover:bg-white/10 text-white border-white/10'
              }`}
              title="Add to Favorites"
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Fullscreen Button */}
            <button
              id="player-fullscreen-btn"
              onClick={toggleFullscreen}
              className="p-2.5 rounded-md bg-[#121212] hover:bg-white/10 text-white border border-white/10 transition-all"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Bottom OSD Bar: Quick Channel Surfer & Playback Controls */}
        <div className="space-y-3 pointer-events-auto">
          {/* In-App Live Stream notice when YouTube stream is active */}
          {ytVideoId && (
            <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-neutral-900/90 border border-white/10 text-xs text-white/80 backdrop-blur-md shadow-lg flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                <span className="text-[11px] sm:text-xs">
                  In-App Live Stream Active. Full HD stream playing directly inside the application.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    soundEffects.playSelectChime();
                    setStreamError(false);
                    setReloadKey(k => k + 1);
                  }}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] flex items-center gap-1 transition-colors"
                  title="Refresh In-App Feed"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Refresh Feed</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between gap-3 bg-[#080808]/95 border border-white/10 backdrop-blur-md rounded-xl px-4 sm:px-6 py-2.5 shadow-2xl flex-wrap">
            <div className="flex items-center gap-2">
              {onPrevChannel && (
                <button
                  id="player-prev-ch-btn"
                  onClick={() => {
                    soundEffects.playNavTick();
                    onPrevChannel();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#121212] hover:bg-white/10 text-white border border-white/10 text-xs font-mono font-bold"
                  title="Previous Channel (PageUp / Down)"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev CH</span>
                </button>
              )}

              {/* Recall / Previous Channel Button */}
              {isChannel && onRecallChannel && previousChannel && (
                <button
                  id="player-recall-btn"
                  onClick={onRecallChannel}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-mono font-bold"
                  title={`Recall CH ${previousChannel.number}: ${previousChannel.name} (Shortcut: Q)`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Recall [Q]</span>
                </button>
              )}

              {onNextChannel && (
                <button
                  id="player-next-ch-btn"
                  onClick={() => {
                    soundEffects.playNavTick();
                    onNextChannel();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#121212] hover:bg-white/10 text-white border border-white/10 text-xs font-mono font-bold"
                  title="Next Channel (PageDown / Up)"
                >
                  <span>Next CH</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Volume, Boost & Audio Controls */}
            <div className="flex items-center gap-2">
              <button
                id="player-mute-btn"
                onClick={() => {
                  soundEffects.playNavTick();
                  setIsMuted(!isMuted);
                }}
                className="p-1.5 rounded-md text-white/70 hover:text-white"
                title="Mute / Unmute"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-orange-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setVolume(val);
                  setIsMuted(val === 0);
                  if (videoRef.current) videoRef.current.volume = val / 100;
                }}
                className="w-16 sm:w-24 accent-orange-500 cursor-pointer"
              />

              {/* Volume Boost Toggle */}
              <button
                id="player-vol-boost-btn"
                onClick={cycleVolumeBoost}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition-all ${
                  volumeBoost > 100
                    ? 'bg-orange-500 text-black border-orange-400 shadow'
                    : 'bg-[#121212] text-white/60 border-white/10 hover:text-white'
                }`}
                title="Boost audio volume for quiet regional broadcasts"
              >
                {volumeBoost}%
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
