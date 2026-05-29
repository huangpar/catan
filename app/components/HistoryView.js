'use client';

export default function HistoryView({ history, loading, onSelectPlayer }) {
  
  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent Date';
    }
  };

  const formatDuration = (mins) => {
    if (!mins) return '';
    if (mins < 60) return `${mins}m`;
    const hrs = (mins / 60).toFixed(1);
    return `${hrs.endsWith('.0') ? hrs.slice(0, -2) : hrs}h`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="material-symbols-outlined text-[48px] animate-spin text-primary">sync</span>
        <p className="text-on-surface-variant font-label-md">Loading Match History...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6 gap-2">
        <span className="material-symbols-outlined text-[64px] text-outline">history</span>
        <h3 className="font-headline-sm text-on-surface font-semibold">No Matches Logged Yet</h3>
        <p className="text-on-surface-variant font-body-md max-w-xs">
          Be the first to record a board game session on the VictoryVault!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Section Title & Filter */}
      <div className="flex items-center justify-between py-2">
        <h2 className="font-headline-md text-[24px] font-bold text-on-background">Game History</h2>
        <div className="flex gap-2">
          <span className="font-label-md text-[14px] bg-surface-container text-primary px-3 py-1 rounded-full font-semibold">
            Recent Sessions
          </span>
        </div>
      </div>

      {/* History List (Cards) */}
      <div className="space-y-4">
        {history.map((match) => {
          // Find the winner and participants
          const winner = match.participants.find(p => p.isWinner);
          const opponents = match.participants.filter(p => !p.isWinner);
          
          return (
            <div 
              key={match.id}
              className="bg-surface-container-lowest rounded-xl p-4 shadow-ambient victory-border transition-all tap-interaction cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                  <h3 className="font-headline-sm text-[20px] font-bold text-on-surface">{match.gameName}</h3>
                  <p className="font-label-md text-[14px] text-outline mt-0.5">
                    {formatDate(match.playedAt)} {match.duration ? `• ${formatDuration(match.duration)}` : ''}
                  </p>
                </div>
                {match.league && (
                  <span className={`font-label-sm text-[12px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider ${
                    match.league === 'Pro League' 
                      ? 'bg-secondary/10 text-secondary' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {match.league}
                  </span>
                )}
              </div>

              {match.notes && (
                <p className="text-on-surface-variant font-body-md text-[14px] italic bg-background/50 p-2.5 rounded-lg border-l-2 border-outline-variant/40 mb-3">
                  "{match.notes}"
                </p>
              )}

              <div className="flex items-center justify-between mt-4 pt-2 border-t border-outline-variant/10">
                {winner ? (
                  <div 
                    onClick={() => onSelectPlayer(winner.id)}
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80"
                  >
                    <div className="relative w-10 h-10">
                      <img
                        alt="Winner Avatar"
                        className="w-full h-full rounded-full object-cover border-2 border-primary"
                        src={winner.avatar}
                      />
                      <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 rounded-full p-0.5 flex items-center justify-center shadow">
                        <span className="material-symbols-outlined text-[12px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                          trophy
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="font-label-sm text-[10px] text-outline uppercase tracking-wider font-semibold">Winner</p>
                      <p className="font-body-md text-[14px] text-on-surface font-bold">{winner.name}</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-10 h-10" />
                )}

                {/* Opponents/Participants avatars */}
                {opponents.length > 0 && (
                  <div className="flex -space-x-2.5 items-center">
                    {opponents.slice(0, 2).map((opp) => (
                      <img
                        key={opp.id}
                        onClick={() => onSelectPlayer(opp.id)}
                        alt={opp.name}
                        title={opp.name}
                        className="w-8 h-8 rounded-full border-2 border-white object-cover cursor-pointer hover:scale-105 transition-transform"
                        src={opp.avatar}
                      />
                    ))}
                    {opponents.length > 2 && (
                      <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border-2 border-white shadow-sm">
                        <span className="text-[10px] font-bold text-on-surface-variant">+{opponents.length - 2}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
