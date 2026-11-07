import React from 'react';
import { Camera, Plus, Moon, Sun, Sparkles, FolderOpen, QrCode } from 'lucide-react';

interface NavbarProps {
  currentView: 'guest' | 'organizer' | 'plans';
  onViewChange: (view: 'guest' | 'organizer' | 'plans') => void;
  onOpenCreateEvent: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenCreateEvent,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div 
          onClick={() => onViewChange('guest')}
          className="flex items-center gap-2 cursor-pointer select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Camera className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            Meu<span className="text-blue-600">Click</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single-line controls) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onViewChange('guest')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'guest'
                ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Galeria do Evento
          </button>
          <button
            onClick={() => onViewChange('organizer')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'organizer'
                ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Painel do Organizador
          </button>
          <button
            onClick={() => onViewChange('plans')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentView === 'plans'
                ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Planos & IA
          </button>
        </nav>

        {/* Zone 3: Primary Action & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            aria-label="Alternar tema"
            className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenCreateEvent}
            className="h-9 px-3.5 sm:px-4 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg transition-all shadow-sm shadow-blue-600/20 flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Criar Novo</span> Evento
          </button>
        </div>
      </div>
    </header>
  );
};
