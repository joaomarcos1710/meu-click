import React, { useState } from 'react';
import { Camera, Plus, Moon, Sun, Sparkles, Crown, User, LogIn, LogOut, ChevronDown, Eye, Users, Home } from 'lucide-react';
import type { AppUser } from '../types.js';

export type MainView = 'home' | 'guest' | 'photographer' | 'owner' | 'plans' | 'login';

interface NavbarProps {
  currentView: MainView;
  onViewChange: (view: MainView) => void;
  onOpenCreateEvent: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser: AppUser | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenCreateEvent,
  isDarkMode,
  onToggleDarkMode,
  currentUser,
  onLogout,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const getRoleBadge = (role: AppUser['role']) => {
    switch (role) {
      case 'owner':
        return { label: 'Dono', icon: Crown, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' };
      case 'photographer':
        return { label: 'Fotógrafo', icon: Camera, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' };
      case 'guest':
        return { label: 'Convidado', icon: User, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' };
    }
  };

  const badge = currentUser ? getRoleBadge(currentUser.role) : null;
  const RoleIcon = badge ? badge.icon : User;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div 
          onClick={() => onViewChange('home')}
          className="flex items-center gap-2 cursor-pointer select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Camera className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            Meu<span className="text-blue-600">Click</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links for all pages */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onViewChange('home')}
            className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentView === 'home'
                ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Início</span>
          </button>

          <button
            onClick={() => onViewChange('guest')}
            className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentView === 'guest'
                ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-500" />
            <span>Espaço Convidados</span>
          </button>

          <button
            onClick={() => onViewChange('owner')}
            className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentView === 'owner'
                ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Página dos Donos</span>
          </button>

          <button
            onClick={() => onViewChange('photographer')}
            className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentView === 'photographer'
                ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4 text-blue-600" />
            <span>Página do Fotógrafo</span>
          </button>

          <button
            onClick={() => onViewChange('plans')}
            className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentView === 'plans'
                ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Planos & IA</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action, Theme Toggle & User Auth */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            aria-label="Alternar tema"
            className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Account / Role Badge */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${badge?.color}`}>
                  <RoleIcon className="w-3.5 h-3.5" />
                </div>
                <div className="hidden sm:block text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[110px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {badge?.label}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-40">
                  <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-700/60">
                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {currentUser.email}
                    </div>
                    <div className="mt-1 inline-block text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Perfil Ativo: {badge?.label}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onViewChange('login');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Trocar Perfil / Login</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair da Conta</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onViewChange('login')}
              className="h-9 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
            >
              <LogIn className="w-3.5 h-3.5 text-blue-600" />
              <span>Login</span>
            </button>
          )}

          {/* Create Event Button */}
          {(!currentUser || currentUser.role === 'owner') && (
            <button
              onClick={onOpenCreateEvent}
              className="h-9 px-3.5 sm:px-4 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg transition-all shadow-sm shadow-blue-600/20 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Criar</span> Evento
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
