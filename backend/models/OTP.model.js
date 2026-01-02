const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  otp: {
    type: String,
    required: true,
    length: 6
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function() {
      // OTP expires in 2 minutes
      return new Date(Date.now() + 2 * 60 * 1000);
    }
  }
}, {
  timestamps: true
});

// Index for automatic deletion of expired documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for performance
otpSchema.index({ userId: 1, email: 1 });
otpSchema.index({ otp: 1 });

// Instance method to check if OTP is valid
otpSchema.methods.isValid = function() {
  return !this.isUsed && 
         this.expiresAt > new Date() && 
         this.attempts < 3;
};

// Instance method to increment attempts
otpSchema.methods.incrementAttempts = function() {
  this.attempts += 1;
  return this.save();
};

// Instance method to mark as used
otpSchema.methods.markAsUsed = function() {
  this.isUsed = true;
  return this.save();
};

// Static method to generate 6-digit OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Static method to create new OTP for user
otpSchema.statics.createForUser = async function(userId, email) {
  // Remove any existing OTPs for this user
  await this.deleteMany({ userId, email });
  
  // Generate new OTP
  const otp = this.generateOTP();
  
  // Create new OTP record
  return await this.create({
    userId,
    email: email.toLowerCase(),
    otp
  });
};

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function(userId, email, otpCode) {
  const otpRecord = await this.findOne({
    userId,
    email: email.toLowerCase(),
    otp: otpCode,
    isUsed: false
  });
  
  if (!otpRecord) {
    return { success: false, message: 'Invalid OTP' };
  }
  
  if (!otpRecord.isValid()) {
    return { success: false, message: 'OTP has expired or exceeded maximum attempts' };
  }
  
  // Mark OTP as used
  await otpRecord.markAsUsed();
  
  return { success: true, message: 'OTP verified successfully' };
};

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;