import React, { useState } from 'react';
import { ArrowRightLeft, TrendingDown, Check, Info } from 'lucide-react';
import { Language } from '../types';
import { content } from '../data/content';

interface InteractiveExchangeProps {
  lang: Language;
  darkMode: boolean;
  onOpenDownload: () => void;
}

export const InteractiveExchange: React.FC<InteractiveExchangeProps> = ({
  lang,
  darkMode,
  onOpenDownload,
}) => {
  const t = content[lang].calculator;
  const isPt = lang === 'pt';

  const [sendAmount, setSendAmount] = useState<number>(1000);
  const [targetCurrency, setTargetCurrency] = useState<'USD' | 'GBP' | 'JPY' | 'BRL'>('USD');

  const exchangeRates = {
    USD: { rate: 1.092, symbol: '$', traditionalFeeRate: 0.042 },
    GBP: { rate: 0.854, symbol: '£', traditionalFeeRate: 0.038 },
    JPY: { rate: 168.45, symbol: '¥', traditionalFeeRate: 0.045 },
    BRL: { rate: 6.12, symbol: 'R$', traditionalFeeRate: 0.048 },
  };

  const curr = exchangeRates[targetCurrency];
  const revolutReceive = (sendAmount * curr.rate).toFixed(2);
  const traditionalFee = (sendAmount * curr.rate * curr.traditionalFeeRate).toFixed(2);
  const traditionalReceive = ((sendAmount * curr.rate) * (1 - curr.traditionalFeeRate)).toFixed(2);
  const totalSavedEur = ((sendAmount * curr.traditionalFeeRate)).toFixed(2);

  return (
    <section className={`py-16 border-y transition-colors ${
      darkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-slate-100/70 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Explanation */}
          <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
              {isPt ? 'Câmbio Transparente' : 'Transparent FX'}
            </div>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-display ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {t.title}
            </h2>
            <p
              className={`text-sm sm:text-base leading-relaxed ${
                darkMode ? 'text-neutral-400' : 'text-slate-600'
              }`}
            >
              {t.subtitle}
            </p>

            <div className={`pt-2 flex flex-col gap-2.5 text-xs ${darkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isPt ? 'Taxa de câmbio interbancária sem margens secretas' : 'Interbank FX rate with zero hidden spread'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isPt ? 'Mais de 30 moedas guardadas simultaneamente' : 'Hold and exchange 30+ currencies simultaneously'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isPt ? 'Transferências gratuitas entre utilizadores Rolute' : 'Free peer-to-peer transfers worldwide'}</span>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Widget */}
          <div className="lg:col-span-7">
            <div
              className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
                darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Send input */}
                <div>
                  <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
                    {t.sendLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      max="50000"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(Math.max(1, Number(e.target.value)))}
                      className={`w-full px-4 py-3 rounded-xl font-mono text-lg font-bold border focus:outline-none focus:border-blue-500 transition-colors ${
                        darkMode
                          ? 'bg-neutral-900 border-neutral-700 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 font-bold text-xs text-slate-500">
                      <span>🇪🇺</span>
                      <span>EUR</span>
                    </div>
                  </div>
                </div>

                {/* Target currency selector */}
                <div>
                  <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
                    {t.receiveLabel}
                  </label>
                  <div className="flex gap-1.5">
                    {(['USD', 'GBP', 'JPY', 'BRL'] as const).map((code) => (
                      <button
                        key={code}
                        onClick={() => setTargetCurrency(code)}
                        className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold font-mono transition-all ${
                          targetCurrency === code
                            ? 'bg-blue-600 text-white shadow-md'
                            : darkMode
                            ? 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comparison Results Card */}
              <div className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
                darkMode ? 'bg-neutral-900/80 border-neutral-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t.revolutCost}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-bold font-mono text-emerald-600 tabular-nums">
                      {curr.symbol} {revolutReceive}
                    </div>
                    <div className={`text-[10px] ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
                      1 EUR = {curr.rate} {targetCurrency} · {isPt ? 'Taxa de câmbio real' : 'Real FX rate'}
                    </div>
                  </div>
                </div>

                <div className={`flex items-center justify-between pt-3 border-t ${
                  darkMode ? 'border-neutral-800' : 'border-slate-200'
                }`}>
                  <div className={`flex items-center gap-2 ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span className="text-xs">{t.traditionalBank}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold font-mono tabular-nums ${darkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
                      {curr.symbol} {traditionalReceive}
                    </div>
                    <div className="text-[10px] text-rose-500">
                      -{curr.symbol} {traditionalFee} ({isPt ? 'comissão oculta' : 'hidden fee'})
                    </div>
                  </div>
                </div>

                {/* Savings summary */}
                <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  darkMode
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  <span className="font-semibold flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    {t.savingsText}
                  </span>
                  <span className="font-mono font-extrabold text-emerald-600 text-sm tabular-nums">
                    ≈ {totalSavedEur} € {isPt ? 'poupados' : 'saved'}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={onOpenDownload}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                >
                  {isPt ? 'Começar a poupar em câmbios' : 'Start saving on FX'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
