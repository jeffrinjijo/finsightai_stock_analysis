import { useState, useEffect, useCallback } from 'react';
import { getQuote, getHistoricalData } from '../api/stockApi.jsxundefined;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

const useRealTimeStocks = (symbols = [], updateInterval = 60000) => {
  const [stocks, setStocks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real-time data for a single stock
  const fetchStockData = useCallback(async (symbol) => {
    try {
      const [quote, historicalData] = await Promise.all([
        getQuote(symbol),
        getHistoricalData(symbol, '1M') // Get 1 month of historical data
      ]);
      
      return {
        symbol: quote.symbol,
        price: parseFloat(quote.price) || 0,
        change: parseFloat(quote.change) || 0,
        changePercent: parseFloat(quote.changesPercentage) || 0,
        volume: parseInt(quote.volume) || 0,
        open: parseFloat(quote.open) || 0,
        high: parseFloat(quote.dayHigh) || 0,
        low: parseFloat(quote.dayLow) || 0,
        previousClose: parseFloat(quote.previousClose) || 0,
        historicalData: Array.isArray(historicalData) ? historicalData : [],
        lastUpdated: new Date().toISOString()
      };
    } catch (err) {
      console.error(`Failed to fetch data for ${symbol}:`, err);
      throw err;
    }
  }, []);

  // Update all stocks data
  const updateStocks = useCallback(async () => {
    if (!symbols.length) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Process symbols in chunks to avoid rate limiting
      const chunkSize = 3;
      const updatedStocks = { ...stocks };
      
      for (let i = 0; i < symbols.length; i += chunkSize) {
        const chunk = symbols.slice(i, i + chunkSize);
        
        // Process each symbol in the chunk
        const chunkPromises = chunk.map(symbol => {
          const currentStock = stocks[symbol];
          const lastUpdated = currentStock?.lastUpdated ? new Date(currentStock.lastUpdated) : 0;
          const isStale = !lastUpdated || (Date.now() - lastUpdated) > CACHE_DURATION;
          
          if (!isStale && currentStock) {
            // Use cached data if not stale
            return Promise.resolve();
          }
          
          // Fetch fresh data if stale or not in cache
          return fetchStockData(symbol)
            .then(data => {
              updatedStocks[symbol] = data;
            })
            .catch(err => {
              console.error(`Error updating ${symbol}:`, err);
              // Keep the old data if available
              if (!updatedStocks[symbol] && currentStock) {
                updatedStocks[symbol] = currentStock;
              }
            });
        });
        
        // Wait for the current chunk to complete
        await Promise.all(chunkPromises);
        
        // Add a small delay between chunks to avoid rate limiting
        if (i + chunkSize < symbols.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // Update the stocks with the latest data
      setStocks(updatedStocks);
      
    } catch (err) {
      console.error('Error updating stocks:', err);
      setError('Failed to update stock data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [symbols, stocks]);

  // Initial data fetch
  useEffect(() => {
    if (symbols.length > 0) {
      updateStocks();
    }
  }, [symbols.join(',')]); // Re-run when symbols change

  // Set up polling interval
  useEffect(() => {
    if (symbols.length === 0) return;
    
    const intervalId = setInterval(updateStocks, updateInterval);
    return () => clearInterval(intervalId);
  }, [symbols.join(','), updateInterval, updateStocks]);

  // Get a single stock's data
  const getStock = useCallback((symbol) => {
    return stocks[symbol] || null;
  }, [stocks]);

  return {
    stocks: Object.values(stocks),
    getStock,
    loading,
    error,
    refresh: updateStocks
  };
};

export default useRealTimeStocks;
