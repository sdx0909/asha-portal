import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { 
  LoginCredentials, 
  LoginResponse, 
  OTPVerificationData, 
  OTPVerificationResponse,
  ResendOTPData,
  ApiResponse,
  User 
} from '../types/auth.types';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API error handler
const handleApiError = (error: any): never => {
  if (error.response?.data) {
    throw new Error(error.response.data.message || 'An error occurred');
  } else if (error.request) {
    throw new Error('Network error. Please check your connection.');
  } else {
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

// Authentication API
export const authAPI = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Verify OTP
   */
  verifyOTP: async (data: OTPVerificationData): Promise<OTPVerificationResponse> => {
    try {
      const response = await apiClient.post<OTPVerificationResponse>('/auth/verify-otp', data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Resend OTP
   */
  resendOTP: async (data: ResendOTPData): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<ApiResponse>('/auth/resend-otp', data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<ApiResponse>('/auth/logout');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    try {
      const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Validate token
   */
  validateToken: async (): Promise<ApiResponse<{ user: User }>> => {
    try {
      const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/validate-token');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Health check
   */
  healthCheck: async (): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get<ApiResponse>('/health');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
};

// Generic API utilities
export const apiUtils = {
  /**
   * Check if error is network error
   */
  isNetworkError: (error: any): boolean => {
    return !error.response && error.request;
  },

  /**
   * Check if error is server error (5xx)
   */
  isServerError: (error: any): boolean => {
    return error.response && error.response.status >= 500;
  },

  /**
   * Check if error is client error (4xx)
   */
  isClientError: (error: any): boolean => {
    return error.response && error.response.status >= 400 && error.response.status < 500;
  },

  /**
   * Get error message from API response
   */
  getErrorMessage: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    } else if (error.message) {
      return error.message;
    } else {
      return 'An unexpected error occurred';
    }
  },

  /**
   * Format API response for consistent handling
   */
  formatResponse: <T>(response: AxiosResponse<T>): T => {
    return response.data;
  }
};

export default apiClient;