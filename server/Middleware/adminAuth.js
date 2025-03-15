// middleware/adminAuth.js

const jwt = require('jsonwebtoken');

// Middleware to authenticate admin via JWT token
const authenticateAdmin = (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token corresponds to the admin credentials
    if (decoded.email === process.env.ADMIN_EMAIL && decoded.role === 'ADMIN') {
      // Attach admin information to the request object
      req.user = decoded;
      // Proceed to the next middleware or route handler
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Admins only.' });
    }
  } catch (error) {
    // Handle invalid or expired token
    console.error('Invalid token:', error);
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = { authenticateAdmin };
