import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const usePortfolio = () => {
  const { currentUser } = useContext(AuthContext);
  const [portfolio, setPortfolio] = useState({
    portfolioValue: 0,
    weeklyReturn: 0,
    winRate: 0,
    totalTrades: 0,
    activeGoals: 0,
    stocks: [],
    isLoading: true,
    error: null
  });

  // Helper function to safely parse numbers
  const safeParseNumber = (value, defaultValue = 0) => {
    if (value === null || value === undefined) return defaultValue;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = parseFloat(value.replace(/[^0-9.-]+/g, ''));
      return isNaN(num) ? defaultValue : num;
    }
    return defaultValue;
  };

  // Transform API holding data to our format
  const transformHolding = (holding) => {
    if (!holding || typeof holding !== 'object') {
      console.warn('Invalid holding data:', holding);
      return null;
    }

    const symbol = String(holding.symbol || '').trim().toUpperCase();
    if (!symbol) {
      console.warn('Holding missing symbol:', holding);
      return null;
    }

    const currentPrice = safeParseNumber(holding.currentPrice, 0);
    const avgPrice = safeParseNumber(holding.avgPrice, currentPrice);
    const shares = Math.max(0, safeParseNumber(holding.shares, 0));
    const investment = avgPrice * shares;
    const currentValue = currentPrice * shares;
    const gainLoss = currentValue - investment;
    const gainLossPct = investment !== 0 ? (gainLoss / investment) * 100 : 0;

    return {
      symbol,
      name: holding.name || symbol,
      currentPrice,
      change: safeParseNumber(holding.change, 0),
      changePercent: safeParseNumber(holding.changePercent, 0),
      shares,
      avgPrice,
      investment,
      currentValue,
      gainLoss,
      gainLossPct,
      lastUpdated: holding.timestamp || new Date().toISOString()
    };
  };

  // Fetch portfolio data from the API
  const fetchPortfolio = useCallback(async () => {
    if (!currentUser?.token) {
      console.log('No current user, skipping portfolio fetch');
      setPortfolio(prev => ({ ...prev, isLoading: false, error: 'No user logged in' }));
      return null;
    }

    try {
      console.log('Fetching portfolio for user:', currentUser.id);
      setPortfolio(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Use the correct portfolio endpoint
      const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/v1/portfolio`;
      console.log('Fetching from URL:', apiUrl);
      
      // Include auth token in the headers
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`
      };
      
      const response = await fetch(apiUrl, { headers });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch portfolio: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Received portfolio data:', data);
      
      // Transform the data to match our expected structure
      const portfolioData = {
        portfolioValue: safeParseNumber(data.totalValue, 0),
        weeklyReturn: safeParseNumber(data.weeklyReturn, 0),
        winRate: safeParseNumber(data.winRate, 0),
        totalTrades: Math.floor(safeParseNumber(data.totalTrades, 0)),
        activeGoals: Math.floor(safeParseNumber(data.activeGoals, 0)),
        stocks: Array.isArray(data.holdings) 
          ? data.holdings.map(transformHolding).filter(Boolean)
          : []
      };

      console.log('Transformed portfolio data:', portfolioData);
      
      setPortfolio({
        ...portfolioData,
        isLoading: false,
        error: null
      });

      return portfolioData;
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      const errorMsg = error.message || 'Failed to load portfolio data';
      toast.error(errorMsg);
      setPortfolio(prev => ({
        ...prev,
        isLoading: false,
        error: errorMsg
      }));
      return null;
    }
  }, [currentUser]);

  // Initial fetch
  useEffect(() => {
    fetchPortfolio().catch(error => {
      console.error('Error in initial portfolio fetch:', error);
    });
  }, [fetchPortfolio]);

  // Return the portfolio data and refresh function
  return {
    ...portfolio,
    refresh: fetchPortfolio
  };
};

export default usePortfolio;
