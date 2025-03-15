const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getPrediction = async (req, res) => {
    let { city, society, marla } = req.body;
  
    try {
      // Log incoming request data
      console.log('Incoming Request Data:', { city, society, marla });
  
      // Verify society exists in the database
      const societyRecord = await prisma.society.findFirst({
        where: {
          city: city,
          society: society,
        },
      });
  
      if (!societyRecord) {
        console.warn('Society not found in the specified city:', { city, society });
        return res.status(404).json({ error: 'Society not found in the specified city.' });
      }
  
      // Prepare data to send to Flask server
      const requestData = {
        city,
        location: society,  // 'location' key with value of 'society'
        marla: parseFloat(marla),
      };
  
      // Log the data being sent to the Flask server
      console.log('Data sent to Flask server:', requestData);
  
      // Send request to Flask server
      const response = await axios.post('http://localhost:5001/predict', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Log the response received from Flask
      console.log('Response received from Flask server:', response.data);
  
      // Extract prediction and plotData
      let { prediction, plotData } = response.data;

      // Remove the first occurrence of the year 2024, if there are duplicates
      let has2024Entry = false;
      plotData = plotData.filter(item => {
        if (item.Date === 2024) {
          if (!has2024Entry) {
            has2024Entry = true;  // Mark the first occurrence of 2024
            return false;  // Skip the first occurrence of 2024
          }
        }
        return true;  // Keep other entries including the second occurrence of 2024
      });

      // Send the filtered data back to the client
      res.json({ prediction, plotData });

    } catch (error) {
      // Handle errors based on the type of error (response, request, or other)
      if (error.response) {
        console.error('Error in predictionController (Flask Response Error):', error.response.status, error.response.data);
        return res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        console.error('No response received from Flask:', error.message);
        return res.status(500).json({ error: 'No response from prediction service.' });
      } else {
        console.error('Error in setting up request:', error.message);
        return res.status(500).json({ error: 'An error occurred while setting up the request.' });
      }
    }
};
