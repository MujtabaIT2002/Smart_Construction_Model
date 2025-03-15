const express = require('express');
const { estimateCost } = require('../controllers/estimateCostController');
const router = express.Router();

router.post('/estimate-cost', estimateCost);

module.exports = router;
