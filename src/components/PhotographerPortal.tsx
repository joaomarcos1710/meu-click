import React, { useState } from 'react';
import { Camera, Upload, FolderPlus, Sparkles, Image as ImageIcon, Settings, Check, ShieldCheck, Eye, Trash2, ArrowUpRight, DollarSign, Layers } from 'lucide-react';
import type { EventItem, Photo, AppUser } from '../types.js';

interface PhotographerPortalProps {
  event: EventItem;
  currentUser: AppUser | null;
  onOpenUpload: () => void;
  onOpenCreateFolder: () => void;
  onSelectPhoto: (photo: Photo) => void;
  onUpdateWatermark: (newWatermark: string) => void;
  onViewAsGuest: () => void;
}

export const PhotographerPortal: React.FC<PhotographerPortalProps> = ({
  event,
  currentUser,
  onOpenUpload,
  onOpenCreateFolder,
  onSelectPhoto,
  onUpdateWatermark,
  onViewAsGuest,
}) => {
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [watermarkInput, setWatermarkInput] = useState(event.watermarkText || `MeuClick • ${event.title}`);
  const [watermarkOpacity, setWatermarkOpacity] = useState(40);
  const [watermarkSaved, setWatermarkSaved] = useState(false);
  const [photoPrice, setPhotoPrice] = useState(event.pricePerPhoto.toString());

  const photographerPhotos = event.photos.filter((p) => p.uploadedBy === 'photographer');
  const filteredPhotos = selectedFolder === 'all' 
    ? photographerPhotos 
    : photographerPhotos.filter((p) => p.folderId === selectedFolder);

  const handleSaveWatermark = () => {
    onUpdateWatermark(watermarkInput);
    setWatermarkSaved(true);
    setTimeout(() => setWatermarkSaved(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Studio Banner & Event Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Camera className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Espaço do Fotógrafo & Equipe Oficial
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
              Plano Pro IA Ativo
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {event.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Fotógrafo Responsável: <strong className="text-white">{currentUser?.name || 'Studio Click Pro'}</strong> · {event.date} · {event.location}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onViewAsGuest}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-blue-400" />
            <span>Ver como Convidado</span>
          </button>

          <button
            onClick={onOpenCreateFolder}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold transition-all flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4 text-amber-400" />
            <span>+ Nova Pasta</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>+ Multi-Upload em Lote HD</span>
          </button>
        </div>
      </div>

      {/* Photographer KPI Metric Strips (Anti-slop: tabular nums, unboxed metadata) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Fotos Oficiais do Estúdio
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
            {photographerPhotos.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            De um total de {event.photos.length} no evento
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Reconhecimento Facial (IA)
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 tabular-nums flex items-center gap-1.5">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span>Ativo</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Gemini 3.8 Flash Vision indexando faces
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Pastas / Momentos
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
            {event.folders.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Álbuns temáticos organizados
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Valor por Foto em Alta
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            R$ {event.pricePerPhoto.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Download sem marca d'água
          </div>
        </div>

      </div>

      {/* Watermark & Security Studio Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column */}
        <div className="lg:col-span-6 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Personalização da Marca d'Água
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Proteja as fotos de pré-visualização contra capturas não autorizadas
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Texto da Marca d'Água
            </label>
            <input
              type="text"
              value={watermarkInput}
              onChange={(e) => setWatermarkInput(e.target.value)}
              placeholder="Ex: Studio Click • Casamento Ana & Pedro"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Opacidade da Marca: {watermarkOpacity}%</span>
              <span className="text-slate-400 font-normal">Recomendado: 35% a 50%</span>
            </div>
            <input
              type="range"
              min="15"
              max="80"
              value={watermarkOpacity}
              onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              A marca original em HD só é entregue após o pagamento ou aprovação.
            </span>
            <button
              onClick={handleSaveWatermark}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-blue-600/20"
            >
              {watermarkSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Salvo!</span>
                </>
              ) : (
                <span>Aplicar no Evento</span>
              )}
            </button>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-6 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pré-Visualização em Tempo Real (Visão do Convidado)
            </span>
            <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
              Canvas Watermark 2.0
            </span>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
            <img
              src={photographerPhotos[0]?.url || event.coverUrl}
              alt="Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Simulated Live Watermark Overlay */}
            <div className="absolute inset-0 flex items-center justify-center -rotate-25 pointer-events-none select-none">
              <div 
                className="grid grid-cols-2 gap-12 text-white font-black uppercase text-center tracking-widest text-sm sm:text-base"
                style={{ opacity: watermarkOpacity / 100 }}
              >
                <span>{watermarkInput}</span>
                <span>{watermarkInput}</span>
                <span>{watermarkInput}</span>
                <span>{watermarkInput}</span>
              </div>
            </div>

            <div className="absolute bottom-2 left-2 right-2 py-1 px-3 bg-black/60 backdrop-blur-md rounded-lg text-center text-white/80 text-[10px] font-semibold">
              {watermarkInput} • Protegido por MeuClick
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-3 text-center">
            Esta é a versão que os participantes visualizam e baixam gratuitamente nas redes sociais.
          </p>
        </div>

      </div>

      {/* Photo Management Section */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Acervo de Fotos do Fotógrafo ({photographerPhotos.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gerencie seus cliques profissionais, pastas e indexação facial
            </p>
          </div>

          {/* Folder tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedFolder('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                selectedFolder === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Todas ({photographerPhotos.length})
            </button>

            {event.folders.map((fld) => {
              const count = photographerPhotos.filter((p) => p.folderId === fld.id).length;
              return (
                <button
                  key={fld.id}
                  onClick={() => setSelectedFolder(fld.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                    selectedFolder === fld.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {fld.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Photos Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
            <Camera className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Nenhuma foto nesta pasta
            </h4>
            <button
              onClick={onOpenUpload}
              className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              Fazer Upload para esta pasta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => onSelectPhoto(photo)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 cursor-pointer shadow-sm hover:shadow-lg transition-all"
              >
                <img
                  src={photo.url}
                  alt={photo.title || 'Foto'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-white">
                  <span className="text-[10px] font-bold truncate">{photo.title}</span>
                  <span className="text-[9px] text-slate-300 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    Biometria Ativa
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
