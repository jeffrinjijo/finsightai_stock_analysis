import axios from 'axios';

// Create axios instance for our backend API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 second timeout
  withCredentials: true // Include cookies for authentication
});

// Add request interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Watchlist API Error:', error);
    return Promise.reject(error);
  }
);

const watchlistApi = {
  // Get user's watchlist
  getWatchlist: async () => {
    try {
      const response = await api.get('/watchlist');
      return response.data;
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      throw error;
    }
  },

  // Add stock to watchlist
  addToWatchlist: async (symbol) => {
    try {
      const response = await api.post('/watchlist', { symbol });
      return response.data;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  },

  // Remove stock from watchlist
  removeFromWatchlist: async (symbol) => {
    try {
      const response = await api.delete(`/watchlist/${symbol}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  },

  // Get watchlist stocks data in batch
  getWatchlistStocksData: async (symbols) => {
    try {
      const response = await api.get('/watchlist/stocks', {
        params: { symbols: symbols.join(',') }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching watchlist stocks data:', error);
      throw error;
    }
  }
};

export default watchlistApi;
