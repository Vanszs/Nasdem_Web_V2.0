import { apiClient, ApiResponse, PaginatedResponse } from './client';
import { API_ENDPOINTS } from './config';
import type { Person, RoleEntry, Dapil } from '../types';

export interface CreatePersonRequest {
  fullName: string;
  photoUrl?: string;
  phone?: string;
  email?: string;
  instagram?: string;
  x?: string;
  linkedin?: string;
  facebook?: string;
  bio?: string;
}

export interface UpdatePersonRequest extends Partial<CreatePersonRequest> {
  id: string;
}

export interface CreateRoleRequest {
  unit: 'DPD' | 'SAYAP' | 'DPC' | 'DPRT';
  area?: string;
  positionTitle: string;
  personId: string;
  sortOrder?: number;
  groupName?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateRoleRequest extends Partial<CreateRoleRequest> {
  id: string;
}

export interface RoleFilters {
  unit?: 'DPD' | 'SAYAP' | 'DPC' | 'DPRT';
  area?: string;
  groupName?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface PersonFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface UpdateDapilRequest {
  id: number;
  name?: string;
  regions?: string[];
  picPersonId?: string;
  description?: string;
}

// Persons API service
export const personsApi = {
  // Get all persons with optional filters
  getAll: async (filters: PersonFilters = {}): Promise<PaginatedResponse<Person>> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.persons.list}?${queryString}` : API_ENDPOINTS.persons.list;
    
    return apiClient.get<PaginatedResponse<Person>>(endpoint);
  },

  // Get single person by ID
  getById: async (id: string): Promise<ApiResponse<Person>> => {
    return apiClient.get<ApiResponse<Person>>(`${API_ENDPOINTS.persons.list}/${id}`);
  },

  // Create new person
  create: async (data: CreatePersonRequest): Promise<ApiResponse<Person>> => {
    return apiClient.post<ApiResponse<Person>>(API_ENDPOINTS.persons.create, data);
  },

  // Update existing person
  update: async (data: UpdatePersonRequest): Promise<ApiResponse<Person>> => {
    const { id, ...updateData } = data;
    return apiClient.put<ApiResponse<Person>>(API_ENDPOINTS.persons.update(id), updateData);
  },

  // Delete person
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.persons.delete(id));
  },

  // Search persons
  search: async (query: string): Promise<ApiResponse<Person[]>> => {
    return apiClient.get<ApiResponse<Person[]>>(`${API_ENDPOINTS.persons.list}/search?q=${encodeURIComponent(query)}`);
  },
};

// Roles API service
export const rolesApi = {
  // Get all roles with optional filters
  getAll: async (filters: RoleFilters = {}): Promise<PaginatedResponse<RoleEntry>> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.roles.list}?${queryString}` : API_ENDPOINTS.roles.list;
    
    return apiClient.get<PaginatedResponse<RoleEntry>>(endpoint);
  },

  // Get roles by unit (DPD, SAYAP, DPC, DPRT)
  getByUnit: async (unit: string, area?: string): Promise<ApiResponse<RoleEntry[]>> => {
    const params = area ? `?area=${encodeURIComponent(area)}` : '';
    return apiClient.get<ApiResponse<RoleEntry[]>>(`${API_ENDPOINTS.roles.byUnit(unit)}${params}`);
  },

  // Get single role by ID
  getById: async (id: string): Promise<ApiResponse<RoleEntry>> => {
    return apiClient.get<ApiResponse<RoleEntry>>(`${API_ENDPOINTS.roles.list}/${id}`);
  },

  // Create new role
  create: async (data: CreateRoleRequest): Promise<ApiResponse<RoleEntry>> => {
    return apiClient.post<ApiResponse<RoleEntry>>(API_ENDPOINTS.roles.create, data);
  },

  // Update existing role
  update: async (data: UpdateRoleRequest): Promise<ApiResponse<RoleEntry>> => {
    const { id, ...updateData } = data;
    return apiClient.put<ApiResponse<RoleEntry>>(API_ENDPOINTS.roles.update(id), updateData);
  },

  // Delete role
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.roles.delete(id));
  },

  // Get organization structure with person details
  getStructure: async (unit: string): Promise<ApiResponse<(RoleEntry & { person: Person })[]>> => {
    return apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.roles.list}/structure/${unit}`);
  },

  // Bulk update role orders
  updateOrders: async (updates: { id: string; sortOrder: number }[]): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>(`${API_ENDPOINTS.roles.list}/bulk-update-order`, { updates });
  },
};

// Dapils API service
export const dapilsApi = {
  // Get all dapils
  getAll: async (): Promise<ApiResponse<Dapil[]>> => {
    return apiClient.get<ApiResponse<Dapil[]>>(API_ENDPOINTS.dapils.list);
  },

  // Get single dapil by ID
  getById: async (id: number): Promise<ApiResponse<Dapil>> => {
    return apiClient.get<ApiResponse<Dapil>>(`${API_ENDPOINTS.dapils.list}/${id}`);
  },

  // Update existing dapil
  update: async (data: UpdateDapilRequest): Promise<ApiResponse<Dapil>> => {
    const { id, ...updateData } = data;
    return apiClient.put<ApiResponse<Dapil>>(API_ENDPOINTS.dapils.update(id), updateData);
  },

  // Get dapil with PIC person details
  getWithPerson: async (id: number): Promise<ApiResponse<Dapil & { picPerson?: Person }>> => {
    return apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.dapils.list}/${id}/with-person`);
  },
};

// React Query keys for persons
export const personsQueryKeys = {
  all: ['persons'] as const,
  lists: () => [...personsQueryKeys.all, 'list'] as const,
  list: (filters: PersonFilters) => [...personsQueryKeys.lists(), filters] as const,
  details: () => [...personsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...personsQueryKeys.details(), id] as const,
  search: (query: string) => [...personsQueryKeys.all, 'search', query] as const,
};

// React Query keys for roles
export const rolesQueryKeys = {
  all: ['roles'] as const,
  lists: () => [...rolesQueryKeys.all, 'list'] as const,
  list: (filters: RoleFilters) => [...rolesQueryKeys.lists(), filters] as const,
  details: () => [...rolesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...rolesQueryKeys.details(), id] as const,
  byUnit: (unit: string, area?: string) => [...rolesQueryKeys.all, 'unit', unit, area] as const,
  structure: (unit: string) => [...rolesQueryKeys.all, 'structure', unit] as const,
};

// React Query keys for dapils
export const dapilsQueryKeys = {
  all: ['dapils'] as const,
  lists: () => [...dapilsQueryKeys.all, 'list'] as const,
  details: () => [...dapilsQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...dapilsQueryKeys.details(), id] as const,
  withPerson: (id: number) => [...dapilsQueryKeys.detail(id), 'person'] as const,
};
