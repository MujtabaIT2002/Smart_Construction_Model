import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  RadialBarChart,
  RadialBar,
  PolarGrid,
  PolarRadiusAxis,
  Label,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import axios from "axios";
import { LineChart, Line, XAxis, CartesianGrid, Tooltip } from "recharts";

// Define vibrant red, yellow, and green colors
const colors = ["#FF0000", "#FFFF00", "#00FF00"]; // Red, Yellow, Green

const SocietyReviewsChart = () => {
  const { societyId } = useParams(); // Get societyId from URL
  const navigate = useNavigate(); // Initialize navigate function for go back button
  const [chartDataRadial, setChartDataRadial] = useState([]);
  const [chartDataLine, setChartDataLine] = useState([]); // Line chart data for review counts
  const [totalReviewScore, setTotalReviewScore] = useState(0); // Total review score for radial chart
  const [loading, setLoading] = useState(true);

  // Fetch reviews data for the selected society
  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/society/${societyId}/reviews`
        );

        // Sum the rating field to get the total review score
        const totalScore = response.data.reduce(
          (sum, review) => sum + review.rating,
          0
        );

        // Group reviews by day for line chart
        const reviewsByDay = response.data.reduce((acc, review) => {
          const date = new Date(review.createdAt); // Assuming each review has a 'createdAt' field
          const dateString = date.toISOString().split("T")[0]; // 'YYYY-MM-DD'
          acc[dateString] = acc[dateString] ? acc[dateString] + 1 : 1; // Count number of reviews per day
          return acc;
        }, {});

        // Convert the reviewsByDay object into an array sorted by date
        const sortedDates = Object.keys(reviewsByDay).sort(
          (a, b) => new Date(a) - new Date(b)
        );
        const lineData = sortedDates.map((date) => ({
          date,
          reviews: reviewsByDay[date], // Total review count for that day
        }));

        // Set the radial chart data and line chart data
        setChartDataRadial([
          { society: "Total Score", reviews: totalScore, fill: colors[0] },
        ]);
        setChartDataLine(lineData); // Set the line chart data with total review counts
        setTotalReviewScore(totalScore);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews data", error);
        setLoading(false);
      }
    };

    fetchReviewsData();
  }, [societyId]);

  if (loading) {
    return <div className="text-center text-black">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Radial Chart for Total Review Score */}
        <Card className="text-black bg-white border border-neutral-300 shadow-lg">
          <CardHeader className="items-center pb-0">
            <CardTitle>Society Reviews (Score)</CardTitle>
            <CardDescription>
              Displaying total review score for this society
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <div className="flex justify-center">
              <RadialBarChart
                width={400}
                height={400}
                innerRadius={80}
                outerRadius={140}
                data={chartDataRadial}
                endAngle={360}
              >
                <PolarGrid />
                <RadialBar
                  minAngle={15}
                  label={{ position: "insideStart", fill: "#000" }}
                  background
                  clockWise
                  dataKey="reviews"
                  fill={colors[0]} // Fill color from color array (Red)
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-4xl font-bold"
                            >
                              {totalReviewScore.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total Review Score
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trends <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-neutral-700">
              Showing total review score based on all user reviews.
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate(-1)} // Go back to the previous page
                className="px-4 py-2 bg-neutral-200 text-black rounded-lg hover:bg-neutral-300 transition-colors"
              >
                Go Back
              </button>
            </div>
          </CardFooter>
        </Card>

        {/* Line Chart for Total Review Count Trends */}
        <Card className="text-black bg-white border border-neutral-300 shadow-lg">
          <CardHeader>
            <CardTitle>Total Review Count Trends</CardTitle>
            <CardDescription>
              Showing total number of reviews submitted over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <LineChart
                width={400}
                height={400}
                data={chartDataLine}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    // Format date as MM/DD
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                {/* Added Tooltip component */}
                <Tooltip
                  formatter={(value) => [`${value} reviews`, "Reviews"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  dataKey="reviews"
                  type="natural"
                  stroke={colors[2]} // Use color for line chart (Green)
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-neutral-700">
              Showing daily trends for the total number of reviews.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SocietyReviewsChart;
