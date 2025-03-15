import { useState } from 'react';
import { useFormik } from 'formik';
import { signUpSchema } from './validationSchema';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './authcontext'; // Import the AuthContext
import { toast } from 'react-hot-toast'; // Import react-hot-toast

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from AuthContext

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);

      // Check if passwords match
      if (values.password !== values.confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        toast.error('Passwords do not match.');
        return;
      }

      try {
        // Make API call to register the user
        const response = await axios.post('http://localhost:4000/api/users/register', values);
        
        console.log('User registered successfully:', response.data);
        
        // Log the user in after successful registration using AuthContext
        login(response.data.user);

        // Show success toast notification
        toast.success('Successfully signed up!');

        // Optionally navigate to the home page or dashboard
        navigate('/'); // Redirect to home or dashboard
        
        setLoading(false);
      } catch (error) {
        setLoading(false);
        const errorMessage = error.response?.data?.error || "Error during signup";
        setError(errorMessage);
        console.error("Error during signup:", error);

        // Show error toast notification
        toast.error(errorMessage);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-sm">{error}</div>}

          {/* Name Input */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className={formik.touched.name && formik.errors.name ? 'border-red-500' : ''}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            )}
          </div>

          {/* Email Input */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={formik.touched.email && formik.errors.email ? 'border-red-500' : ''}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            )}
          </div>

          {/* Password Input */}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={formik.touched.password && formik.errors.password ? 'border-red-500' : ''}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : ''}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="text-red-500 text-sm">{formik.errors.confirmPassword}</div>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mr-2 inline-block" />
            ) : 'Sign Up'}
          </Button>
        </form>

        {/* Already have an account */}
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
