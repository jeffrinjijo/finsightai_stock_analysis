import { useState, useEffect } from 'react';
import { getStockQuote, getBatchStockQuotes } from '../services/alphaVantage.jsxundefined;

const useStockData = (symbols) => {
  const [stocks, setStocks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch data for all symbols
      const stockData = {};
      for (const symbol of symbols) {
        const data = await getStockQuote(symbol);
        if (data) {
          stockData[symbol] = data;
        }
      }
      
      setStocks(stockData);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to fetch stock data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbols && symbols.length > 0) {
      fetchStockData();
      
      // Refresh data every 5 minutes (Alpha Vantage has rate limits)
      const interval = setInterval(fetchStockData, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [JSON.stringify(symbols)]);

  const refreshStock = async (symbol) => {
    if (!symbol) return;
    
    try {
      const data = await getStockQuote(symbol);
      if (data) {
        setStocks(prev => ({
          ...prev,
          [symbol]: data
        }));
      }
    } catch (err) {
      console.error(`Error refreshing ${symbol}:`, err);
    }
  };

  return {
    stocks,
    loading,
    error,
    refreshStock,
    hasData: Object.keys(stocks).length > 0
  };
};

export default useStockData;
