import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="pwa-offline-banner"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-red-600/90 border border-red-500/50 px-3 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-sm animate-pulse"
    >
      <WifiOff className="w-3.5 h-3.5" />
      <span>Offline Mode — Cached Telugu channels &amp; UI available</span>
    </div>
  );
};
