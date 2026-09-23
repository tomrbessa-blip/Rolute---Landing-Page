import React, { useState } from 'react';
import { X, QrCode, Smartphone, CheckCircle, Apple, Play } from 'lucide-react';
import { Language } from '../types';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose, lang }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  };

  const isPt = lang === 'pt';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 tracking-wider uppercase mb-2">
              <Smartphone className="w-4 h-4" />
              <span>{isPt ? 'Instalação Imediata' : 'Instant Setup'}</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {isPt ? 'Transferir a app Rolute' : 'Download the Rolute App'}
            </h3>
            <p className="text-sm text-neutral-400 mt-1">
              {isPt
                ? 'Digitalize o código QR ou receba a ligação por SMS para criar conta em menos de 3 minutos.'
                : 'Scan the QR code or get an SMS link to set up your account in under 3 minutes.'}
            </p>
          </div>

          {/* QR Code and phone preview grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-neutral-950 p-4 rounded-2xl border border-neutral-800/80">
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-inner">
              {/* Dynamic QR Code representation */}
              <div className="relative w-36 h-36 flex items-center justify-center bg-white p-2">
                <svg className="w-full h-full text-neutral-950" viewBox="0 0 100 100" fill="currentColor">
                  {/* Outer corner 1 */}
                  <rect x="0" y="0" width="28" height="28" rx="4" />
                  <rect x="4" y="4" width="20" height="20" fill="white" rx="2" />
                  <rect x="8" y="8" width="12" height="12" fill="currentColor" rx="1" />
                  {/* Outer corner 2 */}
                  <rect x="72" y="0" width="28" height="28" rx="4" />
                  <rect x="76" y="4" width="20" height="20" fill="white" rx="2" />
                  <rect x="80" y="8" width="12" height="12" fill="currentColor" rx="1" />
                  {/* Outer corner 3 */}
                  <rect x="0" y="72" width="28" height="28" rx="4" />
                  <rect x="4" y="76" width="20" height="20" fill="white" rx="2" />
                  <rect x="8" y="80" width="12" height="12" fill="currentColor" rx="1" />
                  {/* Data matrix dots */}
                  <circle cx="45" cy="15" r="3" />
                  <circle cx="55" cy="20" r="3" />
                  <circle cx="40" cy="45" r="4" />
                  <circle cx="60" cy="45" r="4" />
                  <circle cx="50" cy="60" r="4" />
                  <circle cx="85" cy="55" r="3" />
                  <circle cx="80" cy="85" r="4" />
                  <circle cx="45" cy="85" r="3" />
                  <circle cx="65" cy="75" r="3" />
                  <rect x="44" y="32" width="12" height="12" rx="2" fill="currentColor" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-md border-2 border-white">
                    R
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-medium text-neutral-600 mt-2 text-center flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-neutral-500" />
                {isPt ? 'Aponte a câmara do telemóvel' : 'Point your phone camera'}
              </span>
            </div>

            <div className="space-y-3 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{isPt ? 'Registo 100% gratuito sem compromisso' : '100% free signup, no commitment'}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{isPt ? 'Cartão virtual imediato na Apple/Google Wallet' : 'Instant virtual card on Apple/Google Wallet'}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{isPt ? 'Garantia de depósitos até 100.000 €' : 'Deposit guarantee up to €100,000'}</span>
              </div>
            </div>
          </div>

          {/* SMS Link Form */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">
              {isPt ? 'Ou receba a ligação direta por SMS' : 'Or get direct link via SMS'}
            </label>
            {sent ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isPt
                    ? 'Ligação enviada com sucesso! Verifique as mensagens no seu telemóvel.'
                    : 'Link sent! Check your SMS messages to download.'}
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-mono">
                    +351
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="912 345 678"
                    className="w-full pl-14 pr-3 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {loading ? (isPt ? 'A enviar...' : 'Sending...') : (isPt ? 'Enviar link' : 'Send link')}
                </button>
              </form>
            )}
          </div>

          {/* Direct Store Buttons */}
          <div className="pt-2 border-t border-neutral-800 flex flex-col sm:flex-row gap-2">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-white text-xs font-medium transition-colors"
            >
              <Apple className="w-4 h-4 fill-white" />
              <span>App Store</span>
            </a>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-white text-xs font-medium transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Google Play</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
