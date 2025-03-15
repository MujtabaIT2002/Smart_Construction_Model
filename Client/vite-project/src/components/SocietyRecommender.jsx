import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Helper function to format price in PKR (Crore, Lakh)
const formatPriceInPKR = (price) => {
  if (price >= 10000000) {
    return (price / 10000000).toFixed(2) + ' Crore';
  } else if (price >= 100000) {
    return (price / 100000).toFixed(2) + ' Lakh';
  }
  return price.toLocaleString(); // If less than 1 lakh
};

const cities = ["Islamabad", "Lahore", "Rawalpindi", "Karachi", "Faisalabad"];

const SocietyRecommender = () => {
  const [city, setCity] = useState('');
  const [priceBin, setPriceBin] = useState('');
  const [marla, setMarla] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!city || !priceBin || !marla) {
      toast.error('All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/recommend', {
        city,
        price_bin: priceBin,
        marla,
      });

      // Handle recommendations from the backend
      setRecommendations(response.data.recommendations);
      toast.success('Society recommendations retrieved successfully!');
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error('No societies found for the given filters');
      } else {
        toast.error('Error fetching recommendations');
      }
    }
  };

  // Open Google Maps with the selected location
  const handleShowOnMap = (latitude, longitude) => {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Society Recommender</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* City input */}
        <div>
          <label className="block mb-2 text-lg font-semibold text-gray-700">City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">Select city</option>
            {cities.map((cityName) => (
              <option key={cityName} value={cityName}>
                {cityName}
              </option>
            ))}
          </select>
        </div>

        {/* Price Bin input */}
        <div>
          <label className="block mb-2 text-lg font-semibold text-gray-700">Price Bin</label>
          <select
            value={priceBin}
            onChange={(e) => setPriceBin(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">Select price bin</option>
            <option value="very low">Very Low</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="very high">Very High</option>
          </select>
        </div>

        {/* Marla input */}
        <div>
          <label className="block mb-2 text-lg font-semibold text-gray-700">Marla</label>
          <input
            type="number"
            value={marla}
            onChange={(e) => setMarla(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Enter marla"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded mt-4 transition duration-300 ease-in-out hover:bg-gray-800"
        >
          Get Recommendations
        </button>
      </form>

      {/* Display recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <p><strong className="text-gray-700">City:</strong> {rec.city}</p>
                <p><strong className="text-gray-700">Location:</strong> {rec.location}</p>
                <p><strong className="text-gray-700">Price:</strong> {formatPriceInPKR(rec.price_2023)}</p>
                <p><strong className="text-gray-700">Marla:</strong> {rec.area_marla}</p>
                <p><strong className="text-gray-700">Price Bin:</strong> {rec.price_bin}</p>
                <p><strong className="text-gray-700">Cluster:</strong> {rec.cluster}</p>
                <p><strong className="text-gray-700">Latitude:</strong> {rec.latitude}</p>
                <p><strong className="text-gray-700">Longitude:</strong> {rec.longitude}</p>

                {/* Show on Map button */}
                <button
                  className="mt-2 text-blue-600 hover:underline"
                  onClick={() => handleShowOnMap(rec.latitude, rec.longitude)}
                >
                  Show on Map
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocietyRecommender;
