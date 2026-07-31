import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Layers,
  Activity,
  Clock,
  Target,
  TrendingDown,
  Sparkles,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

interface InsightTopic {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
  summary: string;
  fullContent: {
    corePrinciple: string;
    keyTakeaways: string[];
    historicalEvidence: string;
    exampleCase: string;
  };
}

export const EducationalInsights: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('diversification');

  const topics: InsightTopic[] = [
    {
      id: 'diversification',
      title: 'Why Diversification Matters',
      subtitle: 'The only "free lunch" in financial economics.',
      icon: Layers,
      badge: 'Core Concept',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      summary:
        'Combining uncorrelated asset classes lowers overall portfolio risk without sacrificing long-term expected returns.',
      fullContent: {
        corePrinciple:
          'Modern Portfolio Theory (MPT), formulated by Harry Markowitz, proves that spreading capital across assets with different performance cycles reduces variance (volatility) while maintaining expected baseline growth.',
        keyTakeaways: [
          'Unsystematic Risk Removal: Individual company or sector failure risks can be eliminated through broad diversification.',
          'Correlation Benefit: Assets that move in opposite directions (e.g. Treasury bonds vs equities during crashes) smooth out total portfolio equity curves.',
          'Compounding Preservation: Smaller drawdowns mean less capital is lost, making it exponentially easier for compound growth to resume.',
        ],
        historicalEvidence:
          'During the 2008 Financial Crisis, while US equities fell ~37%, long-term US Treasury bonds gained ~22%, providing crucial liquidity cushion.',
        exampleCase:
          'A 100% equity portfolio required a 100% gain to break even after a 50% loss. A 60/40 diversified portfolio suffered only a ~22% drawdown, requiring only a 28% gain to recover.',
      },
    },
    {
      id: 'volatility',
      title: 'Understanding Market Volatility',
      subtitle: 'Price fluctuation is not equivalent to permanent capital loss.',
      icon: Activity,
      badge: 'Risk Measurement',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      summary:
        'Volatility measures the speed and magnitude of price swings. It represents interim market noise rather than realized loss.',
      fullContent: {
        corePrinciple:
          'Volatility (measured mathematically by Standard Deviation) quantifies how widely asset returns disperse from their historical average. High volatility means wide price swings up and down over short periods.',
        keyTakeaways: [
          'Volatility vs Loss: Price volatility only turns into actual loss if an investor is forced to sell during a drawdown.',
          'Sequence of Returns Risk: Withdrawing funds during market dips permanently damages portfolio survival duration.',
          'Emotional Resilience: Investors who understand volatility profiles are far less likely to panic-sell at market bottoms.',
        ],
        historicalEvidence:
          'The S&P 500 experiences an average intra-year drawdown of ~14% every single year, yet positive annual returns occurred in ~75% of calendar years since 1928.',
        exampleCase:
          'An investor in 2020 saw their portfolio drop 30% in 22 trading days. Those who held firm recovered all losses within 5 months.',
      },
    },
    {
      id: 'time_horizon',
      title: 'Time Horizon vs Risk',
      subtitle: 'Time is the ultimate risk mitigant for growth assets.',
      icon: Clock,
      badge: 'Horizon Alignment',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      summary:
        'The probability of experiencing negative returns in equities drops dramatically as holding periods extend from 1 year to 20 years.',
      fullContent: {
        corePrinciple:
          'Short-term market returns are dominated by investor sentiment, news headlines, and macro liquidity shifts. Long-term returns are driven by corporate earnings growth and dividend reinvestment.',
        keyTakeaways: [
          '1-Year Window: Historically, US stock markets lost money roughly 1 out of every 4 years (~26% probability of loss).',
          '5-Year Window: The probability of loss drops to roughly 12%.',
          '20-Year Window: Historically, the S&P 500 has NEVER recorded a negative return over any rolling 20-year period in modern history.',
        ],
        historicalEvidence:
          'Even an investor who purchased at the exact peak of the 1929 stock crash earned positive real returns after holding for 15+ years.',
        exampleCase:
          'If you need funds in 18 months (e.g. house downpayment), equity volatility poses severe risk. If your target is 25 years away (retirement), equity short-term volatility is negligible.',
      },
    },
    {
      id: 'concentration',
      title: 'Concentration Risk',
      subtitle: 'Putting all eggs in one basket offers uncompensated risk.',
      icon: Target,
      badge: 'Portfolio Structure',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      summary:
        'Holding concentrated positions in a single stock, sector, or asset tier exposes capital to idiosyncratic risks without higher expected market returns.',
      fullContent: {
        corePrinciple:
          'Financial theory distinguishes between Systematic Risk (market-wide) and Specific Risk (company/sector-specific). Capital markets only compensate investors for taking Systematic Risk.',
        keyTakeaways: [
          'Single Stock Volatility: Individual companies face operational failure, competitive disruption, or fraud (e.g., Enron, Lehman Brothers).',
          'Sector Concentration: Tech-heavy portfolios in 2000 took 15 years just to break even after the Nasdaq collapsed 78%.',
          'Home Country Bias: Investing exclusively in domestic assets ignores global economic drivers.',
        ],
        historicalEvidence:
          'Over 40% of individual public companies listed in the US market experienced catastrophic, unrecoverable price declines (-70%+) between 1980 and 2020.',
        exampleCase:
          'An employee holding 80% of their net worth in their employer stock faces double concentration risk: losing their job and their investment capital simultaneously during a corporate downturn.',
      },
    },
    {
      id: 'drawdowns',
      title: 'Historical Market Drawdowns',
      subtitle: 'Understanding market crashes and recovery dynamics.',
      icon: TrendingDown,
      badge: 'Historical Reality',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
      summary:
        'Severe market pullbacks are normal components of long-term wealth creation. Portfolios must be structured to withstand them.',
      fullContent: {
        corePrinciple:
          'A drawdown is the peak-to-trough decline during a specific record period. Examining past drawdowns helps set realistic psychological expectations for interim portfolio drops.',
        keyTakeaways: [
          '2008 Great Financial Crisis: S&P 500 dropped -56.8%. Full price recovery took 4.5 years.',
          '2000 Dot-Com Crash: Nasdaq dropped -78.4%. Full recovery took 15 years.',
          '2020 COVID Crash: S&P 500 dropped -33.9%. Full recovery took only 5 months due to rapid policy response.',
        ],
        historicalEvidence:
          'Every major market drawdown in human history has eventually been surpassed by new all-time highs for broad market indexes.',
        exampleCase:
          'A balanced allocation (60% equity / 40% bonds) during 2008 experienced a drawdown of ~22% compared to ~57% for 100% equities, allowing conservative investors to remain invested without panic liquidating.',
      },
    },
  ];

  const activeTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];

  return (
    <section id="insights" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-teal-600 mb-2">
            <BookOpen className="w-4 h-4 text-teal-500" />
            <span>Section 4 — Educational Insights</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Financial Risk Education Studio
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
            Explore core financial concepts rooted in empirical market history, statistical risk mechanics, and behavioral finance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Topic Selector Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {topics.map((topic) => {
            const Icon = topic.icon;
            const isSelected = topic.id === selectedTopicId;

            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start space-x-3.5 group ${
                  isSelected
                    ? 'bg-white border-slate-900 ring-2 ring-slate-900/10 shadow-md'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{topic.title}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${topic.badgeColor}`}>
                      {topic.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                    {topic.summary}
                  </p>
                </div>

                <ChevronRight
                  className={`w-4 h-4 shrink-0 mt-1 transition-transform ${
                    isSelected ? 'text-slate-900 translate-x-1' : 'text-slate-300'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right Column: Detailed Educational Card Content (7 Cols) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTopic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6"
            >
              {/* Card Header */}
              <div className="pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${activeTopic.badgeColor}`}>
                    {activeTopic.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Empirical Risk Module</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {activeTopic.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  {activeTopic.subtitle}
                </p>
              </div>

              {/* Core Principle */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  Core Financial Principle
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed font-normal bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {activeTopic.fullContent.corePrinciple}
                </p>
              </div>

              {/* Key Takeaways */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-teal-500" />
                  Key Educational Takeaways
                </h4>
                <ul className="space-y-2">
                  {activeTopic.fullContent.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Historical Evidence Callout */}
              <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 space-y-1">
                <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block">
                  Empirical Market Evidence
                </span>
                <p className="text-xs sm:text-sm text-indigo-950 font-medium leading-relaxed">
                  {activeTopic.fullContent.historicalEvidence}
                </p>
              </div>

              {/* Example Case Study */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1 shadow-sm">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Real-World Scenario
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  {activeTopic.fullContent.exampleCase}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
