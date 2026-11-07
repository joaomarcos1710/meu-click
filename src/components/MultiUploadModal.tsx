import React, { useState } from 'react';
import { Upload, X, Check, Image as ImageIcon, Plus, FolderPlus, RefreshCw, AlertCircle } from 'lucide-react';
import type { EventItem, EventFolder } from '../types.js';

interface MultiUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem;
  onUploadSuccess: () => void;
}

export const MultiUploadModal: React.FC<MultiUploadModalProps> = ({
  isOpen,
  onClose,
  event,
  onUploadSuccess,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<Array<{ name: string; dataUrl: string }>>([]);
  const [folderId, setFolderId] = useState<string>('');
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [uploadedBy, setUploadedBy] = useState<'guest' | 'photographer'>('guest');
  const [uploaderName, setUploaderName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setErrorMsg(null);
    const newFiles: Array<{ name: string; dataUrl: string }> = [];
    let processed = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        newFiles.push({
          name: file.name,
          dataUrl: reader.result as string,
        });
        processed++;
        if (processed === files.length) {
          setSelectedFiles((prev) => [...prev, ...newFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const res = await fetch(`/api/events/${event.id}/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName }),
      });
      const data = await res.json();
      if (data.success && data.folder) {
        event.folders.push(data.folder);
        setFolderId(data.folder.id);
        setNewFolderName('');
        setIsCreatingFolder(false);
      }
    } catch (err) {
      console.error('Error creating folder:', err);
    }
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      setErrorMsg('Por favor selecione pelo menos 1 foto para enviar.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const payload = {
        photos: selectedFiles.map((f, i) => ({
          url: f.dataUrl,
          title: f.name.replace(/\.[^/.]+$/, ''),
        })),
        folderId: folderId || undefined,
        uploadedBy,
        uploaderName: uploaderName.trim() || (uploadedBy === 'photographer' ? 'Fotógrafo Oficial' : 'Convidado'),
      };

      const res = await fetch(`/api/events/${event.id}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        onUploadSuccess();
        onClose();
      } else {
        setErrorMsg(data.message || 'Falha ao enviar fotos');
      }
    } catch (err: any) {
      setErrorMsg('Erro de conexão ao enviar fotos.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Multi-Upload de Fotos
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Envie várias fotos de uma só vez para o álbum do evento
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
        <div className="p-6 overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Uploader info & Folder assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Quem está enviando?
              </label>
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setUploadedBy('guest')}
                  className={`py-1.5 rounded-lg transition-colors ${
                    uploadedBy === 'guest'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Convidado
                </button>
                <button
                  type="button"
                  onClick={() => setUploadedBy('photographer')}
                  className={`py-1.5 rounded-lg transition-colors ${
                    uploadedBy === 'photographer'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Fotógrafo / Staff
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Seu Nome (opcional)
              </label>
              <input
                type="text"
                placeholder={uploadedBy === 'photographer' ? 'Ex: Lentes & Foco Studio' : 'Ex: João Silva'}
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Folder Assignment */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Organizar em Pasta (opcional)
              </label>
              <button
                type="button"
                onClick={() => setIsCreatingFolder(!isCreatingFolder)}
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                {isCreatingFolder ? 'Cancelar' : '+ Nova Pasta'}
              </button>
            </div>

            {isCreatingFolder ? (
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Nome da pasta (ex: Pista de Dança)"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleCreateFolder}
                  className="px-3 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            ) : (
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
              >
                <option value="">Sem pasta específica (Galeria Geral)</option>
                {event.folders?.map((fld) => (
                  <option key={fld.id} value={fld.id}>
                    Pasta: {fld.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Dropzone Area */}
          <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white text-center">
              Clique para selecionar ou arraste as fotos aqui
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Suporta JPG, PNG, WEBP (várias fotos simultâneas)
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFiles}
              className="hidden"
            />
          </label>

          {/* Previews */}
          {selectedFiles.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {selectedFiles.length} foto(s) selecionada(s)
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFiles([])}
                  className="text-xs text-red-500 hover:underline"
                >
                  Limpar todas
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img
                      src={file.dataUrl}
                      alt={file.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isUploading || selectedFiles.length === 0}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Enviando {selectedFiles.length} foto(s)...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Publicar Fotos no Evento</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
