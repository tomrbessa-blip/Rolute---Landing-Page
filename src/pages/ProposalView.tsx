import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  PhoneCall,
} from 'lucide-react';

interface ProposalItem {
  catalogoId: string;
  nome: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  precoUnitarioCentimos: number;
  subtotalCentimos: number;
  condicoes?: string;
  evidencia?: string;
}

interface ProposalData {
  id: string;
  numeroProposta: string;
  criadaEm: string;
  validadeAte: string;
  expirada: boolean;
  resumoAmbito: string;
  itens: ProposalItem[];
  totalCentimos: number;
  condicoes: string;
  propostaDemonstracao: boolean;
  negocio: {
    nome: string;
    entidade: string;
    contacto: string;
    agendamento: string;
  };
}

export const ProposalView: React.FC = () => {
  const { token: routeToken } = useParams<{ token: string }>();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proposta, setProposta] = useState<ProposalData | null>(null);

  // Extract token from route param, query param (?token=...), or pathname
  const searchToken = new URLSearchParams(location.search).get('token');
  const pathToken = location.pathname.replace(/^\/proposta\/?/, '').split('/')[0]?.trim();
  const resolvedToken = (routeToken || searchToken || pathToken || '').trim();

  useEffect(() => {
    // Add noindex meta tag to protect privacy
    let metaTag = document.querySelector('meta[name="robots"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'robots');
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', 'noindex, nofollow');

    if (!resolvedToken || resolvedToken.length < 8) {
      setError('Token de proposta não fornecido ou ligação incompleta.');
      setLoading(false);
      return;
    }

    const fetchProposal = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Primary: Unauthenticated Backend API
        let data: any = null;
        try {
          const res = await fetch(`/api/proposta/${resolvedToken}`, {
            headers: {
              Accept: 'application/json',
            },
          });
          if (res.ok) {
            data = await res.json();
          }
        } catch {
          // Network or proxy fallback to Firestore client
        }

        if (data?.success && data?.proposta) {
          setProposta(data.proposta);
          setLoading(false);
          return;
        }

        // 2. Direct Firestore fallback (100% Anonymous & Public, no login required)
        try {
          const propCol = collection(db, 'propostas');
          const q = query(propCol, where('token', '==', resolvedToken));
          const querySnap = await getDocs(q);

          let matched = !querySnap.empty ? querySnap.docs[0].data() : null;

          if (!matched) {
            const allSnap = await getDocs(propCol);
            const found = allSnap.docs.find((d) => d.data().token === resolvedToken);
            matched = found ? found.data() : null;
          }

          if (matched) {
            const validade = new Date(matched.validadeAte);
            const expirada = Date.now() > validade.getTime();

            setProposta({
              id: matched.id,
              numeroProposta: matched.numeroProposta,
              criadaEm: matched.criadaEm,
              validadeAte: matched.validadeAte,
              expirada,
              resumoAmbito: matched.resumoAmbito,
              itens: matched.itens || [],
              totalCentimos: matched.totalCentimos || 0,
              condicoes: matched.condicoes || 'Valores apresentados em Euros (€) sem IVA.',
              propostaDemonstracao: matched.propostaDemonstracao ?? true,
              negocio: {
                nome: 'Rolute Portugal',
                entidade: 'Rolute Bank UAB (Licença BCE)',
                contacto: 'suporte@rolute.pt',
                agendamento: 'https://cal.com/tomas-bessa-crbpiq/rolute',
              },
            });
            setLoading(false);
            return;
          }
        } catch (dbErr: any) {
          console.warn('Fallback Firestore read error:', dbErr?.message);
        }

        setError('Não encontramos a proposta associada a esta ligação. O link pode ter expirado ou estar incorreto.');
      } catch (err: any) {
        setError('Ocorreu um erro ao carregar a proposta.');
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [resolvedToken]);

  const formatCurrency = (centimos: number) => {
    return (centimos / 100).toLocaleString('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    });
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-neutral-400">A carregar a proposta comercial...</p>
        </div>
      </div>
    );
  }

  if (error || !proposta) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-neutral-900 border border-neutral-800 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white">Proposta Indisponível</h2>
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
              {error || 'Não encontramos a proposta associada a esta ligação. O link pode ter expirado ou estar incorreto.'}
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar à Página Principal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-blue-600/10 via-sky-500/10 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative space-y-8">
        {/* Navigation & Header Brand */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à Rolute</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight font-display text-white">Rolute</span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Acesso Público
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Proposta Oficial
            </span>
          </div>
        </div>

        {/* Demo proposal badge notice */}
        {proposta.propostaDemonstracao && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Modo de Aula Pedagógico:</strong> Proposta calculada automaticamente através do backend com IA Gemini e catálogo oficial em base de dados Firebase.
              </span>
            </div>
            <span className="shrink-0 text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-amber-500/20">
              Simulação Real
            </span>
          </div>
        )}

        {/* Expiration notice if expired */}
        {proposta.expirada && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Validade Expirada:</strong> O prazo limite de 15 dias desta proposta foi ultrapassado. Os valores e condições apresentados servem apenas de histórico.
              </span>
            </div>
            <span className="shrink-0 text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-rose-500/20">
              Expirada
            </span>
          </div>
        )}

        {/* Proposal Document Card */}
        <div className="rounded-3xl p-6 sm:p-10 bg-neutral-900/90 border border-neutral-800 backdrop-blur-xl shadow-2xl space-y-8">
          {/* Document Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <FileText className="w-5 h-5 text-blue-500" />
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
                  Proposta Comercial
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400">
                Referência: <span className="font-mono text-neutral-200 font-semibold">{proposta.numeroProposta}</span>
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 sm:gap-1 text-xs">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>Emitida a {formatDate(proposta.criadaEm)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Válida até {formatDate(proposta.validadeAte)}</span>
              </div>
            </div>
          </div>

          {/* Scope Summary */}
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-1.5">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Resumo do Âmbito
            </h3>
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-medium">
              {proposta.resumoAmbito}
            </p>
          </div>

          {/* Items & Services Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>Produtos e Serviços Incluídos</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 text-xs font-semibold">
                    <th className="py-3 px-3">Item & Descrição</th>
                    <th className="py-3 px-3 text-center">Unidade</th>
                    <th className="py-3 px-3 text-center">Qtd.</th>
                    <th className="py-3 px-3 text-right">Preço Unit.</th>
                    <th className="py-3 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {proposta.itens.map((item, idx) => (
                    <tr key={idx} className="hover:bg-neutral-800/20 transition-colors">
                      <td className="py-4 px-3">
                        <div className="font-semibold text-white">{item.nome}</div>
                        <div className="text-xs text-neutral-400 mt-0.5 line-clamp-2">{item.descricao}</div>
                        {item.condicoes && (
                          <div className="text-[11px] text-blue-400/90 mt-1 italic">
                            Nota: {item.condicoes}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-3 text-center text-xs text-neutral-300 capitalize">
                        {item.unidade}
                      </td>
                      <td className="py-4 px-3 text-center font-semibold text-white">
                        {item.quantidade}
                      </td>
                      <td className="py-4 px-3 text-right text-neutral-300 font-mono">
                        {formatCurrency(item.precoUnitarioCentimos)}
                      </td>
                      <td className="py-4 px-3 text-right font-bold text-white font-mono">
                        {formatCurrency(item.subtotalCentimos)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Total Summary Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-950 to-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Valor Global da Proposta
              </span>
              <p className="text-xs text-neutral-500">
                Preços de catálogo em vigor. Sem custos ocultos nem comissões adicionais.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs font-medium text-neutral-400">Total sem IVA</div>
              <div className="text-3xl sm:text-4xl font-black font-display text-white text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
                {formatCurrency(proposta.totalCentimos)}
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="text-xs text-neutral-400 space-y-2 border-t border-neutral-800 pt-6">
            <h4 className="font-semibold text-neutral-300 uppercase tracking-wider">
              Condições Aplicáveis
            </h4>
            <p className="leading-relaxed">{proposta.condicoes}</p>
          </div>

          {/* Institutional Contact & Next Steps */}
          <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{proposta.negocio.nome}</h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {proposta.negocio.entidade} · Contacto: {proposta.negocio.contacto}
                </p>
              </div>
            </div>

            <a
              href={proposta.negocio.agendamento}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-95 shrink-0"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Agendar com a Equipa</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer info note */}
        <p className="text-center text-xs text-neutral-500">
          Esta proposta foi gerada especificamente para o cliente que a solicitou. O acesso a este documento faz-se exclusivamente através desta ligação segura e não está indexado em motores de busca.
        </p>
      </div>
    </div>
  );
};
