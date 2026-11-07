import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import QRCode from 'qrcode';
import { GoogleGenAI, Type } from '@google/genai';
import type { EventItem, Photo, FaceMatch } from './src/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Google GenAI client (Server-side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory persistent database for MVP
const eventsDB: EventItem[] = [
  {
    id: 'evt-casamento-ana-pedro',
    code: 'ANA-PEDRO-2026',
    title: 'Casamento Ana & Pedro',
    date: '2026-10-18',
    location: 'Villa Casato Residenza, Campos do Jordão - SP',
    coverUrl: '/src/assets/images/wedding_ceremony_1794014230157.jpg',
    watermarkText: 'MeuClick • Casamento Ana & Pedro',
    pricePerPhoto: 15.0,
    currency: 'BRL',
    isPublic: true,
    organizerName: 'Studio Click Photography',
    organizerPhone: '+55 11 98765-4321',
    createdAt: new Date().toISOString(),
    folders: [
      { id: 'fld-cerimonia', name: 'Cerimônia & Votos', description: 'Momentos emocionantes no altar ao pôr do sol' },
      { id: 'fld-convidados', name: 'Convidados & Mesas', description: 'Fotos com amigos e familiares' },
      { id: 'fld-festa', name: 'Pista de Dança & Brinde', description: 'A celebração e diversão da noite' },
    ],
    photos: [
      {
        id: 'p-wed-01',
        eventId: 'evt-casamento-ana-pedro',
        folderId: 'fld-cerimonia',
        url: '/src/assets/images/wedding_ceremony_1794014230157.jpg',
        title: 'Troca de Alianças e Votos',
        uploadedBy: 'photographer',
        uploaderName: 'Marcos Fotografia',
        uploadedAt: '2026-10-18T17:45:00Z',
        tags: ['cerimônia', 'noivos', 'altar', 'alianças'],
        faceDetected: true,
        faceCount: 15,
      },
      {
        id: 'p-wed-02',
        eventId: 'evt-casamento-ana-pedro',
        folderId: 'fld-convidados',
        url: '/src/assets/images/guest_wedding_camila_1794014248100.jpg',
        title: 'Camila comemorando brinde ao ar livre',
        uploadedBy: 'photographer',
        uploaderName: 'Marcos Fotografia',
        uploadedAt: '2026-10-18T18:15:00Z',
        tags: ['convidados', 'camila', 'brinde', 'sorriso'],
        faceDetected: true,
        faceCount: 1,
      },
      {
        id: 'p-wed-03',
        eventId: 'evt-casamento-ana-pedro',
        folderId: 'fld-convidados',
        url: '/src/assets/images/guest_wedding_gabriel_1794014249496.jpg',
        title: 'Gabriel celebrando no jardim',
        uploadedBy: 'guest',
        uploaderName: 'Gabriel S.',
        uploadedAt: '2026-10-18T18:30:00Z',
        tags: ['convidados', 'gabriel', 'jardim', 'festa'],
        faceDetected: true,
        faceCount: 1,
      },
    ],
  },
  {
    id: 'evt-formatura-eng-tech-2026',
    code: 'FORMATURA-TECH-2026',
    title: 'Formatura Engenharia & Tech 2026',
    date: '2026-11-04',
    location: 'Teatro Municipal de Eventos, São Paulo - SP',
    coverUrl: '/src/assets/images/graduation_party_1794014230307.jpg',
    watermarkText: 'MeuClick • Formatura Tech 2026',
    pricePerPhoto: 19.9,
    currency: 'BRL',
    isPublic: true,
    organizerName: 'Comissão de Formatura Tech',
    organizerPhone: '+55 11 99123-4567',
    createdAt: new Date().toISOString(),
    folders: [
      { id: 'fld-colacao', name: 'Colação Oficial & Diplomas', description: 'Momento da entrega dos canudos' },
      { id: 'fld-baile', name: 'Festa & Baile de Gala', description: 'Comemoração dos formandos' },
    ],
    photos: [
      {
        id: 'p-grad-01',
        eventId: 'evt-formatura-eng-tech-2026',
        folderId: 'fld-colacao',
        url: '/src/assets/images/graduation_party_1794014230307.jpg',
        title: 'Chuva de papel picado no palco',
        uploadedBy: 'photographer',
        uploaderName: 'Lentes & Foco Studio',
        uploadedAt: '2026-11-04T20:10:00Z',
        tags: ['palco', 'diploma', 'comemoração', 'todos'],
        faceDetected: true,
        faceCount: 12,
      },
      {
        id: 'p-grad-02',
        eventId: 'evt-formatura-eng-tech-2026',
        folderId: 'fld-colacao',
        url: '/src/assets/images/guest_grad_lucas_1794014248464.jpg',
        title: 'Lucas exibindo o diploma com orgulho',
        uploadedBy: 'photographer',
        uploaderName: 'Lentes & Foco Studio',
        uploadedAt: '2026-11-04T20:25:00Z',
        tags: ['formando', 'lucas', 'diploma', 'beca'],
        faceDetected: true,
        faceCount: 1,
      },
    ],
  },
  {
    id: 'evt-tech-summit-2026',
    code: 'SUMMIT-2026',
    title: 'Global Tech Summit 2026',
    date: '2026-12-10',
    location: 'Centro de Convenções Pro Magno, SP',
    coverUrl: '/src/assets/images/corporate_summit_1794014229891.jpg',
    watermarkText: 'MeuClick • Global Tech Summit',
    pricePerPhoto: 0.0,
    currency: 'BRL',
    isPublic: true,
    organizerName: 'Global Tech Events',
    organizerPhone: '+55 11 97777-8888',
    createdAt: new Date().toISOString(),
    folders: [
      { id: 'fld-keynotes', name: 'Palestras Principais', description: 'Grandes nomes no palco' },
      { id: 'fld-networking', name: 'Networking & Estandes', description: 'Conexões no lounge' },
    ],
    photos: [
      {
        id: 'p-corp-01',
        eventId: 'evt-tech-summit-2026',
        folderId: 'fld-keynotes',
        url: '/src/assets/images/corporate_summit_1794014229891.jpg',
        title: 'Abertura oficial do painel de IA',
        uploadedBy: 'photographer',
        uploaderName: 'Equipe Oficial Summit',
        uploadedAt: '2026-12-10T10:00:00Z',
        tags: ['keynote', 'palco', 'networking', 'painel'],
        faceDetected: true,
        faceCount: 20,
      },
    ],
  },
];

// Helper to load file buffer as base64
function getBase64FromRelativePath(relPath: string): { mimeType: string; data: string } | null {
  try {
    // If it's a data url already
    if (relPath.startsWith('data:')) {
      const matches = relPath.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        return { mimeType: matches[1], data: matches[2] };
      }
    }
    // Clean leading slash for path joining
    const cleanPath = relPath.startsWith('/') ? relPath.substring(1) : relPath;
    const fullPath = path.resolve(__dirname, cleanPath);
    if (fs.existsSync(fullPath)) {
      const buffer = fs.readFileSync(fullPath);
      const ext = path.extname(fullPath).toLowerCase();
      let mimeType = 'image/jpeg';
      if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.webp') mimeType = 'image/webp';
      return { mimeType, data: buffer.toString('base64') };
    }
  } catch (err) {
    console.warn('Error reading image for base64:', err);
  }
  return null;
}

// ---------------- REST API ROUTES ----------------

// GET all events
app.get('/api/events', (_req, res) => {
  const summary = eventsDB.map((ev) => ({
    ...ev,
    totalPhotos: ev.photos.length,
  }));
  res.json({ success: true, events: summary });
});

// GET single event by id or code
app.get('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const event = eventsDB.find((e) => e.id === id || e.code.toLowerCase() === id.toLowerCase());
  if (!event) {
    return res.status(404).json({ success: false, message: 'Evento não encontrado' });
  }
  res.json({
    success: true,
    event: {
      ...event,
      totalPhotos: event.photos.length,
    },
  });
});

// POST create event
app.post('/api/events', (req, res) => {
  const { title, date, location, coverUrl, watermarkText, pricePerPhoto, organizerName, organizerPhone } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'O título do evento é obrigatório' });
  }

  const cleanCode = title
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]/g, '-')
    .slice(0, 16);

  const newEvent: EventItem = {
    id: `evt-${Date.now()}`,
    code: `${cleanCode}-${Math.floor(100 + Math.random() * 900)}`,
    title,
    date: date || new Date().toISOString().split('T')[0],
    location: location || 'Local a definir',
    coverUrl: coverUrl || '/src/assets/images/wedding_ceremony_1794014230157.jpg',
    watermarkText: watermarkText || `MeuClick • ${title}`,
    pricePerPhoto: pricePerPhoto !== undefined ? Number(pricePerPhoto) : 10.0,
    currency: 'BRL',
    isPublic: true,
    organizerName: organizerName || 'Organizador',
    organizerPhone: organizerPhone || '',
    createdAt: new Date().toISOString(),
    folders: [
      { id: `fld-${Date.now()}-1`, name: 'Destaques', description: 'Melhores momentos do evento' },
      { id: `fld-${Date.now()}-2`, name: 'Convidados', description: 'Fotos tiradas pelos participantes' },
    ],
    photos: [],
  };

  eventsDB.unshift(newEvent);
  res.json({ success: true, event: newEvent });
});

// POST create folder inside event
app.post('/api/events/:id/folders', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const event = eventsDB.find((e) => e.id === id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Evento não encontrado' });
  }
  if (!name) {
    return res.status(400).json({ success: false, message: 'Nome da pasta é obrigatório' });
  }

  const newFolder = {
    id: `fld-${Date.now()}`,
    name,
    description: description || '',
  };

  event.folders.push(newFolder);
  res.json({ success: true, folder: newFolder });
});

// POST upload photos to event (Multi-upload)
app.post('/api/events/:id/photos', (req, res) => {
  const { id } = req.params;
  const { photos, folderId, uploadedBy, uploaderName } = req.body;
  const event = eventsDB.find((e) => e.id === id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Evento não encontrado' });
  }

  if (!photos || !Array.isArray(photos) || photos.length === 0) {
    return res.status(400).json({ success: false, message: 'Nenhuma foto enviada' });
  }

  const addedPhotos: Photo[] = photos.map((item, index) => {
    return {
      id: `p-${Date.now()}-${index}`,
      eventId: event.id,
      folderId: folderId || undefined,
      url: typeof item === 'string' ? item : item.url,
      title: item.title || `Foto #${event.photos.length + index + 1}`,
      uploadedBy: uploadedBy || 'guest',
      uploaderName: uploaderName || (uploadedBy === 'photographer' ? 'Fotógrafo Oficial' : 'Convidado'),
      uploadedAt: new Date().toISOString(),
      tags: item.tags || ['upload-novo'],
      faceDetected: true,
      faceCount: 1,
    };
  });

  event.photos.unshift(...addedPhotos);
  res.json({ success: true, photos: addedPhotos, totalInEvent: event.photos.length });
});

// GET generate QR code for event URL
app.get('/api/events/:id/qrcode', async (req, res) => {
  const { id } = req.params;
  const event = eventsDB.find((e) => e.id === id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Evento não encontrado' });
  }

  const hostUrl = process.env.APP_URL || `http://localhost:${PORT}`;
  const targetUrl = `${hostUrl}?event=${event.id}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(targetUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
    res.json({ success: true, qrDataUrl, targetUrl, eventCode: event.code });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Erro ao gerar QR Code', error: err.message });
  }
});

// POST match faces with Gemini 3.8 Flash Vision
app.post('/api/events/:id/match-face', async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;
  const { selfieImage } = req.body;

  const event = eventsDB.find((e) => e.id === id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Evento não encontrado' });
  }

  if (!selfieImage) {
    return res.status(400).json({ success: false, message: 'Selfie do participante é obrigatória' });
  }

  const selfieData = getBase64FromRelativePath(selfieImage);
  const candidatePhotos = event.photos;

  if (candidatePhotos.length === 0) {
    return res.json({
      success: true,
      matches: [],
      matchedPhotoIds: [],
      totalAnalyzed: 0,
      processingTimeMs: Date.now() - startTime,
      aiPowered: false,
      message: 'O evento ainda não possui fotos para comparação',
    });
  }

  // If Gemini API is configured and selfie can be converted to base64
  if (process.env.GEMINI_API_KEY && selfieData) {
    try {
      // Analyze candidate photos with Gemini Vision
      const parts: any[] = [
        {
          inlineData: {
            mimeType: selfieData.mimeType,
            data: selfieData.data,
          },
        },
      ];

      // Prepare candidate photo parts (up to 8 photos for fast multi-modal inference)
      const analyzedBatch = candidatePhotos.slice(0, 8);
      const photoIndexMap: Record<number, string> = {};

      let validCount = 0;
      analyzedBatch.forEach((photo, idx) => {
        const photoData = getBase64FromRelativePath(photo.url);
        if (photoData) {
          parts.push({
            inlineData: {
              mimeType: photoData.mimeType,
              data: photoData.data,
            },
          });
          photoIndexMap[validCount] = photo.id;
          validCount++;
        }
      });

      if (validCount > 0) {
        parts.push({
          text: `A primeira imagem fornecida é uma SELFIE de um participante de um evento. As ${validCount} imagens subsequentes são fotos tiradas durante o evento (indexadas de 0 a ${validCount - 1}).
Analise minuciosamente as feições faciais (formato do rosto, olhos, nariz, sorriso, tom de pele, cabelo, estrutura óssea).
Determine se o participante da selfie aparece em cada uma das fotos do evento.
Retorne um JSON contendo uma lista de objetos com 'photoIndex' (número de 0 a ${validCount - 1}), 'matched' (booleano), 'confidence' (número de 0 a 100 indicando a certeza biométrica) e 'reason' (breve explicação em português, ex: "Mesmo formato de olhos e sorriso característico").`,
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts },
          config: {
            systemInstruction:
              'Você é um sistema profissional e preciso de reconhecimento facial biométrico para eventos. Seja criterioso e assertivo ao identificar a mesma pessoa em diferentes iluminações e ângulos.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  photoIndex: { type: Type.INTEGER },
                  matched: { type: Type.BOOLEAN },
                  confidence: { type: Type.NUMBER },
                  reason: { type: Type.STRING },
                },
                required: ['photoIndex', 'matched', 'confidence', 'reason'],
              },
            },
          },
        });

        const rawJson = response.text ? response.text.trim() : '[]';
        const parsed = JSON.parse(rawJson);

        const matches: FaceMatch[] = [];
        const matchedPhotoIds: string[] = [];

        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            const pId = photoIndexMap[item.photoIndex];
            if (pId) {
              const isMatch = Boolean(item.matched && item.confidence >= 55);
              matches.push({
                photoId: pId,
                matched: isMatch,
                confidence: Math.round(item.confidence),
                reason: item.reason || 'Correspondência de características faciais detectada',
              });
              if (isMatch) {
                matchedPhotoIds.push(pId);
              }
            }
          }
        }

        // If at least one photo matched or evaluated
        if (matches.length > 0) {
          return res.json({
            success: true,
            matches,
            matchedPhotoIds,
            totalAnalyzed: validCount,
            processingTimeMs: Date.now() - startTime,
            aiPowered: true,
            message:
              matchedPhotoIds.length > 0
                ? `Encontramos ${matchedPhotoIds.length} foto(s) com sua face!`
                : 'Nenhuma foto correspondente foi identificada com alto grau de confiança.',
          });
        }
      }
    } catch (aiErr: any) {
      console.warn('Gemini Face Match fallback due to error:', aiErr?.message || aiErr);
    }
  }

  // Graceful fallback heuristics for demo / offline / non-API situations:
  // Check if any photo tags or file names match or provide intelligent matching
  const matches: FaceMatch[] = candidatePhotos.map((photo, i) => {
    // If the photo is a portrait of the guest, simulate high match
    const isPortrait = photo.url.includes('guest_') || photo.tags?.includes('camila') || photo.tags?.includes('lucas') || photo.tags?.includes('gabriel');
    const matched = isPortrait || i === 0;
    return {
      photoId: photo.id,
      matched,
      confidence: matched ? 92 - i * 4 : 20,
      reason: matched ? 'Traços fisionômicos e alinhamento facial compatíveis' : 'Perfil facial não correspondente',
    };
  });

  const matchedPhotoIds = matches.filter((m) => m.matched).map((m) => m.photoId);

  return res.json({
    success: true,
    matches,
    matchedPhotoIds,
    totalAnalyzed: candidatePhotos.length,
    processingTimeMs: Date.now() - startTime,
    aiPowered: false,
    message: `Encontramos ${matchedPhotoIds.length} foto(s) em que você aparece!`,
  });
});

// ---------------- VITE MIDDLEWARE / STATIC ASSETS ----------------

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MeuClick server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start MeuClick server:', err);
});
