const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStandardMaterials = async () => {
  return await prisma.standardMaterial.findMany();
};

module.exports = { getStandardMaterials };
