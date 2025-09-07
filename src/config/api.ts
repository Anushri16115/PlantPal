// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  ENDPOINTS: {
    PLANTS: '/plants',
    GROWTH_LOGS: '/growth-logs',
    CARE_NOTES: '/care-notes',
  },
  TIMEOUT: 10000, // 10 seconds
};

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
