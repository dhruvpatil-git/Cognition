import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Activity,
  Clock,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import type { Allocation, PortfolioAnalytics } from '../types/risk';
import { generateDynamicSummary } from '../utils/riskCalculations';

interface DynamicRiskSummaryProps {
  allocation: Allocation;
  analytics: PortfolioAnalytics;
}

export const DynamicRiskSummary: React.FC<DynamicRiskSummaryProps> = ({
  allocation,
  analytics,
}) => {
  const summary = generateDynamicSummary(allocation, analytics);

  const getVolatilityBadgeColor = (level: string) => {
    if (level === 'Low') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (level === 'Moderate') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  const getDiversificationBadgeColor = (level: string) => {
    if (level === 'Highly Diversified') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (level === 'Reasonably Diversified') return 'bg-teal-100 text-teal-800 border-teal-300';
    if (level === 'Concentrated') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  return (
    <section id="summary" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-2">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>Section 7 — Dynamic AI Risk Summary</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Real-Time Educational Portfolio Audit
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
            Automatically recalibrates whenever you adjust the risk sliders. Synthesizes volatility, horizon fit, and diversification assessment.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-medium shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Live Slider Sync Active</span>
        </div>
      </div>

      {/* Main Dynamic Panel */}
      <motion.div
        key={`${allocation.low}-${allocation.medium}-${allocation.high}`}
        initial={{ opacity: 0.8, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-8"
      >
        {/* Top 3 Core Audit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Volatility Risk */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-600" />
                Volatility Risk
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getVolatilityBadgeColor(summary.volatilityRisk.level)}`}>
                {summary.volatilityRisk.level} Risk
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {summary.volatilityRisk.explanation}
            </p>
          </div>

          {/* Card 2: Horizon Alignment */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                Horizon Alignment
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                {summary.horizonAlignment.target}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {summary.horizonAlignment.evaluation}
            </p>
          </div>

          {/* Card 3: Diversification Assessment */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-600" />
                Diversification Fit
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getDiversificationBadgeColor(summary.diversificationAssessment.level)}`}>
                {summary.diversificationAssessment.level}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {summary.diversificationAssessment.reasoning}
            </p>
          </div>
        </div>

        {/* SECTION 7 Educational Takeaways */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200">
              Tailored Educational Takeaways for this Allocation
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {summary.educationalTakeaways.map((takeaway, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start space-x-3"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
