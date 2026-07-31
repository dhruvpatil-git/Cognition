import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from '../constants/systemPrompt';
import type { Allocation, PortfolioAnalytics } from '../types/risk';

const API_KEY_STORAGE_KEY = 'investor_risk_gemini_api_key';

/**
 * Retrieves active API key from Vite environment variables or localStorage.
 */
export function getApiKey(): string {
  const nvidiaKey = import.meta.env.VITE_NVIDIA_API_KEY;
  if (nvidiaKey && nvidiaKey.trim()) {
    return nvidiaKey.trim().replace(/^["']|["']$/g, '');
  }

  const deepseekKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (deepseekKey && deepseekKey.trim() && !deepseekKey.includes('your_deepseek_api_key_here')) {
    return deepseekKey.trim().replace(/^["']|["']$/g, '');
  }

  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim() && !geminiKey.includes('your_gemini_api_key_here')) {
    return geminiKey.trim().replace(/^["']|["']$/g, '');
  }

  const localKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (localKey && localKey.trim()) {
    return localKey.trim().replace(/^["']|["']$/g, '');
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
 * Helper to execute fetch with a strict timeout (default 3.5s) to prevent hanging.
 */
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 3500): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return response;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Calls Live AI Assistant with robust, non-blocking fallback architecture:
 * 1. NVIDIA NIM API (if key starts with nvapi-)
 * 2. Google Gemini API (if key starts with AIzaSy)
 * 3. DeepSeek API (if key starts with sk-)
 * 4. Free Live AI Endpoint (pollinations.ai)
 * 5. Smart Educational Fallback Engine (Instant 0ms response)
 */
export async function askGeminiRiskAssistant(
  userQuery: string,
  allocation: Allocation,
  analytics: PortfolioAnalytics,
  conversationHistory: { role: 'user' | 'model'; parts: string[] }[] = []
): Promise<{ text: string; isRealGemini: boolean }> {
  const apiKey = getApiKey();

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

  // STRATEGY 1: NVIDIA NIM API (nvapi-...)
  if (apiKey.startsWith('nvapi-')) {
    const nvidiaEndpoints = [
      '/api/nvidia/v1/chat/completions',
      'https://integrate.api.nvidia.com/v1/chat/completions',
    ];
    const nvidiaModels = [
      'deepseek-ai/deepseek-r1',
      'deepseek-ai/deepseek-v3',
      'meta/llama-3.3-70b-instruct',
    ];

    const nvidiaMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map((h) => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.parts?.[0] || '',
      })),
      { role: 'user', content: fullPrompt },
    ];

    for (const endpoint of nvidiaEndpoints) {
      for (const modelName of nvidiaModels) {
        try {
          const response = await fetchWithTimeout(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              model: modelName,
              messages: nvidiaMessages,
              temperature: 0.3,
              max_tokens: 1024,
            }),
          }, 3000);

          if (response.ok) {
            const data = await response.json();
            let replyText = data?.choices?.[0]?.message?.content;
            if (replyText) {
              replyText = replyText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
              if (replyText) return { text: replyText, isRealGemini: true };
            }
          }
        } catch (err: any) {
          // ignore & try next
        }
      }
    }
  }

  // STRATEGY 2: GOOGLE GEMINI API (AIzaSy...)
  if (apiKey.startsWith('AIzaSy')) {
    const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash'];
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
              { role: 'user', parts: [{ text: fullPrompt }] },
            ],
            config: {
              systemInstruction: SYSTEM_PROMPT,
              temperature: 0.3,
            },
          });

          const outputText = response.text || '';
          if (outputText) return { text: outputText, isRealGemini: true };
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // STRATEGY 3: DEEPSEEK API (sk-...)
  if (apiKey.startsWith('sk-')) {
    const deepseekEndpoints = [
      '/api/deepseek/chat/completions',
      'https://api.deepseek.com/chat/completions',
    ];

    for (const endpoint of deepseekEndpoints) {
      try {
        const response = await fetchWithTimeout(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...conversationHistory.map((h) => ({
                role: h.role === 'user' ? 'user' : 'assistant',
                content: h.parts?.[0] || '',
              })),
              { role: 'user', content: fullPrompt },
            ],
            temperature: 0.3,
          }),
        }, 3000);

        if (response.ok) {
          const data = await response.json();
          const replyText = data?.choices?.[0]?.message?.content;
          if (replyText) return { text: replyText, isRealGemini: true };
        }
      } catch (e) {
        // ignore
      }
    }
  }

  // STRATEGY 4: FREE LIVE AI PROVIDER (Pollinations AI)
  try {
    const freeMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map((h) => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.parts?.[0] || '',
      })),
      { role: 'user', content: fullPrompt },
    ];

    const freeResponse = await fetchWithTimeout('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: freeMessages,
        model: 'openai',
        temperature: 0.3,
      }),
    }, 2500);

    if (freeResponse.ok) {
      const liveText = await freeResponse.text();
      if (liveText && liveText.trim() && !liveText.includes('Internal Server Error')) {
        return { text: liveText.trim(), isRealGemini: true };
      }
    }
  } catch (e) {
    // ignore
  }

  // STRATEGY 5: INSTANT EDUCATIONAL RISK ENGINE FALLBACK (0ms)
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
