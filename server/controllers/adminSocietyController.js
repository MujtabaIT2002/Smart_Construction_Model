// controllers/adminSocietyController.js

const adminSocietyModel = require('../models/adminSocietyModel');

// Add a New Society
exports.addSociety = async (req, res) => {
  const data = req.body;

  try {
    const newSociety = await adminSocietyModel.createSociety(data);
    res.status(201).json({ success: true, society: newSociety });
  } catch (error) {
    console.error('Error adding society:', error);
    if (error.code === 'P2002') {
      // Prisma unique constraint failed
      res.status(400).json({ error: 'Society with this name and city already exists.' });
    } else {
      res.status(500).json({ error: 'Unable to add society' });
    }
  }
};

// Get All Societies
exports.getAllSocieties = async (req, res) => {
  try {
    const societies = await adminSocietyModel.getAllSocieties();
    res.json({ societies });
  } catch (error) {
    console.error('Error fetching societies:', error);
    res.status(500).json({ error: 'Unable to fetch societies' });
  }
};

// Get Society by ID
exports.getSocietyById = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const society = await adminSocietyModel.getSocietyById(id);
    if (society) {
      res.json({ society });
    } else {
      res.status(404).json({ error: 'Society not found' });
    }
  } catch (error) {
    console.error('Error fetching society:', error);
    res.status(500).json({ error: 'Unable to fetch society' });
  }
};

// Update Society
exports.updateSociety = async (req, res) => {
  const id = parseInt(req.params.id);
  const data = req.body;

  try {
    const updatedSociety = await adminSocietyModel.updateSocietyById(id, data);
    res.json({ success: true, society: updatedSociety });
  } catch (error) {
    console.error('Error updating society:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Society with this name and city already exists.' });
    } else {
      res.status(500).json({ error: 'Unable to update society' });
    }
  }
};

// Delete Society
exports.deleteSociety = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await adminSocietyModel.deleteSocietyById(id);
    res.json({ success: true, message: 'Society deleted successfully' });
  } catch (error) {
    console.error('Error deleting society:', error);
    res.status(500).json({ error: 'Unable to delete society' });
  }
};
