'use client';

import { TABS } from './DesktopSidebar';

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 px-4 pb-6 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent">
      <div className="max-w-md mx-auto flex justify-around items-end bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl px-2 py-2 card-shadow border border-outline-variant/20">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[72px] py-1.5 px-2 rounded-xl transition-all duration-200 tap-interaction cursor-pointer ${
                isActive ? '' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span
                className={`flex items-center justify-center w-[52px] h-8 rounded-full transition-all ${
                  isActive ? 'bg-primary text-white' : ''
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {tab.icon}
                </span>
              </span>
              <span className={`text-[11px] font-semibold ${isActive ? 'text-primary' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
