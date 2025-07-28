import React, { useState, useEffect, useCallback } from 'react';
import { getQuote, getHistoricalData } from '../api/stockApi';

const StockData = ({ symbol = 'AAPL' }) => {
  const [stockData, setStockData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStockData = useCallback(async () => {
    if (!symbol) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Add a small delay to prevent UI freezing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Fetch both quote and historical data in parallel
      const [quote, history] = await Promise.all([
        getQuote(symbol).catch(err => {
          console.warn(`Failed to fetch quote for ${symbol}:`, err);
          return null;
        }),
        getHistoricalData(symbol, '1M').catch(err => {
          console.warn(`Failed to fetch history for ${symbol}:`, err);
          return [];
        })
      ]);
      
      if (quote) {
        setStockData(quote);
      }
      
      if (history && history.length > 0) {
        setHistoricalData(history);
      }
      
      if (!quote && (!history || history.length === 0)) {
        throw new Error('No data received from API');
      }
    } catch (err) {
      console.error('Error in fetchStockData:', err);
      setError('Failed to load stock data. Using demo data instead.');
      // Set demo data if API fails
      setStockData({
        symbol,
        name: symbol,
        price: Math.random() * 100 + 50,
        change: (Math.random() * 10 - 5).toFixed(2),
        changesPercentage: (Math.random() * 5 - 2.5).toFixed(2),
        dayHigh: Math.random() * 20 + 100,
        dayLow: Math.random() * 20 + 80,
        yearHigh: Math.random() * 50 + 150,
        yearLow: Math.random() * 50 + 50,
        marketCap: (Math.random() * 900000000 + 100000000).toFixed(0),
        volume: (Math.random() * 5000000 + 1000000).toFixed(0),
        open: Math.random() * 20 + 90,
        previousClose: Math.random() * 20 + 90,
        pe: (Math.random() * 30 + 10).toFixed(2),
        timestamp: Math.floor(Date.now() / 1000)
      });
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchStockData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchStockData, 30000);
    
    return () => clearInterval(interval);
  }, [fetchStockData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        <span className="ml-2">Loading {symbol} data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Error loading {symbol} data
            </h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stockData) {
    return null;
  }

  // Safely handle numeric values with fallbacks
  const safeToFixed = (value, decimals = 2) => {
    const num = typeof value === 'number' ? value : parseFloat(value);
    return !isNaN(num) ? num.toFixed(decimals) : '0.00';
  };

  const change = parseFloat(stockData.change) || 0;
  const changesPercentage = parseFloat(stockData.changesPercentage) || 0;
  const isPositive = change >= 0;
  const changeColor = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const changeIcon = isPositive ? '↑' : '↓';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {stockData.name} ({stockData.symbol})
          </h2>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {stockData.exchange} • {new Date(stockData.timestamp * 1000).toLocaleString()}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            ${stockData.price?.toFixed(2) || 'N/A'}
          </div>
          <div className={`mt-1 text-sm font-medium ${changeColor}`}>
            {changeIcon} ${Math.abs(change).toFixed(2)} ({safeToFixed(changesPercentage)}%)
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Open</div>
          <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
            ${stockData.open !== undefined ? safeToFixed(stockData.open) : 'N/A'}
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Day Range</div>
          <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
            ${stockData.dayLow !== undefined ? safeToFixed(stockData.dayLow) : 'N/A'} - ${stockData.dayHigh !== undefined ? safeToFixed(stockData.dayHigh) : 'N/A'}
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">52 Week Range</div>
          <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
            ${stockData.yearLow !== undefined ? safeToFixed(stockData.yearLow) : 'N/A'} - ${stockData.yearHigh !== undefined ? safeToFixed(stockData.yearHigh) : 'N/A'}
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Market Cap</div>
          <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
            ${stockData.marketCap ? safeToFixed(stockData.marketCap / 1e9) + 'B' : 'N/A'}
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Volume</div>
          <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
            {stockData.volume ? safeToFixed(stockData.volume / 1e6) + 'M' : 'N/A'}
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">P/E Ratio</div>
          <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
            {stockData.pe !== undefined ? safeToFixed(stockData.pe) : 'N/A'}
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Key Metrics</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">EPS (TTM)</div>
            <div className="font-medium">${stockData.eps !== undefined ? safeToFixed(stockData.eps) : 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">50-Day MA</div>
            <div className="font-medium">${stockData.priceAvg50 !== undefined ? safeToFixed(stockData.priceAvg50) : 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">200-Day MA</div>
            <div className="font-medium">${stockData.priceAvg200 !== undefined ? safeToFixed(stockData.priceAvg200) : 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Next Earnings</div>
            <div className="font-medium">
              {stockData.earningsAnnouncement 
                ? new Date(stockData.earningsAnnouncement).toLocaleDateString()
                : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockData;
