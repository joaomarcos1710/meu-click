import React, { useState, useEffect } from 'react';
import { Navbar, type MainView } from './components/Navbar.js';
import { LandingPage } from './components/LandingPage.js';
import { GuestPortal } from './components/GuestPortal.js';
import { PhotographerPortal } from './components/PhotographerPortal.js';
import { OwnerPortal } from './components/OwnerPortal.js';
import { SelfieModal } from './components/SelfieModal.js';
import { MultiUploadModal } from './components/MultiUploadModal.js';
import { QRCodeModal } from './components/QRCodeModal.js';
import { PhotoLightbox } from './components/PhotoLightbox.js';
import { CheckoutModal } from './components/CheckoutModal.js';
import { CreateEventModal } from './components/CreateEventModal.js';
import { PricingModal } from './components/PricingModal.js';
import { LoginPage } from './components/LoginPage.js';
import { Sparkles, Upload, QrCode, Camera, ShieldCheck, Heart, User, Crown, Users, Home } from 'lucide-react';
import type { EventItem, Photo, AppUser } from './types.js';

export default function App() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [currentEvent, setCurrentEvent] = useState<EventItem | null>(null);
  const [currentView, setCurrentView] = useState<MainView>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Current logged in user (Owner, Photographer or Guest)
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem('meuclick_user');
      return saved ? JSON.parse(saved) : {
        id: 'usr-owner-01',
        name: 'Ana Carolina & Pedro',
        email: 'noivos@meuclick.com',
        role: 'owner',
        phone: '+55 11 98765-4321',
        companyName: 'Casamento Ana & Pedro',
        avatarUrl: '/src/assets/images/wedding_ceremony_1794014230157.jpg',
      };
    } catch {
      return null;
    }
  });

  // AI Matching state
  const [matchedPhotoIds, setMatchedPhotoIds] = useState<string[]>([]);
  const [confidenceMap, setConfidenceMap] = useState<Record<string, number>>({});

  // Purchased photos state
  const [purchasedPhotoIds, setPurchasedPhotoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('meuclick_purchased_photos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [isSelfieModalOpen, setIsSelfieModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [selectedLightboxPhoto, setSelectedLightboxPhoto] = useState<Photo | null>(null);
  const [selectedCheckoutPhoto, setSelectedCheckoutPhoto] = useState<Photo | null>(null);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load events
  const loadEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.success && data.events?.length > 0) {
        setEvents(data.events);
        if (!currentEvent) {
          const params = new URLSearchParams(window.location.search);
          const eventParam = params.get('event');
          const found = data.events.find((e: EventItem) => e.id === eventParam || e.code === eventParam);
          setCurrentEvent(found || data.events[0]);
          // If query param explicitly requested an event, show guest view
          if (eventParam && found) {
            setCurrentView('guest');
          }
        } else {
          const updated = data.events.find((e: EventItem) => e.id === currentEvent.id);
          if (updated) setCurrentEvent(updated);
        }
      }
    } catch (err) {
      console.error('Error loading events:', err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleMatchesFound = (matchedIds: string[], confMap: Record<string, number>) => {
    setMatchedPhotoIds(matchedIds);
    setConfidenceMap(confMap);
  };

  const handleClearFaceFilter = () => {
    setMatchedPhotoIds([]);
    setConfidenceMap({});
  };

  const handlePaymentSuccess = (photoId: string) => {
    setPurchasedPhotoIds((prev) => {
      const updated = [...prev, photoId];
      try {
        localStorage.setItem('meuclick_purchased_photos', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleUpdateWatermark = (newWatermark: string) => {
    if (currentEvent) {
      setCurrentEvent((prev) => prev ? { ...prev, watermarkText: newWatermark } : null);
    }
  };

  const handleLoginSuccess = (user: AppUser, targetEventCode?: string) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('meuclick_user', JSON.stringify(user));
    } catch {}

    if (targetEventCode && events.length > 0) {
      const matchingEv = events.find((e) => e.code.toUpperCase() === targetEventCode.toUpperCase() || e.id === targetEventCode);
      if (matchingEv) {
        setCurrentEvent(matchingEv);
      }
    }

    // Role-based view redirection to dedicated persona page
    if (user.role === 'owner') {
      setCurrentView('owner');
    } else if (user.role === 'photographer') {
      setCurrentView('photographer');
    } else {
      setCurrentView('guest');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('meuclick_user');
    } catch {}
    setCurrentView('login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => {
          if (view === 'plans') {
            setIsPricingOpen(true);
          } else {
            setCurrentView(view);
          }
        }}
        onOpenCreateEvent={() => setIsCreateEventOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-8">
        {currentView === 'home' ? (
          <LandingPage
            events={events}
            onSelectEvent={(ev) => {
              setCurrentEvent(ev);
              handleClearFaceFilter();
            }}
            onOpenCreateEvent={() => setIsCreateEventOpen(true)}
            onNavigateToView={(view) => setCurrentView(view)}
          />
        ) : currentView === 'login' ? (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onCancel={currentEvent ? () => setCurrentView('guest') : undefined}
            initialRole={currentUser?.role || 'owner'}
          />
        ) : currentView === 'photographer' && currentEvent ? (
          <PhotographerPortal
            event={currentEvent}
            currentUser={currentUser}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onOpenCreateFolder={() => setIsUploadModalOpen(true)}
            onSelectPhoto={(p) => setSelectedLightboxPhoto(p)}
            onUpdateWatermark={handleUpdateWatermark}
            onViewAsGuest={() => setCurrentView('guest')}
          />
        ) : currentView === 'owner' && currentEvent ? (
          <OwnerPortal
            event={currentEvent}
            currentUser={currentUser}
            purchasedPhotoIds={purchasedPhotoIds}
            onOpenQR={() => setIsQRModalOpen(true)}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onViewAsGuest={() => setCurrentView('guest')}
          />
        ) : currentEvent ? (
          <GuestPortal
            event={currentEvent}
            allEvents={events}
            matchedPhotoIds={matchedPhotoIds}
            confidenceMap={confidenceMap}
            purchasedPhotoIds={purchasedPhotoIds}
            onSelectEvent={(ev) => {
              setCurrentEvent(ev);
              handleClearFaceFilter();
            }}
            onOpenSelfieModal={() => setIsSelfieModalOpen(true)}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onOpenQRModal={() => setIsQRModalOpen(true)}
            onSelectPhoto={(p) => setSelectedLightboxPhoto(p)}
            onOpenCheckout={(p) => setSelectedCheckoutPhoto(p)}
            onClearFaceFilter={handleClearFaceFilter}
          />
        ) : null}
      </main>

      {/* Mobile-First Floating Thumb Zone Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
            currentView === 'home' ? 'text-blue-600 font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Home className="w-4 h-4 text-slate-500" />
          <span className="text-[10px] mt-0.5">Início</span>
        </button>

        <button
          onClick={() => setCurrentView('guest')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
            currentView === 'guest' ? 'text-blue-600 font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] mt-0.5">Convidados</span>
        </button>

        <button
          onClick={() => setCurrentView('owner')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
            currentView === 'owner' ? 'text-blue-600 font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] mt-0.5">Donos</span>
        </button>

        <button
          onClick={() => setCurrentView('photographer')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
            currentView === 'photographer' ? 'text-blue-600 font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Camera className="w-4 h-4 text-blue-600" />
          <span className="text-[10px] mt-0.5">Fotógrafo</span>
        </button>

        <button
          onClick={() => setCurrentView('login')}
          className="flex flex-col items-center justify-center py-1 px-2 text-slate-600 dark:text-slate-400"
        >
          <User className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Perfil</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">MeuClick</span>
            <span aria-hidden="true">·</span>
            <span>Plataforma Inteligente de Fotos para Eventos</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Reconhecimento Facial Gemini 3.8 Flash Vision</span>
            <span aria-hidden="true">·</span>
            <span>Entrega no WhatsApp</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      {currentEvent && (
        <>
          <SelfieModal
            isOpen={isSelfieModalOpen}
            onClose={() => setIsSelfieModalOpen(false)}
            event={currentEvent}
            onMatchesFound={handleMatchesFound}
          />

          <MultiUploadModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            event={currentEvent}
            onUploadSuccess={loadEvents}
          />

          <QRCodeModal
            isOpen={isQRModalOpen}
            onClose={() => setIsQRModalOpen(false)}
            event={currentEvent}
          />

          <PhotoLightbox
            photo={selectedLightboxPhoto}
            onClose={() => setSelectedLightboxPhoto(null)}
            event={currentEvent}
            allPhotos={currentEvent.photos || []}
            onNavigate={(p) => setSelectedLightboxPhoto(p)}
            purchasedPhotoIds={purchasedPhotoIds}
            onOpenCheckout={(p) => setSelectedCheckoutPhoto(p)}
          />

          {selectedCheckoutPhoto && (
            <CheckoutModal
              isOpen={Boolean(selectedCheckoutPhoto)}
              onClose={() => setSelectedCheckoutPhoto(null)}
              photo={selectedCheckoutPhoto}
              event={currentEvent}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}
        </>
      )}

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onEventCreated={(newEvent) => {
          setEvents((prev) => [newEvent, ...prev]);
          setCurrentEvent(newEvent);
        }}
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onSelectPlan={() => {}}
      />

    </div>
  );
}
