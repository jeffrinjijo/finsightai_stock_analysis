const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'WQQG34K4K8ZI1C0V';
const BASE_URL = 'https://www.alphavantage.co/query';

// Fetch real-time stock quote
export const fetchStockQuote = async (symbol) => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    if (data['Global Quote']) {
      const quote = data['Global Quote'];
      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        latestTradingDay: quote['07. latest trading day']
      };
    }
    throw new Error('Invalid API response');
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw error;
  }
};

// Fetch historical daily data
export const fetchHistoricalData = async (symbol, outputsize = 'compact') => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputsize}&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    if (data['Time Series (Daily)']) {
      const timeSeries = data['Time Series (Daily)'];
      return Object.entries(timeSeries).map(([date, values]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      }));
    }
    throw new Error('Invalid API response');
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    throw error;
  }
};

// Search for stocks
export const searchStocks = async (keywords) => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    if (data.bestMatches) {
      return data.bestMatches.map(match => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        currency: match['8. currency']
      }));
    }
    return [];
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
};

// Get batch quotes for multiple stocks
export const fetchBatchQuotes = async (symbols) => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=BATCH_STOCK_QUOTES&symbols=${symbols.join(',')}&apikey=${API_KEY}`
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
    console.error('Error fetching batch quotes:', error);
    return [];
  }
};
