import React from 'react';
import { useCMS } from '../context/CMSContext';
import { Sparkles } from 'lucide-react';

export const AnnouncementBanner: React.FC = () => {
  const { settings } = useCMS();

  if (!settings.announcementActive || !settings.announcementBanner.trim()) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 px-4 py-2 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md relative z-40">
      <div className="flex items-center gap-2 max-w-5xl mx-auto text-center truncate">
        <Sparkles className="w-4 h-4 text-slate-950 shrink-0 animate-pulse" />
        <span className="truncate">{settings.announcementBanner}</span>
      </div>
    </div>
  );
};
