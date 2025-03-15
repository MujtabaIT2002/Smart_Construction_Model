const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Haversine formula to calculate the distance between two coordinates (latitude and longitude)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLon / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Count the searches for a society by its ID
exports.countSearchesForSociety = async (societyId) => {
  return await prisma.userSearch.count({
    where: { societyId },
  });
};

// Get searches with timestamps for a society to show trends over time
exports.getSearchesWithTimestamps = async (societyId) => {
  return await prisma.userSearch.findMany({
    where: { societyId },
    select: {
      createdAt: true, // Fetch only the timestamp
    },
    orderBy: {
      createdAt: 'asc', // Sort by time in ascending order
    },
  });
};

// Get the 5 nearest societies based on latitude and longitude
exports.getSimilarSocieties = async (societyId) => {
  // Get the latitude and longitude of the searched society
  const searchedSociety = await prisma.society.findUnique({
    where: { id: societyId },
    select: {
      latitude: true,
      longitude: true,
    },
  });

  if (!searchedSociety) {
    throw new Error('Society not found');
  }

  const { latitude, longitude } = searchedSociety;

  // Fetch all other societies except the current one
  const societies = await prisma.society.findMany({
    where: {
      NOT: { id: societyId },
    },
  });

  // Calculate the distance for each society
  const societiesWithDistance = societies.map((society) => {
    const distance = calculateDistance(latitude, longitude, society.latitude, society.longitude);
    return { ...society, distance };
  });

  // Sort the societies by distance and return the 5 closest ones
  societiesWithDistance.sort((a, b) => a.distance - b.distance);

  return societiesWithDistance.slice(0, 5); // Return the 5 nearest societies
};
