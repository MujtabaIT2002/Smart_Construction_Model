const express = require('express');
const { addReview, fetchReviews } = require('../controllers/reviewController');
const { authenticateUser } = require('../Middleware/authenticate');

const router = express.Router();

// Define routes with callback functions
router.post('/reviews', authenticateUser, addReview);   // POST route for adding a review
router.get('/reviews', fetchReviews);                   // GET route for fetching reviews

module.exports = router;
