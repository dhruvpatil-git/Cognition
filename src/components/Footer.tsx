import React from 'react';
import { Shield, Sparkles, AlertOctagon, Scale } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Brand & Mission Statement */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md ring-1 ring-white/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight">
                Investor Risk Explainer Studio
              </span>
              <p className="text-xs text-slate-400 font-medium">
                Educational Portfolio Risk & Horizon Visualization Platform
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              Empirical MPT Mathematics
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              100% Non-Advisory Compliance
            </span>
          </div>
        </div>

        {/* Mandatory Educational Disclaimer Box */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400">
            <AlertOctagon className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Required Educational Disclaimer
            </h4>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed space-y-2 font-medium">
            <p>
              This application is intended solely for educational purposes.
              It explains historical characteristics of investment risk and diversification.
            </p>
            <p>
              It does not provide financial, tax, legal, or investment advice.
              Investment values fluctuate and losses are possible.
            </p>
            <p>
              Past performance is not indicative of future results.
              Consult a certified financial advisor before making financial decisions.
            </p>
          </div>
        </div>

        {/* Copyright & Meta */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-4 gap-4">
          <p>© {new Date().getFullYear()} Investor Risk Explainer Studio. Built with React, TypeScript & Tailwind CSS.</p>
          <div className="flex items-center space-x-4">
            <a href="#hero" className="hover:text-slate-300 transition-colors">Back to Top</a>
            <span>•</span>
            <a href="#rebalancer" className="hover:text-slate-300 transition-colors">Risk Simulator</a>
            <span>•</span>
            <a href="#insights" className="hover:text-slate-300 transition-colors">Educational Modules</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
