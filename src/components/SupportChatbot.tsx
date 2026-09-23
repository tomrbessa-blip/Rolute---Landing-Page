import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Calendar,
  ShieldCheck,
  Sparkles,
  User,
  ArrowUpRight,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types';

interface SupportChatbotProps {
  lang: Language;
  darkMode: boolean;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  showBooking?: boolean;
  legalDisclaimer?: string;
}

export const SupportChatbot: React.FC<SupportChatbotProps> = ({ lang, darkMode }) => {
  const isPt = lang === 'pt';
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreeting = isPt
    ? 'Olá! Somos a equipa de apoio oficial da Rolute Portugal. Como podemos ajudar hoje com a sua conta, planos ou funcionalidades?'
    : 'Hello! We are the official Rolute Portugal support team. How can we help you today with your account, plans, or features?';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: initialGreeting,
      time: 'Agora',
    },
  ]);

  const quickQuestions = [
    isPt ? 'Quais são os planos e preços?' : 'What are the plans & prices?',
    isPt ? 'Como domiciliar o meu ordenado?' : 'How to direct deposit salary?',
    isPt ? 'Como investir em ações e cripto?' : 'How to invest in stocks & crypto?',
    isPt ? 'Como bloquear um cartão perdido?' : 'How to freeze a misplaced card?',
    isPt ? 'Falar com um humano / Agendar chamada' : 'Talk to human / Book video call',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateBotResponse(query, isPt);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 600);
  };

  // Official Rolute Logic & Knowledge Base
  const generateBotResponse = (query: string, pt: boolean): Message => {
    const q = query.toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Escalamento para Humano / Agendamento
    if (
      q.includes('humano') ||
      q.includes('falar') ||
      q.includes('agendar') ||
      q.includes('suporte') ||
      q.includes('chamada') ||
      q.includes('call') ||
      q.includes('ultra') ||
      q.includes('duvida complexa') ||
      q.includes('hesitar')
    ) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: pt
          ? 'Com certeza! Para um acompanhamento 100% personalizado e para o ajudarmos com todas as questões, pode agendar uma chamada direta com a nossa equipa aqui:'
          : 'Certainly! For 100% personalized assistance and to help you with all questions, you can schedule a direct call with our team here:',
        time,
        showBooking: true,
      };
    }

    // 2. Planos e Preços
    if (q.includes('plano') || q.includes('preço') || q.includes('custo') || q.includes('price') || q.includes('plan')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: pt
          ? 'Na Rolute dispomos de 5 planos transparentes e sem fidelização:\n\n• **Standard**: Grátis (0 €/mês) — Conta e IBAN europeu, câmbio sem taxas até 1.000 €/mês.\n• **Plus**: 3,99 €/mês — Proteção alargada de compras e 2 contas Rolute <18.\n• **Premium**: 9,99 €/mês — Câmbio ilimitado sem taxas nos dias úteis e seguro médico global.\n• **Metal**: 17,99 €/mês — Cartão em aço de 18g, cashback e limites mais elevados.\n• **Ultra**: 55,00 €/mês — Luxo platina com acesso ilimitado a +1.400 lounges de aeroportos e cobertura flexível de cancelamento.'
          : 'At Rolute we offer 5 transparent tiers:\n\n• **Standard**: Free (€0/mo)\n• **Plus**: €3.99/mo\n• **Premium**: €9.99/mo\n• **Metal**: €17.99/mo\n• **Ultra**: €55.00/mo',
        time,
      };
    }

    // 3. Domiciliação de Ordenado / Salário
    if (q.includes('salario') || q.includes('salário') || q.includes('ordenado') || q.includes('iban') || q.includes('domiciliar') || q.includes('salary')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: pt
          ? 'Sim! Pode utilizar a Rolute como a sua conta bancária principal. Basta partilhar o seu IBAN europeu com a sua entidade patronal para receber o seu ordenado pontualmente. Pode ainda configurar débitos diretos SEPA (água, luz, telecomunicações) sem qualquer comissão de manutenção.'
          : 'Yes! You can use Rolute as your primary bank account. Simply share your dedicated European IBAN with your employer for automated salary deposits with zero monthly account fees.',
        time,
      };
    }

    // 4. Bloquear Cartão / Perda / Roubo
    if (q.includes('bloquear') || q.includes('perdi') || q.includes('roubo') || q.includes('cartao') || q.includes('cartão') || q.includes('freeze')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: pt
          ? 'A sua segurança é a nossa prioridade imediata! Para bloquear o seu cartão:\n\n1. Abra a app Rolute e toque no separador **Cartões**;\n2. Selecione o cartão desejado e clique em **Bloquear**.\n\nO cartão fica imediatamente inativo. Se o encontrar mais tarde, pode desbloqueá-lo no mesmo segundo com um simples clique!'
          : 'To freeze your card immediately:\n1. Open the Rolute app and go to the **Cards** tab.\n2. Tap **Freeze**.\nYou can unfreeze it instantly whenever you find it!',
        time,
      };
    }

    // 5. Investimentos, Ações, ETFs, Cripto ou Robo-Advisor
    if (
      q.includes('invest') ||
      q.includes('ação') ||
      q.includes('acoes') ||
      q.includes('etf') ||
      q.includes('cripto') ||
      q.includes('bitcoin') ||
      q.includes('robo') ||
      q.includes('stock')
    ) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: pt
          ? 'Na app da Rolute pode investir em mais de 6000 ações e ETFs mundiais a partir de 1 €, usufruir do Robo-Advisor automatizado e negociar mais de 100 criptomoedas com taxas competitivas a partir de 0%.'
          : 'On Rolute you can trade 6,000+ stocks and ETFs starting from €1, use our automated Robo-Advisor, and access 100+ cryptocurrencies directly.',
        time,
        legalDisclaimer: pt
          ? '*(Nota: Capital em risco. Os seus investimentos podem resultar em lucros ou perdas.)*'
          : '*(Note: Capital at risk. Your investments may result in profits or losses.)*',
      };
    }

    // 6. Segurança & Licença Bancária
    if (q.includes('seguro') || q.includes('segurança') || q.includes('licença') || q.includes('garantia') || q.includes('banco') || q.includes('safe')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: pt
          ? 'O seu dinheiro está totalmente protegido. A Rolute opera como banco europeu licenciado (Rolute Bank UAB), sob supervisão do Banco Central Europeu e Banco da Lituânia. Os depósitos elegíveis têm garantia legal até 100.000 € e a nossa infraestrutura proprietária Rolute Secure monitoriza transações contra fraudes 24 horas por dia.'
          : 'Your money is fully protected. Rolute Bank UAB is an authorized European bank regulated by the ECB and Bank of Lithuania. Eligible deposits are insured up to €100,000.',
        time,
      };
    }

    // Default fallback
    return {
      id: Date.now().toString(),
      sender: 'bot',
      text: pt
        ? 'Nós, a Rolute, estamos aqui para simplificar a sua vida financeira. Pode domiciliar o seu ordenado, poupar em mais de 30 moedas com a taxa de câmbio real, gerar cartões virtuais descartáveis ou subscrever um plano à sua medida.'
        : 'At Rolute, we are here to simplify your daily finances. You can receive your salary, exchange 30+ currencies with real interbank rates, and create disposable virtual cards.',
      time,
      showBooking: true,
    };
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-neutral-900/90 text-neutral-200 border border-neutral-800 rounded-full text-xs font-medium shadow-xl backdrop-blur-md animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isPt ? 'Apoio Rolute Online' : 'Rolute Support Online'}</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group relative border-2 border-white/20"
            aria-label="Abrir chat de apoio Rolute"
          >
            <MessageCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-neutral-950 rounded-full" />
          </button>
        </div>
      )}

      {/* Floating Chat Drawer / Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[90vh] bg-neutral-950 border border-neutral-800 rounded-[32px] shadow-2xl flex flex-col overflow-hidden text-white animate-fadeIn"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md border border-white/10">
                R
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-tight font-display">
                    {isPt ? 'Apoio Oficial Rolute' : 'Official Rolute Support'}
                  </h3>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400">
                  {isPt ? 'Supervisão Europeia · Respostas imediatas' : 'European Supervision · Instant Help'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Fechar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conversation Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-md'
                      : 'bg-neutral-900 text-neutral-200 border border-neutral-800/90 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Optional Booking Call Button when escalated */}
                  {msg.showBooking && (
                    <div className="mt-3 pt-3 border-t border-neutral-800">
                      <a
                        href="https://cal.com/tomas-bessa-crbpiq/rolute"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{isPt ? 'Agendar Chamada de Acompanhamento' : 'Schedule 1-on-1 Call'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                      </a>
                    </div>
                  )}

                  {/* Mandatory Legal Disclaimer for Investments/Crypto */}
                  {msg.legalDisclaimer && (
                    <div className="mt-2.5 pt-2 border-t border-neutral-800/80 text-[10px] text-amber-400 italic">
                      {msg.legalDisclaimer}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-neutral-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-neutral-900 border border-neutral-800 w-20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 bg-neutral-900/50 border-t border-neutral-900 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="shrink-0 px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-[10px] font-medium transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-neutral-900 border-t border-neutral-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isPt ? 'Escreva a sua questão sobre a Rolute...' : 'Ask about Rolute accounts or features...'}
                className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-colors shadow-sm"
                aria-label="Enviar mensagem"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
