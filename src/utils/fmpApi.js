import axios from 'axios';

// Validate API Key
const API_KEY = process.env.REACT_APP_FMP_API_KEY || 'demo';
if (!API_KEY || API_KEY === 'demo') {
  console.warn('⚠️ Using demo API key. For full functionality, please set REACT_APP_FMP_API_KEY in your .env file');
}

const BASE_URL = 'https://financialmodelingprep.com/api/v3';

// Create axios instance with interceptors
const fmpApi = axios.create({
  baseURL: BASE_URL,
  params: {
    apikey: API_KEY
  },
  timeout: 10000 // 10 second timeout
});

// Add request interceptor for logging
fmpApi.interceptors.request.use(
  config => {
    console.log(`[${new Date().toISOString()}] FMP API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params
    });
    return config;
  },
  error => {
    console.error('[FMP API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
fmpApi.interceptors.response.use(
  response => {
    console.log(`[${new Date().toISOString()}] FMP API Response: ${response.config.url}`, {
      status: response.status,
      data: Array.isArray(response.data) ? `Array[${response.data.length}]` : 'Object'
    });
    return response;
  },
  error => {
    console.error('[FMP API] Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);

const api = {
  // Get real-time quote for a stock
  getQuote: async (symbol) => {
    if (!symbol) {
      throw new Error('Stock symbol is required');
    }

    try {
      console.log(`[${new Date().toISOString()}] Fetching quote for ${symbol}`);
      const response = await fmpApi.get(`/quote-short/${symbol}`, {
        params: {
          apikey: API_KEY
        }
      });
      
      if (!response.data || response.data.length === 0) {
        throw new Error(`No data returned for symbol: ${symbol}`);
      }
      
      const quote = response.data[0];
      console.log(`[${new Date().toISOString()}] Received quote for ${symbol}:`, quote);
      
      return {
        symbol: symbol,
        price: quote.price,
        change: quote.price - (quote.price / (1 + quote.changesPercentage / 100)),
        changesPercentage: quote.changesPercentage
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error.message);
      throw new Error(`Failed to fetch quote for ${symbol}: ${error.message}`);
    }
  },

  // Get historical price data
  getHistoricalData: async (symbol, timeRange = '1month') => {
    try {
      let from, to = new Date().toISOString().split('T')[0];
      const today = new Date();
      
      switch(timeRange) {
        case '1D':
          from = new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0];
          return await fmpApi.get(`/historical-chart/1min/${symbol}`, {
            params: {
              from: from,
              to: to,
              apikey: API_KEY
            }
          }).then(res => res.data || []);
        case '1W':
          from = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
          break;
        case '1M':
          from = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];
          break;
        case '3M':
          from = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];
          break;
        case '1Y':
          from = new Date(today.setFullYear(today.getFullYear() - 1)).toISOString().split('T')[0];
          break;
        case '5Y':
        default:
          from = new Date(today.setFullYear(today.getFullYear() - 5)).toISOString().split('T')[0];
          break;
      }
      
      const response = await fmpApi.get(`/historical-price-full/${symbol}`, {
        params: {
          from: from,
          to: to,
          apikey: API_KEY
        }
      });
      
      return response.data.historical || [];
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  },

  // Search for stocks by symbol or company name
  searchStocks: async (query) => {
    try {
      const response = await fmpApi.get(`/search`, {
        params: {
          query: query,
          limit: 10,
          exchange: 'NASDAQ,NYSE,AMEX',
          apikey: API_KEY
        }
      });
      
      return response.data.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        currency: stock.currency || 'USD',
        exchange: stock.exchangeShortName || 'N/A'
      }));
    } catch (error) {
      console.error('Error searching stocks:', error);
      throw error;
    }
  },

  // Get company overview data
  getCompanyOverview: async (symbol) => {
    if (!symbol) {
      throw new Error('Stock symbol is required');
    }

    try {
      console.log(`[${new Date().toISOString()}] Fetching overview for ${symbol}`);
      const [profile, quote] = await Promise.all([
        fmpApi.get(`/profile/${symbol}`, { params: { apikey: API_KEY } }),
        fmpApi.get(`/quote-short/${symbol}`, { params: { apikey: API_KEY } })
      ]);
      
      if (!profile.data || profile.data.length === 0) {
        throw new Error(`No company data found for symbol: ${symbol}`);
      }
      
      const overview = profile.data[0];
      const quoteData = quote.data && quote.data[0];
      
      console.log(`[${new Date().toISOString()}] Received overview for ${symbol}:`, {
        name: overview.companyName,
        sector: overview.sector,
        marketCap: overview.mktCap,
        price: quoteData?.price,
        change: quoteData?.changesPercentage
      });
      
      return {
        ...overview,
        price: quoteData?.price,
        changesPercentage: quoteData?.changesPercentage
      };
    } catch (error) {
      console.error(`Error fetching company overview for ${symbol}:`, error.message);
      throw new Error(`Failed to fetch company overview for ${symbol}: ${error.message}`);
    }
  },

  // Get company profile (alias for getCompanyOverview for backward compatibility)
  getCompanyProfile: async (symbol) => {
    return api.getCompanyOverview(symbol);
  }
};

export default api;
