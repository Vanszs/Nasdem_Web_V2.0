// Export all API services for easy imports
export * from './config';
export * from './client';
export * from './news';
export * from './media';
export * from './organization';
export * from './dashboard';

// Note: hooks.ts is commented out until React Query is installed
// export * from './hooks';

// Re-export commonly used types and services
export { newsApi, newsQueryKeys } from './news';
export { mediaApi, albumsApi, mediaQueryKeys, albumsQueryKeys } from './media';
export { personsApi, rolesApi, dapilsApi, personsQueryKeys, rolesQueryKeys, dapilsQueryKeys } from './organization';
export { dashboardApi, dashboardQueryKeys } from './dashboard';
export { apiClient, type ApiResponse, type PaginatedResponse } from './client';
export { API_ENDPOINTS, API_BASE_URL } from './config';
