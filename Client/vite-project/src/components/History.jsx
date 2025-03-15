import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './authcontext'; // Import Auth context for user authentication
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { toast } from 'react-hot-toast'; // Import react-hot-toast

const History = () => {
  const { isAuthenticated, user } = useAuth(); // Use user to get the name
  const [searches, setSearches] = useState([]); // Update this to searches
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For navigation to society details page

  useEffect(() => {
    // Fetch user search history if the user is authenticated
    const fetchSearchHistory = async () => {
      try {
        console.log('Fetching search history for user:', user); // Debugging line

        // Assuming your API endpoint is /api/user-search/search-history
        const response = await axios.get('http://localhost:4000/api/user-search/search-history', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in request header
          },
        });

        console.log('API Response:', response.data); // Debugging line

        // Process the searches data
        const searchesData = response.data.searches;

        // Sort searches by createdAt descending (latest first)
        const sortedSearches = searchesData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Remove duplicates based on societyId
        const uniqueSearchesMap = new Map();
        sortedSearches.forEach((search) => {
          if (!uniqueSearchesMap.has(search.societyId)) {
            uniqueSearchesMap.set(search.societyId, search);
          }
        });

        // Get the unique searches as an array
        const uniqueSearches = Array.from(uniqueSearchesMap.values());

        // Limit to the latest 6 unique searches
        const latestSearches = uniqueSearches.slice(0, 6);

        setSearches(latestSearches);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching search history:', error); // More descriptive error logging
        setError('Failed to fetch search history.');
        setLoading(false);
      }
    };

    // Only fetch if the user is authenticated
    if (isAuthenticated) {
      fetchSearchHistory();
    } else {
      setLoading(false);
      setError('You must be logged in to view your search history.');
    }
  }, [isAuthenticated, user]); // Added `user` to dependency array to ensure it's updated

  // Handle click on a society to fetch details and navigate to the society page
  const handleSocietyClick = async (societyId) => {
    if (!isAuthenticated) return;

    // Check if societyId is valid
    if (!societyId) {
      console.error('No societyId provided:', societyId); // Log if societyId is missing or undefined
      return; // Don't make the API call if the societyId is missing
    }

    // Display loading toast
    const toastId = toast.loading('Searching for society details...');

    try {
      // Fetch society details including amenities by its ID
      const response = await axios.get(
        `http://localhost:4000/api/societies/${societyId}/amenities`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in request header
          },
        }
      );

      // Remove loading toast and show success
      toast.dismiss(toastId);
      toast.success('Society search completed!');

      // Log response to verify data
      console.log('Society details with amenities:', response.data);

      // Navigate to the societies page with the society details (including amenities)
      navigate('/societies', { state: { societies: [response.data] } });
    } catch (error) {
      toast.dismiss(toastId); // Dismiss the loading toast
      toast.error('Failed to fetch society details'); // Show error toast
      console.error('Error fetching society details:', error);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-700">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center my-6 text-gray-800 animate-fade-in">
        {user && user.name ? `Search History for ${user.name}` : 'Your Search History'}
      </h1>
      {Array.isArray(searches) && searches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searches.map((search, index) => {
            console.log('Search object:', search); // Log the search object to verify if societyId exists
            return (
              <div
                key={index}
                className="society-card cursor-pointer bg-white shadow-lg rounded-lg p-6 transform transition-all hover:scale-105 hover:shadow-2xl hover:bg-gray-100 duration-300 ease-in-out"
                onClick={() => handleSocietyClick(search.societyId)} // Call handler on click
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{search.societyName}</h2>
                <p className="text-gray-600 mb-1">{search.cityName}</p>
                <p className="text-gray-500">Searched by: {search.userName}</p>
                <p className="text-gray-500">
                  {new Date(search.createdAt).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-700">
          No societies found. Please perform a search.
        </p>
      )}
    </div>
  );
};

export default History;
