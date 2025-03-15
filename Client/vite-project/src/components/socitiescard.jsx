import { Link, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'; // Import card components
import { Button } from '@/components/ui/button'; // Import button component
import { motion } from 'framer-motion'; // Import framer-motion for animations

const SocietyCards = () => {
  const location = useLocation(); // Get the state from the location
  const societies = location.state?.societies || []; // Ensure societies is an array

  // Define animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  if (!Array.isArray(societies) || societies.length === 0) {
    return (
      <p className="text-center text-gray-700">No societies found. Please perform a search.</p>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Society List</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {societies.map((society, index) => (
            <motion.div
              key={society.id || index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: index * 0.1 }} // Add staggered delay for each card
            >
              <Card className="bg-black text-white flex flex-col h-full shadow-lg">
                <CardHeader className="flex items-center justify-center p-4 border-b border-gray-700">
                  <h1 className="text-lg font-bold">{society.society}</h1>
                </CardHeader>

                <CardContent className="flex-grow p-4 flex flex-col justify-start">
                  {/* City */}
                  <p className="mb-2">
                    <strong>City:</strong> {society.city}
                  </p>

                  {/* Location with clickable link */}
                  <p className="mb-2">
                    <strong>Location:</strong>{' '}
                    <a
                      href={`https://www.google.com/maps?q=${society.latitude},${society.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      View on Map
                    </a>
                  </p>

                  {/* Amenities */}
                  {society.amenities && society.amenities.length > 0 ? (
                    <div className="mb-2">
                      <strong>Amenities:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {society.amenities.map((amenity, idx) => (
                          <li key={idx}>
                            {amenity.type} - {amenity.results.length} found
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="mb-2"><strong>No amenities found.</strong></p>
                  )}
                </CardContent>

                <CardFooter className="p-4 border-t border-gray-700 flex flex-col space-y-2">
                  {/* Future Trends Button */}
                  <Button variant="link" asChild className="text-center">
                    <Link
                      to={`/society-trends/${encodeURIComponent(society.id)}`}
                      className="text-gray-300 hover:text-gray-500"
                    >
                      View Future Trends
                    </Link>
                  </Button>

                  {/* Society Details Button */}
                  <Button variant="link" asChild className="text-center">
                    <Link
                      to={`/society-details/${encodeURIComponent(society.id)}`}
                      className="text-gray-300 hover:text-gray-500"
                    >
                      View Amenities Details
                    </Link>
                  </Button>

                  {/* Rate this Society Button */}
                  <Button variant="link" asChild className="text-center">
                    <Link
                      to={`/society-review/${encodeURIComponent(society.id)}`}
                      className="text-gray-300 hover:text-gray-500"
                    >
                      Rate this Society
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocietyCards;
