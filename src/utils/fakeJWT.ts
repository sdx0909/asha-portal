import { User, UserRole, FakeJWTPayload } from '../types/auth.types';

/**
 * Fake JWT Utility for Frontend Simulation
 * This simulates JWT token behavior on the frontend for demo purposes
 * In production, all JWT operations should be handled by the backend
 */

/**
 * Generate a fake JWT token for frontend simulation
 */
export const generateFakeJWT = (user: User): string => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload: FakeJWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 60) // 30 minutes
  };

  // Base64 encode (for simulation only - not secure)
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = 'fake-signature-for-demo';

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

/**
 * Decode fake JWT token (frontend simulation)
 */
export const decodeFakeJWT = (token: string): FakeJWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload as FakeJWTPayload;
  } catch (error) {
    console.error('Failed to decode fake JWT:', error);
    return null;
  }
};

/**
 * Check if fake JWT token is expired
 */
export const isFakeJWTExpired = (token: string): boolean => {
  const payload = decodeFakeJWT(token);
  if (!payload) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * Get user from fake JWT token
 */
export const getUserFromFakeJWT = (token: string): User | null => {
  const payload = decodeFakeJWT(token);
  if (!payload) return null;

  return {
    id: payload.userId,
    email: payload.email,
    role: payload.role
  };
};

/**
 * Validate fake JWT token format
 */
export const validateFakeJWTFormat = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    // Try to decode header and payload
    JSON.parse(atob(parts[0]));
    JSON.parse(atob(parts[1]));
    return true;
  } catch {
    return false;
  }
};

/**
 * Get token expiration time in milliseconds
 */
export const getFakeJWTExpirationTime = (token: string): number | null => {
  const payload = decodeFakeJWT(token);
  if (!payload) return null;

  return payload.exp * 1000; // Convert to milliseconds
};

/**
 * Get remaining time until token expires (in milliseconds)
 */
export const getFakeJWTRemainingTime = (token: string): number => {
  const expirationTime = getFakeJWTExpirationTime(token);
  if (!expirationTime) return 0;

  const remaining = expirationTime - Date.now();
  return Math.max(0, remaining);
};

/**
 * Format remaining time as human readable string
 */
export const formatFakeJWTRemainingTime = (token: string): string => {
  const remaining = getFakeJWTRemainingTime(token);
  
  if (remaining <= 0) return 'Expired';
  
  const minutes = Math.floor(remaining / (60 * 1000));
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Simulate token refresh (generate new token with extended expiration)
 */
export const refreshFakeJWT = (token: string): string | null => {
  const payload = decodeFakeJWT(token);
  if (!payload) return null;

  const user: User = {
    id: payload.userId,
    email: payload.email,
    role: payload.role
  };

  return generateFakeJWT(user);
};

/**
 * Mock predefined users for frontend simulation
 */
export const mockUsers: Record<string, { password: string; user: User }> = {
  'admin@gmail.com': {
    password: 'Admin@123',
    user: {
      id: '1',
      email: 'admin@gmail.com',
      role: 'ADMIN' as UserRole
    }
  },
  'sunita.dixit.asha@gmail.com': {
    password: 'Dixit.Sunita@123',
    user: {
      id: '2',
      email: 'sunita.dixit.asha@gmail.com',
      role: 'ASHA' as UserRole
    }
  }
};

/**
 * Simulate login with predefined users (for frontend-only mode)
 */
export const simulateLogin = (email: string, password: string): { success: boolean; user?: User; token?: string; message: string } => {
  const mockUser = mockUsers[email.toLowerCase()];
  
  if (!mockUser) {
    return {
      success: false,
      message: 'Invalid email or password'
    };
  }
  
  if (mockUser.password !== password) {
    return {
      success: false,
      message: 'Invalid email or password'
    };
  }
  
  const token = generateFakeJWT(mockUser.user);
  
  return {
    success: true,
    user: mockUser.user,
    token,
    message: 'Login successful'
  };
};

// OTP simulation functions removed - using direct login authentication