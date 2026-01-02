import React, { useState, useEffect, useRef } from 'react';
import { Shield, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { OTPVerificationData } from '../types/auth.types';

interface OTPVerificationProps {
  userId: string;
  email: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  userId,
  email,
  onVerificationSuccess,
  onBack
}) => {
  const { verifyOTP, resendOTP, isLoading } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for OTP expiration
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeRemaining]);

  // Clear messages when OTP changes
  useEffect(() => {
    if (error || success) {
      setError('');
      setSuccess('');
    }
  }, [otp]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      const verificationData: OTPVerificationData = {
        userId,
        email,
        otp: otpString
      };
      
      const response = await verifyOTP(verificationData);
      
      if (response.success) {
        setSuccess('OTP verified successfully! Redirecting...');
        setTimeout(() => {
          onVerificationSuccess();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed. Please try again.');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOTP = async () => {
    try {
      setResendLoading(true);
      setError('');
      setSuccess('');
      
      await resendOTP({ userId, email });
      
      setSuccess('OTP resent successfully!');
      setTimeRemaining(120);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Verify OTP
          </h2>
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to your registered device
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {email}
          </p>
        </div>

        {/* OTP Form */}
        <div className="healthcare-card p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="healthcare-label text-center block">
                Enter 6-Digit OTP
              </label>
              <div className="flex justify-center space-x-2 mt-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    maxLength={1}
                    className="otp-input"
                    value={digit}
                    onChange={e => handleOtpChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={isLoading}
                    autoComplete="off"
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              {timeRemaining > 0 ? (
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    OTP expires in {formatTime(timeRemaining)}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-red-600">OTP has expired</p>
              )}
            </div>

            {/* Success Message */}
            {success && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </div>
            )}

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
                disabled={!isOtpComplete || isLoading || timeRemaining === 0}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
                  !isOtpComplete || isLoading || timeRemaining === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner w-4 h-4 mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </div>

            {/* Resend OTP */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={!canResend || resendLoading}
                className={`inline-flex items-center text-sm ${
                  canResend && !resendLoading
                    ? 'text-primary-600 hover:text-primary-700'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                {resendLoading ? (
                  <>
                    <div className="loading-spinner w-4 h-4 mr-2"></div>
                    Resending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    {canResend ? 'Resend OTP' : 'Resend available after expiry'}
                  </>
                )}
              </button>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={onBack}
                disabled={isLoading}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Back to Login
              </button>
            </div>
          </form>

          {/* Development Note */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-2">
                Development Mode: Check console for OTP
              </p>
              <p className="text-xs text-gray-400 text-center">
                In production, OTP will be sent via SMS/Email
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Secure two-factor authentication for enhanced security
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;