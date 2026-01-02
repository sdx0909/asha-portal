/**
 * OTP Utility Functions
 * Handles OTP generation, validation, and formatting
 */

/**
 * Generate a 6-digit numeric OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate a custom length numeric OTP
 * @param {number} length - Length of OTP (default: 6)
 * @returns {string} Numeric OTP
 */
const generateCustomOTP = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
};

/**
 * Generate alphanumeric OTP
 * @param {number} length - Length of OTP (default: 6)
 * @returns {string} Alphanumeric OTP
 */
const generateAlphanumericOTP = (length = 6) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Validate OTP format
 * @param {string} otp - OTP to validate
 * @param {number} expectedLength - Expected OTP length (default: 6)
 * @returns {boolean} True if OTP format is valid
 */
const validateOTPFormat = (otp, expectedLength = 6) => {
  if (!otp || typeof otp !== 'string') {
    return false;
  }
  
  // Check if OTP is numeric and has correct length
  const numericRegex = new RegExp(`^\\d{${expectedLength}}$`);
  return numericRegex.test(otp);
};

/**
 * Format OTP for display (e.g., "123456" -> "123 456")
 * @param {string} otp - OTP to format
 * @param {string} separator - Separator character (default: ' ')
 * @param {number} groupSize - Size of each group (default: 3)
 * @returns {string} Formatted OTP
 */
const formatOTPForDisplay = (otp, separator = ' ', groupSize = 3) => {
  if (!otp || typeof otp !== 'string') {
    return otp;
  }
  
  const regex = new RegExp(`(.{${groupSize}})`, 'g');
  return otp.replace(regex, `$1${separator}`).trim();
};

/**
 * Calculate OTP expiration time
 * @param {number} minutes - Minutes until expiration (default: 2)
 * @returns {Date} Expiration date
 */
const calculateOTPExpiration = (minutes = 2) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

/**
 * Check if OTP is expired
 * @param {Date} expirationTime - OTP expiration time
 * @returns {boolean} True if OTP is expired
 */
const isOTPExpired = (expirationTime) => {
  return new Date() > new Date(expirationTime);
};

/**
 * Get remaining time for OTP in seconds
 * @param {Date} expirationTime - OTP expiration time
 * @returns {number} Remaining seconds (0 if expired)
 */
const getOTPRemainingTime = (expirationTime) => {
  const now = new Date();
  const expiry = new Date(expirationTime);
  const remainingMs = expiry.getTime() - now.getTime();
  
  return Math.max(0, Math.floor(remainingMs / 1000));
};

/**
 * Format remaining time as MM:SS
 * @param {number} seconds - Remaining seconds
 * @returns {string} Formatted time (e.g., "01:30")
 */
const formatRemainingTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Generate OTP with metadata
 * @param {Object} options - OTP generation options
 * @param {number} options.length - OTP length (default: 6)
 * @param {number} options.expiryMinutes - Expiry in minutes (default: 2)
 * @param {string} options.type - OTP type: 'numeric' or 'alphanumeric' (default: 'numeric')
 * @returns {Object} OTP with metadata
 */
const generateOTPWithMetadata = (options = {}) => {
  const {
    length = 6,
    expiryMinutes = 2,
    type = 'numeric'
  } = options;
  
  const otp = type === 'alphanumeric' 
    ? generateAlphanumericOTP(length)
    : generateCustomOTP(length);
  
  const expiresAt = calculateOTPExpiration(expiryMinutes);
  
  return {
    otp,
    expiresAt,
    length,
    type,
    createdAt: new Date(),
    isValid: true
  };
};

/**
 * Simulate sending OTP (for development/testing)
 * @param {string} recipient - Email or phone number
 * @param {string} otp - OTP to send
 * @param {string} method - Delivery method: 'email' or 'sms'
 * @returns {Object} Simulation result
 */
const simulateOTPDelivery = (recipient, otp, method = 'email') => {
  console.log(`📱 [${method.toUpperCase()}] OTP Delivery Simulation`);
  console.log(`📧 To: ${recipient}`);
  console.log(`🔐 OTP: ${otp}`);
  console.log(`⏰ Generated at: ${new Date().toISOString()}`);
  
  return {
    success: true,
    method,
    recipient,
    deliveredAt: new Date(),
    message: `OTP sent via ${method} to ${recipient}`
  };
};

module.exports = {
  generateOTP,
  generateCustomOTP,
  generateAlphanumericOTP,
  validateOTPFormat,
  formatOTPForDisplay,
  calculateOTPExpiration,
  isOTPExpired,
  getOTPRemainingTime,
  formatRemainingTime,
  generateOTPWithMetadata,
  simulateOTPDelivery
};