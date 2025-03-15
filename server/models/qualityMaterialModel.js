const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getQualityMaterials = async () => {
  return await prisma.qualityMaterial.findMany();
};

module.exports = { getQualityMaterials };
