import React from 'react';
import { Sparkles, Check, X, ShieldCheck, Zap, MessageCircle } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: 'free' | 'pro') => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Planos MeuClick
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Escolha a experiência ideal para seu evento e acelere a entrega de fotos
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Plan 1: Grátis / Básico */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between bg-slate-50/50 dark:bg-slate-800/30">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Básico
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">R$ 0</span>
                <span className="text-xs text-slate-500">/ evento</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Ideal para festas pequenas e encontros familiares com organização manual.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Organização manual por pastas e momentos</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Multi-upload para organizador e convidados</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Link e QR Code compartilhável do evento</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Visualização com marca d'água</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-400 line-through">
                  <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Reconhecimento facial com IA (Selfie)</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-400 line-through">
                  <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Venda e monetização de fotos HD</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectPlan('free');
                onClose();
              }}
              className="mt-8 w-full py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-all"
            >
              Usar Plano Grátis
            </button>
          </div>

          {/* Plan 2: Pro (IA Facial) */}
          <div className="relative rounded-2xl border-2 border-blue-600 dark:border-blue-500 p-6 flex flex-col justify-between bg-blue-50/20 dark:bg-blue-950/20 shadow-xl shadow-blue-500/5">
            <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              Recomendado
            </div>

            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Pro • Com IA Facial
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">R$ 49</span>
                <span className="text-xs text-slate-500">/ evento</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Para fotógrafos, noivos, formaturas e grandes eventos que exigem velocidade.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-slate-900 dark:text-white font-medium">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Reconhecimento facial com selfie</strong> (Gemini 3.8 Flash Vision)</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Entrega automatizada prioritária via WhatsApp</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Venda de fotos em alta resolução integrada (PIX)</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Uploads ilimitados de alta resolução</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Plaquinhas de mesa e QR Code prontos para impressão</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Suporte prioritário ao vivo</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectPlan('pro');
                onClose();
              }}
              className="mt-8 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Ativar Plano Pro com IA</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
