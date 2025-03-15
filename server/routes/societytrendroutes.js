const express = require('express');
const router = express.Router();
const { getSocietyTrends } = require('../controllers/societytrendscontroller');

// Route to get trends for a society
router.get('/trends/:societyId', getSocietyTrends);

module.exports = router;
