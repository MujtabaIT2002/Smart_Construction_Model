import { Navigate } from 'react-router-dom';
import { useAuth } from './authcontext';
import toast from 'react-hot-toast'; // Import toast from react-hot-toast
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Redirect to /signin if not authenticated
  if (!isAuthenticated) {
    // Show a toast notification
    toast.error('Please sign in to access this page.', {
      duration : 3000,
    });
    
    return <Navigate to="/signin" />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
