// Database configuration and connection settings
const viteEnv = (import.meta as any).env || {};
const nextEnv = typeof process !== 'undefined' ? process.env : {} as any;

export const dbConfig = {
  host: (nextEnv.NEXT_PUBLIC_DB_HOST as string) || viteEnv.VITE_DB_HOST || 'localhost',
  port: parseInt(((nextEnv.NEXT_PUBLIC_DB_PORT as string) || viteEnv.VITE_DB_PORT || '3306'), 10),
  user: (nextEnv.NEXT_PUBLIC_DB_USER as string) || viteEnv.VITE_DB_USER || 'root',
  password: (nextEnv.NEXT_PUBLIC_DB_PASSWORD as string) || viteEnv.VITE_DB_PASSWORD || '',
  database: (nextEnv.NEXT_PUBLIC_DB_NAME as string) || viteEnv.VITE_DB_NAME || 'nasdem_admin_panel',
};

// API base URL
export const API_BASE_URL = (nextEnv.NEXT_PUBLIC_API_URL as string) || viteEnv.VITE_API_URL || 'http://localhost:3001/api';

// API endpoints
export const API_ENDPOINTS = {
  news: {
    list: '/news',
    create: '/news',
    update: (id: string) => `/news/${id}`,
    delete: (id: string) => `/news/${id}`,
    pin: (id: string) => `/news/${id}/pin`,
    unpin: (id: string) => `/news/${id}/unpin`,
    publish: (id: string) => `/news/${id}/publish`,
    archive: (id: string) => `/news/${id}/archive`,
  },
  media: {
    list: '/media',
    upload: '/media/upload',
    update: (id: string) => `/media/${id}`,
    delete: (id: string) => `/media/${id}`,
  },
  albums: {
    list: '/albums',
    create: '/albums',
    update: (id: string) => `/albums/${id}`,
    delete: (id: string) => `/albums/${id}`,
  },
  persons: {
    list: '/persons',
    create: '/persons',
    update: (id: string) => `/persons/${id}`,
    delete: (id: string) => `/persons/${id}`,
  },
  roles: {
    list: '/roles',
    create: '/roles',
    update: (id: string) => `/roles/${id}`,
    delete: (id: string) => `/roles/${id}`,
    byUnit: (unit: string) => `/roles/unit/${unit}`,
  },
  dapils: {
    list: '/dapils',
    update: (id: number) => `/dapils/${id}`,
  },
  dashboard: {
    stats: '/dashboard/stats',
    activity: '/dashboard/activity',
    auditLogs: '/dashboard/audit-logs',
    health: '/dashboard/health',
    organization: '/dashboard/organization',
    export: (type: string) => `/dashboard/export/${type}`,
    quickActions: '/dashboard/quick-actions',
  },
};

// HTTP client configuration
export const httpConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};
