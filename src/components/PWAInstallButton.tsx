import React, { useState } from 'react';
import { Download, CheckCircle2, MonitorSmartphone, X, Share, PlusSquare, Smartphone, Tv } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundEffects } from '../utils/sound';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  const handleInstallClick = async () => {
    soundEffects.playNavTick();
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        id="btn-pwa-install-app"
        onClick={handleInstallClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 shrink-0 ${
          isInstalled
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-black shadow-md shadow-orange-950/40 hover:scale-[1.03] active:scale-95'
        }`}
        title={isInstalled ? 'App is installed on your device' : 'Install Telugu Ultra TV on your TV, Phone, or PC'}
      >
        {isInstalled ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline font-mono">Installed</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="font-mono">Install App</span>
          </>
        )}
      </button>

      {/* Installation Guide Dialog for all platforms */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <MonitorSmartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-['Outfit'] tracking-wide">
                    Install Telugu Ultra TV
                  </h3>
                  <p className="text-[11px] text-white/50">Run full-screen without address bar</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {isInstallable && (
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300 flex items-center justify-between">
                  <span>Direct 1-Click Install is ready:</span>
                  <button
                    onClick={async () => {
                      await install();
                      setShowGuideModal(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-orange-500 text-black font-bold text-xs hover:bg-orange-400"
                  >
                    Install Now
                  </button>
                </div>
              )}

              {/* Android & Smart TV */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-orange-400">
                  <Tv className="w-3.5 h-3.5" />
                  <span>Android TV &amp; Android Phones:</span>
                </div>
                <p className="text-white/70 pl-5 text-[11px] leading-relaxed">
                  1. In Chrome / Browser, tap the <strong>three dots menu (⋮)</strong> at the top-right.
                  <br />
                  2. Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  <br />
                  3. Launch directly from your TV home screen or app launcher!
                </p>
              </div>

              {/* PC / Mac / Chrome */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-sky-400">
                  <MonitorSmartphone className="w-3.5 h-3.5" />
                  <span>PC / Mac / Chromebook:</span>
                </div>
                <p className="text-white/70 pl-5 text-[11px] leading-relaxed">
                  Look at the right side of the Chrome/Edge address bar and click the <strong>Install icon (⊕)</strong> or open browser menu → <strong>"Install Telugu Ultra TV"</strong>.
                </p>
              </div>

              {/* iOS Safari */}
              {isIOS && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-emerald-400">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>iPhone &amp; iPad (Safari):</span>
                  </div>
                  <p className="text-white/70 pl-5 text-[11px] leading-relaxed">
                    1. Tap the <Share className="w-3 h-3 inline mx-1" /> <strong>Share</strong> button at bottom.
                    <br />
                    2. Scroll down and tap <PlusSquare className="w-3 h-3 inline mx-1" /> <strong>Add to Home Screen</strong>.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
