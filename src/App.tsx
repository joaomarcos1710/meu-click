import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { EventHero } from './components/EventHero.js';
import { PhotoGallery } from './components/PhotoGallery.js';
import { OrganizerDashboard } from './components/OrganizerDashboard.js';
import { SelfieModal } from './components/SelfieModal.js';
import { MultiUploadModal } from './components/MultiUploadModal.js';
import { QRCodeModal } from './components/QRCodeModal.js';
import { PhotoLightbox } from './components/PhotoLightbox.js';
import { CheckoutModal } from './components/CheckoutModal.js';
import { CreateEventModal } from './components/CreateEventModal.js';
import { PricingModal } from './components/PricingModal.js';
import { Sparkles, Upload, QrCode, Camera, ShieldCheck, Heart } from 'lucide-react';
import type { EventItem, Photo } from './types.js';

export default function App() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [currentEvent, setCurrentEvent] = useState<EventItem | null>(null);
  const [currentView, setCurrentView] = useState<'guest' | 'organizer' | 'plans'>('guest');
  const [isDarkMode, setIsDarkMode] = useState(false);

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
        // If current event is not set or needs update
        if (!currentEvent) {
          // Check URL query param ?event=...
          const params = new URLSearchParams(window.location.search);
          const eventParam = params.get('event');
          const found = data.events.find((e: EventItem) => e.id === eventParam || e.code === eventParam);
          setCurrentEvent(found || data.events[0]);
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

  if (!currentEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Carregando MeuClick...</span>
        </div>
      </div>
    );
  }

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
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-8">
        {currentView === 'guest' ? (
          <>
            <EventHero
              currentEvent={currentEvent}
              allEvents={events}
              onSelectEvent={(ev) => {
                setCurrentEvent(ev);
                handleClearFaceFilter();
              }}
              onOpenSelfieModal={() => setIsSelfieModalOpen(true)}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onOpenQRModal={() => setIsQRModalOpen(true)}
            />

            <PhotoGallery
              photos={currentEvent.photos || []}
              event={currentEvent}
              matchedPhotoIds={matchedPhotoIds}
              confidenceMap={confidenceMap}
              purchasedPhotoIds={purchasedPhotoIds}
              onSelectPhoto={(p) => setSelectedLightboxPhoto(p)}
              onOpenSelfieModal={() => setIsSelfieModalOpen(true)}
              onOpenCheckout={(p) => setSelectedCheckoutPhoto(p)}
              onClearFaceFilter={handleClearFaceFilter}
            />
          </>
        ) : (
          <OrganizerDashboard
            event={currentEvent}
            purchasedPhotoIds={purchasedPhotoIds}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onOpenQR={() => setIsQRModalOpen(true)}
            onOpenCreateFolder={() => setIsUploadModalOpen(true)}
          />
        )}
      </main>

      {/* Mobile-First Floating Thumb Zone Bar (Fixed at bottom on small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => setIsSelfieModalOpen(true)}
          className="flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 py-1"
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-[10px] font-bold mt-0.5">Selfie IA</span>
        </button>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex flex-col items-center justify-center text-slate-700 dark:text-slate-300 py-1"
        >
          <Upload className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">+ Fotos</span>
        </button>

        <button
          onClick={() => setIsQRModalOpen(true)}
          className="flex flex-col items-center justify-center text-slate-700 dark:text-slate-300 py-1"
        >
          <QrCode className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">QR Code</span>
        </button>

        <button
          onClick={() => setCurrentView(currentView === 'guest' ? 'organizer' : 'guest')}
          className="flex flex-col items-center justify-center text-slate-700 dark:text-slate-300 py-1"
        >
          <Camera className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">
            {currentView === 'guest' ? 'Painel' : 'Galeria'}
          </span>
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
            <span>Reconhecimento Facial Gemini 3.8 Flash</span>
            <span aria-hidden="true">·</span>
            <span>Entrega Direta no WhatsApp</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
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
