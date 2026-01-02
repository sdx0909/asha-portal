import React, { useState, useEffect } from 'react';

interface LoginProps {
  onLoginSuccess: (data: { userId: string; email: string; role: string }) => void;
}

const LoginSimple: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication
      const mockUsers = {
        'admin@gmail.com': { password: 'Admin@123', role: 'ADMIN', userId: '1' },
        'sunita.dixit.asha@gmail.com': { password: 'Dixit.Sunita@123', role: 'ASHA', userId: '2' }
      };

      const user = mockUsers[formData.email as keyof typeof mockUsers];
      
      if (!user || user.password !== formData.password) {
        throw new Error('Invalid email or password');
      }

      onLoginSuccess({
        userId: user.userId,
        email: formData.email,
        role: user.role
      });

    } catch (err: any) {
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
        {/* Header */}
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
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#1F2937',
            margin: '0 0 10px 0'
          }}>
            ASHA-PORTAL
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
            Healthcare Data Management System
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '5px'
            }}>
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

          {/* Password Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '5px'
            }}>
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

          {/* Error Message */}
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

          {/* Submit Button */}
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

        {/* Demo Credentials */}
        <div style={{
          borderTop: '1px solid #E5E7EB',
          paddingTop: '20px'
        }}>
          <p style={{ 
            fontSize: '12px', 
            color: '#6B7280', 
            textAlign: 'center',
            margin: '0 0 10px 0'
          }}>
            Demo Credentials (Development Only)
          </p>
          <div style={{ fontSize: '12px', color: '#374151' }}>
            <div style={{ 
              background: '#F9FAFB', 
              padding: '8px', 
              borderRadius: '4px',
              marginBottom: '5px'
            }}>
              <strong>Admin:</strong> admin@gmail.com / Admin@123
            </div>
            <div style={{ 
              background: '#F9FAFB', 
              padding: '8px', 
              borderRadius: '4px'
            }}>
              <strong>ASHA:</strong> sunita.dixit.asha@gmail.com / Dixit.Sunita@123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSimple;