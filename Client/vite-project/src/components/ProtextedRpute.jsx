// src/components/ProtectedRoute.js

import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authcontext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated || userRole !== 'ADMIN') {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  /** The component(s) to render if access is granted */
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
