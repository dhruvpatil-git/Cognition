import React from 'react';
import { Shield, Sliders, HelpCircle } from 'lucide-react';
import type { Allocation } from '../types/risk';
import { PORTFOLIO_PRESETS } from '../constants/presets';

interface NavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  currentAllocation: Allocation;
  onSelectPreset: (allocation: Allocation) => void;
  onOpenHelpModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  currentAllocation,
  onSelectPreset,
  onOpenHelpModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B1020] border-b border-white/10 text-white h-14">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Left: Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-md bg-[#00D084] flex items-center justify-center text-slate-950 font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold tracking-tight text-white text-sm uppercase">
              Investor Risk Studio
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#131B2E] text-[#00D084] border border-white/10">
              v2.5 Terminal
            </span>
          </div>
        </div>

        {/* Center: Clean Segmented Control Presets */}
        <div className="hidden md:flex items-center bg-[#131B2E] p-1 rounded-md border border-white/10">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2.5">
            Presets:
          </span>
          <div className="flex space-x-1">
            {PORTFOLIO_PRESETS.map((preset) => {
              const isSelected =
                currentAllocation.low === preset.allocation.low &&
                currentAllocation.medium === preset.allocation.medium &&
                currentAllocation.high === preset.allocation.high;

              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset.allocation)}
                  className={`px-3 py-1 rounded text-xs font-semibold font-mono transition-all ${
                    isSelected
                      ? 'bg-[#00D084] text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {preset.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {/* Help Modal Button */}
          <button
            onClick={onOpenHelpModal}
            className="p-1.5 rounded-md bg-[#131B2E] border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-colors"
            title="Educational Modules"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Toggle Simulator Drawer Button */}
          <button
            onClick={onToggleSidebar}
            className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-bold font-mono transition-all border ${
              isSidebarOpen
                ? 'bg-[#00D084]/20 text-[#00D084] border-[#00D084]/40'
                : 'bg-[#182235] text-slate-200 border-white/10 hover:border-white/20'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#00D084]" />
            <span className="hidden sm:inline">
              {isSidebarOpen ? 'Close Simulator' : 'Risk Simulator'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
