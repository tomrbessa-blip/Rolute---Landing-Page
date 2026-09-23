import React from 'react';
import { ArrowRight, QrCode, Smartphone, Star, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { content } from '../data/content';

interface FinalCTAProps {
  lang: Language;
  darkMode: boolean;
  onOpenDownload: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ lang, darkMode, onOpenDownload }) => {
  const t = content[lang].finalCta;
  const isPt = lang === 'pt';

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-gradient-to-r from-blue-500/20 via-sky-400/20 to-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Vibrant Gradient CTA Container - Electric Revolut Blue */}
        <div className="rounded-[40px] p-8 sm:p-16 text-center relative overflow-hidden shadow-2xl bg-gradient-to-br from-[#1b6cdb] via-[#2585eb] to-[#1557bf] text-white">
          {/* Subtle light rings */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sky-300/15 rounded-full blur-2xl pointer-events-none" />

          {/* Global User Metric Ribbon */}
          <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-100 tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{isPt ? 'Escala Global e Confiança' : 'Global Scale & Trust'}</span>
          </div>

          {/* Headline: "Junte-se a Mais de 80 milhões de pessoas que já utilizam a Revolut." */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display mb-6 text-white text-balance leading-tight drop-shadow-sm">
            {t.headline}
          </h2>

          <p className="text-base sm:text-lg text-sky-50 max-w-2xl mx-auto mb-10 text-balance leading-relaxed">
            {t.subheadline}
          </p>

          {/* CTA Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={onOpenDownload}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-white/95 text-neutral-950 font-bold text-sm sm:text-base rounded-full transition-all shadow-xl flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>{t.buttonText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onOpenDownload}
              className="w-full sm:w-auto px-6 py-4 bg-black/20 hover:bg-black/30 text-white font-bold text-sm rounded-full border border-white/30 backdrop-blur-sm transition-colors flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4 text-sky-200" />
              <span>{isPt ? 'Digitalizar QR' : 'Scan QR Code'}</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 pt-8 border-t border-white/20 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-sky-100 font-medium">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>4.7★ App Store & Google Play</span>
            </div>
            <div className="hidden sm:block text-white/40">·</div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{isPt ? 'Garantia de Depósitos até 100.000 €' : 'Deposit Protection to €100k'}</span>
            </div>
            <div className="hidden sm:block text-white/40">·</div>
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-sky-200" />
              <span>{isPt ? 'Registo Grátis em 3 Minutos' : 'Free 3-Minute Signup'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
