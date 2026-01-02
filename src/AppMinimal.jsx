import React, { useState, useEffect } from 'react';

// Mock Users
const mockUsers = {
  'admin@gmail.com': { id: '1', email: 'admin@gmail.com', password: 'Admin@123', role: 'ADMIN' },
  'sunita.dixit.asha@gmail.com': { id: '2', email: 'sunita.dixit.asha@gmail.com', password: 'Dixit.Sunita@123', role: 'ASHA' }
};

function AppMinimal() {
  const [appState, setAppState] = useState('loading'); // 'loading', 'login', 'otp', 'dashboard'
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState(null);

  // Check for existing authentication on app start
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          if (payload.exp * 1000 > Date.now()) {
            setUser({
              id: payload.userId,
              email: payload.email,
              role: payload.role
            });
            setAppState('dashboard');
            return;
          } else {
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        localStorage.removeItem('authToken');
      }
      
      setAppState('login');
    };

    setTimeout(checkAuth, 1000);
  }, []);

  const handleLoginSuccess = (data) => {
    setLoginData(data);
    setAppState('otp');
  };

  const handleOTPSuccess = () => {
    if (loginData) {
      setUser({
        id: loginData.userId,
        email: loginData.email,
        role: loginData.role
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
    return <LoginComponent onLoginSuccess={handleLoginSuccess} />;
  }

  // OTP verification screen
  if (appState === 'otp' && loginData) {
    return (
      <OTPComponent
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
      return <AdminDashboard user={user} onLogout={handleLogout} />;
    } else if (user.role === 'ASHA') {
      return <ASHADashboard user={user} onLogout={handleLogout} />;
    }
  }

  // Error state
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F9FAFB'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '20px' }}>
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

// Login Component
function LoginComponent({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = mockUsers[formData.email.toLowerCase()];
      
      if (!user || user.password !== formData.password) {
        throw new Error('Invalid email or password');
      }

      onLoginSuccess({
        userId: user.id,
        email: formData.email,
        role: user.role
      });

    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: 'white',
        borderRadius: '10px',
        padding: '40px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: '#4F46E5',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            🛡️
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 10px 0' }}>
            ASHA-PORTAL
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
            Healthcare Data Management System
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              padding: '10px',
              borderRadius: '6px',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              background: isLoading ? '#9CA3AF' : '#4F46E5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {isLoading ? '🔄 Authenticating...' : '🔐 Sign In'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
          <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'center', margin: '0 0 10px 0' }}>
            Demo Credentials (Development Only)
          </p>
          <div style={{ fontSize: '12px', color: '#374151' }}>
            <div style={{ background: '#F9FAFB', padding: '8px', borderRadius: '4px', marginBottom: '5px' }}>
              <strong>Admin:</strong> admin@gmail.com / Admin@123
            </div>
            <div style={{ background: '#F9FAFB', padding: '8px', borderRadius: '4px' }}>
              <strong>ASHA:</strong> sunita.dixit.asha@gmail.com / Dixit.Sunita@123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// OTP Component
function OTPComponent({ userId, email, onVerificationSuccess, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (otpString.length === 6) {
        const mockToken = btoa(JSON.stringify({
          userId,
          email,
          role: email.includes('admin') ? 'ADMIN' : 'ASHA',
          exp: Math.floor(Date.now() / 1000) + (30 * 60)
        }));
        
        localStorage.setItem('authToken', mockToken);
        
        setSuccess('OTP verified successfully! Redirecting...');
        setTimeout(() => {
          onVerificationSuccess();
        }, 1500);
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (err) {
      setError(err.message || 'OTP verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: 'white',
        borderRadius: '10px',
        padding: '40px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: '#4F46E5',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px'
          }}>
            🔐
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 10px 0' }}>
            Verify OTP
          </h2>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>
            Enter the 6-digit code sent to your registered device
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '12px', margin: 0 }}>
            {email}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '15px', textAlign: 'center' }}>
              Enter 6-Digit OTP
            </label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '15px' }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  disabled={isLoading}
                  style={{
                    width: '45px',
                    height: '45px',
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    border: '2px solid #D1D5DB',
                    borderRadius: '6px',
                    outline: 'none'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            {timeRemaining > 0 ? (
              <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
                ⏰ OTP expires in {formatTime(timeRemaining)}
              </p>
            ) : (
              <p style={{ color: '#DC2626', fontSize: '14px', margin: 0 }}>
                ⚠️ OTP has expired
              </p>
            )}
          </div>

          {success && (
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              color: '#166534',
              padding: '10px',
              borderRadius: '6px',
              fontSize: '14px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              ✅ {success}
            </div>
          )}

          {error && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              padding: '10px',
              borderRadius: '6px',
              fontSize: '14px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!isOtpComplete || isLoading || timeRemaining === 0}
            style={{
              width: '100%',
              padding: '12px',
              background: (!isOtpComplete || isLoading || timeRemaining === 0) ? '#9CA3AF' : '#4F46E5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: (!isOtpComplete || isLoading || timeRemaining === 0) ? 'not-allowed' : 'pointer',
              marginBottom: '15px'
            }}
          >
            {isLoading ? '🔄 Verifying...' : '✅ Verify OTP'}
          </button>

          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              background: 'transparent',
              color: '#6B7280',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            ← Back to Login
          </button>
        </form>

        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '15px', marginTop: '15px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 5px 0' }}>
            Development Mode: Any 6-digit number works
          </p>
          <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>
            In production, OTP will be sent via SMS/Email
          </p>
        </div>
      </div>
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboard({ user, onLogout }) {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const stats = [
    { title: 'Total ASHA Workers', value: '1,247', icon: '👥' },
    { title: 'Active Cases', value: '3,891', icon: '📊' },
    { title: 'Reports Generated', value: '156', icon: '📄' },
    { title: 'System Health', value: '99.9%', icon: '🛡️' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #E5E7EB', padding: '0 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', marginRight: '10px' }}>🛡️</span>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#1F2937' }}>ASHA-PORTAL</h1>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Admin Dashboard</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '20px' }}>🔔</span>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', margin: 0, color: '#1F2937' }}>{user?.email}</p>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Administrator</p>
            </div>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '5px' }} title="Logout">🚪</button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 10px 0' }}>Welcome back, Administrator</h2>
          <p style={{ color: '#6B7280', margin: 0 }}>Here's what's happening with your healthcare management system today.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {stats.map((stat, index) => (
            <div key={index} style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 5px 0' }}>{stat.title}</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>{stat.value}</p>
                </div>
                <div style={{ fontSize: '30px', background: '#EEF2FF', padding: '10px', borderRadius: '50%' }}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 15px 0' }}>System Overview</h3>
          <p style={{ color: '#6B7280', margin: 0 }}>All systems are operational. Healthcare data is being processed efficiently across all ASHA centers.</p>
        </div>
      </div>
    </div>
  );
}

// ASHA Dashboard Component
function ASHADashboard({ user, onLogout }) {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const stats = [
    { title: 'Patients Assigned', value: '127', icon: '👥' },
    { title: 'Visits This Month', value: '89', icon: '🏥' },
    { title: 'Pending Reports', value: '3', icon: '📄' },
    { title: 'Health Score', value: '94%', icon: '❤️' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #E5E7EB', padding: '0 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', marginRight: '10px' }}>❤️</span>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#1F2937' }}>ASHA-PORTAL</h1>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>ASHA Worker Dashboard</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '20px' }}>🔔</span>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', margin: 0, color: '#1F2937' }}>{user?.email?.split('@')[0] || 'ASHA Worker'}</p>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Accredited Social Health Activist</p>
            </div>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '5px' }} title="Logout">🚪</button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 10px 0' }}>Good morning, Sunita! 🌅</h2>
          <p style={{ color: '#6B7280', margin: 0 }}>You have 3 pending tasks today. Let's make a difference in your community's health.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {stats.map((stat, index) => (
            <div key={index} style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 5px 0' }}>{stat.title}</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>{stat.value}</p>
                </div>
                <div style={{ fontSize: '30px', background: '#FEF2F2', padding: '10px', borderRadius: '50%' }}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 15px 0' }}>Today's Tasks</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '12px', background: '#FEF2F2', borderLeft: '4px solid #EF4444', borderRadius: '4px' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937', margin: '0 0 4px 0' }}>Visit Mrs. Sharma for diabetes checkup</p>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>🕐 10:00 AM - 📍 Village: Rampur</p>
            </div>
            <div style={{ padding: '12px', background: '#FFFBEB', borderLeft: '4px solid #F59E0B', borderRadius: '4px' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937', margin: '0 0 4px 0' }}>Vaccination drive at Anganwadi Center</p>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>🕐 2:00 PM - 📍 Main Road</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppMinimal;