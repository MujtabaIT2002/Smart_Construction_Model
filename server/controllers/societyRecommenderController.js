const axios = require('axios');

// Controller function to get society recommendations
exports.getSocietyRecommendations = async (req, res) => {
  const { city, price_bin, marla } = req.body;

  // Validate user input
  if (!city || !price_bin || !marla) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Send a request to the Flask API
    const flaskResponse = await axios.post('http://localhost:5002/recommend', {
      city,
      price_bin,  // Send the price bin
      marla
    });

    // Check if Flask responded with recommendations
    const recommendations = flaskResponse.data.recommendations;

    // Return the recommendations to the client
    res.status(200).json({ recommendations });
  } catch (error) {
    // Handle error cases, such as no societies found
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'No societies found for the given filters' });
    } else {
      console.error('Error fetching recommendations:', error.message);
      return res.status(500).json({ error: 'Server error. Please try again later.' });
    }
  }
};
