import React, { useState, useEffect } from 'react';
import { FiSearch, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const StockSelector = ({ stocks = [], onSelectStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSectors, setSelectedSectors] = useState(new Set());
  const [showSectorFilter, setShowSectorFilter] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState(new Set());

  // Get unique sectors
  const sectors = [...new Set(stocks.map(stock => stock.sector))].sort();

  // Filter stocks based on search and sector filters
  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSectors.size === 0 || selectedSectors.has(stock.sector);
    return matchesSearch && matchesSector;
  });

  const toggleSector = (sector) => {
    const newSelectedSectors = new Set(selectedSectors);
    if (newSelectedSectors.has(sector)) {
      newSelectedSectors.delete(sector);
    } else {
      newSelectedSectors.add(sector);
    }
    setSelectedSectors(newSelectedSectors);
  };

  const toggleStockSelection = (symbol) => {
    const newSelectedStocks = new Set(selectedStocks);
    if (newSelectedStocks.has(symbol)) {
      newSelectedStocks.delete(symbol);
    } else {
      newSelectedStocks.add(symbol);
    }
    setSelectedStocks(newSelectedStocks);
    
    // Notify parent component of the selected stocks
    if (onSelectStock) {
      onSelectStock(Array.from(newSelectedStocks));
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>
        
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSectorFilter(!showSectorFilter)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {selectedSectors.size > 0 ? `${selectedSectors.size} selected` : 'All Sectors'}
            {showSectorFilter ? (
              <FiChevronUp className="ml-2 h-5 w-5 text-gray-400" />
            ) : (
              <FiChevronDown className="ml-2 h-5 w-5 text-gray-400" />
            )}
          </button>
          
          {showSectorFilter && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1 max-h-60 overflow-auto">
                {sectors.map((sector) => (
                  <div key={sector} className="px-4 py-2">
                    <div className="flex items-center">
                      <input
                        id={`sector-${sector}`}
                        name="sectors"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                        checked={selectedSectors.has(sector)}
                        onChange={() => toggleSector(sector)}
                      />
                      <label htmlFor={`sector-${sector}`} className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                        {sector}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setSelectedSectors(new Set())}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stock List */}
      <div className="overflow-hidden bg-white dark:bg-gray-800 shadow sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
          {filteredStocks.length > 0 ? (
            filteredStocks.map((stock) => (
              <li key={stock.symbol}>
                <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center">
                    <input
                      id={`stock-${stock.symbol}`}
                      name="stocks"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                      checked={selectedStocks.has(stock.symbol)}
                      onChange={() => toggleStockSelection(stock.symbol)}
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {stock.symbol}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {stock.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${stock.price.toFixed(2)}
                    </div>
                    <div className={`text-sm ${stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
              No stocks found matching your criteria.
            </li>
          )}
        </ul>
      </div>
      
      {selectedStocks.size > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-md">
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            {selectedStocks.size} {selectedStocks.size === 1 ? 'stock' : 'stocks'} selected
          </p>
        </div>
      )}
    </div>
  );
};

export default StockSelector;
