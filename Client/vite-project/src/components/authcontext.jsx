// src/components/authcontext.js

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {jwtDecode} from 'jwt-decode'; // Corrected import statement
import PropTypes from 'prop-types';

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(null);

  // Function to handle login
  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    setIsAuthenticated(true);
    setUser(userData.user);
    setToken(userData.token);
    setTokenExpired(false); // Reset token expired state on login

    // Decode token to get user role
    try {
      const decodedToken = jwtDecode(userData.token);
      setUserRole(decodedToken.role);
    } catch (error) {
      console.error('Invalid token during login:', error);
      // Optionally, log out or handle the error as needed
      logout();
    }
  };

  // Function to handle logout, wrapped in useCallback
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null); // Reset userRole on logout
    setToken(null);
  }, []);

  // Rehydrate user on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      // Validate token format before decoding
      if (storedToken.split('.').length === 3) {
        try {
          const decodedToken = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;

          // Check if the token is expired
          if (decodedToken.exp > currentTime) {
            setIsAuthenticated(true);
            setUser(JSON.parse(storedUser));
            setUserRole(decodedToken.role);
            setToken(storedToken);
          } else {
            logout(); // If the token is expired, log out the user
          }
        } catch (error) {
          console.error('Invalid token during rehydration:', error);
          logout();
        }
      } else {
        console.error('Invalid token format during rehydration');
        logout();
      }
    }
  }, [logout]);

  // Check token expiration on initial render and every 20 seconds
  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        // Validate token format before decoding
        if (storedToken.split('.').length === 3) {
          try {
            const decodedToken = jwtDecode(storedToken);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
              setTokenExpired(true);
              logout();
            }
          } catch (error) {
            console.error('Invalid token during expiration check:', error);
            logout();
          }
        } else {
          console.error('Invalid token format during expiration check');
          logout();
        }
      }
    };

    const interval = setInterval(checkTokenExpiration, 20000); // 20 seconds
    checkTokenExpiration(); // Also check on initial render

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, userRole, token, login, logout, tokenExpired }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Add prop types validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
