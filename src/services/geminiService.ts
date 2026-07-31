import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from '../constants/systemPrompt';
import type { Allocation, PortfolioAnalytics } from '../types/risk';

const API_KEY_STORAGE_KEY = 'investor_risk_gemini_api_key';

/**
 * Retrieves active DeepSeek or Gemini API key from localStorage or Vite environment variables.
 */
export function getApiKey(): string {
  const localKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (localKey && localKey.trim()) {
    return localKey.trim().replace(/^["']|["']$/g, '');
  }

  const deepseekKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (deepseekKey && deepseekKey.trim()) {
    return deepseekKey.trim().replace(/^["']|["']$/g, '');
  }

  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim()) {
    return geminiKey.trim().replace(/^["']|["']$/g, '');
  }

  return '';
}

export function getGeminiApiKey(): string {
  return getApiKey();
}

export function saveGeminiApiKey(key: string): void {
  const sanitizedKey = key.trim().replace(/^["']|["']$/g, '');
  if (sanitizedKey) {
    localStorage.setItem(API_KEY_STORAGE_KEY, sanitizedKey);
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

/**
 * Calls DeepSeek API (https://api.deepseek.com) with automatic fallback to Gemini API and offline fallback.
 */
export async function askGeminiRiskAssistant(
  userQuery: string,
  allocation: Allocation,
  analytics: PortfolioAnalytics,
  conversationHistory: { role: 'user' | 'model'; parts: string[] }[] = []
): Promise<{ text: string; isRealGemini: boolean }> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return {
      text: getOfflineFallbackResponse(userQuery, allocation, analytics),
      isRealGemini: false,
    };
  }

  const portfolioContext = `
[CURRENT PORTFOLIO ALLOCATION SNAPSHOT]
• Low Risk Assets (Cash, T-Bills, HYSA): ${allocation.low}%
• Medium Risk Assets (S&P 500, Blue Chips): ${allocation.medium}%
• High Risk Assets (Crypto, Growth Stocks): ${allocation.high}%
• Portfolio Risk Score: ${analytics.riskScore} / 100 (${analytics.riskCategory})
• Suggested Investment Horizon: ${analytics.recommendedHorizon}
• Diversification Health: ${analytics.diversificationHealth}
• Expected Volatility: ±${analytics.expectedVolatility}% / year
`;

  const fullPrompt = `${portfolioContext}\n\nUSER QUESTION: ${userQuery}`;

  // STRATEGY 1: DEEPSEEK API (sk-...)
  if (apiKey.startsWith('sk-') || import.meta.env.VITE_DEEPSEEK_API_KEY) {
    const deepseekEndpoints = [
      'https://api.deepseek.com/chat/completions',
      'https://api.deepseek.com/v1/chat/completions',
    ];

    const deepseekMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map((h) => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.parts?.[0] || '',
      })),
      { role: 'user', content: fullPrompt },
    ];

    for (const endpoint of deepseekEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: deepseekMessages,
            temperature: 0.3,
            max_tokens: 1500,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const replyText = data?.choices?.[0]?.message?.content;
          if (replyText) {
            return { text: replyText, isRealGemini: true };
          }
        }
      } catch (err: any) {
        console.warn('DeepSeek API call failed:', err?.message || err);
      }
    }
  }

  // STRATEGY 2: GOOGLE GEMINI API (@google/genai)
  const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash'];
  let lastErrorMessage = '';

  try {
    const ai = new GoogleGenAI({ apiKey });
    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            ...conversationHistory.map((h) => ({
              role: h.role,
              parts: h.parts.map((p) => ({ text: p })),
            })),
            {
              role: 'user',
              parts: [{ text: fullPrompt }],
            },
          ],
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.3,
          },
        });

        const outputText = response.text || '';
        if (outputText) {
          return { text: outputText, isRealGemini: true };
        }
      } catch (err: any) {
        lastErrorMessage = err?.message || String(err);
      }
    }
  } catch (err: any) {
    lastErrorMessage = err?.message || String(err);
  }

  // STRATEGY 3: REST Bearer / Query fallback
  for (const modelName of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return { text, isRealGemini: true };
      }
    } catch (err: any) {
      lastErrorMessage = err?.message || String(err);
    }
  }

  console.warn('AI API call notice:', lastErrorMessage);

  return {
    text: getOfflineFallbackResponse(userQuery, allocation, analytics),
    isRealGemini: false,
  };
}

/**
 * Smart educational fallback response matching systemPrompt rules when no API Key is provided.
 */
function getOfflineFallbackResponse(
  userQuery: string,
  allocation: Allocation,
  analytics: PortfolioAnalytics
): string {
  const queryLower = userQuery.toLowerCase();

  if (queryLower.includes('tesla')) {
    return `I cannot tell you whether to buy Tesla. However, I can explain Tesla's historical volatility, concentration risk, sector exposure, and how those characteristics may relate to different investment horizons.

Tesla Historical Risk Characteristics:
• High Beta & Price Volatility: Tesla's stock historically exhibits annualized standard deviation exceeding 50%, far higher than broad S&P 500 index funds (~15%).
• Sector Exposure: Heavy sensitivity to EV market competition, battery supply chains, regulatory mandates, and tech sector sentiment.
• Single-Stock Concentration: Holding individual equities introduces non-systematic risk that cannot be diversified away without holding a broader basket of assets.

I can explain the risks associated with this asset, but I cannot provide direct investment recommendations. Please consult a certified financial advisor for personalized financial advice.`;
  }

  if (queryLower.includes('concentration risk')) {
    return `Concentration risk occurs when a portfolio holds a heavy percentage of assets in a single stock, sector, or asset category.

Key Educational Concepts:
• Uncompensated Risk: Broad market index funds pay a risk premium for systematic market risk, but individual company risks (like management errors or sector declines) offer no guaranteed compensation.
• Mitigation Strategy: Spreading assets across low, medium, and high-risk tiers reduces single-point-of-failure exposure.

I can explain the risks associated with this asset, but I cannot provide direct investment recommendations. Please consult a certified financial advisor for personalized financial advice.`;
  }

  return `I can explain the historical risk characteristics, volatility, and diversification principles related to your query, but I cannot recommend whether you should buy or sell any specific investment.

Active Portfolio Context:
• Low Risk: ${allocation.low}% | Medium Risk: ${allocation.medium}% | High Risk: ${allocation.high}%
• Risk Score: ${analytics.riskScore}/100 (${analytics.riskCategory})
• Suggested Horizon: ${analytics.recommendedHorizon}

I can explain the risks associated with this asset, but I cannot provide direct investment recommendations. Please consult a certified financial advisor for personalized financial advice.`;
}
