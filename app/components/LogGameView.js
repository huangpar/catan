'use client';

import { useState, useEffect } from 'react';

export default function LogGameView({ playersList, onSaveMatch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState('Catan');
  
  // Keep track of which players are participating, their scores, and who is the winner
  // Initialize with playersList, adding a "checked" flag, "score", and "isWinner"
  const [participants, setParticipants] = useState([]);
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(60);
  const [submitting, setSubmitting] = useState(false);

  const quickGames = ['Catan', 'Wingspan', 'Root', 'Azul', 'Terraforming Mars', 'Scythe'];

  useEffect(() => {
    if (playersList.length > 0) {
      // By default, select 3 players to mirror the Stitch mock, e.g. Alex Rivera, Sarah Chen, Marcus Todd if they exist, or the first 3
      const defaultNames = ['Alex Rivera', 'Sarah Chen', 'Marcus Todd', 'Alex Thorne'];
      
      const initialParticipants = playersList.map(player => {
        const isDefaultChecked = defaultNames.some(name => player.name.includes(name)) || playersList.slice(0, 3).some(p => p.id === player.id);
        
        return {
          id: player.id,
          name: player.name,
          avatar: player.avatar_url,
          checked: isDefaultChecked,
          score: player.name.includes('Alex Rivera') ? 124 : player.name.includes('Sarah Chen') ? 98 : player.name.includes('Marcus Todd') ? 84 : 0,
          isWinner: player.name.includes('Alex Rivera') // Alex Rivera is winner in mock
        };
      });
      
      // If none is marked as winner, mark the first checked player
      const hasWinner = initialParticipants.some(p => p.checked && p.isWinner);
      if (!hasWinner && initialParticipants.length > 0) {
        const firstChecked = initialParticipants.find(p => p.checked);
        if (firstChecked) firstChecked.isWinner = true;
      }

      setParticipants(initialParticipants);
    }
  }, [playersList]);

  // Filter players list by search query
  const filteredParticipants = participants.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleChecked = (id) => {
    setParticipants(prev => prev.map(p => {
      if (p.id !== id) return p;
      const newChecked = !p.checked;
      
      // If unchecking the winner, we must assign winner status to another checked player if possible
      let newIsWinner = p.isWinner;
      if (!newChecked && p.isWinner) {
        newIsWinner = false;
        // Find another checked player
        const otherChecked = prev.find(o => o.id !== id && o.checked);
        if (otherChecked) {
          setTimeout(() => {
            handleSetWinner(otherChecked.id);
          }, 0);
        }
      } else if (newChecked && !prev.some(o => o.checked && o.isWinner)) {
        newIsWinner = true; // Make it winner if it's the only one
      }

      return { ...p, checked: newChecked, isWinner: newIsWinner };
    }));
  };

  const handleSetWinner = (id) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === id) {
        // Winner must be checked
        return { ...p, isWinner: true, checked: true };
      }
      return { ...p, isWinner: false };
    }));
  };

  const handleScoreChange = (id, val) => {
    const scoreVal = parseInt(val, 10) || 0;
    setParticipants(prev => prev.map(p => 
      p.id === id ? { ...p, score: scoreVal } : p
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const activeParticipants = participants.filter(p => p.checked);
    
    if (activeParticipants.length < 2) {
      alert('Please select at least 2 participants for a board game match.');
      return;
    }

    const winner = activeParticipants.find(p => p.isWinner);
    if (!winner) {
      alert('Please select a winner for the match.');
      return;
    }

    setSubmitting(true);
    
    const formattedParticipants = activeParticipants.map(p => ({
      playerId: p.id,
      score: p.score,
      isWinner: p.isWinner
    }));

    const success = await onSaveMatch({
      gameName: selectedGame,
      participants: formattedParticipants,
      duration: parseInt(duration, 10) || 60,
      notes: notes,
      league: 'Standard'
    });

    setSubmitting(false);
    
    if (success) {
      // Clear state
      setNotes('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-stack-lg animate-fade-in pb-12">
      {/* Header Section */}
      <section className="space-y-stack-sm">
        <h2 className="font-headline-md text-[24px] font-bold text-on-surface">Log New Result</h2>
        <p className="font-body-md text-on-surface-variant">Record a match to update the leaderboard.</p>
      </section>

      {/* Game Selection */}
      <section className="space-y-stack-md">
        <label className="font-label-md text-[14px] text-primary uppercase tracking-wider block font-bold">
          Select Game
        </label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            className="w-full h-14 pl-12 pr-4 bg-[#F1F5F9] border-none rounded-xl font-body-md text-body-md focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none"
            placeholder="Search board games..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) setSelectedGame(e.target.value);
            }}
            type="text"
          />
        </div>

        {/* Quick Selection Carousel */}
        <div className="flex gap-gutter overflow-x-auto pb-2 scrollbar-hide">
          {quickGames.map((game) => {
            const isSelected = selectedGame.toLowerCase() === game.toLowerCase();
            return (
              <button
                key={game}
                type="button"
                onClick={() => {
                  setSelectedGame(game);
                  setSearchQuery('');
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-full border-1.5 transition-colors font-semibold text-[14px] cursor-pointer ${
                  isSelected
                    ? 'border-primary text-primary bg-white hover:bg-primary/5'
                    : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary bg-transparent'
                }`}
              >
                {game}
              </button>
            );
          })}
        </div>
      </section>

      {/* Player Selection & Outcome */}
      <section className="space-y-stack-md">
        <div className="flex justify-between items-end">
          <label className="font-label-md text-[14px] text-primary uppercase tracking-wider font-bold">
            Players &amp; Outcome
          </label>
          <span className="text-on-surface-variant font-label-sm text-[12px]">
            Tap player card to toggle winner
          </span>
        </div>

        {/* Player Cards Grid */}
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
          {filteredParticipants.map((p) => {
            return (
              <div
                key={p.id}
                className={`bg-surface-container-lowest rounded-xl p-stack-md shadow-[0_4px_12px_0_rgba(79,70,229,0.08)] flex items-center justify-between group transition-all duration-200 ${
                  p.checked ? 'opacity-100' : 'opacity-60'
                } ${p.checked && p.isWinner ? 'victory-border' : ''}`}
              >
                <div className="flex items-center gap-3 flex-1">
                  {/* Select Checkbox Checkbox */}
                  <input
                    type="checkbox"
                    checked={p.checked}
                    onChange={() => handleToggleChecked(p.id)}
                    className="w-5 h-5 text-primary border-outline-variant rounded focus:ring-primary cursor-pointer"
                  />
                  
                  {/* Avatar & Name Clickable to Toggle Winner */}
                  <div
                    onClick={() => p.checked && handleSetWinner(p.id)}
                    className={`flex items-center gap-3 flex-1 py-1 cursor-pointer ${
                      p.checked ? 'pointer-events-auto' : 'pointer-events-none'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container/10 flex items-center justify-center flex-shrink-0">
                      <img className="w-full h-full object-cover" src={p.avatar} alt={p.name} />
                    </div>
                    <div>
                      <p className="font-label-md text-[14px] text-on-surface font-semibold">{p.name}</p>
                      {p.checked && p.isWinner ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container/30 text-secondary text-[10px] font-bold uppercase tracking-tighter">
                          Winner
                        </span>
                      ) : p.checked ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase tracking-tighter">
                          Played
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-background text-outline text-[10px] font-medium uppercase tracking-tighter">
                          Idle
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    className="w-16 h-10 text-center bg-surface-container border-none rounded-lg font-bold outline-none focus:ring-1 focus:ring-primary-container"
                    placeholder="Pts"
                    type="number"
                    disabled={!p.checked}
                    value={p.checked ? p.score : ''}
                    onChange={(e) => handleScoreChange(p.id, e.target.value)}
                  />
                  {p.checked && p.isWinner ? (
                    <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center bg-primary text-white">
                      <span className="material-symbols-outlined text-[16px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check
                      </span>
                    </div>
                  ) : (
                    <div 
                      onClick={() => p.checked && handleSetWinner(p.id)}
                      className={`w-6 h-6 rounded-full border-2 border-outline-variant bg-white transition-colors cursor-pointer ${
                        p.checked ? 'hover:border-primary' : 'pointer-events-none opacity-20'
                      }`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Additional Details */}
      <section className="grid grid-cols-2 gap-gutter">
        <div className="space-y-stack-sm">
          <label className="font-label-md text-[14px] text-primary uppercase tracking-wider block font-bold">
            Duration (min)
          </label>
          <input
            className="w-full h-12 px-4 bg-[#F1F5F9] border-none rounded-xl font-body-md text-body-md focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div className="space-y-stack-sm">
          <label className="font-label-md text-[14px] text-primary uppercase tracking-wider block font-bold">
            Game Notes
          </label>
          <textarea
            className="w-full h-12 p-stack-sm px-4 bg-[#F1F5F9] border-none rounded-xl font-body-md text-body-md focus:ring-2 focus:ring-primary-container focus:bg-white transition-all resize-none outline-none"
            placeholder="e.g. Comeback win!"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </section>

      {/* Primary Action */}
      <section className="pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="w-full h-14 bg-primary text-white rounded-xl font-headline-sm text-[18px] font-bold inner-glow shadow-lg transition-all tap-interaction hover:bg-primary-container flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span className="material-symbols-outlined">
            {submitting ? 'sync' : 'save'}
          </span>
          {submitting ? 'Saving Match...' : 'Save Match'}
        </button>
      </section>
    </form>
  );
}
