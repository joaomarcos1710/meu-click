export type UserRole = 'owner' | 'photographer' | 'guest';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  companyName?: string;
}

export interface EventFolder {
  id: string;
  name: string;
  description?: string;
  photoCount?: number;
}

export interface Photo {
  id: string;
  eventId: string;
  folderId?: string;
  url: string;
  watermarkedUrl?: string;
  title?: string;
  uploadedBy: 'photographer' | 'guest' | 'staff';
  uploaderName: string;
  uploadedAt: string;
  tags?: string[];
  faceDetected?: boolean;
  faceCount?: number;
  width?: number;
  height?: number;
}

export interface EventItem {
  id: string;
  code: string;
  title: string;
  date: string;
  location: string;
  coverUrl: string;
  watermarkText: string;
  pricePerPhoto: number; // in BRL, e.g. 15.00
  currency: string;
  isPublic: boolean;
  organizerName: string;
  organizerPhone: string;
  folders: EventFolder[];
  photos: Photo[];
  totalPhotos?: number;
  createdAt: string;
}

export interface FaceMatch {
  photoId: string;
  matched: boolean;
  confidence: number;
  reason: string;
}

export interface MatchFaceResponse {
  success: boolean;
  matches: FaceMatch[];
  matchedPhotoIds: string[];
  totalAnalyzed: number;
  processingTimeMs: number;
  aiPowered: boolean;
  message?: string;
}
