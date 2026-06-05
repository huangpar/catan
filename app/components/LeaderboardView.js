'use client';

import { useState } from 'react';
import PlayerAvatar from './PlayerAvatar';
import DesktopPageHeader from './DesktopPageHeader';
import { useIsDesktop } from '../hooks/useIsDesktop';

function playerSubtitle(player) {
  const matchWins = parseInt(player.match_wins || 0, 10);
  const totalWins = parseInt(player.wins || 0, 10);

  if (player.nickname) return player.nickname;
  if (matchWins >= 3) return `${totalWins} Wins · ${matchWins} from logged games`;
  if (player.streak >= 3) return `${totalWins} Wins · On Fire`;
  if (player.last_win_game && player.last_win_game !== 'N/A') {
    return `${totalWins} Wins · ${player.last_win_game} specialist`;
  }
  return `${totalWins} Wins · Rising player`;
}

export default function LeaderboardView({
  leaderboard,
  history,
  loading,
  onSelectPlayer,
  onLogGame,
}) {
  const [expanded, setExpanded] = useState(false);
  const isDesktop = useIsDesktop();

  const topPlayer = leaderboard[0];
  const rest = leaderboard.slice(1);
  const visibleRest = expanded || isDesktop ? rest : rest.slice(0, 3);

  const totalGames = history.length;

  const sortedHistory = history.slice().sort((a, b) => {
    const ta = new Date(a.playedAt).getTime();
    const tb = new Date(b.playedAt).getTime();

    if (ta === tb) return b.id - a.id;

    const dayA = new Date(a.playedAt).toISOString().slice(0, 10);
    const dayB = new Date(b.playedAt).toISOString().slice(0, 10);
    if (dayA === dayB) return b.id - a.id;

    return tb - ta;
  });

  const recentWins = sortedHistory.slice(0, isDesktop ? 5 : 2).map((match) => {
    const winner = match.participants.find((p) => p.isWinner);
    return {
      id: match.id,
      winnerName: winner?.name || 'Unknown',
      gameName: match.gameName,
      playerCount: match.participants.length,
    };
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="material-symbols-outlined text-[48px] animate-spin text-primary">sync</span>
        <p className="text-on-surface-variant text-sm font-medium">Loading Rankings...</p>
      </div>
    );
  }

  const statsPanel = (
    <>
      <section className="bg-surface-container-lowest rounded-2xl p-5 lg:p-6 card-shadow space-y-4">
        <h3 className="font-serif text-[22px] text-primary">Group Stats</h3>
        <div className="space-y-3 text-[15px]">
          {[
            ['Total Games', totalGames],
            ['Active Players', leaderboard.length],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between dotted-divider pb-3 last:border-0 last:pb-0">
              <span className="text-on-surface-variant">{label}</span>
              <span className="font-bold text-on-surface tabular-nums">{value}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onLogGame}
          className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-[15px] card-shadow tap-interaction cursor-pointer hover:bg-primary-dark transition-colors lg:hidden"
        >
          Log New Match
        </button>
      </section>

      {recentWins.length > 0 && (
        <section className="bg-surface-container-lowest rounded-2xl p-5 lg:p-6 card-shadow space-y-3">
          <h3 className="text-gold text-[11px] font-bold uppercase tracking-[0.18em]">Recent Wins</h3>
          <div className="space-y-3">
            {recentWins.map((win, index) => (
              <div key={win.id} className="flex items-start gap-3 text-[14px]">
                <span
                  className="material-symbols-outlined text-gold text-[18px] mt-0.5 shrink-0"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {index === 0 ? 'shield' : 'workspace_premium'}
                </span>
                <p className="text-on-surface leading-snug">
                  <span className="font-bold">
                    {win.winnerName.split(' ')[0]}
                    {win.winnerName.includes(' ') ? ` ${win.winnerName.split(' ')[1]?.[0]}.` : ''}
                  </span>{' '}
                  {index === 0
                    ? `won a ${win.playerCount}-player ${win.gameName} game`
                    : `took the crown in ${win.gameName}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );

  return (
    <div className="animate-fade-in pb-4">
      <DesktopPageHeader
        title="Leaderboard"
        description="Current standings, streaks, and recent conquests across your game group."
      />

      <section className="lg:hidden text-center space-y-1 pt-1 mb-6">
        <h1 className="font-serif text-[34px] text-primary leading-tight">Leaderboard</h1>
      </section>

      <div className="lg:grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] lg:gap-8 xl:gap-10 lg:items-start">
        <div className="space-y-6 min-w-0">
          {topPlayer && (
            <section
              onClick={() => onSelectPlayer(topPlayer.id)}
              className="champion-gradient rounded-2xl p-5 lg:p-8 text-white card-shadow relative overflow-hidden cursor-pointer tap-interaction"
            >
              <div className="absolute -right-6 -top-6 opacity-10">
                <span className="material-symbols-outlined text-[140px] lg:text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  workspace_premium
                </span>
              </div>

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:gap-8 items-center text-center lg:text-left">
                <div className="relative shrink-0 mb-2">
                  <PlayerAvatar
                    name={topPlayer.name}
                    src={topPlayer.avatar_url}
                    color={topPlayer.color}
                    size="lg"
                    className="w-[88px] h-[88px] lg:w-[112px] lg:h-[112px] border-[3px] border-gold-light"
                  />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gold text-[#2C1810] flex items-center justify-center text-sm font-bold border-2 border-white shadow">
                    1
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-gold-light text-[10px] font-bold uppercase tracking-[0.18em] mb-1">
                      Current Settler King
                    </p>
                    <h2 className="font-serif text-[26px] lg:text-[32px] leading-none">{topPlayer.name}</h2>
                  </div>

                  {/* <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                    {['Longest Road', 'Largest Army'].map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 text-[11px] font-semibold backdrop-blur-sm"
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {badge === 'Longest Road' ? 'route' : 'shield'}
                        </span>
                        {badge}
                      </span>
                    ))}
                  </div> */}

                  <div>
                    <p className="text-[32px] lg:text-[40px] font-bold leading-none tracking-tight">
                      {topPlayer.wins} {topPlayer.wins === 1 ? 'Win' : 'Wins'}
                    </p>
                    {topPlayer.streak > 0 && (
                      <p className="text-white/80 text-sm mt-1 inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          local_fire_department
                        </span>
                        {topPlayer.streak} game win streak
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="space-y-3">
            <div className="lg:hidden flex items-center justify-between px-1 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              <span>Player</span>
              <span>Wins</span>
            </div>

            <div className="space-y-2.5 lg:space-y-0 lg:bg-surface-container-lowest lg:rounded-2xl lg:card-shadow lg:overflow-hidden">
              <div className="hidden lg:grid lg:grid-cols-[3rem_minmax(0,1fr)_5rem_5rem] lg:gap-x-4 lg:items-center px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/30">
                <span>Rank</span>
                <span>Player</span>
                <span className="text-center">Wins</span>
                <span className="text-center">Streak</span>
              </div>

              {visibleRest.map((player, index) => {
                const rank = index + 2;
                return (
                  <div
                    key={player.id}
                    onClick={() => onSelectPlayer(player.id)}
                    className="flex items-center gap-3 bg-surface-container-lowest lg:grid lg:grid-cols-[3rem_minmax(0,1fr)_5rem_5rem] lg:gap-x-4 lg:items-center lg:bg-transparent rounded-xl lg:rounded-none p-3.5 lg:px-4 lg:py-3.5 card-shadow-sm lg:shadow-none lg:border-b lg:border-outline-variant/20 last:lg:border-b-0 cursor-pointer tap-interaction hover:bg-surface-container/60 transition-colors"
                  >
                    <span className="w-5 lg:w-auto text-center text-sm font-bold text-on-surface-variant shrink-0">
                      {rank}
                    </span>

                    <div className="flex items-center gap-3 flex-1 min-w-0 lg:min-w-0">
                      <PlayerAvatar name={player.name} src={player.avatar_url} color={player.color} size="md" className="shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-[15px] text-on-surface truncate">{player.name}</p>
                        <p className="text-[12px] text-on-surface-variant truncate">{playerSubtitle(player)}</p>
                      </div>
                    </div>

                    <p className="font-bold text-primary text-[17px] tabular-nums lg:text-center lg:font-semibold lg:text-on-surface shrink-0">
                      {player.wins}
                    </p>
                    <p className="hidden lg:flex lg:justify-center font-semibold text-on-surface-variant tabular-nums">
                      {player.streak > 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-secondary">
                          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            local_fire_department
                          </span>
                          {player.streak}
                        </span>
                      ) : (
                        '—'
                      )}
                    </p>
                  </div>
                );
              })}
            </div>

            {rest.length > 3 && !isDesktop && (
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="w-full py-3 rounded-xl border-2 border-dashed border-outline-variant/60 text-on-surface-variant text-sm font-semibold flex items-center justify-center gap-1 hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
              >
                {expanded ? 'Show Less' : 'View Full Rankings'}
                <span className="material-symbols-outlined text-[18px]">
                  {expanded ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            )}
          </section>
        </div>

        <aside className="hidden lg:flex lg:flex-col lg:gap-6 lg:sticky lg:top-8">
          {statsPanel}
        </aside>

        <div className="lg:hidden space-y-6 mt-6">
          {statsPanel}
        </div>
      </div>
    </div>
  );
}
