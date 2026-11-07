import React, { useState } from 'react';
import { X, Check, ShoppingBag, ShieldCheck, Download, MessageCircle, Copy, Sparkles } from 'lucide-react';
import type { Photo, EventItem } from '../types.js';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo;
  event: EventItem;
  onPaymentSuccess: (photoId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  photo,
  event,
  onPaymentSuccess,
}) => {
  const [isPaid, setIsPaid] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState('');

  if (!isOpen) return null;

  const price = event.pricePerPhoto > 0 ? event.pricePerPhoto : 15.0;
  const pixCode = `00020126580014BR.GOV.BCB.PIX0136meuclick-${photo.id}-pix520400005303986540${price.toFixed(2)}5802BR5920MEUCLICK FOTOS LTDA6009SAO PAULO62070503***6304ABCD`;

  const copyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsPaid(true);
    onPaymentSuccess(photo.id);
  };

  const handleDownloadHD = () => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `MeuClick-${event.code}-${photo.id}-HD.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendWhatsApp = () => {
    const phone = whatsappPhone.replace(/\D/g, '');
    const text = encodeURIComponent(
      `🎉 Olá! Aqui está sua foto em alta resolução sem marca d'água do evento *${event.title}* no MeuClick!\n\nLink direto da foto HD:\n${window.location.origin}${photo.url}`
    );
    const url = phone ? `https://api.whatsapp.com/send?phone=55${phone}&text=${text}` : `https://api.whatsapp.com/send?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Comprar Foto em Alta Definição
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sem marca d'água e qualidade máxima de impressão
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

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {!isPaid ? (
            <>
              {/* Product summary card */}
              <div className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 items-center">
                <img
                  src={photo.url}
                  alt="Thumbnail"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {photo.title || 'Foto do Evento'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Evento: {event.title}
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                      R$ {price.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-400">à vista via PIX</span>
                  </div>
                </div>
              </div>

              {/* PIX Payment section */}
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Pague com PIX para liberação instantânea
                </span>
                
                {/* Simulated PIX QR Box */}
                <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                  <div className="grid grid-cols-6 grid-rows-6 gap-1 w-full h-full p-1 bg-slate-900 rounded">
                    {/* Simulated modern QR pattern */}
                    <div className="col-span-2 row-span-2 bg-white rounded-sm" />
                    <div className="col-span-2 bg-white rounded-sm" />
                    <div className="col-span-2 row-span-2 bg-white rounded-sm" />
                    <div className="col-span-2 bg-white rounded-sm" />
                    <div className="col-span-2 bg-white rounded-sm" />
                    <div className="col-span-2 row-span-2 bg-white rounded-sm" />
                    <div className="col-span-4 bg-white rounded-sm" />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 max-w-sm mx-auto">
                  <input
                    type="text"
                    readOnly
                    value={pixCode}
                    className="flex-1 px-3 py-1.5 text-[11px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 truncate"
                  />
                  <button
                    onClick={copyPix}
                    className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg flex items-center gap-1 hover:bg-slate-50"
                  >
                    {copiedPix ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPix ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Instant Approval Simulation Button for testing */}
              <button
                onClick={handleSimulatePayment}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Simular Pagamento PIX Aprovado</span>
              </button>
            </>
          ) : (
            /* Paid state */
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Pagamento Confirmado!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Sua foto em alta definição foi liberada sem marca d'água.
                </p>
              </div>

              {/* Direct Actions */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleDownloadHD}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Foto em Alta Resolução</span>
                </button>

                {/* WhatsApp delivery */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-left">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Receber ou enviar no WhatsApp:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      placeholder="DDD + Telefone (ex: 11987654321)"
                      value={whatsappPhone}
                      onChange={(e) => setWhatsappPhone(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      onClick={handleSendWhatsApp}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Enviar</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
