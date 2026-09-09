export type StreamType = 'youtube' | 'hls' | 'web' | 'embed';

export type ChannelCategory = 
  | 'All'
  | 'News'
  | 'Cable TV'
  | 'Education'
  | 'Entertainment'
  | 'Devotional'
  | 'Music'
  | 'Movies'
  | 'Favorites';

export interface Channel {
  id: string;
  number: number;
  name: string;
  originalUrl: string;
  streamType: StreamType;
  streamUrl: string;
  embedUrl?: string;
  officialWebsite?: string;
  livePortalUrl?: string;
  category: Exclude<ChannelCategory, 'All' | 'Favorites'>;
  logo: string;
  logoColor?: string;
  quality: 'HD' | 'FHD' | '4K';
  isFavorite: boolean;
  isHidden?: boolean;
  language: string;
  epgCurrent?: string;
  epgNext?: string;
  description?: string;
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string;
  duration: string;
  rating: string;
  quality: 'HD' | 'FHD' | '4K';
  posterUrl: string;
  backdropUrl: string;
  videoUrl: string;
  streamType: StreamType;
  synopsis: string;
  cast: string[];
  director: string;
  isFavorite: boolean;
}

export type ActiveScreen = 'channels' | 'movies' | 'favorites' | 'notepad' | 'settings' | 'guide' | 'testing';

export type ChannelSortOption = 'Default' | 'Alphabetical' | 'Number-based';

export interface RemoteKeyFeedback {
  key: string;
  timestamp: number;
}
