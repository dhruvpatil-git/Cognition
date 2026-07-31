export type AssetTier = 'low' | 'medium' | 'high';

export interface Allocation {
  low: number;
  medium: number;
  high: number;
}

export type RiskCategory =
  | 'Very Conservative'
  | 'Conservative'
  | 'Balanced'
  | 'Moderate Growth'
  | 'Growth'
  | 'Aggressive'
  | 'Highly Speculative';

export type InvestmentHorizon =
  | '1–3 Years'
  | '3–5 Years'
  | '5–7 Years'
  | '7–10 Years'
  | '10+ Years';

export type DiversificationHealth = 'Excellent' | 'Good' | 'Moderate' | 'Poor';

export interface PortfolioAnalytics {
  riskScore: number; // 0–100
  riskCategory: RiskCategory;
  recommendedHorizon: InvestmentHorizon;
  diversificationHealth: DiversificationHealth;
  diversificationReason: string;
  expectedVolatility: number; // percentage (e.g. 8.5%)
  volatilityLabel: 'Low' | 'Moderate' | 'High';
}

export interface DynamicSummary {
  volatilityRisk: {
    level: 'Low' | 'Moderate' | 'High';
    explanation: string;
  };
  horizonAlignment: {
    target: 'Short-term' | 'Medium-term' | 'Long-term';
    evaluation: string;
  };
  diversificationAssessment: {
    level: 'Highly Diversified' | 'Reasonably Diversified' | 'Concentrated' | 'Highly Concentrated';
    reasoning: string;
  };
  educationalTakeaways: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
  disclaimerIncluded?: boolean;
}

export interface PortfolioPreset {
  id: string;
  name: string;
  description: string;
  allocation: Allocation;
  targetUser: string;
  badge: string;
}

export interface AssetDetail {
  name: string;
  category: AssetTier;
  examples: string[];
  historicalVol: string;
  maxDrawdown: string;
  idealHorizon: string;
  description: string;
  color: string;
}
