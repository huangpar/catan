'use client';

export default function DesktopPageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="hidden lg:flex items-start justify-between gap-6 mb-8 pb-6 border-b border-outline-variant/25">
      <div className="space-y-1 min-w-0">
        {eyebrow && (
          <p className="text-gold text-[11px] font-bold uppercase tracking-[0.2em]">{eyebrow}</p>
        )}
        <h1 className="font-serif text-[40px] xl:text-[44px] text-primary leading-tight">{title}</h1>
        {description && (
          <p className="text-on-surface-variant text-[15px] max-w-xl leading-relaxed pt-1">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0 pt-1">{actions}</div>}
    </header>
  );
}
