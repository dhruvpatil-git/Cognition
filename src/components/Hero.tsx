import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Layers, Sparkles, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import type { PortfolioAnalytics, Allocation } from '../types/risk';
import { PORTFOLIO_PRESETS } from '../constants/presets';

interface HeroProps {
  analytics: PortfolioAnalytics;
  currentAllocation: Allocation;
  onSelectPreset: (allocation: Allocation) => void;
  onExploreSimulator: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  analytics,
  currentAllocation,
  onSelectPreset,
  onExploreSimulator,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subtle financial canvas particle wave animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 450;
    };
    window.addEventListener('resize', handleResize);

    let step = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      step += 0.015;

      // Draw subtle glowing financial sine waves
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const strokeColor =
          i === 0
            ? 'rgba(16, 185, 129, 0.12)'
            : i === 1
            ? 'rgba(245, 158, 11, 0.08)'
            : 'rgba(99, 102, 241, 0.08)';
        ctx.strokeStyle = strokeColor;

        for (let x = 0; x < width; x += 10) {
          const y =
            height / 2 +
            Math.sin(x * 0.005 + step + i * 1.5) * (30 + i * 15) +
            Math.cos(x * 0.01 - step) * 15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Draw subtle grid dots
      ctx.fillStyle = 'rgba(148, 163, 184, 0.15)';
      for (let x = 20; x < width; x += 60) {
        for (let y = 20; y < height; y += 40) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Determine badge colors based on risk score
  const getRiskScoreBadge = (score: number) => {
    if (score <= 30) return { bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30', color: '#10B981' };
    if (score <= 65) return { bg: 'bg-amber-500/10 text-amber-700 border-amber-500/30', color: '#F59E0B' };
    return { bg: 'bg-rose-500/10 text-rose-700 border-rose-500/30', color: '#EF4444' };
  };

  const riskBadge = getRiskScoreBadge(analytics.riskScore);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Canvas Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
      />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Top Disclaimer Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-medium text-slate-300 mb-6 shadow-sm backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Risk & Horizon Simulator</span>
          <span className="w-1 h-1 rounded-full bg-slate-500"></span>
          <span className="text-slate-400">Strictly Educational</span>
        </motion.div>

        {/* Hero Title & Subtitle */}
        <div className="max-w-3xl mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Investor Risk Explainer{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300">
              Studio
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base sm:text-xl text-slate-300 font-normal leading-relaxed"
          >
            Understand portfolio risk—not investment advice.
            Visualize how asset allocation, historical volatility, and investment horizon interact to shape long-term wealth stability.
          </motion.p>
        </div>

        {/* SECTION 1 — Animated Live Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* Card 1: Portfolio Risk Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-xl shadow-xl shadow-slate-950/40 relative overflow-hidden group hover:border-slate-600 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Portfolio Risk Score
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${riskBadge.bg}`}>
                {analytics.riskCategory}
              </span>
            </div>

            <div className="flex items-baseline space-x-3 my-2">
              <motion.span
                key={analytics.riskScore}
                initial={{ opacity: 0.6, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-4xl sm:text-5xl font-black tracking-tight"
                style={{ color: riskBadge.color }}
              >
                {analytics.riskScore}
              </motion.span>
              <span className="text-sm font-medium text-slate-400">/ 100</span>
            </div>

            <p className="text-xs text-slate-300 mt-2 font-medium">
              Weighted asset score based on low, medium, & high risk distributions.
            </p>

            <div className="w-full bg-slate-700/60 rounded-full h-1.5 mt-4 overflow-hidden">
              <motion.div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${analytics.riskScore}%`,
                  backgroundColor: riskBadge.color,
                }}
              />
            </div>
          </motion.div>

          {/* Card 2: Suggested Investment Horizon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-xl shadow-xl shadow-slate-950/40 relative overflow-hidden group hover:border-slate-600 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                Suggested Horizon
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                Minimum Window
              </span>
            </div>

            <div className="my-2">
              <motion.span
                key={analytics.recommendedHorizon}
                initial={{ opacity: 0.6, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
              >
                {analytics.recommendedHorizon}
              </motion.span>
            </div>

            <p className="text-xs text-slate-300 mt-2 font-medium">
              Estimated duration needed to absorb cyclical drawdowns for this asset tier mix.
            </p>

            <div className="flex items-center space-x-1 mt-4 text-[11px] text-slate-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>Matching horizon reduces sequence-of-returns risk</span>
            </div>
          </motion.div>

          {/* Card 3: Diversification Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-xl shadow-xl shadow-slate-950/40 relative overflow-hidden group hover:border-slate-600 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-400" />
                Diversification Health
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  analytics.diversificationHealth === 'Excellent'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : analytics.diversificationHealth === 'Good'
                    ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                    : analytics.diversificationHealth === 'Moderate'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {analytics.diversificationHealth}
              </span>
            </div>

            <div className="my-2">
              <motion.span
                key={analytics.diversificationHealth}
                initial={{ opacity: 0.6, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
              >
                {analytics.diversificationHealth}
              </motion.span>
            </div>

            <p className="text-xs text-slate-300 mt-2 line-clamp-2 font-medium">
              {analytics.diversificationReason}
            </p>

            <div className="flex items-center space-x-1 mt-4 text-[11px] text-slate-400 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>HHI Concentration Index Evaluated</span>
            </div>
          </motion.div>
        </div>

        {/* Portfolio Presets Quick Selection */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Quick Portfolio Presets (Click to load allocation)
            </span>
            <button
              onClick={onExploreSimulator}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Custom Allocation Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PORTFOLIO_PRESETS.map((preset) => {
              const isSelected =
                currentAllocation.low === preset.allocation.low &&
                currentAllocation.medium === preset.allocation.medium &&
                currentAllocation.high === preset.allocation.high;

              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset.allocation)}
                  className={`p-3 rounded-xl text-left transition-all duration-200 border ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500/60 ring-1 ring-emerald-500/40 text-white'
                      : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold truncate">{preset.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {preset.badge}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    L:{preset.allocation.low}% | M:{preset.allocation.medium}% | H:{preset.allocation.high}%
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
