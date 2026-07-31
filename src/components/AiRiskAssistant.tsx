import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  User,
  Send,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import type { ChatMessage } from '../types/risk';

// Realistic prepopulated 3-turn conversation adhering to systemPrompt guardrails
const INITIAL_CONVERSATION: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    text: "I'm saving for a house in two years, but most of my investments are in technology stocks.",
    timestamp: '10:14 AM',
  },
  {
    id: 'msg-2',
    sender: 'assistant',
    text: `I can explain the risks associated with concentrated technology exposure, but I cannot recommend whether you should buy or sell investments.

For a 2-year time horizon, technology stocks carry high historical volatility (often 25%–35% annual standard deviation) and severe drawdown potential (e.g. -30% to -50% during tech pullbacks). If a sector downturn occurs during your 2-year window, you could face forced liquidation at a loss to meet your house closing deadline.

Key Risk Factors:
• High Concentration Risk: Heavy reliance on a single sector.
• Horizon Mismatch: Equities generally require a 5–7+ year window to reliably absorb cyclical dips.

I can explain the risks associated with this asset, but I cannot provide direct investment recommendations. Please consult a certified financial advisor for personalized financial advice.`,
    timestamp: '10:14 AM',
    disclaimerIncluded: true,
  },
  {
    id: 'msg-3',
    sender: 'user',
    text: 'How does rebalancing into low-risk assets help protect my two-year goal timeline?',
    timestamp: '10:15 AM',
  },
  {
    id: 'msg-4',
    sender: 'assistant',
    text: `Rebalancing into low-risk assets (such as Treasury Bills, High Yield Savings, or Money Market Funds) aligns your capital preservation needs with your 2-year duration.

Historical Behavior Analysis:
1. Capital Stability: Short-term Treasuries and HYSA have near-zero price volatility (~1.5%), shielding your principal from equity market downturns.
2. Liquidity Matching: Ensuring funds are available exactly when needed without lock-up penalties or market timing stress.
3. Sequence Risk Protection: Removing the risk of an ill-timed stock crash right before your house closing date.

I can explain the risks associated with this asset, but I cannot provide direct investment recommendations. Please consult a certified financial advisor for personalized financial advice.`,
    timestamp: '10:15 AM',
    disclaimerIncluded: true,
  },
  {
    id: 'msg-5',
    sender: 'user',
    text: 'Is cryptocurrency a suitable asset for short-term home savings?',
    timestamp: '10:16 AM',
  },
  {
    id: 'msg-6',
    sender: 'assistant',
    text: `Cryptocurrency exhibits extreme historical price volatility (annualized volatility exceeding 60%–90%) and frequent drawdowns exceeding 50% to 80%.

When evaluated against a 2-year horizon:
• High Probability of Drawdown: Cryptocurrencies experience multi-year "crypto winters" where asset recovery can take several years.
• Uncompensated Speculative Risk: Short-term volatility can liquidate a large portion of your downpayment precisely when you need it.
• Asset Allocation Rule of Thumb: High-risk, high-volatility assets generally require 10+ year horizons so investors can survive interim crashes.

I can explain the risks associated with this asset, but I cannot provide direct investment recommendations. Please consult a certified financial advisor for personalized financial advice.`,
    timestamp: '10:16 AM',
    disclaimerIncluded: true,
  },
];

const PRESET_QUESTIONS = [
  'Should I buy Tesla?',
  'Explain concentration risk in simple terms',
  'What is sequence of returns risk?',
  'Why do equities require a 7+ year horizon?',
  'How does inflation affect cash savings?',
];

export const AiRiskAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CONVERSATION);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Client-side AI response generator enforcing SYSTEM_PROMPT guardrails
  const generateAssistantResponse = (userQuery: string): string => {
    const queryLower = userQuery.toLowerCase();

    // Handle "Should I buy Tesla?" specifically as outlined in SYSTEM_PROMPT rule 6
    if (queryLower.includes('tesla')) {
      return `I cannot tell you whether to buy Tesla. However, I can explain Tesla's historical volatility, concentration risk, sector exposure, and how those characteristics may relate to different investment horizons.

Tesla Historical Risk Profile:
• High Beta & Volatility: Tesla's stock historically exhibits annualized standard deviation exceeding 50%, far higher than broad S&P 500 index funds (~15%).
• Sector Exposure: Heavy sensitivity to EV market competition, regulatory mandates, and tech sector sentiment.
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

    if (queryLower.includes('sequence of returns')) {
      return `Sequence of Returns Risk refers to the danger that the timing of market drawdowns will negatively impact long-term portfolio longevity—especially when withdrawing funds.

Why It Matters:
• If severe negative returns occur early in your withdrawal phase, your principal is reduced before compounding can rebuild it.
• Solution: Maintaining a 2–3 year buffer of low-risk cash/short-term bonds shields you from selling equities at depressed trough prices.

I can explain the risks associated with this asset, but I cannot provide direct investment recommendations. Please consult a certified financial advisor for personalized financial advice.`;
    }

    if (queryLower.includes('inflation')) {
      return `Inflation erosion is the silent risk of holding excessive cash or low-risk assets over multi-year horizons.

Historical Context:
• Purchasing Power Loss: If inflation averages 3% per year, cash loses half its purchasing power in approximately 24 years.
• Horizon Balancing: Low-risk assets protect nominal principal over 1–3 years, but medium/high-risk growth assets are required to outpace long-term CPI inflation.

I can explain the risks associated with this asset, but I cannot provide direct investment recommendations. Please consult a certified financial advisor for personalized financial advice.`;
    }

    // Default intelligent educational response strictly adhering to SYSTEM_PROMPT
    return `I can explain the historical risk characteristics, volatility, and diversification principles related to your query, but I cannot recommend whether you should buy or sell any specific investment.

Risk Assessment Principles:
• Volatility: Price fluctuation reflects short-term market sentiment rather than fundamental long-term value.
• Diversification: Balancing low, medium, and high-risk assets lowers portfolio variance while protecting liquidity.
• Time Horizon: Longer horizons (7–10+ years) allow investors to absorb equity market pullbacks.

I can explain the risks associated with this asset, but I cannot provide direct investment recommendations. Please consult a certified financial advisor for personalized financial advice.`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const messageText = textToSend || inputText;
    if (!messageText.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Simulate realistic AI thought process & response speed
    setTimeout(() => {
      const responseText = generateAssistantResponse(messageText);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        disclaimerIncluded: true,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_CONVERSATION);
  };

  return (
    <section id="assistant" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
            <Bot className="w-4 h-4 text-indigo-500" />
            <span>Section 6 — Interactive AI Risk Assistant</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Educational Risk AI Tutor
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
            Ask questions regarding portfolio risk, horizon matching, and asset class volatility. Enforces 100% non-advisory compliance guardrails.
          </p>
        </div>

        <button
          onClick={handleResetChat}
          className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Conversation</span>
        </button>
      </div>

      {/* Chat Window Container */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-white flex flex-col h-[650px] relative">
        {/* Chat Header Bar */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-teal-500 to-emerald-500 flex items-center justify-center ring-1 ring-white/20 shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">Risk Explainer Assistant</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Guardrails Active
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Strictly Non-Advisory • Educational Explanations Only
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>systemPrompt.ts Compliant</span>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm ${
                    isUser
                      ? 'bg-slate-700 border border-slate-600'
                      : 'bg-gradient-to-tr from-indigo-500 to-emerald-500 border border-white/20'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-tl-none backdrop-blur-md shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <div
                    className={`mt-2 flex items-center justify-between text-[10px] ${
                      isUser ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.disclaimerIncluded && (
                      <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Disclaimer Attached</span>
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/50 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl text-xs text-slate-300 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="font-medium text-slate-400 ml-1">Analyzing risk characteristics...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Question Chips */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/60 overflow-x-auto flex items-center space-x-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {PRESET_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 hover:text-white hover:bg-slate-700 transition-colors shrink-0 font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Glassmorphism Chat Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about volatility, time horizons, or concentration risk..."
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            aria-label="AI Risk Assistant Question Input"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isTyping}
            className="p-3 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-md shrink-0"
            aria-label="Send message to AI Risk Assistant"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
