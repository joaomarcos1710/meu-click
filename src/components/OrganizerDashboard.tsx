import React, { useState } from 'react';
import { Layers, QrCode, Upload, DollarSign, Users, Eye, FolderPlus, Download, Check, Sparkles, MessageCircle, Settings, Crown, Camera } from 'lucide-react';
import type { EventItem, AppUser } from '../types.js';

interface OrganizerDashboardProps {
  event: EventItem;
  purchasedPhotoIds: string[];
  currentUser?: AppUser | null;
  onOpenUpload: () => void;
  onOpenQR: () => void;
  onOpenCreateFolder: () => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  event,
  purchasedPhotoIds,
  currentUser,
  onOpenUpload,
  onOpenQR,
  onOpenCreateFolder,
}) => {
  const photographerPhotos = event.photos.filter((p) => p.uploadedBy === 'photographer').length;
  const guestPhotos = event.photos.filter((p) => p.uploadedBy === 'guest').length;
  const totalRevenue = purchasedPhotoIds.length * event.pricePerPhoto;
  const isPhotographer = currentUser?.role === 'photographer';
  const isOwner = currentUser?.role === 'owner';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner / Event Health & Active Role */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
              {isPhotographer
                ? 'Painel Profissional do Fotógrafo'
                : isOwner
                ? 'Painel do Dono do Evento'
                : 'Painel do Organizador'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-semibold text-amber-300 flex items-center gap-1">
              {isPhotographer ? <Camera className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
              {currentUser?.name || 'Organizador'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold mt-1">
            {event.title}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Código do Evento: <span className="font-mono font-bold text-amber-300">{event.code}</span> · {event.location}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenQR}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <QrCode className="w-4 h-4 text-blue-400" />
            <span>QR Code das Mesas</span>
          </button>
          <button
            onClick={onOpenUpload}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>{isPhotographer ? 'Enviar Lote de Fotos HD' : 'Adicionar Fotos'}</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strips (Anti-slop: clean tabular nums, unboxed metadata) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total de Fotos
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
            {event.photos.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {photographerPhotos} equipe · {guestPhotos} convidados
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Pastas / Álbuns
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
            {event.folders.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Momentos categorizados
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Fotos HD Vendidas
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {purchasedPhotoIds.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Desbloqueadas sem marca
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Faturamento Estimado
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
            R$ {totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Preço: R$ {event.pricePerPhoto.toFixed(2)} / foto
          </div>
        </div>

      </div>

      {/* Folders Management */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Pastas & Álbuns do Evento
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Permite que os convidados encontrem fotos por momento da celebração
            </p>
          </div>
          <button
            onClick={onOpenCreateFolder}
            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ Criar Pasta</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {event.folders.map((fld) => {
            const count = event.photos.filter((p) => p.folderId === fld.id).length;
            return (
              <div
                key={fld.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {fld.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {count} foto(s) alocada(s)
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WhatsApp Delivery Channel Setting */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Entrega Prioritária por WhatsApp Ativa
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Quando convidados compram fotos HD ou solicitam links, o MeuClick formata a mensagem com 1 clique para WhatsApp.
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
          WhatsApp Organizador: {event.organizerPhone || 'Configurado'}
        </div>
      </div>

    </div>
  );
};
