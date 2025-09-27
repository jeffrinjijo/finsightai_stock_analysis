import { ALPHA_VANTAGE_API_KEY, API_URLS } from '../config/api.jsxundefined;

const BASE_URL = API_URLS.ALPHA_VANTAGE;

// Get real-time stock quote
const getStockQuote = async (symbol) => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    
    if (data['Global Quote']) {
      const quote = data['Global Quote'];
      return {
        symbol: quote['01. symbol'],
        open: parseFloat(quote['02. open']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        price: parseFloat(quote['05. price']),
        volume: parseInt(quote['06. volume']),
        latestTradingDay: quote['07. latest trading day'],
        previousClose: parseFloat(quote['08. previous close']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', ''))
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return null;
  }
};

// Get batch stock quotes
const getBatchStockQuotes = async (symbols) => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=BATCH_STOCK_QUOTES&symbols=${symbols.join(',')}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    
    if (data['Stock Quotes']) {
      return data['Stock Quotes'].map(quote => ({
        symbol: quote['1. symbol'],
        price: parseFloat(quote['2. price']),
        volume: parseInt(quote['3. volume']),
        timestamp: quote['4. timestamp']
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching batch stock quotes:', error);
    return [];
  }
};

// Get historical stock data
const getStockHistory = async (symbol, interval = 'DAILY', outputsize = 'compact') => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_${interval.toUpperCase()}&symbol=${symbol}&outputsize=${outputsize}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    
    // The response key changes based on the interval
    const timeSeriesKey = Object.keys(data).find(key => key.includes('Time Series'));
    if (!timeSeriesKey) {
      console.error('No time series data found in response:', data);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching stock history:', error);
    return null;
  }
};

export { getStockQuote, getBatchStockQuotes, getStockHistory };
