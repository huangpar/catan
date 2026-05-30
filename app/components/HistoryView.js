'use client';

import { useMemo, useState } from 'react';
import PlayerAvatar from './PlayerAvatar';
import DesktopPageHeader from './DesktopPageHeader';
import { useIsDesktop } from '../hooks/useIsDesktop';

const MOBILE_PAGE_SIZE = 4;
const DESKTOP_PAGE_SIZE = 9;

function formatDate(isoString) {
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recent Date';
  }
}

function formatDuration(mins) {
  if (!mins) return '—';
  if (mins < 60) return `${mins} mins`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem ? `${hrs}h ${rem}m` : `${hrs}h`;
}

function matchAchievement(match, winnerId) {
  const winner = match.participants.find((p) => p.id === winnerId);
  if (winner && match.notes) {
    if (match.notes.toLowerCase().includes('road')) return { icon: 'route', label: 'Longest Road' };
    if (match.notes.toLowerCase().includes('wheat')) return { icon: 'grass', label: 'Wheat Lord' };
    if (match.notes.toLowerCase().includes('defend')) return { icon: 'shield', label: 'Defender' };
  }
  if (winner) return { icon: 'emoji_events', label: 'Victory' };
  return { icon: 'psychology', label: 'Completed' };
}

function MatchCard({ match, onSelectPlayer }) {
  const winner = match.participants.find((p) => p.isWinner);
  const winnerColor = winner?.color || '#7C3AED';
  const achievement = matchAchievement(match, winner?.id);

  return (
    <article
      className="bg-surface-container-lowest rounded-2xl p-4 lg:p-5 card-shadow relative overflow-hidden h-full flex flex-col"
      style={{ borderColor: winnerColor, borderWidth: '1px', borderStyle: 'solid' }}
    >
      <div className="absolute left-0 top-0 h-full w-1.5 rounded-r-full" style={{ backgroundColor: winnerColor, opacity: 0.12 }} />
      <div className="absolute right-3 top-3 opacity-[0.04] pointer-events-none">
        <span className="material-symbols-outlined text-[80px]">hexagon</span>
      </div>

      <div className="flex items-start justify-between gap-3 mb-2 relative">
        <p className="text-[12px] text-on-surface-variant font-medium">{formatDate(match.playedAt)}</p>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant uppercase tracking-wide">
          Game #{match.id}
        </span>
      </div>

      <h3 className="font-serif text-[22px] text-on-surface mb-3 relative">{match.gameName}</h3>

      {winner ? (
        <button
          type="button"
          onClick={() => onSelectPlayer(winner.id)}
          className="flex items-center gap-3 w-full mb-4 p-3 rounded-xl bg-secondary-container/40 border text-left cursor-pointer tap-interaction hover:bg-secondary-container/60 transition-colors relative"
          style={{ borderColor: winnerColor }}
        >
          <PlayerAvatar name={winner.name} src={winner.avatar} size="md" color={winner.color} />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-secondary mb-0.5 flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: winnerColor }} />
              Winner
            </p>
            <p className="font-semibold text-[15px] text-on-surface truncate">{winner.name}</p>
          </div>
          <span
            className="material-symbols-outlined text-gold text-[22px] shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            emoji_events
          </span>
        </button>
      ) : (
        <div className="mb-4 p-3 rounded-xl bg-surface-container text-on-surface-variant text-sm relative">
          No winner recorded
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4 relative">
        <div className="bg-surface-container rounded-xl p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
            Duration
          </p>
          <p className="text-on-surface font-bold text-[18px]">{formatDuration(match.duration)}</p>
        </div>
        <div className="bg-surface-container rounded-xl p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
            Players
          </p>
          <p className="text-on-surface font-bold text-[18px]">{match.participants.length}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30 relative mt-auto">
        <div className="flex -space-x-2">
          {match.participants.slice(0, 4).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPlayer(p.id)}
              className="cursor-pointer tap-interaction"
            >
              <PlayerAvatar name={p.name} src={p.avatar} size="sm" color={p.color} />
            </button>
          ))}
        </div>
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-gold">{achievement.icon}</span>
          {achievement.label}
        </span>
      </div>
    </article>
  );
}

function FilterControls({ gameFilter, gameOptions, onFilterChange, onLogGame, className = '' }) {
  return (
    <div className={`flex gap-3 ${className}`}>
      <div className="relative flex-1 lg:flex-none lg:min-w-[220px]">
        <select
          value={gameFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full appearance-none pl-10 pr-4 py-3 rounded-xl bg-tertiary-container text-on-surface text-sm font-semibold border border-outline-variant/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {gameOptions.map((game) => (
            <option key={game} value={game}>
              {game === 'all' ? 'All Games' : game}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
          filter_list
        </span>
      </div>
      <button
        type="button"
        onClick={onLogGame}
        className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-primary text-white text-sm font-bold card-shadow tap-interaction cursor-pointer whitespace-nowrap hover:bg-primary-dark transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        New Match
      </button>
    </div>
  );
}

export default function HistoryView({
  history,
  loading,
  onSelectPlayer,
  onLogGame,
}) {
  const isDesktop = useIsDesktop();
  const pageSize = isDesktop ? DESKTOP_PAGE_SIZE : MOBILE_PAGE_SIZE;

  const [page, setPage] = useState(1);
  const [gameFilter, setGameFilter] = useState('all');

  const gameOptions = useMemo(() => {
    const names = [...new Set(history.map((m) => m.gameName))];
    return ['all', ...names];
  }, [history]);

  const filteredHistory = useMemo(() => {
    if (gameFilter === 'all') return history;
    return history.filter((m) => m.gameName === gameFilter);
  }, [history, gameFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredHistory.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleFilterChange = (value) => {
    setGameFilter(value);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="material-symbols-outlined text-[48px] animate-spin text-primary">sync</span>
        <p className="text-on-surface-variant text-sm font-medium">Loading Match History...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-4">
      <DesktopPageHeader
        eyebrow="Archive"
        title="Chronicles of Conquest"
        description="Relive your strategic triumphs and near-misses on the island of Catan."
        actions={
          <FilterControls
            gameFilter={gameFilter}
            gameOptions={gameOptions}
            onFilterChange={handleFilterChange}
            onLogGame={onLogGame}
          />
        }
      />

      <section className="lg:hidden space-y-2 mb-5">
        <p className="text-gold text-[11px] font-bold uppercase tracking-[0.2em]">Archive</p>
        <h1 className="font-serif text-[30px] text-on-surface leading-tight">Chronicles of Conquest</h1>
        <p className="text-on-surface-variant text-[14px] leading-relaxed max-w-sm">
          Relive your strategic triumphs and near-misses on the island of Catan.
        </p>
      </section>

      <FilterControls
        className="lg:hidden mb-5"
        gameFilter={gameFilter}
        gameOptions={gameOptions}
        onFilterChange={handleFilterChange}
        onLogGame={onLogGame}
      />

      {pageItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[280px] text-center p-6 gap-3 bg-surface-container-lowest rounded-2xl card-shadow">
          <span className="material-symbols-outlined text-[56px] text-outline">history</span>
          <h3 className="font-serif text-[20px] text-on-surface">No Matches Yet</h3>
          <p className="text-on-surface-variant text-sm max-w-xs">
            Log your first conquest to begin the chronicle.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
          {pageItems.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onSelectPlayer={onSelectPlayer}
            />
          ))}
        </div>
      )}

      {filteredHistory.length > pageSize && (
        <div className="flex items-center justify-center gap-2 pt-6 lg:pt-8">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="w-9 h-9 rounded-full border border-outline-variant/50 flex items-center justify-center disabled:opacity-30 cursor-pointer hover:bg-surface-container transition-colors"
            aria-label="Previous page"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 7).map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setPage(num)}
              className={`w-9 h-9 rounded-full text-sm font-bold cursor-pointer transition-colors ${
                num === currentPage
                  ? 'bg-primary text-white'
                  : 'border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="w-9 h-9 rounded-full border border-outline-variant/50 flex items-center justify-center disabled:opacity-30 cursor-pointer hover:bg-surface-container transition-colors"
            aria-label="Next page"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}
