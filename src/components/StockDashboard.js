import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FiHome,
  FiTrendingUp, 
  FiPieChart,
  FiDollarSign,
  FiActivity,
  FiSettings,
  FiBell,
  FiSearch,
  FiPlus,
  FiChevronDown,
  FiStar,
  FiRefreshCw,
  FiFilter,
  FiGrid,
  FiList,
  FiArrowUpRight,
  FiArrowDownRight
} from 'react-icons/fi';

// Sidebar Component
const Sidebar = () => (
  <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 p-6 flex flex-col">
    <div className="flex items-center mb-10">
      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold mr-2">F</div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Finsight</h1>
    </div>
    
    <nav className="flex-1">
      <ul className="space-y-2">
        <li>
          <a href="#" className="flex items-center px-4 py-3 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg font-medium">
            <FiHome className="mr-3 h-5 w-5" />
            Dashboard
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium">
            <FiTrendingUp className="mr-3 h-5 w-5" />
            Markets
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium">
            <FiPieChart className="mr-3 h-5 w-5" />
            Portfolio
          </a>
        </li>
      </ul>
    </nav>
  </div>
);

// Stock Card Component
const StockCard = ({ stock, onRefresh, isFavorite, onToggleFavorite, isLoading }) => {
  const isPositive = (stock.changePercent || 0) >= 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{stock.symbol}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stock.companyName || 'N/A'}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className={`p-1.5 rounded-lg ${isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
              onClick={() => onToggleFavorite(stock.symbol)}
            >
              <FiStar className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(stock.price)}
            </p>
            <p className={`text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isPositive ? '+' : ''}{stock.changePercent?.toFixed(2)}%
            </p>
          </div>
          <div className="h-12 w-24 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {/* Mini chart placeholder */}
          </div>
        </div>
        
        <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          Trade
        </button>
      </div>
    </div>
  );
};

// Format currency helper
const formatCurrency = (value, decimals = 2) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

// Main Dashboard Component
const StockDashboard = ({ stocks = [] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = (symbol) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(symbol)) {
        newFavorites.delete(symbol);
      } else {
        newFavorites.add(symbol);
      }
      return newFavorites;
    });
  };

  const handleRefresh = async (symbol) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  // Filter stocks based on search and sector
  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => {
      const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          stock.companyName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;
      return matchesSearch && matchesSector;
    });
  }, [stocks, searchQuery, selectedSector]);

  // Get unique sectors for filter
  const sectors = useMemo(() => {
    const allSectors = new Set(stocks.map(stock => stock.sector).filter(Boolean));
    return ['All', ...Array.from(allSectors)];
  }, [stocks]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Analysis</h1>
            <p className="text-gray-500 dark:text-gray-400">Track and analyze your favorite stocks</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search stocks..."
                className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 w-64 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
              <button
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700' : 'text-gray-500'}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >
                <FiGrid className="h-5 w-5" />
              </button>
              <button
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700' : 'text-gray-500'}`}
                onClick={() => setViewMode('list')}
                title="List view"
              >
                <FiList className="h-5 w-5" />
              </button>
            </div>
            
            <div className="relative">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
              >
                {sectors.map(sector => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>
            
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <FiBell className="h-6 w-6" />
            </button>
            
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
              JD
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Portfolio Value</p>
              <FiDollarSign className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">$125,430.50</p>
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
              <FiArrowUpRight className="mr-1" /> 2.4% ($2,890.20)
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Today's Return</p>
              <FiActivity className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">$2,450.30</p>
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
              <FiArrowUpRight className="mr-1" /> 1.8%
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Stocks</p>
              <FiPieChart className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stocks.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">+3 from last month</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Return</p>
              <FiTrendingUp className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">7.2%</p>
            <p className="text-sm text-green-600 dark:text-green-400">+0.8% vs last month</p>
          </div>
        </div>
        
        {/* Stock Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Watchlist</h2>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <FiPlus className="inline-block mr-1.5 -mt-0.5 h-4 w-4" />
                Add Stock
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <FiFilter className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {filteredStocks.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
              <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No stocks found</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {searchQuery ? 'Try adjusting your search or filter criteria.' : 'Add stocks to your watchlist to get started.'}
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                  Add Stock
                </button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStocks.map((stock, index) => (
                <motion.div
                  key={`${stock.symbol}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <StockCard 
                    stock={stock}
                    onRefresh={handleRefresh}
                    isFavorite={favorites.has(stock.symbol)}
                    onToggleFavorite={toggleFavorite}
                    isLoading={isLoading}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Symbol
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Company
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Change
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Market Cap
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStocks.map((stock) => {
                    const isPositive = (stock.changePercent || 0) >= 0;
                    return (
                      <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button 
                              onClick={() => toggleFavorite(stock.symbol)}
                              className="text-gray-400 hover:text-yellow-500 mr-3"
                            >
                              <FiStar className={`h-5 w-5 ${favorites.has(stock.symbol) ? 'text-yellow-500 fill-current' : ''}`} />
                            </button>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{stock.symbol}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{stock.sector || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{stock.companyName || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(stock.price)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className={`text-sm ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {isPositive ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {stock.marketCap ? formatCurrency(stock.marketCap, 1) : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockDashboard;
