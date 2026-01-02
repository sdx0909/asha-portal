/**
 * Role-based Authorization Middleware
 * Checks if user has required role(s) to access resource
 */

/**
 * Create role middleware for specific roles
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 * @returns {Function} Express middleware function
 */
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Ensure user is authenticated (should be called after authMiddleware)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Convert single role to array for consistent handling
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      
      // Check if user's role is in allowed roles
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.',
          requiredRoles: roles,
          userRole: req.user.role
        });
      }

      next();

    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

/**
 * Admin only middleware
 */
const adminOnly = roleMiddleware('ADMIN');

/**
 * ASHA only middleware
 */
const ashaOnly = roleMiddleware('ASHA');

/**
 * Admin or ASHA middleware (any authenticated user)
 */
const authenticatedUser = roleMiddleware(['ADMIN', 'ASHA']);

/**
 * Check if user is admin
 * @param {Object} req - Express request object
 * @returns {boolean} True if user is admin
 */
const isAdmin = (req) => {
  return req.user && req.user.role === 'ADMIN';
};

/**
 * Check if user is ASHA
 * @param {Object} req - Express request object
 * @returns {boolean} True if user is ASHA
 */
const isAsha = (req) => {
  return req.user && req.user.role === 'ASHA';
};

/**
 * Check if user has specific role
 * @param {Object} req - Express request object
 * @param {string} role - Role to check
 * @returns {boolean} True if user has the role
 */
const hasRole = (req, role) => {
  return req.user && req.user.role === role;
};

/**
 * Check if user has any of the specified roles
 * @param {Object} req - Express request object
 * @param {string[]} roles - Array of roles to check
 * @returns {boolean} True if user has any of the roles
 */
const hasAnyRole = (req, roles) => {
  return req.user && roles.includes(req.user.role);
};

module.exports = {
  roleMiddleware,
  adminOnly,
  ashaOnly,
  authenticatedUser,
  isAdmin,
  isAsha,
  hasRole,
  hasAnyRole
};