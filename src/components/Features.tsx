import React, { useState } from 'react';
import {
  CreditCard,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Smartphone,
  Coins,
  RefreshCw,
  Lock,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types';
import { content } from '../data/content';

interface FeaturesProps {
  lang: Language;
  darkMode: boolean;
  onOpenDownload: () => void;
}

export const Features: React.FC<FeaturesProps> = ({ lang, darkMode, onOpenDownload }) => {
  const t = content[lang].features;
  const isPt = lang === 'pt';

  // Interactive state for virtual card demo
  const [virtualCardNumber, setVirtualCardNumber] = useState('4532 •••• •••• 9841');
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Interactive state for salary auto-split preview
  const [salaryAmount, setSalaryAmount] = useState(2500);

  // Interactive state for robo-advisor portfolio risk
  const [portfolioRisk, setPortfolioRisk] = useState<'conservador' | 'equilibrado' | 'crescimento'>('equilibrado');

  const regenerateCard = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const rand = Math.floor(1000 + Math.random() * 9000);
      setVirtualCardNumber(`4532 •••• •••• ${rand}`);
      setIsRegenerating(false);
    }, 400);
  };

  return (
    <section id="solucoes" className={`py-20 md:py-28 transition-colors ${darkMode ? 'bg-neutral-950' : 'bg-slate-50/50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
            {t.kicker}
          </div>
          <h2
            className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-4 text-balance ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {t.title}
          </h2>
          <p
            className={`text-base sm:text-lg text-balance leading-relaxed ${
              darkMode ? 'text-neutral-400' : 'text-slate-600'
            }`}
          >
            {t.subtitle}
          </p>
        </div>

        {/* Feature 1: Bento Marquee - O melhor para o seu salário (Habit Building) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-center">
          <div
            className={`lg:col-span-6 p-8 sm:p-10 rounded-3xl border flex flex-col justify-between transition-all ${
              darkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
            }`}
          >
            <div>
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">
                {t.salary.tag}
              </div>
              <h3
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                {t.salary.title}
              </h3>
              <p
                className={`text-base leading-relaxed mb-6 ${
                  darkMode ? 'text-neutral-300' : 'text-slate-600'
                }`}
              >
                {t.salary.body}
              </p>

              <div
                className={`p-4 rounded-2xl border text-xs mb-6 ${
                  darkMode
                    ? 'bg-neutral-950/80 border-neutral-800 text-neutral-300'
                    : 'bg-emerald-50/70 border-emerald-200 text-slate-800'
                }`}
              >
                <div className="font-semibold text-emerald-600 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isPt ? 'Resultado Prático' : 'Key Outcome'}</span>
                </div>
                <p className="leading-relaxed">{t.salary.benefit}</p>
              </div>
            </div>

            <button
              onClick={onOpenDownload}
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition-colors group"
            >
              <span>{t.salary.cta}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Interactive Salary Splitter Card */}
          <div
            className={`lg:col-span-6 p-8 rounded-3xl border transition-all ${
              darkMode ? 'bg-neutral-950/80 border-neutral-800' : 'bg-white border-slate-200 shadow-md'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
                {isPt ? 'Simulador de Domiciliação Automática' : 'Direct Deposit Auto-Split'}
              </span>
              <span className="text-xs font-mono text-emerald-600 font-bold">IBAN PT50 •••• 8910</span>
            </div>

            {/* Slider */}
            <div className="mb-6">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className={darkMode ? 'text-neutral-300' : 'text-slate-700'}>
                  {isPt ? 'Salário Líquido Mensal:' : 'Monthly Net Salary:'}
                </span>
                <span className={`font-mono text-lg font-bold tabular-nums ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {salaryAmount.toLocaleString()} €
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="6000"
                step="100"
                value={salaryAmount}
                onChange={(e) => setSalaryAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Simulated 3-way Automatic Split */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className={`p-3.5 rounded-2xl border ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`text-[11px] mb-1 ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>{isPt ? 'Despesas (50%)' : 'Expenses (50%)'}</div>
                <div className={`text-sm font-bold font-mono tabular-nums ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {(salaryAmount * 0.5).toFixed(0)} €
                </div>
                <div className={`text-[10px] mt-1 ${darkMode ? 'text-neutral-500' : 'text-slate-400'}`}>{isPt ? 'Conta Corrente' : 'Checking'}</div>
              </div>

              <div className={`p-3.5 rounded-2xl border ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-emerald-50/60 border-emerald-200'}`}>
                <div className="text-[11px] text-emerald-600 font-semibold mb-1">{isPt ? 'Cofre (30%)' : 'Vault (30%)'}</div>
                <div className="text-sm font-bold font-mono text-emerald-600 tabular-nums">
                  {(salaryAmount * 0.3).toFixed(0)} €
                </div>
                <div className="text-[10px] text-emerald-600/80 mt-1">{isPt ? '3,85% APY diário' : '3.85% APY daily'}</div>
              </div>

              <div className={`p-3.5 rounded-2xl border ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-purple-50/60 border-purple-200'}`}>
                <div className="text-[11px] text-purple-600 font-semibold mb-1">{isPt ? 'Invest (20%)' : 'Invest (20%)'}</div>
                <div className="text-sm font-bold font-mono text-purple-600 tabular-nums">
                  {(salaryAmount * 0.2).toFixed(0)} €
                </div>
                <div className="text-[10px] text-purple-600/80 mt-1">{isPt ? 'Robo-Advisor' : 'Robo-Advisor'}</div>
              </div>
            </div>

            <div className={`mt-4 pt-3 border-t text-xs flex items-center justify-between ${darkMode ? 'border-neutral-800 text-neutral-400' : 'border-slate-100 text-slate-500'}`}>
              <span>{isPt ? 'Tempo de ativação:' : 'Setup time:'} <strong>&lt; 60 seg</strong></span>
              <span className="text-emerald-600 font-semibold">✓ {isPt ? 'Sem comissões de manutenção' : 'Zero maintenance fees'}</span>
            </div>
          </div>
        </div>

        {/* Feature 2: Eleve os seus gastos (Rewards & Virtual Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-center">
          {/* Interactive Virtual Card Demo */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className={`relative p-6 sm:p-8 rounded-3xl border shadow-md transition-all ${
              darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                  <CreditCard className="w-4 h-4" />
                  <span>{isPt ? 'Cartão Virtual Descartável' : 'Disposable Virtual Card'}</span>
                </div>
                <button
                  onClick={regenerateCard}
                  disabled={isRegenerating}
                  className={`px-3 py-1.5 text-xs rounded-xl border flex items-center gap-1.5 transition-colors font-medium ${
                    darkMode
                      ? 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                  <span>{isPt ? 'Regenerar dados' : 'Regenerate details'}</span>
                </button>
              </div>

              {/* Graphic Virtual Card Representation */}
              <div className="w-full aspect-[1.586/1] rounded-2xl p-6 bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-900 border border-slate-700 shadow-xl relative flex flex-col justify-between overflow-hidden text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xl font-black tracking-tight text-white font-display">Revolut</span>
                    <div className="text-[10px] text-blue-300 font-mono tracking-widest uppercase">Disposable Virtual</div>
                  </div>
                  <div className="w-10 h-7 rounded bg-amber-400/20 border border-amber-400/50 flex items-center justify-center">
                    <div className="w-7 h-5 grid grid-cols-2 gap-0.5 opacity-60">
                      <div className="bg-amber-400/60 rounded-xs" />
                      <div className="bg-amber-400/60 rounded-xs" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xl sm:text-2xl font-mono tracking-widest text-white font-bold tabular-nums">
                    {virtualCardNumber}
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-300 font-mono">
                    <span>EXP: 09/29</span>
                    <span>CVV: 894</span>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <span className="text-xs font-semibold text-slate-200 tracking-wider">TOMÁS BESSA</span>
                  <div className="flex items-center -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-rose-500/90" />
                    <div className="w-6 h-6 rounded-full bg-amber-500/90" />
                  </div>
                </div>
              </div>

              {/* Wallet Integration */}
              <div className={`mt-4 pt-3 flex items-center justify-between text-xs border-t ${
                darkMode ? 'border-neutral-800 text-neutral-400' : 'border-slate-100 text-slate-500'
              }`}>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                  <span>{isPt ? 'Compatível com Apple & Google Wallet' : 'Apple & Google Wallet Ready'}</span>
                </div>
                <span className="text-emerald-600 font-semibold">● {isPt ? 'Pronto a pagar' : 'Instant ready'}</span>
              </div>
            </div>
          </div>

          <div
            className={`lg:col-span-6 p-8 sm:p-10 rounded-3xl border flex flex-col justify-between order-1 lg:order-2 transition-all ${
              darkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
            }`}
          >
            <div>
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                {t.rewards.tag}
              </div>
              <h3
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                {t.rewards.title}
              </h3>
              <p
                className={`text-base leading-relaxed mb-4 ${
                  darkMode ? 'text-neutral-300' : 'text-slate-600'
                }`}
              >
                {t.rewards.body}
              </p>
              <p
                className={`text-sm font-semibold mb-6 ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}
              >
                {t.rewards.virtualHighlight}
              </p>

              <div
                className={`p-4 rounded-2xl border text-xs mb-6 ${
                  darkMode
                    ? 'bg-neutral-950/80 border-neutral-800 text-neutral-300'
                    : 'bg-blue-50/70 border-blue-200 text-slate-800'
                }`}
              >
                <div className="font-semibold text-blue-600 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isPt ? 'Recompensas RevPoints' : 'RevPoints Rewards'}</span>
                </div>
                <p className="leading-relaxed">{t.rewards.benefit}</p>
              </div>
            </div>

            <button
              onClick={onOpenDownload}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors group"
            >
              <span>{t.rewards.cta}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Feature 3 & 4 Grid: Wealth Generation & Crypto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Feature 3: Investing & Robo-Advisor */}
          <div
            className={`p-8 sm:p-10 rounded-3xl border flex flex-col justify-between transition-all ${
              darkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
            }`}
          >
            <div>
              <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-2">
                {t.investing.tag}
              </div>
              <h3
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                {t.investing.title}
              </h3>
              <p
                className={`text-base leading-relaxed mb-4 ${
                  darkMode ? 'text-neutral-300' : 'text-slate-600'
                }`}
              >
                {t.investing.body}
              </p>
              <p
                className={`text-sm font-semibold mb-6 ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}
              >
                {t.investing.roboHighlight}
              </p>

              {/* Robo-Advisor risk selector simulator */}
              <div className={`p-4 rounded-2xl border mb-6 ${
                darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-xs font-semibold mb-3 ${darkMode ? 'text-neutral-300' : 'text-slate-700'}`}>
                  {isPt ? 'Perfil Robo-Advisor Automatizado:' : 'Automated Robo-Advisor Profile:'}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['conservador', 'equilibrado', 'crescimento'] as const).map((risk) => (
                    <button
                      key={risk}
                      onClick={() => setPortfolioRisk(risk)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                        portfolioRisk === risk
                          ? 'bg-purple-600 text-white shadow-md'
                          : darkMode
                          ? 'bg-neutral-900 text-neutral-400 hover:text-white'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs'
                      }`}
                    >
                      {risk}
                    </button>
                  ))}
                </div>
                <div className={`mt-3 text-[11px] flex justify-between items-center pt-2 border-t ${
                  darkMode ? 'border-neutral-800 text-neutral-400' : 'border-slate-200 text-slate-600'
                }`}>
                  <span>{isPt ? 'Projeção de Retorno Anual:' : 'Projected Annual Return:'}</span>
                  <span className="font-mono text-emerald-600 font-bold">
                    {portfolioRisk === 'conservador' && '5.2% - 7.0%'}
                    {portfolioRisk === 'equilibrado' && '8.4% - 11.5%'}
                    {portfolioRisk === 'crescimento' && '12.0% - 16.8%'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenDownload}
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-500 transition-colors group"
            >
              <span>{t.investing.cta}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Feature 4: Crypto */}
          <div
            className={`p-8 sm:p-10 rounded-3xl border flex flex-col justify-between transition-all ${
              darkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
            }`}
          >
            <div>
              <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
                {t.crypto.tag}
              </div>
              <h3
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                {t.crypto.title}
              </h3>
              <p
                className={`text-base leading-relaxed mb-6 ${
                  darkMode ? 'text-neutral-300' : 'text-slate-600'
                }`}
              >
                {t.crypto.body}
              </p>

              {/* Crypto Price Tickers */}
              <div className={`p-4 rounded-2xl border mb-6 space-y-3 ${
                darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
                      ₿
                    </div>
                    <div>
                      <div className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Bitcoin</div>
                      <div className={`text-[10px] font-mono ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>BTC</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>92.450,00 €</div>
                    <div className="text-[10px] text-emerald-600 font-mono font-semibold">+4,2% (24h)</div>
                  </div>
                </div>

                <div className={`flex items-center justify-between text-xs pt-2.5 border-t ${
                  darkMode ? 'border-neutral-800' : 'border-slate-200'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center font-bold">
                      Ξ
                    </div>
                    <div>
                      <div className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Ethereum</div>
                      <div className={`text-[10px] font-mono ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>ETH</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>3.410,20 €</div>
                    <div className="text-[10px] text-emerald-600 font-mono font-semibold">+2,8% (24h)</div>
                  </div>
                </div>

                <div className={`pt-2.5 border-t text-[11px] flex justify-between items-center ${
                  darkMode ? 'border-neutral-800 text-neutral-400' : 'border-slate-200 text-slate-600'
                }`}>
                  <span>{isPt ? 'Comissões para clientes Ultra/Metal:' : 'Ultra/Metal Commission:'}</span>
                  <span className="font-mono font-bold text-emerald-600">A partir de 0%</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenDownload}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-500 transition-colors group"
            >
              <span>{t.crypto.cta}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Feature 5: Risk Reversal / Security Block - Deep Sapphire / Obsidian Luxury Theme */}
        <div
          id="seguranca"
          className="p-8 sm:p-12 rounded-3xl border relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white border-slate-800 shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
                {t.security.tag}
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
                {t.security.title}
              </h3>
              <p className="text-base text-slate-300 leading-relaxed">
                {t.security.body}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isPt ? 'Garantia até 100.000 €' : 'Protected up to €100,000'}</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    {isPt
                      ? 'Depósitos salvaguardados pelo Fundo Estatal de Garantia de Depósitos da Lituânia.'
                      : 'Deposits insured by the state-run Deposit Guarantee Scheme in Lithuania.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                  <div className="font-bold text-blue-400 flex items-center gap-1.5 mb-1">
                    <Lock className="w-4 h-4" />
                    <span>{isPt ? 'Proteção Proativa 24/7' : '24/7 Proactive Defense'}</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    {isPt
                      ? 'Algoritmos em milissegundos bloqueiam transferências suspeitas antes de ocorrerem.'
                      : 'Millisecond fraud intelligence prevents suspicious transfers before execution.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center items-center text-center p-6 bg-slate-900/80 rounded-2xl border border-slate-700/60 backdrop-blur-md">
              <div className="w-16 h-16 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="text-lg font-bold text-white mb-1">Revolut Secure™</div>
              <div className="text-xs text-slate-400 mb-6 max-w-xs">
                {isPt
                  ? 'A sua fortaleza financeira sem burocracias nem atrasos.'
                  : 'Your financial fortress without paperwork or delays.'}
              </div>
              <button
                onClick={onOpenDownload}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
              >
                {t.security.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
