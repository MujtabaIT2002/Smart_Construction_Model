const jwt = require('jsonwebtoken');

// Middleware to authenticate user via JWT token
const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Log the decoded token to check its structure
    console.log('Decoded token:', decoded);

    // Attach decoded user information (e.g., userId, role) to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle invalid token
    console.error('Invalid token:', error);
    return res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = { authenticateUser };
