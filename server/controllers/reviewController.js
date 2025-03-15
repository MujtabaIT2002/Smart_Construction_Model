const { createReview, getAllReviews } = require('../models/reviewModel');

const addReview = async (req, res) => {
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    try {
        console.log('Received rating:', rating);

        const review = await createReview({ 
            rating: parseInt(rating), // Ensure rating is an integer
            comment, 
            userId 
        });

        res.status(201).json({ message: 'Review submitted successfully!', review });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ message: 'Failed to submit review' });
    }
};

const fetchReviews = async (req, res) => {
    try {
        const reviews = await getAllReviews();
        res.status(200).json({ data: reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
};

module.exports = {
    addReview,
    fetchReviews  // Ensure this is exported
};
