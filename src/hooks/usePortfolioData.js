import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Helper function to safely parse numbers from strings with potential currency symbols
const safeParseNumber = (value, defaultValue = 0) => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const num = parseFloat(value.replace(/[^0-9.-]+/g, ''));
    return isNaN(num) ? defaultValue : num;
  }
  return defaultValue;
};

// Add popular stocks that will be shown by default
const POPULAR_STOCKS = [
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' }
];

export const usePortfolioData = () => {
  const { currentUser } = useAuth();
  const [portfolioData, setPortfolioData] = useState({
    portfolioValue: 0,
    weeklyReturn: 0,
    winRate: 0,
    totalTrades: 0,
    activeGoals: 0,
    stocks: [],
    popularStocks: [],
    isLoading: true,
    error: null
  });

  // Helper function to log errors consistently
  const logError = (context, error, extra = {}) => {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      ...extra
    };
    
    console.error('Portfolio Data Error:', JSON.stringify(errorInfo, null, 2));
    return errorInfo;
  };
  
  const fetchStockData = useCallback(async (symbol) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5001/api/v1'}/stocks/${symbol}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(currentUser?.token && { 'Authorization': `Bearer ${currentUser.token}` })
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch data for ${symbol}`);
      }
      
      const data = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error('Invalid response format from server');
      }
      
      const stock = data.data;
      
      return {
        symbol: stock.symbol,
        name: stock.name || stock.symbol,
        currentPrice: stock.currentPrice || stock.price || 0,
        dailyChange: stock.change || 0,
        volume: stock.volume || 0,
        previousClose: stock.previousClose || 0,
        gainLoss: stock.change || 0,
        gainLossPct: stock.percentChange || stock.changePercent || 0
      };
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      // Return a default object with error information
      return {
        symbol,
        name: symbol,
        currentPrice: 0,
        dailyChange: 0,
        volume: 0,
        previousClose: 0,
        gainLoss: 0,
        gainLossPct: 0,
        error: error.message || 'Failed to fetch stock data',
        _error: error
      };
    }
  }, [currentUser?.token]);

  const fetchPortfolioData = useCallback(async () => {
    console.log('Starting fetchPortfolioData');
    
    // Set loading state
    setPortfolioData(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      lastUpdated: null
    }));
    
    try {
      // Fetch popular stocks data using Yahoo Finance API
      const popularStocksPromises = POPULAR_STOCKS.map(stock => fetchStockData(stock.symbol));
      const popularStocksData = await Promise.all(popularStocksPromises);

      // For demo purposes, we'll create some sample portfolio data
      const samplePortfolio = {
        portfolioValue: 150000,
        weeklyReturn: 2.5,
        winRate: 75,
        totalTrades: 24,
        activeGoals: 3,
        stocks: [
          { symbol: 'AAPL', shares: 10, avgPrice: 185.50 },
          { symbol: 'MSFT', shares: 15, avgPrice: 320.75 },
          { symbol: 'GOOGL', shares: 5, avgPrice: 2850.00 }
        ]
      };

      // Fetch current prices for portfolio stocks
      const portfolioStocks = await Promise.all(
        samplePortfolio.stocks.map(async (stock) => {
          const priceData = await fetchStockData(stock.symbol);
          return {
            ...stock,
            ...priceData,
            value: priceData.currentPrice * stock.shares,
            gainLoss: (priceData.currentPrice - stock.avgPrice) * stock.shares,
            gainLossPct: ((priceData.currentPrice - stock.avgPrice) / stock.avgPrice) * 100
          };
        })
      );

      // Process portfolio data with validation
      const portfolioValue = safeParseNumber(samplePortfolio.portfolioValue, 0);
      const weeklyReturn = safeParseNumber(samplePortfolio.weeklyReturn, 0);
      const winRate = safeParseNumber(samplePortfolio.winRate, 0);
      const totalTrades = safeParseNumber(samplePortfolio.totalTrades, 0);
      const activeGoals = safeParseNumber(samplePortfolio.activeGoals, 0);

      // Process user's stocks with validation
      const userStocks = portfolioStocks.map(stock => {
        return {
          symbol: String(stock.symbol || '').toUpperCase(),
          name: String(stock.name || stock.symbol || 'Unknown'),
          currentPrice: safeParseNumber(stock.currentPrice, 0),
          dailyChange: safeParseNumber(stock.dailyChange, 0),
          volume: safeParseNumber(stock.volume, 0),
          previousClose: safeParseNumber(stock.previousClose, 0),
          shares: safeParseNumber(stock.shares, 0),
          avgPrice: safeParseNumber(stock.avgPrice, 0),
          value: safeParseNumber(stock.value, 0),
          gainLoss: safeParseNumber(stock.gainLoss, 0),
          gainLossPct: safeParseNumber(stock.gainLossPct, 0),
          lastUpdated: new Date().toISOString(),
          ...(stock.error && { error: String(stock.error) })
        };
      });

      // Process popular stocks data with validation
      const processedPopularStocks = popularStocksData.map((stock, index) => ({
        symbol: String(POPULAR_STOCKS[index]?.symbol || '').toUpperCase(),
        name: String(POPULAR_STOCKS[index]?.name || ''),
        currentPrice: safeParseNumber(stock?.currentPrice, 0),
        dailyChange: safeParseNumber(stock?.dailyChange, 0),
        volume: safeParseNumber(stock?.volume, 0),
        previousClose: safeParseNumber(stock?.previousClose, 0),
        isPopular: true,
        ...(stock?.error && { error: String(stock.error) })
      })).filter(stock => stock.symbol);

      // Combine user stocks and popular stocks, removing duplicates
      const allStocks = [
        ...userStocks,
        ...processedPopularStocks.filter(ps => 
          ps && ps.symbol && !userStocks.some(us => us.symbol === ps.symbol)
        )
      ];

      // Update state with the new data
      const newState = {
        portfolioValue,
        weeklyReturn,
        winRate,
        totalTrades,
        activeGoals,
        stocks: allStocks,
        popularStocks: processedPopularStocks,
        isLoading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
        lastSuccessfulFetch: new Date().toISOString()
      };

      setPortfolioData(newState);
      return newState;

    } catch (error) {
      console.error('Error in fetchPortfolioData:', error);
      const errorMessage = error.message || 'An unexpected error occurred while loading your portfolio data.';
      setPortfolioData(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        lastUpdated: new Date().toISOString()
      }));
      
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      throw error;
    }
  }, [currentUser]);

  // Initial fetch with error handling
  useEffect(() => {
    let isMounted = true;
    let requestAbortController = new AbortController();
    
    const loadData = async () => {
      if (!isMounted) return;
      
      try {
        console.log('Starting portfolio data load');
        setPortfolioData(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Add a small delay to allow UI to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const result = await fetchPortfolioData();
        console.log('Portfolio data loaded successfully', { 
          hasStocks: result?.stocks?.length > 0,
          stockCount: result?.stocks?.length,
          portfolioValue: result?.portfolioValue
        });
        
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Request was aborted');
          return;
        }
        
        const errorInfo = logError('loadData - Error in portfolio data fetch', error, {
          isAuthError: error.isAuthError,
          status: error.status,
          code: error.code
        });
        
        if (isMounted) {
          let errorMessage = 'An unexpected error occurred while loading your portfolio data.';
          
          if (error.isAuthError) {
            errorMessage = 'Your session has expired. Please log in again.';
            // Clear invalid auth data
            localStorage.removeItem('finsightToken');
            localStorage.removeItem('finsightUser');
            // Give UI time to update before redirecting
            setTimeout(() => {
              window.location.href = '/login';
            }, 1000);
          } else if (error.status === 404) {
            errorMessage = 'Portfolio data not found. Please contact support.';
          } else if (error.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          setPortfolioData(prev => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
            lastError: errorInfo
          }));
          
          toast.error(errorMessage, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
        }
      } finally {
        if (isMounted) {
          setPortfolioData(prev => ({
            ...prev,
            isLoading: false,
            lastUpdated: new Date().toISOString()
          }));
        }
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
      requestAbortController.abort();
    };
  }, [fetchPortfolioData]);

  return {
    ...portfolioData,
    refreshPortfolio: fetchPortfolioData
  };
};

export default usePortfolioData;
