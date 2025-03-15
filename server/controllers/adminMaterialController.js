// controllers/adminMaterialController.js

const adminMaterialModel = require('../models/adminMaterialModel');

// Get All Standard Materials
exports.getAllStandardMaterials = async (req, res) => {
  try {
    const materials = await adminMaterialModel.getAllStandardMaterials();
    res.json({ materials });
  } catch (error) {
    console.error('Error fetching standard materials:', error);
    res.status(500).json({ error: 'Unable to fetch standard materials' });
  }
};

// Get Standard Material by ID
exports.getStandardMaterialById = async (req, res) => {
  const { id } = req.params;
  try {
    const material = await adminMaterialModel.getStandardMaterialById(id);
    if (material) {
      res.json({ material });
    } else {
      res.status(404).json({ error: 'Standard material not found' });
    }
  } catch (error) {
    console.error('Error fetching standard material:', error);
    res.status(500).json({ error: 'Unable to fetch standard material' });
  }
};

// Update Standard Material
exports.updateStandardMaterial = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedMaterial = await adminMaterialModel.updateStandardMaterialById(id, data);
    res.json({ success: true, material: updatedMaterial });
  } catch (error) {
    console.error('Error updating StandardMaterial:', error);
    res.status(500).json({ error: 'Unable to update StandardMaterial' });
  }
};

// Get All Quality Materials
exports.getAllQualityMaterials = async (req, res) => {
  try {
    const materials = await adminMaterialModel.getAllQualityMaterials();
    res.json({ materials });
  } catch (error) {
    console.error('Error fetching quality materials:', error);
    res.status(500).json({ error: 'Unable to fetch quality materials' });
  }
};

// Get Quality Material by ID
exports.getQualityMaterialById = async (req, res) => {
  const { id } = req.params;
  try {
    const material = await adminMaterialModel.getQualityMaterialById(id);
    if (material) {
      res.json({ material });
    } else {
      res.status(404).json({ error: 'Quality material not found' });
    }
  } catch (error) {
    console.error('Error fetching quality material:', error);
    res.status(500).json({ error: 'Unable to fetch quality material' });
  }
};

// Update Quality Material
exports.updateQualityMaterial = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedMaterial = await adminMaterialModel.updateQualityMaterialById(id, data);
    res.json({ success: true, material: updatedMaterial });
  } catch (error) {
    console.error('Error updating QualityMaterial:', error);
    res.status(500).json({ error: 'Unable to update QualityMaterial' });
  }
};

// Get All Quality Material Quantities
exports.getAllQualityMaterialQuantities = async (req, res) => {
  try {
    const quantities = await adminMaterialModel.getAllQualityMaterialQuantities();
    res.json({ quantities });
  } catch (error) {
    console.error('Error fetching material quantities:', error);
    res.status(500).json({ error: 'Unable to fetch material quantities' });
  }
};

// Get Quality Material Quantity by ID
exports.getQualityMaterialQuantityById = async (req, res) => {
  const { id } = req.params;
  try {
    const quantity = await adminMaterialModel.getQualityMaterialQuantityById(id);
    if (quantity) {
      res.json({ quantity });
    } else {
      res.status(404).json({ error: 'Material quantity not found' });
    }
  } catch (error) {
    console.error('Error fetching material quantity:', error);
    res.status(500).json({ error: 'Unable to fetch material quantity' });
  }
};

// Update Quality Material Quantity
exports.updateQualityMaterialQuantity = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedQuantity = await adminMaterialModel.updateQualityMaterialQuantityById(id, data);
    res.json({ success: true, quantity: updatedQuantity });
  } catch (error) {
    console.error('Error updating material quantity:', error);
    res.status(500).json({ error: 'Unable to update material quantity' });
  }
};

// Get All Electrical Costs
exports.getAllElectricalCosts = async (req, res) => {
  try {
    const costs = await adminMaterialModel.getAllElectricalCosts();
    res.json({ costs });
  } catch (error) {
    console.error('Error fetching electrical costs:', error);
    res.status(500).json({ error: 'Unable to fetch electrical costs' });
  }
};

// Get Electrical Cost by ID
exports.getElectricalCostById = async (req, res) => {
  const { id } = req.params;
  try {
    const cost = await adminMaterialModel.getElectricalCostById(id);
    if (cost) {
      res.json({ electricalCost: cost });
    } else {
      res.status(404).json({ error: 'Electrical cost not found' });
    }
  } catch (error) {
    console.error('Error fetching electrical cost:', error);
    res.status(500).json({ error: 'Unable to fetch electrical cost' });
  }
};

// Update Electrical Cost
exports.updateElectricalCost = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedCost = await adminMaterialModel.updateElectricalCostById(id, data);
    res.json({ success: true, electricalCost: updatedCost });
  } catch (error) {
    console.error('Error updating ElectricalCost:', error);
    res.status(500).json({ error: 'Unable to update ElectricalCost' });
  }
};
