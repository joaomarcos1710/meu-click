import React, { useState } from 'react';
import { Crown, QrCode, DollarSign, Printer, Download, Eye, Users, Sparkles, MessageCircle, Copy, Check, Settings, ShieldCheck, Heart } from 'lucide-react';
import type { EventItem, Photo, AppUser } from '../types.js';

interface OwnerPortalProps {
  event: EventItem;
  currentUser: AppUser | null;
  purchasedPhotoIds: string[];
  onOpenQR: () => void;
  onOpenUpload: () => void;
  onViewAsGuest: () => void;
}

export const OwnerPortal: React.FC<OwnerPortalProps> = ({
  event,
  currentUser,
  purchasedPhotoIds,
  onOpenQR,
  onOpenUpload,
  onViewAsGuest,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [pixKey, setPixKey] = useState('pix.noivos.anapedro@banco.com.br');
  const [isSavedPix, setIsSavedPix] = useState(false);

  const guestPhotos = event.photos.filter((p) => p.uploadedBy === 'guest');
  const photographerPhotos = event.photos.filter((p) => p.uploadedBy === 'photographer');
  const totalRevenue = purchasedPhotoIds.length * event.pricePerPhoto;

  const eventShareUrl = `${window.location.origin}?event=${event.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSavePix = () => {
    setIsSavedPix(true);
    setTimeout(() => setIsSavedPix(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <Crown className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Painel Exclusivo dos Donos do Evento
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {event.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Anfitriões: <strong className="text-white">{currentUser?.name || event.organizerName}</strong> · Código do Evento: <span className="font-mono text-amber-300 font-bold">{event.code}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onViewAsGuest}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-blue-400" />
            <span>Acessar como Convidado</span>
          </button>

          <button
            onClick={onOpenQR}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Plaquinhas de Mesa & QR Code</span>
          </button>
        </div>
      </div>

      {/* Financial & Engagement KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Faturamento em Vendas
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            R$ {totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {purchasedPhotoIds.length} foto(s) comprada(s)
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Fotos Enviadas por Convidados
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
            {guestPhotos.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Espontâneas de smartphones
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Fotos Oficiais da Equipe
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
            {photographerPhotos.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Alta resolução profissional
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Buscas por Selfie (IA)
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 mt-1 tabular-nums flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Ativa</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            100% dos convidados atendidos
          </div>
        </div>

      </div>

      {/* Main Management Columns: Table Tent Mockup & PIX Payouts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Printable Table Tent Mockup */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                Plaquinha de Mesa com QR Code
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Imprima e coloque nos centros de mesa para os convidados acessarem instantaneamente
              </p>
            </div>
            <button
              onClick={onOpenQR}
              className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl transition-all"
            >
              Imprimir Modelo
            </button>
          </div>

          {/* Acrylic Tent Preview Card */}
          <div className="max-w-sm mx-auto p-6 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-850 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-lg text-center relative overflow-hidden">
            <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mb-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              MeuClick • Galeria de Fotos
            </span>
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
              {event.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tire uma selfie e encontre suas fotos da festa em segundos!
            </p>

            <div className="my-4 p-3 bg-white rounded-xl inline-block shadow-sm border border-slate-100">
              {/* QR Pattern visual */}
              <div className="w-36 h-36 bg-slate-900 rounded-lg p-2 grid grid-cols-5 grid-rows-5 gap-1">
                <div className="col-span-2 row-span-2 bg-white rounded-sm" />
                <div className="col-span-1 bg-white rounded-sm" />
                <div className="col-span-2 row-span-2 bg-white rounded-sm" />
                <div className="col-span-1 bg-white rounded-sm" />
                <div className="col-span-1 bg-white rounded-sm" />
                <div className="col-span-2 row-span-2 bg-white rounded-sm" />
                <div className="col-span-3 bg-white rounded-sm" />
              </div>
            </div>

            <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
              Código: {event.code}
            </div>

            <p className="text-[11px] text-slate-400 mt-3">
              Não precisa baixar aplicativo! Acesso direto pela câmera do celular.
            </p>
          </div>

          {/* Share link input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={eventShareUrl}
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl select-all font-mono"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shrink-0"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Financial Payouts & Guest Photos Approval */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* PIX Settings Card */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Chave PIX dos Anfitriões
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Para recebimento automático das fotos compradas
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Chave PIX (E-mail, CPF ou Telefone)
              </label>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500">Repasse instantâneo via PIX</span>
              <button
                onClick={handleSavePix}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                {isSavedPix ? 'Salvo com Sucesso!' : 'Salvar Chave'}
              </button>
            </div>
          </div>

          {/* Guest Uploads Feed */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  Fotos Enviadas por Convidados ({guestPhotos.length})
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fotos adicionadas via QR Code durante o evento
                </p>
              </div>
            </div>

            {guestPhotos.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                Nenhum convidado enviou fotos ainda.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {guestPhotos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img
                      src={photo.url}
                      alt={photo.title || 'Foto Convidado'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-1.5">
                      <span className="text-[9px] font-medium text-white truncate">
                        {photo.uploaderName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
