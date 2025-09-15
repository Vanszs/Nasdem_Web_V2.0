import { apiClient, ApiResponse, PaginatedResponse } from './client';
import { API_ENDPOINTS } from './config';
import type { News } from '@/types';

export interface CreateNewsRequest {
  title: string;
  slug?: string;
  summary?: string;
  content: string;
  coverUrl?: string;
  tags: string[];
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED';
  scheduledAt?: string;
  author: string;
}

export interface UpdateNewsRequest extends Partial<CreateNewsRequest> {
  id: string;
}

export interface NewsFilters {
  status?: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED' | 'all';
  search?: string;
  author?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// News API service
export const newsApi = {
  // Get all news with optional filters
  getAll: async (filters: NewsFilters = {}): Promise<PaginatedResponse<News>> => {
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
    const endpoint = queryString ? `${API_ENDPOINTS.news.list}?${queryString}` : API_ENDPOINTS.news.list;
    
    return apiClient.get<PaginatedResponse<News>>(endpoint);
  },

  // Get single news by ID
  getById: async (id: string): Promise<ApiResponse<News>> => {
    return apiClient.get<ApiResponse<News>>(`${API_ENDPOINTS.news.list}/${id}`);
  },

  // Create new news
  create: async (data: CreateNewsRequest): Promise<ApiResponse<News>> => {
    return apiClient.post<ApiResponse<News>>(API_ENDPOINTS.news.create, data);
  },

  // Update existing news
  update: async (data: UpdateNewsRequest): Promise<ApiResponse<News>> => {
    const { id, ...updateData } = data;
    return apiClient.put<ApiResponse<News>>(API_ENDPOINTS.news.update(id), updateData);
  },

  // Delete news
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.news.delete(id));
  },

  // Pin news (only one can be pinned at a time)
  pin: async (id: string): Promise<ApiResponse<News>> => {
    return apiClient.post<ApiResponse<News>>(API_ENDPOINTS.news.pin(id));
  },

  // Unpin news
  unpin: async (id: string): Promise<ApiResponse<News>> => {
    return apiClient.post<ApiResponse<News>>(API_ENDPOINTS.news.unpin(id));
  },

  // Publish news
  publish: async (id: string): Promise<ApiResponse<News>> => {
    return apiClient.post<ApiResponse<News>>(API_ENDPOINTS.news.publish(id));
  },

  // Archive news
  archive: async (id: string): Promise<ApiResponse<News>> => {
    return apiClient.post<ApiResponse<News>>(API_ENDPOINTS.news.archive(id));
  },

  // Get published news for public view
  getPublished: async (limit = 10): Promise<ApiResponse<News[]>> => {
    return apiClient.get<ApiResponse<News[]>>(`${API_ENDPOINTS.news.list}/published?limit=${limit}`);
  },

  // Get pinned news
  getPinned: async (): Promise<ApiResponse<News | null>> => {
    return apiClient.get<ApiResponse<News | null>>(`${API_ENDPOINTS.news.list}/pinned`);
  },

  // Search news with full-text search
  search: async (query: string, filters: Omit<NewsFilters, 'search'> = {}): Promise<PaginatedResponse<News>> => {
    const params = new URLSearchParams({ search: query });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    return apiClient.get<PaginatedResponse<News>>(`${API_ENDPOINTS.news.list}/search?${params.toString()}`);
  },

  // Get news statistics
  getStats: async (): Promise<ApiResponse<{
    total: number;
    published: number;
    draft: number;
    scheduled: number;
    archived: number;
    pinned: number;
    thisMonth: number;
  }>> => {
    return apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.news.list}/stats`);
  },
};

// React Query keys for news
export const newsQueryKeys = {
  all: ['news'] as const,
  lists: () => [...newsQueryKeys.all, 'list'] as const,
  list: (filters: NewsFilters) => [...newsQueryKeys.lists(), filters] as const,
  details: () => [...newsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...newsQueryKeys.details(), id] as const,
  stats: () => [...newsQueryKeys.all, 'stats'] as const,
  published: () => [...newsQueryKeys.all, 'published'] as const,
  pinned: () => [...newsQueryKeys.all, 'pinned'] as const,
  search: (query: string, filters: Omit<NewsFilters, 'search'>) => 
    [...newsQueryKeys.all, 'search', query, filters] as const,
};
