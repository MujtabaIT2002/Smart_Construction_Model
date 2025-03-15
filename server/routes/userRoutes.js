const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController'); // Adjust the path if needed
const { authenticateUser } = require('../Middleware/authenticate'); // Import the authenticateUser middleware

// Register and Login Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route to get the user profile (requires authentication)
router.get('/profile', authenticateUser, getUserProfile);

module.exports = router;
