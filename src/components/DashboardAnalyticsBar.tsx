import React from 'react';
import { Activity, ShieldCheck, Clock, Layers } from 'lucide-react';
import type { PortfolioAnalytics } from '../types/risk';

interface DashboardAnalyticsBarProps {
  analytics: PortfolioAnalytics;
}

export const DashboardAnalyticsBar: React.FC<DashboardAnalyticsBarProps> = ({
  analytics,
}) => {
  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-[#00D084]';
    if (score <= 65) return 'text-[#F59E0B]';
    return 'text-[#EF4444]';
  };

  const getVolColor = (vol: number) => {
    if (vol < 8) return 'text-[#00D084]';
    if (vol <= 18) return 'text-[#F59E0B]';
    return 'text-[#EF4444]';
  };

  // Convert HHI to 0-100 diversification score where higher is better
  const divScore = analytics.diversificationHealth === 'Excellent' ? 92 :
                   analytics.diversificationHealth === 'Good' ? 78 :
                   analytics.diversificationHealth === 'Moderate' ? 58 : 35;

  const widgets = [
    {
      label: 'Portfolio Volatility',
      value: `±${analytics.expectedVolatility}%`,
      unit: '/ year',
      icon: Activity,
      valueColor: getVolColor(analytics.expectedVolatility),
    },
    {
      label: 'Risk Level',
      value: analytics.riskCategory,
      unit: `(${analytics.riskScore}/100)`,
      icon: ShieldCheck,
      valueColor: getRiskColor(analytics.riskScore),
    },
    {
      label: 'Investment Horizon',
      value: analytics.recommendedHorizon,
      unit: 'min window',
      icon: Clock,
      valueColor: 'text-[#3B82F6]',
    },
    {
      label: 'Diversification Score',
      value: `${divScore}/100`,
      unit: analytics.diversificationHealth,
      icon: Layers,
      valueColor: 'text-[#00D084]',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {widgets.map((w, idx) => {
        const Icon = w.icon;
        return (
          <div
            key={idx}
            className="bg-[#182235] border border-white/10 p-4 rounded-lg flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
              <span>{w.label}</span>
              <Icon className="w-4 h-4 text-slate-500" />
            </div>

            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${w.valueColor}`}>
                {w.value}
              </span>
              <span className="text-[11px] font-mono text-slate-500 font-medium truncate">
                {w.unit}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
