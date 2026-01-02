const express = require('express');
const rateLimit = require('express-rate-limit');
const { 
  login, 
  verifyOTP, 
  resendOTP, 
  logout, 
  getCurrentUser 
} = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // limit each IP to 3 OTP requests per 5 minutes
  message: {
    success: false,
    message: 'Too many OTP requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and initiate OTP verification
 * @access  Public
 * @body    { email, password }
 */
router.post('/login', authLimiter, login);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and return JWT token
 * @access  Public
 * @body    { userId, email, otp }
 */
router.post('/verify-otp', authLimiter, verifyOTP);

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Resend OTP for verification
 * @access  Public
 * @body    { userId, email }
 */
router.post('/resend-otp', otpLimiter, resendOTP);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authMiddleware, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user information
 * @access  Private
 */
router.get('/me', authMiddleware, getCurrentUser);

/**
 * @route   GET /api/auth/validate-token
 * @desc    Validate JWT token
 * @access  Private
 */
router.get('/validate-token', authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    data: {
      user: req.user
    }
  });
});

module.exports = router;