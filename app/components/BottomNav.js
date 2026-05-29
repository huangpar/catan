'use client';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
    { id: 'log-game', label: 'Log Game', icon: 'add_circle' },
    { id: 'history', label: 'History', icon: 'history' },
    { id: 'profile', label: 'Profile', icon: 'person' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-2 pb-6 bg-surface-container-lowest shadow-[0_-4px_12px_0_rgba(79,70,229,0.08)] rounded-t-xl z-50 transition-all border-t border-outline-variant/10">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center transition-all duration-300 tap-interaction px-4 py-1.5 rounded-xl cursor-pointer ${
              isActive
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{
                fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {tab.icon}
            </span>
            <span className="font-label-sm text-[12px] mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
