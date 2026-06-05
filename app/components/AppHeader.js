'use client';

export default function AppHeader({ onLogoClick }) {
  return (
    <header className="flex items-center justify-between py-3">
      <button
        type="button"
        onClick={onLogoClick}
        className="flex items-center gap-2 tap-interaction cursor-pointer"
      >
        <span className="material-symbols-outlined text-primary text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          castle
        </span>
        <span className="font-serif text-[22px] font-normal text-primary tracking-tight">CatanLog</span>
      </button>
      {/* <button
        type="button"
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors cursor-pointer"
        aria-label="Menu"
      >
        <span className="material-symbols-outlined text-on-surface text-[24px]">menu</span>
      </button> */}
    </header>
  );
}
