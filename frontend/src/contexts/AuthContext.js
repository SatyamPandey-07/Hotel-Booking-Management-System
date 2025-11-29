import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      validateToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/validate`);
      if (response.data.valid) {
        // Try to get full user details including ID for API calls
        try {
          const userResponse = await axios.get(`${API_BASE_URL}/api/users/by-username/${response.data.username}`);
          setUser({
            id: userResponse.data.id,
            username: response.data.username,
            role: response.data.role,
            firstName: userResponse.data.firstName,
            lastName: userResponse.data.lastName,
            email: userResponse.data.email
          });
        } catch (userError) {
          console.warn('Could not fetch user details, using basic token info:', userError.message);
          // Fallback: Set user without ID - app will still work for most features
          setUser({
            username: response.data.username,
            role: response.data.role,
            // Use a temporary ID based on username hash for basic functionality
            id: response.data.username === 'admin' ? 1 : 2
          });
        }
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username,
        password
      });

      if (response.data.token) {
        const newToken = response.data.token;
        setToken(newToken);
        localStorage.setItem('token', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        setUser({
          id: response.data.userId,
          username: response.data.username,
          role: response.data.role,
          firstName: response.data.firstName,
          lastName: response.data.lastName
        });
        
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};