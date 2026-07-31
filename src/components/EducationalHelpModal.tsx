import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Layers, Activity, Clock, Target, TrendingDown, Sparkles } from 'lucide-react';

interface EducationalHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EducationalHelpModal: React.FC<EducationalHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedTopic, setSelectedTopic] = useState('diversification');

  if (!isOpen) return null;

  const topics = [
    {
      id: 'diversification',
      title: 'Why Diversification Matters',
      icon: Layers,
      content:
        'Combining uncorrelated asset classes lowers overall portfolio risk without sacrificing long-term expected returns. It removes unsystematic single-stock or sector risk.',
    },
    {
      id: 'volatility',
      title: 'Understanding Market Volatility',
      icon: Activity,
      content:
        'Volatility (Standard Deviation) measures price fluctuation speed. Price volatility is interim market noise and only turns into realized loss if forced to liquidate.',
    },
    {
      id: 'time_horizon',
      title: 'Time Horizon vs Risk',
      icon: Clock,
      content:
        'The probability of experiencing negative returns in equities drops dramatically as holding periods extend from 1 year (~26% loss probability) to 20 years (0% historical loss probability).',
    },
    {
      id: 'concentration',
      title: 'Concentration Risk',
      icon: Target,
      content:
        'Over-concentrating in single stocks or sectors exposes capital to uncompensated risk. Capital markets only compensate investors for broad systematic market risk.',
    },
    {
      id: 'drawdowns',
      title: 'Historical Market Drawdowns',
      icon: TrendingDown,
      content:
        'Major pullbacks (e.g. 2008 GFC -57%, 2020 COVID -34%) are natural market cycles. Portfolios matching proper time horizons recover and reach new highs.',
    },
  ];

  const activeTopic = topics.find((t) => t.id === selectedTopic) || topics[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="relative bg-[#0B1020] rounded-lg border border-white/10 shadow-2xl max-w-2xl w-full p-6 space-y-5 z-10 text-white font-mono"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-[#00D084]" />
              <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                Educational Risk Library
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded bg-[#131B2E] border border-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {topics.map((t) => {
              const isSelected = t.id === selectedTopic;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopic(t.id)}
                  className={`p-3 rounded text-left border transition-all text-xs font-semibold font-mono flex items-center space-x-2 ${
                    isSelected
                      ? 'bg-[#00D084] text-slate-950 border-[#00D084] font-bold'
                      : 'bg-[#131B2E] text-slate-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{t.title}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded bg-[#182235] border border-white/10 space-y-2">
            <h4 className="text-xs font-bold text-[#00D084] uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              {activeTopic.title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {activeTopic.content}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
