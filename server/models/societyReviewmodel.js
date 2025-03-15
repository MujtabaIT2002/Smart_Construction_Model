const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Find a society by its ID
const findSocietyById = async (societyId) => {
  return await prisma.society.findUnique({
    where: { id: parseInt(societyId) },
  });
};

// Find all reviews for a society
const findReviewsForSociety = async (societyId) => {
  return await prisma.societyReview.findMany({
    where: { societyId: parseInt(societyId) },
    include: { user: { select: { name: true } } }, // Include user's name
    orderBy: { createdAt: 'desc' }, // Order by the most recent reviews first
  });
};

// Create a new review for a society
const createReviewForSociety = async (societyId, userId, rating, comment) => {
  return await prisma.societyReview.create({
    data: {
      societyId: parseInt(societyId),
      userId: userId,
      rating: rating,
      comment: comment || null, // Optional comment
    },
  });
};

// Find top trending societies in a specific city based on the number of reviews
const findTopTrendingSocietiesByCity = async (city) => {
  return await prisma.society.findMany({
    where: { city },
    include: {
      _count: {
        select: { reviews: true }, // Count the number of reviews for each society
      },
    },
    orderBy: {
      reviews: { _count: 'desc' }, // Sort by the number of reviews in descending order
    },
    take: 10, // Limit to top 10 societies
  });
};

module.exports = {
  findSocietyById,
  findReviewsForSociety,
  createReviewForSociety,
  findTopTrendingSocietiesByCity,
};
