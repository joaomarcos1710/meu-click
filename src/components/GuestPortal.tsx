import React, { useState } from 'react';
import { Sparkles, Camera, Upload, QrCode, Search, Folder, Download, Eye, ShoppingBag, MessageCircle, Check, ArrowRight, Heart } from 'lucide-react';
import type { EventItem, Photo } from '../types.js';

interface GuestPortalProps {
  event: EventItem;
  allEvents: EventItem[];
  matchedPhotoIds: string[];
  confidenceMap: Record<string, number>;
  purchasedPhotoIds: string[];
  onSelectEvent: (event: EventItem) => void;
  onOpenSelfieModal: () => void;
  onOpenUploadModal: () => void;
  onOpenQRModal: () => void;
  onSelectPhoto: (photo: Photo) => void;
  onOpenCheckout: (photo: Photo) => void;
  onClearFaceFilter: () => void;
}

export const GuestPortal: React.FC<GuestPortalProps> = ({
  event,
  allEvents,
  matchedPhotoIds,
  confidenceMap,
  purchasedPhotoIds,
  onSelectEvent,
  onOpenSelfieModal,
  onOpenUploadModal,
  onOpenQRModal,
  onSelectPhoto,
  onOpenCheckout,
  onClearFaceFilter,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isFaceFiltered = matchedPhotoIds.length > 0;

  // Filter photos
  let displayedPhotos = event.photos || [];

  if (isFaceFiltered) {
    displayedPhotos = displayedPhotos.filter((p) => matchedPhotoIds.includes(p.id));
  } else {
    if (selectedFolderId !== 'all') {
      displayedPhotos = displayedPhotos.filter((p) => p.folderId === selectedFolderId);
    }
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedPhotos = displayedPhotos.filter(
      (p) => p.title?.toLowerCase().includes(q) || p.uploaderName.toLowerCase().includes(q) || p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Guest Hero Banner */}
      <div className="relative bg-slate-900 text-white overflow-hidden border-b border-slate-800">
        
        {/* Background Cover with Cinematic Scrim */}
        <div className="absolute inset-0">
          <img
            src={event.coverUrl}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 scale-105 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center space-y-4">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold backdrop-blur-md border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Espaço dos Convidados • MeuClick</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {event.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            {new Date(event.date).toLocaleDateString('pt-BR', { dateStyle: 'long' })} · {event.location}
          </p>

          <p className="text-sm sm:text-base text-slate-200 font-medium max-w-lg mx-auto leading-relaxed pt-1">
            Encontre todas as fotos em que você aparece em segundos tirando uma selfie com nossa inteligência artificial!
          </p>

          {/* Primary Action Buttons (Thumb friendly >= 44px) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={onOpenSelfieModal}
              className="w-full sm:w-auto min-h-[46px] px-6 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Buscar Minhas Fotos com Selfie</span>
            </button>

            <button
              onClick={onOpenUploadModal}
              className="w-full sm:w-auto min-h-[46px] px-5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm rounded-2xl backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 text-blue-400" />
              <span>Enviar Fotos da Festa</span>
            </button>
          </div>

        </div>

      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Active AI Face Filter Notification Banner */}
        {isFaceFiltered && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Identificamos {displayedPhotos.length} foto(s) com seu rosto!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Reconhecimento biométrico realizado pelo Gemini 3.8 Flash Vision.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSelfieModal}
                className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Tirar outra selfie
              </button>
              <button
                onClick={onClearFaceFilter}
                className="px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                Ver Todas as Fotos
              </button>
            </div>
          </div>
        )}

        {/* Filter Navigation Bar */}
        {!isFaceFiltered && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            
            {/* Folder selection buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedFolderId('all')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                  selectedFolderId === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Todas as Fotos ({event.photos.length})
              </button>

              {event.folders.map((fld) => {
                const count = event.photos.filter((p) => p.folderId === fld.id).length;
                return (
                  <button
                    key={fld.id}
                    onClick={() => setSelectedFolderId(fld.id)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      selectedFolderId === fld.id
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Folder className="w-3.5 h-3.5 text-blue-500" />
                    <span>{fld.name} ({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Quick search input */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por tag ou pessoa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>
        )}

        {/* Photos Grid */}
        {displayedPhotos.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900/60 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Nenhuma foto encontrada
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {isFaceFiltered
                ? 'Tente tirar outra selfie com um ângulo frontal ou confira a galeria completa.'
                : 'Seja o primeiro a enviar fotos para esta pasta do evento!'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={onOpenSelfieModal}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Buscar com Selfie (IA)
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedPhotos.map((photo) => {
              const confidence = confidenceMap[photo.id];
              const isPurchased = purchasedPhotoIds.includes(photo.id);
              const isFree = event.pricePerPhoto === 0;

              return (
                <div
                  key={photo.id}
                  onClick={() => onSelectPhoto(photo)}
                  className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                >
                  {/* Photo Slot */}
                  <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.title || 'Foto do evento'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Watermark overlay preview */}
                    {!isPurchased && !isFree && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <span className="text-white/40 font-extrabold text-sm uppercase -rotate-15 tracking-wider select-none">
                          {event.watermarkText || 'MeuClick'}
                        </span>
                      </div>
                    )}

                    {/* Top tags / badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                      {confidence !== undefined && confidence > 0 ? (
                        <span className="bg-blue-600/90 backdrop-blur-md text-white font-bold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          {confidence}% Você
                        </span>
                      ) : <span />}

                      {isPurchased ? (
                        <span className="bg-emerald-600/90 backdrop-blur-md text-white font-bold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                          <Check className="w-3 h-3" />
                          HD Liberada
                        </span>
                      ) : null}
                    </div>

                    {/* Hover Quick Action Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPhoto(photo);
                        }}
                        className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                        title="Ver foto em tela cheia"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {!isPurchased && !isFree && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenCheckout(photo);
                          }}
                          className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                          title="Comprar foto HD"
                        >
                          <ShoppingBag className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="truncate pr-2">
                      <div className="font-semibold text-slate-900 dark:text-slate-200 truncate">
                        {photo.title || 'Foto do Evento'}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {photo.uploaderName}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {!isPurchased && !isFree ? (
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          R$ {event.pricePerPhoto.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          Grátis
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
