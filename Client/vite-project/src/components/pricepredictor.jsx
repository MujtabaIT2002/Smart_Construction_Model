import { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Toaster, toast } from 'react-hot-toast';

// Helper function to format the price in PKR format (lakh/crore)
const formatPriceInPKR = (price) => {
  if (price >= 10000000) {
    return (price / 10000000).toFixed(2) + ' Crore';
  } else if (price >= 100000) {
    return (price / 100000).toFixed(2) + ' Lakh';
  }
  return price.toLocaleString(); // If it's less than 1 lakh
};

const PricePredictor = () => {
  const [prediction, setPrediction] = useState(null);
  const [plotData, setPlotData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Error state

  // Input state variables
  const [city, setCity] = useState('');
  const [society, setSociety] = useState('');
  const [marla, setMarla] = useState('');
  const [societySuggestions, setSocietySuggestions] = useState([]);

  const marlaOptions = [3, 5, 7, 10, 20];
  const cities = ['Islamabad', 'Rawalpindi', 'Lahore', 'Faisalabad', 'Karachi'];

  // Debounce the fetchSocietySuggestions function
  useEffect(() => {
    const fetchSocietySuggestions = async () => {
      if (city && society.length > 1) {
        try {
          const response = await axios.get(`http://localhost:4000/api/societies`, {
            params: { city, query: society },
          });
          setSocietySuggestions(response.data);
        } catch (error) {
          console.error('Error fetching society suggestions:', error);
        }
      } else {
        setSocietySuggestions([]);
      }
    };

    const debouncedFetch = debounce(fetchSocietySuggestions, 300);
    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [city, society]);

  const handlePredict = async () => {
    if (!city || !society || !marla) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null); // Clear any previous errors before making the request
    setPlotData([]); // Clear previous chart data

    try {
      const response = await axios.post('http://localhost:4000/api/predict-property-price', {
        city,
        society,
        marla: parseFloat(marla),
      });

      console.log('Prediction received:', response.data.prediction);
      console.log('Plot Data received:', response.data.plotData);

      setPrediction(response.data.prediction);
      setPlotData(response.data.plotData);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If no data is found, show an error and clear the chart
        toast.error('No data available for the specified filters.');
        setError('No data available for the specified filters.');
        setPrediction(null); // Clear the previous prediction
        setPlotData([]); // Clear the graph data
      } else {
        // Handle other potential errors
        toast.error('Something went wrong. Please try again.');
        setError('Something went wrong. Please try again.');
        setPrediction(null); // Clear the previous prediction
        setPlotData([]); // Clear the graph data
      }
    }

    setLoading(false);
  };

  // Correctly format plotData for the chart
  const chartData = plotData.map((item) => {
    const year = item.Date;
    return {
      year,
      price: item.Price,
    };
  });

  console.log('Formatted Chart Data:', chartData);

  // Define bar colors
  const barColors = {
    historical_price: '#8884d8',
    forecasted_price: '#ff7300',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="overflow-hidden bg-white p-4 shadow rounded-md">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Price Prediction</h2>
            <p className="text-gray-600">Enter your details to get a price prediction</p>
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Select City:</label>
            <Select onValueChange={(value) => setCity(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select City..." />
              </SelectTrigger>
              <SelectContent>
                {cities.map((cityName) => (
                  <SelectItem key={cityName} value={cityName}>
                    {cityName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4 relative">
            <label className="block text-lg font-semibold mb-2">Search Society:</label>
            <Input
              type="text"
              value={society}
              onChange={(e) => setSociety(e.target.value)}
              className="w-full p-3"
              placeholder="Enter society name..."
            />
            {societySuggestions.length > 0 && (
              <ul className="absolute bg-white text-black border border-gray-200 mt-2 w-full max-h-40 overflow-y-auto">
                {societySuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setSociety(suggestion.society);
                      setSocietySuggestions([]);
                    }}
                  >
                    {suggestion.society}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Select Marla:</label>
            <Select onValueChange={(value) => setMarla(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Marla..." />
              </SelectTrigger>
              <SelectContent>
                {marlaOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option} Marla
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-red-500 text-center mb-4">
              {error}
            </div>
          )}

          <Button onClick={handlePredict} className="mb-4">Get Prediction</Button>
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : (
            <>
              {prediction && (
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-semibold">
                    Predicted Price: {formatPriceInPKR(prediction)}
                  </h2>
                </div>
              )}
              {chartData.length > 0 && (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="year"
                      label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                      tickFormatter={(value) => `${value}`}
                    />
                    <YAxis
                      hide // Hide Y-axis values
                      label={{ value: 'Price (PKR)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="price" name="Price" fill={barColors.historical_price} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border border-gray-300 rounded shadow">
        <p className="font-semibold text-gray-700">{label}</p>
        {payload.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="mr-2 w-3 h-3" style={{               backgroundColor: item.color }}></span>
            <span className="text-gray-600">{item.name}:</span>
            <span className="ml-1 font-medium text-gray-800">
              {formatPriceInPKR(item.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
};

export default PricePredictor;

