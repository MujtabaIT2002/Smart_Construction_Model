// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../Middleware/adminAuth');

// Import admin controllers
const adminUserController = require('../controllers/adminUserController');
const adminMaterialController = require('../controllers/adminMaterialController');
const adminSocietyController = require('../controllers/adminSocietyController');

// Admin Login Route
router.post('/admin/login', adminUserController.adminLogin);

// Protected Route: Get Admin Dashboard
router.get('/admin/dashboard', authenticateAdmin, adminUserController.getAdminDashboard);

// User Routes
router.get('/admin/users', authenticateAdmin, adminUserController.getAllUsers);
router.get('/admin/users/:id', authenticateAdmin, adminUserController.getUserById);


// StandardMaterial Routes
router.get('/admin/standard-materials', authenticateAdmin, adminMaterialController.getAllStandardMaterials);
router.get('/admin/standard-materials/:id', authenticateAdmin, adminMaterialController.getStandardMaterialById);
router.put('/admin/standard-materials/:id', authenticateAdmin, adminMaterialController.updateStandardMaterial);

// QualityMaterial Routes
router.get('/admin/quality-materials', authenticateAdmin, adminMaterialController.getAllQualityMaterials);
router.get('/admin/quality-materials/:id', authenticateAdmin, adminMaterialController.getQualityMaterialById);
router.put('/admin/quality-materials/:id', authenticateAdmin, adminMaterialController.updateQualityMaterial);

// QualityMaterialQuantity Routes
router.get('/admin/quality-material-quantities', authenticateAdmin, adminMaterialController.getAllQualityMaterialQuantities);
router.get('/admin/quality-material-quantities/:id', authenticateAdmin, adminMaterialController.getQualityMaterialQuantityById);
router.put('/admin/quality-material-quantities/:id', authenticateAdmin, adminMaterialController.updateQualityMaterialQuantity);

// ElectricalCost Routes
router.get('/admin/electrical-costs', authenticateAdmin, adminMaterialController.getAllElectricalCosts);
router.get('/admin/electrical-costs/:id', authenticateAdmin, adminMaterialController.getElectricalCostById);
router.put('/admin/electrical-costs/:id', authenticateAdmin, adminMaterialController.updateElectricalCost);

// Society Routes
router.post('/admin/societies', authenticateAdmin, adminSocietyController.addSociety);
router.get('/admin/societies', authenticateAdmin, adminSocietyController.getAllSocieties);
router.get('/admin/societies/:id', authenticateAdmin, adminSocietyController.getSocietyById);
router.put('/admin/societies/:id', authenticateAdmin, adminSocietyController.updateSociety);
router.delete('/admin/societies/:id', authenticateAdmin, adminSocietyController.deleteSociety);

module.exports = router;
