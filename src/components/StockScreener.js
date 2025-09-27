import React, { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

const StockScreener = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    marketCap: '',
    sector: '',
    peRatio: '',
    dividendYield: ''
  });

  const sectors = [
    'Technology', 'Healthcare', 'Financial', 'Consumer', 'Industrial',
    'Energy', 'Utilities', 'Real Estate', 'Materials', 'Communication'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const clearFilters = () => {
    const resetFilters = Object.keys(filters).reduce((acc, key) => ({
      ...acc,
      [key]: ''
    }), {});
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Stock Screener</h3>
        <div className="flex space-x-2">
          <button 
            onClick={clearFilters}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX className="mr-1" /> Clear
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Range</label>
          <div className="flex space-x-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={filters.minPrice}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <span className="flex items-center text-gray-500">to</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Market Cap</label>
          <select
            name="marketCap"
            value={filters.marketCap}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Any</option>
            <option value="large">Large Cap ($10B+)</option>
            <option value="mid">Mid Cap ($2B - $10B)</option>
            <option value="small">Small Cap ($300M - $2B)</option>
            <option value="micro">Micro Cap (Under $300M)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sector</label>
          <select
            name="sector"
            value={filters.sector}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Sectors</option>
            {sectors.map(sector => (
              <option key={sector} value={sector.toLowerCase()}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">P/E Ratio</label>
          <input
            type="number"
            name="peRatio"
            placeholder="Max P/E"
            value={filters.peRatio}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dividend Yield</label>
          <input
            type="number"
            name="dividendYield"
            placeholder="Min %"
            step="0.1"
            value={filters.dividendYield}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiFilter className="mr-2" />
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockScreener;
