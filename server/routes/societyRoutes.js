// routes/societyRoutes.js

const express = require('express');
const router = express.Router();
const {
  getSocieties,
  getSocietiesByPreferences,
  getSocietyAmenities,
} = require('../controllers/societyController'); // Import the necessary functions

// Define the route for fetching societies based on city and query (search by name)
router.get('/societies', getSocieties);

// Define the route for fetching societies based on preferences (search by preferences)
router.get('/societies/preferences', getSocietiesByPreferences);

// Define the route for fetching amenities of a specific society by ID
router.get('/societies/:id/amenities', getSocietyAmenities);

module.exports = router;
