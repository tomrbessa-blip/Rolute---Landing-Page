import React from 'react';
import { Globe, TrendingUp, Wallet, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { content } from '../data/content';

interface PersonasProps {
  lang: Language;
  darkMode: boolean;
  onOpenDownload: () => void;
}

export const Personas: React.FC<PersonasProps> = ({ lang, darkMode, onOpenDownload }) => {
  const t = content[lang].personas;
  const isPt = lang === 'pt';

  const getIcon = (name: string) => {
    switch (name) {
      case 'Globe':
        return <Globe className="w-6 h-6 text-blue-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-emerald-400" />;
      case 'Wallet':
      default:
        return <Wallet className="w-6 h-6 text-purple-400" />;
    }
  };

  return (
    <section id="publico" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">
            {isPt ? 'Perfis de Utilizador' : 'Target Personas'}
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-display mb-4 text-balance ${
              darkMode ? 'text-white' : 'text-neutral-900'
            }`}
          >
            {t.title}
          </h2>
          <p
            className={`text-base sm:text-lg text-balance leading-relaxed ${
              darkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            {t.subtitle}
          </p>
        </div>

        {/* 3 Personas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {t.items.map((persona, idx) => (
            <div
              key={persona.id}
              className={`rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 relative group hover:-translate-y-1 ${
                darkMode
                  ? 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm'
              }`}
            >
              <div>
                {/* Persona Header & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-center shadow-md">
                    {getIcon(persona.icon)}
                  </div>
                  <span className="text-xs font-mono text-neutral-500">
                    0{idx + 1}
                  </span>
                </div>

                {/* Subtitle / Role */}
                <div className="text-xs font-semibold text-blue-500 tracking-wider uppercase mb-1">
                  {persona.badge}
                </div>
                <h3
                  className={`text-xl font-bold tracking-tight mb-4 ${
                    darkMode ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {persona.role}
                </h3>

                {/* Real quote */}
                <blockquote
                  className={`text-xs italic mb-6 pl-3 border-l-2 ${
                    darkMode ? 'border-neutral-700 text-neutral-400' : 'border-neutral-300 text-neutral-600'
                  }`}
                >
                  {persona.quote}
                </blockquote>

                {/* Frustration & Desired Outcome Blocks */}
                <div className="space-y-4 pt-2">
                  <div className={`p-4 rounded-2xl border text-xs ${
                    darkMode ? 'bg-rose-950/20 border-rose-900/40 text-neutral-300' : 'bg-rose-50/80 border-rose-200 text-neutral-700'
                  }`}>
                    <div className="flex items-center gap-1.5 font-semibold text-rose-400 mb-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{isPt ? 'Frustração Principal' : 'Key Frustration'}</span>
                    </div>
                    <p className="leading-relaxed">{persona.frustration}</p>
                  </div>

                  <div className={`p-4 rounded-2xl border text-xs ${
                    darkMode ? 'bg-emerald-950/20 border-emerald-900/40 text-neutral-300' : 'bg-emerald-50/80 border-emerald-200 text-neutral-700'
                  }`}>
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-1">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>{isPt ? 'Resultado Desejado com Revolut' : 'Desired Outcome with Revolut'}</span>
                    </div>
                    <p className="leading-relaxed">{persona.desiredOutcome}</p>
                  </div>
                </div>
              </div>

              {/* Bottom metric & Action */}
              <div className="mt-8 pt-6 border-t border-neutral-800/60 flex items-center justify-between text-xs">
                <span className="font-mono text-neutral-400 font-medium">
                  {persona.stats}
                </span>
                <button
                  onClick={onOpenDownload}
                  className="inline-flex items-center gap-1 font-semibold text-blue-500 hover:text-blue-400 transition-colors"
                >
                  <span>{isPt ? 'Começar' : 'Get started'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
