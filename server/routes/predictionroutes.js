// routes/predictionRoutes.js

const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictioncontroller');

// Endpoint to handle prediction requests
router.post('/predict-property-price', predictionController.getPrediction);

module.exports = router;
