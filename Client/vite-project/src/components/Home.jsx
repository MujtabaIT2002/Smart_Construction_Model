import { Parallax } from 'react-scroll-parallax';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-scroll';
import estateImage from '@/assets/bwink_bld_03_single_10.jpg';
import About from './About';
import TrendingSocietiesIntro from './TrendingIntro';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Main Hero Section */}
      <section className="bg-neutral-100 text-neutral-800 p-8 min-h-screen flex flex-col items-center justify-center">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Section */}
          <Parallax translateX={[30, -50]} opacity={[2, 0]} className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900">
              Streamline Your Residential Society Management
            </h1>
            <p className="text-lg text-neutral-700">
              Our web application provides comprehensive tools for managing your
              residential society, including cost estimation for construction
              objects and forecasting of future trends.
            </p>
            <div className="flex space-x-4">
              <button 
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90"
                onClick={() => navigate('/signup')}
              >
                Get Started
              </button>

              {/* Smooth Scroll to About Section */}
              <Link 
                to="about-section"
                smooth={true}
                duration={500}
                className="border border-neutral-800 text-neutral-800 px-6 py-3 rounded-md hover:bg-neutral-200 cursor-pointer"
              >
                Learn More
              </Link>
            </div>
          </Parallax>

          {/* Image Section */}
          <Parallax translateX={[-30, 50]} opacity={[2, 0]} className="flex items-center justify-center">
            <div className="w-full h-[28rem] rounded-lg overflow-hidden">
              <img
                src={estateImage}
                alt="Estate Planning Illustration"
                className="object-cover w-full h-full"
              />
            </div>
          </Parallax>
        </div>
      </section>

      {/* About Section with ID for smooth scrolling */}
      <div id="about-section">
        <About />
      </div>

      {/* Trending Societies Section */}
      <TrendingSocietiesIntro />

      {/* Contact Us Section */}
      <section className="bg-neutral-900 text-white p-8 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
        <p className="text-lg mb-6 text-center max-w-lg">
          Have questions or need more information? Reach out to us, and our team
          will get back to you promptly.
        </p>
        <button 
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90"
          onClick={() => navigate('/contact')}
        >
          Contact Us
        </button>
      </section>
    </>
  );
};

export default Home;
