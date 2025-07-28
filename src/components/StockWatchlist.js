import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQuote } from '../utils/fmpApi';
import { motion } from 'framer-motion';

const StockWatchlist = ({ stocks, onRemove, isLoading }) => {
  const [watchlist, setWatchlist] = useState(stocks || []);
  
  // Fetch real-time data for all stocks in the watchlist
  const { data: stockQuotes = [], isLoading: isUpdating } = useQuery({
    queryKey: ['watchlistQuotes', watchlist.map(s => s.symbol).join(',')],
    queryFn: async () => {
      if (!watchlist.length) return [];
      
      const quotes = await Promise.all(
        watchlist.map(async (stock) => {
          try {
            const quote = await getQuote(stock.symbol);
            return {
              ...stock,
              price: parseFloat(quote?.price || 0),
              change: parseFloat(quote?.change || 0),
              changePercent: parseFloat(quote?.changesPercentage || 0),
              volume: parseInt(quote?.volume || 0, 10),
              lastUpdated: new Date().toISOString()
            };
          } catch (error) {
            console.error(`Error fetching quote for ${stock.symbol}:`, error);
            return { ...stock, error: 'Failed to update' };
          }
        })
      );
      
      return quotes;
    },
    refetchInterval: 30000, // Update every 30 seconds
    enabled: watchlist.length > 0
  });

  // Update watchlist when stocks prop changes
  useEffect(() => {
    if (stocks && stocks.length > 0) {
      setWatchlist(stocks);
    }
  }, [stocks]);

  const handleRemove = (symbol) => {
    const updatedWatchlist = watchlist.filter(stock => stock.symbol !== symbol);
    setWatchlist(updatedWatchlist);
    if (onRemove) onRemove(symbol);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {watchlist.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No stocks in your watchlist</p>
          <p className="text-sm mt-1">Search and add stocks to track their performance</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium px-2">
            <div className="col-span-4">SYMBOL</div>
            <div className="col-span-3 text-right">PRICE</div>
            <div className="col-span-3 text-right">CHANGE</div>
            <div className="col-span-2 text-right">ACTIONS</div>
          </div>
          
          <div className="space-y-2">
            {(stockQuotes.length > 0 ? stockQuotes : watchlist).map((stock) => (
              <motion.div 
                key={stock.symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-12 items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="col-span-4 font-medium text-gray-900 dark:text-white">
                  <div className="font-semibold">{stock.symbol}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {stock.name || stock.companyName || 'N/A'}
                  </div>
                </div>
                
                <div className="col-span-3 text-right">
                  <div className="font-semibold">
                    ${(stock.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                
                <div className="col-span-3 text-right">
                  <div className={`font-medium ${(stock.changePercent || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stock.changePercent >= 0 ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}%
                  </div>
                  <div className={`text-xs ${(stock.change || 0) >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    {stock.change >= 0 ? '+' : ''}{(stock.change || 0).toFixed(2)}
                  </div>
                </div>
                
                <div className="col-span-2 flex justify-end space-x-2">
                  <button 
                    onClick={() => handleRemove(stock.symbol)}
                    className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                    title="Remove from watchlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button 
                    className="p-1 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
                    title="View details"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          {isUpdating && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              <div className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating prices...
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StockWatchlist;
