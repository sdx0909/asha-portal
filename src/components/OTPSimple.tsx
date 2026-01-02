import React, { useState, useEffect } from 'react';

interface OTPSimpleProps {
  userId: string;
  email: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
}

const OTPSimple: React.FC<OTPSimpleProps> = ({
  userId,
  email,
  onVerificationSuccess,
  onBack
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
  const [isLoading, setIsLoading] = useState(false);

  // Timer for OTP expiration
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, accept any 6-digit OTP
      if (otpString.length === 6) {
        // Generate mock JWT token
        const mockToken = btoa(JSON.stringify({
          userId,
          email,
          role: email.includes('admin') ? 'ADMIN' : 'ASHA',
          exp: Math.floor(Date.now() / 1000) + (30 * 60) // 30 minutes
        }));
        
        localStorage.setItem('authToken', mockToken);
        
        setSuccess('OTP verified successfully! Redirecting...');
        setTimeout(() => {
          onVerificationSuccess();
        }, 1500);
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
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
            fontSize: '24px'
          }}>
            🔐
          </div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#1F2937',
            margin: '0 0 10px 0'
          }}>
            Verify OTP
          </h2>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>
            Enter the 6-digit code sent to your registered device
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '12px', margin: 0 }}>
            {email}
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          {/* OTP Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              Enter 6-Digit OTP
            </label>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '8px',
              marginBottom: '15px'
            }}>
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

          {/* Timer */}
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

          {/* Success Message */}
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

          {/* Error Message */}
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

          {/* Submit Button */}
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

          {/* Back Button */}
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

        {/* Development Note */}
        <div style={{
          borderTop: '1px solid #E5E7EB',
          paddingTop: '15px',
          textAlign: 'center'
        }}>
          <p style={{ 
            fontSize: '12px', 
            color: '#6B7280',
            margin: '0 0 5px 0'
          }}>
            Development Mode: Any 6-digit number works
          </p>
          <p style={{ 
            fontSize: '11px', 
            color: '#9CA3AF',
            margin: 0
          }}>
            In production, OTP will be sent via SMS/Email
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPSimple;