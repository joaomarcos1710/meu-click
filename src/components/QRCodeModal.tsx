import React, { useState, useEffect } from 'react';
import { QrCode, X, Copy, Check, Share2, Printer, Download, MessageCircle, ExternalLink } from 'lucide-react';
import type { EventItem } from '../types.js';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, event }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch(`/api/events/${event.id}/qrcode`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setQrDataUrl(data.qrDataUrl);
            setTargetUrl(data.targetUrl);
          }
        })
        .catch((err) => console.error('Error fetching QR code:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, event.id]);

  if (!isOpen) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `📸 Acesse as fotos do evento *${event.title}* no MeuClick!\nEncontre suas fotos facilmente com selfie ou veja a galeria completa:\n👉 ${targetUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                QR Code & Link do Evento
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compartilhe com convidados e fotógrafos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-6 text-center space-y-4">
          
          {/* Printable table tent preview box */}
          <div className="p-5 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              MeuClick • Galeria de Fotos
            </div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white mb-3">
              {event.title}
            </h4>

            {loading ? (
              <div className="w-48 h-48 mx-auto flex items-center justify-center bg-slate-100 dark:bg-slate-700/50 rounded-xl animate-pulse">
                <span className="text-xs text-slate-400">Gerando QR Code...</span>
              </div>
            ) : qrDataUrl ? (
              <div className="p-3 bg-white rounded-2xl inline-block shadow-md border border-slate-200">
                <img
                  src={qrDataUrl}
                  alt="QR Code do Evento"
                  className="w-44 h-44 object-contain"
                />
              </div>
            ) : null}

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Aponte a câmera do celular para encontrar suas fotos com IA ou enviar novos cliques!
            </p>
            <div className="mt-2 inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              Código: {event.code}
            </div>
          </div>

          {/* Direct link input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={targetUrl}
              className="flex-1 px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 select-all focus:outline-none"
            />
            <button
              onClick={copyLink}
              className="px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 rounded-xl transition-all flex items-center gap-1 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={shareViaWhatsApp}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar no WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="py-2.5 px-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Placa</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
