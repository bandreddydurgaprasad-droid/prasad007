/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Channel, Movie, ActiveScreen, ChannelCategory, ChannelSortOption } from './types';
import { RAW_NOTEPAD_DEFAULT, parseNotepadToChannels, refreshChannelLogos } from './data/defaultChannels';
import { DEFAULT_MOVIES } from './data/defaultMovies';
import { TVNavbar } from './components/TVNavbar';
import { ChannelGrid, GridDensity } from './components/ChannelGrid';
import { MoviesGrid } from './components/MoviesGrid';
import { TVPlayer } from './components/TVPlayer';
import { MiniPlayer } from './components/MiniPlayer';
import { TVRemote } from './components/TVRemote';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { NotepadConfig } from './components/NotepadConfig';
import { EPGGuide } from './components/EPGGuide';
import { TVSettings } from './components/TVSettings';
import { TVTestingAndExport } from './components/TVTestingAndExport';
import { OfflineIndicator } from './components/OfflineIndicator';
import { soundEffects } from './utils/sound';
import { Tv, Star, Radio } from 'lucide-react';

const STORAGE_KEY_NOTEPAD = 'telugu_tv_notepad_config_v6';
const STORAGE_KEY_CHANNELS = 'telugu_tv_channels_v6';
const STORAGE_KEY_MOVIES = 'telugu_tv_movies_v2';
const STORAGE_KEY_SOUND = 'telugu_tv_sound_v1';
const STORAGE_KEY_DENSITY = 'telugu_tv_density_v1';
const STORAGE_KEY_SORT = 'telugu_tv_channel_sort';
const STORAGE_KEY_RECENT = 'telugu_tv_recent_v2';

export default function App() {
  // State: Notepad & Channels
  const [notepadText, setNotepadText] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NOTEPAD);
    const hasDeprecatedYupp = saved && (
      saved.includes('yupptv.com/channels/vissa-tv') ||
      saved.includes('yupptv.com/channels/99-tv') ||
      saved.includes('yupptv.com/channels/hmtv') ||
      saved.includes('yupptv.com/channels/t-news') ||
      saved.includes('yupptv.com/channels/inews') ||
      saved.includes('yupptv.com/channels/express-tv') ||
      saved.includes('yupptv.com/channels/pmc') ||
      saved.includes('yupptv.com/channels/studio-one') ||
      saved.includes('yupptv.com/channels/tana')
    );
    if (
      !saved ||
      saved.includes('pishow.tv') ||
      hasDeprecatedYupp ||
      !saved.includes('d3qs3d2rkhfqrt') ||
      !saved.includes('BHAKTHI') ||
      !saved.includes('HINDHUDHARMAM') ||
      !saved.includes('TCN') ||
      !saved.includes('CVR HEALTH') ||
      !saved.includes('T-SAT VIDYA') ||
      !saved.includes('NAAPTOL') ||
      !saved.includes('VISSA') ||
      !saved.includes('HARE KRSNA') ||
      !saved.includes('MANA TV') ||
      !saved.includes('SITI') ||
      !saved.includes('HATHWAY') ||
      !saved.includes('LOCAL TALKIES') ||
      !saved.includes('CLASSIC MOVIES') ||
      !saved.includes('GEMINI MUSIC') ||
      !saved.includes('SUN MUSIC')
    ) {
      localStorage.setItem(STORAGE_KEY_NOTEPAD, RAW_NOTEPAD_DEFAULT);
      return RAW_NOTEPAD_DEFAULT;
    }
    return saved;
  });

  const [channels, setChannels] = useState<Channel[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CHANNELS);
    if (saved) {
      try {
        const parsed: Channel[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasBrokenPishow = parsed.some(c => c.streamUrl?.includes('pishow.tv'));
          const hasBhakthi = parsed.some(c => c.name.toLowerCase().includes('bhakthi') || c.name.toLowerCase().includes('bakthi'));
          const hasHinduDharmam = parsed.some(c => c.name.toLowerCase().includes('dharmam') || c.name.toLowerCase().includes('darmam'));
          const hasTcn = parsed.some(c => c.name.toLowerCase().includes('tcn'));
          const hasCvr = parsed.some(c => c.name.toLowerCase().includes('cvr'));
          const hasTsat = parsed.some(c => c.name.toLowerCase().includes('vidya') || c.name.toLowerCase().includes('nipuna') || c.name.toLowerCase().includes('tsat'));
          const hasNaaptol = parsed.some(c => c.name.toLowerCase().includes('naaptol'));
          const hasVissa = parsed.some(c => c.name.toLowerCase().includes('vissa'));
          const hasHareKrsna = parsed.some(c => c.name.toLowerCase().includes('krsna') || c.name.toLowerCase().includes('krishna'));
          const hasMana = parsed.some(c => c.name.toLowerCase().includes('mana') || c.name.toLowerCase().includes('ap prime'));
          const hasSiti = parsed.some(c => c.name.toLowerCase().includes('siti'));
          const hasHathway = parsed.some(c => c.name.toLowerCase().includes('hathway'));
          const hasLocalTalkies = parsed.some(c => c.name.toLowerCase().includes('talkies') || c.name.toLowerCase().includes('takies'));
          const hasClassicMovies = parsed.some(c => c.name.toLowerCase().includes('classic'));
          const hasGeminiMusic = parsed.some(c => c.name.toLowerCase().includes('gemini music') || c.name.toLowerCase().includes('gemini'));
          const hasSunMusic = parsed.some(c => c.name.toLowerCase().includes('sun music'));

          if (
            !hasBrokenPishow &&
            hasBhakthi &&
            hasHinduDharmam &&
            hasTcn &&
            hasCvr &&
            hasTsat &&
            hasNaaptol &&
            hasVissa &&
            hasHareKrsna &&
            hasMana &&
            hasSiti &&
            hasHathway &&
            hasLocalTalkies &&
            hasClassicMovies &&
            hasGeminiMusic &&
            hasSunMusic
          ) {
            const upgraded = refreshChannelLogos(parsed);
            localStorage.setItem(STORAGE_KEY_CHANNELS, JSON.stringify(upgraded));
            return upgraded;
          }
        }
      } catch {
        // fallback
      }
    }
    const fresh = parseNotepadToChannels(RAW_NOTEPAD_DEFAULT);
    localStorage.setItem(STORAGE_KEY_CHANNELS, JSON.stringify(fresh));
    return fresh;
  });

  // State: Movies
  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MOVIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_MOVIES;
  });

  // Navigation & UI State
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('channels');
  const [selectedCategory, setSelectedCategory] = useState<ChannelCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRemoteOpen, setIsRemoteOpen] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SOUND);
    return saved ? JSON.parse(saved) : true;
  });
  const [gridDensity, setGridDensity] = useState<GridDensity>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DENSITY);
    return (saved as GridDensity) || 'fit';
  });

  const [channelSort, setChannelSort] = useState<ChannelSortOption>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SORT);
      if (saved === 'Default' || saved === 'Alphabetical' || saved === 'Number-based') {
        return saved as ChannelSortOption;
      }
    } catch {}
    return 'Default';
  });

  const handleSetGridDensity = (density: GridDensity) => {
    setGridDensity(density);
    localStorage.setItem(STORAGE_KEY_DENSITY, density);
  };

  const handleSetChannelSort = (sort: ChannelSortOption) => {
    setChannelSort(sort);
    try {
      localStorage.setItem(STORAGE_KEY_SORT, sort);
    } catch {}
  };

  // Player State
  const [activePlayerItem, setActivePlayerItem] = useState<{
    item: Channel | Movie;
    type: 'channel' | 'movie';
  } | null>(null);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState<boolean>(false);
  const [previousChannel, setPreviousChannel] = useState<Channel | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [recentChannelIds, setRecentChannelIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECENT);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Direct Number Tuning State
  const [digitBuffer, setDigitBuffer] = useState<string>('');
  const [tuningBanner, setTuningBanner] = useState<{ number: number; name?: string } | null>(null);

  // Spatial Focus State for Remote D-Pad
  const [focusedZone, setFocusedZone] = useState<'categories' | 'channels'>('channels');
  const [focusedChannelIndex, setFocusedChannelIndex] = useState(0);
  const [focusedMovieIndex, setFocusedMovieIndex] = useState(0);

  // Sync sound utility
  useEffect(() => {
    soundEffects.enabled = soundEnabled;
    localStorage.setItem(STORAGE_KEY_SOUND, JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Persist Channels when updated
  const handleUpdateChannels = (updated: Channel[]) => {
    setChannels(updated);
    localStorage.setItem(STORAGE_KEY_CHANNELS, JSON.stringify(updated));
  };

  // Save notepad text & re-parse
  const handleSaveNotepadText = (text: string) => {
    setNotepadText(text);
    localStorage.setItem(STORAGE_KEY_NOTEPAD, text);
    const parsed = parseNotepadToChannels(text);
    setChannels(parsed);
    localStorage.setItem(STORAGE_KEY_CHANNELS, JSON.stringify(parsed));
  };

  // Reset to original default
  const handleResetToDefault = () => {
    setNotepadText(RAW_NOTEPAD_DEFAULT);
    localStorage.removeItem(STORAGE_KEY_NOTEPAD);
    const defaultParsed = parseNotepadToChannels(RAW_NOTEPAD_DEFAULT);
    setChannels(defaultParsed);
    localStorage.removeItem(STORAGE_KEY_CHANNELS);
    setMovies(DEFAULT_MOVIES);
    localStorage.removeItem(STORAGE_KEY_MOVIES);
  };

  // Filtered & Sorted Channels
  const filteredChannels = useMemo(() => {
    const list = channels.filter((ch) => {
      if (ch.isHidden) return false;
      // Category filter
      if (selectedCategory === 'Favorites') {
        if (!ch.isFavorite) return false;
      } else if (selectedCategory !== 'All' && ch.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          ch.name.toLowerCase().includes(query) ||
          ch.category.toLowerCase().includes(query) ||
          String(ch.number).includes(query)
        );
      }
      return true;
    });

    if (channelSort === 'Alphabetical') {
      return [...list].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true })
      );
    }
    if (channelSort === 'Number-based') {
      return [...list].sort((a, b) => a.number - b.number);
    }
    return list;
  }, [channels, selectedCategory, searchQuery, channelSort]);

  // Favorites Count
  const favoritesCount = useMemo(() => {
    const chFavs = channels.filter((c) => c.isFavorite).length;
    const movFavs = movies.filter((m) => m.isFavorite).length;
    return chFavs + movFavs;
  }, [channels, movies]);

  // Recently Watched Channels
  const recentChannels = useMemo(() => {
    return recentChannelIds
      .map((id) => channels.find((ch) => ch.id === id))
      .filter((ch): ch is Channel => ch !== undefined && !ch.isHidden);
  }, [recentChannelIds, channels]);

  // Unified Channel Selection with Recall & Recent Tracking
  const handleSelectChannel = useCallback(
    (channel: Channel) => {
      if (activePlayerItem?.type === 'channel' && (activePlayerItem.item as Channel).id !== channel.id) {
        setPreviousChannel(activePlayerItem.item as Channel);
      }
      setActivePlayerItem({ item: channel, type: 'channel' });
      setIsPlayerMinimized(false);

      // Persist to recent channels
      setRecentChannelIds((prev) => {
        const next = [channel.id, ...prev.filter((id) => id !== channel.id)].slice(0, 8);
        try {
          localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [activePlayerItem]
  );

  // Channel Recall (Previous Channel Zap)
  const handleRecallChannel = useCallback(() => {
    if (previousChannel) {
      soundEffects.playSelectChime();
      handleSelectChannel(previousChannel);
    }
  }, [previousChannel, handleSelectChannel]);

  // Toggle channel favorite
  const handleToggleFavoriteChannel = (channelId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = channels.map((ch) =>
      ch.id === channelId ? { ...ch, isFavorite: !ch.isFavorite } : ch
    );
    handleUpdateChannels(updated);
  };

  // Toggle movie favorite
  const handleToggleFavoriteMovie = (movieId: string) => {
    const updated = movies.map((m) =>
      m.id === movieId ? { ...m, isFavorite: !m.isFavorite } : m
    );
    setMovies(updated);
    localStorage.setItem(STORAGE_KEY_MOVIES, JSON.stringify(updated));
  };

  // Tuning channel directly by number
  const tuneToChannelNumber = useCallback(
    (num: number) => {
      const match = channels.find((c) => c.number === num);
      if (match) {
        setTuningBanner({ number: num, name: match.name });
        setTimeout(() => {
          setActivePlayerItem({ item: match, type: 'channel' });
          setTuningBanner(null);
        }, 1200);
      } else {
        setTuningBanner({ number: num });
        setTimeout(() => setTuningBanner(null), 1500);
      }
    },
    [channels]
  );

  // Handle number input (supports multiple digits like 1 then 0 -> 10)
  const handleNumberInput = useCallback(
    (digit: number) => {
      soundEffects.playNavTick();
      const nextBuf = digitBuffer + String(digit);
      setDigitBuffer(nextBuf);
      const targetNum = parseInt(nextBuf, 10);
      tuneToChannelNumber(targetNum);

      // Clear buffer after 2 seconds
      setTimeout(() => {
        setDigitBuffer('');
      }, 2000);
    },
    [digitBuffer, tuneToChannelNumber]
  );

  // Channel Next / Prev surf
  const handleNextChannel = useCallback(() => {
    if (!activePlayerItem || activePlayerItem.type !== 'channel') return;
    const currentCh = activePlayerItem.item as Channel;
    const idx = channels.findIndex((c) => c.id === currentCh.id);
    const nextIdx = (idx + 1) % channels.length;
    handleSelectChannel(channels[nextIdx]);
  }, [activePlayerItem, channels, handleSelectChannel]);

  const handlePrevChannel = useCallback(() => {
    if (!activePlayerItem || activePlayerItem.type !== 'channel') return;
    const currentCh = activePlayerItem.item as Channel;
    const idx = channels.findIndex((c) => c.id === currentCh.id);
    const prevIdx = (idx - 1 + channels.length) % channels.length;
    handleSelectChannel(channels[prevIdx]);
  }, [activePlayerItem, channels, handleSelectChannel]);

  // Spatial D-pad Navigation Handler
  const handleDpadNavigate = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      soundEffects.playNavTick();

      if (activeScreen === 'channels') {
        const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
        let columns = 6;
        if (gridDensity === 'detailed') {
          columns = w >= 1024 ? 4 : w >= 768 ? 3 : w >= 640 ? 2 : 1;
        } else {
          columns = w >= 1280 ? 6 : w >= 1024 ? 5 : w >= 768 ? 4 : w >= 640 ? 3 : 2;
        }

        if (direction === 'up') {
          if (focusedChannelIndex < columns) {
            setFocusedZone('categories');
          } else {
            setFocusedChannelIndex((prev) => Math.max(0, prev - columns));
          }
        } else if (direction === 'down') {
          if (focusedZone === 'categories') {
            setFocusedZone('channels');
          } else {
            setFocusedChannelIndex((prev) =>
              Math.min(filteredChannels.length - 1, prev + columns)
            );
          }
        } else if (direction === 'left') {
          setFocusedChannelIndex((prev) => Math.max(0, prev - 1));
        } else if (direction === 'right') {
          setFocusedChannelIndex((prev) =>
            Math.min(filteredChannels.length - 1, prev + 1)
          );
        }
      } else if (activeScreen === 'movies') {
        if (direction === 'left') {
          setFocusedMovieIndex((prev) => Math.max(0, prev - 1));
        } else if (direction === 'right') {
          setFocusedMovieIndex((prev) => Math.min(movies.length - 1, prev + 1));
        } else if (direction === 'up') {
          setFocusedMovieIndex((prev) => Math.max(0, prev - 3));
        } else if (direction === 'down') {
          setFocusedMovieIndex((prev) => Math.min(movies.length - 1, prev + 3));
        }
      }
    },
    [activeScreen, focusedChannelIndex, focusedMovieIndex, focusedZone, filteredChannels.length, movies.length, gridDensity]
  );

  // D-pad Select (OK)
  const handleDpadSelect = useCallback(() => {
    soundEffects.playSelectChime();
    if (activeScreen === 'channels' && filteredChannels.length > 0) {
      const selected = filteredChannels[focusedChannelIndex];
      if (selected) {
        handleSelectChannel(selected);
      }
    } else if (activeScreen === 'movies' && movies.length > 0) {
      const selected = movies[focusedMovieIndex];
      if (selected) {
        setActivePlayerItem({ item: selected, type: 'movie' });
        setIsPlayerMinimized(false);
      }
    }
  }, [activeScreen, filteredChannels, focusedChannelIndex, focusedMovieIndex, movies, handleSelectChannel]);

  // Back action
  const handleDpadBack = useCallback(() => {
    soundEffects.playBackTone();
    if (isShortcutsOpen) {
      setIsShortcutsOpen(false);
    } else if (activePlayerItem) {
      setActivePlayerItem(null);
      setIsPlayerMinimized(false);
    } else if (activeScreen !== 'channels') {
      setActiveScreen('channels');
    }
  }, [isShortcutsOpen, activePlayerItem, activeScreen]);

  // Keyboard Event Listener for Android TV Remote / Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting inside textarea / input fields
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handleDpadNavigate('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleDpadNavigate('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleDpadNavigate('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleDpadNavigate('right');
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleDpadSelect();
          break;
        case 'Escape':
        case 'Backspace':
          e.preventDefault();
          handleDpadBack();
          break;
        case 'PageUp':
          e.preventDefault();
          handlePrevChannel();
          break;
        case 'PageDown':
          e.preventDefault();
          handleNextChannel();
          break;
        case 'q':
        case 'Q':
          e.preventDefault();
          handleRecallChannel();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          if (activePlayerItem) {
            setIsPlayerMinimized((prev) => !prev);
          }
          break;
        case '?':
          e.preventDefault();
          setIsShortcutsOpen((prev) => !prev);
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          setIsRemoteOpen((prev) => !prev);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          if (activePlayerItem) {
            if (activePlayerItem.type === 'channel') {
              handleToggleFavoriteChannel(activePlayerItem.item.id);
            } else {
              handleToggleFavoriteMovie(activePlayerItem.item.id);
            }
          }
          break;
        default:
          // Check digit keys 0-9
          if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            handleNumberInput(parseInt(e.key, 10));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleDpadNavigate,
    handleDpadSelect,
    handleDpadBack,
    handleNextChannel,
    handlePrevChannel,
    handleRecallChannel,
    handleNumberInput,
    activePlayerItem,
  ]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] flex flex-col font-sans selection:bg-orange-500 selection:text-black">
      {/* Top TV Navigation Bar */}
      <TVNavbar
        activeScreen={activeScreen}
        onSelectScreen={(screen) => {
          soundEffects.playNavTick();
          setActiveScreen(screen);
        }}
        favoritesCount={favoritesCount}
        channelsCount={channels.filter((c) => !c.isHidden).length}
        moviesCount={movies.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isRemoteOpen={isRemoteOpen}
        onToggleRemote={() => setIsRemoteOpen(!isRemoteOpen)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        focusedIndex={0}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-5 lg:px-6 py-2 sm:py-2.5">
        {/* Direct Numeric Tuning Banner Overlay */}
        {tuningBanner && (
          <div className="fixed top-20 right-8 z-50 animate-bounce bg-[#121212] border-2 border-orange-500 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 font-mono">
            <Radio className="w-5 h-5 text-orange-400 animate-pulse" />
            <div>
              <span className="text-xs text-orange-400 font-bold block">
                TUNING TO CHANNEL
              </span>
              <span className="text-lg font-bold font-mono">
                CH {String(tuningBanner.number).padStart(2, '0')}{' '}
                {tuningBanner.name ? `- ${tuningBanner.name}` : '(Searching...)'}
              </span>
            </div>
          </div>
        )}

        {/* View 1: Live TV Channels */}
        {activeScreen === 'channels' && (
          <ChannelGrid
            channels={filteredChannels}
            recentChannels={recentChannels}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              soundEffects.playNavTick();
              setSelectedCategory(cat);
            }}
            onSelectChannel={(ch) => {
              soundEffects.playSelectChime();
              handleSelectChannel(ch);
            }}
            onToggleFavorite={handleToggleFavoriteChannel}
            focusedChannelIndex={focusedChannelIndex}
            focusedZone={focusedZone}
            density={gridDensity}
            onChangeDensity={handleSetGridDensity}
          />
        )}

        {/* View 2: Telugu Movies */}
        {activeScreen === 'movies' && (
          <MoviesGrid
            movies={movies}
            onSelectMovie={(movie) => {
              soundEffects.playSelectChime();
              setActivePlayerItem({ item: movie, type: 'movie' });
              setIsPlayerMinimized(false);
            }}
            onToggleFavoriteMovie={handleToggleFavoriteMovie}
            focusedMovieIndex={focusedMovieIndex}
          />
        )}

        {/* View 3: Favorites Screen */}
        {activeScreen === 'favorites' && (
          <div className="space-y-6 pb-12">
            <div className="flex items-center gap-3 bg-[#121212] border border-white/5 p-4 rounded-xl">
              <div className="p-2.5 rounded-lg bg-white/10 text-orange-400">
                <Star className="w-5 h-5 fill-orange-400" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-mono uppercase">
                  Your Favorite Channels &amp; Movies
                </h2>
                <p className="text-xs text-white/50">
                  Quick access to all your pinned Telugu broadcasts and cinema classics.
                </p>
              </div>
            </div>

            {/* Favorite Channels */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase">
                <Tv className="w-4 h-4 text-orange-400" />
                <span>Favorite Live TV Channels ({channels.filter((c) => c.isFavorite).length})</span>
              </h3>
              <ChannelGrid
                channels={channels.filter((c) => c.isFavorite)}
                selectedCategory="All"
                onSelectCategory={() => {}}
                onSelectChannel={(ch) => {
                  soundEffects.playSelectChime();
                  handleSelectChannel(ch);
                }}
                onToggleFavorite={handleToggleFavoriteChannel}
                focusedChannelIndex={0}
                focusedZone="channels"
                density={gridDensity}
                onChangeDensity={handleSetGridDensity}
                sortBy={channelSort}
                onChangeSort={handleSetChannelSort}
              />
            </div>
          </div>
        )}

        {/* View 4: Given Notepad & IPTV Configuration */}
        {activeScreen === 'notepad' && (
          <NotepadConfig
            notepadText={notepadText}
            onSaveNotepadText={handleSaveNotepadText}
            channels={channels}
            onUpdateChannels={handleUpdateChannels}
            onResetToDefault={handleResetToDefault}
          />
        )}

        {/* View 5: TV Guide (EPG) */}
        {activeScreen === 'guide' && (
          <EPGGuide
            channels={channels}
            onSelectChannel={(ch) => {
              handleSelectChannel(ch);
            }}
          />
        )}

        {/* View 6: Settings */}
        {activeScreen === 'settings' && (
          <TVSettings
            soundEnabled={soundEnabled}
            onToggleSound={setSoundEnabled}
            onResetAll={handleResetToDefault}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            onOpenTesting={() => setActiveScreen('testing')}
          />
        )}

        {/* View 7: TV Testing, Security Pentest & USB APK Hub */}
        {activeScreen === 'testing' && (
          <TVTestingAndExport
            channels={channels}
            notepadText={notepadText}
            onClose={() => setActiveScreen('channels')}
          />
        )}
      </main>

      {/* Android TV Video Player Overlay (Full View) */}
      {activePlayerItem && !isPlayerMinimized && (
        <TVPlayer
          item={activePlayerItem.item}
          itemType={activePlayerItem.type}
          channels={channels.filter((c) => !c.isHidden)}
          recentChannels={recentChannels}
          previousChannel={previousChannel}
          onClose={() => {
            setActivePlayerItem(null);
            setIsPlayerMinimized(false);
          }}
          onMinimize={() => setIsPlayerMinimized(true)}
          onNextChannel={handleNextChannel}
          onPrevChannel={handlePrevChannel}
          onRecallChannel={handleRecallChannel}
          onSelectChannel={handleSelectChannel}
          onToggleFavorite={() => {
            if (activePlayerItem.type === 'channel') {
              handleToggleFavoriteChannel(activePlayerItem.item.id);
            } else {
              handleToggleFavoriteMovie(activePlayerItem.item.id);
            }
          }}
          isFavorite={
            activePlayerItem.type === 'channel'
              ? !!channels.find((c) => c.id === activePlayerItem.item.id)?.isFavorite
              : !!movies.find((m) => m.id === activePlayerItem.item.id)?.isFavorite
          }
        />
      )}

      {/* Floating In-App Mini Player (when browsing guide/channels/settings while streaming) */}
      {activePlayerItem && isPlayerMinimized && (
        <MiniPlayer
          item={activePlayerItem.item}
          itemType={activePlayerItem.type}
          onMaximize={() => setIsPlayerMinimized(false)}
          onClose={() => {
            setActivePlayerItem(null);
            setIsPlayerMinimized(false);
          }}
          onNextChannel={handleNextChannel}
          onPrevChannel={handlePrevChannel}
          onToggleFavorite={() => {
            if (activePlayerItem.type === 'channel') {
              handleToggleFavoriteChannel(activePlayerItem.item.id);
            } else {
              handleToggleFavoriteMovie(activePlayerItem.item.id);
            }
          }}
          isFavorite={
            activePlayerItem.type === 'channel'
              ? !!channels.find((c) => c.id === activePlayerItem.item.id)?.isFavorite
              : !!movies.find((m) => m.id === activePlayerItem.item.id)?.isFavorite
          }
        />
      )}

      {/* Android TV Virtual Remote Controller */}
      <TVRemote
        isOpen={isRemoteOpen}
        onClose={() => setIsRemoteOpen(false)}
        onNavigate={handleDpadNavigate}
        onSelect={handleDpadSelect}
        onBack={handleDpadBack}
        onHome={() => {
          soundEffects.playNavTick();
          setActivePlayerItem(null);
          setIsPlayerMinimized(false);
          setActiveScreen('channels');
        }}
        onMenu={() => {
          soundEffects.playNavTick();
          setActiveScreen('notepad');
        }}
        onChannelChange={(delta) => {
          if (delta > 0) handleNextChannel();
          else handlePrevChannel();
        }}
        onVolumeChange={() => {
          soundEffects.playNavTick();
        }}
        onToggleMute={() => {
          soundEffects.playNavTick();
        }}
        onToggleFavorite={() => {
          if (activePlayerItem) {
            if (activePlayerItem.type === 'channel') {
              handleToggleFavoriteChannel(activePlayerItem.item.id);
            } else {
              handleToggleFavoriteMovie(activePlayerItem.item.id);
            }
          } else if (activeScreen === 'channels' && filteredChannels[focusedChannelIndex]) {
            handleToggleFavoriteChannel(filteredChannels[focusedChannelIndex].id);
          }
        }}
        onNumberPress={handleNumberInput}
        onRecall={handleRecallChannel}
        onMinimize={() => {
          if (activePlayerItem) {
            setIsPlayerMinimized((prev) => !prev);
          }
        }}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        isMuted={false}
      />

      {/* Keyboard / TV Remote Shortcuts Modal Guide */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Network Connectivity / Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
}
