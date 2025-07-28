import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getQuote, 
  getHistoricalData, 
  getCompanyProfile, 
  getFinancialStatements 
} from '../api/stockApi';

// Fallback data in case API fails
const FALLBACK_DATA = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.34,
    change: 2.15,
    changesPercentage: 1.24,
    volume: 45678901,
    open: 173.50,
    dayHigh: 175.85,
    dayLow: 173.25,
    previousClose: 173.19,
    lastUpdated: new Date().toISOString(),
    companyName: 'Apple Inc.',
    exchange: 'NASDAQ',
    industry: 'Technology',
    website: 'https://www.apple.com',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 315.76,
    change: -1.23,
    changesPercentage: -0.39,
    volume: 23456789,
    open: 317.25,
    dayHigh: 318.50,
    dayLow: 315.10,
    previousClose: 316.99,
    lastUpdated: new Date().toISOString(),
    companyName: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    industry: 'Software—Infrastructure',
    website: 'https://www.microsoft.com',
    description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.'
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 2689.85,
    change: 15.75,
    changesPercentage: 0.59,
    volume: 12345678,
    open: 2675.30,
    dayHigh: 2695.25,
    dayLow: 2670.45,
    previousClose: 2674.10,
    lastUpdated: new Date().toISOString(),
    companyName: 'Alphabet Inc.',
    exchange: 'NASDAQ',
    industry: 'Internet Content & Information',
    website: 'https://abc.xyz',
    description: 'Alphabet Inc. provides online advertising services in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.'
  }
];

const useStocks = (symbols = []) => {
  const [stocks, setStocks] = useState({
    data: [],
    isLoading: false,
    lastUpdated: null,
    error: null
  });

  const safeParseNumber = (value, defaultValue = 0) => {
    if (value === null || value === undefined) return defaultValue;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = parseFloat(value.replace(/[^0-9.-]+/g, ''));
      return isNaN(num) ? defaultValue : num;
    }
    return defaultValue;
  };

  const fetchStockData = useCallback(async (symbol) => {
    console.log(`[fetchStockData] Fetching data for symbol: ${symbol}`);
    try {
      // First get the quote data
      console.log(`[fetchStockData] Fetching quote for ${symbol}...`);
      const quote = await getQuote(symbol);
      console.log(`[fetchStockData] Quote data for ${symbol}:`, quote);
      
      // Then get additional data in parallel
      console.log(`[fetchStockData] Fetching historical data and profile for ${symbol}...`);
      const [historicalData, profile] = await Promise.all([
        getHistoricalData(symbol, '1M'),
        getCompanyProfile(symbol)
      ]);
      
      console.log(`[fetchStockData] Historical data for ${symbol}:`, historicalData);
      console.log(`[fetchStockData] Profile for ${symbol}:`, profile);

      // Get financial statements if needed
      let financials = {};
      try {
        console.log(`[fetchStockData] Fetching financial statements for ${symbol}...`);
        const [income, balance, cashFlow] = await Promise.all([
          getFinancialStatements(symbol, 'income-statement', 1),
          getFinancialStatements(symbol, 'balance-sheet-statement', 1),
          getFinancialStatements(symbol, 'cash-flow-statement', 1)
        ]);
        
        console.log(`[fetchStockData] Financial statements for ${symbol}:`, { income, balance, cashFlow });
        
        if (income && income.length > 0) financials.income = income[0];
        if (balance && balance.length > 0) financials.balance = balance[0];
        if (cashFlow && cashFlow.length > 0) financials.cashFlow = cashFlow[0];
      } catch (financialError) {
        console.warn(`[fetchStockData] Could not fetch financials for ${symbol}:`, financialError);
      }

      const stockData = {
        symbol,
        name: profile?.companyName || quote?.name || symbol,
        price: parseFloat(quote?.price) || 0,
        change: parseFloat(quote?.change) || 0,
        changePercent: parseFloat(quote?.changesPercentage) || 0,
        volume: parseInt(quote?.volume) || 0,
        open: parseFloat(quote?.open) || 0,
        high: parseFloat(quote?.dayHigh) || 0,
        low: parseFloat(quote?.dayLow) || 0,
        previousClose: parseFloat(quote?.previousClose) || 0,
        marketCap: profile?.mktCap || 0,
        peRatio: profile?.pe || 0,
        lastUpdated: new Date().toISOString(),
        // Additional data from profile
        companyName: profile?.companyName || quote?.name || symbol,
        exchange: profile?.exchange || 'N/A',
        industry: profile?.industry || 'N/A',
        website: profile?.website || '',
        description: profile?.description || '',
        // Financial data
        financials,
        // Historical data
        historicalData: historicalData || []
      };
      
      console.log(`[fetchStockData] Processed stock data for ${symbol}:`, stockData);
      return stockData;
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      // Return fallback data if available
      const fallback = FALLBACK_DATA.find(stock => stock.symbol === symbol);
      if (fallback) {
        console.warn(`Using fallback data for ${symbol}`);
        return {
          ...fallback,
          lastUpdated: new Date().toISOString(),
          isFallback: true,
          historicalData: []
        };
      }
      throw error;
    }
  }, []);

  // Fallback to static data if API fails
  const getFallbackData = (symbols) => {
    if (!symbols || symbols.length === 0) return [];
    
    const fallbackData = symbols.map(symbol => {
      const symbolUpper = symbol.toUpperCase();
      const fallback = FALLBACK_DATA.find(s => s.symbol === symbolUpper);
      return fallback || {
        symbol: symbolUpper,
        name: symbolUpper,
        price: 0,
        change: 0,
        changePercent: 0,
        volume: 0,
        open: 0,
        high: 0,
        low: 0,
        previousClose: 0,
        lastUpdated: new Date().toISOString(),
        isFallback: true
      };
    });
    
    console.log('[useStocks] Using fallback data for:', symbols);
    return fallbackData;
  };

  const refresh = useCallback(async () => {
    if (!symbols || symbols.length === 0) {
      const errorMsg = '[useStocks] No symbols provided, skipping refresh';
      console.warn(errorMsg);
      setStocks(prev => ({ ...prev, isLoading: false, error: errorMsg }));
      return;
    }
    
    console.log('[useStocks] Starting refresh for symbols:', symbols);
    setStocks(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Process symbols in chunks to avoid rate limiting
      const chunkSize = 3; // Process 3 symbols at a time
      const results = [];
      
      for (let i = 0; i < symbols.length; i += chunkSize) {
        const chunk = symbols.slice(i, i + chunkSize);
        console.log(`[useStocks] Processing chunk ${i/chunkSize + 1}:`, chunk);
        
        try {
          const chunkPromises = chunk.map(symbol => 
            fetchStockData(symbol).catch(error => {
              console.error(`[useStocks] Error fetching data for ${symbol}:`, error);
              // Return a fallback stock object if the API call fails
              return {
                symbol,
                name: symbol,
                price: 0,
                change: 0,
                changePercent: 0,
                isFallback: true,
                error: error.message || 'Failed to fetch stock data'
              };
            })
          );
          
          const chunkResults = await Promise.all(chunkPromises);
          results.push(...chunkResults);
          console.log(`[useStocks] Successfully processed chunk ${i/chunkSize + 1}`, chunkResults);
          
          // Add a small delay between chunks to avoid rate limiting
          if (i + chunkSize < symbols.length) {
            console.log('[useStocks] Adding delay between chunks...');
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (chunkError) {
          console.error(`[useStocks] Error processing chunk ${i/chunkSize + 1}:`, chunkError);
          // Continue with the next chunk even if one fails
          continue;
        }
      }
      
      setStocks({
        data: results,
        isLoading: false,
        lastUpdated: new Date().toISOString(),
        error: null
      });
    } catch (error) {
      console.error('Error refreshing stock data:', error);
      
      // If we have some results, still return them but with an error
      if (stocks.data.length > 0) {
        setStocks(prev => ({
          ...prev,
          isLoading: false,
          error: 'Partial data loaded. Some stocks may not be up to date.'
        }));
      } else {
        // If no results, use fallback data
        const fallbackData = FALLBACK_DATA.filter(stock => 
          symbols.includes(stock.symbol)
        );
        
        setStocks({
          data: fallbackData,
          isLoading: false,
          lastUpdated: new Date().toISOString(),
          error: 'Using fallback data. Please check your connection and try again.',
          isFallback: true
        });
      }
    }
  }, [symbols, fetchStockData, stocks.data]);

  // Use a ref to track the initial mount
  const isInitialMount = useRef(true);
  
  // Initial fetch
  useEffect(() => {
    console.log('[useStocks] useEffect triggered with symbols:', symbols);
    if (symbols && symbols.length > 0) {
      const currentSymbols = stocks.data.map(s => s.symbol);
      const symbolsChanged = JSON.stringify(symbols) !== JSON.stringify(currentSymbols);
      
      console.log('[useStocks] Current symbols in state:', currentSymbols);
      console.log('[useStocks] Symbols changed:', symbolsChanged);
      console.log('[useStocks] Is initial mount:', isInitialMount.current);
      
      // Only refresh if it's the initial mount or if symbols have changed
      if (isInitialMount.current || symbolsChanged) {
        console.log('[useStocks] Triggering refresh...');
        refresh();
        isInitialMount.current = false;
      } else {
        console.log('[useStocks] Skipping refresh - no changes detected');
      }
    } else {
      console.log('[useStocks] No symbols provided, skipping refresh');
    }
  }, [symbols, refresh, stocks.data]);

  // Helper function to get a stock by symbol
  const getStockBySymbol = useCallback((symbol) => {
    return stocks.data.find(stock => stock.symbol === symbol) || null;
  }, [stocks.data]);

  // Helper function to refresh a single stock
  const refreshStock = useCallback(async (symbol) => {
    try {
      const updatedStock = await fetchStockData(symbol);
      
      setStocks(prev => ({
        ...prev,
        data: prev.data.map(stock => 
          stock.symbol === symbol ? updatedStock : stock
        ),
        lastUpdated: new Date().toISOString()
      }));
      
      return updatedStock;
    } catch (error) {
      console.error(`Error refreshing stock ${symbol}:`, error);
      throw error;
    }
  }, [fetchStockData]);

  return {
    ...stocks,
    refresh,
    getStockBySymbol,
    refreshStock
  };
};

export default useStocks;
