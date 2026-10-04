import React from 'react';
import { Shield } from 'lucide-react';
import { Language } from '../types';
import { content } from '../data/content';

interface FooterProps {
  lang: Language;
  darkMode: boolean;
  onOpenDownload: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, darkMode, onOpenDownload }) => {
  const t = content[lang].footer;
  const isPt = lang === 'pt';

  return (
    <footer
      className={`border-t transition-colors ${
        darkMode
          ? 'bg-neutral-950 border-neutral-800 text-neutral-400'
          : 'bg-white border-slate-200 text-slate-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-4 space-y-4">
            <a
              href="#"
              className={`text-2xl font-black tracking-tight font-display inline-block ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Rolute
            </a>
            <p className="text-xs leading-relaxed max-w-sm">
              {isPt
                ? 'Muito mais do que um simples banco. O ecossistema financeiro global que une poupanças, despesas, investimentos e transferências numa só app.'
                : 'Much more than just a bank. The global financial super app bringing savings, spending, investments, and borderless transfers together.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>{isPt ? 'Supervisão Europeia (BCE) · Licença UAB' : 'European Central Bank Regulated'}</span>
            </div>
          </div>

          {/* Nav links columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
            <div>
              <div className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {isPt ? 'Conta' : 'Account'}
              </div>
              <ul className="space-y-2">
                <li><a href="#solucoes" className="hover:text-blue-600 transition-colors">{isPt ? 'Domiciliação Salarial' : 'Direct Deposit'}</a></li>
                <li><a href="#solucoes" className="hover:text-blue-600 transition-colors">{isPt ? 'Cartões Virtuais' : 'Virtual Cards'}</a></li>
                <li><a href="#solucoes" className="hover:text-blue-600 transition-colors">{isPt ? 'Cofres de Poupança' : 'Savings Vaults'}</a></li>
                <li><a href="#planos" className="hover:text-blue-600 transition-colors">{isPt ? 'RevPoints e Milhas' : 'RevPoints Miles'}</a></li>
              </ul>
            </div>

            <div>
              <div className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {isPt ? 'Investimentos' : 'Investments'}
              </div>
              <ul className="space-y-2">
                <li><a href="#solucoes" className="hover:text-blue-600 transition-colors">{isPt ? '+6000 Ações e ETFs' : '6,000+ Stocks & ETFs'}</a></li>
                <li><a href="#solucoes" className="hover:text-blue-600 transition-colors">Robo-Advisor</a></li>
                <li><a href="#solucoes" className="hover:text-blue-600 transition-colors">{isPt ? 'Criptoativos (a partir 0%)' : 'Crypto from 0%'}</a></li>
                <li><a href="#solucoes" className="hover:text-blue-600 transition-colors">{isPt ? 'Investimento Recorrente' : 'Auto Recurring'}</a></li>
              </ul>
            </div>

            <div>
              <div className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {isPt ? 'Planos' : 'Plans'}
              </div>
              <ul className="space-y-2">
                <li><a href="#planos" className="hover:text-blue-600 transition-colors">Standard (Grátis)</a></li>
                <li><a href="#planos" className="hover:text-blue-600 transition-colors">Plus (3,99 €)</a></li>
                <li><a href="#planos" className="hover:text-blue-600 transition-colors">Premium (9,99 €)</a></li>
                <li><a href="#planos" className="hover:text-blue-600 transition-colors">Metal (17,99 €)</a></li>
                <li><a href="#planos" className="hover:text-blue-600 transition-colors">Ultra (55 €)</a></li>
                <li><a href="#proposta" className="text-blue-500 font-semibold hover:underline">{isPt ? 'Pedir Proposta' : 'Pedir Proposta'}</a></li>
              </ul>
            </div>

            <div>
              <div className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {isPt ? 'Segurança' : 'Security'}
              </div>
              <ul className="space-y-2">
                <li><a href="#seguranca" className="hover:text-blue-600 transition-colors">Rolute Secure 24/7</a></li>
                <li><a href="#seguranca" className="hover:text-blue-600 transition-colors">{isPt ? 'Garantia até 100k €' : 'Deposit Guarantee'}</a></li>
                <li><a href="#faq" className="hover:text-blue-600 transition-colors">{isPt ? 'Ajuda & FAQ' : 'Help & FAQ'}</a></li>
                <li>
                  <a href="/admin" className="text-blue-500 font-semibold hover:underline">
                    {isPt ? 'Área de Administração (Admin)' : 'Admin Portal'}
                  </a>
                </li>
                <li>
                  <button onClick={onOpenDownload} className="text-blue-600 font-semibold hover:underline">
                    {isPt ? 'Transferir App' : 'Download App'}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimers as required for European Financial Institutions */}
        <div className={`pt-8 border-t text-[11px] leading-relaxed space-y-3 ${
          darkMode ? 'border-neutral-800 text-neutral-500' : 'border-slate-200 text-slate-500'
        }`}>
          <p>{t.disclaimer}</p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
            <div>{t.rights}</div>
            <div className="flex flex-wrap gap-4">
              {t.links.map((link, idx) => (
                <a key={idx} href={link.href} className="hover:text-blue-600 transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
