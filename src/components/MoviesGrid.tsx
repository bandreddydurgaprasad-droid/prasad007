import React, { useState } from 'react';
import { Play, Star, Sparkles, Clock, Calendar, Film } from 'lucide-react';
import { Movie } from '../types';

interface MoviesGridProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onToggleFavoriteMovie: (movieId: string) => void;
  focusedMovieIndex: number;
}

export const MoviesGrid: React.FC<MoviesGridProps> = ({
  movies,
  onSelectMovie,
  onToggleFavoriteMovie,
  focusedMovieIndex,
}) => {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featured = movies[featuredIndex] || movies[0];

  return (
    <div id="tv-movies-section" className="space-y-8 pb-24">
      {/* Featured Hero Showcase Billboard - Geometric Balance */}
      {featured && (
        <section className="relative h-[340px] sm:h-[380px] w-full rounded-2xl bg-[#121212] overflow-hidden border border-white/5 mb-8 shadow-2xl">
          {/* Backdrop Image with subtle overlay */}
          <div className="absolute right-0 top-0 h-full w-full sm:w-2/3 bg-[#1a1a1a] flex items-center justify-center">
            <img
              src={featured.backdropUrl}
              alt={featured.title}
              className="w-full h-full object-cover opacity-40 scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-orange-500/10 via-transparent to-[#121212]" />
          </div>

          {/* Hero Content Overlay (Geometric Balance) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 sm:via-black/70 to-transparent z-10 p-6 sm:p-12 flex flex-col justify-center max-w-2xl">
            <span className="text-orange-500 font-bold tracking-widest text-xs mb-3 font-mono">
              FEATURED CINEMA • 4K HDR
            </span>

            <h2 className="text-3xl sm:text-5xl font-black mb-4 leading-tight text-white font-['Outfit']">
              {featured.title}
            </h2>

            <div className="flex flex-wrap gap-4 items-center mb-6 text-sm text-neutral-300 font-mono">
              <span className="bg-white text-black px-2 py-0.5 font-bold rounded text-xs">
                {featured.quality || '4K'}
              </span>
              <span>{featured.year}</span>
              <span>{featured.duration}</span>
              <span className="text-orange-500 font-bold">★ {featured.rating}</span>
              <span className="text-neutral-400 font-sans">{featured.genre}</span>
            </div>

            {/* Action Buttons: Pure White primary + Glass secondary */}
            <div className="flex items-center gap-4">
              <button
                id="hero-play-btn"
                onClick={() => onSelectMovie(featured)}
                className="px-8 py-3 bg-white text-black font-bold rounded-md flex items-center gap-2 hover:bg-neutral-200 transition-all shadow-lg active:scale-95"
              >
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent"></div>
                WATCH NOW
              </button>
              <button
                id="hero-fav-btn"
                onClick={() => onToggleFavoriteMovie(featured.id)}
                className={`px-6 py-3 font-bold rounded-md border transition-all flex items-center gap-2 ${
                  featured.isFavorite
                    ? 'bg-orange-500 text-black border-orange-500'
                    : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
                }`}
              >
                <Star className={`w-4 h-4 ${featured.isFavorite ? 'fill-current' : ''}`} />
                <span>{featured.isFavorite ? 'IN WATCHLIST' : 'WATCHLIST'}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Movies Row / Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase font-mono">
              Telugu Golden Classics &amp; Blockbusters
            </h3>
          </div>
          <span className="text-xs text-white/40 font-mono uppercase tracking-widest">
            {movies.length} Movies Available
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-5">
          {movies.map((movie, index) => {
            const isFocused = focusedMovieIndex === index;

            return (
              <div
                key={movie.id}
                id={`movie-card-${movie.id}`}
                onClick={() => onSelectMovie(movie)}
                onMouseEnter={() => setFeaturedIndex(index)}
                className={`group relative bg-[#121212] rounded-xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isFocused
                    ? 'border-4 border-orange-500 ring-4 ring-orange-500/20 scale-105 shadow-2xl shadow-orange-500/20 z-10'
                    : 'border border-white/5 hover:border-white/20 hover:scale-[1.01]'
                }`}
              >
                {/* Poster Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#080808]">
                  <img
                    src={movie.backdropUrl || movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40" />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-orange-400 border border-white/10">
                      {movie.quality}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-neutral-200 border border-white/10">
                      ★ {movie.rating}
                    </span>
                  </div>

                  <button
                    id={`movie-fav-${movie.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavoriteMovie(movie.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-neutral-400 hover:text-orange-400 transition-colors"
                  >
                    <Star className={`w-3.5 h-3.5 ${movie.isFavorite ? 'fill-orange-400 text-orange-400' : ''}`} />
                  </button>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Movie Details */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white truncate group-hover:text-orange-400 transition-colors">
                      {movie.title}
                    </h4>
                    <p className="text-[11px] text-white/50 mt-0.5 truncate font-sans">
                      {movie.genre}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-[11px] text-white/40 pt-2 border-t border-white/5 font-mono">
                    <span>{movie.year}</span>
                    <span>{movie.duration}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
