'use client';

import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import LeaderboardView from './components/LeaderboardView';
import LogGameView from './components/LogGameView';
import HistoryView from './components/HistoryView';
import ProfileView from './components/ProfileView';

import { getLeaderboard, getHistory, getPlayersList, logMatch } from './actions/gameActions';

export default function Home() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  
  // Data States
  const [leaderboard, setLeaderboard] = useState([]);
  const [history, setHistory] = useState([]);
  const [playersList, setPlayersList] = useState([]);
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [ranks, matches, players] = await Promise.all([
        getLeaderboard(),
        getHistory(),
        getPlayersList()
      ]);
      
      setLeaderboard(ranks);
      setHistory(matches);
      setPlayersList(players);

      // Set default selected player for profile view (e.g. Alex Thorne or first in list)
      if (ranks.length > 0 && !selectedPlayerId) {
        setSelectedPlayerId(ranks[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch app data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectPlayer = (id) => {
    setSelectedPlayerId(id);
    setActiveTab('profile');
  };

  const handleSaveMatch = async (matchData) => {
    setSubmitting(true);
    try {
      const res = await logMatch(
        matchData.gameName,
        matchData.participants,
        matchData.duration,
        matchData.notes,
        matchData.league
      );

      if (res.success) {
        // Refetch all leaderboard and history lists
        await loadData();
        // Redirect to rankings
        setActiveTab('leaderboard');
        return true;
      } else {
        alert('Failed to log match: ' + res.error);
        return false;
      }
    } catch (error) {
      console.error('Error logging match:', error);
      alert('An unexpected error occurred while saving the match.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation AppBar */}
      <header className="bg-surface sticky top-0 z-40 flex items-center justify-between px-margin-mobile h-16 w-full max-w-md mx-auto border-b border-outline-variant/30 shadow-sm">
        <div 
          onClick={() => setActiveTab('leaderboard')}
          className="flex items-center gap-2 cursor-pointer tap-interaction"
        >
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            casino
          </span>
          <h1 className="font-display-lg text-[22px] font-extrabold text-primary tracking-tight">VictoryVault</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-all active:scale-95 cursor-pointer">
          <span className="material-symbols-outlined text-on-surface-variant">
            {activeTab === 'log-game' ? 'settings' : 'notifications'}
          </span>
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-md mx-auto px-margin-mobile pt-stack-md pb-32">
        {activeTab === 'leaderboard' && (
          <LeaderboardView
            leaderboard={leaderboard}
            loading={loading}
            onSelectPlayer={handleSelectPlayer}
          />
        )}

        {activeTab === 'log-game' && (
          <LogGameView
            playersList={playersList}
            onSaveMatch={handleSaveMatch}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            loading={loading}
            onSelectPlayer={handleSelectPlayer}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            playerId={selectedPlayerId}
            onBack={() => setActiveTab('leaderboard')}
          />
        )}
      </main>

      {/* Bottom Sticky Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
