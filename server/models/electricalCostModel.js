const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getElectricalCosts = async () => {
  return await prisma.electricalCost.findMany();
};

module.exports = { getElectricalCosts };
