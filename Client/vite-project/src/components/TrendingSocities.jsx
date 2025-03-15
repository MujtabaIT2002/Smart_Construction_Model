import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const cities = ["Islamabad", "Lahore", "Rawalpindi", "Karachi", "Faisalabad"];

const TrendingSocietiesByCity = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchTrendingSocieties = async (city) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`http://localhost:4000/api/top-trending-societies?city=${city}`);
      setSocieties(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching societies:", error);
      setError("Failed to fetch societies. Please try again.");
      setLoading(false);
    }
  };

  const handleCitySelection = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    fetchTrendingSocieties(city);
  };

  return (
    <div className="min-h-screen p-8 bg-neutral-100 text-neutral-900">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">Find Top Trending Societies</h1>

        {/* City Dropdown */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Select a City:</label>
          <select
            className="w-full p-3 bg-neutral-900 text-white border border-neutral-700 rounded-md focus:outline-none focus:border-neutral-500"
            value={selectedCity}
            onChange={handleCitySelection}
          >
            <option value="">Select a city...</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="text-center text-lg">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && societies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {societies.map((society, index) => (
              <motion.div
                key={society.id}
                className="bg-white border border-neutral-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h2 className="text-2xl font-semibold mb-4 text-neutral-900">{society.society}</h2>
                <p className="text-neutral-700 mb-4">
                  <strong>City:</strong> {society.city}
                </p>
                <p className="text-neutral-700 mb-4">
                  <strong>Reviews Count:</strong> {society._count.reviews}
                </p>
                <button
                  className="inline-block bg-neutral-900 text-white px-4 py-2 rounded-md font-semibold hover:bg-neutral-700 transition-colors"
                  onClick={() => navigate(`/society-reviews/${society.id}`)} // Navigate to the review chart
                >
                  View Reviews
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !error && societies.length === 0 && selectedCity && (
          <p className="text-center text-lg">No societies found for {selectedCity}.</p>
        )}
      </div>
    </div>
  );
};

export default TrendingSocietiesByCity;
