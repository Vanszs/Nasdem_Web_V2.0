// React Query hooks for API integration
// Note: Install @tanstack/react-query and sonner packages to use these hooks
// npm install @tanstack/react-query sonner

// Import API services
import { newsApi, newsQueryKeys } from './news';
import { mediaApi, albumsApi, mediaQueryKeys, albumsQueryKeys } from './media';
import { personsApi, rolesApi, dapilsApi, personsQueryKeys, rolesQueryKeys, dapilsQueryKeys } from './organization';
import { dashboardApi, dashboardQueryKeys } from './dashboard';

// Mock implementations for when React Query is not installed
const mockUseQuery = (config: any) => ({ 
  data: null, 
  isLoading: false, 
  error: null,
  refetch: () => Promise.resolve({ data: null }),
  isError: false,
  isSuccess: false
});

const mockUseMutation = (config: any) => ({ 
  mutate: (data?: any) => {
    console.log('Mock mutation called with:', data);
    if (config.onSuccess) config.onSuccess(data, data);
  },
  mutateAsync: (data?: any) => {
    console.log('Mock mutation async called with:', data);
    return Promise.resolve(data);
  },
  isLoading: false,
  isError: false,
  error: null
});

const mockUseQueryClient = () => ({ 
  invalidateQueries: (options?: any) => {
    console.log('Mock invalidate queries called with:', options);
  }
});

const mockToast = { 
  success: (msg: string) => console.log('✅ Success:', msg), 
  error: (msg: string) => console.error('❌ Error:', msg)
};

// News hooks
export const useNews = (filters = {}) => {
  return mockUseQuery({
    queryKey: newsQueryKeys.list(filters),
    queryFn: () => newsApi.getAll(filters),
  });
};

export const useNewsById = (id: string) => {
  return mockUseQuery({
    queryKey: newsQueryKeys.detail(id),
    queryFn: () => newsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateNews = () => {
  const queryClient = mockUseQueryClient();
  
  return mockUseMutation({
    mutationFn: newsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsQueryKeys.lists() });
      mockToast.success('Berita berhasil dibuat');
    },
    onError: (error: any) => {
      mockToast.error('Gagal membuat berita: ' + error.message);
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = mockUseQueryClient();
  
  return mockUseMutation({
    mutationFn: newsApi.update,
    onSuccess: (data: any, variables: any) => {
      queryClient.invalidateQueries({ queryKey: newsQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: newsQueryKeys.detail(variables.id) });
      mockToast.success('Berita berhasil diupdate');
    },
    onError: (error: any) => {
      mockToast.error('Gagal mengupdate berita: ' + error.message);
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = mockUseQueryClient();
  
  return mockUseMutation({
    mutationFn: newsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsQueryKeys.lists() });
      mockToast.success('Berita berhasil dihapus');
    },
    onError: (error: any) => {
      mockToast.error('Gagal menghapus berita: ' + error.message);
    },
  });
};

export const usePinNews = () => {
  const queryClient = mockUseQueryClient();
  
  return mockUseMutation({
    mutationFn: newsApi.pin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsQueryKeys.lists() });
      mockToast.success('Berita berhasil di-pin');
    },
    onError: (error: any) => {
      mockToast.error('Gagal mem-pin berita: ' + error.message);
    },
  });
};

export const useUnpinNews = () => {
  const queryClient = mockUseQueryClient();
  
  return mockUseMutation({
    mutationFn: newsApi.unpin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsQueryKeys.lists() });
      mockToast.success('Berita berhasil di-unpin');
    },
    onError: (error: any) => {
      mockToast.error('Gagal meng-unpin berita: ' + error.message);
    },
  });
};

// Media hooks
export const useMedia = (filters = {}) => {
  return mockUseQuery({
    queryKey: mediaQueryKeys.list(filters),
    queryFn: () => mediaApi.getAll(filters),
  });
};

export const useUploadMedia = () => {
  const queryClient = mockUseQueryClient();
  
  return mockUseMutation({
    mutationFn: mediaApi.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaQueryKeys.lists() });
      mockToast.success('Media berhasil diupload');
    },
    onError: (error: any) => {
      mockToast.error('Gagal mengupload media: ' + error.message);
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = mockUseQueryClient();
  
  return mockUseMutation({
    mutationFn: mediaApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaQueryKeys.lists() });
      mockToast.success('Media berhasil dihapus');
    },
    onError: (error: any) => {
      mockToast.error('Gagal menghapus media: ' + error.message);
    },
  });
};

// Albums hooks
export const useAlbums = () => {
  return mockUseQuery({
    queryKey: albumsQueryKeys.all,
    queryFn: () => albumsApi.getAll(),
  });
};

export const useCreateAlbum = () => {
  const queryClient = mockUseQueryClient();
  
  return mockUseMutation({
    mutationFn: albumsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumsQueryKeys.all });
      mockToast.success('Album berhasil dibuat');
    },
    onError: (error: any) => {
      mockToast.error('Gagal membuat album: ' + error.message);
    },
  });
};

// Persons hooks
export const usePersons = (filters = {}) => {
  return mockUseQuery({
    queryKey: personsQueryKeys.list(filters),
    queryFn: () => personsApi.getAll(filters),
  });
};

export const usePersonById = (id: string) => {
  return mockUseQuery({
    queryKey: personsQueryKeys.detail(id),
    queryFn: () => personsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreatePerson = () => {
  const queryClient = mockUseQueryClient();
  
  return mockUseMutation({
    mutationFn: personsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personsQueryKeys.lists() });
      mockToast.success('Person berhasil dibuat');
    },
    onError: (error: any) => {
      mockToast.error('Gagal membuat person: ' + error.message);
    },
  });
};

export const useUpdatePerson = () => {
  const queryClient = mockUseQueryClient();
  
  return mockUseMutation({
    mutationFn: personsApi.update,
    onSuccess: (data: any, variables: any) => {
      queryClient.invalidateQueries({ queryKey: personsQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: personsQueryKeys.detail(variables.id) });
      mockToast.success('Person berhasil diupdate');
    },
    onError: (error: any) => {
      mockToast.error('Gagal mengupdate person: ' + error.message);
    },
  });
};

export const useDeletePerson = () => {
  const queryClient = mockUseQueryClient();
  
  return mockUseMutation({
    mutationFn: personsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personsQueryKeys.lists() });
      mockToast.success('Person berhasil dihapus');
    },
    onError: (error: any) => {
      mockToast.error('Gagal menghapus person: ' + error.message);
    },
  });
};

// Roles hooks
export const useRoles = (filters = {}) => {
  return mockUseQuery({
    queryKey: rolesQueryKeys.list(filters),
    queryFn: () => rolesApi.getAll(filters),
  });
};

export const useRolesByUnit = (unit: string, area?: string) => {
  return mockUseQuery({
    queryKey: rolesQueryKeys.byUnit(unit, area),
    queryFn: () => rolesApi.getByUnit(unit, area),
    enabled: !!unit,
  });
};

export const useOrganizationStructure = (unit: string) => {
  return mockUseQuery({
    queryKey: rolesQueryKeys.structure(unit),
    queryFn: () => rolesApi.getStructure(unit),
    enabled: !!unit,
  });
};

export const useCreateRole = () => {
  const queryClient = mockUseQueryClient();
  
  return mockUseMutation({
    mutationFn: rolesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesQueryKeys.lists() });
      mockToast.success('Jabatan berhasil dibuat');
    },
    onError: (error: any) => {
      mockToast.error('Gagal membuat jabatan: ' + error.message);
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = mockUseQueryClient();
  
  return mockUseMutation({
    mutationFn: rolesApi.update,
    onSuccess: (data: any, variables: any) => {
      queryClient.invalidateQueries({ queryKey: rolesQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rolesQueryKeys.detail(variables.id) });
      mockToast.success('Jabatan berhasil diupdate');
    },
    onError: (error: any) => {
      mockToast.error('Gagal mengupdate jabatan: ' + error.message);
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = mockUseQueryClient();
  
  return mockUseMutation({
    mutationFn: rolesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesQueryKeys.lists() });
      mockToast.success('Jabatan berhasil dihapus');
    },
    onError: (error: any) => {
      mockToast.error('Gagal menghapus jabatan: ' + error.message);
    },
  });
};

// Dapils hooks
export const useDapils = () => {
  return mockUseQuery({
    queryKey: dapilsQueryKeys.lists(),
    queryFn: () => dapilsApi.getAll(),
  });
};

export const useDapilById = (id: number) => {
  return mockUseQuery({
    queryKey: dapilsQueryKeys.detail(id),
    queryFn: () => dapilsApi.getById(id),
    enabled: !!id,
  });
};

export const useUpdateDapil = () => {
  const queryClient = mockUseQueryClient();
  
  return mockUseMutation({
    mutationFn: dapilsApi.update,
    onSuccess: (data: any, variables: any) => {
      queryClient.invalidateQueries({ queryKey: dapilsQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dapilsQueryKeys.detail(variables.id) });
      mockToast.success('Dapil berhasil diupdate');
    },
    onError: (error: any) => {
      mockToast.error('Gagal mengupdate dapil: ' + error.message);
    },
  });
};

// Dashboard hooks
export const useDashboardStats = (filters = {}) => {
  return mockUseQuery({
    queryKey: dashboardQueryKeys.stats(filters),
    queryFn: () => dashboardApi.getStats(filters),
  });
};

export const useAuditLogs = (page = 1, limit = 50) => {
  return mockUseQuery({
    queryKey: dashboardQueryKeys.auditLogs(page, limit),
    queryFn: () => dashboardApi.getAuditLogs(page, limit),
  });
};

export const useSystemHealth = () => {
  return mockUseQuery({
    queryKey: dashboardQueryKeys.health(),
    queryFn: () => dashboardApi.getSystemHealth(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useNewsStats = (timeRange: '7d' | '30d' | '90d' | '1y' = '30d') => {
  return mockUseQuery({
    queryKey: dashboardQueryKeys.newsStats(timeRange),
    queryFn: () => dashboardApi.getNewsStats(timeRange),
  });
};

export const useMediaStats = (timeRange: '7d' | '30d' | '90d' | '1y' = '30d') => {
  return mockUseQuery({
    queryKey: dashboardQueryKeys.mediaStats(timeRange),
    queryFn: () => dashboardApi.getMediaStats(timeRange),
  });
};

export const useOrganizationOverview = () => {
  return mockUseQuery({
    queryKey: dashboardQueryKeys.organizationOverview(),
    queryFn: () => dashboardApi.getOrganizationOverview(),
  });
};
