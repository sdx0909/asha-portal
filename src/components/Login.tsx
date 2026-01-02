import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { LoginCredentials } from '../types/auth.types';

interface LoginProps {
  onLoginSuccess: (data: { userId: string; email: string; role: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  // Clear error when form data changes
  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setError('');
      const response = await login(formData);
      
      if (response.success && response.data) {
        onLoginSuccess({
          userId: response.data.userId,
          email: response.data.email,
          role: response.data.role
        });
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  const isFormValid = formData.email.trim() && formData.password.trim();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ASHA-PORTAL
          </h2>
          <p className="text-sm text-gray-600">
            Healthcare Data Management System
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Secure Login for Authorized Personnel
          </p>
        </div>

        {/* Login Form */}
        <div className="healthcare-card p-8 animate-slide-up">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="healthcare-label">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`healthcare-input pl-10 ${
                    touched.email && !formData.email ? 'error-input' : ''
                  }`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={() => handleInputBlur('email')}
                  disabled={isLoading}
                />
              </div>
              {touched.email && !formData.email && (
                <p className="error-text">Email is required</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="healthcare-label">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className={`healthcare-input pl-10 pr-10 ${
                    touched.password && !formData.password ? 'error-input' : ''
                  }`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => handleInputBlur('password')}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {touched.password && !formData.password && (
                <p className="error-text">Password is required</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
                  !isFormValid || isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner w-4 h-4 mr-2"></div>
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">
              Demo Credentials (Development Only)
            </p>
            <div className="space-y-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <strong>Admin:</strong> admin@gmail.com / Admin@123
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <strong>ASHA:</strong> sunita.dixit.asha@gmail.com / Dixit.Sunita@123
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 ASHA-PORTAL. Secure Healthcare Management System.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            For authorized personnel only. All activities are logged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;