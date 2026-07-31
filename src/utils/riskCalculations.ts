import type {
  Allocation,
  AssetTier,
  DiversificationHealth,
  DynamicSummary,
  InvestmentHorizon,
  PortfolioAnalytics,
  RiskCategory,
} from '../types/risk';

/**
 * Redistributes slider values proportionally when one slider is changed.
 * Always guarantees low + medium + high === 100 with no negative values or rounding drift.
 */
export function redistributeAllocation(
  current: Allocation,
  changedTier: AssetTier,
  newValRaw: number
): Allocation {
  const newVal = Math.max(0, Math.min(100, Math.round(newValRaw)));
  const remaining = 100 - newVal;

  const otherTiers: AssetTier[] = (['low', 'medium', 'high'] as AssetTier[]).filter(
    (t) => t !== changedTier
  );

  const t1 = otherTiers[0];
  const t2 = otherTiers[1];
  const currentOtherSum = current[t1] + current[t2];

  let nextT1 = 0;
  let nextT2 = 0;

  if (currentOtherSum > 0) {
    nextT1 = Math.round((current[t1] / currentOtherSum) * remaining);
    nextT2 = remaining - nextT1;
  } else {
    nextT1 = Math.floor(remaining / 2);
    nextT2 = remaining - nextT1;
  }

  // Ensure non-negative
  if (nextT1 < 0) {
    nextT1 = 0;
    nextT2 = remaining;
  } else if (nextT2 < 0) {
    nextT2 = 0;
    nextT1 = remaining;
  }

  return {
    ...current,
    [changedTier]: newVal,
    [t1]: nextT1,
    [t2]: nextT2,
  };
}

/**
 * Calculates live portfolio analytics from an allocation object.
 */
export function calculatePortfolioAnalytics(allocation: Allocation): PortfolioAnalytics {
  const { low, medium, high } = allocation;

  // Weighted score model: low=1, medium=2, high=3 -> range [100, 300]
  const weightedSum = low * 1 + medium * 2 + high * 3; // 100 to 300
  const rawScore = ((weightedSum - 100) / 200) * 100;
  const riskScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Risk Category
  let riskCategory: RiskCategory = 'Balanced';
  if (riskScore <= 14) riskCategory = 'Very Conservative';
  else if (riskScore <= 30) riskCategory = 'Conservative';
  else if (riskScore <= 49) riskCategory = 'Balanced';
  else if (riskScore <= 65) riskCategory = 'Moderate Growth';
  else if (riskScore <= 80) riskCategory = 'Growth';
  else if (riskScore <= 94) riskCategory = 'Aggressive';
  else riskCategory = 'Highly Speculative';

  // Recommended Investment Horizon
  let recommendedHorizon: InvestmentHorizon = '5–7 Years';
  if (riskScore <= 20) recommendedHorizon = '1–3 Years';
  else if (riskScore <= 40) recommendedHorizon = '3–5 Years';
  else if (riskScore <= 60) recommendedHorizon = '5–7 Years';
  else if (riskScore <= 80) recommendedHorizon = '7–10 Years';
  else recommendedHorizon = '10+ Years';

  // Herfindahl-Hirschman Index (HHI) for Diversification
  const hhi = Math.pow(low / 100, 2) + Math.pow(medium / 100, 2) + Math.pow(high / 100, 2);

  let diversificationHealth: DiversificationHealth = 'Good';
  let diversificationReason = '';

  if (hhi <= 0.42) {
    diversificationHealth = 'Excellent';
    diversificationReason =
      'Capital is evenly distributed across multiple risk profiles, significantly reducing uncompensated asset-class vulnerability.';
  } else if (hhi <= 0.58) {
    diversificationHealth = 'Good';
    diversificationReason =
      'Healthy multi-tier distribution with a deliberate core risk profile tilt tailored for steady growth.';
  } else if (hhi <= 0.78) {
    diversificationHealth = 'Moderate';
    diversificationReason =
      'Concentrated primarily in 1–2 risk tiers. Portfolio performance will heavily depend on specific asset class cycles.';
  } else {
    diversificationHealth = 'Poor';
    diversificationReason =
      'High single-tier concentration risk. Exposed to severe drawdowns if this primary asset tier experiences market stress.';
  }

  // Expected Volatility (annualized standard deviation estimate)
  const expectedVolRaw = (low * 2 + medium * 14 + high * 32) / 100;
  const expectedVolatility = Math.round(expectedVolRaw * 10) / 10;

  let volatilityLabel: 'Low' | 'Moderate' | 'High' = 'Moderate';
  if (expectedVolatility < 8) volatilityLabel = 'Low';
  else if (expectedVolatility > 18) volatilityLabel = 'High';

  return {
    riskScore,
    riskCategory,
    recommendedHorizon,
    diversificationHealth,
    diversificationReason,
    expectedVolatility,
    volatilityLabel,
  };
}

/**
 * Generates dynamic AI Risk Summary based on allocation.
 */
export function generateDynamicSummary(
  allocation: Allocation,
  analytics: PortfolioAnalytics
): DynamicSummary {
  const { low, medium, high } = allocation;
  const { riskScore, expectedVolatility } = analytics;

  // Volatility Risk
  let volLevel: 'Low' | 'Moderate' | 'High' = 'Moderate';
  let volExplanation = '';
  if (expectedVolatility < 8) {
    volLevel = 'Low';
    volExplanation = `Estimated annual price fluctuation around ±${expectedVolatility}%. High cash/fixed income stability shields principal against short-term market corrections.`;
  } else if (expectedVolatility <= 18) {
    volLevel = 'Moderate';
    volExplanation = `Estimated annual volatility around ±${expectedVolatility}%. Moderate equity exposure balances capital growth potential with tolerable interim pullbacks.`;
  } else {
    volLevel = 'High';
    volExplanation = `Estimated annual volatility exceeds ±${expectedVolatility}%. Dominant high-risk exposure subjects portfolio to significant market swings and drawdowns over 20–40%.`;
  }

  // Horizon Alignment
  let horizonTarget: 'Short-term' | 'Medium-term' | 'Long-term' = 'Medium-term';
  let horizonEval = '';
  if (riskScore <= 30) {
    horizonTarget = 'Short-term';
    horizonEval =
      'Optimized for liquidity preservation and short-term capital needs (1–3 years) with minimal drawdown risk.';
  } else if (riskScore <= 70) {
    horizonTarget = 'Medium-term';
    horizonEval =
      'Requires a 3–7 year holding window to absorb interim market volatility and capture equity market appreciation.';
  } else {
    horizonTarget = 'Long-term';
    horizonEval =
      'Demands a 7–10+ year time horizon. Short-term liquidations would lock in severe cyclical downside risk.';
  }

  // Diversification Assessment
  let divLevel:
    | 'Highly Diversified'
    | 'Reasonably Diversified'
    | 'Concentrated'
    | 'Highly Concentrated' = 'Reasonably Diversified';
  let divReasoning = '';

  const maxVal = Math.max(low, medium, high);
  if (maxVal >= 80) {
    divLevel = 'Highly Concentrated';
    const topTier = low >= 80 ? 'Low Risk' : medium >= 80 ? 'Medium Risk' : 'High Risk';
    divReasoning = `Over ${maxVal}% of assets reside in ${topTier} instruments, creating extreme vulnerability to asset-class specific market regime shifts.`;
  } else if (maxVal >= 60) {
    divLevel = 'Concentrated';
    const topTier = low >= 60 ? 'Low Risk' : medium >= 60 ? 'Medium Risk' : 'High Risk';
    divReasoning = `${maxVal}% tilted toward ${topTier} assets. While intentional for specific goals, performance depends heavily on this single segment.`;
  } else if (maxVal >= 45) {
    divLevel = 'Reasonably Diversified';
    divReasoning =
      'Healthy core holding with secondary asset coverage to cushion broad market shocks and rebalancing opportunities.';
  } else {
    divLevel = 'Highly Diversified';
    divReasoning =
      'Exceptional balance across all three risk tiers, maximizing asset correlation non-alignment benefits.';
  }

  // Dynamic Educational Takeaways
  const takeaways: string[] = [];

  if (low > 50) {
    takeaways.push(
      'High cash and bond allocations minimize nominal loss risk but carry inflation erosion risk over long horizons.'
    );
  } else if (low < 15) {
    takeaways.push(
      'Low liquidity allocation increases sequence-of-returns risk if forced to liquidate equities during market drawdowns.'
    );
  } else {
    takeaways.push(
      'Maintaining a 15–30% conservative bucket provides an essential liquidity buffer during market dislocations.'
    );
  }

  if (high > 40) {
    takeaways.push(
      'High-risk instruments require high emotional tolerance for rapid 30%+ portfolio fluctuations without panicking.'
    );
  } else if (high === 0) {
    takeaways.push(
      'Zero high-risk exposure eliminates severe tail risk but limits long-term compounding excess returns.'
    );
  } else {
    takeaways.push(
      'Controlled exposure to high-risk assets offers enhanced growth potential when balanced with defensive anchors.'
    );
  }

  if (medium >= 40) {
    takeaways.push(
      'Broad index funds and blue chips historically offer the optimal risk-adjusted return ratio for multi-year horizons.'
    );
  } else {
    takeaways.push(
      'Rebalancing periodically between equity and fixed income captures volatility rebalancing premiums.'
    );
  }

  return {
    volatilityRisk: {
      level: volLevel,
      explanation: volExplanation,
    },
    horizonAlignment: {
      target: horizonTarget,
      evaluation: horizonEval,
    },
    diversificationAssessment: {
      level: divLevel,
      reasoning: divReasoning,
    },
    educationalTakeaways: takeaways,
  };
}
