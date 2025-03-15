const express = require('express');
const cors = require('cors');
const estimateCostRoutes = require('./routes/estimateCostRoutes');
const societyRoutes = require('./routes/societyRoutes');
const userRoutes = require('./routes/userRoutes');
const userSearchRoutes = require('./routes/usersearchroutes');
const societyTrendsRoutes = require('./routes/societytrendroutes');
const predictionRoutes = require('./routes/predictionroutes');
const societyReviewRoutes = require('./routes/societyReviewRoutes');
const societyRecommenderRoutes = require('./routes/societyRecommenderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); // Add the new routes
require('dotenv').config();

const app = express();

// Enable CORS
app.use(
  cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// Set up the routes
app.use('/api', estimateCostRoutes);
app.use('/api', societyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-search', userSearchRoutes);
app.use('/api/society-trends', societyTrendsRoutes);
app.use('/api', predictionRoutes);
app.use('/api', societyReviewRoutes);
app.use('/api', societyRecommenderRoutes);
app.use('/api', adminRoutes);
app.use('/api/feedback', feedbackRoutes); // Add feedback routes
app.use('/api/reviews', reviewRoutes); // Add review routes

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Node.js server running on port ${PORT}`);
});
