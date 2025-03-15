const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Find a society by ID
exports.findSocietyById = async (societyId) => {
  return await prisma.society.findUnique({
    where: { id: societyId },
  });
};

// Find a user by ID
exports.findUserById = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
};

exports.createUserSearch = async (userId, societyId) => {
  // Fetch the user's name
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  
  // Fetch the society's name
  const society = await prisma.society.findUnique({
    where: { id: societyId },
  });

  // Ensure both the user and society exist
  if (!user || !society) {
    throw new Error('User or Society not found.');
  }

  // Create a new UserSearch entry
  return await prisma.userSearch.create({
    data: {
      userId,
      societyId,
      userName: user.name, // Store user's name
      societyName: society.society, // Store society's name
    },
  });
};

// Get user search history
exports.getUserSearchHistory = async (userId) => {
  return await prisma.userSearch.findMany({
    where: { userId },
    include: {
      society: true, // Include society data
      user: true, // Include user data
    },
  });
};

// Delete all user search records
exports.deleteAllUserSearchRecords = async () => {
  return await prisma.userSearch.deleteMany(); // Delete all records
};
