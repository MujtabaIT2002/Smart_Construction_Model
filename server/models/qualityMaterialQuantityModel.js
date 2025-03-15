const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getQualityMaterialQuantities = async () => {
  return await prisma.qualityMaterialQuantity.findMany();
};

module.exports = { getQualityMaterialQuantities };
