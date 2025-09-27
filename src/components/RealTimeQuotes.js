import React, { useState, useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import stockApi from '../api/stockApi';

const RealTimeQuotes = ({ symbols = ['^GSPC', '^DJI', '^IXIC', '^RUT', '^VIX'] }) => {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchQuotes = async () => {
    try {
      setIsLoading(true);
      const data = await stockApi.getBatchQuotes(symbols);
      setQuotes(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching real-time quotes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
    const interval = setInterval(fetchQuotes, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getChangeClass = (change) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-300';
  };

  const formatSymbol = (symbol) => {
    const names = {
      '^GSPC': 'S&P 500',
      '^DJI': 'Dow Jones',
      '^IXIC': 'NASDAQ',
      '^RUT': 'Russell 2000',
      '^VIX': 'Volatility Index'
    };
    return names[symbol] || symbol;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Market Indices</h3>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <button 
            onClick={fetchQuotes} 
            disabled={isLoading}
            className="flex items-center hover:text-blue-600 dark:hover:text-blue-400"
            title="Refresh"
          >
            <FiRefreshCw className={`mr-1 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {lastUpdated && `Updated: ${lastUpdated.toLocaleTimeString()}`}
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-pulse">Loading market data...</div>
          </div>
        ) : (
          quotes.map((quote, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{formatSymbol(quote.symbol)}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{quote.symbol}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{quote.price ? `$${quote.price.toFixed(2)}` : 'N/A'}</div>
                <div className={`text-sm ${getChangeClass(quote.change)}`}>
                  {quote.change > 0 ? '+' : ''}{quote.change?.toFixed(2)} ({quote.changePercent > 0 ? '+' : ''}{quote.changePercent?.toFixed(2)}%)
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RealTimeQuotes;
