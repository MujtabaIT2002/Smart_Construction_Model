import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios'; // To make API requests
import { debounce } from 'lodash'; // Import lodash debounce
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authcontext'; // Import Auth context for user authentication
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component

const amenitiesList = [
  "Institute", "Medical", "Parks", "Gyms", "Shopping",
  "Mosques", "Banks/ATMs", "Restaurants", "Petrol/Fuel Pumps", "Filtration Plants"
];

const cities = ["Islamabad", "Lahore", "Rawalpindi", "Faisalabad", "Karachi"];

// Debounced function to fetch society suggestions
const debouncedFetchSocietySuggestions = debounce(async (city, term, setSocietySuggestions) => {
  if (term.trim() !== '' && city !== '') {
    try {
      const response = await axios.get('http://localhost:4000/api/societies', {
        params: {
          city,
          query: term,
        },
      });
      const societies = Array.isArray(response.data) ? response.data : [];
      setSocietySuggestions(societies); // Set suggestions based on response
    } catch (error) {
      console.error('Error fetching society suggestions:', error);
      setSocietySuggestions([]); // Set to empty array if there's an error
    }
  } else {
    setSocietySuggestions([]); // Clear suggestions when no search
  }
}, 300); // 300ms delay

const SocietyFinder = () => {
  const { isAuthenticated } = useAuth(); // Check authentication status
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSociety, setSelectedSociety] = useState(null); // Track selected society
  const [selectedAmenities, setSelectedAmenities] = useState([]); // Track selected amenities
  const [societySuggestions, setSocietySuggestions] = useState([]); // Initialize with empty array
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate(); // For navigation to other pages

  useEffect(() => {
    if (isAuthenticated) {
      debouncedFetchSocietySuggestions(selectedCity, searchTerm, setSocietySuggestions);
    }
  }, [searchTerm, selectedCity, isAuthenticated]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCitySelection = (e) => {
    setSelectedCity(e.target.value);
    setSearchTerm(''); // Clear society name when city changes
    setSocietySuggestions([]); // Reset suggestions when city changes
  };

  const handleSocietySelection = (society) => {
    setSelectedSociety(society); // Save the selected society
    setSearchTerm(society.society); // Set the search term to the selected society
    setSocietySuggestions([]); // Clear suggestions
  };

  const handleAmenitySelection = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(item => item !== amenity) // Remove amenity if already selected
        : [...prev, amenity] // Add amenity if not selected
    );
  };

  const handleSelectAll = () => {
    setSelectedAmenities(amenitiesList);
  };

  const handleClearAll = () => {
    setSelectedAmenities([]);
  };

  const handleSearchByName = async () => {
    if (selectedSociety && isAuthenticated) {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`http://localhost:4000/api/societies/${selectedSociety.id}/amenities`);
        await axios.post('http://localhost:4000/api/user-search/record-search', {
          societyId: selectedSociety.id,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        navigate('/societies', { state: { societies: [response.data] } });
      } catch (error) {
        console.error('Error fetching society details or recording search:', error.response?.data || error.message);
      } finally {
        setLoading(false); // End loading
      }
    } else {
      alert('Please select a society and ensure you are logged in.');
    }
  };

  const handleSearchByPreferences = async () => {
    if (navigator.geolocation && isAuthenticated) {
      setLoading(true); // Start loading
      navigator.geolocation.getCurrentPosition(async position => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get('http://localhost:4000/api/societies/preferences', {
            params: {
              latitude,
              longitude,
              amenities: selectedAmenities.join(','),
            },
          });

          for (const society of response.data) {
            await axios.post('http://localhost:4000/api/user-search/record-search', {
              societyId: society.id,
            }, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
          }
          navigate('/societies', { state: { societies: response.data } });
        } catch (error) {
          console.error('Error searching societies by preferences:', error.response?.data || error.message);
        } finally {
          setLoading(false); // End loading
        }
      }, error => {
        console.error('Geolocation error:', error.message);
        setLoading(false); // End loading in case of error
      });
    } else {
      alert('Geolocation is not supported by this browser or user is not authenticated.');
    }
  };

  const searchByNameEnabled = searchTerm.trim() !== '' && selectedCity !== '';

  return (
    <div className="min-h-screen bg-white text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        {/* City Dropdown */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Select City:</label>
          <select
            className="w-full p-3 text-black"
            value={selectedCity}
            onChange={handleCitySelection}
          >
            <option value="" disabled>Select a city...</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <label htmlFor="search" className="block text-lg font-semibold mb-2">
            Search Society by Name:
          </label>
          <Input
            id="search"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-3 text-black"
            placeholder="Enter society name..."
            disabled={!selectedCity}
          />
          <FaSearch className="absolute right-4 top-12 text-gray-500" />
          {societySuggestions.length > 0 && (
            <ul className="absolute bg-white text-black border border-gray-200 mt-2 w-full max-h-40 overflow-y-auto">
              {societySuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSocietySelection(suggestion)}
                >
                  {suggestion.society}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Amenities Filter (Preferences) */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Filter by Amenities:</label>
          <div className="flex flex-wrap gap-2">
            {amenitiesList.map((amenity, index) => (
              <Button
                key={index}
                onClick={() => handleAmenitySelection(amenity)}
                variant={selectedAmenities.includes(amenity) ? 'default' : 'outline'}
                className={`${selectedAmenities.includes(amenity) ? 'bg-green-500' : 'bg-gray-500'} text-white px-4 py-2`}
                disabled={searchByNameEnabled || loading} // Disable during loading
              >
                {amenity}
              </Button>
            ))}
          </div>
          <div className="flex mt-4 space-x-4">
            <Button
              onClick={handleSelectAll}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
              disabled={searchByNameEnabled || loading} // Disable during loading
            >
              Select All
            </Button>
            <Button
              onClick={handleClearAll}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2"
              disabled={searchByNameEnabled || loading} // Disable during loading
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Search Buttons */}
        <div className="mt-6 flex justify-end">
          {loading ? (
            <Skeleton className="h-12 w-full" />
          ) : searchByNameEnabled ? (
            <Button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2"
              onClick={handleSearchByName}
              disabled={loading}
            >
              Search by Name
            </Button>
          ) : (
            <Button
              onClick={handleSearchByPreferences}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2"
              disabled={selectedAmenities.length === 0 || loading} // Disable if no preferences selected
            >
              Search by Preferences
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocietyFinder;
