'use client';

import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import DesktopSidebar from './components/DesktopSidebar';
import AppHeader from './components/AppHeader';
import LeaderboardView from './components/LeaderboardView';
import LogGameView from './components/LogGameView';
import HistoryView from './components/HistoryView';
import ProfileView from './components/ProfileView';
import AddPlayerView from './components/AddPlayerView';

import { getLeaderboard, getHistory, getPlayersList, logMatch } from './actions/gameActions';

export default function Home() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  const [leaderboard, setLeaderboard] = useState([]);
  const [history, setHistory] = useState([]);
  const [playersList, setPlayersList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadData(replacementSelectedId = null) {
    setLoading(true);
    try {
      const [ranks, matches, players] = await Promise.all([
        getLeaderboard(),
        getHistory(),
        getPlayersList(),
      ]);

      const playersMap = new Map(players.map(p => [p.id, p.avatar_url]));
      const enrichedMatches = matches.map(m => ({
        ...m,
        participants: m.participants.map(p => ({
          ...p,
          avatar: playersMap.get(p.id) || p.avatar
        }))
      }));

      setLeaderboard(ranks);
      setHistory(enrichedMatches);
      setPlayersList(players);

      const validIds = players.map((player) => player.id);
      setSelectedPlayerId((current) => {
        if (replacementSelectedId !== null) return replacementSelectedId;
        if (current && validIds.includes(current)) return current;
        return players[0]?.id ?? null;
      });
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
        await loadData();
        setActiveTab('leaderboard');
        return true;
      }

      alert('Failed to log match: ' + res.error);
      return false;
    } catch (error) {
      console.error('Error logging match:', error);
      alert('An unexpected error occurred while saving the match.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const goToLogGame = () => setActiveTab('log-game');

  return (
    <div className="min-h-screen lg:flex">
      <DesktopSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogGame={goToLogGame}
        onLogoClick={() => setActiveTab('leaderboard')}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72">
        <div className="lg:hidden w-full max-w-md mx-auto px-margin-mobile pt-2">
          <AppHeader onLogoClick={() => setActiveTab('leaderboard')} />
        </div>

        <main className="flex-1 w-full max-w-md lg:max-w-none mx-auto px-margin-mobile lg:px-10 xl:px-14 py-2 lg:py-8 pb-32 lg:pb-10">
          {activeTab === 'leaderboard' && (
            <LeaderboardView
              leaderboard={leaderboard}
              history={history}
              loading={loading}
              onSelectPlayer={handleSelectPlayer}
              onLogGame={goToLogGame}
            />
          )}

          {activeTab === 'log-game' && (
            <LogGameView
              playersList={playersList}
              onSaveMatch={handleSaveMatch}
              submitting={submitting}
            />
          )}

          {activeTab === 'history' && (
          <HistoryView
            history={history}
            loading={loading}
            onSelectPlayer={handleSelectPlayer}
            onLogGame={goToLogGame}
          />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              playerId={selectedPlayerId}
              onBack={() => setActiveTab('leaderboard')}
            />
          )}
          {activeTab === 'add-player' && (
            <AddPlayerView
              onPlayerCreated={async (playerId) => {
                await loadData(playerId);
                setActiveTab('profile');
              }}
            />
          )}
        </main>

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
