import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Import toast for notifications

const SocietyReviewForm = () => {
  const { societyId } = useParams();  // Extract 'societyId' from URL
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(null);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating!');
      return;
    }

    try {
      // Submit the review to the backend
      await axios.post(`http://localhost:4000/api/society/${societyId}/reviews`, {
        rating,
        comment,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success('Review submitted successfully!');
      navigate('/societies');  // Redirect back to society list after submission
    } catch (error) {
      console.error('Error submitting review:', error.response?.data || error.message);
      toast.error('Error submitting review. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-white text-center">Rate Society</h2>

        <div className="flex justify-center mb-6">
          {[...Array(5)].map((star, index) => {
            const ratingValue = index + 1;
            return (
              <FaStar
                key={index}
                className={`cursor-pointer ${ratingValue <= (hoverRating || rating) ? 'text-yellow-500' : 'text-gray-400'}`}
                onMouseEnter={() => setHoverRating(ratingValue)}
                onMouseLeave={() => setHoverRating(null)}
                onClick={() => setRating(ratingValue)}
              />
            );
          })}
        </div>

        <textarea
          className="w-full p-3 mb-4 text-black"
          placeholder="Leave a comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <Button className="bg-green-500 text-white font-semibold w-full" onClick={handleRatingSubmit}>
          Submit Review
        </Button>
      </div>
    </div>
  );
};

export default SocietyReviewForm;
