import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Language } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SocialProof } from './components/SocialProof';
import { Personas } from './components/Personas';
import { Features } from './components/Features';
import { InteractiveExchange } from './components/InteractiveExchange';
import { Pricing } from './components/Pricing';
import { ProposalForm } from './components/ProposalForm';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { DownloadModal } from './components/DownloadModal';
import { SupportChatbot } from './components/SupportChatbot';
import { ProposalView } from './pages/ProposalView';
import { AdminDashboard } from './pages/AdminDashboard';

function LandingPage({
  lang,
  darkMode,
  toggleLanguage,
  toggleTheme,
  isDownloadOpen,
  setIsDownloadOpen,
}: {
  lang: Language;
  darkMode: boolean;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  isDownloadOpen: boolean;
  setIsDownloadOpen: (open: boolean) => void;
}) {
  return (
    <div
      className={`min-h-screen transition-colors duration-200 selection:bg-blue-600 selection:text-white ${
        darkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Bar Navigation floating over hero */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        onOpenDownload={() => setIsDownloadOpen(true)}
      />

      <main>
        {/* 1. Hero Section (Vivid Open Sky & Lifestyle Composition) */}
        <Hero
          lang={lang}
          darkMode={darkMode}
          onOpenDownload={() => setIsDownloadOpen(true)}
        />

        {/* 3. Social Proof (Trust Engine) */}
        <SocialProof lang={lang} darkMode={darkMode} />

        {/* 2. Target Audience Section (Personas) */}
        <Personas
          lang={lang}
          darkMode={darkMode}
          onOpenDownload={() => setIsDownloadOpen(true)}
        />

        {/* 3 & 4 & 5 & 6 & 7. Core Solutions & Services */}
        <Features
          lang={lang}
          darkMode={darkMode}
          onOpenDownload={() => setIsDownloadOpen(true)}
        />

        {/* Interactive Currency Converter & Fee Comparison Widget */}
        <InteractiveExchange
          lang={lang}
          darkMode={darkMode}
          onOpenDownload={() => setIsDownloadOpen(true)}
        />

        {/* Offer Stack / Pricing */}
        <Pricing
          lang={lang}
          darkMode={darkMode}
          onOpenDownload={() => setIsDownloadOpen(true)}
        />

        {/* Formulário de Pedido de Proposta (3 campos: Nome, Email, Pedido + 'Pedir Proposta') */}
        <ProposalForm lang={lang} darkMode={darkMode} />

        {/* 5. FAQ (12 comprehensive questions) */}
        <FAQ
          lang={lang}
          darkMode={darkMode}
          onOpenDownload={() => setIsDownloadOpen(true)}
        />

        {/* 8. Final CTA & Global Scale */}
        <FinalCTA
          lang={lang}
          darkMode={darkMode}
          onOpenDownload={() => setIsDownloadOpen(true)}
        />
      </main>

      {/* Institutional Footer */}
      <Footer
        lang={lang}
        darkMode={darkMode}
        onOpenDownload={() => setIsDownloadOpen(true)}
      />

      {/* Conversion Download / QR Modal */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        lang={lang}
      />

      {/* Official Rolute Portugal AI Support Assistant Chatbot */}
      <SupportChatbot lang={lang} darkMode={darkMode} />
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<Language>('pt');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'pt' ? 'en' : 'pt'));
  };

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              lang={lang}
              darkMode={darkMode}
              toggleLanguage={toggleLanguage}
              toggleTheme={toggleTheme}
              isDownloadOpen={isDownloadOpen}
              setIsDownloadOpen={setIsDownloadOpen}
            />
          }
        />
        <Route path="/proposta/:token" element={<ProposalView />} />
        <Route path="/proposta/*" element={<ProposalView />} />
        <Route path="/proposta" element={<ProposalView />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route
          path="*"
          element={
            <LandingPage
              lang={lang}
              darkMode={darkMode}
              toggleLanguage={toggleLanguage}
              toggleTheme={toggleTheme}
              isDownloadOpen={isDownloadOpen}
              setIsDownloadOpen={setIsDownloadOpen}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
