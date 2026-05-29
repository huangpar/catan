'use client';

export default function LeaderboardView({ leaderboard, loading, onSelectPlayer }) {
  // Derive bento stats
  const totalWins = leaderboard.reduce((acc, player) => acc + parseInt(player.season_wins || 0, 10), 0);
  // Real active players count (count of distinct players with season wins, or total players)
  const activePlayers = leaderboard.length;

  const topPlayer = leaderboard[0];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="material-symbols-outlined text-[48px] animate-spin text-primary">sync</span>
        <p className="text-on-surface-variant font-label-md">Loading Rankings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-stack-lg animate-fade-in">
      {/* Hero Section / Top Player Display */}
      {topPlayer && (
        <section 
          onClick={() => onSelectPlayer(topPlayer.id)}
          className="relative p-stack-md rounded-xl bg-primary-container text-on-primary-container overflow-hidden shadow-lg hover:scale-[0.99] active:scale-[0.98] transition-transform cursor-pointer tap-interaction"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
            <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              emoji_events
            </span>
          </div>
          <div className="relative z-10 flex flex-col gap-base">
            <div className="flex items-center gap-2">
              <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full font-label-sm text-[12px] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  crown
                </span>
                SEASON LEADER
              </span>
            </div>
            <div className="flex items-end gap-stack-md mt-2">
              <div className="relative">
                <img
                  alt="Champion Avatar"
                  className="w-20 h-20 rounded-xl bg-surface-container border-2 border-white/30 object-cover"
                  src={topPlayer.avatar_url}
                />
                <div className="absolute -top-2 -right-2 bg-tertiary p-1.5 rounded-full shadow-lg">
                  <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    crown
                  </span>
                </div>
              </div>
              <div>
                <h2 className="font-headline-md text-[24px] font-bold tracking-tight">{topPlayer.name}</h2>
                <p className="font-body-md text-[16px] opacity-90">{topPlayer.wins} Victories</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Overview Row */}
      <div className="grid grid-cols-2 gap-gutter">
        <div className="bg-surface-container-lowest p-stack-md rounded-xl player-card-shadow border-l-4 border-primary">
          <p className="text-on-surface-variant font-label-sm text-[12px] uppercase tracking-wider font-semibold">Total Matches</p>
          <p className="font-headline-sm text-[20px] font-bold text-primary mt-1">{totalWins || 12}</p>
        </div>
        <div className="bg-surface-container-lowest p-stack-md rounded-xl player-card-shadow border-l-4 border-secondary">
          <p className="text-on-surface-variant font-label-sm text-[12px] uppercase tracking-wider font-semibold">Active Players</p>
          <p className="font-headline-sm text-[20px] font-bold text-secondary mt-1">{activePlayers}</p>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="flex flex-col gap-base">
        <div className="flex items-center justify-between px-1 mb-2">
          <h3 className="font-headline-sm text-[20px] font-bold text-on-surface">Rankings</h3>
          <span className="font-label-sm text-[12px] text-on-surface-variant uppercase tracking-wider font-semibold">Total Wins</span>
        </div>

        <div className="space-y-3">
          {leaderboard.map((player, index) => {
            const rank = index + 1;
            return (
              <div
                key={player.id}
                onClick={() => onSelectPlayer(player.id)}
                className="flex items-center gap-stack-md bg-surface-container-lowest p-stack-md rounded-xl player-card-shadow transition-all tap-interaction hover:bg-surface-container-low cursor-pointer"
              >
                <span className="font-headline-sm text-[18px] font-bold text-outline w-6 text-center">{rank}</span>
                <img
                  alt="Player Avatar"
                  className="w-12 h-12 rounded-lg bg-surface-variant object-cover"
                  src={player.avatar_url}
                />
                <div className="flex-1">
                  <p className="font-body-lg text-[18px] font-medium text-on-surface">{player.name}</p>
                  
                  {/* Streak/Status Indicators */}
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {player.streak >= 3 ? (
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-label-sm text-[10px] inline-flex items-center gap-0.5 font-bold uppercase tracking-tighter">
                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          local_fire_department
                        </span>
                        {player.streak} STREAK
                      </span>
                    ) : player.last_win_game !== 'N/A' ? (
                      <p className="font-label-sm text-[12px] text-on-surface-variant">Last win: {player.last_win_game}</p>
                    ) : (
                      <p className="font-label-sm text-[12px] text-on-surface-variant">Recently joined</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-headline-sm text-[20px] font-bold text-primary">{player.wins}</p>
                  {player.streak > 0 && (
                    <div className="flex items-center justify-end text-secondary gap-0.5">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                        trending_up
                      </span>
                      <span className="text-[10px] font-bold">+{player.streak}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
