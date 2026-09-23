import React from 'react';
import { Award, Star, CheckCircle, Shield } from 'lucide-react';
import { Language } from '../types';
import { content } from '../data/content';

interface SocialProofProps {
  lang: Language;
  darkMode: boolean;
}

export const SocialProof: React.FC<SocialProofProps> = ({ lang, darkMode }) => {
  const t = content[lang].socialProof;
  const isPt = lang === 'pt';

  return (
    <section className={`py-16 border-y ${darkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-neutral-100/60 border-neutral-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title & Editorial Kicker */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-2">
            {isPt ? 'Liderança & Confiança Comprovada' : 'Proven Market Leadership'}
          </div>
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight font-display ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
            {t.title}
          </h2>
        </div>

        {/* 4 Massive Stat Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.stats.map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all duration-200 ${
                darkMode
                  ? 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm'
              }`}
            >
              <div className="flex items-baseline justify-between mb-3">
                <span className={`text-3xl sm:text-4xl font-extrabold font-mono tabular-nums ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                  {item.metric}
                </span>
                <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">
                  {item.highlight}
                </span>
              </div>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Recognition & Regulatory Ribbon */}
        <div className={`mt-10 pt-8 border-t flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs ${
          darkMode ? 'border-neutral-800/80 text-neutral-400' : 'border-slate-200 text-slate-600'
        }`}>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span className={`font-semibold ${darkMode ? 'text-neutral-200' : 'text-slate-800'}`}>
              {isPt ? 'Melhor Banco Digital do Mundo 2025' : 'World Best Digital Bank 2025'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 shrink-0 fill-amber-400" />
            <span className={`font-semibold ${darkMode ? 'text-neutral-200' : 'text-slate-800'}`}>
              {isPt ? 'Melhor App Móvel de Banca de Consumo 2025' : 'Best Consumer Banking App 2025'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className={`font-semibold ${darkMode ? 'text-neutral-200' : 'text-slate-800'}`}>
              {isPt ? 'Supervisão Banco Central Europeu' : 'ECB Supervised Institution'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
            <span className={`font-semibold ${darkMode ? 'text-neutral-200' : 'text-slate-800'}`}>
              {isPt ? 'Garantia de Depósitos até 100.000 €' : 'Deposit Protection up to €100,000'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
