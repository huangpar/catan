'use client';

function initialsFromName(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

function getColorStyle(color) {
  if (!color) return null;
  const hexMatch = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!hexMatch) return null;

  const hex = hexMatch[1].length === 3
    ? hexMatch[1].split('').map((ch) => ch + ch).join('')
    : hexMatch[1];

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const textColor = brightness > 155 ? '#111' : '#fff';

  return { backgroundColor: `#${hex}`, color: textColor };
}

export default function PlayerAvatar({ name, src, color, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-10 h-10 text-[12px]',
    lg: 'w-14 h-14 text-[14px]',
  };

  const colorStyle = getColorStyle(color);

  if (src) {
    return (
      <img
        alt={name || 'Player'}
        src={src}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 shadow-sm ${className}`}
        style={colorStyle ? { ...colorStyle, borderColor: colorStyle.backgroundColor } : undefined}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold border-2 shadow-sm ${className}`}
      style={colorStyle || undefined}
    >
      {initialsFromName(name)}
    </div>
  );
}
