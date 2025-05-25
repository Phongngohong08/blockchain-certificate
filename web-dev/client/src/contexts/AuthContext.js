import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG, apiRequest } from '../config/api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    const storedUserType = localStorage.getItem('userType');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedUserType && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      setUserType(storedUserType);
      setToken(storedToken);
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials, type) => {
    try {
      setLoading(true);
      const endpoint = type === 'student' ? API_CONFIG.ENDPOINTS.STUDENT.LOGIN : API_CONFIG.ENDPOINTS.UNIVERSITY.LOGIN;
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }
      
      const user = data.user || data.student || data.university;
      const authToken = data.token;
      
      setCurrentUser(user);
      setUserType(type);
      setToken(authToken);
      
      // Store in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('userType', type);
      localStorage.setItem('token', authToken);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, type) => {
    try {
      setLoading(true);
      const endpoint = type === 'student' ? API_CONFIG.ENDPOINTS.STUDENT.REGISTER : API_CONFIG.ENDPOINTS.UNIVERSITY.REGISTER;
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const endpoint = userType === 'student' ? API_CONFIG.ENDPOINTS.STUDENT.LOGOUT : API_CONFIG.ENDPOINTS.UNIVERSITY.LOGOUT;
      await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear user data regardless of API call result
      setCurrentUser(null);
      setUserType(null);
      setToken(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userType');
      localStorage.removeItem('token');
      navigate('/');
    }
  };
  const value = {
    currentUser,
    userType,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
