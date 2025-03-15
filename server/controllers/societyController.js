// controllers/societycontroller.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

// Define the amenities list (should match the frontend's list)
const amenitiesList = [
  'Institute',         // Corresponds to 'school' in Google Places API
  'Medical',           // 'hospital' or 'doctor'
  'Parks',             // 'park'
  'Gyms',              // 'gym'
  'Shopping',          // 'shopping_mall' or 'store'
  'Mosques',           // 'mosque'
  'Banks/ATMs',        // 'bank', 'atm'
  'Restaurants',       // 'restaurant'
  'Petrol/Fuel Pumps', // 'gas_station'
  'Filtration Plants'  // May not have a direct type; you might need to adjust
];

// Map frontend amenities to Google Places API types
const amenitiesTypeMap = {
  'Institute': 'school',
  'Medical': 'hospital|doctor',
  'Parks': 'park',
  'Gyms': 'gym',
  'Shopping': 'shopping_mall|store',
  'Mosques': 'mosque',
  'Banks/ATMs': 'bank|atm',
  'Restaurants': 'restaurant',
  'Petrol/Fuel Pumps': 'gas_station',
  'Filtration Plants': 'water_treatment', // Adjust as necessary
};

// Haversine formula to calculate the distance between two points
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

// Fetch nearby amenities using Google Places API
async function fetchNearbyAmenities(latitude, longitude, amenitiesArray) {
  const apiKey = 'AIzaSyBTePwfFKintTOHZnkuLxUzr49ZorPuG-E'; // Replace with your actual API key
  const radius = 1000; // Define the radius (in meters) for searching nearby amenities

  const promises = amenitiesArray.map(async (amenityName) => {
    const amenityType = amenitiesTypeMap[amenityName];
    if (!amenityType) {
      console.error(`Amenity type for ${amenityName} not found`);
      return { type: amenityName, results: [] };
    }

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${amenityType}&key=${apiKey}`;

    // Log the URL being requested
    console.log(`Fetching ${amenityName} with URL: ${url}`);

    try {
      const response = await axios.get(url);

      // Log the full response data
      console.log(`Response for ${amenityName}:`, response.data);

      // Check for errors in the response
      if (response.data.error_message) {
        console.error(`API Error for ${amenityName}:`, response.data.error_message);
      }

      if (response.data.status !== 'OK') {
        console.error(`API response status not OK for ${amenityName}:`, response.data.status);
        return { type: amenityName, results: [] };
      }

      return {
        type: amenityName,
        results: response.data.results.map((result) => ({
          name: result.name,
          vicinity: result.vicinity,
          location: result.geometry.location,
          distance: getDistance(
            latitude,
            longitude,
            result.geometry.location.lat,
            result.geometry.location.lng
          ),
        })),
      };
    } catch (error) {
      console.error(`Error fetching ${amenityName}:`, error.response?.data || error.message);
      return { type: amenityName, results: [] };
    }
  });

  // Return amenities results as a promise
  return Promise.all(promises);
}

// Get societies by city and query (search by name)
exports.getSocieties = async (req, res) => {
  const { city, query } = req.query;

  // Check if city and query are provided
  if (!city || !query) {
    return res.status(400).json({ error: 'City and society name are required' });
  }

  try {
    // Use 'startsWith' or 'contains' to optimize the search for faster results
    const societies = await prisma.society.findMany({
      where: {
        city: city,
        society: {
          startsWith: query, 
          mode: 'insensitive', 
        },
      },
      select: {
        id: true,
        society: true, // Return society name
        city: true,
        latitude: true,
        longitude: true,
      },
      take: 10, // Limit results to speed up response time
    });


    // If no societies found, return an empty array
    if (societies.length === 0) {
      return res.status(200).json([]);
    }

    // Fetch all amenities for each society
    const societiesWithAmenities = await Promise.all(
      societies.map(async (society) => {
        const amenitiesData = await fetchNearbyAmenities(
          society.latitude,
          society.longitude,
          amenitiesList
        );

        return { ...society, amenities: amenitiesData };
      })
    );

    res.json(societiesWithAmenities); // Send the societies with amenities as JSON
  } catch (error) {
    console.error('Error fetching societies:', error);
    res.status(500).json({ error: 'Error fetching societies' });
  }
};

// Get nearby societies by preferences (search by preferences)
exports.getSocietiesByPreferences = async (req, res) => {
  const { latitude, longitude, amenities, radius = 10, limit = 6 } = req.query;

  // Check if latitude, longitude, and amenities are provided
  if (!latitude || !longitude || !amenities) {
    return res
      .status(400)
      .json({ error: 'Latitude, longitude, and amenities are required' });
  }

  try {
    // Split the amenities string into an array
    const amenitiesArray = amenities.split(',');

    // Fetch all societies
    const societies = await prisma.society.findMany({
      where: {
        latitude: { not: 0 },
        longitude: { not: 0 },
      },
      select: {
        id: true,
        society: true,
        city: true,
        latitude: true,
        longitude: true,
      },
    });

    // Filter societies by distance using Haversine formula
    const nearbySocieties = societies
      .map((society) => {
        const distance = getDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          society.latitude,
          society.longitude
        );
        return { ...society, distance }; // Add distance to the society object
      })
      .filter((society) => society.distance <= radius); // Filter societies within the specified radius

    // Initialize an array to store societies that match the amenities criteria
    const matchingSocieties = [];

    // Loop through each society and check if it has all the requested amenities
    for (const society of nearbySocieties) {
      const amenitiesData = await fetchNearbyAmenities(
        society.latitude,
        society.longitude,
        amenitiesArray
      );

      // Check if the society has all the requested amenities
      const hasAllAmenities = amenitiesArray.every((amenityName) => {
        const amenityType = amenitiesTypeMap[amenityName];
        if (!amenityType) {
          console.error(`Amenity type for ${amenityName} not found`);
          return false;
        }
        return amenitiesData.some(
          (amenity) => amenity.type === amenityName && amenity.results.length > 0
        );
      });

      if (hasAllAmenities) {
        matchingSocieties.push({ ...society, amenities: amenitiesData });
      }

      // Stop if we've already reached the limit of societies
      if (matchingSocieties.length >= limit) {
        break;
      }
    }

    res.json(matchingSocieties); // Send the matching societies as JSON
  } catch (error) {
    console.error('Error fetching societies by preferences:', error);
    res
      .status(500)
      .json({ error: 'Error fetching societies by preferences' });
  }
};

// Fetch amenities for a specific society
exports.getSocietyAmenities = async (req, res) => {
  const { id } = req.params;

  try {
    const society = await prisma.society.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        society: true,
        city: true,
        latitude: true,
        longitude: true,
      },
    });

    if (!society) {
      return res.status(404).json({ error: 'Society not found' });
    }

    // Fetch all amenities for this society
    const amenitiesData = await fetchNearbyAmenities(
      society.latitude,
      society.longitude,
      amenitiesList
    );

    res.json({ ...society, amenities: amenitiesData });
  } catch (error) {
    console.error('Error fetching society amenities:', error);
    res.status(500).json({ error: 'Error fetching society amenities' });
  }
};
