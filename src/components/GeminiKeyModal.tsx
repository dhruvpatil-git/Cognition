import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, X, Check, Sparkles, ExternalLink } from 'lucide-react';
import { getGeminiApiKey, saveGeminiApiKey } from '../services/geminiService';

interface GeminiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
}

export const GeminiKeyModal: React.FC<GeminiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySaved,
}) => {
  const [apiKey, setApiKey] = useState(getGeminiApiKey());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveGeminiApiKey(apiKey);
    setSavedSuccess(true);
    onKeySaved();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

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
          className="relative bg-[#0B1020] rounded-lg border border-white/10 shadow-2xl max-w-md w-full p-6 space-y-5 z-10 text-white font-mono"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30 flex items-center justify-center">
                <Key className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                Connect Google Gemini API
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded bg-[#131B2E] border border-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <p>
              Connect your Gemini API Key to enable real AI responses trained on <span className="font-semibold text-white">systemPrompt.ts</span> guardrails.
            </p>

            <div className="p-3 rounded bg-[#131B2E] border border-white/10 space-y-1.5 text-slate-300">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Two ways to provide your key:
              </span>
              <ol className="list-decimal list-inside space-y-1">
                <li>Paste it in the box below (saved locally in browser).</li>
                <li>Or add <code className="bg-[#182235] px-1 py-0.5 rounded text-[11px] text-[#00D084]">VITE_GEMINI_API_KEY=key</code> in your <code className="bg-[#182235] px-1 py-0.5 rounded text-[11px]">.env</code> file.</li>
              </ol>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Gemini API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#131B2E] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00D084] font-mono"
              />
            </div>

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-[#3B82F6] hover:underline text-[11px] font-semibold"
            >
              <span>Get a free key from Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded text-slate-400 text-xs font-semibold hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded bg-[#00D084] text-slate-950 text-xs font-bold hover:bg-[#00D084]/90 transition-all shadow-sm"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Key Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save API Key</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
