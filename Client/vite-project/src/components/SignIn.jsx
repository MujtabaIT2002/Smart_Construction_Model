import { useState } from 'react';
import { useFormik } from 'formik';
import { signInSchema } from './validationSchema';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './authcontext'; // Import the AuthContext
import { toast } from 'react-hot-toast'; // Import react-hot-toast

const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth(); // Use AuthContext for authentication state

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      role: 'user', // Default role is 'user'
    },
    validationSchema: signInSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);

      try {
        let response;

        if (values.role === 'admin') {
          // Make API call to admin login endpoint
          response = await axios.post('http://localhost:4000/api/admin/login', {
            email: values.email,
            password: values.password,
          });
        } else {
          // Make API call to user login endpoint
          response = await axios.post('http://localhost:4000/api/users/login', {
            email: values.email,
            password: values.password,
          });
        }

        // Log the user in using AuthContext
        console.log('User logged in successfully:', response.data);

        // Ensure the correct data is passed to the login function
        login({
          user: response.data.user || { email: values.email },
          token: response.data.token,
        });

        // Show success toast notification
        toast.success('Successfully signed in!');

        // Navigate to the appropriate dashboard after successful login
        if (values.role === 'admin') {
          navigate('/admin/dashboard'); // Redirect to admin dashboard
        } else {
          navigate('/'); // Redirect to user home or dashboard
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        const errorMessage = error.response?.data?.error || "Error during sign in";
        setError(errorMessage);
        console.error("Error during sign in:", error);

        // Show error toast notification
        toast.error(errorMessage);
      }
    },
  });

  // If the user is already logged in, show a message and prevent form submission
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6">
          <h1 className="text-2xl font-bold text-center mb-6">You are already logged in</h1>
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Go to your{' '}
              <Link to="/" className="text-primary font-semibold hover:underline">
                Dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-sm">{error}</div>}

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

          {/* Role Selection */}
          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              name="role"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.role}
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {formik.touched.role && formik.errors.role && (
              <div className="text-red-500 text-sm">{formik.errors.role}</div>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mr-2 inline-block" />
            ) : 'Sign In'}
          </Button>
        </form>

        {/* Not registered yet */}
        {formik.values.role !== 'admin' && (
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Not registered?{' '}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignInForm;
