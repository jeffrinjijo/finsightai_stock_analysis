import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  FiRefreshCw, 
  FiAlertCircle, 
  FiInfo,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity
} from 'react-icons/fi';
import { getQuote, getCompanyOverview } from '../utils/fmpApi';

// Default stock data for major tech companies
const DEFAULT_TECH_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc. (Google)', sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical' },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical' }
];

async function fetchStockData(symbol, retryCount = 0) {
  const MAX_RETRIES = 2;
  
  try {
    console.log(`[${new Date().toISOString()}] Fetching data for ${symbol} (attempt ${retryCount + 1})`);
    
    const [quote, overview] = await Promise.all([
      getQuote(symbol).catch(err => {
        console.warn(`[${new Date().toISOString()}] Failed to fetch quote for ${symbol}:`, err.message);
        return null;
      }),
      getCompanyOverview(symbol).catch(err => {
        console.warn(`[${new Date().toISOString()}] Failed to fetch overview for ${symbol}:`, err.message);
        return null;
      })
    ]);

    console.log(`[${new Date().toISOString()}] API Response for ${symbol}:`, { 
      quote: quote ? 'Received' : 'Missing', 
      overview: overview ? 'Received' : 'Missing' 
    });

    // If we got rate limited and have retries left, try again after a delay
    if ((!quote || !overview) && retryCount < MAX_RETRIES) {
      const delay = 1000 * (retryCount + 1);
      console.log(`[${new Date().toISOString()}] Retrying ${symbol} (${retryCount + 1}/${MAX_RETRIES}) in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchStockData(symbol, retryCount + 1);
    }

    // If we still don't have data after retries, return error
    if (!quote || !overview) {
      const error = new Error(`Failed to fetch complete data for ${symbol}`);
      error.details = { quote: !!quote, overview: !!overview };
      throw error;
    }

    const result = {
      symbol,
      name: overview?.companyName || overview?.name || symbol,
      price: parseFloat(quote?.price) || 0,
      change: parseFloat(quote?.change) || 0,
      changePercent: parseFloat(quote?.changesPercentage) || 0,
      volume: parseInt(quote?.volume) || 0,
      open: parseFloat(quote?.open) || 0,
      high: parseFloat(quote?.dayHigh) || 0,
      low: parseFloat(quote?.dayLow) || 0,
      previousClose: parseFloat(quote?.previousClose) || 0,
      marketCap: overview?.mktCap ? parseInt(overview.mktCap) : 0,
      peRatio: parseFloat(overview?.pe) || 0,
      sector: overview?.sector || 'Technology',
      lastUpdated: new Date().toISOString(),
      isMarketOpen: quote?.isMarketOpen || false,
      rawData: { quote, overview } // For debugging
    };

    console.log(`[${new Date().toISOString()}] Successfully processed data for ${symbol}:`, {
      price: result.price,
      change: result.change,
      marketCap: result.marketCap,
      peRatio: result.peRatio
    });
    
    return result;
  } catch (error) {
    console.error(`Error in fetchStockData for ${symbol}:`, error);
    return {
      symbol,
      name: symbol,
      price: 0,
      change: 0,
      changePercent: 0,
      volume: 0,
      error: `Failed to load data for ${symbol}`,
      lastUpdated: new Date().toISOString()
    };
  }
}

const TechStockAnalysis = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch data for all tech stocks in parallel with better error handling
  const { data: stocks = [], isLoading, error, refetch } = useQuery({
    queryKey: ['techStocks', 'major-tech'],
    queryFn: async () => {
      console.log('Fetching stock data...');
      setIsRefreshing(true);
      try {
        const results = await Promise.all(
          DEFAULT_TECH_STOCKS.map(async (stock) => {
            try {
              const data = await fetchStockData(stock.symbol);
              console.log(`Fetched ${stock.symbol}:`, data);
              return data;
            } catch (err) {
              console.error(`Error fetching ${stock.symbol}:`, err);
              return {
                ...stock,
                error: `Failed to load ${stock.symbol} data`,
                lastUpdated: new Date().toISOString()
              };
            }
          })
        );
        setLastUpdated(new Date());
        return results;
      } catch (error) {
        console.error('Error in stock data query:', error);
        throw error;
      } finally {
        setIsRefreshing(false);
      }
    },
    refetchInterval: 300000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 60000, // 1 minute
    cacheTime: 300000, // 5 minutes
    retry: 3,
    retryDelay: 1000
  });

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refetch();
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setIsRefreshing(false);
    }
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

  if (isLoading && !stocks.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading tech stock data...</p>
      </div>
    );
  }

  if (error && !stocks.length) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-lg border border-red-100 dark:border-red-900/50 text-center">
        <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-red-800 dark:text-red-200">Error Loading Data</h3>
        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
          Failed to load stock data. Please check your internet connection and try again.
        </p>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRefreshing ? 'Refreshing...' : 'Retry'}
        </button>
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
            {lastUpdated && (
              <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                (Updated: {lastUpdated.toLocaleTimeString()})
              </span>
            )}
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
                      {typeof stock.change === 'number' && typeof stock.changePercent === 'number' && (
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
                      )}
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
                          {stock.low && stock.high 
                            ? `$${(stock.low || 0).toFixed(2)} - $${(stock.high || 0).toFixed(2)}`
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    {stock.isMarketOpen !== undefined && (
                      <div className="mt-3 text-xs">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          stock.isMarketOpen 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                        }`}>
                          {stock.isMarketOpen ? 'Market Open' : 'Market Closed'}
                        </span>
                      </div>
                    )}
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
                  Data is provided by Financial Modeling Prep API and is delayed by up to 15 minutes.
                  Stock prices and other market data may not be in real-time.
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
