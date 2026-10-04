import React, { useState, useEffect } from 'react';
import { Globe, Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';
import { Language } from '../types';
import { content } from '../data/content';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenDownload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  darkMode,
  onToggleTheme,
  onOpenDownload,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = content[lang].nav;
  const isPt = lang === 'pt';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: isPt ? 'Pessoal' : 'Personal', href: '#solucoes' },
    { label: isPt ? 'Empresas' : 'Business', href: '#publico' },
    { label: isPt ? 'Planos' : 'Plans', href: '#planos' },
    { label: isPt ? 'Pedir Proposta' : 'Pedir Proposta', href: '#proposta' },
    { label: isPt ? 'Segurança' : 'Security', href: '#seguranca' },
    { label: isPt ? 'FAQ' : 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? darkMode
            ? 'bg-neutral-950/90 border-b border-neutral-800 backdrop-blur-md text-white shadow-xl shadow-black/20'
            : 'bg-white/95 border-b border-slate-200/90 backdrop-blur-md text-slate-900 shadow-sm'
          : darkMode
          ? 'bg-neutral-950/75 border-b border-neutral-800/40 backdrop-blur-sm text-white'
          : 'bg-white/80 border-b border-slate-200/50 backdrop-blur-sm text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-8">
          <a
            href="#"
            className="text-2xl font-black tracking-tight font-display flex items-center focus:outline-none"
          >
            <span className="tracking-tighter">Rolute</span>
          </a>

          {/* Zone 2: Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`transition-colors whitespace-nowrap ${
                  darkMode
                    ? 'text-neutral-300 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              darkMode
                ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
            title={lang === 'pt' ? 'Switch to English' : 'Mudar para Português'}
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="uppercase">{lang}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl transition-colors ${
              darkMode
                ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
            title={darkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Login Text Button */}
          <button
            onClick={onOpenDownload}
            className={`hidden lg:inline-flex text-xs font-semibold px-3 py-2 transition-colors ${
              darkMode
                ? 'text-neutral-300 hover:text-white'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            {t.login}
          </button>

          {/* Primary CTA Button */}
          <button
            onClick={onOpenDownload}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all whitespace-nowrap active:scale-95"
          >
            {isPt ? 'Transferir a app' : 'Get the app'}
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${
              darkMode
                ? 'text-neutral-300 hover:bg-neutral-800'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden px-4 pt-3 pb-6 border-t ${
            darkMode
              ? 'bg-neutral-950 border-neutral-800 text-white'
              : 'bg-white border-slate-200 text-slate-900 shadow-xl'
          }`}
        >
          <div className="flex flex-col space-y-3 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-2 px-3 rounded-xl transition-colors ${
                  darkMode ? 'hover:bg-neutral-900 text-neutral-200' : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDownload();
                }}
                className="w-full py-3 text-center text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md"
              >
                {t.downloadApp}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
