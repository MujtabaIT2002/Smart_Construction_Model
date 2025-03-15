// controllers/adminUserController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const adminUserModel = require('../models/adminUserModel');

// Admin Login
exports.adminLogin = (req, res) => {
  const { email, password } = req.body;

  // Validate admin credentials
  if (email === process.env.ADMIN_EMAIL) {
    // Compare the provided password with the admin password from environment variables
    if (password === process.env.ADMIN_PASSWORD) {
      // Generate a JWT token
      const token = jwt.sign(
        { email, role: 'ADMIN' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: 'Invalid admin credentials' });
    }
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
};

// Get Admin Dashboard
exports.getAdminDashboard = (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard' });
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await adminUserModel.getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Unable to fetch users' });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await adminUserModel.getUserById(userId);
    if (user) {
      res.json({ user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Unable to fetch user' });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    await adminUserModel.deleteUserById(userId);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Unable to delete user' });
  }
};
