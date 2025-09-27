import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiRefreshCw, 
  FiAlertCircle, 
  FiInfo,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity
} from 'react-icons/fi';

// Load dummy data (extracted from your Excel sheet and converted to JSON)
const DUMMY_STOCKS = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    price: 176.50,
    change: -1.20,
    changePercent: -0.68,
    volume: 89000000,
    open: 178.00,
    high: 179.20,
    low: 175.80,
    previousClose: 177.70,
    marketCap: 2800000000000,
    peRatio: 28.5,
    isMarketOpen: true,
    lastUpdated: new Date().toISOString()
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    price: 325.40,
    change: +2.50,
    changePercent: +0.77,
    volume: 43000000,
    open: 323.00,
    high: 327.00,
    low: 322.50,
    previousClose: 322.90,
    marketCap: 2420000000000,
    peRatio: 32.1,
    isMarketOpen: true,
    lastUpdated: new Date().toISOString()
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc. (Google)',
    sector: 'Technology',
    price: 135.75,
    change: +0.95,
    changePercent: +0.70,
    volume: 31000000,
    open: 134.80,
    high: 136.50,
    low: 134.20,
    previousClose: 134.80,
    marketCap: 1720000000000,
    peRatio: 29.8,
    isMarketOpen: true,
    lastUpdated: new Date().toISOString()
  },
  { 
    symbol: 'AMZN', 
    name: 'Amazon.com, Inc.', 
    sector: 'Consumer Discretionary', 
    price: 138.20, 
    change: +1.15, 
    changePercent: +0.84, 
    volume: 52000000, 
    open: 137.50, 
    high: 139.40, 
    low: 136.90, 
    previousClose: 137.05, 
    marketCap: 1410000000000, 
    peRatio: 60.2, 
    isMarketOpen: true, 
    lastUpdated: new Date().toISOString() 
  },
  { 
    symbol: 'META', 
    name: 'Meta Platforms, Inc.', 
    sector: 'Technology', 
    price: 305.40, 
    change: -2.10, 
    changePercent: -0.68, 
    volume: 28000000, 
    open: 308.00, 
    high: 310.00, 
    low: 303.00, 
    previousClose: 307.50, 
    marketCap: 790000000000, 
    peRatio: 24.7, 
    isMarketOpen: true, 
    lastUpdated: new Date().toISOString() 
  },
  { 
    symbol: 'AVGO', 
    name: 'Broadcom Inc.', 
    sector: 'Technology', 
    price: 890.75, 
    change: +5.80, 
    changePercent: +0.65, 
    volume: 5000000, 
    open: 885.00, 
    high: 895.00, 
    low: 880.00, 
    previousClose: 884.95, 
    marketCap: 370000000000, 
    peRatio: 21.3, 
    isMarketOpen: true, 
    lastUpdated: new Date().toISOString() 
  },
  { 
    symbol: 'TSLA', 
    name: 'Tesla, Inc.', 
    sector: 'Consumer Discretionary', 
    price: 245.10, 
    change: +3.20, 
    changePercent: +1.32, 
    volume: 67000000, 
    open: 242.00, 
    high: 248.00, 
    low: 240.50, 
    previousClose: 241.90, 
    marketCap: 780000000000, 
    peRatio: 55.0, 
    isMarketOpen: true, 
    lastUpdated: new Date().toISOString() 
  },
  { 
    symbol: 'BRK.B', 
    name: 'Berkshire Hathaway Inc.', 
    sector: 'Financials', 
    price: 351.80, 
    change: -1.00, 
    changePercent: -0.28, 
    volume: 4800000, 
    open: 353.00, 
    high: 355.50, 
    low: 350.80, 
    previousClose: 352.80, 
    marketCap: 780000000000, 
    peRatio: 20.4, 
    isMarketOpen: true, 
    lastUpdated: new Date().toISOString() 
  },
  { 
    symbol: 'JPM', 
    name: 'JPMorgan Chase & Co.', 
    sector: 'Financials', 
    price: 148.60, 
    change: +0.75, 
    changePercent: +0.51, 
    volume: 12000000, 
    open: 147.80, 
    high: 149.90, 
    low: 146.70, 
    previousClose: 147.85, 
    marketCap: 430000000000, 
    peRatio: 12.5, 
    isMarketOpen: true, 
    lastUpdated: new Date().toISOString() 
  },
  { 
    symbol: 'WMT', 
    name: 'Walmart Inc.', 
    sector: 'Consumer Staples', 
    price: 162.90, 
    change: -0.30, 
    changePercent: -0.18, 
    volume: 8500000, 
    open: 163.50, 
    high: 164.20, 
    low: 161.80, 
    previousClose: 163.20, 
    marketCap: 440000000000, 
    peRatio: 25.2, 
    isMarketOpen: true, 
    lastUpdated: new Date().toISOString() 
  },
  { 
    symbol: 'ORCL', 
    name: 'Oracle Corporation', 
    sector: 'Technology', 
    price: 115.70, 
    change: +1.05, 
    changePercent: +0.92, 
    volume: 9100000, 
    open: 114.50, 
    high: 116.80, 
    low: 113.90, 
    previousClose: 114.65, 
    marketCap: 320000000000, 
    peRatio: 19.8, 
    isMarketOpen: true, 
    lastUpdated: new Date().toISOString() 
  },
  { 
    symbol: 'LLY', 
    name: 'Eli Lilly & Co.', 
    sector: 'Healthcare', 
    price: 605.80, 
    change: +4.10, 
    changePercent: +0.68, 
    volume: 6200000, 
    open: 601.00, 
    high: 610.00, 
    low: 598.00, 
    previousClose: 601.70, 
    marketCap: 570000000000, 
    peRatio: 42.3, 
    isMarketOpen: true, 
    lastUpdated: new Date().toISOString() 
  },
  { 
    symbol: 'V', 
    name: 'Visa Inc.', 
    sector: 'Financials', 
    price: 245.30, 
    change: +0.80, 
    changePercent: +0.33, 
    volume: 7500000, 
    open: 244.00, 
    high: 247.00, 
    low: 243.00, 
    previousClose: 244.50, 
    marketCap: 510000000000, 
    peRatio: 29.6, 
    isMarketOpen: true, 
    lastUpdated: new Date().toISOString() 
  },
  { 
    symbol: 'NFLX', 
    name: 'Netflix, Inc.', 
    sector: 'Communication Services', 
    price: 415.20, 
    change: -5.50, 
    changePercent: -1.31, 
    volume: 9200000, 
    open: 421.00, 
    high: 423.00, 
    low: 413.00, 
    previousClose: 420.70, 
    marketCap: 180000000000, 
    peRatio: 34.1, 
    isMarketOpen: true, 
    lastUpdated: new Date().toISOString() 
  },
  { 
    symbol: 'MA', 
    name: 'Mastercard, Inc.', 
    sector: 'Financials', 
    price: 392.50, 
    change: +2.20, 
    changePercent: +0.56, 
    volume: 6100000, 
    open: 390.00, 
    high: 395.00, 
    low: 389.50, 
    previousClose: 390.30, 
    marketCap: 370000000000, 
    peRatio: 30.2, 
    isMarketOpen: true, 
    lastUpdated: new Date().toISOString() 
  },
  { 
    symbol: 'XOM', 
    name: 'Exxon Mobil Corporation', 
    sector: 'Energy', 
    price: 108.70, 
    change: -0.60, 
    changePercent: -0.55, 
    volume: 19000000, 
    open: 109.50, 
    high: 110.20, 
    low: 107.80, 
    previousClose: 109.30, 
    marketCap: 430000000000, 
    peRatio: 10.8, 
    isMarketOpen: true, 
    lastUpdated: new Date().toISOString() 
  },
  { 
    symbol: 'COST', 
    name: 'Costco Wholesale Corporation', 
    sector: 'Consumer Staples', 
    price: 550.90, 
    change: +3.70, 
    changePercent: +0.68, 
    volume: 4200000, 
    open: 548.00, 
    high: 553.00, 
    low: 546.00, 
    previousClose: 547.20, 
    marketCap: 250000000000, 
    peRatio: 38.5, 
    isMarketOpen: true, 
    lastUpdated: new Date().toISOString() 
  },
  { 
    symbol: 'JNJ', 
    name: 'Johnson & Johnson', 
    sector: 'Healthcare', 
    price: 165.40, 
    change: -1.10, 
    changePercent: -0.66, 
    volume: 7200000, 
    open: 166.80, 
    high: 167.20, 
    low: 164.50, 
    previousClose: 166.50, 
    marketCap: 430000000000, 
    peRatio: 17.2, 
    isMarketOpen: true, 
    lastUpdated: new Date().toISOString() 
  }
];

const TechStockAnalysis = () => {
  const [stocks, setStocks] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Simulate loading data
    setStocks(DUMMY_STOCKS);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setStocks([...DUMMY_STOCKS]); // reload dummy data
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  // Group stocks by sector
  const stocksBySector = useMemo(() => {
    return stocks.reduce((acc, stock) => {
      const sector = stock.sector || 'Other';
      if (!acc[sector]) {
        acc[sector] = [];
      }
      acc[sector].push(stock);
      return acc;
    }, {});
  }, [stocks]);

  // Calculate overall market status
  const marketStatus = useMemo(() => {
    const upCount = stocks.filter(s => s.change > 0).length;
    const downCount = stocks.filter(s => s.change < 0).length;
    const unchanged = stocks.length - upCount - downCount;
    
    return {
      up: upCount,
      down: downCount,
      unchanged,
      total: stocks.length,
      percentUp: Math.round((upCount / stocks.length) * 100) || 0
    };
  }, [stocks]);

  if (!stocks.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading tech stock data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with refresh and status */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tech Stock Analysis
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Real-time analysis of major technology stocks
            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
              (Updated: {lastUpdated.toLocaleTimeString()})
            </span>
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiRefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Market Overview */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Market Overview</h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-green-50 dark:bg-green-900/20 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <FiTrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-green-800 dark:text-green-200 truncate">
                        Advancing
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {marketStatus.up}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                          {marketStatus.percentUp}%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                    <FiTrendingDown className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-red-800 dark:text-red-200 truncate">
                        Declining
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {marketStatus.down}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <FiActivity className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-blue-800 dark:text-blue-200 truncate">
                        Total Tracked
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {marketStatus.total}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stocks by Sector */}
      {Object.entries(stocksBySector).map(([sector, sectorStocks]) => (
        <div key={sector} className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">{sector} Stocks</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sectorStocks.map((stock) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {stock.name}
                      </h3>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {stock.symbol}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                          {stock.symbol[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-baseline">
                      <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                        ${stock.price ? stock.price.toFixed(2) : 'N/A'}
                      </span>
                      <span 
                        className={`ml-2 text-sm font-medium ${
                          stock.change >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} 
                        ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Market Cap</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {stock.marketCap >= 1000000000 
                            ? `$${(stock.marketCap / 1000000000).toFixed(2)}B`
                            : stock.marketCap > 0
                              ? `$${(stock.marketCap / 1000000).toFixed(2)}M`
                              : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">P/E Ratio</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Volume</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {stock.volume >= 1000000 
                            ? `${(stock.volume / 1000000).toFixed(2)}M`
                            : stock.volume > 0
                              ? `${(stock.volume / 1000).toFixed(1)}K`
                              : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Day Range</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          ${stock.low.toFixed(2)} - ${stock.high.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        stock.isMarketOpen 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                      }`}>
                        {stock.isMarketOpen ? 'Market Open' : 'Market Closed'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Market Status and Disclaimer */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FiInfo className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Market Data Information
              </h3>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <p>
                  Data is provided for demonstration purposes. Stock prices and other market data are not in real-time.
                </p>
                <p>
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStockAnalysis;
