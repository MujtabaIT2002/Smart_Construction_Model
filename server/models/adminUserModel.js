// models/adminUserModel.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all users
exports.getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

// Get user by ID
exports.getUserById = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

// Delete user by ID
exports.deleteUserById = async (userId) => {
  return await prisma.user.delete({
    where: { id: userId },
  });
};
