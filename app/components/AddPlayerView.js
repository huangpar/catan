'use client';

import { useState } from 'react';
import { createPlayer } from '../actions/gameActions';
import DesktopPageHeader from './DesktopPageHeader';
import PlayerAvatar from './PlayerAvatar';

export default function AddPlayerView({ onPlayerCreated }) {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [color, setColor] = useState('#2563EB');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 5MB.');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file.');
      return;
    }

    setAvatarFile(file);
    setErrorMessage('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage('Player name is required.');
      return;
    }

    setSaving(true);
    
    // Use avatar preview (data URL) if available, otherwise empty string for default
    const avatarUrl = avatarPreview || '';
    const response = await createPlayer(trimmedName, nickname.trim(), avatarUrl, color);
    setSaving(false);

    if (!response.success) {
      setErrorMessage(response.error || 'Unable to add player.');
      return;
    }

    setSuccessMessage('Player added successfully.');
    setName('');
    setNickname('');
    setColor('#2563EB');
    setAvatarFile(null);
    setAvatarPreview(null);

    if (onPlayerCreated) {
      onPlayerCreated(response.playerId);
    }
  };

  return (
    <div className="animate-fade-in pb-8 max-w-7xl mx-auto px-4 lg:px-0">
      <DesktopPageHeader
        eyebrow="Roster"
        title="Add Player"
        description="Create a new player profile for your next game night."
      />

      <section className="bg-surface-container-lowest rounded-2xl p-6 card-shadow max-w-2xl mx-auto">
        <div className="space-y-4 mb-6">
          <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">New player</p>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Add a player to the roster so they can be selected for new matches and tracked in the leaderboard.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <label className="space-y-2 text-sm text-on-surface">
              <span className="font-semibold">Player Avatar (optional)</span>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-surface-container flex items-center justify-center border-2 border-dashed border-outline-variant/30">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <span className="material-symbols-outlined text-on-surface-variant text-[32px]">image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block w-full text-sm text-on-surface-variant
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-xl file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-white
                      hover:file:bg-primary-dark
                      file:cursor-pointer"
                  />
                  <p className="text-xs text-on-surface-variant mt-2">JPG, PNG, GIF up to 5MB</p>
                </div>
              </div>
            </label>

            <label className="space-y-2 text-sm text-on-surface">
              <span className="font-semibold">Player Name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter player name"
                className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>

            <label className="space-y-2 text-sm text-on-surface">
              <span className="font-semibold">Nickname (optional)</span>
              <input
                type="text"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="Add a nickname"
                className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>

            <label className="space-y-2 text-sm text-on-surface">
              <span className="font-semibold">Player Color</span>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="h-12 w-12 rounded-xl border border-outline-variant/30 bg-white p-0"
                />
                <span className="text-on-surface-variant">Choose a color that matches this player.</span>
              </div>
            </label>
          </div>

          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-sm text-green-500">{successMessage}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-primary text-white py-3 text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? 'Adding Player…' : 'Add Player'}
          </button>
        </form>
      </section>
    </div>
  );
}
