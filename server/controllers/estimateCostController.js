const axios = require('axios');
const { getStandardMaterials } = require('../models/standardMaterialModel');
const { getQualityMaterials } = require('../models/qualityMaterialModel');
const { getQualityMaterialQuantities } = require('../models/qualityMaterialQuantityModel');
const { getElectricalCosts } = require('../models/electricalCostModel');

const estimateCost = async (req, res) => {
  try {
    const requestData = req.body;

    // Fetch data from the database
    const standardMaterials = await getStandardMaterials();
    const qualityMaterials = await getQualityMaterials();
    const qualityMaterialQuantities = await getQualityMaterialQuantities();
    const electricalCosts = await getElectricalCosts();

    // Format the fetched data to match the format expected by Flask
    const formattedStandardMaterials = standardMaterials.map((material) => ({
      Material: material.material,
      "Rate (PKR/sqft)": material.rate,
      "Quantity (units/sqft)": material.quantity,
    }));

    const qualityMaterialData = qualityMaterials.reduce((acc, material) => {
      if (!acc[material.material]) acc[material.material] = {};
      acc[material.material][material.quality] = material.rate;
      return acc;
    }, {});

    const qualityMaterialQuantityData = qualityMaterialQuantities.reduce((acc, material) => {
      acc[material.material] = material.quantity;
      return acc;
    }, {});

    const electricalCostData = electricalCosts.reduce((acc, item) => {
      if (!acc[item.quality]) acc[item.quality] = {};
      acc[item.quality][item.item] = item.rate;
      return acc;
    }, {});

    // Add fetched data to the request body
    const updatedRequestData = {
      ...requestData,
      standard_materials_data: formattedStandardMaterials,
      quality_material_data: qualityMaterialData,
      quality_material_quantity_data: qualityMaterialQuantityData,
      electrical_cost_data: electricalCostData,
    };

    // Send request to Flask server with the updated data
    const flaskResponse = await axios.post(
      'http://localhost:5000/api/calculate-cost',
      updatedRequestData
    );

    // Log the cost data in the Node.js terminal
    console.log('Cost Data from Flask:', flaskResponse.data);

    // Send the cost data back to React
    res.status(200).json(flaskResponse.data);

  } catch (error) {
    console.error('Error sending data to Flask:', error);
    res.status(500).send('Error processing the request.');
  }
};

module.exports = { estimateCost };
