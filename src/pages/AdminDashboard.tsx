import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import {
  ShieldAlert,
  LogIn,
  LogOut,
  RefreshCw,
  Mail,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Send,
  Eye,
  Filter,
  Check,
  Copy,
  Info,
  Layers,
  FileText,
  Building,
  UserCheck,
  RotateCw,
  Sparkles,
} from 'lucide-react';

interface Pedido {
  id: string;
  nome: string;
  email: string;
  pedidoOriginal: string;
  criadoEm: string;
  atualizadoEm: string;
  estado: 'Recebido' | 'Em análise' | 'Necessita de revisão' | 'Proposta criada' | 'Erro';
  interpretacao?: any;
  informacaoEmFalta?: string[];
  motivoRevisao?: string;
  propostaId?: string;
  erro?: string;
}

interface Proposta {
  id: string;
  numeroProposta: string;
  pedidoId: string;
  criadaEm: string;
  validadeAte: string;
  resumoAmbito: string;
  itens: any[];
  totalCentimos: number;
  condicoes: string;
  token: string;
  linkProposta: string;
  estadoNotificacao: 'Por enviar' | 'Aceite pelo serviço' | 'Falhou' | 'Não configurado';
  notificacaoEmailId?: string;
  notificacaoTentativaEm?: string;
  notificacaoErro?: string;
}

interface CatalogoItem {
  id: string;
  nome: string;
  descricao: string;
  unidade: string;
  precoUnitarioCentimos: number;
  moeda: string;
  ativo: boolean;
  condicoes?: string;
}

interface ConfigStatus {
  firebaseConfigured: boolean;
  projectId: string | null;
  firestoreDatabaseId: string;
  geminiConfigured: boolean;
  geminiModel: string;
  resendConfigured: boolean;
  emailAluno: string;
  adminUidConfigured: boolean;
  adminUid: string | null;
  appBaseUrl: string;
}

export const AdminDashboard: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'pedidos' | 'catalogo' | 'config'>('pedidos');
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [propostas, setPropostas] = useState<Map<string, Proposta>>(new Map());
  const [catalogo, setCatalogo] = useState<CatalogoItem[]>([]);
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);

  const [filterState, setFilterState] = useState<string>('todos');
  const [loadingData, setLoadingData] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Manual Review Proposal Modal State
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolveSelections, setResolveSelections] = useState<{ [itemId: string]: number }>({});
  const [resolveScope, setResolveScope] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  // Catalogue Item Modal State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogoItem | null>(null);
  const [itemForm, setItemForm] = useState({
    id: '',
    nome: '',
    descricao: '',
    unidade: 'mes',
    precoEur: 0,
    condicoes: '',
  });

  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);
  const [copiedUid, setCopiedUid] = useState(false);

  // Track Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch admin data when user is authenticated
  useEffect(() => {
    if (currentUser) {
      loadAllAdminData();
    }
  }, [currentUser]);

  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'x-admin-uid': currentUser?.uid || '',
      'x-admin-email': currentUser?.email || '',
    };
  };

  const loadAllAdminData = async () => {
    if (!currentUser) return;
    setLoadingData(true);
    setActionErrorMsg(null);

    try {
      const headers = getAuthHeaders();

      // 1. Fetch Config Status
      const configRes = await fetch('/api/admin/config-status');
      if (configRes.ok) {
        const configData = await configRes.json();
        setConfigStatus(configData);
      }

      // 2. Fetch Pedidos
      const pedRes = await fetch('/api/admin/pedidos', { headers });
      if (!pedRes.ok) {
        const err = await pedRes.json();
        throw new Error(err.error || 'Falha ao carregar pedidos.');
      }
      const pedData = await pedRes.json();
      setPedidos(pedData.pedidos || []);

      // 3. Fetch Propostas
      const propRes = await fetch('/api/admin/propostas', { headers });
      if (propRes.ok) {
        const propData = await propRes.json();
        const map = new Map<string, Proposta>();
        (propData.propostas || []).forEach((p: Proposta) => {
          map.set(p.id, p);
          if (p.pedidoId) {
            map.set(p.pedidoId, p); // Map also by pedidoId for fast lookups
          }
        });
        setPropostas(map);
      }

      // 4. Fetch Catalogue
      const catRes = await fetch('/api/catalogo');
      if (catRes.ok) {
        const catData = await catRes.json();
        setCatalogo(catData.items || []);
      }
    } catch (err: any) {
      setActionErrorMsg(err.message || 'Erro ao carregar dados administrativos.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      setAuthError(err.message || 'Erro ao autenticar com a conta Google.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setSelectedPedido(null);
    } catch (err: any) {
      console.error('Sign-out error:', err);
    }
  };

  const handleCopyUid = () => {
    if (currentUser?.uid) {
      navigator.clipboard.writeText(currentUser.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2500);
    }
  };

  // Reprocess with AI
  const handleReprocess = async (pedidoId: string) => {
    setActionErrorMsg(null);
    setActionSuccessMsg(null);
    try {
      const res = await fetch(`/api/admin/pedidos/${pedidoId}/reprocessar`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao reprocessar pedido.');

      setActionSuccessMsg('Pedido reprocessado com sucesso através do Gemini.');
      loadAllAdminData();
      if (selectedPedido && selectedPedido.id === pedidoId) {
        setSelectedPedido(data.pedido);
      }
    } catch (err: any) {
      setActionErrorMsg(err.message);
    }
  };

  // Resend notification to student
  const handleResendNotification = async (propostaId: string) => {
    setActionErrorMsg(null);
    setActionSuccessMsg(null);
    try {
      const res = await fetch(`/api/admin/propostas/${propostaId}/reenviar-notificacao`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao reenviar notificação.');

      setActionSuccessMsg('Tentativa de envio de notificação processada.');
      loadAllAdminData();
    } catch (err: any) {
      setActionErrorMsg(err.message);
    }
  };

  // Open manual proposal creation modal
  const openResolveModal = (ped: Pedido) => {
    setSelectedPedido(ped);
    const initialCounts: { [itemId: string]: number } = {};
    catalogo.forEach((c) => {
      initialCounts[c.id] = 0;
    });

    // Pre-fill from Gemini items if any
    if (ped.interpretacao?.itens && Array.isArray(ped.interpretacao.itens)) {
      ped.interpretacao.itens.forEach((it: any) => {
        if (it.catalogoId) {
          initialCounts[it.catalogoId] = Math.max(1, parseInt(it.quantidade, 10) || 1);
        }
      });
    }

    setResolveSelections(initialCounts);
    setResolveScope(ped.interpretacao?.resumo || `Proposta comercial para ${ped.nome}`);
    setIsResolveModalOpen(true);
  };

  // Submit manual proposal resolution
  const submitResolveProposal = async () => {
    if (!selectedPedido) return;
    setIsResolving(true);
    setActionErrorMsg(null);

    const selectedItens = Object.entries(resolveSelections)
      .filter(([_, qty]) => qty > 0)
      .map(([catalogoId, quantidade]) => ({
        catalogoId,
        quantidade,
        evidencia: 'Selecionado manualmente pelo administrador',
      }));

    if (selectedItens.length === 0) {
      setActionErrorMsg('Deve selecionar pelo menos um produto ou serviço com quantidade maior que zero.');
      setIsResolving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/pedidos/${selectedPedido.id}/criar-proposta`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          selectedItens,
          resumoAmbito: resolveScope,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar proposta manual.');

      setActionSuccessMsg('Proposta calculada e aprovada com sucesso!');
      setIsResolveModalOpen(false);
      loadAllAdminData();
    } catch (err: any) {
      setActionErrorMsg(err.message);
    } finally {
      setIsResolving(false);
    }
  };

  // Catalogue Item Creation & Editing
  const openNewItemModal = () => {
    setEditingItem(null);
    setItemForm({
      id: '',
      nome: '',
      descricao: '',
      unidade: 'mes',
      precoEur: 0,
      condicoes: '',
    });
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item: CatalogoItem) => {
    setEditingItem(item);
    setItemForm({
      id: item.id,
      nome: item.nome,
      descricao: item.descricao,
      unidade: item.unidade,
      precoEur: item.precoUnitarioCentimos / 100,
      condicoes: item.condicoes || '',
    });
    setIsItemModalOpen(true);
  };

  const saveCatalogueItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionErrorMsg(null);

    const precoUnitarioCentimos = Math.round(itemForm.precoEur * 100);

    try {
      if (editingItem) {
        // Update
        const res = await fetch(`/api/admin/catalogo/${editingItem.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            nome: itemForm.nome,
            descricao: itemForm.descricao,
            unidade: itemForm.unidade,
            precoUnitarioCentimos,
            condicoes: itemForm.condicoes,
          }),
        });
        if (!res.ok) throw new Error('Erro ao atualizar item no catálogo.');
      } else {
        // Create
        const res = await fetch('/api/admin/catalogo', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            id: itemForm.id,
            nome: itemForm.nome,
            descricao: itemForm.descricao,
            unidade: itemForm.unidade,
            precoUnitarioCentimos,
            condicoes: itemForm.condicoes,
          }),
        });
        if (!res.ok) throw new Error('Erro ao criar item no catálogo.');
      }

      setActionSuccessMsg('Catálogo atualizado com sucesso.');
      setIsItemModalOpen(false);
      loadAllAdminData();
    } catch (err: any) {
      setActionErrorMsg(err.message);
    }
  };

  const toggleItemActive = async (item: CatalogoItem) => {
    try {
      const res = await fetch(`/api/admin/catalogo/${item.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ativo: !item.ativo }),
      });
      if (res.ok) {
        loadAllAdminData();
      }
    } catch (err: any) {
      setActionErrorMsg(err.message);
    }
  };

  // Filtered pedidos
  const filteredPedidos = pedidos.filter((p) => {
    if (filterState === 'todos') return true;
    return p.estado === filterState;
  });

  const formatCurrency = (centimos: number) => {
    return (centimos / 100).toLocaleString('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    });
  };

  // Helper to ensure public link uses public origin (replacing ais-dev with ais-pre) so no login is demanded
  const getPublicLink = (token: string, fallbackLink?: string) => {
    if (typeof window !== 'undefined' && token) {
      const origin = window.location.origin.replace('ais-dev-', 'ais-pre-');
      return `${origin}/proposta/${token}`;
    }
    if (fallbackLink) {
      return fallbackLink.replace('ais-dev-', 'ais-pre-');
    }
    return `/proposta/${token}`;
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      return new Date(isoString).toLocaleString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  // Helper for status badge
  const renderEstadoBadge = (estado: Pedido['estado']) => {
    switch (estado) {
      case 'Proposta criada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Proposta criada</span>
          </span>
        );
      case 'Necessita de revisão':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-3 h-3" />
            <span>Necessita de revisão</span>
          </span>
        );
      case 'Em análise':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <RotateCw className="w-3 h-3 animate-spin" />
            <span>Em análise</span>
          </span>
        );
      case 'Erro':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <ShieldAlert className="w-3 h-3" />
            <span>Erro</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">
            <Clock className="w-3 h-3" />
            <span>Recebido</span>
          </span>
        );
    }
  };

  // Helper for notification badge
  const renderNotificacaoBadge = (estadoNotificacao?: Proposta['estadoNotificacao']) => {
    if (!estadoNotificacao) {
      return <span className="text-xs text-neutral-500">-</span>;
    }
    switch (estadoNotificacao) {
      case 'Aceite pelo serviço':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Check className="w-3 h-3" />
            <span>Aceite pelo serviço</span>
          </span>
        );
      case 'Falhou':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
            <AlertCircle className="w-3 h-3" />
            <span>Falhou</span>
          </span>
        );
      case 'Não configurado':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-800 text-neutral-400 border border-neutral-700">
            <span>Não configurado</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-400">
            <span>Por enviar</span>
          </span>
        );
    }
  };

  // Not Logged In View
  if (!currentUser && !authLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
        <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-neutral-900 border border-neutral-800 text-center space-y-6 shadow-2xl relative">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 mx-auto flex items-center justify-center">
            <Building className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-bold font-display text-white">Área de Administração</h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
              Inicie sessão com a sua conta Google para gerir pedidos de proposta, catálogo e notificações internas do sistema.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-left">
              {authError}
            </div>
          )}

          <div className="pt-2 space-y-3">
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Entrar com Google</span>
            </button>

            <Link
              to="/"
              className="inline-block text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              Voltar à Landing Page
            </Link>
          </div>

          <p className="text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-800 pt-4">
            Acesso reservado ao utilizador autorizado correspondente a <strong>ADMIN_UID</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-blue-600 selection:text-white">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 border-b border-neutral-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="text-xl font-black font-display tracking-tight text-white">Rolute</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Admin
              </span>
            </Link>

            {/* Tab switchers */}
            <nav className="hidden sm:flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
              <button
                onClick={() => setActiveTab('pedidos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'pedidos' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Pedidos & Propostas ({pedidos.length})
              </button>
              <button
                onClick={() => setActiveTab('catalogo')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'catalogo' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Catálogo ({catalogo.length})
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'config' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Diagnóstico & Guia
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllAdminData}
              disabled={loadingData}
              title="Atualizar dados"
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin text-blue-400' : ''}`} />
            </button>

            {currentUser && (
              <div className="flex items-center gap-3 pl-2 border-l border-neutral-800">
                <div className="hidden md:block text-right">
                  <div className="text-xs font-bold text-white truncate max-w-[150px]">
                    {currentUser.displayName || currentUser.email}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400">UID: {currentUser.uid.slice(0, 8)}...</div>
                </div>

                <button
                  onClick={handleSignOut}
                  title="Terminar Sessão"
                  className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-red-400 border border-neutral-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Classroom Notice Ribbon */}
      <div className="bg-blue-600/10 border-b border-blue-500/20 px-4 py-2 text-center text-xs text-blue-300 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span>
          <strong>Modo de aula:</strong> As notificações são enviadas exclusivamente para o email do aluno ({configStatus?.emailAluno || 'tomrbessa@gmail.com'}). Os clientes não recebem emails.
        </span>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Messages */}
        {actionSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-400 hover:text-white text-xs">
              ✕
            </button>
          </div>
        )}

        {actionErrorMsg && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{actionErrorMsg}</span>
            </div>
            <button onClick={() => setActionErrorMsg(null)} className="text-red-400 hover:text-white text-xs">
              ✕
            </button>
          </div>
        )}

        {/* TAB 1: PEDIDOS & PROPOSTAS */}
        {activeTab === 'pedidos' && (
          <div className="space-y-6">
            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5 mr-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filtrar por estado:</span>
                </span>
                {['todos', 'Recebido', 'Em análise', 'Necessita de revisão', 'Proposta criada', 'Erro'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterState(st)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${
                      filterState === st
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="text-xs text-neutral-400">
                A mostrar {filteredPedidos.length} de {pedidos.length} pedidos
              </div>
            </div>

            {/* Pedidos Table */}
            <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 text-xs font-semibold">
                      <th className="py-3.5 px-4">Data</th>
                      <th className="py-3.5 px-4">Cliente</th>
                      <th className="py-3.5 px-4">Resumo do Pedido</th>
                      <th className="py-3.5 px-4 text-center">Estado do Pedido</th>
                      <th className="py-3.5 px-4 text-right">Valor Proposta</th>
                      <th className="py-3.5 px-4 text-center">Notificação ao Aluno</th>
                      <th className="py-3.5 px-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {filteredPedidos.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-neutral-500">
                          Nenhum pedido encontrado para o filtro selecionado. Submeta um pedido na Landing Page para testar!
                        </td>
                      </tr>
                    ) : (
                      filteredPedidos.map((ped) => {
                        const prop = propostas.get(ped.propostaId || '') || propostas.get(ped.id);
                        return (
                          <tr key={ped.id} className="hover:bg-neutral-800/30 transition-colors">
                            <td className="py-4 px-4 text-neutral-400 whitespace-nowrap text-xs font-mono">
                              {formatDate(ped.criadoEm)}
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-semibold text-white">{ped.nome}</div>
                              <div className="text-xs text-neutral-400">{ped.email}</div>
                            </td>
                            <td className="py-4 px-4 max-w-xs">
                              <p className="text-xs text-neutral-300 line-clamp-2">
                                {ped.interpretacao?.resumo || ped.pedidoOriginal}
                              </p>
                            </td>
                            <td className="py-4 px-4 text-center whitespace-nowrap">
                              {renderEstadoBadge(ped.estado)}
                            </td>
                            <td className="py-4 px-4 text-right font-mono font-semibold text-white whitespace-nowrap">
                              {prop ? formatCurrency(prop.totalCentimos) : '-'}
                            </td>
                            <td className="py-4 px-4 text-center whitespace-nowrap">
                              {prop ? renderNotificacaoBadge(prop.estadoNotificacao) : <span className="text-xs text-neutral-500">-</span>}
                            </td>
                            <td className="py-4 px-4 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => setSelectedPedido(ped)}
                                  title="Ver Detalhes do Pedido"
                                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                {ped.estado === 'Necessita de revisão' && (
                                  <button
                                    onClick={() => openResolveModal(ped)}
                                    title="Resolver Pedido e Gerar Proposta"
                                    className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs flex items-center gap-1 transition-colors"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Resolver</span>
                                  </button>
                                )}

                                {prop && (
                                  <a
                                    href={getPublicLink(prop.token, prop.linkProposta)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Abrir Proposta (Pública & Anónima)"
                                    className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Pedido Details Drawer / Card */}
            {selectedPedido && (
              <div className="rounded-3xl p-6 sm:p-8 bg-neutral-900 border border-neutral-800 space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                  <div>
                    <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span>Detalhe do Pedido: {selectedPedido.nome}</span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Email do cliente: <span className="text-neutral-200 font-mono">{selectedPedido.email}</span> · Submetido a {formatDate(selectedPedido.criadoEm)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReprocess(selectedPedido.id)}
                      className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Repetir Processamento IA</span>
                    </button>

                    <button
                      onClick={() => setSelectedPedido(null)}
                      className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-xs font-semibold"
                    >
                      Fechar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Original Customer Text */}
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-2">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      Texto Original do Pedido
                    </span>
                    <p className="text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">
                      {selectedPedido.pedidoOriginal}
                    </p>
                  </div>

                  {/* AI Structured Interpretation */}
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-3">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Interpretação Estruturada (Gemini)</span>
                    </span>

                    {selectedPedido.interpretacao ? (
                      <div className="text-xs space-y-3">
                        <div>
                          <strong className="text-neutral-400">Resumo:</strong>{' '}
                          <span className="text-neutral-200">{selectedPedido.interpretacao.resumo}</span>
                        </div>

                        {selectedPedido.interpretacao.prazoPedido && (
                          <div>
                            <strong className="text-neutral-400">Prazo Solicitado:</strong>{' '}
                            <span className="text-neutral-200">{selectedPedido.interpretacao.prazoPedido}</span>
                          </div>
                        )}

                        <div>
                          <strong className="text-neutral-400">Itens Identificados no Catálogo:</strong>
                          <ul className="mt-1 space-y-1.5 pl-2">
                            {selectedPedido.interpretacao.itens?.map((it: any, idx: number) => (
                              <li key={idx} className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px]">
                                <span className="font-semibold text-white">{it.catalogoId}</span> · Quantidade: <span className="font-bold text-blue-400">{it.quantidade ?? 'não especificada'}</span>
                                {it.evidencia && (
                                  <div className="text-neutral-400 italic mt-0.5">
                                    &ldquo;{it.evidencia}&rdquo;
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {selectedPedido.motivoRevisao && (
                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                            <strong>Motivo de Revisão:</strong> {selectedPedido.motivoRevisao}
                          </div>
                        )}

                        {selectedPedido.informacaoEmFalta && selectedPedido.informacaoEmFalta.length > 0 && (
                          <div>
                            <strong className="text-neutral-400">Informação em Falta:</strong>
                            <ul className="list-disc list-inside text-neutral-300 mt-1 space-y-0.5">
                              {selectedPedido.informacaoEmFalta.map((info, i) => (
                                <li key={i}>{info}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-500 italic">
                        {selectedPedido.erro || 'Ainda sem interpretação estruturada disponível.'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Proposal Linked Info */}
                {(() => {
                  const prop = propostas.get(selectedPedido.propostaId || '') || propostas.get(selectedPedido.id);
                  if (!prop) {
                    return (
                      selectedPedido.estado === 'Necessita de revisão' && (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => openResolveModal(selectedPedido)}
                            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Resolver Pedido e Emitir Proposta</span>
                          </button>
                        </div>
                      )
                    );
                  }

                  return (
                    <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                        <div>
                          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                            Proposta Emitida: {prop.numeroProposta}
                          </span>
                          <div className="text-sm font-semibold text-white mt-0.5">
                            Total: <span className="text-blue-400">{formatCurrency(prop.totalCentimos)}</span> sem IVA
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={getPublicLink(prop.token, prop.linkProposta)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <span>Abrir Página Pública</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => {
                              const pubUrl = getPublicLink(prop.token, prop.linkProposta);
                              navigator.clipboard.writeText(pubUrl);
                              setCopiedToken(prop.token);
                              setTimeout(() => setCopiedToken(null), 2500);
                            }}
                            className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                            title="Copiar Link Público da Proposta (sem necessidade de login)"
                          >
                            {copiedToken === prop.token ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar Link</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleResendNotification(prop.id)}
                            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Reenviar Notificação</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400">
                        <div>
                          <strong>Estado da Notificação:</strong> {renderNotificacaoBadge(prop.estadoNotificacao)}
                        </div>
                        {prop.notificacaoEmailId && (
                          <div>
                            <strong>ID Resend:</strong> <span className="font-mono text-neutral-300">{prop.notificacaoEmailId}</span>
                          </div>
                        )}
                        <div>
                          <strong>Última tentativa:</strong> {formatDate(prop.notificacaoTentativaEm)}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CATÁLOGO */}
        {activeTab === 'catalogo' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-display text-white">Catálogo de Produtos e Serviços</h2>
                <p className="text-xs text-neutral-400">
                  Esta coleção é a Knowledge Base comercial e fonte de verdade para os preços calculados pela aplicação.
                </p>
              </div>

              <button
                onClick={openNewItemModal}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Produto / Serviço</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {catalogo.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    item.ativo
                      ? 'bg-neutral-900/90 border-neutral-800 text-neutral-200'
                      : 'bg-neutral-900/40 border-neutral-800/40 opacity-60 text-neutral-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {item.id}
                    </span>
                    <button
                      onClick={() => toggleItemActive(item)}
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors ${
                        item.ativo
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'
                      }`}
                    >
                      {item.ativo ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-white font-display mb-1">{item.nome}</h3>
                  <p className="text-xs text-neutral-400 mb-4 line-clamp-2 leading-relaxed">{item.descricao}</p>

                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-neutral-500">Preço / {item.unidade}</div>
                      <div className="text-base font-bold font-mono text-white">
                        {formatCurrency(item.precoUnitarioCentimos)}
                      </div>
                    </div>

                    <button
                      onClick={() => openEditItemModal(item)}
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                      title="Editar Item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CONFIGURAÇÃO & GUIA DE AULA */}
        {activeTab === 'config' && (
          <div className="space-y-8 max-w-4xl">
            {/* Status Checklist Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl">
              <h2 className="text-xl font-bold font-display text-white flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span>Estado da Configuração do Sistema</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Firebase */}
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-300">Firebase Firestore</span>
                    <span className="text-emerald-400 font-bold">Ativo & Conectado</span>
                  </div>
                  <p className="text-neutral-500">
                    Projeto: {configStatus?.projectId} · Base de dados: {configStatus?.firestoreDatabaseId}
                  </p>
                </div>

                {/* Gemini */}
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-300">Gemini AI</span>
                    <span className={configStatus?.geminiConfigured ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {configStatus?.geminiConfigured ? 'Ativo' : 'Não configurado'}
                    </span>
                  </div>
                  <p className="text-neutral-500">Modelo: {configStatus?.geminiModel || 'gemini-2.5-flash'}</p>
                </div>

                {/* Resend */}
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-300">Resend (Notificações)</span>
                    <span className={configStatus?.resendConfigured ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {configStatus?.resendConfigured ? 'Ativo' : 'Por configurar'}
                    </span>
                  </div>
                  <p className="text-neutral-500">
                    Destinatário exclusivo: <strong>{configStatus?.emailAluno}</strong>
                  </p>
                </div>

                {/* Admin UID */}
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-300">ADMIN_UID</span>
                    <span className={configStatus?.adminUidConfigured ? 'text-emerald-400 font-bold' : 'text-sky-400 font-bold'}>
                      {configStatus?.adminUidConfigured ? 'Configurado' : 'Sessão Ativa'}
                    </span>
                  </div>
                  <p className="text-neutral-500 font-mono truncate">
                    {currentUser?.uid || 'Aguardando login'}
                  </p>
                </div>
              </div>

              {/* UID Copier for Student */}
              {currentUser && (
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-white">O seu UID de Administrador:</span>
                    <div className="font-mono text-blue-300 break-all mt-0.5">{currentUser.uid}</div>
                  </div>

                  <button
                    onClick={handleCopyUid}
                    className="shrink-0 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedUid ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUid ? 'Copiado!' : 'Copiar UID'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Step by step Student Instructions */}
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-5 text-xs sm:text-sm text-neutral-300 leading-relaxed shadow-xl">
              <h3 className="text-lg font-bold font-display text-white">Guia Passo-a-Passo para o Aluno</h3>

              <ol className="space-y-4 list-decimal list-inside pl-2">
                <li>
                  <strong className="text-white">Autenticação Google e ADMIN_UID:</strong>
                  <p className="text-xs text-neutral-400 mt-1 pl-4">
                    Iniciou sessão com <strong>{currentUser?.email}</strong>. Para fixar a permissão em produção, adicione a variável <code>ADMIN_UID="{currentUser?.uid}"</code> no painel de Secrets.
                  </p>
                </li>

                <li>
                  <strong className="text-white">Configurar Notificações Resend:</strong>
                  <p className="text-xs text-neutral-400 mt-1 pl-4">
                    1. Crie uma conta gratuita em <a href="https://resend.com" target="_blank" rel="noopener" className="text-blue-400 underline">resend.com</a> com o email onde pretende receber as notificações (ex: <code>{configStatus?.emailAluno}</code>).<br />
                    2. Crie uma API Key no Resend e guarde-a no painel de Secrets com o nome <code>RESEND_API_KEY</code>.<br />
                    3. Confirme que <code>EMAIL_ALUNO</code> corresponde ao email dessa mesma conta Resend. O remetente fixo é <code>onboarding@resend.dev</code> (sem necessidade de domínio próprio!).
                  </p>
                </li>

                <li>
                  <strong className="text-white">API Gemini:</strong>
                  <p className="text-xs text-neutral-400 mt-1 pl-4">
                    A chave <code>GEMINI_API_KEY</code> já é injetada automaticamente pelo Google AI Studio no backend. O modelo utilizado é <code>gemini-2.5-flash</code> com structured outputs em JSON.
                  </p>
                </li>

                <li>
                  <strong className="text-white">Testar o Fluxo Completo:</strong>
                  <p className="text-xs text-neutral-400 mt-1 pl-4">
                    1. Vá à Landing Page e preencha os 3 campos do formulário (Nome, Email, Pedido).<br />
                    2. O backend valida, guarda no Firestore, consulta o catálogo, o Gemini interpreta, o código calcula e emite a proposta.<br />
                    3. Recebe a notificação no seu email do Resend com o link individual <code>/proposta/[token]</code>.<br />
                    4. Na administração, pode consultar o estado, detalhes da IA, reprocessar ou resolver pedidos que necessitem de revisão manual.
                  </p>
                </li>
              </ol>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: Resolver Pedido em Revisão */}
      {isResolveModalOpen && selectedPedido && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-xl font-bold font-display text-white">Resolver Pedido e Gerar Proposta</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Cliente: <strong>{selectedPedido.nome}</strong> ({selectedPedido.email})
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
              <strong className="text-neutral-400">Pedido Original:</strong>
              <p className="text-neutral-200 mt-1 italic">&ldquo;{selectedPedido.pedidoOriginal}&rdquo;</p>
            </div>

            {/* Scope input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-300">Resumo do Âmbito da Proposta</label>
              <input
                type="text"
                value={resolveScope}
                onChange={(e) => setResolveScope(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Item selector with quantities */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-300">
                Selecione os Produtos / Serviços e Quantidades do Catálogo
              </label>

              <div className="space-y-2.5">
                {catalogo.filter((c) => c.ativo).map((item) => {
                  const qty = resolveSelections[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-white">{item.nome}</div>
                        <div className="text-[11px] text-neutral-400">
                          {formatCurrency(item.precoUnitarioCentimos)} / {item.unidade}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-neutral-400">Qtd:</span>
                        <input
                          type="number"
                          min="0"
                          max="1000"
                          value={qty}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            setResolveSelections((prev) => ({ ...prev, [item.id]: val }));
                          }}
                          className="w-16 px-2 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-center font-bold text-white text-xs"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                onClick={() => setIsResolveModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
              >
                Cancelar
              </button>

              <button
                onClick={submitResolveProposal}
                disabled={isResolving}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {isResolving ? (
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>Aprovar e Emitir Proposta</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Novo / Editar Item do Catálogo */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-2xl">
            <div>
              <h3 className="text-xl font-bold font-display text-white">
                {editingItem ? 'Editar Item do Catálogo' : 'Novo Produto / Serviço'}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Configure os detalhes e preço unitário que serão utilizados no cálculo das propostas.
              </p>
            </div>

            <form onSubmit={saveCatalogueItem} className="space-y-4 text-xs">
              {!editingItem && (
                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-300">Identificador Único (ID)</label>
                  <input
                    type="text"
                    required
                    value={itemForm.id}
                    onChange={(e) => setItemForm({ ...itemForm, id: e.target.value })}
                    placeholder="ex: modulo-consultoria"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block font-semibold text-neutral-300">Nome</label>
                <input
                  type="text"
                  required
                  value={itemForm.nome}
                  onChange={(e) => setItemForm({ ...itemForm, nome: e.target.value })}
                  placeholder="ex: Plano Rolute Metal"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-neutral-300">Descrição</label>
                <textarea
                  rows={2}
                  value={itemForm.descricao}
                  onChange={(e) => setItemForm({ ...itemForm, descricao: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-300">Unidade de Venda</label>
                  <select
                    value={itemForm.unidade}
                    onChange={(e) => setItemForm({ ...itemForm, unidade: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  >
                    <option value="mes">Mês</option>
                    <option value="unidade">Unidade</option>
                    <option value="hora">Hora</option>
                    <option value="pacote">Pacote</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-300">Preço (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={itemForm.precoEur}
                    onChange={(e) => setItemForm({ ...itemForm, precoEur: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-neutral-300">Condições / Âmbito (Opcional)</label>
                <input
                  type="text"
                  value={itemForm.condicoes}
                  onChange={(e) => setItemForm({ ...itemForm, condicoes: e.target.value })}
                  placeholder="ex: Faturação mensal sem fidelização"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md cursor-pointer"
                >
                  Guardar Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
