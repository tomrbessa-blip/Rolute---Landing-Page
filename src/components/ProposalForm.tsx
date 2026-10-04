import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  User,
  Mail,
  FileText,
  Sparkles,
  Clock,
  ShieldCheck,
  Video,
  ArrowRight,
  ExternalLink,
  Building2,
  RotateCcw
} from 'lucide-react';
import { Language } from '../types';

interface ProposalFormProps {
  lang: Language;
  darkMode: boolean;
}

interface SubmittedProposal {
  name: string;
  email: string;
  pedido: string;
  submittedAt: string;
}

export const ProposalForm: React.FC<ProposalFormProps> = ({ lang, darkMode }) => {
  const isPt = lang === 'pt';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pedido, setPedido] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<SubmittedProposal | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!name.trim()) {
      setErrorMessage(isPt ? 'Por favor, indique o seu Nome.' : 'Please enter your Name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage(
        isPt
          ? 'Por favor, introduza um Email válido (ex: seu.nome@empresa.com).'
          : 'Please enter a valid Email address.'
      );
      return;
    }

    if (!pedido.trim() || pedido.trim().length < 10) {
      setErrorMessage(
        isPt
          ? 'Por favor, descreva o seu Pedido com mais detalhe (mínimo 10 carateres).'
          : 'Please describe your Request with a bit more detail (minimum 10 characters).'
      );
      return;
    }

    setIsSubmitting(true);

    fetch('/api/pedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: name.trim(),
        email: email.trim(),
        pedido: pedido.trim(),
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Erro ao submeter o pedido. Por favor, tente novamente.');
        }

        const payload: SubmittedProposal = {
          name: name.trim(),
          email: email.trim(),
          pedido: pedido.trim(),
          submittedAt: new Date().toLocaleTimeString(isPt ? 'pt-PT' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: 'short',
          }),
        };

        setSubmittedData(payload);
        setIsSubmitted(true);
      })
      .catch((err: any) => {
        setErrorMessage(err.message || 'Erro de comunicação ao enviar o pedido.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPedido('');
    setIsSubmitted(false);
    setSubmittedData(null);
    setErrorMessage(null);
  };

  return (
    <section id="proposta" className="py-20 md:py-28 relative scroll-mt-20 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-r from-blue-600/15 via-indigo-500/10 to-sky-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 text-xs font-semibold tracking-wide uppercase mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 animate-pulse" />
            <span>{isPt ? 'Soluções à Medida & Negócios' : 'Tailored & Custom Solutions'}</span>
          </div>

          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display mb-4 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {isPt ? 'Pedir Proposta Personalizada' : 'Request a Custom Proposal'}
          </h2>

          <p
            className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
              darkMode ? 'text-neutral-300' : 'text-slate-600'
            }`}
          >
            {isPt
              ? 'Precisa de condições exclusivas para a sua empresa, grandes volumes de câmbio ou gestão para a sua equipa? Preencha os campos abaixo e receba uma proposta detalhada.'
              : 'Looking for bespoke conditions for your business, large foreign exchange volumes, or team expense management? Submit your request below for a tailored proposal.'}
          </p>
        </div>

        {/* Main Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column: Value Prop & Guarantees */}
          <div className="lg:col-span-5 space-y-6">
            <div
              className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                darkMode
                  ? 'bg-neutral-900/60 border-neutral-800 text-neutral-200'
                  : 'bg-white border-slate-200 text-slate-800 shadow-sm'
              }`}
            >
              <h3
                className={`text-xl font-bold font-display mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                {isPt ? 'O que acontece após enviar o pedido?' : 'What happens after you submit?'}
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-semibold ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {isPt ? 'Resposta em menos de 24 horas úteis' : 'Response in under 24 hours'}
                    </h4>
                    <p
                      className={`text-xs sm:text-sm mt-0.5 leading-relaxed ${
                        darkMode ? 'text-neutral-400' : 'text-slate-600'
                      }`}
                    >
                      {isPt
                        ? 'Um especialista sénior da equipa de contas dedicadas analisa a sua necessidade específica.'
                        : 'A dedicated specialist reviews your requirements to formulate the ideal package.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-semibold ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {isPt ? 'Sem qualquer compromisso' : '100% Free & No Commitment'}
                    </h4>
                    <p
                      className={`text-xs sm:text-sm mt-0.5 leading-relaxed ${
                        darkMode ? 'text-neutral-400' : 'text-slate-600'
                      }`}
                    >
                      {isPt
                        ? 'Apresentamos um estudo de poupança e taxas preferenciais sem custos associados.'
                        : 'We present a complete savings study with zero upfront fees or obligations.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0 mt-0.5">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-semibold ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {isPt ? 'Condições corporativas e individuais' : 'Corporate & High-Net-Worth Perks'}
                    </h4>
                    <p
                      className={`text-xs sm:text-sm mt-0.5 leading-relaxed ${
                        darkMode ? 'text-neutral-400' : 'text-slate-600'
                      }`}
                    >
                      {isPt
                        ? 'Acesso a limites alargados de transferência, múltiplos cartões metálicos e API de pagamentos.'
                        : 'Access custom FX spreads, multi-user permissions, metal company cards, and treasury tools.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fast track video call prompt */}
              <div
                className={`mt-6 pt-6 border-t ${
                  darkMode ? 'border-neutral-800' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-semibold">
                      {isPt ? 'Prefere falar agora?' : 'Prefer an immediate call?'}
                    </span>
                  </div>
                  <a
                    href="https://cal.com/tomas-bessa-crbpiq/rolute"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    <span>{isPt ? 'Agendar chamada' : 'Book video call'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The 3-Field Proposal Form */}
          <div className="lg:col-span-7">
            <div
              className={`relative rounded-3xl p-6 sm:p-10 border transition-all shadow-2xl ${
                darkMode
                  ? 'bg-neutral-900/90 border-neutral-800 backdrop-blur-xl shadow-black/40'
                  : 'bg-white border-slate-200 backdrop-blur-xl shadow-slate-200/60'
              }`}
            >
              {/* Decorative top accent line */}
              <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 rounded-full" />

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800/40 dark:border-neutral-800">
                    <div>
                      <h3
                        className={`text-xl font-bold font-display ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {isPt ? 'Formulário de Pedido de Proposta' : 'Proposal Request Form'}
                      </h3>
                      <p
                        className={`text-xs sm:text-sm mt-0.5 ${
                          darkMode ? 'text-neutral-400' : 'text-slate-500'
                        }`}
                      >
                        {isPt
                          ? 'Preencha os 3 campos e receba a resposta da nossa equipa'
                          : 'Complete the 3 fields below to receive our tailored proposal'}
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {isPt ? '3 Campos Simples' : '3 Quick Fields'}
                    </span>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-xs sm:text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Field 1: Nome */}
                  <div className="space-y-2">
                    <label
                      htmlFor="proposal-name"
                      className={`block text-sm font-semibold flex items-center justify-between ${
                        darkMode ? 'text-neutral-200' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        <span>{isPt ? 'Nome' : 'Name'}</span>
                      </span>
                      <span className="text-[11px] font-normal text-neutral-400">
                        {isPt ? 'Obrigatório' : 'Required'}
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        id="proposal-name"
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isPt ? 'Ex: Mariana Silva' : 'E.g. Mariana Silva'}
                        required
                        className={`w-full px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                          darkMode
                            ? 'bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-500 focus:border-blue-500'
                            : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Field 2: Email */}
                  <div className="space-y-2">
                    <label
                      htmlFor="proposal-email"
                      className={`block text-sm font-semibold flex items-center justify-between ${
                        darkMode ? 'text-neutral-200' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span>{isPt ? 'Email' : 'Email'}</span>
                      </span>
                      <span className="text-[11px] font-normal text-neutral-400">
                        {isPt ? 'Obrigatório' : 'Required'}
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        id="proposal-email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isPt ? 'Ex: mariana.silva@empresa.pt' : 'E.g. mariana@example.com'}
                        required
                        className={`w-full px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                          darkMode
                            ? 'bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-500 focus:border-blue-500'
                            : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Field 3: Pedido */}
                  <div className="space-y-2">
                    <label
                      htmlFor="proposal-pedido"
                      className={`block text-sm font-semibold flex items-center justify-between ${
                        darkMode ? 'text-neutral-200' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span>{isPt ? 'Pedido' : 'Request'}</span>
                      </span>
                      <span className="text-[11px] font-normal text-neutral-400">
                        {isPt ? 'Descreva o que procura' : 'Describe what you need'}
                      </span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="proposal-pedido"
                        name="pedido"
                        value={pedido}
                        onChange={(e) => setPedido(e.target.value)}
                        rows={4}
                        placeholder={
                          isPt
                            ? 'Descreva aqui o que pretende (ex: conta empresarial para 12 colaboradores, soluções de tesouraria multimoeda em USD/EUR, ou proposta para plano Metal/Ultra com acompanhamento dedicado...)'
                            : 'Describe here what you need (e.g. business account for 12 team members, multi-currency treasury, or custom Ultra tier onboarding...)'
                        }
                        required
                        className={`w-full px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y leading-relaxed ${
                          darkMode
                            ? 'bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-500 focus:border-blue-500'
                            : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Submit Button: 'Pedir Proposta' */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-500 hover:via-sky-400 hover:to-blue-500 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>{isPt ? 'A processar o pedido...' : 'Processing proposal request...'}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          <span>{isPt ? 'Pedir Proposta' : 'Request Proposal'}</span>
                        </>
                      )}
                    </button>

                    <p
                      className={`text-center text-[11px] mt-3 ${
                        darkMode ? 'text-neutral-500' : 'text-slate-400'
                      }`}
                    >
                      {isPt
                        ? 'Ao submeter, os seus dados são tratados com total confidencialidade segundo o RGPD.'
                        : 'Your data is strictly processed according to GDPR and European banking standards.'}
                    </p>
                  </div>
                </form>
              ) : (
                /* Success Feedback State */
                <div className="py-4 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div>
                    <h3
                      className={`text-2xl font-bold font-display ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {isPt ? 'O seu pedido foi recebido com sucesso.' : 'Your request was successfully received.'}
                    </h3>
                    <p
                      className={`text-sm mt-2 max-w-md mx-auto leading-relaxed ${
                        darkMode ? 'text-neutral-300' : 'text-slate-600'
                      }`}
                    >
                      {isPt ? (
                        <>
                          Obrigado, <strong className="text-blue-500">{submittedData?.name}</strong>! O
                          seu pedido foi registado na base de dados e os detalhes foram encaminhados para a nossa equipa.
                        </>
                      ) : (
                        <>
                          Thank you, <strong className="text-blue-500">{submittedData?.name}</strong>! Your
                          request has been registered in the database and forwarded to our team.
                        </>
                      )}
                    </p>
                  </div>

                  {/* Summary recap box */}
                  {submittedData && (
                    <div
                      className={`p-4 rounded-2xl text-left text-xs max-w-md mx-auto space-y-2 border ${
                        darkMode
                          ? 'bg-neutral-950/60 border-neutral-800 text-neutral-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center text-neutral-400 pb-2 border-b border-neutral-800/40">
                        <span className="font-semibold uppercase tracking-wider text-[10px]">
                          {isPt ? 'Resumo do Pedido' : 'Request Summary'}
                        </span>
                        <span>{submittedData.submittedAt}</span>
                      </div>
                      <div>
                        <span className="font-semibold">{isPt ? 'Nome: ' : 'Name: '}</span>
                        <span>{submittedData.name}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Email: </span>
                        <span>{submittedData.email}</span>
                      </div>
                      <div>
                        <span className="font-semibold">{isPt ? 'Pedido: ' : 'Request: '}</span>
                        <p className="mt-1 italic line-clamp-3 text-neutral-400">
                          &ldquo;{submittedData.pedido}&rdquo;
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Follow-up CTA & reset */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href="https://cal.com/tomas-bessa-crbpiq/rolute"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      <Video className="w-4 h-4" />
                      <span>{isPt ? 'Agendar Chamada Imediata' : 'Book Immediate Call'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={handleReset}
                      className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold border flex items-center justify-center gap-2 transition-colors ${
                        darkMode
                          ? 'border-neutral-800 hover:bg-neutral-800 text-neutral-300'
                          : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isPt ? 'Submeter Outro Pedido' : 'Submit Another Request'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
