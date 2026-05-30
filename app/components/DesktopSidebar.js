'use client';

const TABS = [
  { id: 'leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
  { id: 'log-game', label: 'Log Game', icon: 'add_circle' },
  { id: 'add-player', label: 'Add Player', icon: 'person_add' },
  { id: 'history', label: 'History', icon: 'history' },
  { id: 'profile', label: 'Profile', icon: 'person' },
];

export default function DesktopSidebar({ activeTab, setActiveTab, onLogGame, onLogoClick }) {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 bg-surface-container-lowest border-r border-outline-variant/30 card-shadow-sm">
      <div className="flex flex-col h-full p-6">
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-2.5 mb-10 tap-interaction cursor-pointer text-left"
        >
          <span
            className="material-symbols-outlined text-primary text-[28px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            castle
          </span>
          <span className="font-serif text-[24px] text-primary leading-none">CatanLog</span>
        </button>


        <nav className="flex flex-col gap-1 flex-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold transition-colors cursor-pointer tap-interaction ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="pt-6 mt-auto border-t border-outline-variant/30 space-y-4">
          <button
            type="button"
            onClick={onLogGame}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold text-[14px] card-shadow tap-interaction cursor-pointer hover:bg-primary-dark transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Log New Match
          </button>
          <p className="text-[11px] text-on-surface-variant text-center leading-relaxed">
            Track wins, streaks, and conquests across your game nights.
          </p>
        </div>
      </div>
    </aside>
  );
}

export { TABS };
