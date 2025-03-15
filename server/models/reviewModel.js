// models/reviewModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createReview = async (data) => {
  return await prisma.review.create({ data });
};

const getAllReviews = async () => {
  return await prisma.review.findMany({
    include: { user: { select: { name: true } } }
  });
};

module.exports = {
  createReview,
  getAllReviews
};
