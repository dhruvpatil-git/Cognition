import React from 'react';
import { Sliders } from 'lucide-react';
import type { Allocation, PortfolioAnalytics } from '../types/risk';

interface PortfolioRiskPanelProps {
  allocation: Allocation;
  analytics: PortfolioAnalytics;
  onToggleSidebar: () => void;
}

export const PortfolioRiskPanel: React.FC<PortfolioRiskPanelProps> = ({
  allocation,
  analytics,
  onToggleSidebar,
}) => {
  return (
    <div className="bg-[#182235] border border-white/10 p-5 rounded-lg text-white space-y-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Portfolio Risk Model
          </span>
          <span className="text-lg font-black font-mono text-white">
            {analytics.riskCategory}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Risk Score
          </span>
          <div className="flex items-baseline space-x-1 justify-end font-mono">
            <span className="text-3xl font-black text-[#00D084]">
              {analytics.riskScore}
            </span>
            <span className="text-xs text-slate-400 font-bold">/ 100</span>
          </div>
        </div>
      </div>

      {/* Allocation Breakdown Rows */}
      <div className="space-y-2 font-mono text-xs">
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-300 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D084]" />
            Low Risk Assets
          </span>
          <span className="font-extrabold text-white">{allocation.low}%</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-300 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            Medium Risk Assets
          </span>
          <span className="font-extrabold text-white">{allocation.medium}%</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-300 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            High Risk Assets
          </span>
          <span className="font-extrabold text-white">{allocation.high}%</span>
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Suggested Horizon
          </span>
          <span className="text-xs font-mono font-extrabold text-[#3B82F6]">
            {analytics.recommendedHorizon}
          </span>
        </div>

        <button
          onClick={onToggleSidebar}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-md bg-[#00D084] text-slate-950 hover:bg-[#00D084]/90 text-xs font-mono font-bold transition-all shadow-sm"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Adjust Portfolio</span>
        </button>
      </div>
    </div>
  );
};
