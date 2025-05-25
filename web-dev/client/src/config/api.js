// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3002',
  TIMEOUT: 10000, // 10 seconds
  ENDPOINTS: {
    // University endpoints
    UNIVERSITY: {
      REGISTER: '/api/university/register',
      LOGIN: '/api/university/login',
      LOGOUT: '/api/university/logout',
      PROFILE: '/api/university/profile',
      ISSUED_CERTIFICATES: '/api/university/certificates',
      ISSUE_CERTIFICATE: '/api/university/issue'
    },
    
    // Student endpoints
    STUDENT: {
      REGISTER: '/api/student/register',
      LOGIN: '/api/student/login',
      LOGOUT: '/api/student/logout',
      PROFILE: '/api/student/profile',
      CERTIFICATES: '/api/student/certificates'
    },
    
    // Certificate endpoints
    CERTIFICATE: {
      DETAILS: '/api/certificate',
      VERIFY: '/api/verify'
    },
    
    // General API endpoints
    HEALTH: '/api/health',
    GENERATE_PROOF: '/api/generateProof'
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Default API instance for fetch requests
export const apiRequest = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    timeout: API_CONFIG.TIMEOUT,
    ...options
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

export default API_CONFIG;
