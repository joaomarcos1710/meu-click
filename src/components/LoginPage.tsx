import React, { useState } from 'react';
import { Camera, Crown, User, Lock, Mail, ArrowRight, CheckCircle2, Sparkles, QrCode, Key, Eye, EyeOff, Shield } from 'lucide-react';
import type { AppUser, UserRole } from '../types.js';

interface LoginPageProps {
  onLoginSuccess: (user: AppUser, eventCode?: string) => void;
  onCancel?: () => void;
  initialRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onCancel,
  initialRole = 'owner',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [eventCode, setEventCode] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-configured demo accounts for fast 1-click testing
  const demoAccounts: Record<UserRole, AppUser> = {
    owner: {
      id: 'usr-owner-01',
      name: 'Ana Carolina & Pedro',
      email: 'noivos@meuclick.com',
      role: 'owner',
      phone: '+55 11 98765-4321',
      companyName: 'Casamento Ana & Pedro',
      avatarUrl: '/src/assets/images/wedding_ceremony_1794014230157.jpg',
    },
    photographer: {
      id: 'usr-photo-01',
      name: 'Marcos Fotografia & Vídeo',
      email: 'contato@marcosfoto.com.br',
      role: 'photographer',
      phone: '+55 11 99888-7766',
      companyName: 'Studio Click Pro',
      avatarUrl: '/src/assets/images/corporate_summit_1794014229891.jpg',
    },
    guest: {
      id: 'usr-guest-01',
      name: 'Camila Silva (Convidada)',
      email: 'camila.convidada@gmail.com',
      role: 'guest',
      phone: '+55 11 91234-5678',
      avatarUrl: '/src/assets/images/guest_wedding_camila_1794014248100.jpg',
    },
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    const user = demoAccounts[role];
    onLoginSuccess(user, role === 'guest' ? 'ANA-PEDRO-2026' : undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      let displayName = name.trim();
      if (!displayName) {
        if (selectedRole === 'owner') displayName = email.split('@')[0] || 'Dono do Evento';
        else if (selectedRole === 'photographer') displayName = email.split('@')[0] || 'Fotógrafo Pro';
        else displayName = name || 'Convidado';
      }

      const user: AppUser = {
        id: `usr-${Date.now()}`,
        name: displayName,
        email: email || `${selectedRole}@meuclick.com`,
        role: selectedRole,
        phone: guestPhone || undefined,
      };

      onLoginSuccess(user, eventCode.trim() || undefined);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-colors">
        
        {/* Brand & Header */}
        <div className="p-6 sm:p-8 text-center border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-blue-500/25">
            <Camera className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Acessar o Meu<span className="text-blue-600">Click</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Selecione seu perfil de acesso para entrar na plataforma de fotos
          </p>
        </div>

        {/* Role Selector Tabs (Single-line interactive controls per §1.A) */}
        <div className="p-4 sm:p-6 pb-2">
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('owner');
                setEmail('noivos@meuclick.com');
              }}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 select-none ${
                selectedRole === 'owner'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-500" />
              <span className="truncate">Dono do Evento</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('photographer');
                setEmail('contato@marcosfoto.com.br');
              }}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 select-none ${
                selectedRole === 'photographer'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="truncate">Fotógrafo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('guest');
                setEmail('');
                setEventCode('ANA-PEDRO-2026');
              }}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 select-none ${
                selectedRole === 'guest'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-4 h-4 text-emerald-500" />
              <span className="truncate">Convidado</span>
            </button>
          </div>

          {/* Role Description Card */}
          <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            {selectedRole === 'owner' && (
              <p>
                👑 <strong>Dono / Anfitrião:</strong> Crie novos eventos, defina valores de fotos HD, acompanhe vendas e gere plaquinhas de QR Code para mesas.
              </p>
            )}
            {selectedRole === 'photographer' && (
              <p>
                📸 <strong>Fotógrafo / Staff:</strong> Envie centenas de fotos em alta definição em lote, crie álbuns/pastas e gerencie marcas d'água.
              </p>
            )}
            {selectedRole === 'guest' && (
              <p>
                🎉 <strong>Convidado:</strong> Entre com o código do evento, encontre suas fotos com uma selfie via IA e receba direto no WhatsApp.
              </p>
            )}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 pt-2 space-y-4">
          
          {selectedRole === 'guest' ? (
            /* Guest Quick Access Form */
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Código ou Link do Evento *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: ANA-PEDRO-2026"
                    value={eventCode}
                    onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs font-mono font-bold uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Código impresso na plaquinha de mesa ou no convite
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Seu Nome (opcional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Ex: Camila Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Seu WhatsApp (para receber fotos HD)
                </label>
                <input
                  type="tel"
                  placeholder="(11) 98765-4321"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          ) : (
            /* Owner / Photographer Login Form */
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail Profissional *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder={selectedRole === 'owner' ? 'noivos@meuclick.com' : 'fotografo@studio.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Senha de Acesso *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password || 'demo1234'}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span>Lembrar meu acesso</span>
                </label>
                <a href="#recuperar" onClick={(e) => { e.preventDefault(); alert('Link de redefinição enviado para o seu e-mail'); }} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Esqueceu a senha?
                </a>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
          >
            <span>
              {selectedRole === 'guest' ? 'Entrar no Evento com Código' : 'Entrar na Minha Conta'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Divider */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative bg-white dark:bg-slate-900 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Acesso Rápido de Demonstração
            </span>
          </div>

          {/* 1-Click Demo Buttons for Fast Evaluation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('owner')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">Entrar como Dono</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                Ana & Pedro (Noivos)
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('photographer')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                <Camera className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">Entrar como Fotógrafo</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                Marcos Studio Click
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('guest')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                <User className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">Entrar como Convidado</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                Camila (Selfie / Mesas)
              </div>
            </button>
          </div>

        </form>

        {/* Footer cancel / back to event */}
        {onCancel && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              ← Voltar para a Galeria do Evento
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
