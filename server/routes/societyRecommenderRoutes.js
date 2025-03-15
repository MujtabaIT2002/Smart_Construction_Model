const express = require('express');
const router = express.Router();
const { getSocietyRecommendations } = require('../controllers/societyRecommenderController');

// Route to get society recommendations based on user input
router.post('/recommend',getSocietyRecommendations);

module.exports = router;
