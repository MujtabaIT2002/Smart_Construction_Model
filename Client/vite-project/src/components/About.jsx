import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import IllustrationImage from "@/assets/8104.jpg"; // Update with your actual image path
import SecondIllustrationImage from "@/assets/8693569.jpg"; // Update with the path of your second image
import PropTypes from 'prop-types'; // Import PropTypes

const About = () => {
  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  // Variants for pop-in
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  // Helper component for the animated card
  const AnimatedCard = ({ title, content, className }) => {
    const { ref, inView } = useInView({
      threshold: 0.2,
      triggerOnce: false,
    });

    return (
      <motion.div
        ref={ref}
        className={`bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center ${className}`}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={cardVariants}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">{title}</h2>
        <p className="text-neutral-700 text-center">{content}</p>
      </motion.div>
    );
  };

  // Add PropTypes validation for AnimatedCard
  AnimatedCard.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    className: PropTypes.string,
  };

  // Helper component for illustration card
  const IllustrationCard = ({ image, className }) => {
    const { ref, inView } = useInView({
      threshold: 0.2,
      triggerOnce: false,
    });

    return (
      <motion.div
        ref={ref}
        className={`bg-white p-6 rounded-lg shadow-md flex items-center justify-center ${className}`}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={cardVariants}
      >
        <img src={image} alt="Illustration" className="object-cover w-full h-full rounded-md" />
      </motion.div>
    );
  };

  // Add PropTypes validation for IllustrationCard
  IllustrationCard.propTypes = {
    image: PropTypes.string.isRequired,
    className: PropTypes.string,
  };

  return (
    <section className="bg-neutral-100 text-neutral-800 p-8 min-h-screen flex items-center justify-center">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Updated Content with Different Sizes */}
          <AnimatedCard
            title="Who We Are"
            content="We provide a comprehensive platform that helps users find and manage residential societies. Whether you're looking for new societies or managing existing ones, our tools simplify the process."
            className="md:col-span-2 md:row-span-2"
          />
          <AnimatedCard
            title="Search for Societies"
            content="Discover new societies that match your preferences. Our platform helps you search for societies based on location, amenities, pricing, and more, ensuring you find the perfect match."
            className="md:col-span-1 md:row-span-2 h-full"
          />
          <AnimatedCard
            title="House Price Prediction"
            content="Get accurate house price predictions using our AI-powered models. We help you understand the housing market and make informed decisions by predicting house prices based on various factors."
            className="md:col-span-1 md:row-span-2"
          />

          {/* Images only shown on desktop (md and up) */}
          <IllustrationCard image={IllustrationImage} className="hidden md:block md:col-span-1 md:row-span-1" />
          <IllustrationCard image={SecondIllustrationImage} className="hidden md:block md:col-span-1 md:row-span-1" />

          <AnimatedCard
            title="Cost Estimation"
            content="Plan your construction projects with ease. Our cost estimation tool provides accurate estimates for grayscale structures, including material and labor costs, to help you budget effectively."
            className="md:col-span-2 md:row-span-1"
          />
          <AnimatedCard
            title="Future Trends"
            content="Stay ahead of the market with our AI-driven trend forecasting. We analyze future residential trends to help you make strategic decisions when choosing or managing societies."
            className="md:col-span-1 md:row-span-1"
          />
          <AnimatedCard
            title="Society Management"
            content="Manage your residential societies effortlessly. Our platform provides tools to organize society records, track maintenance, and improve communication, making management seamless."
            className="md:col-span-2 md:row-span-1"
          />
          <AnimatedCard
            title="Convenience & Insights"
            content="Our goal is to make your search for societies and management more convenient. With our AI-powered insights and easy-to-use tools, we help you find the perfect society and manage it efficiently."
            className="md:col-span-1 md:row-span-1"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default About;
