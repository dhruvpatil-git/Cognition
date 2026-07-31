import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart as PieIcon, Info, Shield, TrendingUp, Flame } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Allocation, PortfolioAnalytics } from '../types/risk';

interface RiskVisualizationProps {
  allocation: Allocation;
  analytics: PortfolioAnalytics;
}

export const RiskVisualization: React.FC<RiskVisualizationProps> = ({
  allocation,
  analytics,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = [
    {
      name: 'Low Risk Assets',
      value: allocation.low,
      color: '#10B981', // Emerald
      icon: Shield,
      examples: 'Cash, HYSA, T-Bills, Gov Bonds',
      volatility: '1.5% - 4.0%',
    },
    {
      name: 'Medium Risk Assets',
      value: allocation.medium,
      color: '#F59E0B', // Amber
      icon: TrendingUp,
      examples: 'S&P 500 ETF, Blue Chips, Index Funds',
      volatility: '12.0% - 18.0%',
    },
    {
      name: 'High Risk Assets',
      value: allocation.high,
      color: '#EF4444', // Crimson
      icon: Flame,
      examples: 'Cryptocurrency, Growth Stocks, Emerging Markets',
      volatility: '28.0% - 60.0%+',
    },
  ];

  // Filter out zero-value slices for cleaner donut render
  const visibleData = chartData.filter((d) => d.value > 0);

  // Custom Rich Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl shadow-xl text-xs max-w-xs space-y-1.5 z-50">
          <div className="flex items-center space-x-2 font-bold text-sm">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.name}</span>
          </div>
          <div className="text-lg font-black font-mono" style={{ color: data.color }}>
            {data.value}% of Portfolio
          </div>
          <p className="text-slate-300 text-[11px]">
            <span className="font-semibold text-slate-200">Key Assets:</span> {data.examples}
          </p>
          <p className="text-slate-400 text-[11px]">
            <span className="font-semibold text-slate-300">Hist. Volatility:</span> {data.volatility}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="visualization" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
            <PieIcon className="w-4 h-4 text-indigo-500" />
            <span>Section 3 — Interactive Allocation Chart</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Portfolio Allocation Breakdown
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
            Visualizing asset proportion across risk tiers. Hover over chart slices or legend items to inspect asset behavior details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        {/* Left Column: Recharts Donut Chart with Center Score Overlay (7 Cols) */}
        <div className="lg:col-span-7 relative flex items-center justify-center min-h-[340px] sm:min-h-[380px]">
          <div className="w-full h-[320px] sm:h-[360px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visibleData}
                  cx="50%"
                  cy="50%"
                  innerRadius="68%"
                  outerRadius="90%"
                  paddingAngle={4}
                  dataKey="value"
                  animationDuration={600}
                  animationEasing="ease-out"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {visibleData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#FFFFFF"
                      strokeWidth={3}
                      className="transition-all duration-300 cursor-pointer hover:opacity-90"
                      style={{
                        transform: activeIndex === index ? 'scale(1.03)' : 'scale(1)',
                        transformOrigin: 'center center',
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label Overlay inside Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Risk Score
              </span>
              <motion.span
                key={analytics.riskScore}
                initial={{ scale: 0.85, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-4xl sm:text-5xl font-black tracking-tight font-mono text-slate-900"
              >
                {analytics.riskScore}
              </motion.span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 mt-1">
                {analytics.riskCategory}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Custom Interactive Legend Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            Asset Class Exposure
          </h3>

          {chartData.map((item, idx) => {
            const Icon = item.icon;
            const isHovered = activeIndex === idx;

            return (
              <motion.div
                key={item.name}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isHovered
                    ? 'bg-slate-50 border-slate-400 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: item.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{item.examples}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className="text-xl font-black font-mono"
                      style={{ color: item.color }}
                    >
                      {item.value}%
                    </span>
                  </div>
                </div>

                {/* Progress bar line */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
