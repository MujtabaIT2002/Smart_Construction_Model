// routes/userSearchRoutes.js
const express = require('express');
const router = express.Router();
const { 
  recordUserSearch, 
  getUserSearchHistory,
  deleteAllUserSearchRecords 
} = require('../controllers/userSearchController');
const { authenticateUser } = require('../Middleware/authenticate'); // Adjust the path if needed

// Route to record a user's search
router.post('/record-search', authenticateUser, recordUserSearch);

// Route to get a user's search history
router.get('/search-history', authenticateUser, getUserSearchHistory);

router.delete('/delete-all', authenticateUser, deleteAllUserSearchRecords);

module.exports = router;
