import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './components/Login';
// OTP verification component import removed
import AdminDashboard from './pages/AdminDashboard';
import ASHADashboard from './pages/ASHADashboard';
import Unauthorized from './pages/Unauthorized';
import './App.css';

// Login flow states
type LoginState = 'login' | 'authenticated';

interface LoginData {
  userId: string;
  email: string;
  role: string;
}

function App() {
  const [loginState, setLoginState] = useState<LoginState>('login');
  const [loginData, setLoginData] = useState<LoginData | null>(null);

  const handleLoginSuccess = async () => {
    setLoginState('authenticated');
  };

  const handleBackToLogin = () => {
    setLoginState('login');
    setLoginData(null);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                loginState === 'login' ? (
                  <Login onLoginSuccess={handleLoginSuccess} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected ASHA Routes */}
            <Route 
              path="/asha/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['ASHA']}>
                  <ASHADashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Unauthorized Page */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Root Route - Redirect based on authentication */}
            <Route 
              path="/" 
              element={<RootRedirect />} 
            />
            
            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Component to handle root route redirection
const RootRedirect: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  React.useEffect(() => {
    // Simulate checking authentication state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading ASHA-PORTAL..." />;
  }

  // Check if user is authenticated and redirect accordingly
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Try to determine user role from token (simplified)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload.role;
    
    if (userRole === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === 'ASHA') {
      return <Navigate to="/asha/dashboard" replace />;
    }
  } catch (error) {
    // Invalid token, redirect to login
    localStorage.removeItem('authToken');
  }
  
  return <Navigate to="/login" replace />;
};

export default App;
