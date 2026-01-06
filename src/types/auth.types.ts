/**
 * Authentication Types for ASHA-PORTAL
 */

export type UserRole = 'ADMIN' | 'ASHA';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  lastLogin?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

// OTP-related types removed - using direct login authentication

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

// Session timeout types
export interface SessionTimeoutConfig {
  timeoutMinutes: number;
  warningMinutes: number;
}

export interface SessionState {
  isActive: boolean;
  lastActivity: number;
  timeoutId: NodeJS.Timeout | null;
  warningTimeoutId: NodeJS.Timeout | null;
}

// Route protection types
export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isSubmitting: boolean;
  errors: ValidationError[];
  touched: Record<string, boolean>;
}

// OTP-related context types removed

// Fake JWT token structure (for frontend simulation)
export interface FakeJWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}