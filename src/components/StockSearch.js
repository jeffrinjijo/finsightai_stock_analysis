import React, { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import fmpApi from '../utils/fmpApi';

const StockSearch = ({ onSelectStock, selectedStocks = [] }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setResults([]);
      setIsDropdownOpen(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const apiResults = await fmpApi.searchStocks(searchQuery);
      setResults(apiResults || []);
      setIsDropdownOpen(apiResults && apiResults.length > 0);
    } catch (error) {
      console.error('Error searching stocks:', error);
      setResults([]);
      setIsDropdownOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelect = (stock) => {
    onSelectStock(stock.symbol);
    setQuery('');
    setResults([]);
    setIsDropdownOpen(false);
  };

  const isStockSelected = (symbol) => {
    return selectedStocks.some(stock => stock.symbol === symbol);
  };

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search for stocks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsDropdownOpen(true)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsDropdownOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <FiX className="h-5 w-5 text-gray-400 hover:text-gray-500" />
          </button>
        )}
      </div>

      {isLoading && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60 focus:outline-none sm:text-sm">
          <div className="px-4 py-2 text-gray-500 dark:text-gray-400">Searching...</div>
        </div>
      )}

      {isDropdownOpen && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60 focus:outline-none sm:text-sm">
          {results.map((stock) => (
            <button
              key={stock.symbol}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isStockSelected(stock.symbol) ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' : 'text-gray-900 dark:text-gray-100'}`}
              onClick={() => handleSelect(stock)}
              disabled={isStockSelected(stock.symbol)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold">{stock.symbol}</span>
                  <span className="text-sm text-gray-500 ml-2">{stock.name}</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {stock.exchange}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockSearch;
