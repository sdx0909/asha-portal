const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Mock data
const mockUsers = {
  'admin@gmail.com': {
    id: '1',
    email: 'admin@gmail.com',
    password: 'Admin@123',
    role: 'ADMIN'
  },
  'sunita.dixit.asha@gmail.com': {
    id: '2',
    email: 'sunita.dixit.asha@gmail.com',
    password: 'Dixit.Sunita@123',
    role: 'ASHA'
  }
};

// Mock OTP storage (in production, use Redis or database)
const otpStorage = new Map();

// Utility functions
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateJWT = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 60) // 30 minutes
  };
  
  // Simple base64 encoding for demo (not secure for production)
  return btoa(JSON.stringify(payload));
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'ASHA-PORTAL Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = mockUsers[email.toLowerCase()];
    
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpKey = `${user.id}_${email}`;
    
    // Store OTP with expiration (2 minutes)
    otpStorage.set(otpKey, {
      otp,
      expiresAt: Date.now() + (2 * 60 * 1000),
      attempts: 0
    });

    console.log(`🔐 OTP for ${email}: ${otp}`);

    res.json({
      success: true,
      message: 'Login successful. OTP sent for verification.',
      data: {
        userId: user.id,
        email: user.email,
        role: user.role,
        requiresOTP: true,
        // For demo purposes only
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// OTP verification endpoint
app.post('/api/auth/verify-otp', (req, res) => {
  try {
    const { userId, email, otp } = req.body;

    if (!userId || !email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'User ID, email, and OTP are required'
      });
    }

    const otpKey = `${userId}_${email}`;
    const storedOTP = otpStorage.get(otpKey);

    if (!storedOTP) {
      return res.status(401).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    if (Date.now() > storedOTP.expiresAt) {
      otpStorage.delete(otpKey);
      return res.status(401).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    if (storedOTP.otp !== otp) {
      storedOTP.attempts += 1;
      
      if (storedOTP.attempts >= 3) {
        otpStorage.delete(otpKey);
        return res.status(401).json({
          success: false,
          message: 'Too many failed attempts. Please request a new OTP.'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // OTP verified successfully
    otpStorage.delete(otpKey);

    const user = Object.values(mockUsers).find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const token = generateJWT(user);

    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          lastLogin: new Date().toISOString()
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
});

// Resend OTP endpoint
app.post('/api/auth/resend-otp', (req, res) => {
  try {
    const { userId, email } = req.body;

    if (!userId || !email) {
      return res.status(400).json({
        success: false,
        message: 'User ID and email are required'
      });
    }

    const user = Object.values(mockUsers).find(u => u.id === userId && u.email === email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpKey = `${userId}_${email}`;
    
    otpStorage.set(otpKey, {
      otp,
      expiresAt: Date.now() + (2 * 60 * 1000),
      attempts: 0
    });

    console.log(`🔐 Resent OTP for ${email}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP resent successfully',
      data: {
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      }
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Get current user endpoint
app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const payload = JSON.parse(atob(token));
      
      // Check if token is expired
      if (payload.exp * 1000 < Date.now()) {
        return res.status(401).json({
          success: false,
          message: 'Token has expired'
        });
      }

      const user = Object.values(mockUsers).find(u => u.id === payload.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role
          }
        }
      });

    } catch (decodeError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Validate token endpoint
app.get('/api/auth/validate-token', (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const payload = JSON.parse(atob(token));
      
      if (payload.exp * 1000 < Date.now()) {
        return res.status(401).json({
          success: false,
          message: 'Token has expired'
        });
      }

      res.json({
        success: true,
        message: 'Token is valid',
        data: {
          user: {
            id: payload.userId,
            email: payload.email,
            role: payload.role
          }
        }
      });

    } catch (decodeError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

  } catch (error) {
    console.error('Validate token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 ASHA-PORTAL Backend running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   POST /api/auth/login`);
  console.log(`   POST /api/auth/verify-otp`);
  console.log(`   POST /api/auth/resend-otp`);
  console.log(`   POST /api/auth/logout`);
  console.log(`   GET  /api/auth/me`);
  console.log(`   GET  /api/auth/validate-token`);
  console.log(`\n👥 Demo Users:`);
  console.log(`   Admin: admin@gmail.com / Admin@123`);
  console.log(`   ASHA:  sunita.dixit.asha@gmail.com / Dixit.Sunita@123`);
});

module.exports = app;