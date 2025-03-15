import { useState } from 'react';
import { Button } from "@/components/ui/button"; // Assuming ShadCN's Button is used
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";

const CostEstimatorInput = () => {
  const [areaType, setAreaType] = useState('sqft');
  const [area, setArea] = useState('');
  const [convertedArea, setConvertedArea] = useState('');
  const [numFloors, setNumFloors] = useState(1);
  const [qualitySelections, setQualitySelections] = useState({
    Cement: 'High',
    Bricks: 'High',
    Steel: 'High',
    Sand: 'High',
    Aggregate: 'High',
    Electrical: 'High'
  });
  const [finishingTouchQuality, setFinishingTouchQuality] = useState('High');
  const [loading, setLoading] = useState(false);  // Loading state for skeleton
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize navigation hook

  // Handle area input and conversion between sqft and marla
  const handleAreaChange = (e) => {
    const value = e.target.value;
    setArea(value);

    if (areaType === 'sqft') {
      setConvertedArea((value / 225).toFixed(2)); // Convert sqft to marla
    } else {
      setConvertedArea((value * 225).toFixed(2)); // Convert marla to sqft
    }
  };

  // Handle form submission using Axios
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from automatically submitting

    // Validation for area input
    if (!area || isNaN(area) || area <= 0) {
      setError('Please enter a valid area.');
      return;
    }

    // Clear any previous errors
    setError(null);

    // Start loading
    setLoading(true);

    const requestData = {
      area_sqft: areaType === 'sqft' ? area : convertedArea, // Always send sqft
      num_floors: numFloors,
      quality_selections: qualitySelections,
      finishing_touch_quality: finishingTouchQuality
    };

    try {
      // Make POST request using Axios
      const response = await axios.post('http://localhost:4000/api/estimate-cost', requestData);

      // Handle the response if needed
      console.log('Cost data received:', response.data);

      // Navigate to the results page with the cost data
      navigate('/cost-estimator-output', { state: { costData: response.data } });

    } catch (error) {
      console.error('Error fetching cost data:', error);
      setError('Error fetching cost data.');
    } finally {
      // Stop loading after request completes
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-md">
      <h1 className="text-2xl font-semibold text-center mb-6">Cost Estimator</h1>
      
      {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Display error message */}
      
      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-8 w-[250px]" />  {/* Skeleton for the heading */}
          <Skeleton className="h-12 w-full" />  {/* Skeleton for area input */}
          <Skeleton className="h-12 w-full" />  {/* Skeleton for number of floors */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />  {/* Skeleton for quality selection */}
            <Skeleton className="h-8 w-full" />  {/* Skeleton for finishing touch */}
          </div>
          <Skeleton className="h-12 w-full" />  {/* Skeleton for submit button */}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Area Input */}
          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Select Area Type</label>
            <div className="flex space-x-4">
              <Button 
                type="button" 
                onClick={() => setAreaType('sqft')} 
                variant={areaType === 'sqft' ? 'default' : 'outline'}
              >
                Sqft
              </Button>
              <Button 
                type="button" 
                onClick={() => setAreaType('marla')} 
                variant={areaType === 'marla' ? 'default' : 'outline'}
              >
                Marla
              </Button>
            </div>
            <input
              type="number"
              value={area}
              onChange={handleAreaChange}
              placeholder={`Enter area in ${areaType}`}
              className="p-2 border border-gray-300 rounded-md w-full mt-4"
              disabled={loading}  // Disable during loading
            />
            <p className="text-gray-500 mt-2">
              Equivalent {areaType === 'sqft' ? 'Marla' : 'Sqft'}: {convertedArea}
            </p>
          </div>

          {/* Number of Floors */}
          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Number of Floors</label>
            <div className="flex space-x-4">
              {[1, 2, 3].map((floor) => (
                <Button
                  type="button"
                  key={floor}
                  onClick={() => setNumFloors(floor)}
                  variant={numFloors === floor ? 'default' : 'outline'}
                  className={`rounded-full px-6 py-2 ${numFloors === floor ? 'bg-primary text-white' : 'bg-neutral-200'}`}
                  disabled={loading}  // Disable during loading
                >
                  {floor} Floor{floor > 1 && 's'}
                </Button>
              ))}
            </div>
          </div>

          {/* Material Quality Inputs */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {['Cement', 'Bricks', 'Steel', 'Sand', 'Aggregate', 'Electrical'].map((material) => (
              <div key={material} className="space-y-2">
                <label className="font-semibold">{material} Quality</label>
                <div className="flex space-x-2">
                  {['High', 'Medium', 'Low'].map((quality) => (
                    <label 
                      key={quality} 
                      className={`cursor-pointer flex items-center space-x-2 rounded-full px-4 py-2 border border-gray-300 ${qualitySelections[material] === quality ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'}`}
                    >
                      <input
                        type="radio"
                        name={`${material}_quality`}
                        value={quality}
                        checked={qualitySelections[material] === quality}
                        onChange={() => setQualitySelections(prev => ({ ...prev, [material]: quality }))}
                        className="hidden"
                        disabled={loading}  // Disable during loading
                      />
                      <span>{quality}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Finishing Touch Quality */}
          <div className="space-y-2">
            <label className="font-semibold">Finishing Touch Quality</label>
            <div className="flex space-x-4">
              {['High', 'Medium', 'Low'].map((quality) => (
                <label 
                  key={quality} 
                  className={`cursor-pointer flex items-center space-x-2 rounded-full px-4 py-2 border border-gray-300 ${finishingTouchQuality === quality ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'}`}
                >
                  <input
                    type="radio"
                    name="finishing_quality"
                    value={quality}
                    checked={finishingTouchQuality === quality}
                    onChange={() => setFinishingTouchQuality(quality)}
                    className="hidden"
                    disabled={loading}  // Disable during loading
                  />
                  <span>{quality}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" variant="default" className="w-full" disabled={loading}>
            {loading ? "Calculating..." : "Estimate Cost"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default CostEstimatorInput;
