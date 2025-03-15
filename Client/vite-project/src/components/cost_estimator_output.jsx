"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { Pie, PieChart, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Function to format values in crore/lakh/thousand format
const formatCurrency = (value) => {
  const crore = value / 10000000;
  const lakh = (value % 10000000) / 100000;
  const thousand = (value % 100000) / 1000;

  if (crore >= 1) return `${crore.toFixed(2)} crore PKR`;
  if (lakh >= 1) return `${lakh.toFixed(2)} lakh PKR`;
  if (thousand >= 1) return `${thousand.toFixed(2)} thousand PKR`;
  return `${value.toFixed(2)} PKR`;
};

const CostEstimatorOutput = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate hook
  const costData = location.state?.costData; // Access the passed data

  if (!costData) {
    return <div>No cost data available.</div>;
  }

  // Pie chart data excluding Electrical Components
  const chartData = [
    { label: "Standard Materials", value: costData["Standard Materials"], fill: "#8884d8" },
    { label: "Quality Materials", value: costData["Quality Materials"], fill: "#82ca9d" },
    { label: "Labor Cost", value: costData["Labor Cost"], fill: "#0088fe" },
    { label: "Finishing Touch", value: costData["Finishing Touch"], fill: "#e91e63" },
  ].filter((data) => data.value > 0);  // Filter out any zero or negative values

  // Calculate total cost
  const totalCost = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="max-w-7xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg space-y-4">
      <h1 className="text-3xl font-bold text-center mb-4">Cost Estimation Results</h1>

      {/* Flex Layout for Total Cost and Pie Chart */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
        
        {/* Overall Cost Section */}
        <div className="w-[350px] h-[350px] bg-white p-6 rounded-lg shadow-md flex-1 text-center flex flex-col justify-center items-center space-y-2">
          <h2 className="text-2xl font-semibold text-green-600">Overall Total Cost</h2>
          <p className="text-xl font-bold text-gray-700">
            {formatCurrency(totalCost)}
          </p>
        </div>

        {/* ShadCN Pie Chart Section */}
        <Card className="flex-1 h-[350px]">
          <CardHeader className="items-center pb-0">
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={60} 
                  outerRadius={100} 
                  paddingAngle={5}
                  stroke="#ffffff"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${formatCurrency(value)}`, name]} 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                />
                <Legend 
                  layout="horizontal" 
                  align="center" 
                  verticalAlign="bottom" 
                  iconType="circle" 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="text-center">
            <div className="text-sm text-muted-foreground">
              Showing the distribution of costs.
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Three Records in One Row: Total Area, Covered Area, Labor Cost */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Area */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Total Area</h3>
          <p className="text-lg">{costData["total_area"].toFixed(2)} sqft</p>
        </div>

        {/* Covered Area */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Covered Area</h3>
          <p className="text-lg">{costData["covered_area"].toFixed(2)} sqft</p>
        </div>

        {/* Labor Cost */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Labor Cost</h3>
          <p className="text-lg">{formatCurrency(costData["Labor Cost"])}</p>
        </div>
      </div>

      {/* Grid Layout for Detailed Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* Development Cost per sqft */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Development Cost per Sqft</h3>
          <p>{formatCurrency(costData["development_cost_per_sqft"])}</p>
        </div>

        {/* Standard Materials */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Standard Materials</h3>
          <p>{formatCurrency(costData["Standard Materials"])}</p>
        </div>

        {/* Quality Materials */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Quality Materials</h3>
          <p>{formatCurrency(costData["Quality Materials"])}</p>
        </div>

        {/* Electrical Components */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Electrical Components</h3>
          <p>{formatCurrency(costData["Electrical Components"])}</p>
        </div>

        {/* Finishing Touch */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Finishing Touch</h3>
          <p>{formatCurrency(costData["Finishing Touch"])}</p>
        </div>

        {/* Navigate to Inputs Card */}
        <div
          onClick={() => navigate("/cost-estimator")} // Navigate to inputs page
          className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow-md text-center flex flex-col justify-center items-center cursor-pointer transition duration-200 ease-in-out"
        >
          <h3 className="text-lg font-semibold">Go to Inputs</h3>
          <p className="text-sm">Click here to modify inputs</p>
        </div>
      </div>

      {/* Destructive Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/")}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default CostEstimatorOutput;
