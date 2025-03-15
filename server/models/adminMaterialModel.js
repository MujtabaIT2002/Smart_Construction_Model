// models/adminMaterialModel.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get All Standard Materials
exports.getAllStandardMaterials = async () => {
  return await prisma.standardMaterial.findMany();
};

// Get Standard Material by ID
exports.getStandardMaterialById = async (id) => {
  return await prisma.standardMaterial.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update Standard Material by ID
exports.updateStandardMaterialById = async (id, data) => {
  return await prisma.standardMaterial.update({
    where: { id: parseInt(id) },
    data,
  });
};

// Get All Quality Materials
exports.getAllQualityMaterials = async () => {
  return await prisma.qualityMaterial.findMany();
};

// Get Quality Material by ID
exports.getQualityMaterialById = async (id) => {
  return await prisma.qualityMaterial.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update Quality Material by ID
exports.updateQualityMaterialById = async (id, data) => {
  return await prisma.qualityMaterial.update({
    where: { id: parseInt(id) },
    data,
  });
};

// Get All Quality Material Quantities
exports.getAllQualityMaterialQuantities = async () => {
  return await prisma.qualityMaterialQuantity.findMany();
};

// Get Quality Material Quantity by ID
exports.getQualityMaterialQuantityById = async (id) => {
  return await prisma.qualityMaterialQuantity.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update Quality Material Quantity by ID
exports.updateQualityMaterialQuantityById = async (id, data) => {
  return await prisma.qualityMaterialQuantity.update({
    where: { id: parseInt(id) },
    data,
  });
};

// Get All Electrical Costs
exports.getAllElectricalCosts = async () => {
  return await prisma.electricalCost.findMany();
};

// Get Electrical Cost by ID
exports.getElectricalCostById = async (id) => {
  return await prisma.electricalCost.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update Electrical Cost by ID
exports.updateElectricalCostById = async (id, data) => {
  return await prisma.electricalCost.update({
    where: { id: parseInt(id) },
    data,
  });
};
