import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export const StickyComplianceBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <aside
      aria-label="Compliance Disclaimer Banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xl z-50 transition-all duration-150"
    >
      <div className="bg-[#182235] text-white p-3.5 sm:p-4 rounded-lg border border-white/10 shadow-2xl flex items-center justify-between gap-3 font-mono">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded bg-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center shrink-0 text-[#F59E0B]">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold tracking-wide uppercase text-[#F59E0B]">
                Educational Risk Simulator Only
              </span>
              <span className="text-[10px] bg-[#131B2E] text-slate-300 px-1.5 py-0.5 rounded font-semibold border border-white/10">
                Not Financial Advice
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-snug mt-0.5">
              Investment Education Platform • Explains historical risk characteristics without buy/sell recommendations.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded bg-[#131B2E] border border-white/10 transition-colors shrink-0"
          aria-label="Dismiss compliance notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
