import React from 'react';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    if (user?.role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (user?.role === 'ASHA') {
      navigate('/asha/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center animate-fade-in">
        {/* Icon */}
        <div className="mx-auto h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <Shield className="h-10 w-10 text-red-600" />
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Access Denied</h2>
        
        <p className="text-gray-600 mb-2">
          You don't have permission to access this resource.
        </p>
        
        {user && (
          <p className="text-sm text-gray-500 mb-8">
            Current role: <span className="font-medium">{user.role}</span>
          </p>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="w-full healthcare-button-primary flex items-center justify-center"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full healthcare-button-secondary flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Logout and Login as Different User
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            ASHA-PORTAL - Healthcare Data Management System
          </p>
          <p className="text-xs text-gray-400 mt-1">
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;