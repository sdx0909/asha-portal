import React from 'react';
import { Shield } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'md',
  fullScreen = true 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = fullScreen 
    ? 'min-h-screen flex items-center justify-center bg-gray-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="mx-auto mb-4">
          <div className="relative">
            <Shield className="h-12 w-12 text-primary-600 mx-auto mb-2" />
            <div className={`loading-spinner ${sizeClasses[size]} absolute top-0 left-1/2 transform -translate-x-1/2`}></div>
          </div>
        </div>
        <p className="text-gray-600 text-sm font-medium">{message}</p>
        <p className="text-gray-400 text-xs mt-1">ASHA-PORTAL</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;