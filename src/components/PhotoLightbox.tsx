import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ShoppingBag, MessageCircle, Share2, Shield, ShieldCheck, Check, Sparkles } from 'lucide-react';
import type { Photo, EventItem } from '../types.js';

interface PhotoLightboxProps {
  photo: Photo | null;
  onClose: () => void;
  event: EventItem;
  allPhotos: Photo[];
  onNavigate: (newPhoto: Photo) => void;
  purchasedPhotoIds: string[];
  onOpenCheckout: (photo: Photo) => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photo,
  onClose,
  event,
  allPhotos,
  onNavigate,
  purchasedPhotoIds,
  onOpenCheckout,
}) => {
  if (!photo) return null;

  const currentIndex = allPhotos.findIndex((p) => p.id === photo.id);
  const isPurchased = purchasedPhotoIds.includes(photo.id);
  const isFree = event.pricePerPhoto === 0;
  const canViewUnwatermarked = isPurchased || isFree;
  const [showWatermark, setShowWatermark] = useState(!canViewUnwatermarked);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      onNavigate(allPhotos[currentIndex - 1]);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < allPhotos.length - 1) {
      onNavigate(allPhotos[currentIndex + 1]);
    }
  };

  // Download with watermark via client-side canvas
  const handleDownloadWatermarked = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photo.url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1200;
      canvas.height = img.naturalHeight || 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw photo
        ctx.drawImage(img, 0, 0);

        // Draw watermark pattern
        const watermarkText = event.watermarkText || 'MeuClick';
        ctx.save();
        ctx.font = 'bold 36px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 8;
        ctx.textAlign = 'center';
        
        // Repeating diagonal watermark
        ctx.rotate((-25 * Math.PI) / 180);
        for (let x = -canvas.width; x < canvas.width * 2; x += 400) {
          for (let y = -canvas.height; y < canvas.height * 2; y += 220) {
            ctx.fillText(watermarkText, x, y);
          }
        }
        ctx.restore();

        // Footer banner watermark
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
        ctx.font = 'bold 24px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`MeuClick • ${event.title}`, canvas.width / 2, canvas.height - 22);

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg', 0.88);
        link.download = `MeuClick-${event.code}-${photo.id}-preview.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
  };

  const handleDownloadOriginal = () => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `MeuClick-${event.code}-${photo.id}-HD.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `📸 Veja essa foto do evento *${event.title}* no MeuClick!\n${window.location.origin}${photo.url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Top Bar Controls */}
      <div className="absolute top-0 left-0 right-0 h-16 px-4 sm:px-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-white text-xs sm:text-sm font-medium truncate pr-4">
          <span className="font-bold">{photo.title || 'Foto do Evento'}</span>
          <span className="text-white/60 ml-2 hidden sm:inline">
            ({currentIndex + 1} de {allPhotos.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Watermark toggle */}
          {canViewUnwatermarked && (
            <button
              onClick={() => setShowWatermark(!showWatermark)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
            >
              {showWatermark ? 'Ocultar Marca' : 'Exibir Marca'}
            </button>
          )}

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Display */}
      <div className="relative w-full h-full max-h-[82vh] flex items-center justify-center p-4 select-none">
        <div className="relative max-w-full max-h-full flex items-center justify-center">
          <img
            src={photo.url}
            alt={photo.title || 'Foto do Evento'}
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
          />

          {/* Dynamic Watermark Overlay (If enabled) */}
          {(showWatermark || !canViewUnwatermarked) && (
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between overflow-hidden rounded-lg">
              {/* Diagonal repeating watermark pattern */}
              <div className="absolute inset-0 flex items-center justify-center -rotate-25 opacity-30 select-none">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 sm:gap-24 text-white text-lg sm:text-2xl font-black uppercase tracking-widest text-center">
                  <span>{event.watermarkText || 'MeuClick'}</span>
                  <span>{event.watermarkText || 'MeuClick'}</span>
                  <span>{event.watermarkText || 'MeuClick'}</span>
                  <span>{event.watermarkText || 'MeuClick'}</span>
                  <span>{event.watermarkText || 'MeuClick'}</span>
                  <span>{event.watermarkText || 'MeuClick'}</span>
                </div>
              </div>

              {/* Bottom watermark bar */}
              <div className="relative mt-auto w-full py-2 bg-black/60 backdrop-blur-sm text-center text-white/90 text-xs font-semibold">
                MeuClick • {event.title} • Versão com marca d'água
              </div>
            </div>
          )}
        </div>

        {/* Prev / Next Chevrons */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {currentIndex < allPhotos.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 py-3 px-4 sm:px-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-wrap items-center justify-between gap-3 z-10">
        
        {/* Info on Left */}
        <div className="text-white text-xs">
          <div className="text-white/60">
            Enviado por <span className="text-white font-medium">{photo.uploaderName}</span> · {new Date(photo.uploadedAt).toLocaleDateString('pt-BR')}
          </div>
          {isPurchased && (
            <div className="text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <Check className="w-3.5 h-3.5" />
              <span>Alta definição desbloqueada</span>
            </div>
          )}
        </div>

        {/* Buttons on Right */}
        <div className="flex items-center gap-2">
          {/* WhatsApp share */}
          <button
            onClick={handleShareWhatsApp}
            title="Compartilhar foto no WhatsApp"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          {/* Download free with watermark */}
          <button
            onClick={handleDownloadWatermarked}
            title="Baixar versão gratuita para redes sociais com marca d'água"
            className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Grátis (com marca)</span>
          </button>

          {/* Buy or Download HD */}
          {canViewUnwatermarked ? (
            <button
              onClick={handleDownloadOriginal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/30"
            >
              <Download className="w-4 h-4" />
              <span>Baixar HD (Sem Marca)</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenCheckout(photo)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/30"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span>Comprar Foto HD (R$ {event.pricePerPhoto.toFixed(2)})</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
