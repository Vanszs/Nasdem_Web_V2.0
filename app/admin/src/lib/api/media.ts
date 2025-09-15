import { apiClient, ApiResponse, PaginatedResponse } from './client';
import { API_ENDPOINTS } from './config';
import type { Media, Album } from '../types';

export interface CreateMediaRequest {
  title: string;
  altText?: string;
  file: File;
  ratio?: '1:1' | '16:9' | 'original';
  albumId?: string;
  tags?: string[];
}

export interface UpdateMediaRequest {
  id: string;
  title?: string;
  altText?: string;
  ratio?: '1:1' | '16:9' | 'original';
  albumId?: string;
  tags?: string[];
}

export interface MediaFilters {
  albumId?: string;
  search?: string;
  mimeType?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface CreateAlbumRequest {
  name: string;
  description?: string;
  coverMediaId?: string;
  sortOrder?: number;
}

export interface UpdateAlbumRequest extends Partial<CreateAlbumRequest> {
  id: string;
}

// Media API service
export const mediaApi = {
  // Get all media with optional filters
  getAll: async (filters: MediaFilters = {}): Promise<PaginatedResponse<Media>> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.media.list}?${queryString}` : API_ENDPOINTS.media.list;
    
    return apiClient.get<PaginatedResponse<Media>>(endpoint);
  },

  // Get single media by ID
  getById: async (id: string): Promise<ApiResponse<Media>> => {
    return apiClient.get<ApiResponse<Media>>(`${API_ENDPOINTS.media.list}/${id}`);
  },

  // Upload new media
  upload: async (data: CreateMediaRequest): Promise<ApiResponse<Media>> => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('title', data.title);
    
    if (data.altText) formData.append('altText', data.altText);
    if (data.ratio) formData.append('ratio', data.ratio);
    if (data.albumId) formData.append('albumId', data.albumId);
    if (data.tags) {
      data.tags.forEach(tag => formData.append('tags[]', tag));
    }

    return apiClient.upload<ApiResponse<Media>>(API_ENDPOINTS.media.upload, formData);
  },

  // Update existing media
  update: async (data: UpdateMediaRequest): Promise<ApiResponse<Media>> => {
    const { id, ...updateData } = data;
    return apiClient.put<ApiResponse<Media>>(API_ENDPOINTS.media.update(id), updateData);
  },

  // Delete media
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.media.delete(id));
  },

  // Get media statistics
  getStats: async (): Promise<ApiResponse<{
    total: number;
    totalSizeMB: number;
    albums: number;
    thisMonth: number;
  }>> => {
    return apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.media.list}/stats`);
  },

  // Bulk upload multiple files
  bulkUpload: async (files: File[], albumId?: string): Promise<ApiResponse<Media[]>> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files[]', file));
    if (albumId) formData.append('albumId', albumId);

    return apiClient.upload<ApiResponse<Media[]>>(`${API_ENDPOINTS.media.upload}/bulk`, formData);
  },
};

// Albums API service
export const albumsApi = {
  // Get all albums
  getAll: async (): Promise<ApiResponse<Album[]>> => {
    return apiClient.get<ApiResponse<Album[]>>(API_ENDPOINTS.albums.list);
  },

  // Get single album by ID
  getById: async (id: string): Promise<ApiResponse<Album>> => {
    return apiClient.get<ApiResponse<Album>>(`${API_ENDPOINTS.albums.list}/${id}`);
  },

  // Create new album
  create: async (data: CreateAlbumRequest): Promise<ApiResponse<Album>> => {
    return apiClient.post<ApiResponse<Album>>(API_ENDPOINTS.albums.create, data);
  },

  // Update existing album
  update: async (data: UpdateAlbumRequest): Promise<ApiResponse<Album>> => {
    const { id, ...updateData } = data;
    return apiClient.put<ApiResponse<Album>>(API_ENDPOINTS.albums.update(id), updateData);
  },

  // Delete album
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.albums.delete(id));
  },

  // Get album with its media
  getWithMedia: async (id: string): Promise<ApiResponse<Album & { media: Media[] }>> => {
    return apiClient.get<ApiResponse<Album & { media: Media[] }>>(`${API_ENDPOINTS.albums.list}/${id}/media`);
  },
};

// React Query keys for media
export const mediaQueryKeys = {
  all: ['media'] as const,
  lists: () => [...mediaQueryKeys.all, 'list'] as const,
  list: (filters: MediaFilters) => [...mediaQueryKeys.lists(), filters] as const,
  details: () => [...mediaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...mediaQueryKeys.details(), id] as const,
  stats: () => [...mediaQueryKeys.all, 'stats'] as const,
};

// React Query keys for albums
export const albumsQueryKeys = {
  all: ['albums'] as const,
  lists: () => [...albumsQueryKeys.all, 'list'] as const,
  details: () => [...albumsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...albumsQueryKeys.details(), id] as const,
  withMedia: (id: string) => [...albumsQueryKeys.detail(id), 'media'] as const,
};
