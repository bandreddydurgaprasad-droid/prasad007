import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  FileCode2,
  Tv,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Download,
  Upload,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Star,
  Layers
} from 'lucide-react';
import { Channel, ChannelCategory } from '../types';
import { RAW_NOTEPAD_DEFAULT, generateLogoUrl } from '../data/defaultChannels';
import { soundEffects } from '../utils/sound';

interface NotepadConfigProps {
  notepadText: string;
  onSaveNotepadText: (text: string) => void;
  channels: Channel[];
  onUpdateChannels: (channels: Channel[]) => void;
  onResetToDefault: () => void;
}

export const NotepadConfig: React.FC<NotepadConfigProps> = ({
  notepadText,
  onSaveNotepadText,
  channels,
  onUpdateChannels,
  onResetToDefault,
}) => {
  const [currentText, setCurrentText] = useState(notepadText);
  const [activeTab, setActiveTab] = useState<'notepad' | 'manager' | 'm3u'>('notepad');
  const [m3uUrlInput, setM3uUrlInput] = useState('https://iptv-org.github.io/iptv/languages/tel.m3u');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New channel modal/form state
  const [newChName, setNewChName] = useState('');
  const [newChUrl, setNewChUrl] = useState('');
  const [newChCategory, setNewChCategory] = useState<Exclude<ChannelCategory, 'All' | 'Favorites'>>('News');

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleSaveText = () => {
    soundEffects.playSelectChime();
    onSaveNotepadText(currentText);
    showStatus('Notepad saved & channels refreshed successfully!');
  };

  const handleReset = () => {
    soundEffects.playBackTone();
    if (window.confirm('Reset notepad configuration to the original provided list?')) {
      setCurrentText(RAW_NOTEPAD_DEFAULT);
      onResetToDefault();
      showStatus('Reset to original notepad default.');
    }
  };

  // Channel Manager actions
  const toggleVisibility = (id: string) => {
    soundEffects.playNavTick();
    onUpdateChannels(
      channels.map((ch) => (ch.id === id ? { ...ch, isHidden: !ch.isHidden } : ch))
    );
  };

  const toggleFavorite = (id: string) => {
    soundEffects.playSelectChime();
    onUpdateChannels(
      channels.map((ch) => (ch.id === id ? { ...ch, isFavorite: !ch.isFavorite } : ch))
    );
  };

  const moveChannel = (index: number, direction: 'up' | 'down') => {
    soundEffects.playNavTick();
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= channels.length) return;

    const list = [...channels];
    const [moved] = list.splice(index, 1);
    list.splice(newIdx, 0, moved);

    // Re-number
    const renumbered = list.map((ch, idx) => ({ ...ch, number: idx + 1 }));
    onUpdateChannels(renumbered);
  };

  const deleteChannel = (id: string) => {
    soundEffects.playBackTone();
    const filtered = channels.filter((ch) => ch.id !== id);
    const renumbered = filtered.map((ch, idx) => ({ ...ch, number: idx + 1 }));
    onUpdateChannels(renumbered);
    showStatus('Channel removed from active list.');
  };

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChName.trim() || !newChUrl.trim()) return;

    soundEffects.playSelectChime();
    const newEntry = `\n${newChName.trim()}:${newChUrl.trim()}`;
    const updatedText = currentText + newEntry;
    setCurrentText(updatedText);
    onSaveNotepadText(updatedText);

    setNewChName('');
    setNewChUrl('');
    showStatus(`Channel "${newChName}" added to notepad.`);
  };

  const handleFetchOpenM3u = async () => {
    if (!m3uUrlInput) return;
    try {
      showStatus('Fetching open M3U playlist...');
      const res = await fetch(m3uUrlInput);
      if (!res.ok) throw new Error('Failed to fetch M3U');
      const text = await res.text();
      setCurrentText(text);
      onSaveNotepadText(text);
      showStatus('Open M3U playlist loaded successfully!');
    } catch {
      showStatus('Could not fetch URL directly (CORS). Paste M3U playlist text into the Notepad tab.');
    }
  };

  const handleExportM3u = () => {
    let content = '#EXTM3U\n';
    channels.forEach((ch) => {
      content += `#EXTINF:-1 tvg-id="${ch.id}" tvg-name="${ch.name}" tvg-logo="${ch.logo}" group-title="${ch.category}", ${ch.name}\n${ch.originalUrl}\n`;
    });
    const blob = new Blob([content], { type: 'audio/x-mpegurl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Telugu_TV_Channels.m3u';
    a.click();
    URL.revokeObjectURL(url);
    showStatus('M3U playlist file exported.');
  };

  return (
    <div id="tv-notepad-config-container" className="space-y-6 pb-24 max-w-5xl mx-auto">
      {/* Configuration Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121212] border border-white/5 p-6 rounded-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-lg bg-white/10 text-orange-400">
              <FileCode2 className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight font-mono uppercase">
              Given Notepad &amp; IPTV Stream Configuration
            </h2>
          </div>
          <p className="text-xs text-white/50">
            Customize channel display, order, categories, and stream links. Supports raw format (name:url) and standard M3U playlists.
          </p>
        </div>

        {/* Status notification */}
        {statusMessage && (
          <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs px-3.5 py-2 rounded-lg font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('notepad')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-mono font-bold transition-all ${
            activeTab === 'notepad'
              ? 'bg-white text-black shadow-md'
              : 'text-white/60 hover:text-white bg-[#121212] border border-white/5'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          <span>Given Notepad Editor</span>
        </button>

        <button
          onClick={() => setActiveTab('manager')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-mono font-bold transition-all ${
            activeTab === 'manager'
              ? 'bg-white text-black shadow-md'
              : 'text-white/60 hover:text-white bg-[#121212] border border-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Channel Display &amp; Favorites ({channels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('m3u')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-mono font-bold transition-all ${
            activeTab === 'm3u'
              ? 'bg-white text-black shadow-md'
              : 'text-white/60 hover:text-white bg-[#121212] border border-white/5'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>Open M3U Playlist Tools</span>
        </button>
      </div>

      {/* TAB 1: Notepad Raw Editor */}
      {activeTab === 'notepad' && (
        <div className="space-y-4">
          <div className="bg-[#121212] border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs text-white/50 font-mono">
              <span>
                {currentText.split('\n').filter((l) => l.trim()).length} Channels Configured
              </span>
              <div className="flex items-center gap-2">
                <button
                  id="btn-reset-notepad"
                  onClick={handleReset}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#121212] hover:bg-white/10 border border-white/10 text-white/70 transition-colors text-xs"
                  title="Reset back to user given list"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Given Notepad</span>
                </button>
                <button
                  id="btn-save-notepad"
                  onClick={handleSaveText}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-orange-500 hover:bg-orange-400 text-black font-bold transition-all shadow-md text-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save &amp; Apply</span>
                </button>
              </div>
            </div>

            <textarea
              id="raw-notepad-textarea"
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              rows={16}
              spellCheck={false}
              className="w-full bg-[#080808] border border-white/10 rounded-lg p-4 font-mono text-xs sm:text-sm text-white/90 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 leading-relaxed resize-y scrollbar-thin"
              placeholder="channel_name:stream_url or #EXTM3U..."
            />

            <div className="mt-3 flex items-start gap-2 text-[11px] text-white/40">
              <HelpCircle className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
              <p>
                Each line supports formats like <code className="text-orange-400 font-mono">tv:9,https://...</code>,{' '}
                <code className="text-orange-400 font-mono">ChannelName:https://...</code>, or standard{' '}
                <code className="text-orange-400 font-mono">#EXTINF</code> M3U playlist format. YouTube live links, HLS (.m3u8), and web streams are automatically detected.
              </p>
            </div>
          </div>

          {/* Quick Add Form */}
          <div className="bg-[#121212] border border-white/5 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2 font-mono uppercase">
              <Plus className="w-4 h-4 text-orange-400" />
              <span>Quick Add New Channel to Notepad</span>
            </h3>

            <form onSubmit={handleAddChannel} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <label className="text-[11px] font-semibold text-white/50 block mb-1 font-mono">
                  Channel Name
                </label>
                <input
                  type="text"
                  value={newChName}
                  onChange={(e) => setNewChName(e.target.value)}
                  placeholder="e.g. Gemini TV Live"
                  className="w-full bg-[#080808] border border-white/10 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="text-[11px] font-semibold text-white/50 block mb-1 font-mono">
                  Live Stream / YouTube / M3U8 URL
                </label>
                <input
                  type="text"
                  value={newChUrl}
                  onChange={(e) => setNewChUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://...m3u8"
                  className="w-full bg-[#080808] border border-white/10 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 rounded-md bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs font-mono flex items-center justify-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: Channel Display & Favorites Customizer */}
      {activeTab === 'manager' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#121212] border border-white/5 p-4 rounded-xl text-xs text-white/50 font-mono">
            <span>
              Manage Channel Order, Hide Channels, or Mark Favorites. All changes apply live.
            </span>
            <button
              onClick={handleExportM3u}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#080808] hover:bg-white/10 border border-white/10 text-white font-semibold text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export as M3U</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
            {channels.map((channel, idx) => (
              <div
                key={channel.id}
                className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition-all ${
                  channel.isHidden
                    ? 'bg-[#080808]/40 border-white/5 opacity-40'
                    : 'bg-[#121212] border-white/5 hover:border-white/10'
                }`}
              >
                {/* Channel Number & Logo & Name */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="font-mono text-xs font-bold text-orange-400 bg-[#080808] px-2 py-1 rounded border border-white/10">
                    {String(channel.number).padStart(2, '0')}
                  </span>

                  <div className="w-9 h-9 rounded-lg bg-[#080808] p-1 border border-white/10 shrink-0 flex items-center justify-center">
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
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                        {channel.name}
                      </h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-orange-400">
                        {channel.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/40 truncate mt-0.5 font-mono">
                      {channel.originalUrl}
                    </p>
                  </div>
                </div>

                {/* Control Actions: Up, Down, Visibility, Fav, Delete */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => moveChannel(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-20"
                    title="Move Channel Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => moveChannel(idx, 'down')}
                    disabled={idx === channels.length - 1}
                    className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-20"
                    title="Move Channel Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleVisibility(channel.id)}
                    className={`p-1.5 rounded-md transition-colors ${
                      channel.isHidden
                        ? 'text-white/30 hover:text-white/50'
                        : 'text-white/70 hover:text-white'
                    }`}
                    title={channel.isHidden ? 'Show Channel' : 'Hide Channel'}
                  >
                    {channel.isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => toggleFavorite(channel.id)}
                    className={`p-1.5 rounded-md transition-colors ${
                      channel.isFavorite ? 'text-orange-400' : 'text-white/30 hover:text-white/70'
                    }`}
                    title="Toggle Favorite"
                  >
                    <Star className={`w-4 h-4 ${channel.isFavorite ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => deleteChannel(channel.id)}
                    className="p-1.5 rounded-md text-white/30 hover:text-red-400 hover:bg-white/10 transition-colors"
                    title="Delete Channel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Open M3U Playlist Integration */}
      {activeTab === 'm3u' && (
        <div className="space-y-5 bg-[#121212] border border-white/5 p-6 rounded-xl">
          <div>
            <h3 className="text-base font-bold text-white mb-1 font-mono uppercase">
              Open IPTV Playlist Reference (M3U &amp; HLS)
            </h3>
            <p className="text-xs text-white/50">
              Load free and open-source IPTV streams provided by community open M3U projects.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-white/70 block font-mono">
              M3U Playlist URL:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={m3uUrlInput}
                onChange={(e) => setM3uUrlInput(e.target.value)}
                className="flex-1 bg-[#080808] border border-white/10 rounded-md px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleFetchOpenM3u}
                className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs font-mono flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Load M3U URL</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2 font-mono">
              Curated Open Telugu IPTV Reference Playlists:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-[#080808] border border-white/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white font-mono">iptv-org / Telugu (India)</span>
                  <button
                    onClick={() => {
                      setM3uUrlInput('https://iptv-org.github.io/iptv/languages/tel.m3u');
                      handleFetchOpenM3u();
                    }}
                    className="text-orange-400 hover:underline text-[11px] font-semibold font-mono"
                  >
                    Load into App
                  </button>
                </div>
                <p className="text-[10px] text-white/40 font-mono mt-1">
                  https://iptv-org.github.io/iptv/languages/tel.m3u
                </p>
              </div>

              <div className="p-3 bg-[#080808] border border-white/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white font-mono">iptv-org / India National</span>
                  <button
                    onClick={() => {
                      setM3uUrlInput('https://iptv-org.github.io/iptv/countries/in.m3u');
                      handleFetchOpenM3u();
                    }}
                    className="text-orange-400 hover:underline text-[11px] font-semibold font-mono"
                  >
                    Load into App
                  </button>
                </div>
                <p className="text-[10px] text-white/40 font-mono mt-1">
                  https://iptv-org.github.io/iptv/countries/in.m3u
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
