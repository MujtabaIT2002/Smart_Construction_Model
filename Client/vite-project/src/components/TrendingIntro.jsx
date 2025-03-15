import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer'; // For detecting in-view status
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import trending from '@/assets/—Pngtree—red downward trend graph transparent_16317491.jpg';

const TrendingSocietiesIntro = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Set up the observer to track when the component is in view
  const { ref, inView } = useInView({
    threshold: 0.3, // Trigger when 30% of the component is in view
    triggerOnce: false, // Trigger animations each time it comes in/out of view
  });

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      {/* Image with Parallax Effect */}
      <motion.div
        className="flex-1 flex justify-center"
        initial={{ opacity: 0, x: -200 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -200 }} // Pop-in and out animations
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <img
          src={trending} // Replace with your image URL
          alt="Trending Societies"
          className="rounded-lg shadow-lg max-w-md"
        />
      </motion.div>

      {/* Content with Pop-in Animation */}
      <motion.div
        className="flex-1 flex flex-col justify-center items-start space-y-6 text-left pl-8"
        initial={{ opacity: 0, x: 200 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 200 }} // Pop-in and out animations
        transition={{ duration: 0.8, type: 'spring', delay: 0.2 }}
      >
        <h1 className="text-4xl font-bold text-gray-800">Discover the Top Trending Societies</h1>
        <p className="text-lg text-gray-600">
          Find out which societies are trending in your city based on user reviews and ratings. Get the latest information and make informed decisions.
        </p>
        <motion.button
          className="inline-block border border-neutral-800 text-neutral-800 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-neutral-200 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/top-trending-societies')} // Navigate to Trending Societies By City page
        >
          View Top Trending Societies
        </motion.button>
      </motion.div>
    </div>
  );
};

export default TrendingSocietiesIntro;
