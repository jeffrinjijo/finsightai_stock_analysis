import axios from 'axios';

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: 'http://localhost:5001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle HTTP errors
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
      return Promise.reject({ message: 'Request setup failed' });
    }
  }
);

export const fetchStockData = async (symbol) => {
  try {
    const response = await api.get(`/stocks/${symbol}`);
    return response.data.data; // Return the data directly
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

export const fetchMultipleStocks = async (symbols) => {
  try {
    const promises = symbols.map(symbol => fetchStockData(symbol));
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('Error fetching multiple stocks data:', error);
    throw error;
  }
};
