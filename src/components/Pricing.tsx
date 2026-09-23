import React, { useState } from 'react';
import { Check, Sparkles, Shield, ArrowRight, CreditCard } from 'lucide-react';
import { Language, Plan } from '../types';
import { content } from '../data/content';

interface PricingProps {
  lang: Language;
  darkMode: boolean;
  onOpenDownload: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ lang, darkMode, onOpenDownload }) => {
  const t = content[lang].pricing;
  const isPt = lang === 'pt';
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('premium');

  const selectedPlan = t.plans.find((p) => p.id === selectedPlanId) || t.plans[2];

  // Helper for card visual render
  const renderCardGraphic = (plan: Plan) => {
    let gradientStyle = 'bg-slate-900 border-slate-700 text-white';
    let textAccent = 'text-white';
    let chipColor = 'bg-slate-600';

    if (plan.id === 'ultra') {
      gradientStyle = 'bg-gradient-to-tr from-slate-200 via-neutral-100 to-slate-300 text-neutral-950 border-white shadow-2xl';
      textAccent = 'text-neutral-950';
      chipColor = 'bg-neutral-400';
    } else if (plan.id === 'metal') {
      gradientStyle = 'bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 border-slate-700 shadow-2xl text-white';
      textAccent = 'text-white';
      chipColor = 'bg-slate-500';
    } else if (plan.id === 'premium') {
      gradientStyle = 'bg-gradient-to-tr from-purple-950 via-slate-900 to-indigo-950 border-purple-500/40 text-white shadow-xl';
      textAccent = 'text-white';
      chipColor = 'bg-purple-300';
    } else if (plan.id === 'plus') {
      gradientStyle = 'bg-gradient-to-tr from-sky-950 via-slate-900 to-blue-950 border-sky-500/40 text-white shadow-lg';
      textAccent = 'text-white';
      chipColor = 'bg-sky-300';
    }

    return (
      <div className={`w-full max-w-sm aspect-[1.586/1] rounded-2xl p-6 border flex flex-col justify-between relative transition-all duration-300 transform hover:scale-[1.02] ${gradientStyle}`}>
        <div className="flex justify-between items-start">
          <div>
            <span className={`text-xl font-black tracking-tight font-display ${textAccent}`}>Rolute</span>
            <div className={`text-[10px] font-mono tracking-widest uppercase opacity-75 ${textAccent}`}>
              {plan.name} Tier
            </div>
          </div>
          <div className={`w-10 h-7 rounded border border-white/20 flex items-center justify-center ${chipColor}`}>
            <div className="w-6 h-4 grid grid-cols-2 gap-0.5 opacity-60">
              <div className="bg-white/40 rounded-2xs" />
              <div className="bg-white/40 rounded-2xs" />
            </div>
          </div>
        </div>

        <div className={`font-mono text-sm tracking-widest ${textAccent}`}>
          •••• •••• •••• 2026
        </div>

        <div className="flex justify-between items-end">
          <div>
            <div className={`text-[9px] uppercase tracking-wider opacity-60 ${textAccent}`}>Cardholder</div>
            <div className={`text-xs font-bold tracking-wider ${textAccent}`}>ROLUTE MEMBER</div>
          </div>
          <div className="flex items-center -space-x-2">
            <div className="w-5 h-5 rounded-full bg-rose-500/90" />
            <div className="w-5 h-5 rounded-full bg-amber-500/90" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="planos" className={`py-20 md:py-28 relative transition-colors ${darkMode ? 'bg-neutral-950' : 'bg-slate-50/50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
            {isPt ? 'Estrutura de Planos' : 'Plan Offer Stack'}
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

          {/* Billing Switcher */}
          <div className={`inline-flex items-center p-1.5 rounded-2xl border mt-8 transition-colors ${
            darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-slate-200/70 border-slate-300'
          }`}>
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : darkMode
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.billingMonthly}
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                billingPeriod === 'annual'
                  ? 'bg-blue-600 text-white shadow-md'
                  : darkMode
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.billingAnnual}
            </button>
          </div>
        </div>

        {/* Selected Plan Showcase Banner on Desktop */}
        <div className={`hidden lg:grid grid-cols-12 gap-8 items-center mb-16 p-8 rounded-3xl border transition-all ${
          darkMode ? 'bg-neutral-900/70 border-neutral-800' : 'bg-white border-slate-200 shadow-lg'
        }`}>
          <div className="col-span-5 flex justify-center">
            {renderCardGraphic(selectedPlan)}
          </div>
          <div className="col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                {selectedPlan.targetUser}
              </span>
              {selectedPlan.badge && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-600/10 text-blue-600 border border-blue-500/30">
                  {selectedPlan.badge}
                </span>
              )}
            </div>
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {selectedPlan.name} · {selectedPlan.cardName}
            </h3>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-neutral-300' : 'text-slate-600'}`}>
              {selectedPlan.description}
            </p>
            <div className="pt-2 flex items-baseline gap-2">
              <span className={`text-3xl font-mono font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {billingPeriod === 'monthly'
                  ? selectedPlan.monthlyPrice === 0
                    ? isPt ? 'Grátis' : 'Free'
                    : `${selectedPlan.monthlyPrice} €`
                  : selectedPlan.annualPrice === 0
                  ? isPt ? 'Grátis' : 'Free'
                  : `${(selectedPlan.annualPrice / 12).toFixed(2)} €`}
              </span>
              <span className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
                {selectedPlan.monthlyPrice === 0 ? '' : isPt ? '/mês (faturado)' : '/month (billed)'}
              </span>
            </div>
          </div>
        </div>

        {/* 5 Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3">
          {t.plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const price =
              billingPeriod === 'monthly'
                ? plan.monthlyPrice === 0
                  ? isPt ? 'Grátis' : 'Free'
                  : `${plan.monthlyPrice} €`
                : plan.annualPrice === 0
                ? isPt ? 'Grátis' : 'Free'
                : `${(plan.annualPrice / 12).toFixed(2)} €`;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`rounded-3xl p-6 border flex flex-col justify-between cursor-pointer transition-all duration-200 relative ${
                  plan.highlight
                    ? 'border-blue-600 bg-white shadow-xl ring-2 ring-blue-600/20'
                    : isSelected
                    ? darkMode
                      ? 'border-neutral-500 bg-neutral-900/70'
                      : 'border-blue-500 bg-white shadow-md'
                    : darkMode
                    ? 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Badge if present */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-600 text-white shadow-md whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {plan.name}
                    </h3>
                  </div>

                  <div className="text-[11px] font-semibold text-blue-600 mb-4 min-h-[32px] leading-tight">
                    {plan.targetUser}
                  </div>

                  {/* Price */}
                  <div className={`mb-4 pb-4 border-b ${darkMode ? 'border-neutral-800' : 'border-slate-100'}`}>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-mono font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {price}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <span className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>/mês</span>
                      )}
                    </div>
                    {billingPeriod === 'annual' && plan.annualPrice > 0 && (
                      <div className={`text-[10px] mt-0.5 ${darkMode ? 'text-neutral-500' : 'text-slate-400'}`}>
                        {plan.annualPrice} € {isPt ? 'por ano' : 'per year'}
                      </div>
                    )}
                  </div>

                  {/* Card Mini Pill */}
                  <div className={`text-[11px] font-medium mb-4 flex items-center gap-1.5 ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
                    <CreditCard className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{plan.cardName}</span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 text-xs">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className={darkMode ? 'text-neutral-300' : 'text-slate-700'}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Action CTA */}
                <div className="mt-8 pt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDownload();
                    }}
                    className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 ${
                      plan.highlight
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : darkMode
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {t.choosePlan}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
