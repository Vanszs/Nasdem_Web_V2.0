import { apiClient, ApiResponse } from './client';
import { API_ENDPOINTS } from './config';

export interface DashboardStats {
  totalNews: number;
  publishedNews: number;
  totalMedia: number;
  totalPersons: number;
  totalRoles: number;
  recentNews: Array<{
    id: string;
    title: string;
    publishDate: string;
    isPinned: boolean;
    status: 'DRAFT' | 'PUBLISHED';
  }>;
  recentMedia: Array<{
    id: string;
    fileName: string;
    filePath: string;
    uploadDate: string;
    albumName?: string;
  }>;
  newsPerMonth: Array<{
    month: string;
    published: number;
    draft: number;
  }>;
  rolesByUnit: Array<{
    unit: string;
    count: number;
  }>;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export interface SystemHealth {
  dbConnected: boolean;
  mediaFolderWritable: boolean;
  lastBackup?: string;
  diskUsage: {
    total: number;
    used: number;
    free: number;
  };
}

export interface DashboardFilters {
  dateFrom?: string;
  dateTo?: string;
  newsStatus?: 'DRAFT' | 'PUBLISHED';
}

// Dashboard API service
export const dashboardApi = {
  // Get main dashboard statistics
  getStats: async (filters: DashboardFilters = {}): Promise<ApiResponse<DashboardStats>> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.dashboard.stats}?${queryString}` : API_ENDPOINTS.dashboard.stats;
    
    return apiClient.get<ApiResponse<DashboardStats>>(endpoint);
  },

  // Get audit logs with pagination
  getAuditLogs: async (page = 1, limit = 50): Promise<ApiResponse<{
    logs: AuditLogEntry[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>> => {
    return apiClient.get<ApiResponse<any>>(
      `${API_ENDPOINTS.dashboard.auditLogs}?page=${page}&limit=${limit}`
    );
  },

  // Get system health status
  getSystemHealth: async (): Promise<ApiResponse<SystemHealth>> => {
    return apiClient.get<ApiResponse<SystemHealth>>(API_ENDPOINTS.dashboard.health);
  },

  // Get news statistics for charts
  getNewsStats: async (timeRange: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<ApiResponse<{
    dailyPublished: Array<{ date: string; count: number }>;
    statusDistribution: Array<{ status: string; count: number }>;
    pinnedCount: number;
  }>> => {
    return apiClient.get<ApiResponse<any>>(
      `${API_ENDPOINTS.dashboard.stats}/news?range=${timeRange}`
    );
  },

  // Get media statistics for charts
  getMediaStats: async (timeRange: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<ApiResponse<{
    dailyUploads: Array<{ date: string; count: number }>;
    fileTypeDistribution: Array<{ type: string; count: number; sizeTotal: number }>;
    albumDistribution: Array<{ albumName: string; count: number }>;
  }>> => {
    return apiClient.get<ApiResponse<any>>(
      `${API_ENDPOINTS.dashboard.stats}/media?range=${timeRange}`
    );
  },

  // Get organization structure overview
  getOrganizationOverview: async (): Promise<ApiResponse<{
    dpd: { totalRoles: number; filledRoles: number };
    sayap: { totalRoles: number; filledRoles: number };
    dpc: { totalRoles: number; filledRoles: number; totalAreas: number };
    dprt: { totalRoles: number; filledRoles: number; totalAreas: number };
    totalPersons: number;
    personsWithRoles: number;
  }>> => {
    return apiClient.get<ApiResponse<any>>(API_ENDPOINTS.dashboard.organization);
  },

  // Export data functionality
  exportData: async (
    type: 'news' | 'media' | 'persons' | 'roles' | 'audit',
    format: 'csv' | 'xlsx' = 'csv',
    filters: Record<string, any> = {}
  ): Promise<Blob> => {
    const params = new URLSearchParams({
      format,
      ...Object.fromEntries(
        Object.entries(filters).map(([k, v]) => [k, String(v)])
      ),
    });

    const response = await fetch(
      `${(process.env.NEXT_PUBLIC_API_URL as string) || (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api'}${API_ENDPOINTS.dashboard.export(type)}?${params}`,
      {
        method: 'GET',
        headers: {
          'Accept': format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  },

  // Quick actions for dashboard
  quickActions: {
    // Quick publish latest draft news
    publishLatestDraft: async (): Promise<ApiResponse<void>> => {
      return apiClient.post<ApiResponse<void>>(`${API_ENDPOINTS.dashboard.quickActions}/publish-latest-draft`, {});
    },

    // Quick cleanup old audit logs
    cleanupLogs: async (olderThanDays: number = 90): Promise<ApiResponse<{ deletedCount: number }>> => {
      return apiClient.post<ApiResponse<any>>(`${API_ENDPOINTS.dashboard.quickActions}/cleanup-logs`, {
        olderThanDays,
      });
    },

    // Quick backup database
    backupDatabase: async (): Promise<ApiResponse<{ backupFile: string }>> => {
      return apiClient.post<ApiResponse<any>>(`${API_ENDPOINTS.dashboard.quickActions}/backup-db`, {});
    },

    // Quick optimize database
    optimizeDatabase: async (): Promise<ApiResponse<{ optimizedTables: string[] }>> => {
      return apiClient.post<ApiResponse<any>>(`${API_ENDPOINTS.dashboard.quickActions}/optimize-db`, {});
    },
  },
};

// React Query keys for dashboard
export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  stats: (filters: DashboardFilters) => [...dashboardQueryKeys.all, 'stats', filters] as const,
  auditLogs: (page: number, limit: number) => [...dashboardQueryKeys.all, 'auditLogs', page, limit] as const,
  health: () => [...dashboardQueryKeys.all, 'health'] as const,
  newsStats: (timeRange: string) => [...dashboardQueryKeys.all, 'newsStats', timeRange] as const,
  mediaStats: (timeRange: string) => [...dashboardQueryKeys.all, 'mediaStats', timeRange] as const,
  organizationOverview: () => [...dashboardQueryKeys.all, 'organizationOverview'] as const,
};
