import React from 'react';
import { Calendar, MapPin, Sparkles, Upload, QrCode, Camera, ShieldCheck, ChevronDown, Check } from 'lucide-react';
import type { EventItem } from '../types.js';

interface EventHeroProps {
  currentEvent: EventItem;
  allEvents: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onOpenSelfieModal: () => void;
  onOpenUploadModal: () => void;
  onOpenQRModal: () => void;
}

export const EventHero: React.FC<EventHeroProps> = ({
  currentEvent,
  allEvents,
  onSelectEvent,
  onOpenSelfieModal,
  onOpenUploadModal,
  onOpenQRModal,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <div className="relative border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Typographic Details & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Event Selector / Switcher */}
            <div className="relative inline-block mb-3">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors py-1 focus:outline-none"
              >
                <span>Evento Atual: {currentEvent.code}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-30">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Alternar Evento
                  </div>
                  {allEvents.map((ev) => (
                    <button
                      key={ev.id}
                      onClick={() => {
                        onSelectEvent(ev);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center justify-between transition-colors text-slate-800 dark:text-slate-200"
                    >
                      <div className="truncate pr-2">
                        <div className="font-semibold truncate">{ev.title}</div>
                        <div className="text-[11px] text-slate-400">{ev.date} · {ev.photos?.length || 0} fotos</div>
                      </div>
                      {ev.id === currentEvent.id && (
                        <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              {currentEvent.title}
            </h1>

            {/* Unboxed Metadata with Typographic Separators */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {new Date(currentEvent.date).toLocaleDateString('pt-BR', { dateStyle: 'long' })}
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {currentEvent.location}
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span>{currentEvent.photos?.length || 0} fotos disponíveis</span>
            </div>

            {/* Value Proposition Note */}
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Encontre apenas as fotos em que você aparece tirando uma simples selfie com nossa IA de reconhecimento facial, ou navegue pelas pastas dos momentos da festa.
            </p>

            {/* Action Bar (Mobile-first Thumb Zone Hitbox >= 44px) */}
            <div className="flex flex-wrap items-center gap-3 mt-6 sm:mt-8">
              <button
                onClick={onOpenSelfieModal}
                className="min-h-[44px] px-5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Buscar por Selfie (IA)</span>
              </button>

              <button
                onClick={onOpenUploadModal}
                className="min-h-[44px] px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Enviar Fotos (+ Multi-Upload)</span>
              </button>

              <button
                onClick={onOpenQRModal}
                title="Ver QR Code e link para convidados"
                className="min-h-[44px] px-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-4 h-4" />
                <span className="hidden sm:inline">QR Code</span>
              </button>
            </div>
          </div>

          {/* Right Column: Event Visual Cover */}
          <div className="lg:col-span-5">
            <div className="relative group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 aspect-[16/10] bg-slate-100 dark:bg-slate-800 shadow-sm">
              <img
                src={currentEvent.coverUrl}
                alt={currentEvent.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <div className="font-medium truncate pr-2">
                  <span>Organizado por {currentEvent.organizerName}</span>
                </div>
                <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0">
                  {currentEvent.pricePerPhoto > 0 ? `R$ ${currentEvent.pricePerPhoto.toFixed(2)} / foto HD` : 'Fotos Gratuitas'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
