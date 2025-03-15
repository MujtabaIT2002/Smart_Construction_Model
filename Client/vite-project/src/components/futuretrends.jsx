import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types'; // Import PropTypes for validation
import { TrendingUp } from "lucide-react";
import { LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom'; // Import useParams for dynamic societyId

const SocietyTrends = () => {
  const { societyId } = useParams(); // Extract societyId from route params

  // Log to check if societyId is received correctly
  console.log('societyId from useParams:', societyId);

  const [trendsData, setTrendsData] = useState(null);
  const [selectedSociety, setSelectedSociety] = useState(societyId || null); // Ensure selectedSociety is not undefined
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    if (!selectedSociety) {
      console.warn('No selectedSociety provided, cannot fetch trends.');
      return;
    }

    console.log('Fetching trends for society:', selectedSociety); // Log the selected societyId

    // Fetch trends for the selected society
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/society-trends/trends/${selectedSociety}`);
        
        // Log the API response to ensure data is being fetched
        console.log('API response for trends:', response.data);

        setTrendsData(response.data);
      } catch (error) {
        console.error('Error fetching society trends:', error);
        setError('Failed to load society trends.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [selectedSociety]);

  // Handle society change
  const handleSocietyChange = (newSocietyId) => {
    console.log('Society changed to:', newSocietyId); // Log when society changes
    setSelectedSociety(newSocietyId);
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-8">Loading trends...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-8">{error}</p>;
  }

  if (!trendsData) {
    console.log('No trends data found.'); // Log when data is still loading
    return <p className="text-center text-gray-500 mt-8">No trends data available.</p>;
  }

  console.log('Trends data:', trendsData); // Log the fetched trends data before rendering

  // Prepare data for the graph (aggregate search counts by date)
  const chartData = trendsData.searches.reduce((acc, search) => {
    const date = new Date(search.createdAt).toLocaleDateString();
    const existingEntry = acc.find((item) => item.date === date);
    if (existingEntry) {
      existingEntry.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, []);

  // Define chart configuration
  const chartConfig = {
    count: {
      label: 'Search Count',
      color: 'hsl(var(--chart-2))',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Card Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Trends for {trendsData.societyName}</CardTitle>
              <CardDescription>Search Frequency Over Time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke={chartConfig.count.color}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
                Trending up by {trendsData.trend}% this month <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="leading-none text-muted-foreground">
                Total Searches: {trendsData.searchCount}
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Similar Societies */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Similar Societies</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trendsData.similarSocieties.map((society) => (
              <motion.button
                key={society.id}
                onClick={() => handleSocietyChange(society.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full text-left p-4 border rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <h4 className="text-lg font-medium">{society.society}</h4>
                <p className="text-gray-600">{society.city}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add PropTypes for validation
SocietyTrends.propTypes = {
  societyId: PropTypes.string, // Validate that `societyId` is a string
};

export default SocietyTrends;
