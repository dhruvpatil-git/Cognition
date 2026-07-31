import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders,
  X,
  Shield,
  TrendingUp,
  Flame,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Allocation, AssetTier, PortfolioAnalytics } from '../types/risk';
import { generateDynamicSummary } from '../utils/riskCalculations';

interface RiskSimulatorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  allocation: Allocation;
  onAllocationChange: (newAllocation: Allocation, changedTier: AssetTier, val: number) => void;
  analytics: PortfolioAnalytics;
}

export const RiskSimulatorSidebar: React.FC<RiskSimulatorSidebarProps> = ({
  isOpen,
  onClose,
  allocation,
  onAllocationChange,
  analytics,
}) => {
  if (!isOpen) return null;

  const summary = generateDynamicSummary(allocation, analytics);

  const chartData = [
    { name: 'Low Risk', value: allocation.low, color: '#00D084' },
    { name: 'Medium Risk', value: allocation.medium, color: '#F59E0B' },
    { name: 'High Risk', value: allocation.high, color: '#EF4444' },
  ].filter((d) => d.value > 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        />

        {/* Drawer Panel */}
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-[#0B1020] text-white shadow-2xl h-full overflow-y-auto flex flex-col z-10 border-l border-white/10"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0B1020] z-20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-[#00D084]/20 border border-[#00D084]/40 flex items-center justify-center text-[#00D084]">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-white text-base uppercase tracking-wider font-mono">
                  Portfolio Risk Simulator
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Synchronized Proportional Redistribution
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md bg-[#131B2E] border border-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Close Simulator Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="p-6 space-y-6 flex-1">
            {/* Synchronized Sliders */}
            <div className="space-y-4">
              {/* Slider 1: Low Risk */}
              <div className="p-4 rounded-lg bg-[#182235] border border-white/10 space-y-2">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase">
                    <Shield className="w-4 h-4 text-[#00D084]" />
                    Low Risk Assets
                  </span>
                  <span className="text-sm font-black text-[#00D084]">
                    {allocation.low}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocation.low}
                  onChange={(e) => onAllocationChange(allocation, 'low', parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#131B2E] rounded appearance-none cursor-pointer custom-slider-emerald"
                  aria-label="Low Risk Assets Percentage Slider"
                />
                <p className="text-[11px] text-slate-400 font-mono">
                  Cash, HYSA, Treasury Bills, Money Market Funds
                </p>
              </div>

              {/* Slider 2: Medium Risk */}
              <div className="p-4 rounded-lg bg-[#182235] border border-white/10 space-y-2">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase">
                    <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
                    Medium Risk Assets
                  </span>
                  <span className="text-sm font-black text-[#F59E0B]">
                    {allocation.medium}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocation.medium}
                  onChange={(e) => onAllocationChange(allocation, 'medium', parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#131B2E] rounded appearance-none cursor-pointer custom-slider-amber"
                  aria-label="Medium Risk Assets Percentage Slider"
                />
                <p className="text-[11px] text-slate-400 font-mono">
                  S&P 500 ETFs, Blue Chip Stocks, Dividend ETFs
                </p>
              </div>

              {/* Slider 3: High Risk */}
              <div className="p-4 rounded-lg bg-[#182235] border border-white/10 space-y-2">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase">
                    <Flame className="w-4 h-4 text-[#EF4444]" />
                    High Risk Assets
                  </span>
                  <span className="text-sm font-black text-[#EF4444]">
                    {allocation.high}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocation.high}
                  onChange={(e) => onAllocationChange(allocation, 'high', parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#131B2E] rounded appearance-none cursor-pointer custom-slider-crimson"
                  aria-label="High Risk Assets Percentage Slider"
                />
                <p className="text-[11px] text-slate-400 font-mono">
                  Cryptocurrency, Growth Stocks, Emerging Markets
                </p>
              </div>
            </div>

            {/* Calculated Risk Analytics & Donut Preview */}
            <div className="p-5 rounded-lg bg-[#131B2E] border border-white/10 text-white space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/10 font-mono">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Calculated Risk Score
                  </span>
                  <span className="text-3xl font-black text-white">
                    {analytics.riskScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                  </span>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#00D084]/20 text-[#00D084] border border-[#00D084]/40">
                  {analytics.riskCategory}
                </span>
              </div>

              {/* Recharts Donut Preview */}
              <div className="h-40 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="85%"
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 font-mono">
                <div className="p-2.5 rounded bg-[#182235] border border-white/10">
                  <span className="text-[10px] text-slate-400 font-medium block">Suggested Horizon</span>
                  <span className="font-extrabold text-[#3B82F6]">{analytics.recommendedHorizon}</span>
                </div>
                <div className="p-2.5 rounded bg-[#182235] border border-white/10">
                  <span className="text-[10px] text-slate-400 font-medium block">Expected Volatility</span>
                  <span className="font-extrabold text-white">±{analytics.expectedVolatility}% / yr</span>
                </div>
              </div>
            </div>

            {/* Dynamic AI Risk Summary */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                Live Allocation Audit Takeaways
              </h3>

              <div className="space-y-2">
                {summary.educationalTakeaways.map((takeaway, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#182235] border border-white/10 text-xs text-slate-200 leading-snug flex items-start space-x-2 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-[#00D084] shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
};
