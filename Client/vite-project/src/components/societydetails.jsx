import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Radar, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

// Register chart components
ChartJS.register(
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const SocietyDetails = () => {
  const { societyId } = useParams();
  const [society, setSociety] = useState(null);
  const [amenitiesData, setAmenitiesData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [map, setMap] = useState(null); // Store Google Map instance
  const radarRef = useRef(null);
  const barRef = useRef(null);

  // State to track the selected amenity types (allow multiple selections)
  const [selectedAmenityTypes, setSelectedAmenityTypes] = useState(new Set());

  // Load the Google Maps script
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBTePwfFKintTOHZnkuLxUzr49ZorPuG-E', // Replace with your API key
  });

  useEffect(() => {
    const fetchSocietyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/societies/${societyId}/amenities`);
        setSociety(response.data);
        setAmenitiesData(response.data.amenities);
        setMapCenter({ lat: response.data.latitude, lng: response.data.longitude });
      } catch (error) {
        console.error('Error fetching society details:', error);
      }
    };

    fetchSocietyDetails();

    // Clean up chart instances on component unmount
    return () => {
      if (radarRef.current) {
        radarRef.current.destroy();
      }
      if (barRef.current) {
        barRef.current.destroy();
      }
    };
  }, [societyId]);

  // Add or remove markers based on selected amenities
  useEffect(() => {
    if (map) {
      // Clear existing markers
      map.markers.forEach((marker) => marker.setMap(null));
      map.markers = [];

      // Add Society Marker
      const societyMarker = new window.google.maps.Marker({
        map,
        position: mapCenter,
        title: 'Society',
      });
      map.markers.push(societyMarker);

      // Add Amenity Markers based on the selected types
      amenitiesData.forEach((amenity) => {
        if (selectedAmenityTypes.size === 0 || selectedAmenityTypes.has(amenity.type)) {
          amenity.results.forEach((result) => {
            const marker = new window.google.maps.Marker({
              map,
              position: result.location,
              title: amenity.type,
            });
            map.markers.push(marker);
          });
        }
      });
    }
  }, [selectedAmenityTypes, map]); // Depend on selectedAmenityTypes and map to rerun this effect

  if (!society) {
    return <p className="text-center text-gray-500 mt-8">Loading...</p>;
  }

  // Prepare data for the Radar Chart
  const radarData = {
    labels: amenitiesData.map((amenity) => amenity.type),
    datasets: [
      {
        label: 'Number of Amenities',
        data: amenitiesData.map((amenity) => amenity.results.length),
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderColor: 'rgba(255, 0, 0, 1)', // Vibrant Red
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 0, 0, 1)', // Vibrant Red
      },
    ],
  };

  // Prepare data for the Bar Chart (distance to the closest amenity of each type)
  const barData = {
    labels: amenitiesData.map((amenity) => amenity.type),
    datasets: [
      {
        label: 'Distance (km)',
        data: amenitiesData.map((amenity) =>
          Math.min(...amenity.results.map((res) => res.distance))
        ),
        backgroundColor: 'rgba(0, 255, 0, 0.5)', // Vibrant Green
        borderColor: 'rgba(0, 255, 0, 1)', // Vibrant Green
        borderWidth: 1,
      },
    ],
  };

  // Function to handle the selection of an amenity type (multiple selection)
  const handleAmenitySelection = (type) => {
    setSelectedAmenityTypes((prevTypes) => {
      const newTypes = new Set(prevTypes);
      if (newTypes.has(type)) {
        newTypes.delete(type);
      } else {
        newTypes.add(type);
      }
      return newTypes;
    });
  };

  // Helper function to check if the amenity type is selected
  const isAmenitySelected = (type) => selectedAmenityTypes.has(type);

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Society Title and City */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black">{society.society}</h1>
          <p className="text-lg text-gray-700">City: {society.city}</p>
        </div>

        {/* Radar Chart */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-black mb-4">Amenities Overview</h2>
          <div className="flex justify-center">
            <Radar
              ref={radarRef}
              data={radarData}
              options={{
                scales: {
                  r: {
                    angleLines: { color: 'gray' },
                    grid: { color: 'gray' },
                    pointLabels: { color: 'black' },
                    ticks: { color: 'black', backdropColor: 'transparent' },
                  },
                },
                plugins: {
                  legend: { labels: { color: 'black' } },
                },
              }}
              className="max-w-full"
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-black mb-4">Distance to Closest Amenities</h2>
          <div className="flex justify-center">
            <Bar
              ref={barRef}
              data={barData}
              options={{
                scales: {
                  x: {
                    ticks: { color: 'black' },
                    grid: { color: 'gray' },
                  },
                  y: {
                    ticks: { color: 'black' },
                    grid: { color: 'gray' },
                  },
                },
                plugins: {
                  legend: { labels: { color: 'black' } },
                },
              }}
              className="max-w-full"
            />
          </div>
        </div>

        {/* Amenity Filter */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-black mb-2">Filter Amenities</h2>
          <div className="flex space-x-2 overflow-auto">
            <button
              className={`px-4 py-2 rounded ${
                selectedAmenityTypes.size === 0 ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-black'
              }`}
              onClick={() => setSelectedAmenityTypes(new Set())}
            >
              All
            </button>
            {amenitiesData.map((amenity, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded ${
                  isAmenitySelected(amenity.type) ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-black'
                }`}
                onClick={() => handleAmenitySelection(amenity.type)}
              >
                {amenity.type}
              </button>
            ))}
          </div>
        </div>

        {/* Google Map */}
        {isLoaded && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-black mb-4">Amenities Map</h2>
            <div className="h-96">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={14}
                onLoad={(mapInstance) => {
                  setMap(mapInstance); // Save map instance to state
                  mapInstance.markers = []; // Initialize an empty array to store markers
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocietyDetails;
