import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Send,
  ShieldCheck,
  Clock,
  Activity,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import type { Allocation, ChatMessage, PortfolioAnalytics } from '../types/risk';
import { askGeminiRiskAssistant } from '../services/geminiService';
import { DashboardAnalyticsBar } from './DashboardAnalyticsBar';
import { PortfolioRiskPanel } from './PortfolioRiskPanel';

interface ChatWorkspaceProps {
  allocation: Allocation;
  analytics: PortfolioAnalytics;
  onToggleSidebar: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    text: "I'm saving for a house in two years, but most of my investments are technology stocks.",
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

const PRESET_QUERIES = [
  { label: 'Should I buy Tesla?', icon: TrendingUp },
  { label: 'Explain concentration risk in simple terms', icon: HelpCircle },
  { label: 'What is sequence of returns risk?', icon: Clock },
  { label: 'How does time horizon reduce drawdown probability?', icon: Activity },
];

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  allocation,
  analytics,
  onToggleSidebar,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
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

    const history = messages
      .filter((m) => m.id !== 'msg-1')
      .map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        parts: [m.text],
      }));

    const result = await askGeminiRiskAssistant(messageText, allocation, analytics, history);

    const assistantMsg: ChatMessage = {
      id: `assistant-${Date.now()}`,
      sender: 'assistant',
      text: result.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      disclaimerIncluded: true,
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-6">
      {/* 1. Dashboard Analytics Bar (4 equal dark widgets) */}
      <DashboardAnalyticsBar analytics={analytics} />

      {/* 2. Main Chat & Portfolio Risk Model Split Grid (12 Columns) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Bold Portfolio Risk Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <PortfolioRiskPanel
            allocation={allocation}
            analytics={analytics}
            onToggleSidebar={onToggleSidebar}
          />
        </div>

        {/* Right Column: Centered Modern AI Assistant Workspace (8 cols) */}
        <div className="lg:col-span-8 flex flex-col min-h-0 bg-[#131B2E] border border-white/10 rounded-lg overflow-hidden">
          {/* Chat Feed */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-white font-mono ${
                      isUser
                        ? 'bg-[#3B82F6] text-white font-bold'
                        : 'bg-[#182235] border border-white/10 text-[#00D084]'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Assistant Card: Dark #182235, Left Accent Strip #00D084, Sharp Corners */}
                  {/* User Card: Solid Blue/Emerald, High Contrast, Sharp Corners */}
                  <div
                    className={`max-w-[80%] rounded-lg p-4 text-sm sm:text-base leading-relaxed ${
                      isUser
                        ? 'bg-[#3B82F6] text-white font-medium shadow-sm'
                        : 'bg-[#182235] text-slate-200 border border-white/10 border-l-4 border-l-[#00D084]'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <div
                      className={`mt-2 flex items-center justify-between text-[11px] font-mono ${
                        isUser ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.disclaimerIncluded && (
                        <span className="flex items-center space-x-1 text-[#00D084] font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Non-Advisory Guardrail</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-md bg-[#182235] border border-white/10 flex items-center justify-center text-[#00D084]">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-[#182235] border border-white/10 border-l-4 border-l-[#00D084] p-3.5 rounded-lg text-xs text-slate-300 flex items-center space-x-2 font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#00D084] animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-[#00D084] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#00D084] animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-slate-400 ml-1">Evaluating risk characteristics...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Outline Compact Prompt Suggestion Buttons */}
          <div className="px-4 py-2.5 bg-[#0B1020] border-t border-white/10 overflow-x-auto flex items-center space-x-2 shrink-0">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Quick Prompts:
            </span>
            {PRESET_QUERIES.map((q) => {
              const Icon = q.icon;
              return (
                <button
                  key={q.label}
                  onClick={() => handleSendMessage(q.label)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#131B2E] border border-white/10 text-xs text-slate-300 hover:text-white hover:border-[#00D084]/60 transition-all shrink-0 font-mono"
                >
                  <Icon className="w-3.5 h-3.5 text-[#00D084]" />
                  <span>{q.label}</span>
                </button>
              );
            })}
          </div>

          {/* Linear / ChatGPT Style Dark Input Area */}
          <div className="p-4 bg-[#0B1020] border-t border-white/10 flex items-center space-x-3 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about portfolio risk, horizon matching, or asset volatility..."
              className="flex-1 bg-[#131B2E] border border-white/10 rounded-md px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00D084] font-mono"
              aria-label="AI Risk Assistant Question Input"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isTyping}
              className="w-11 h-11 rounded-md bg-[#00D084] text-slate-950 hover:bg-[#00D084]/90 disabled:opacity-40 transition-all font-bold flex items-center justify-center shrink-0"
              aria-label="Send message to AI Risk Assistant"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
