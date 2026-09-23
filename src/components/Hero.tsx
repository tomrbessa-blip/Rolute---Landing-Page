import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Star,
  QrCode,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Lock,
  Unlock,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';
import { content } from '../data/content';

interface HeroProps {
  lang: Language;
  darkMode: boolean;
  onOpenDownload: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, darkMode, onOpenDownload }) => {
  const t = content[lang].hero;
  const isPt = lang === 'pt';

  // Interactive phone state
  const [activeCurrency, setActiveCurrency] = useState<'EUR' | 'USD' | 'GBP'>('EUR');
  const [activeTab, setActiveTab] = useState<'wallet' | 'invest' | 'vaults'>('wallet');
  const [cardLocked, setCardLocked] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);

  const balances = {
    EUR: { amount: '6.480,25 €', change: '+320 € este mês', pts: '4.850' },
    USD: { amount: '$7,080.50', change: '+$350 this month', pts: '4.850' },
    GBP: { amount: '£5,540.10', change: '+£280 this month', pts: '4.850' },
  };

  return (
    <section className="relative min-h-[90vh] lg:min-h-[94vh] flex items-center pt-28 pb-16 overflow-hidden bg-neutral-950 text-neutral-100">
      {/* Sleek Dark Ambient Glow & Radial Light Beams */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[550px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/15 to-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-12 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle fine tech grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[75vh]">
          {/* Left Column: Typography & Conversion Action */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Regulatory Trust Badge / Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs font-semibold text-blue-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isPt ? 'Supervisão Europeia · Depósitos Garantidos' : 'ECB Supervised · Insured Deposits'}</span>
            </div>

            {/* Headline: Under 10 words as specified in PRD */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white font-display text-balance leading-[1.06]">
              {t.headline}
            </h1>

            {/* Subheadline: Under 25 words as specified in PRD */}
            <p className="text-lg sm:text-xl font-normal text-neutral-300 max-w-xl text-balance leading-relaxed">
              {t.subheadline}
            </p>

            {/* Primary Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onOpenDownload}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-base font-bold rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group active:scale-95"
              >
                <span>{t.primaryCta}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#planos"
                className="px-6 py-4 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 text-sm font-semibold rounded-2xl border border-neutral-800 transition-all flex items-center justify-center gap-1.5"
              >
                <span>{t.secondaryCta}</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </a>
            </div>

            {/* Trust Markers without pills */}
            <div className="pt-6 border-t border-neutral-800/80 flex flex-wrap items-center gap-6 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-neutral-300">{t.guarantee}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-neutral-300">4.7 / 5 na Trustpilot (+200k)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-neutral-300">{isPt ? '+2M em Portugal' : '+2M in Portugal'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Smartphone Device Mockup */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            {/* Glow halo behind mockup */}
            <div className="absolute w-[360px] h-[520px] bg-gradient-to-tr from-blue-600/30 to-purple-600/20 rounded-[50px] blur-3xl pointer-events-none" />

            {/* Physical Phone Frame */}
            <div className="relative w-full max-w-[360px] sm:max-w-[380px] bg-neutral-900 rounded-[48px] p-3 shadow-2xl border border-neutral-700/80 ring-1 ring-neutral-800">
              {/* Phone Inner Display */}
              <div className="w-full bg-neutral-950 rounded-[40px] overflow-hidden p-5 flex flex-col justify-between border border-neutral-800/80 text-white min-h-[560px]">
                {/* Dynamic Island / Speaker */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono font-medium text-neutral-400">09:41</span>
                  <div className="w-24 h-5 bg-neutral-900 rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 mr-2" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80" />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                    <span>5G</span>
                    <span className="w-4 h-2 rounded-xs border border-neutral-400 relative inline-block">
                      <span className="w-2.5 h-1.5 bg-emerald-400 block" />
                    </span>
                  </div>
                </div>

                {/* Account Header & Balance */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold shadow-sm">
                        TB
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Tomás Bessa</div>
                        <div className="text-[10px] text-emerald-400 font-mono">IBAN PT50 •••• 8910</div>
                      </div>
                    </div>

                    {/* Currency Switcher Buttons */}
                    <div className="flex bg-neutral-900 p-0.5 rounded-xl border border-neutral-800 text-[10px] font-mono">
                      {(['EUR', 'USD', 'GBP'] as const).map((curr) => (
                        <button
                          key={curr}
                          onClick={() => setActiveCurrency(curr)}
                          className={`px-2 py-1 rounded-lg font-bold transition-all ${
                            activeCurrency === curr
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          {curr}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Main Balance Display with Hide toggle */}
                  <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 relative">
                    <div className="flex justify-between items-center text-xs text-neutral-400 mb-1">
                      <span className="font-medium">{isPt ? 'Saldo Total' : 'Total Balance'}</span>
                      <button
                        onClick={() => setHideBalance(!hideBalance)}
                        className="text-neutral-400 hover:text-neutral-200 transition-colors"
                        title={hideBalance ? 'Mostrar saldo' : 'Ocultar saldo'}
                      >
                        {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="text-3xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                      {hideBalance ? '••••••••' : balances[activeCurrency].amount}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800 text-[11px]">
                      <span className="text-emerald-400 font-medium">
                        {balances[activeCurrency].change}
                      </span>
                      <span className="text-blue-400 font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {balances[activeCurrency].pts} RevPoints
                      </span>
                    </div>
                  </div>

                  {/* Interactive App Tabs */}
                  <div className="grid grid-cols-3 gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs text-center font-medium">
                    <button
                      onClick={() => setActiveTab('wallet')}
                      className={`py-1.5 rounded-lg transition-all ${
                        activeTab === 'wallet' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400'
                      }`}
                    >
                      {isPt ? 'Conta' : 'Account'}
                    </button>
                    <button
                      onClick={() => setActiveTab('invest')}
                      className={`py-1.5 rounded-lg transition-all ${
                        activeTab === 'invest' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400'
                      }`}
                    >
                      {isPt ? 'Investir' : 'Invest'}
                    </button>
                    <button
                      onClick={() => setActiveTab('vaults')}
                      className={`py-1.5 rounded-lg transition-all ${
                        activeTab === 'vaults' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400'
                      }`}
                    >
                      {isPt ? 'Cofres' : 'Vaults'}
                    </button>
                  </div>
                </div>

                {/* Tab Dynamic Content */}
                <div className="my-3 flex-1 flex flex-col justify-center">
                  {activeTab === 'wallet' && (
                    <div className="space-y-2.5">
                      {/* Physical/Virtual Card Preview */}
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 border border-neutral-800 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-6 rounded-md border flex items-center justify-center font-mono text-[9px] font-bold ${
                            cardLocked
                              ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                              : 'bg-neutral-800 border-neutral-700 text-white'
                          }`}>
                            •••• 4532
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white">Rolute Metal</div>
                            <div className="text-[10px] text-neutral-400">
                              {cardLocked ? isPt ? 'Bloqueado' : 'Frozen' : isPt ? 'Ativo · Apple Pay' : 'Active · Apple Pay'}
                            </div>
                          </div>
                        </div>

                        {/* Interactive Lock/Unlock Button */}
                        <button
                          onClick={() => setCardLocked(!cardLocked)}
                          className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                            cardLocked
                              ? 'bg-rose-600 text-white'
                              : 'bg-neutral-800 text-neutral-300 hover:text-white'
                          }`}
                          title={cardLocked ? 'Desbloquear cartão' : 'Bloquear cartão'}
                        >
                          {cardLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Recent Live Feed Items */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold px-1">
                          {isPt ? 'Atividade Recente' : 'Recent Activity'}
                        </div>

                        <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                              ↓
                            </div>
                            <div>
                              <div className="font-semibold text-white">{isPt ? 'Salário Mensal' : 'Salary Deposit'}</div>
                              <div className="text-[10px] text-neutral-500">Hoje, 11:28</div>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-emerald-400 tabular-nums">+2.550,00 €</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                              ✈
                            </div>
                            <div>
                              <div className="font-semibold text-white">TAP Air Portugal</div>
                              <div className="text-[10px] text-neutral-500">Ontem · +120 Milhas</div>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-neutral-300 tabular-nums">-148,20 €</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'invest' && (
                    <div className="space-y-2 p-2 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs">
                      <div className="flex justify-between items-center text-neutral-400">
                        <span>{isPt ? 'Carteira de Ações & ETFs' : 'Stocks & ETFs'}</span>
                        <span className="text-emerald-400 font-mono font-semibold">+18.4% APY</span>
                      </div>
                      <div className="text-xl font-bold font-mono text-white">12.840,50 €</div>
                      <div className="p-2 rounded-xl bg-neutral-950 text-[11px] text-neutral-300 flex justify-between items-center">
                        <span>S&P 500 ETF (Vanguard)</span>
                        <span className="text-emerald-400 font-mono">+1,2% hoje</span>
                      </div>
                      <div className="p-2 rounded-xl bg-neutral-950 text-[11px] text-neutral-300 flex justify-between items-center">
                        <span>Robo-Advisor Portfolio</span>
                        <span className="text-emerald-400 font-mono">+8.4% total</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'vaults' && (
                    <div className="space-y-2 p-2 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs">
                      <div className="flex justify-between items-center text-neutral-400">
                        <span>{isPt ? 'Cofre Poupança Flexível' : 'Flexible Vault'}</span>
                        <span className="text-emerald-400 font-mono font-semibold">3.85% juros diários</span>
                      </div>
                      <div className="text-xl font-bold font-mono text-white">8.500,00 €</div>
                      <div className="text-[11px] text-neutral-400">
                        {isPt ? 'Juros pagos diariamente às 00:00. Levantamentos instantâneos gratuitos.' : 'Interest paid daily at midnight. Instant free withdrawals.'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom App Quick Action Bar */}
                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                  <button
                    onClick={onOpenDownload}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-md text-center"
                  >
                    {isPt ? 'Abrir Conta Grátis' : 'Open Free Account'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
