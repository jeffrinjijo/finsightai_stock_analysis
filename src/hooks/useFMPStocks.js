import { useState, useEffect, useCallback, useRef } from 'react';
import { getQuote, getHistoricalData, getCompanyProfile } from '../api/stockApi';

// Helper function to compare arrays
const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
};

export const useFMPStocks = (symbols = []) => {
  const [stocks, setStocks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const prevSymbolsRef = useRef([]);
  const isMounted = useRef(true);

  // Cleanup function for component unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchStockData = useCallback(async (symbolsToFetch) => {
    if (!symbolsToFetch || symbolsToFetch.length === 0) {
      if (isMounted.current) {
        setLoading(false);
      }
      return;
    }
    
    // Skip if the symbols haven't changed
    if (arraysEqual(prevSymbolsRef.current, symbolsToFetch) && Object.keys(stocks).length > 0) {
      if (isMounted.current) {
        setLoading(false);
      }
      return;
    }
    
    prevSymbolsRef.current = [...symbolsToFetch];
    
    if (isMounted.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const stockPromises = symbolsToFetch.map(async (symbol) => {
        try {
          // Fetch all data in parallel
          const [quote, historicalData, profile] = await Promise.all([
            getQuote(symbol).catch(err => {
              console.error(`Error fetching quote for ${symbol}:`, err);
              return null;
            }),
            getHistoricalData(symbol, '1M').catch(err => {
              console.error(`Error fetching historical data for ${symbol}:`, err);
              return [];
            }),
            getCompanyProfile(symbol).catch(err => {
              console.error(`Error fetching profile for ${symbol}:`, err);
              return {
                companyName: symbol,
                industry: 'N/A',
                sector: 'N/A',
                description: '',
                website: '',
                image: ''
              };
            })
          ]);

          // If we couldn't get a quote, skip this symbol
          if (!quote) {
            console.warn(`No quote data available for ${symbol}, skipping...`);
            return null;
          }

          // Format the stock data
          return {
            symbol,
            name: profile?.companyName || symbol,
            currentPrice: quote.price || 0,
            change: quote.change || 0,
            changePercent: quote.changesPercentage || 0,
            volume: quote.volume || 0,
            historicalData: Array.isArray(historicalData) ? historicalData : [],
            lastUpdated: new Date().toISOString(),
            profile: {
              industry: profile?.industry || 'N/A',
              sector: profile?.sector || 'N/A',
              description: profile?.description || '',
              website: profile?.website || '',
              image: profile?.image || ''
            },
            isDemoData: quote.isDemoData || false
          };
        } catch (err) {
          console.error(`Unexpected error processing ${symbol}:`, err);
          return null;
        }
      });

      const results = await Promise.all(stockPromises);
      const validResults = results.filter(Boolean);
      
      if (validResults.length === 0) {
        throw new Error('No valid stock data received');
      }
      
      const stocksMap = validResults.reduce((acc, stock) => {
        acc[stock.symbol] = stock;
        return acc;
      }, {});

      setStocks(stocksMap);
      setError(null);
    } catch (err) {
      console.error('Error in useFMPStocks:', err);
      setError(err.message || 'Failed to fetch stock data. Please try again later.');
      
      // If we have previous data, keep it but show the error
      if (Object.keys(stocks).length > 0) {
        console.log('Using cached data due to error');
      }
    } finally {
      setLoading(false);
    }
  }, [stocks]);

  // Initial data fetch
  useEffect(() => {
    if (!isMounted.current) return;
    
    const fetchData = async () => {
      if (symbols && symbols.length > 0) {
        await fetchStockData(symbols);
      } else {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, [symbols.join()]); // Using join() to compare array contents

  // Function to refresh a single stock
  const refreshStock = useCallback(async (symbol) => {
    if (!symbol) return;
    
    try {
      const [quote, historicalData] = await Promise.all([
        getQuote(symbol).catch(err => {
          console.error(`Error refreshing quote for ${symbol}:`, err);
          return null;
        }),
        getHistoricalData(symbol, '1M').catch(err => {
          console.error(`Error refreshing historical data for ${symbol}:`, err);
          return [];
        })
      ]);

      if (!quote) {
        throw new Error(`Failed to refresh data for ${symbol}`);
      }

      setStocks(prevStocks => ({
        ...prevStocks,
        [symbol]: {
          ...prevStocks[symbol],
          currentPrice: quote.price || 0,
          change: quote.change || 0,
          changePercent: quote.changesPercentage || 0,
          volume: quote.volume || 0,
          historicalData: Array.isArray(historicalData) ? historicalData : (prevStocks[symbol]?.historicalData || []),
          lastUpdated: new Date().toISOString(),
          isDemoData: quote.isDemoData || false
        }
      }));
      
      return true;
    } catch (err) {
      console.error(`Error refreshing ${symbol}:`, err);
      throw err;
    }
  }, []);

  // Memoize the stocks array to prevent unnecessary re-renders
  const stocksArray = Object.values(stocks);
  const lastUpdated = stocksArray[0]?.lastUpdated;
  
  return {
    stocks: stocksArray,
    loading,
    error,
    refreshStock,
    lastUpdated
  };
};

export default useFMPStocks;
