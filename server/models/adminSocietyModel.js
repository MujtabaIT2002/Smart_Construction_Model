// models/adminSocietyModel.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add a new society
exports.createSociety = async (data) => {
  return await prisma.society.create({
    data,
  });
};

// Get all societies
exports.getAllSocieties = async () => {
  return await prisma.society.findMany();
};

// Get society by ID
exports.getSocietyById = async (id) => {
  return await prisma.society.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update society by ID
exports.updateSocietyById = async (id, data) => {
  return await prisma.society.update({
    where: { id: parseInt(id) },
    data,
  });
};

// Delete society by ID
exports.deleteSocietyById = async (id) => {
  return await prisma.society.delete({
    where: { id: parseInt(id) },
  });
};
