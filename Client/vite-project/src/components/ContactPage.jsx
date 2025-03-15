import React, { useState, useEffect } from "react";
import axios from "axios";
import { PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { toast, Toaster } from 'react-hot-toast'; // Import React Hot Toast
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function ContactPage() {
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [reviewData, setReviewData] = useState({
    rating: 1,
    comment: "",
  });
  const [reviews, setReviews] = useState([]);

  // Fetch reviews from the backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/reviews/reviews");
        setReviews(response.data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  // Handle feedback input change
  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData({ ...feedbackData, [name]: value });
  };

  // Handle feedback form submission
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/feedback", feedbackData);
      setFeedbackData({ name: "", phone: "", message: "" });
      toast.success("Feedback sent successfully!"); // Use toast for success message
    } catch (error) {
      toast.error("Failed to send feedback."); // Use toast for error message
      console.error("Error sending feedback:", error);
    }
  };

  // Handle review input change
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData({ 
      ...reviewData, 
      [name]: name === 'rating' ? parseInt(value) : value // Convert rating to integer
    });
  };
  

  // Handle review form submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:4000/api/reviews/reviews",
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure token is sent here
          },
        }
      );
      setReviewData({ rating: 1, comment: "" });
      toast.success("Review submitted successfully!"); // Use toast for success message
    } catch (error) {
      toast.error("Failed to submit review."); // Use toast for error message
      console.error("Error submitting review:", error);
    }
  };

  // Autoplay plugin for the carousel, set delay to 5000ms for 5 seconds
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }) // Adjusted delay time
  );

  return (
    <div className="container mx-auto p-8 bg-black text-white">
      <Toaster position="top-right" /> {/* Place the Toaster component */}
      
      <section className="flex flex-col md:flex-row items-start md:space-x-12 space-y-8 md:space-y-0">
        
        {/* Contact Information & Developer Section */}
        <div className="w-full md:w-1/3 space-y-8">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-lg text-gray-300">
            Feel free to reach out with any questions or feedback.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <MapPinIcon className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-lg font-semibold">Our Location</h2>
                <p className="text-gray-400">Office # 25, 1st Floor, Galleria Mall, Markaz, Sector I-8, Islamabad</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <PhoneIcon className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-lg font-semibold">Phone Number</h2>
                <p className="text-gray-400">0311 1444325</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://www.facebook.com/broadempirepk?paipv=0&eav=AfZ0Xh3-3Yoqz7vd9EtZFfyRwCekrRUpSkhnxHM1xAxPn1cYTGapUK5fl1phvWfR8JI&_rdr" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-gray-300">
                Visit us on Facebook
              </a>
            </div>
          </div>
          
          {/* Developer Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-2">Developers</h3>
            <p className="text-gray-400">
              Mujtaba Tariq - <a href="tel:+923165423590" className="underline">+92 316-5423590</a>
            </p>
            <p className="text-gray-400">
              Zarmeen Rizwan - <a href="tel:+923105255160" className="underline">+92 310-5255160</a>
            </p>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="w-full md:w-1/3 bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Feedback Form</h2>
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={feedbackData.name}
              onChange={handleFeedbackChange}
              className="w-full p-3 border border-gray-700 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Your Phone"
              value={feedbackData.phone}
              onChange={handleFeedbackChange}
              className="w-full p-3 border border-gray-700 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={feedbackData.message}
              onChange={handleFeedbackChange}
              className="w-full p-3 border border-gray-700 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
              rows="4"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-white text-black font-semibold rounded hover:bg-gray-300 transition-colors"
            >
              Send Feedback
            </button>
          </form>
        </div>

        {/* Review Form */}
        <div className="w-full md:w-1/3 bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <select
              name="rating"
              value={reviewData.rating}
              onChange={handleReviewChange}
              className="w-full p-3 border border-gray-700 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
              required
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>{star} Star{star > 1 ? 's' : ''}</option>
              ))}
            </select>
            <textarea
              name="comment"
              placeholder="Your Review"
              value={reviewData.comment}
              onChange={handleReviewChange}
              className="w-full p-3 border border-gray-700 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
              rows="4"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-white text-black font-semibold rounded hover:bg-gray-300 transition-colors"
            >
              Submit Review
            </button>
          </form>
        </div>
      </section>

      {/* Reviews Carousel */}
      <section className="bg-gray-900 p-6 mt-12 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">User Reviews</h2>
        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-lg mx-auto"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {reviews.map((review) => (
              <CarouselItem key={review.id}>
                <div className="p-1">
                  <Card className="bg-black border border-gray-700 shadow-md">
                    <CardContent className="flex flex-col items-center p-6">
                      <span className="text-4xl font-semibold text-yellow-500">
                        {"⭐".repeat(review.rating)}
                      </span>
                      <p className="mt-2 text-center text-gray-300">{review.comment}</p>
                      <p className="mt-1 text-sm text-gray-400">
                        - {review.user.name}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </div>
  );
}

export default ContactPage;
