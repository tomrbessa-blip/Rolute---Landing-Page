import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle, MessageSquare } from 'lucide-react';
import { Language } from '../types';
import { content } from '../data/content';

interface FAQProps {
  lang: Language;
  darkMode: boolean;
  onOpenDownload: () => void;
}

export const FAQ: React.FC<FAQProps> = ({ lang, darkMode, onOpenDownload }) => {
  const t = content[lang].faq;
  const isPt = lang === 'pt';

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: isPt ? 'Todas as Perguntas' : 'All Questions' },
    { id: 'security', label: isPt ? 'Segurança & Licença' : 'Security & License' },
    { id: 'banking', label: isPt ? 'Banca & Salário' : 'Banking & Salary' },
    { id: 'cards', label: isPt ? 'Cartões & Vantagens' : 'Cards & Perks' },
    { id: 'investing', label: isPt ? 'Investir & Cripto' : 'Invest & Crypto' },
  ];

  const filteredItems = t.items.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className={`py-20 md:py-28 relative transition-colors ${darkMode ? 'bg-neutral-950' : 'bg-slate-50/50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
            {isPt ? 'Esclareça as suas dúvidas' : 'Got questions?'}
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-display mb-4 text-balance ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {t.title}
          </h2>
          <p
            className={`text-base text-balance leading-relaxed ${
              darkMode ? 'text-neutral-400' : 'text-slate-600'
            }`}
          >
            {t.subtitle}
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-neutral-400' : 'text-slate-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isPt ? 'Pesquisar perguntas (ex: IBAN, segurança, cartões)...' : 'Search questions (e.g. IBAN, security, cards)...'}
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs border focus:outline-none focus:border-blue-500 transition-colors shadow-xs ${
                darkMode
                  ? 'bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
              }`}
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : darkMode
                    ? 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 12 Q&A Accordion Items */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className={`text-center py-10 text-sm ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
              {isPt ? 'Nenhuma pergunta encontrada com esse critério.' : 'No questions found matching your search.'}
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    darkMode
                      ? 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={isOpen}
                    className="w-full py-4 sm:py-5 px-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span
                      className={`text-sm sm:text-base font-semibold leading-snug ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {item.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'rotate-180 bg-blue-600 text-white'
                          : darkMode
                          ? 'bg-neutral-800 text-neutral-400'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className={`px-6 pb-5 pt-1 border-t animate-fadeIn ${darkMode ? 'border-neutral-800/40' : 'border-slate-100'}`}>
                      <p
                        className={`text-xs sm:text-sm leading-relaxed ${
                          darkMode ? 'text-neutral-300' : 'text-slate-600'
                        }`}
                      >
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Need more help bar with Official Cal.com booking */}
        <div className={`mt-12 p-6 sm:p-8 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left transition-all ${
          darkMode ? 'bg-neutral-900/80 border-neutral-800 shadow-xl' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/15 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {isPt ? 'Ainda tem dúvidas? Fale Connosco' : 'Still have questions? Talk to Us'}
              </div>
              <div className={`text-xs sm:text-sm mt-1 leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
                {isPt
                  ? 'Agende uma videochamada de acompanhamento personalizado com a nossa equipa de especialistas da Rolute.'
                  : 'Schedule a personalized one-on-one video call consultation with our Rolute specialist team.'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href="https://cal.com/tomas-bessa-crbpiq/rolute"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto px-6 py-3.5 font-bold text-xs sm:text-sm rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md text-center inline-flex items-center justify-center gap-2"
            >
              <span>{isPt ? 'Agendar Videochamada' : 'Schedule Video Call'}</span>
              <span className="text-xs opacity-75">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
