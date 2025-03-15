// controllers/userSearchController.js
const { findSocietyById, createUserSearch, getUserSearchHistory, deleteAllUserSearchRecords, findUserById } = require('../models/usersearchmodel');

// Record a user's search
exports.recordUserSearch = async (req, res) => {
  const { societyId } = req.body;
  const userId = req.user.userId; // req.user is populated after authentication

  // Add these lines for debugging
  console.log('societyId:', societyId); // Logs the societyId received from the frontend
  console.log('userId:', userId);       // Logs the userId from the authenticated user

  try {
    // Check if the society exists using the model function
    const society = await findSocietyById(societyId);

    if (!society) {
      return res.status(404).json({ error: 'Society not found' });
    }

    // Check if the user exists
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new UserSearch entry using the model function
    await createUserSearch(userId, societyId);

    res.status(201).json({ message: 'Search recorded successfully.' });
  } catch (error) {
    console.error('Error recording search:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch the user's search history
exports.getUserSearchHistory = async (req, res) => {
  const userId = req.user.userId; // Fetch the logged-in user's ID

  try {
    // Fetch the user's search history using the model function
    const userSearchHistory = await getUserSearchHistory(userId);

    // Send the response with the user's search history
    res.json({
      searches: userSearchHistory.map((record) => ({
        societyId: record.society.id,   // Ensure societyId is included in the response
        societyName: record.society.society, // society name
        cityName: record.society.city,  // city name
        userName: record.user.name,     // user's name
        createdAt: record.createdAt,    // when the search was created
      })),
    });
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Failed to fetch search history.' });
  }
};

// Delete all user search records
exports.deleteAllUserSearchRecords = async (req, res) => {
  try {
    await deleteAllUserSearchRecords(); // Call the model function to delete all records
    res.status(200).json({ message: 'All user search records deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user search records:', error);
    res.status(500).json({ error: 'Failed to delete user search records.' });
  }
};
