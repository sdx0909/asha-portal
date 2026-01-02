const User = require('../models/User.model');
const OTP = require('../models/OTP.model');
const { generateToken } = require('../utils/jwt.utils');
const { generateOTP } = require('../utils/otp.utils');

/**
 * Login Controller
 * Authenticates user with email and password
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Generate OTP for verification
    const otpRecord = await OTP.createForUser(user._id, user.email);

    // In production, send OTP via SMS/Email
    // For demo purposes, we'll return it in response (REMOVE IN PRODUCTION)
    console.log(`🔐 OTP for ${user.email}: ${otpRecord.otp}`);

    res.status(200).json({
      success: true,
      message: 'Login successful. OTP sent for verification.',
      data: {
        userId: user._id,
        email: user.email,
        role: user.role,
        requiresOTP: true,
        // REMOVE IN PRODUCTION - Only for demo
        ...(process.env.NODE_ENV === 'development' && { otp: otpRecord.otp })
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Verify OTP Controller
 * Verifies OTP and returns JWT token
 */
const verifyOTP = async (req, res) => {
  try {
    const { userId, email, otp } = req.body;

    // Validation
    if (!userId || !email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'User ID, email, and OTP are required'
      });
    }

    // Verify OTP
    const otpVerification = await OTP.verifyOTP(userId, email, otp);
    
    if (!otpVerification.success) {
      return res.status(401).json({
        success: false,
        message: otpVerification.message
      });
    }

    // Get user details
    const user = await User.findById(userId);
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Resend OTP Controller
 * Generates and sends new OTP
 */
const resendOTP = async (req, res) => {
  try {
    const { userId, email } = req.body;

    // Validation
    if (!userId || !email) {
      return res.status(400).json({
        success: false,
        message: 'User ID and email are required'
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    
    if (!user || user.email !== email.toLowerCase()) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new OTP
    const otpRecord = await OTP.createForUser(user._id, user.email);

    // In production, send OTP via SMS/Email
    console.log(`🔐 Resent OTP for ${user.email}: ${otpRecord.otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      data: {
        // REMOVE IN PRODUCTION - Only for demo
        ...(process.env.NODE_ENV === 'development' && { otp: otpRecord.otp })
      }
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Logout Controller
 * Invalidates user session (client-side token removal)
 */
const logout = async (req, res) => {
  try {
    // In a more advanced implementation, you might maintain a blacklist of tokens
    // For now, we rely on client-side token removal
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get Current User Controller
 * Returns current user information from JWT token
 */
const getCurrentUser = async (req, res) => {
  try {
    // User information is attached by auth middleware
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  login,
  verifyOTP,
  resendOTP,
  logout,
  getCurrentUser
};