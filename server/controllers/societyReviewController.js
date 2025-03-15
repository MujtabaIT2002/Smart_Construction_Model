const {
    findSocietyById,
    findReviewsForSociety,
    createReviewForSociety,
    findTopTrendingSocietiesByCity,
  } = require('../models/societyReviewmodel'); // Import the model functions
  
  // Submit a new review
  const submitReview = async (req, res) => {
    const { societyId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId; // Use req.user.userId from the decoded token
  
    // Validate the rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }
  
    try {
      // Check if the society exists using the model
      const society = await findSocietyById(societyId);
  
      if (!society) {
        return res.status(404).json({ message: 'Society not found.' });
      }
  
      // Create the review using the model
      const review = await createReviewForSociety(societyId, userId, rating, comment);
  
      return res.status(201).json({ message: 'Review submitted successfully!', review });
    } catch (error) {
      console.error('Error submitting review:', error);
      return res.status(500).json({ message: 'An error occurred while submitting the review.' });
    }
  };
  
  // Get all reviews for a society
  const getSocietyReviews = async (req, res) => {
    const { societyId } = req.params;
  
    try {
      // Fetch all reviews for the society using the model
      const reviews = await findReviewsForSociety(societyId);
  
      return res.status(200).json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return res.status(500).json({ message: 'An error occurred while fetching reviews.' });
    }
  };
  
  // Get top 10 trending societies based on the number of reviews for a specific city
  const getTopTrendingSocieties = async (req, res) => {
    const { city } = req.query;
  
    if (!city) {
      return res.status(400).json({ message: 'City is required to fetch top trending societies.' });
    }
  
    try {
      // Fetch top trending societies using the model
      const societies = await findTopTrendingSocietiesByCity(city);
  
      return res.status(200).json(societies);
    } catch (error) {
      console.error('Error fetching top trending societies:', error);
      return res.status(500).json({ message: 'An error occurred while fetching top trending societies.' });
    }
  };
  
  module.exports = {
    submitReview,
    getSocietyReviews,
    getTopTrendingSocieties,
  };
  