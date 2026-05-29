'use client';

import { useState, useEffect } from 'react';
import { getPlayerProfile, getPlayersList } from '../actions/gameActions';

export default function ProfileView({ playerId, onBack }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(playerId);

  useEffect(() => {
    async function loadPlayers() {
      const list = await getPlayersList();
      setAllPlayers(list);
    }
    loadPlayers();
  }, []);

  useEffect(() => {
    async function loadProfile() {
      if (!selectedPlayerId) return;
      setLoading(true);
      const data = await getPlayerProfile(selectedPlayerId);
      setProfile(data);
      setLoading(false);
    }
    loadProfile();
  }, [selectedPlayerId]);

  // Keep selected player in sync if prop changes
  useEffect(() => {
    if (playerId) {
      setSelectedPlayerId(playerId);
    }
  }, [playerId]);

  const handlePlayerChange = (e) => {
    setSelectedPlayerId(e.target.value);
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="material-symbols-outlined text-[48px] animate-spin text-primary">sync</span>
        <p className="text-on-surface-variant font-label-md">Loading Profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6 gap-4">
        <span className="material-symbols-outlined text-[64px] text-outline">person_off</span>
        <h3 className="font-headline-sm text-on-surface font-semibold">Player Not Found</h3>
        {onBack && (
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-primary text-white rounded-xl font-semibold cursor-pointer"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-stack-lg animate-fade-in pb-12">
      {/* Top Controls / Navigation */}
      <div className="flex items-center justify-between gap-4 py-1">
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-primary font-bold hover:opacity-80 cursor-pointer tap-interaction"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Rankings
          </button>
        )}

        {/* Dropdown to switch player profiles directly */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="font-label-sm text-[12px] text-on-surface-variant uppercase tracking-wider font-semibold">View Player:</span>
          <select 
            value={selectedPlayerId} 
            onChange={handlePlayerChange}
            className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 py-1.5 font-label-md text-[14px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer max-w-[160px]"
          >
            {allPlayers.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Profile Header Section */}
      <section className="flex flex-col items-center text-center space-y-stack-md pt-stack-sm">
        <div className="relative">
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary-fixed shadow-lg overflow-hidden">
            <img 
              alt={profile.name} 
              className="w-full h-full object-cover rounded-full border-4 border-surface" 
              src={profile.avatar_url}
            />
          </div>
          <div className="absolute -bottom-2 right-0 bg-primary text-on-primary px-3 py-1 rounded-full text-[12px] font-bold shadow-md flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              workspace_premium
            </span>
            #{profile.rank}
          </div>
        </div>
        
        <div className="space-y-1">
          <h2 className="font-headline-md text-[24px] font-bold tracking-tight text-on-surface">
            {profile.name} {profile.nickname ? `"${profile.nickname}"` : ''}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            {profile.streak > 0 ? (
              <span className="bg-secondary-container/30 text-secondary px-3 py-0.5 rounded-full text-[12px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_fire_department
                </span>
                {profile.streak} Game Win Streak
              </span>
            ) : (
              <span className="bg-surface-container text-on-surface-variant px-3 py-0.5 rounded-full text-[12px] font-semibold">
                Idle Streak
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Stats Grid (Bento Style) */}
      <section className="grid grid-cols-2 gap-gutter">
        {/* Ratio Card */}
        <div className="bg-surface-container-lowest tactile-card rounded-xl p-stack-md flex flex-col justify-between">
          <span className="text-on-surface-variant font-label-md text-[14px] uppercase tracking-wider font-semibold">Win Ratio</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-display-lg text-[32px] font-extrabold text-primary">{profile.winRatio}</span>
            <span className="font-headline-sm text-[20px] font-bold text-on-surface-variant">%</span>
          </div>
          <div className="mt-4 h-2 w-full bg-surface-container rounded-full overflow-hidden">
            <div 
              className="h-full bg-secondary rounded-full transition-all duration-500" 
              style={{ width: `${profile.winRatio}%` }}
            />
          </div>
        </div>

        {/* Best Game Card */}
        <div className="bg-surface-container-lowest tactile-card rounded-xl p-stack-md flex flex-col items-center text-center">
          <span className="text-on-surface-variant font-label-md text-[14px] uppercase tracking-wider font-semibold self-start">Best Title</span>
          <div className="w-12 h-12 my-2 bg-primary-fixed rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[24px]">architecture</span>
          </div>
          <span className="font-label-md text-[14px] font-bold block text-on-surface truncate w-full max-w-[120px]">{profile.bestGame?.title || 'N/A'}</span>
          <span className="text-secondary font-label-sm text-[12px] font-semibold">{profile.bestGame?.wins || 0} Wins</span>
        </div>

        {/* Total Games */}
        <div className="col-span-2 bg-surface-container-lowest tactile-card rounded-xl p-stack-md flex items-center justify-between border-l-4 border-primary">
          <div>
            <span className="text-on-surface-variant font-label-md text-[14px] uppercase tracking-wider font-semibold">Total Victories</span>
            <p className="font-headline-sm text-[20px] font-bold text-on-surface mt-1">{profile.wins} Matches Won</p>
          </div>
          <span className="material-symbols-outlined text-primary-container opacity-20 text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            trophy
          </span>
        </div>
      </section>

      {/* Recent Games Timeline */}
      <section className="space-y-gutter pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-[20px] font-bold">Match Timeline</h3>
          <span className="font-label-sm text-[12px] text-on-surface-variant font-semibold">Recent Games</span>
        </div>

        {profile.timeline && profile.timeline.length > 0 ? (
          <div className="space-y-6 relative pt-2">
            {/* Timeline Line */}
            <div className="absolute left-[21px] top-4 bottom-4 w-0.5 bg-outline-variant/30 z-0"></div>
            
            {profile.timeline.map((match) => {
              return (
                <div key={match.id} className="relative z-10 flex gap-4 items-start">
                  {/* Timeline Node dot */}
                  <div className={`w-[44px] h-[44px] rounded-full flex items-center justify-center border-4 border-surface shadow-sm flex-shrink-0 ${
                    match.isWinner 
                      ? 'bg-secondary text-on-secondary' 
                      : 'bg-outline-variant text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: match.isWinner ? "'FILL' 1" : "'FILL' 0" }}>
                      {match.isWinner ? 'check_circle' : 'history'}
                    </span>
                  </div>

                  {/* Timeline content card */}
                  <div className={`flex-1 bg-surface-container-lowest tactile-card rounded-xl p-stack-md ${
                    match.isWinner ? 'border-l-4 border-secondary' : ''
                  }`}>
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <span className="font-label-md text-[14px] font-bold text-on-surface truncate">{match.gameName}</span>
                      <span className="text-on-surface-variant font-label-sm text-[11px] flex-shrink-0">
                        {formatDate(match.playedAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      {match.isWinner ? (
                        <span className="bg-secondary-container/30 text-secondary px-2 py-0.5 rounded text-[10px] font-bold">
                          WIN
                        </span>
                      ) : (
                        <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded text-[10px] font-bold">
                          PLAYED
                        </span>
                      )}
                      <span className="text-on-surface-variant text-label-sm text-[12px]">
                        Score: {match.score} pts
                      </span>
                    </div>

                    {match.opponents && (
                      <p className="text-[11px] text-outline mt-2 truncate w-full max-w-[200px]">
                        vs. {match.opponents}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 bg-surface-container-lowest rounded-xl tactile-card text-on-surface-variant font-body-md">
            No matches found in timeline.
          </div>
        )}
      </section>
    </div>
  );
}
