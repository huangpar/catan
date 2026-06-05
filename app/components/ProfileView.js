'use client';

import { useState, useEffect } from 'react';
import { getPlayerProfile, getPlayersList, updatePlayerAvatar } from '../actions/gameActions';
import PlayerAvatar from './PlayerAvatar';
import DesktopPageHeader from './DesktopPageHeader';

export default function ProfileView({ playerId, onBack }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(playerId);

  const loadPlayers = async () => {
    const list = await getPlayersList();
    setAllPlayers(list);
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  useEffect(() => {
    async function loadProfile() {
      if (!selectedPlayerId) {
        setProfile(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getPlayerProfile(selectedPlayerId);
      setProfile(data);
      setLoading(false);
    }
    loadProfile();
  }, [selectedPlayerId]);

  useEffect(() => {
    if (playerId) setSelectedPlayerId(playerId);
  }, [playerId]);

  const [editingAvatar, setEditingAvatar] = useState(false);
  const [avatarInput, setAvatarInput] = useState('');
  const [savingAvatar, setSavingAvatar] = useState(false);


  const formatDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="material-symbols-outlined text-[48px] animate-spin text-primary">sync</span>
        <p className="text-on-surface-variant text-sm font-medium">Loading Profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6 gap-4">
        <span className="material-symbols-outlined text-[64px] text-outline">person_off</span>
        <h3 className="font-serif text-[22px] text-on-surface">Player Not Found</h3>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold cursor-pointer tap-interaction"
          >
            Back to Rankings
          </button>
        )}
      </div>
    );
  }

  const playerSelect = (
    <select
      value={selectedPlayerId}
      onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
      className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-2 text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer lg:min-w-[200px]"
    >
      {allPlayers.map((p) => (
        <option key={p.id} value={p.id}>{p.name}</option>
      ))}
    </select>
  );

  const profileSidebar = (
    <div className="space-y-6 min-w-0">
      <section className="bg-surface-container-lowest rounded-2xl p-6 card-shadow flex flex-col items-center text-center">
        <div className="relative mb-4">
          <PlayerAvatar
            name={profile.name}
            src={profile.avatar_url}
            color={profile.color}
            size="lg"
            className="w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] border-[3px] border-gold-light"
          />
          <button
            type="button"
            onClick={() => {
              setAvatarInput(profile.avatar_url || `https://images.dicebear.com/api/identicon/${encodeURIComponent(profile.name)}.svg`);
              setEditingAvatar(true);
            }}
            className="absolute -right-2 -top-2 bg-white/90 text-sm px-2 py-1 rounded-full shadow border cursor-pointer z-10"
            aria-label="Edit avatar"
          >
            Edit
          </button>
          <div className="absolute -bottom-1 -right-1 bg-primary text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold border-2 border-white shadow">
            #{profile.rank}
          </div>
        </div>

        {editingAvatar && (
          <div className="w-full mt-2">
            <label className="text-[12px] font-semibold">Avatar URL</label>
            <div className="flex gap-2 mt-2">
              <input
                value={avatarInput}
                onChange={(e) => setAvatarInput(e.target.value)}
                className="flex-1 rounded-xl px-3 py-2 border border-outline-variant/30 bg-surface-container text-on-surface text-sm"
                placeholder="https://..."
              />
              <button
                type="button"
                disabled={savingAvatar}
                onClick={async () => {
                  try {
                    setSavingAvatar(true);
                    const res = await updatePlayerAvatar(selectedPlayerId, avatarInput);
                    if (res?.success) {
                      const updated = await getPlayerProfile(selectedPlayerId);
                      setProfile(updated);
                      setEditingAvatar(false);
                    } else {
                      // eslint-disable-next-line no-alert
                      alert(res?.error || 'Unable to save avatar');
                    }
                  } catch (err) {
                    // eslint-disable-next-line no-alert
                    alert('Error saving avatar');
                  } finally {
                    setSavingAvatar(false);
                  }
                }}
                className="px-3 py-2 rounded-xl bg-primary text-white font-semibold"
              >
                {savingAvatar ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setEditingAvatar(false)}
                className="px-3 py-2 rounded-xl border border-outline-variant/30 bg-surface-container text-on-surface font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <p className="text-gold text-[10px] font-bold uppercase tracking-[0.18em] mb-1">
          {profile.nickname || 'Board Game Champion'}
        </p>
        <h2 className="font-serif text-[28px] text-on-surface">{profile.name}</h2>

        {profile.streak > 0 ? (
          <span className="inline-flex items-center gap-1 mt-3 bg-secondary-container text-secondary px-3 py-1 rounded-full text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_fire_department
            </span>
            {profile.streak} Win Streak
          </span>
        ) : (
          <span className="inline-block mt-3 bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-[11px] font-semibold">
            Building momentum
          </span>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="bg-surface-container-lowest rounded-2xl p-5 card-shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Win Ratio</p>
          <p className="text-primary font-bold text-[28px] mt-1">{profile.winRatio}%</p>
          <div className="mt-3 h-1.5 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-500"
              style={{ width: `${profile.winRatio}%` }}
            />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 card-shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Best Title</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="material-symbols-outlined text-primary text-[24px]">architecture</span>
            <div className="min-w-0">
              <p className="font-semibold text-[13px] text-on-surface truncate">{profile.bestGame?.title || 'N/A'}</p>
              <p className="text-secondary text-[11px] font-bold">{profile.bestGame?.wins || 0} Wins</p>
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 bg-surface-container-lowest rounded-2xl p-5 card-shadow-sm flex items-center justify-between border-l-4 border-primary">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Total Victories</p>
            <p className="font-serif text-[22px] text-on-surface mt-0.5">{profile.wins} Matches Won</p>
          </div>
          <span className="material-symbols-outlined text-gold/30 text-[44px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            trophy
          </span>
        </div>
      </section>

    </div>
  );

  const timelineSection = (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-[22px] lg:text-[24px] text-on-surface">Match Timeline</h3>
        <span className="text-[11px] font-bold uppercase tracking-wider text-gold">Recent</span>
      </div>

      {profile.timeline?.length > 0 ? (
        <div className="space-y-3 lg:grid lg:grid-cols-2 xl:grid-cols-2 lg:gap-4 lg:space-y-0">
          {profile.timeline.map((match) => (
            <div
              key={match.id}
              className={`bg-surface-container-lowest rounded-xl p-4 card-shadow-sm ${
                match.isWinner ? 'border-l-4 border-secondary' : ''
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <p className="font-semibold text-[14px] text-on-surface">{match.gameName}</p>
                <span className="text-[11px] text-on-surface-variant shrink-0">{formatDate(match.playedAt)}</span>
              </div>

                <div className="flex items-center gap-2">
                  {match.isWinner ? (
                    <span className="bg-secondary-container text-secondary px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      Win
                    </span>
                  ) : (
                    <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      Played
                    </span>
                  )}
                </div>

              {match.opponents && (
                <p className="text-[11px] text-outline mt-2 truncate">vs. {match.opponents}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-surface-container-lowest rounded-xl card-shadow-sm text-on-surface-variant text-sm">
          No matches in timeline yet.
        </div>
      )}
    </section>
  );

  return (
    <div className="animate-fade-in pb-8 max-w-7xl mx-auto px-4 lg:px-0">
      <DesktopPageHeader
        eyebrow="Player Profile"
        title={profile.name}
        description={profile.nickname || 'Win stats and match history.'}
        actions={playerSelect}
      />

      <div className="lg:hidden flex items-center justify-between gap-3 mb-6">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-primary font-bold text-sm cursor-pointer tap-interaction"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Rankings
          </button>
        )}
        {playerSelect}
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(320px,380px)_1fr] gap-8 lg:items-start min-w-0">
        {profileSidebar}
        <div className="mt-8 lg:mt-0 min-w-0">{timelineSection}</div>
      </div>
    </div>
  );
}
