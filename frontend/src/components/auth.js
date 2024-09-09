// src/components/AuthProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // Replace with your API login endpoint
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token); // Save token to localStorage
        setIsAuthenticated(true);
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
