import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders,
  Shield,
  TrendingUp,
  Flame,
  Info,
  ChevronDown,
  ChevronUp,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { Allocation, AssetTier, PortfolioAnalytics } from '../types/risk';
import { ASSET_DETAILS } from '../constants/presets';

interface RiskRebalancerProps {
  allocation: Allocation;
  onAllocationChange: (newAllocation: Allocation, changedTier: AssetTier, val: number) => void;
  analytics: PortfolioAnalytics;
}

export const RiskRebalancer: React.FC<RiskRebalancerProps> = ({
  allocation,
  onAllocationChange,
  analytics,
}) => {
  const [expandedTier, setExpandedTier] = useState<AssetTier | null>('medium');

  const handleSliderChange = (tier: AssetTier, value: number) => {
    onAllocationChange(allocation, tier, value);
  };

  const totalSum = allocation.low + allocation.medium + allocation.high;

  return (
    <section id="rebalancer" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-2">
            <Sliders className="w-4 h-4 text-emerald-500" />
            <span>Section 2 — Interactive Allocation Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Portfolio Risk Rebalancer
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
            Adjust the sliders below to simulate different asset tier allocations. The total allocation automatically maintains exactly 100% through proportional redistribution.
          </p>
        </div>

        {/* Total Sum Validator Indicator */}
        <div className="flex items-center space-x-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Total Allocation:</span>
            <span
              className={`font-mono text-base font-bold ${
                totalSum === 100 ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {totalSum}%
            </span>
          </div>
          {totalSum === 100 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-500 animate-pulse" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Synchronized Sliders (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Low Risk Assets */}
          <div
            className={`p-6 rounded-2xl bg-white border transition-all duration-300 shadow-sm hover:shadow-md ${
              expandedTier === 'low' ? 'ring-2 ring-emerald-500/30 border-emerald-500/40' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    Low Risk Assets
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Capital Preservation
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Cash, HYSA, Treasury Bills, Money Market Funds
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-emerald-600 font-mono">
                  {allocation.low}%
                </span>
              </div>
            </div>

            {/* Range Slider */}
            <div className="mt-4 mb-2">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={allocation.low}
                onChange={(e) => handleSliderChange('low', parseFloat(e.target.value))}
                className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer custom-slider-emerald focus:outline-none focus:ring-2 focus:ring-emerald-400"
                aria-label="Low Risk Assets Percentage Slider"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                <span>0% (Liquidity Risk)</span>
                <span>50%</span>
                <span>100% (Inflation Erosion Risk)</span>
              </div>
            </div>

            {/* Expandable Asset Detail */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setExpandedTier(expandedTier === 'low' ? null : 'low')}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-600 flex items-center space-x-1"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{expandedTier === 'low' ? 'Hide Asset Details' : 'View Sample Assets & Characteristics'}</span>
                {expandedTier === 'low' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            <AnimatePresence>
              {expandedTier === 'low' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-2"
                >
                  <p className="leading-relaxed">{ASSET_DETAILS.low.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium block uppercase">Hist. Volatility</span>
                      <span className="font-bold text-slate-700 font-mono">{ASSET_DETAILS.low.historicalVol}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium block uppercase">Max Drawdown</span>
                      <span className="font-bold text-slate-700 font-mono">{ASSET_DETAILS.low.maxDrawdown}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 font-medium block uppercase">Ideal Window</span>
                      <span className="font-bold text-slate-700 font-mono">{ASSET_DETAILS.low.idealHorizon}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Slider 2: Medium Risk Assets */}
          <div
            className={`p-6 rounded-2xl bg-white border transition-all duration-300 shadow-sm hover:shadow-md ${
              expandedTier === 'medium' ? 'ring-2 ring-amber-500/30 border-amber-500/40' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    Medium Risk Assets
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      Core Equity Growth
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    S&P 500 ETFs, Blue Chip Stocks, Dividend ETFs
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-amber-600 font-mono">
                  {allocation.medium}%
                </span>
              </div>
            </div>

            {/* Range Slider */}
            <div className="mt-4 mb-2">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={allocation.medium}
                onChange={(e) => handleSliderChange('medium', parseFloat(e.target.value))}
                className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer custom-slider-amber focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Medium Risk Assets Percentage Slider"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Expandable Asset Detail */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setExpandedTier(expandedTier === 'medium' ? null : 'medium')}
                className="text-xs font-semibold text-slate-600 hover:text-amber-600 flex items-center space-x-1"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{expandedTier === 'medium' ? 'Hide Asset Details' : 'View Sample Assets & Characteristics'}</span>
                {expandedTier === 'medium' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            <AnimatePresence>
              {expandedTier === 'medium' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-2"
                >
                  <p className="leading-relaxed">{ASSET_DETAILS.medium.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium block uppercase">Hist. Volatility</span>
                      <span className="font-bold text-slate-700 font-mono">{ASSET_DETAILS.medium.historicalVol}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium block uppercase">Max Drawdown</span>
                      <span className="font-bold text-slate-700 font-mono">{ASSET_DETAILS.medium.maxDrawdown}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 font-medium block uppercase">Ideal Window</span>
                      <span className="font-bold text-slate-700 font-mono">{ASSET_DETAILS.medium.idealHorizon}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Slider 3: High Risk Assets */}
          <div
            className={`p-6 rounded-2xl bg-white border transition-all duration-300 shadow-sm hover:shadow-md ${
              expandedTier === 'high' ? 'ring-2 ring-rose-500/30 border-rose-500/40' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    High Risk Assets
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      High Beta & Growth
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Cryptocurrency, Emerging Markets, Small Cap, Growth Stocks
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-rose-600 font-mono">
                  {allocation.high}%
                </span>
              </div>
            </div>

            {/* Range Slider */}
            <div className="mt-4 mb-2">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={allocation.high}
                onChange={(e) => handleSliderChange('high', parseFloat(e.target.value))}
                className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer custom-slider-crimson focus:outline-none focus:ring-2 focus:ring-rose-400"
                aria-label="High Risk Assets Percentage Slider"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100% (High Drawdown Vulnerability)</span>
              </div>
            </div>

            {/* Expandable Asset Detail */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setExpandedTier(expandedTier === 'high' ? null : 'high')}
                className="text-xs font-semibold text-slate-600 hover:text-rose-600 flex items-center space-x-1"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{expandedTier === 'high' ? 'Hide Asset Details' : 'View Sample Assets & Characteristics'}</span>
                {expandedTier === 'high' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            <AnimatePresence>
              {expandedTier === 'high' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-2"
                >
                  <p className="leading-relaxed">{ASSET_DETAILS.high.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium block uppercase">Hist. Volatility</span>
                      <span className="font-bold text-slate-700 font-mono">{ASSET_DETAILS.high.historicalVol}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium block uppercase">Max Drawdown</span>
                      <span className="font-bold text-slate-700 font-mono">{ASSET_DETAILS.high.maxDrawdown}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 font-medium block uppercase">Ideal Window</span>
                      <span className="font-bold text-slate-700 font-mono">{ASSET_DETAILS.high.idealHorizon}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Live Portfolio Analytics Engine (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Live Portfolio Analytics
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                Real-Time Model
              </span>
            </div>

            {/* Risk Score Meter */}
            <div className="mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Calculated Risk Score
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {analytics.riskCategory}
                </span>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-black text-slate-900 font-mono">
                  {analytics.riskScore}
                </span>
                <span className="text-xs font-semibold text-slate-400">/ 100</span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-3 mt-3 overflow-hidden p-0.5 border border-slate-200">
                <motion.div
                  className={`h-full rounded-full transition-all duration-300 ${
                    analytics.riskScore <= 30
                      ? 'bg-emerald-500'
                      : analytics.riskScore <= 65
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${analytics.riskScore}%` }}
                />
              </div>
            </div>

            {/* Key Metric Rows */}
            <div className="space-y-4">
              {/* Row 1: Recommended Horizon */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Recommended Investment Horizon</span>
                    <span className="text-sm font-extrabold text-slate-800">{analytics.recommendedHorizon}</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                  Calculated
                </span>
              </div>

              {/* Row 2: Diversification Health */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span className="text-xs text-slate-500 font-medium">Diversification Health</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-bold ${
                      analytics.diversificationHealth === 'Excellent'
                        ? 'bg-emerald-100 text-emerald-800'
                        : analytics.diversificationHealth === 'Good'
                        ? 'bg-teal-100 text-teal-800'
                        : analytics.diversificationHealth === 'Moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {analytics.diversificationHealth}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-snug mt-1.5">
                  {analytics.diversificationReason}
                </p>
              </div>

              {/* Row 3: Expected Volatility */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-slate-600" />
                    Expected Annual Volatility Range
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 font-mono">
                    ±{analytics.expectedVolatility}% / year
                  </span>
                </div>

                {/* Animated Volatility Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      analytics.expectedVolatility < 8
                        ? 'bg-emerald-500'
                        : analytics.expectedVolatility <= 18
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, (analytics.expectedVolatility / 35) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
