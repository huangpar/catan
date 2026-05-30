'use client';

import { useState, useEffect } from 'react';
import PlayerAvatar from './PlayerAvatar';
import DesktopPageHeader from './DesktopPageHeader';

const GAME_NAME = 'Catan';

export default function LogGameView({ playersList, onSaveMatch, submitting = false }) {
  const [participants, setParticipants] = useState([]);
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(60);

  useEffect(() => {
    if (playersList.length > 0) {
      const initialParticipants = playersList.map((player, index) => ({
        id: player.id,
        name: player.name,
        avatar: player.avatar_url,
        checked: index < 3,
        isWinner: index === 0,
      }));

      setParticipants(initialParticipants);
    }
  }, [playersList]);

  const handleToggleChecked = (id) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;

        const newChecked = !p.checked;
        let newIsWinner = p.isWinner;

        if (!newChecked && p.isWinner) {
          newIsWinner = false;
          const otherChecked = prev.find((o) => o.id !== id && o.checked);
          if (otherChecked) {
            setTimeout(() => handleSetWinner(otherChecked.id), 0);
          }
        } else if (newChecked && !prev.some((o) => o.checked && o.isWinner)) {
          newIsWinner = true;
        }

        return { ...p, checked: newChecked, isWinner: newIsWinner };
      })
    );
  };

  const handleSetWinner = (id) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === id) return { ...p, isWinner: true, checked: true };
        return { ...p, isWinner: false };
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const activeParticipants = participants.filter((p) => p.checked);

    if (activeParticipants.length < 2) {
      alert('Please select at least 2 participants for a Catan match.');
      return;
    }

    if (!activeParticipants.find((p) => p.isWinner)) {
      alert('Please select a winner for the match.');
      return;
    }

    const success = await onSaveMatch({
      gameName: GAME_NAME,
      participants: activeParticipants.map((p) => ({
        playerId: p.id,
        isWinner: p.isWinner,
      })),
      duration: parseInt(duration, 10) || 60,
      notes,
      league: 'Standard',
    });

    if (success) {
      setNotes('');
    }
  };

  const matchDetailsSection = (
    <section className="space-y-4 bg-surface-container-lowest rounded-2xl p-5 lg:p-6 card-shadow">
      <div className="flex items-center gap-3 pb-1">
        <span
          className="material-symbols-outlined text-primary text-[28px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          hexagon
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            Game
          </p>
          <p className="font-serif text-[22px] text-on-surface leading-none">{GAME_NAME}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            Duration (min)
          </label>
          <input
            className="w-full h-11 px-4 bg-surface-container border border-outline-variant/30 rounded-xl outline-none focus:ring-2 focus:ring-primary/30"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            Notes
          </label>
          <input
            className="w-full h-11 px-4 bg-surface-container border border-outline-variant/30 rounded-xl outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Epic comeback!"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
    </section>
  );

  const playersSection = (
    <section className="space-y-3 bg-surface-container-lowest rounded-2xl p-5 lg:p-6 card-shadow">
      <div className="flex justify-between items-end">
        <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
          Players &amp; Outcome
        </label>
        <span className="text-[11px] text-on-surface-variant">Click to set winner</span>
      </div>

      <div className="space-y-2.5 max-h-[420px] lg:max-h-[520px] overflow-y-auto pr-1 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0 xl:grid-cols-1 xl:space-y-2.5">
        {participants.map((p) => (
          <div
            key={p.id}
            className={`bg-surface-container rounded-xl p-3.5 flex items-center gap-3 transition-opacity ${
              p.checked ? 'opacity-100' : 'opacity-55'
            } ${p.checked && p.isWinner ? 'ring-2 ring-secondary/40' : ''}`}
          >
            <input
              type="checkbox"
              checked={p.checked}
              onChange={() => handleToggleChecked(p.id)}
              className="w-4 h-4 accent-primary cursor-pointer"
            />

            <button
              type="button"
              onClick={() => p.checked && handleSetWinner(p.id)}
              className="flex items-center gap-3 flex-1 text-left cursor-pointer disabled:cursor-default min-w-0"
              disabled={!p.checked}
            >
              <PlayerAvatar name={p.name} src={p.avatar} size="md" />
              <div className="min-w-0">
                <p className="font-semibold text-[14px] text-on-surface truncate">{p.name}</p>
                {p.checked && p.isWinner ? (
                  <span className="text-[10px] font-bold uppercase text-secondary">Winner</span>
                ) : p.checked ? (
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant">Played</span>
                ) : null}
              </div>
            </button>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in pb-8">
      <DesktopPageHeader
        eyebrow="New Entry"
        title="Log New Match"
        description="Record a Catan session to update rankings and chronicles."
      />

      <section className="lg:hidden space-y-2 mb-6">
        <p className="text-gold text-[11px] font-bold uppercase tracking-[0.2em]">New Entry</p>
        <h1 className="font-serif text-[30px] text-on-surface">Log New Match</h1>
        <p className="text-on-surface-variant text-[14px]">
          Record a Catan session to update rankings and chronicles.
        </p>
      </section>

      <div className="space-y-6 lg:grid lg:grid-cols-[360px_1fr] xl:grid-cols-[400px_1fr] lg:gap-8 lg:space-y-0 lg:items-start">
        <div className="space-y-6 lg:sticky lg:top-8">
          {matchDetailsSection}
          <button
            type="submit"
            disabled={submitting}
            className="hidden lg:flex w-full h-12 bg-primary text-white rounded-xl font-bold text-[15px] card-shadow tap-interaction cursor-pointer hover:bg-primary-dark transition-colors disabled:opacity-50 items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">
              {submitting ? 'sync' : 'save'}
            </span>
            {submitting ? 'Saving Match...' : 'Save Match'}
          </button>
        </div>

        {playersSection}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="lg:hidden w-full h-12 mt-6 bg-primary text-white rounded-xl font-bold text-[15px] card-shadow tap-interaction cursor-pointer hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-[20px]">
          {submitting ? 'sync' : 'save'}
        </span>
        {submitting ? 'Saving Match...' : 'Save Match'}
      </button>
    </form>
  );
}
