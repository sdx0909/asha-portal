import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  User, 
  LoginCredentials, 
  LoginResponse, 
  AuthContextType 
} from '../types/auth.types';
import { authAPI } from '../utils/api';
import { sessionManager } from '../utils/sessionManager';

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Auth actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_AUTH' };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false
      };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false
      };
    
    case 'LOGOUT':
    case 'CLEAR_AUTH':
      return {
        ...initialState,
        isLoading: false
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  // Initialize session manager when user is authenticated
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      sessionManager.startSession(() => {
        logout();
      });
    } else {
      sessionManager.clearSession();
    }

    return () => {
      sessionManager.clearSession();
    };
  }, [state.isAuthenticated]);

  /**
   * Initialize authentication from stored token
   */
  const initializeAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Validate token with backend
      const response = await authAPI.validateToken();
      
      if (response.success && response.data?.user) {
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { 
            user: response.data.user, 
            token 
          } 
        });
      } else {
        // Invalid token, clear it
        localStorage.removeItem('authToken');
        dispatch({ type: 'CLEAR_AUTH' });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      localStorage.removeItem('authToken');
      dispatch({ type: 'CLEAR_AUTH' });
    }
  };

  /**
   * Login user with email and password
   */
  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await authAPI.login(credentials);
      
      if (response.success && response.data) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.token);
        
        // Set authentication state
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { 
            user: response.data.user, 
            token: response.data.token 
          } 
        });
        
        return response;
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      // Call logout API (optional, for server-side cleanup)
      if (state.token) {
        await authAPI.logout().catch(() => {
          // Ignore logout API errors
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('authToken');
      sessionManager.clearSession();
      dispatch({ type: 'LOGOUT' });
    }
  };

  /**
   * Check authentication status
   */
  const checkAuth = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        dispatch({ type: 'CLEAR_AUTH' });
        return;
      }

      const response = await authAPI.getCurrentUser();
      
      if (response.success && response.data?.user) {
        dispatch({ type: 'SET_USER', payload: response.data.user });
      } else {
        localStorage.removeItem('authToken');
        dispatch({ type: 'CLEAR_AUTH' });
      }
    } catch (error) {
      console.error('Check auth error:', error);
      localStorage.removeItem('authToken');
      dispatch({ type: 'CLEAR_AUTH' });
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};