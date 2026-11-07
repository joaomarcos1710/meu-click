import React, { useState } from 'react';
import { Camera, Sparkles, QrCode, Upload, Users, Crown, ArrowRight, Check, MessageCircle, ShieldCheck, Zap, Download, Eye, Smartphone, Calendar, MapPin } from 'lucide-react';
import type { EventItem, AppUser } from '../types.js';

interface LandingPageProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onOpenCreateEvent: () => void;
  onNavigateToView: (view: 'guest' | 'photographer' | 'owner' | 'plans') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  events,
  onSelectEvent,
  onOpenCreateEvent,
  onNavigateToView,
}) => {
  const [eventCodeInput, setEventCodeInput] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  const handleAccessByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventCodeInput.trim()) {
      setCodeError('Digite um código de evento.');
      return;
    }

    const cleaned = eventCodeInput.trim().toUpperCase();
    const found = events.find((ev) => ev.code.toUpperCase() === cleaned || ev.id.toUpperCase() === cleaned);
    if (found) {
      onSelectEvent(found);
      onNavigateToView('guest');
    } else {
      setCodeError('Código não encontrado. Tente ANA-PEDRO-2026 ou FORMATURA-TECH-2026.');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. Hero Section (Split-Screen with Avant-Garde Typography & Interactive Preview) */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Typographic Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-600 dark:text-blue-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Reconhecimento Facial por Selfie com Gemini Vision</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                As fotos do seu evento organizadas com <span className="text-blue-600">uma simples selfie</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Chega de fotos perdidas em grupos de WhatsApp ou links esquecidos. Com o MeuClick, anfitriões e fotógrafos reúnem todos os cliques, e cada participante encontra suas fotos em segundos tirando uma selfie pelo navegador — sem baixar aplicativo.
              </p>

              {/* Event Code Quick Finder Bar */}
              <div className="pt-2 max-w-lg">
                <form onSubmit={handleAccessByCode} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Código do Evento (ex: ANA-PEDRO-2026)"
                      value={eventCodeInput}
                      onChange={(e) => {
                        setEventCodeInput(e.target.value.toUpperCase());
                        setCodeError(null);
                      }}
                      className="w-full px-4 py-3 text-xs sm:text-sm font-mono font-bold uppercase bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="min-h-[46px] px-6 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    <span>Acessar Fotos</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {codeError && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 font-medium">
                    {codeError}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Ou experimente o evento demo:</span>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectEvent(events[0]);
                      onNavigateToView('guest');
                    }}
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    Casamento Ana & Pedro
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenCreateEvent}
                  className="min-h-[48px] px-6 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Criar Meu Evento Grátis</span>
                </button>

                <button
                  onClick={() => onNavigateToView('photographer')}
                  className="min-h-[48px] px-5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm rounded-2xl transition-all"
                >
                  Sou Fotógrafo Profissional
                </button>
              </div>

              {/* Social Proof Trust Points (Unboxed metadata with separators per §1.A) */}
              <div className="pt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500" /> Sem download de app
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500" /> QR Code para mesas
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500" /> Entrega no WhatsApp
                </span>
              </div>

            </div>

            {/* Right Column: Visual Product Showcase Container */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-sm rounded-3xl p-3 bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-900 shadow-2xl">
                
                {/* Smartphone Mockup */}
                <div className="rounded-[22px] overflow-hidden bg-slate-950 text-white border border-slate-800 shadow-inner">
                  
                  {/* Phone Header */}
                  <div className="px-4 py-3 bg-slate-900 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span className="text-xs font-bold tracking-tight">MeuClick • Ao Vivo</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">IA Gemini Flash</span>
                  </div>

                  {/* Photo Scanner Area */}
                  <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                    <img
                      src="/src/assets/images/guest_wedding_camila_1794014248100.jpg"
                      alt="Selfie de Convidada"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />

                    {/* Animated Laser Scanner */}
                    <div className="absolute inset-0 bg-blue-600/10 flex flex-col justify-between">
                      <div className="w-full h-1 bg-cyan-400 shadow-[0_0_12px_#38bdf8] animate-pulse" />
                      <div className="p-3">
                        <span className="text-[10px] font-bold text-white bg-blue-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 w-fit shadow-lg">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          96% Correspondência Biométrica
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Instant WhatsApp Delivery Action */}
                  <div className="p-4 space-y-3 bg-slate-900/90">
                    <div>
                      <div className="text-xs font-bold text-white truncate">
                        Encontramos 3 fotos suas neste evento!
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Casamento Ana & Pedro • 18 de Outubro
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectEvent(events[0]);
                        onNavigateToView('guest');
                      }}
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Receber Minhas Fotos no WhatsApp</span>
                    </button>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Como Funciona (3 Passos Simples) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Simplicidade do Início ao Fim
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Como o MeuClick Funciona
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Três etapas rápidas para revolucionar a memória fotográfica do seu evento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-extrabold text-lg">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Crie o Evento e Gere o QR Code
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Defina o nome do evento, personalize a marca d'água e imprima plaquinhas de mesa elegantes com o QR Code para espalhar pela festa.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-extrabold text-lg">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Multi-Upload Colaborativo
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              O fotógrafo oficial sobe centenas de fotos em alta definição em lote, e os convidados também enviam fotos tiradas com seus celulares.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-extrabold text-lg">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Selfie com IA & Entrega no WhatsApp
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              O convidado aponta a câmera, tira uma selfie e o Gemini Vision encontra suas fotos. Download livre ou entrega direta no WhatsApp.
            </p>
          </div>

        </div>
      </section>

      {/* 3. Os 3 Perfis do MeuClick (Para Quem É) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            A Experiência Completa
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Feito para Cada Pessoa no Evento
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Donos */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Para os Donos do Evento
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Noivos, debutantes, comissões de formatura e anfitriões corporativos. Nunca mais perca fotos espalhadas. Acompanhe as vendas de fotos HD e receba os pagamentos no PIX.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Plaquinhas de mesa prontas
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Faturamento de fotos em tempo real
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigateToView('owner')}
              className="w-full py-3 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <span>Abrir Página dos Donos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Fotógrafo */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Para Fotógrafos & Estúdios
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Acelere a entrega das fotos profissionais. Faça upload em massa, proteja os arquivos com marca d'água dinâmica e venda fotos em alta definição com facilidade.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Multi-upload rápido em lote
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Marca d'água com live preview
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigateToView('photographer')}
              className="w-full py-3 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <span>Abrir Página do Fotógrafo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Convidados */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Para os Convidados da Festa
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Tire uma selfie e a inteligência artificial encontra todas as fotos em que você aparece no casamento ou na formatura. Sem precisar rolar milhares de fotos!
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Scanner de selfie em tempo real
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Envio direto no WhatsApp
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigateToView('guest')}
              className="w-full py-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <span>Abrir Espaço Convidados</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. Eventos Ativos em Destaque (Demonstração Interativa) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Galeria Interativa
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Eventos Ativos na Plataforma
            </h2>
          </div>
          <button
            onClick={onOpenCreateEvent}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>+ Criar Meu Evento</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              onClick={() => {
                onSelectEvent(ev);
                onNavigateToView('guest');
              }}
              className="group rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={ev.coverUrl}
                  alt={ev.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="inline-block px-2 py-0.5 rounded-md bg-blue-600 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Código: {ev.code}
                  </div>
                  <h3 className="font-bold text-base truncate">{ev.title}</h3>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(ev.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate max-w-[180px]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  Ver Fotos <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Final CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white text-center space-y-6 shadow-2xl border border-slate-800 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Pronto para transformar as fotos do seu evento?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Crie seu evento em menos de 1 minuto, gere o QR Code para os convidados e aproveite o reconhecimento facial inteligente com IA.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenCreateEvent}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Criar Evento Grátis Agora</span>
            </button>
            <button
              onClick={() => onNavigateToView('plans')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm rounded-2xl transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Conhecer o Plano Pro</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
