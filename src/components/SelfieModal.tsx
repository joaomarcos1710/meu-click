import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Sparkles, RefreshCw, Upload, CheckCircle2, User, AlertCircle, ArrowRight } from 'lucide-react';
import type { EventItem, MatchFaceResponse } from '../types.js';

interface SelfieModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem;
  onMatchesFound: (matchedIds: string[], confidenceMap: Record<string, number>) => void;
}

export const SelfieModal: React.FC<SelfieModalProps> = ({
  isOpen,
  onClose,
  event,
  onMatchesFound,
}) => {
  const [mode, setMode] = useState<'camera' | 'upload' | 'preset'>('preset');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<MatchFaceResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Quick preset attendee options for instant test
  const demoAttendees = [
    {
      id: 'camila',
      name: 'Camila (Convidada Casamento)',
      role: 'Convidada com brinde e arranjo floral',
      imageUrl: '/src/assets/images/guest_wedding_camila_1794014248100.jpg',
    },
    {
      id: 'lucas',
      name: 'Lucas (Formando Tech)',
      role: 'Formando com beca e canudo diploma',
      imageUrl: '/src/assets/images/guest_grad_lucas_1794014248464.jpg',
    },
    {
      id: 'gabriel',
      name: 'Gabriel (Convidado Casamento)',
      role: 'Convidado de blazer azul no jardim',
      imageUrl: '/src/assets/images/guest_wedding_gabriel_1794014249496.jpg',
    },
  ];

  // Start webcam
  const startCamera = async () => {
    try {
      setErrorMsg(null);
      setMode('camera');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setErrorMsg('Não foi possível acessar a câmera. Você pode selecionar um avatar de teste ou fazer upload de uma foto.');
      setMode('preset');
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setIsScanning(false);
      setScanResult(null);
      setErrorMsg(null);
    }
  }, [isOpen]);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      setCapturedImage(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCapturedImage(reader.result as string);
        setMode('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (imgUrl: string) => {
    setCapturedImage(imgUrl);
  };

  const performFaceScan = async () => {
    if (!capturedImage) return;

    setIsScanning(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/events/${event.id}/match-face`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selfieImage: capturedImage }),
      });

      const data: MatchFaceResponse = await res.json();
      setScanResult(data);

      const confidenceMap: Record<string, number> = {};
      data.matches?.forEach((m) => {
        confidenceMap[m.photoId] = m.confidence;
      });

      onMatchesFound(data.matchedPhotoIds || [], confidenceMap);
    } catch (err: any) {
      setErrorMsg('Erro ao processar reconhecimento facial. Tente novamente.');
    } finally {
      setIsScanning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reconhecimento Facial por Selfie
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                A IA analisa suas feições para encontrar apenas suas fotos
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

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Mode Switch Tabs */}
          {!capturedImage && (
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setMode('preset')}
                className={`py-2 rounded-lg transition-colors ${
                  mode === 'preset'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Testar Avatar
              </button>
              <button
                onClick={startCamera}
                className={`py-2 rounded-lg transition-colors ${
                  mode === 'camera'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Câmera Frontal
              </button>
              <label
                className={`py-2 rounded-lg transition-colors text-center cursor-pointer ${
                  mode === 'upload'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Enviar Foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* 1. Camera View */}
          {mode === 'camera' && !capturedImage && (
            <div className="relative aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden bg-black flex items-center justify-center border-2 border-dashed border-blue-500">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />
              <div className="absolute inset-8 border border-white/40 rounded-full pointer-events-none" />
              
              <button
                onClick={capturePhoto}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                Tirar Foto
              </button>
            </div>
          )}

          {/* 2. Preset Avatars Selector */}
          {mode === 'preset' && !capturedImage && (
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                Selecione um participante demo para testar o reconhecimento instantaneamente:
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {demoAttendees.map((att) => (
                  <button
                    key={att.id}
                    onClick={() => selectPreset(att.imageUrl)}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-left flex items-center gap-3.5 transition-all group"
                  >
                    <img
                      src={att.imageUrl}
                      alt={att.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {att.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {att.role}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 shrink-0">
                      Escolher <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Captured / Selected Selfie & Scan Animation */}
          {capturedImage && (
            <div className="space-y-4">
              <div className="relative aspect-square max-w-[240px] mx-auto rounded-2xl overflow-hidden bg-slate-900 border-2 border-blue-500 shadow-md">
                <img
                  src={capturedImage}
                  alt="Selfie"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Biometric Scanning Laser Animation */}
                {isScanning && (
                  <div className="absolute inset-0 bg-blue-500/10 flex flex-col justify-between">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse shadow-cyan-400 shadow-[0_0_15px]" />
                    <div className="p-3 text-center">
                      <span className="text-[11px] font-bold text-white bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-md">
                        Mapeando biometria...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status & Results */}
              {scanResult ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    {scanResult.message}
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    {scanResult.matchedPhotoIds?.length || 0} foto(s) identificada(s) · Processado em {scanResult.processingTimeMs}ms
                  </p>
                </div>
              ) : (
                <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                  Pronto! Clique abaixo para iniciar a varredura com o Gemini 3.8 Flash Vision.
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          {capturedImage ? (
            <>
              <button
                onClick={() => {
                  setCapturedImage(null);
                  setScanResult(null);
                  setMode('preset');
                }}
                disabled={isScanning}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 transition-colors"
              >
                Trocar Foto
              </button>

              {scanResult ? (
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Ver Minhas Fotos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={performFaceScan}
                  disabled={isScanning}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analisando com IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Escanear Fotos do Evento</span>
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="w-full text-right">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Fechar
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
