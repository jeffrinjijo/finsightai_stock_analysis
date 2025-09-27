import axios from 'axios';

// Debug log environment variables
console.log('Environment Variables:', {
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  REACT_APP_USE_PROXY: process.env.REACT_APP_USE_PROXY,
  REACT_APP_FMP_API_KEY: process.env.REACT_APP_FMP_API_KEY ? '***' + process.env.REACT_APP_FMP_API_KEY.slice(-4) : 'undefined',
  REACT_APP_FMP_API_BASE_URL: process.env.REACT_APP_FMP_API_BASE_URL
});

const API_KEY = process.env.REACT_APP_FMP_API_KEY || 'demo';
const BASE_URL = process.env.REACT_APP_FMP_API_BASE_URL || 'https://financialmodelingprep.com/api/v3';
const USE_PROXY = process.env.REACT_APP_USE_PROXY === 'true';

console.log('API Configuration:', {
  API_KEY: API_KEY ? '***' + API_KEY.slice(-4) : 'undefined',
  BASE_URL,
  USE_PROXY
});

// Create axios instance for FMP API with proxy support if needed
const fmpApi = axios.create({
  baseURL: USE_PROXY ? '/fmp-api' : BASE_URL, // Use proxy in development
  timeout: 10000, // 10 second timeout
  params: {}
});

// Add API key to all requests
fmpApi.interceptors.request.use(config => {
  // Always include the API key in the request
  config.params = {
    ...config.params,
    apikey: API_KEY
  };
  
  console.log(`[FMP API] ${config.method.toUpperCase()} ${config.url}`, {
    params: config.params
  });
  
  return config;
}, error => {
  console.error('[FMP API] Request Error:', error);
  return Promise.reject(error);
});

// Add response interceptor to handle errors
fmpApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 429) {
        console.error('API rate limit exceeded - please wait before making more requests');
      } else if (error.response.status === 404) {
        console.error('The requested resource was not found');
      } else if (error.response.status >= 500) {
        console.error('Financial Modeling Prep API error - please try again later');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response from Financial Modeling Prep API - please check your connection');
    } else {
      // Something happened in setting up the request
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Get real-time quote for a stock
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Stock quote data
 */
export const getQuote = async (symbol) => {
  if (!symbol) {
    throw new Error('Stock symbol is required');
  }
  
  try {
    console.log(`[getQuote] Fetching quote for ${symbol}`);
    const response = await fmpApi.get(`/quote/${symbol}`);
    
    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      throw new Error(`No data returned for symbol: ${symbol}`);
    }
    
    const quote = response.data[0];
    
    console.log(`[getQuote] Success for ${symbol}:`, {
      price: quote.price,
      change: quote.change,
      changesPercentage: quote.changesPercentage
    });
    
    return quote;
    
  } catch (error) {
    const errorMessage = `Failed to fetch quote for ${symbol}: ${error.message}`;
    console.error('[getQuote]', errorMessage, {
      symbol,
      error: error.response?.data || error.message
    });
    
    // Return demo data if in demo mode and request fails
    if (API_KEY === 'demo') {
      console.warn('[getQuote] Using demo data due to error');
      return {
        symbol,
        price: 150.00 + (Math.random() * 10 - 5), // Random price around 150
        change: (Math.random() * 5 - 2.5).toFixed(2),
        changesPercentage: (Math.random() * 3 - 1.5).toFixed(2),
        volume: Math.floor(Math.random() * 10000000),
        timestamp: new Date().toISOString(),
        isDemoData: true
      };
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Generate demo historical data for testing
 */
const generateDemoHistoricalData = (days = 30) => {
  const data = [];
  const now = new Date();
  const basePrice = 150 + (Math.random() * 50 - 25); // Base price between 125-175
  let lastPrice = basePrice;

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    // Add some randomness to the price movement
    const change = (Math.random() * 4 - 2) * (1 + i / days); // Less volatile as we go back in time
    const close = i === days ? basePrice : Math.max(1, lastPrice * (1 + change / 100));
    const open = lastPrice * (0.995 + Math.random() * 0.01); // Slight variation from previous close
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (0.99 + Math.random() * 0.01);
    const volume = Math.floor(1000000 + Math.random() * 9000000);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
      isDemoData: true
    });
    
    lastPrice = close;
  }
  
  return data;
};

/**
 * Fetch historical stock data for a symbol
 * @param {string} symbol - Stock symbol
 * @param {string} timeRange - Time range (1D, 1W, 1M, 3M, 1Y, 5Y, ALL)
 * @returns {Promise<Array>} Array of historical price data
 */
export const getHistoricalData = async (symbol, timeRange = '1M') => {
  if (!symbol) {
    throw new Error('Stock symbol is required');
  }

  console.log(`[getHistoricalData] Fetching ${timeRange} data for ${symbol}`);
  
  try {
    let from, to = new Date().toISOString().split('T')[0];
    const today = new Date();
    
    // Set the 'from' date based on the time range
    switch(timeRange) {
      case '1D':
        from = new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0];
        break;
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
        from = new Date(today.setFullYear(today.getFullYear() - 5)).toISOString().split('T')[0];
        break;
      case 'ALL':
      default:
        from = '1970-01-01';
        break;
    }
    
    console.log(`[getHistoricalData] Date range: ${from} to ${to}`);
    
    const response = await fmpApi.get(`/historical-price-full/${symbol}`, {
      params: {
        from,
        to,
        apikey: API_KEY
      }
    });
    
    // Handle the response data
    let historicalData = [];
    if (response.data && response.data.historical) {
      historicalData = response.data.historical;
    } else if (Array.isArray(response.data)) {
      historicalData = response.data;
    }
    
    if (!Array.isArray(historicalData) || historicalData.length === 0) {
      throw new Error('No historical data received');
    }
    
    console.log(`[getHistoricalData] Received ${historicalData.length} data points for ${symbol}`);
    
    // Sort by date ascending
    const sortedData = [...historicalData].sort((a, b) => 
      new Date(a.date || a.date) - new Date(b.date || b.date)
    );
    
    return sortedData;
    
  } catch (error) {
    const errorMessage = `Failed to fetch historical data for ${symbol}: ${error.message}`;
    console.error('[getHistoricalData]', errorMessage, {
      symbol,
      timeRange,
      error: error.response?.data || error.message
    });
    
    // Return demo data if in demo mode and request fails
    if (API_KEY === 'demo') {
      console.warn('[getHistoricalData] Using demo data due to error');
      const demoData = generateDemoHistoricalData(
        timeRange === '1D' ? 1 :
        timeRange === '1W' ? 7 :
        timeRange === '1M' ? 30 :
        timeRange === '3M' ? 90 :
        timeRange === '1Y' ? 365 :
        30 // Default to 1 month
      );
      return demoData;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Search for stocks by symbol or company name
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching stocks
 */
export const searchStocks = async (query) => {
  if (!query || query.length < 1) {
    return [];
  }
  
  try {
    const response = await fmpApi.get(`/search`, {
      params: {
        query: query,
        limit: 10,
        exchange: 'NASDAQ,NASDAQ CAPITAL MARKET,NASDAQ GLOBAL MARKET,NASDAQ GLOBAL SELECT,NEW YORK STOCK EXCHANGE,NYSE ARCA,NYSE MKT,NYSE AMEX'
      }
    });
    
    if (!response.data || !Array.isArray(response.data)) {
      return [];
    }
    
    // Transform the response to match the expected format
    return response.data
      .filter(stock => stock.symbol && stock.name) // Filter out invalid entries
      .map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        currency: stock.currency || 'USD',
        exchange: stock.exchangeShortName || stock.exchange || 'UNKNOWN',
        type: stock.type || 'Equity'
      }));
  } catch (error) {
    console.error('Error searching stocks:', error);
    throw error;
  }
};

/**
 * Get market news for a specific symbol or general market news
 * @param {string} [symbol=''] - Optional stock symbol to filter news
 * @param {number} [limit=10] - Maximum number of news items to return
 * @returns {Promise<Array>} Array of news articles
 */
export const getMarketNews = async (symbol = '', limit = 10) => {
  try {
    const params = {
      limit
    };
    
    // Only add tickers filter if a symbol is provided
    if (symbol) {
      params.tickers = symbol;
    }
    
    console.log(`[getMarketNews] Fetching news${symbol ? ` for ${symbol}` : ''}`);
    
    const response = await fmpApi.get('/stock_news', { params });
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid news data format received');
    }
    
    console.log(`[getMarketNews] Successfully retrieved ${response.data.length} news items`);
    
    // Format the news data
    return response.data.map(article => ({
      id: article.publishedDate + '-' + (article.title || '').substring(0, 20).replace(/\s+/g, '-').toLowerCase(),
      headline: article.title || 'No Title',
      source: article.site || 'Unknown Source',
      date: article.publishedDate || new Date().toISOString(),
      summary: article.text || 'No summary available.',
      url: article.url || '#',
      image: article.image || '',
      relatedSymbols: article.tickers ? article.tickers.split(',').map(s => s.trim()) : [],
      hasPaywall: article.hasPaywall || false
    }));
    
  } catch (error) {
    console.error(`Error fetching market news${symbol ? ` for ${symbol}` : ''}:`, error);
    
    // Return demo data if in demo mode
    if (API_KEY === 'demo') {
      console.warn('[getMarketNews] Using demo data due to error');
      return generateDemoNews(limit, symbol);
    }
    
    throw new Error(`Failed to fetch market news: ${error.message}`);
  }
};

/**
 * Generate demo news data for testing/demo mode
 * @param {number} limit - Number of news items to generate
 * @param {string} [symbol] - Optional symbol for related news
 * @returns {Array} Demo news data
 */
const generateDemoNews = (limit, symbol) => {
  const demoNews = [];
  const companies = symbol ? [symbol] : ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'];
  const sources = ['Bloomberg', 'Reuters', 'CNBC', 'Wall Street Journal', 'Financial Times'];
  const now = new Date();
  
  for (let i = 0; i < limit; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const date = new Date(now);
    date.setHours(date.getHours() - Math.floor(Math.random() * 24));
    
    demoNews.push({
      id: `demo-${i}-${date.getTime()}`,
      headline: `Demo: ${company} ${['reports', 'announces', 'plans', 'launches'][Math.floor(Math.random() * 4)]} ${['strong', 'weak', 'record', 'disappointing'][Math.floor(Math.random() * 4)]} ${['earnings', 'product', 'partnership', 'acquisition'][Math.floor(Math.random() * 4)]}`,
      source,
      date: date.toISOString(),
      summary: 'This is a demo news item. In a real application, this would show the actual news content from the Financial Modeling Prep API.',
      url: '#',
      image: `https://financialmodelingprep.com/image-stock/${company.toLowerCase()}.jpg`,
      relatedSymbols: [company],
      hasPaywall: Math.random() > 0.7,
      isDemoData: true
    });
  }
  
  return demoNews;
};

/**
 * Get company profile information
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Company profile data
 */
export const getCompanyProfile = async (symbol) => {
  if (!symbol) {
    throw new Error('Stock symbol is required');
  }
  
  try {
    const response = await fmpApi.get(`/profile/${symbol}`);
    
    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      throw new Error('No company profile data found');
    }
    
    const profile = response.data[0];
    
    // Return a properly formatted profile with fallback values
    return {
      symbol: profile.symbol || symbol,
      companyName: profile.companyName || 'N/A',
      exchange: profile.exchange || 'N/A',
      industry: profile.industry || 'N/A',
      website: profile.website || '',
      description: profile.description || 'No description available.',
      ceo: profile.ceo || 'N/A',
      sector: profile.sector || 'N/A',
      country: profile.country || 'N/A',
      phone: profile.phone || 'N/A',
      address: profile.address || 'N/A',
      city: profile.city || 'N/A',
      state: profile.state || 'N/A',
      zip: profile.zip || 'N/A',
      image: profile.image || '',
      ipoDate: profile.ipoDate || 'N/A',
      defaultImage: !profile.image // Flag to use default image if no image is available
    };
    
  } catch (error) {
    console.error(`Error fetching company profile for ${symbol}:`, error);
    
    // Return a default profile with demo data if in demo mode
    if (API_KEY === 'demo') {
      console.warn('[getCompanyProfile] Using demo data due to error');
      return {
        symbol,
        companyName: `${symbol} Inc.`,
        exchange: 'N/A',
        industry: 'Technology',
        website: '',
        description: 'Company information not available in demo mode.',
        ceo: 'John Doe',
        sector: 'Technology',
        country: 'USA',
        phone: 'N/A',
        address: 'N/A',
        city: 'N/A',
        state: 'N/A',
        zip: 'N/A',
        image: '',
        ipoDate: 'N/A',
        defaultImage: true,
        isDemoData: true
      };
    }
    
    throw new Error(`Failed to fetch company profile: ${error.message}`);
  }
};

/**
 * Get company financial statements
 * @param {string} symbol - Stock symbol
 * @param {string} statementType - Type of statement (income-statement, balance-sheet-statement, cash-flow-statement)
 * @param {number} limit - Number of periods to return
 * @returns {Promise<Array>} Financial statements data
 */
/**
 * Get company financial statements
 * @param {string} symbol - Stock symbol
 * @param {string} statementType - Type of statement ('income-statement', 'balance-sheet-statement', 'cash-flow-statement')
 * @param {number} limit - Number of periods to return
 * @returns {Promise<Array>} Financial statements data
 */
export const getFinancialStatements = async (symbol, statementType = 'income-statement', limit = 4) => {
  if (!symbol) {
    throw new Error('Stock symbol is required');
  }
  
  // Validate statement type
  const validStatementTypes = ['income-statement', 'balance-sheet-statement', 'cash-flow-statement'];
  if (!validStatementTypes.includes(statementType)) {
    throw new Error(`Invalid statement type. Must be one of: ${validStatementTypes.join(', ')}`);
  }
  
  try {
    console.log(`[getFinancialStatements] Fetching ${statementType} for ${symbol}`);
    
    const response = await fmpApi.get(`/${statementType}/${symbol}`, {
      params: {
        limit,
        period: 'quarter' // Default to quarterly statements
      }
    });
    
    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      throw new Error(`No ${statementType} data found for ${symbol}`);
    }
    
    console.log(`[getFinancialStatements] Successfully retrieved ${response.data.length} periods of ${statementType} for ${symbol}`);
    
    // Format the data for consistent response
    return response.data.map(statement => ({
      ...statement,
      // Add any additional formatting or transformations here
      date: statement.date || statement.fillingDate || statement.endDate || 'N/A',
      symbol: statement.symbol || symbol,
      period: statement.period || 'quarterly'
    }));
    
  } catch (error) {
    console.error(`Error fetching ${statementType} for ${symbol}:`, error);
    
    // Return demo data if in demo mode
    if (API_KEY === 'demo') {
      console.warn(`[getFinancialStatements] Using demo data for ${statementType} due to error`);
      return generateDemoFinancialStatements(statementType, limit, symbol);
    }
    
    throw new Error(`Failed to fetch ${statementType}: ${error.message}`);
  }
};

/**
 * Generate demo financial statements for testing/demo mode
 * @param {string} type - Type of statement
 * @param {number} limit - Number of periods
 * @param {string} symbol - Stock symbol
 * @returns {Array} Demo financial statements
 */
const generateDemoFinancialStatements = (type, limit, symbol) => {
  const periods = [];
  const today = new Date();
  
  for (let i = 0; i < limit; i++) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - (i * 3)); // Quarterly data
    
    const baseData = {
      date: date.toISOString().split('T')[0],
      symbol,
      period: 'quarterly',
      reportedCurrency: 'USD',
      isDemoData: true
    };
    
    let statementData = {};
    
    switch (type) {
      case 'income-statement':
        const revenue = 1000000 * (1 + (Math.random() * 0.2 - 0.1));
        const cogs = revenue * (0.4 + Math.random() * 0.2);
        const grossProfit = revenue - cogs;
        const operatingIncome = grossProfit * (0.6 + Math.random() * 0.2);
        const netIncome = operatingIncome * (0.7 + Math.random() * 0.2);
        
        statementData = {
          ...baseData,
          revenue,
          costOfRevenue: cogs,
          grossProfit,
          operatingIncome,
          operatingExpenses: grossProfit - operatingIncome,
          netIncome,
          eps: (netIncome / 1000000).toFixed(2)
        };
        break;
        
      case 'balance-sheet-statement':
        const totalAssets = 5000000 * (1 + (Math.random() * 0.2 - 0.1));
        const totalLiabilities = totalAssets * (0.5 + Math.random() * 0.2);
        const totalEquity = totalAssets - totalLiabilities;
        
        statementData = {
          ...baseData,
          totalAssets,
          totalCurrentAssets: totalAssets * 0.6,
          totalLiabilities,
          totalCurrentLiabilities: totalLiabilities * 0.7,
          totalStockholdersEquity: totalEquity,
          retainedEarnings: totalEquity * 0.8
        };
        break;
        
      case 'cash-flow-statement':
        const operatingCashFlow = 200000 * (1 + (Math.random() * 0.3 - 0.15));
        const capitalExpenditure = -100000 * (1 + Math.random() * 0.2);
        const freeCashFlow = operatingCashFlow + capitalExpenditure;
        
        statementData = {
          ...baseData,
          operatingCashFlow,
          capitalExpenditure,
          freeCashFlow,
          netIncome: operatingCashFlow * (0.8 + Math.random() * 0.2),
          dividendPayout: -50000 * (1 + Math.random() * 0.1)
        };
        break;
    }
    
    periods.push(statementData);
  }
  
  return periods;
};

/**
 * Get real-time quotes for multiple symbols
 * @param {Array<string>} symbols - Array of stock symbols
 * @returns {Promise<Array>} Array of quote objects
 */
const getBatchQuotes = async (symbols) => {
  try {
    if (!symbols || !symbols.length) return [];
    
    // FMP API supports up to 25 symbols per request
    const symbolList = symbols.join(',');
    const response = await fmpApi.get(`/quote/${symbolList}`);
    
    // Transform the data to match our format
    return response.data.map(quote => ({
      symbol: quote.symbol,
      name: quote.name,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changesPercentage,
      volume: quote.volume,
      marketCap: quote.marketCap,
      peRatio: quote.pe,
      sector: quote.sector || 'N/A',
      exchange: quote.exchange,
      timestamp: new Date()
    }));
  } catch (error) {
    console.error('Error fetching batch quotes:', error);
    // Generate demo data if API fails (for development)
    if (process.env.NODE_ENV === 'development') {
      return symbols.map(symbol => {
        const basePrice = 100 + Math.random() * 100;
        const change = (Math.random() - 0.5) * 5;
        return {
          symbol,
          name: `${symbol} Company`,
          price: basePrice,
          change: change,
          changePercent: (change / basePrice) * 100,
          volume: Math.floor(Math.random() * 10000000) + 1000000,
          marketCap: Math.floor(Math.random() * 1000000000000) + 1000000000,
          peRatio: 10 + Math.random() * 30,
          sector: ['Technology', 'Finance', 'Healthcare', 'Consumer', 'Industrial'][Math.floor(Math.random() * 5)],
          exchange: 'NASDAQ',
          timestamp: new Date()
        };
      });
    }
    throw error;
  }
};

/**
 * Get market indices data
 * @returns {Promise<Array>} Array of market indices
 */
const getMarketIndices = async () => {
  const indices = ['^GSPC', '^DJI', '^IXIC', '^VIX'];
  try {
    const response = await fmpApi.get(`/quote/${indices.join(',')}`);
    return response.data.map(index => ({
      symbol: index.symbol.replace('^', ''),
      name: index.symbol === '^GSPC' ? 'S&P 500' : 
            index.symbol === '^DJI' ? 'Dow Jones' :
            index.symbol === '^IXIC' ? 'NASDAQ' : 'VIX',
      price: index.price,
      change: index.change,
      changePercent: index.changesPercentage,
      timestamp: new Date()
    }));
  } catch (error) {
    console.error('Error fetching market indices:', error);
    // Fallback to demo data
    return [
      { symbol: 'SPX', name: 'S&P 500', price: 4500 + Math.random() * 100, change: (Math.random() - 0.5) * 50, changePercent: (Math.random() - 0.5) * 2 },
      { symbol: 'DJI', name: 'Dow Jones', price: 35000 + Math.random() * 1000, change: (Math.random() - 0.5) * 100, changePercent: (Math.random() - 0.5) * 1.5 },
      { symbol: 'IXIC', name: 'NASDAQ', price: 14000 + Math.random() * 500, change: (Math.random() - 0.5) * 40, changePercent: (Math.random() - 0.5) * 2.5 },
      { symbol: 'VIX', name: 'Volatility', price: 18 + Math.random() * 5, change: (Math.random() - 0.5) * 2, changePercent: (Math.random() - 0.5) * 10 }
    ];
  }
};

// Export all API functions
export default {
  getQuote,
  getHistoricalData,
  searchStocks,
  getCompanyProfile,
  getFinancialStatements,
  getMarketNews,
  getBatchQuotes,
  getMarketIndices,
  // Add any other functions that should be part of the public API
};
