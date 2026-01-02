import React, { useState, useEffect } from 'react';
import LoginSimple from './components/LoginSimple';
import OTPSimple from './components/OTPSimple';
import AdminDashboardSimple from './pages/AdminDashboardSimple';
import ASHADashboardSimple from './pages/ASHADashboardSimple';

// Types
interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'ASHA';
}

interface LoginData {
  userId: string;
  email: string;
  role: string;
}

type AppState = 'loading' | 'login' | 'otp' | 'dashboard';

function AppSimple() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [loginData, setLoginData] = useState<LoginData | null>(null);

  // Check for existing authentication on app start
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Decode the mock JWT token
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          // Check if token is expired
          if (payload.exp * 1000 > Date.now()) {
            setUser({
              id: payload.userId,
              email: payload.email,
              role: payload.role
            });
            setAppState('dashboard');
            return;
          } else {
            // Token expired, remove it
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        // Invalid token, remove it
        localStorage.removeItem('authToken');
      }
      
      setAppState('login');
    };

    // Simulate loading time
    setTimeout(checkAuth, 1000);
  }, []);

  const handleLoginSuccess = (data: LoginData) => {
    setLoginData(data);
    setAppState('otp');
  };

  const handleOTPSuccess = () => {
    if (loginData) {
      setUser({
        id: loginData.userId,
        email: loginData.email,
        role: loginData.role as 'ADMIN' | 'ASHA'
      });
      setAppState('dashboard');
    }
  };

  const handleBackToLogin = () => {
    setLoginData(null);
    setAppState('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setLoginData(null);
    setAppState('login');
  };

  // Loading screen
  if (appState === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F9FAFB'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: '#4F46E5',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 2s infinite'
          }}>
            <span style={{ color: 'white', fontSize: '24px' }}>🛡️</span>
          </div>
          <h2 style={{ color: '#1F2937', margin: '0 0 10px 0' }}>Loading ASHA-PORTAL...</h2>
          <p style={{ color: '#6B7280', margin: 0 }}>Healthcare Data Management System</p>
        </div>
      </div>
    );
  }

  // Login screen
  if (appState === 'login') {
    return <LoginSimple onLoginSuccess={handleLoginSuccess} />;
  }

  // OTP verification screen
  if (appState === 'otp' && loginData) {
    return (
      <OTPSimple
        userId={loginData.userId}
        email={loginData.email}
        onVerificationSuccess={handleOTPSuccess}
        onBack={handleBackToLogin}
      />
    );
  }

  // Dashboard screen
  if (appState === 'dashboard' && user) {
    if (user.role === 'ADMIN') {
      return <AdminDashboardSimple user={user} onLogout={handleLogout} />;
    } else if (user.role === 'ASHA') {
      return <ASHADashboardSimple user={user} onLogout={handleLogout} />;
    }
  }

  // Unauthorized or error state
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F9FAFB'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '20px' }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: '#EF4444',
          borderRadius: '50%',
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ color: 'white', fontSize: '24px' }}>⚠️</span>
        </div>
        <h2 style={{ color: '#1F2937', margin: '0 0 10px 0' }}>Access Denied</h2>
        <p style={{ color: '#6B7280', margin: '0 0 20px 0' }}>
          You don't have permission to access this resource.
        </p>
        <button
          onClick={handleLogout}
          style={{
            background: '#4F46E5',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default AppSimple;