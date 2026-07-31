import type { AssetDetail, PortfolioPreset } from '../types/risk';

export const PORTFOLIO_PRESETS: PortfolioPreset[] = [
  {
    id: 'capital_preservation',
    name: 'Capital Preservation',
    description: 'Designed for short-term horizon (1–3 years) with maximum stability and high liquidity.',
    allocation: { low: 75, medium: 20, high: 5 },
    targetUser: 'Downpayment savings or emergency fund',
    badge: 'Low Volatility',
  },
  {
    id: 'balanced_60_40',
    name: 'Classic 60/40 Growth & Income',
    description: 'Traditional institutional mix balancing steady growth with interest-rate diversification.',
    allocation: { low: 35, medium: 50, high: 15 },
    targetUser: '5–7 year wealth building goals',
    badge: 'Balanced',
  },
  {
    id: 'aggressive_growth',
    name: 'Aggressive Capital Appreciation',
    description: 'Tilted heavily toward global equities and high-beta assets for maximum 10+ year growth.',
    allocation: { low: 10, medium: 55, high: 35 },
    targetUser: 'Long-term retirement accumulation',
    badge: 'High Volatility',
  },
  {
    id: 'speculative_tech',
    name: 'High Beta & Frontier Markets',
    description: 'High concentration in disruptive technology, crypto, and emerging market growth assets.',
    allocation: { low: 5, medium: 30, high: 65 },
    targetUser: 'Venture risk profile with long horizon',
    badge: 'Maximum Beta',
  },
];

export const ASSET_DETAILS: Record<string, AssetDetail> = {
  low: {
    name: 'Low Risk Assets',
    category: 'low',
    examples: [
      'Cash & HYSA',
      'Treasury Bills (1-12m)',
      'Government Bonds',
      'Money Market Funds',
      'Short-Term Certificates',
    ],
    historicalVol: '1.5% – 4.0%',
    maxDrawdown: '-0.5% to -2.0%',
    idealHorizon: '0 – 3 Years',
    description:
      'Backed by sovereign guarantees or short-duration credit. Offers capital preservation and immediate liquidity with minimal market price volatility.',
    color: '#10B981', // Emerald
  },
  medium: {
    name: 'Medium Risk Assets',
    category: 'medium',
    examples: [
      'S&P 500 ETFs',
      'Broad Index Funds',
      'Blue Chip Equities',
      'Balanced Mutual Funds',
      'Dividend Growth ETFs',
    ],
    historicalVol: '12.0% – 18.0%',
    maxDrawdown: '-20.0% to -35.0%',
    idealHorizon: '5 – 10 Years',
    description:
      'Ownership shares in mature commercial enterprises. Higher short-term price movement in exchange for long-term equity growth above inflation.',
    color: '#F59E0B', // Amber
  },
  high: {
    name: 'High Risk Assets',
    category: 'high',
    examples: [
      'Cryptocurrencies',
      'Emerging Market Equities',
      'Growth & Small Cap Stocks',
      'Leveraged/Sector ETFs',
      'Venture Capital Funds',
    ],
    historicalVol: '28.0% – 60.0%+',
    maxDrawdown: '-45.0% to -80.0%',
    idealHorizon: '10+ Years',
    description:
      'High beta and speculative growth drivers. Extreme interim price swings with potential for transformative upside or severe capital loss.',
    color: '#EF4444', // Crimson
  },
};
