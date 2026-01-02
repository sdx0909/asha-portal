const User = require('../models/User.model');

/**
 * Predefined users for ASHA-PORTAL
 */
const predefinedUsers = [
  {
    email: 'admin@gmail.com',
    password: 'Admin@123',
    role: 'ADMIN'
  },
  {
    email: 'sunita.dixit.asha@gmail.com',
    password: 'Dixit.Sunita@123',
    role: 'ASHA'
  }
];

/**
 * Seed initial users into database
 * Only creates users if they don't already exist
 */
const seedUsers = async () => {
  try {
    console.log('🌱 Seeding initial users...');
    
    for (const userData of predefinedUsers) {
      // Check if user already exists
      const existingUser = await User.findByEmail(userData.email);
      
      if (existingUser) {
        console.log(`✅ User ${userData.email} already exists`);
        continue;
      }
      
      // Create new user
      const user = new User(userData);
      await user.save();
      
      console.log(`✅ Created user: ${userData.email} (${userData.role})`);
    }
    
    console.log('🌱 User seeding completed');
    
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

/**
 * Reset all users (for development/testing)
 * WARNING: This will delete all existing users and recreate predefined ones
 */
const resetUsers = async () => {
  try {
    console.log('🔄 Resetting users...');
    
    // Delete all existing users
    await User.deleteMany({});
    console.log('🗑️ Deleted all existing users');
    
    // Seed predefined users
    await seedUsers();
    
    console.log('🔄 User reset completed');
    
  } catch (error) {
    console.error('❌ Error resetting users:', error);
    throw error;
  }
};

/**
 * Get predefined users list (without passwords)
 */
const getPredefinedUsers = () => {
  return predefinedUsers.map(user => ({
    email: user.email,
    role: user.role
  }));
};

/**
 * Check if email is a predefined user
 */
const isPredefinedUser = (email) => {
  return predefinedUsers.some(user => 
    user.email.toLowerCase() === email.toLowerCase()
  );
};

/**
 * Get user role by email (for predefined users)
 */
const getUserRoleByEmail = (email) => {
  const user = predefinedUsers.find(user => 
    user.email.toLowerCase() === email.toLowerCase()
  );
  return user ? user.role : null;
};

/**
 * Validate predefined user credentials
 */
const validatePredefinedCredentials = (email, password) => {
  const user = predefinedUsers.find(user => 
    user.email.toLowerCase() === email.toLowerCase()
  );
  
  if (!user) {
    return { valid: false, message: 'User not found' };
  }
  
  if (user.password !== password) {
    return { valid: false, message: 'Invalid password' };
  }
  
  return { 
    valid: true, 
    user: { 
      email: user.email, 
      role: user.role 
    } 
  };
};

module.exports = {
  seedUsers,
  resetUsers,
  getPredefinedUsers,
  isPredefinedUser,
  getUserRoleByEmail,
  validatePredefinedCredentials,
  predefinedUsers
};