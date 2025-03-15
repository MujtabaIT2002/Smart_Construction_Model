const express = require('express');
const { submitReview, getSocietyReviews, getTopTrendingSocieties } = require('../controllers/societyReviewController');
const { authenticateUser } = require('../Middleware/authenticate'); // Destructure authenticateUser

const router = express.Router();

// Route to submit a new review (Protected)
router.post('/society/:societyId/reviews', authenticateUser, submitReview);

// Route to get all reviews for a specific society
router.get('/society/:societyId/reviews', getSocietyReviews);

// Route to get top trending societies for a specific city
router.get('/top-trending-societies', getTopTrendingSocieties);

module.exports = router;
