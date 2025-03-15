const { countSearchesForSociety, getSearchesWithTimestamps, getSimilarSocieties } = require('../models/societytrendsmodel');

exports.getSocietyTrends = async (req, res) => {
  let { societyId } = req.params;

  // Convert societyId to an integer
  societyId = parseInt(societyId, 10);

  if (isNaN(societyId)) {
    return res.status(400).json({ error: 'Invalid society ID' });
  }

  try {
    // Step 1: Get the search count for the society
    const searchCount = await countSearchesForSociety(societyId);

    // Step 2: Fetch searches with timestamps to calculate trends
    const searches = await getSearchesWithTimestamps(societyId);

    // Step 3: Determine the trend based on the search count
    let trend = 'Stable';
    if (searchCount > 100) {
      trend = 'Rising';
    } else if (searchCount < 20) {
      trend = 'Declining';
    }

    // Step 4: Fetch 5 nearby societies based on proximity (latitude & longitude)
    const similarSocieties = await getSimilarSocieties(societyId);

    // Return the society trend data along with nearby society recommendations
    res.status(200).json({
      societyId,
      trend,
      searchCount,
      searches, // List of searches with timestamps
      similarSocieties // 5 nearest societies
    });
  } catch (error) {
    console.error('Error fetching society trends:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
