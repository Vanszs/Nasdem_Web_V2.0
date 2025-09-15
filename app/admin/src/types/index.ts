export interface News {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  coverUrl?: string;
  tags: string[];
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
  scheduledAt?: string;
  publishedAt?: string;
  author: string;
  pinned: boolean; // Only ONE can be true across all news
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  title: string;
  alt: string;
  url: string;
  ratio: '1:1' | '16:9' | 'original';
  sizeKB: number;
  tags: string[];
  albumId?: string;
  createdAt: string;
  uploadedBy: string;
}

export interface Album {
  id: string;
  name: string;
  coverMediaId?: string;
  order: number;
}

export interface Person {
  id: string;
  fullName: string;
  photoUrl?: string;
  phone?: string;
  instagram?: string;
  x?: string;
  linkedin?: string;
}

export interface RoleEntry {
  id: string;
  unit: 'DPD' | 'SAYAP' | 'DPC' | 'DPRT';
  area?: string; // Dapil, Kecamatan, Desa
  positionTitle: string;
  personId: string;
  order: number;
  active: boolean;
  group?: string;
  meta?: Record<string, string>;
}

export interface Dapil {
  id: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  regions: string[];
  picPersonId?: string;
}