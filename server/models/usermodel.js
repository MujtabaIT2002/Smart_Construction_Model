// models/usermodels.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Find a user by email
exports.findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

// Create a new user
exports.createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

// Find a user by ID
exports.findUserById = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
};
