import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiDollarSign, 
  FiPieChart, 
  FiAlertCircle, 
  FiRefreshCw,
  FiSearch,
  FiBarChart2,
  FiBell,
  FiSettings,
  FiPlus,
  FiClock,
  FiCalendar,
  FiLayers,
  FiDollarSign as FiDollarIcon,
  FiPercent,
  FiLoader,
  FiStar,
  FiArrowUp,
  FiArrowDown,
  FiActivity,
  FiList,
  FiPocket,
  FiTrendingUp as FiTrendingUpIcon,
  FiDollarSign as FiDollarSignIcon,
  FiPieChart as FiPieChartIcon,
  FiAlertTriangle,
  FiExternalLink
} from 'react-icons/fi';

// Charting
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  TimeSeriesScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// API
import stockApi from '../api/stockApi';
import watchlistApi from '../api/watchlistApi';

// Components
import WelcomeBanner from "../components/WelcomeBanner";
import PerformanceOverview from "../components/PerformanceOverview";
import FinancialNews from "../components/FinancialNews";
import StockSearch from "../components/StockSearch";
import MarketHeatmap from "../components/MarketHeatmap";
import PositionSizeCalculator from "../components/PositionSizeCalculator";
import RealTimeQuotes from "../components/RealTimeQuotes";
import PortfolioPerformance from "../components/PortfolioPerformance";
import TradingInterface from "../components/TradingInterface";
import StockScreener from "../components/StockScreener";
import AnalysisCharts from "../components/AnalysisCharts";

// Utils
import { formatCurrency } from "../utils/formatters";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  TimeSeriesScale
);

// Default chart options
const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 12 },
      bodyFont: { size: 12 },
      padding: 10,
      displayColors: false,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 8,
        font: {
          size: 10
        }
      }
    },
    y: {
      grid: {
        color: (context) => {
          if (context.tick.value === 0) {
            return '#9CA3AF';
          }
          return 'rgba(156, 163, 175, 0.1)';
        },
        borderDash: [3, 3],
        drawBorder: false
      },
      ticks: {
        font: {
          size: 10
        },
        callback: function(value) {
          return '$' + value.toLocaleString();
        }
      }
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  }
};

const REFRESH_INTERVAL = 30000; // 30 seconds

// Default watchlist symbols for demo purposes
const DEFAULT_WATCHLIST = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'V', 'WMT'];

const Dashboard = () => {
  const navigate = useNavigate();
  const refreshInterval = useRef(null);
  
  // State
  const [stocks, setStocks] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // Default to overview tab
  const [timeFrame, setTimeFrame] = useState('1M');
  const [showAddStock, setShowAddStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [marketData, setMarketData] = useState(null);
  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // WebSocket connection
  const ws = useRef(null);
  
  // Chart data for portfolio performance
  const chartData = useMemo(() => {
    if (!portfolioHistory.length) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Portfolio Value',
            data: [],
            borderColor: '#4F46E5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointBackgroundColor: '#4F46E5',
            pointHoverBackgroundColor: '#4F46E5',
          },
        ],
      };
    }
    
    return {
      labels: portfolioHistory.map(item => new Date(item.date)),
      datasets: [
        {
          label: 'Portfolio Value',
          data: portfolioHistory.map(item => item.value),
          borderColor: portfolioHistory[portfolioHistory.length - 1].value >= portfolioHistory[0].value 
            ? '#10B981' 
            : '#EF4444',
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, portfolioHistory[portfolioHistory.length - 1].value >= portfolioHistory[0].value 
              ? 'rgba(16, 185, 129, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            return gradient;
          },
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointBackgroundColor: portfolioHistory[portfolioHistory.length - 1].value >= portfolioHistory[0].value 
            ? '#10B981' 
            : '#EF4444',
          pointHoverBackgroundColor: portfolioHistory[portfolioHistory.length - 1].value >= portfolioHistory[0].value 
            ? '#10B981' 
            : '#EF4444',
        },
      ],
    };
  }, [portfolioHistory]);
  
  // Chart options with time scale
  const chartOptions = useMemo(() => ({
    ...defaultChartOptions,
    scales: {
      ...defaultChartOptions.scales,
      x: {
        ...defaultChartOptions.scales.x,
        type: 'time',
        time: {
          unit: timeFrame === '1D' ? 'hour' : 
                timeFrame === '1W' ? 'day' :
                timeFrame === '1M' ? 'week' :
                timeFrame === '3M' ? 'month' : 'month',
          tooltipFormat: 'PPpp',
          displayFormats: {
            hour: 'ha',
            day: 'MMM d',
            week: 'MMM d',
            month: 'MMM yyyy'
          }
        },
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
          font: {
            size: 10
          }
        }
      },
      y: {
        ...defaultChartOptions.scales.y,
        position: 'right',
        grid: {
          color: (context) => {
            if (context.tick.value === 0) {
              return '#9CA3AF';
            }
            return 'rgba(156, 163, 175, 0.1)';
          },
          borderDash: [3, 3],
          drawBorder: false
        },
        ticks: {
          font: {
            size: 10
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    },
    plugins: {
      ...defaultChartOptions.plugins,
      tooltip: {
        ...defaultChartOptions.plugins.tooltip,
        callbacks: {
          ...defaultChartOptions.plugins.tooltip.callbacks,
          title: function(context) {
            const date = new Date(context[0].label);
            return date.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          }
        }
      }
    }
  }), [timeFrame]);

  // Calculate portfolio metrics based on watchlist
  const portfolioValue = useMemo(() => 
    stocks.reduce((sum, stock) => sum + (stock.price || 0) * 10, 0), 
    [stocks]
  );
  
  const dayChange = useMemo(() => 
    stocks.reduce((sum, stock) => sum + (stock.change || 0) * 10, 0),
    [stocks]
  );
  
  const dayChangePercent = useMemo(() => 
    portfolioValue > 0 ? (dayChange / (portfolioValue - dayChange)) * 100 : 0,
    [portfolioValue, dayChange]
  );

  const keyMetrics = useMemo(() => ({
    portfolioValue,
    dayChange,
    dayChangePercent,
    positions: stocks.length,
    winRate: Math.round((stocks.filter(s => s.change > 0).length / (stocks.length || 1)) * 100) || 0,
    avgReturn: stocks.length ? stocks.reduce((sum, stock) => sum + (stock.changePercent || 0), 0) / stocks.length : 0,
    totalReturn: stocks.reduce((sum, stock) => sum + (stock.change || 0) * 10, 0)
  }), [portfolioValue, dayChange, dayChangePercent, stocks]);

  // Fetch watchlist data
  const fetchWatchlist = useCallback(async () => {
    try {
      setIsWatchlistLoading(true);
      const watchlistData = await watchlistApi.getWatchlist();
      
      if (watchlistData && watchlistData.symbols && watchlistData.symbols.length > 0) {
        const stocksData = await watchlistApi.getWatchlistStocksData(watchlistData.symbols);
        setWatchlist(stocksData);
        
        // Simulate portfolio history data based on watchlist
        if (stocksData.length > 0) {
          const history = [];
          const now = new Date();
          let baseValue = 10000; // Starting portfolio value
          
          // Generate 30 days of historical data
          for (let i = 30; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            // Simulate daily change between -2% and +2%
            const dailyChange = (Math.random() * 0.04 - 0.02) * baseValue;
            baseValue += dailyChange;
            
            history.push({
              date: date.toISOString(),
              value: Math.max(5000, baseValue) // Ensure value doesn't go below 5000
            });
          }
          
          setPortfolioHistory(history);
        }
      } else {
        const defaultWatchlistData = await stockApi.getBatchQuotes(DEFAULT_WATCHLIST);
        setWatchlist(defaultWatchlistData);
      }
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      try {
        const defaultWatchlistData = await stockApi.getBatchQuotes(DEFAULT_WATCHLIST);
        setWatchlist(defaultWatchlistData);
      } catch (fallbackErr) {
        console.error('Error fetching default watchlist:', fallbackErr);
        setError('Failed to load watchlist data.');
      }
    } finally {
      setIsWatchlistLoading(false);
      setLastUpdated(new Date());
    }
  }, []);
  
  // Handle refresh
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      await fetchWatchlist();
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchWatchlist, isRefreshing]);
  
  // Initialize WebSocket connection
  useEffect(() => {
    // In a real app, you would connect to your WebSocket server here
    // For this example, we'll simulate a WebSocket connection
    const simulateWebSocket = () => {
      // Simulate connection
      setIsConnected(true);
      
      // Simulate receiving market data updates
      const interval = setInterval(() => {
        if (watchlist.length > 0) {
          const updatedWatchlist = watchlist.map(stock => {
            const change = (Math.random() * 2 - 1) * 5; // Random change between -5 and +5
            const newPrice = Math.max(0.01, (stock.price || 100) * (1 + change / 100));
            
            return {
              ...stock,
              price: parseFloat(newPrice.toFixed(2)),
              change: parseFloat((newPrice - (stock.price || 100) + (stock.change || 0)).toFixed(2)),
              changePercent: parseFloat((((newPrice - (stock.price || 100)) / (stock.price || 100)) * 100).toFixed(2))
            };
          });
          
          setWatchlist(updatedWatchlist);
          
          // Update portfolio history with latest value
          if (portfolioHistory.length > 0) {
            const lastValue = portfolioHistory[portfolioHistory.length - 1].value;
            const newValue = lastValue * (1 + (Math.random() * 0.004 - 0.002)); // Small random change
            
            setPortfolioHistory(prev => [
              ...prev.slice(1), // Remove oldest data point
              {
                date: new Date().toISOString(),
                value: parseFloat(newValue.toFixed(2))
              }
            ]);
          }
          
          setLastUpdated(new Date());
        }
      }, 5000); // Update every 5 seconds
      
      return () => clearInterval(interval);
    };
    
    // Initialize WebSocket simulation
    const cleanup = simulateWebSocket();
    
    // Cleanup function
    return () => {
      if (cleanup) cleanup();
      setIsConnected(false);
    };
  }, [watchlist, portfolioHistory]);
  
  // Initial data fetch
  useEffect(() => {
    fetchWatchlist();
    
    // Set up auto-refresh
    const interval = setInterval(fetchWatchlist, 5 * 60 * 1000); // Refresh every 5 minutes
    
    return () => clearInterval(interval);
  }, [fetchWatchlist]);

  // Add stock to watchlist
  const handleAddToWatchlist = useCallback(async (symbol) => {
    try {
      await watchlistApi.addToWatchlist(symbol);
      await fetchWatchlist();
      setShowAddStock(false);
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      setError('Failed to add stock to watchlist.');
    }
  }, [fetchWatchlist]);

  // Remove stock from watchlist
  const handleRemoveFromWatchlist = useCallback(async (symbol) => {
    try {
      await watchlistApi.removeFromWatchlist(symbol);
      await fetchWatchlist();
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      setError('Failed to remove stock from watchlist.');
    }
  }, [fetchWatchlist]);

  // Handle trade execution
  const handleExecuteTrade = async (order) => {
    console.log('Executing trade:', order);
    // Here you would typically send the order to your backend API
    // For now, we'll just log it to the console
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Trade executed:', order);
        resolve();
      }, 1000);
    });
  };

  // Tabs configuration
  const tabs = [
    { id: 'overview', name: 'Overview', icon: <FiBarChart2 className="mr-2" /> },
    { id: 'watchlist', name: 'Watchlist', icon: <FiStar className="mr-2" /> },
    { id: 'screener', name: 'Screener', icon: <FiSearch className="mr-2" /> },
    { id: 'trading', name: 'Trading', icon: <FiActivity className="mr-2" /> },
    { id: 'analysis', name: 'Analysis', icon: <FiPieChart className="mr-2" /> },
  ];
  
  // Time frames for charts
  const timeFrames = [
    { id: '1d', name: '1D' },
    { id: '1w', name: '1W' },
    { id: '1m', name: '1M' },
    { id: '3m', name: '3M' },
    { id: '1y', name: '1Y' },
    { id: 'all', name: 'ALL' },
  ];

  // Handle stock selection
  const handleStockSelect = (symbol) => {
    navigate(`/stock/${symbol}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Finsight AI</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                Beta
              </span>
              <div className="flex items-center ml-2">
                <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} mr-1`}></span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`}
                title="Refresh data"
              >
                <FiRefreshCw className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setShowCalculator(!showCalculator)}
                className="hidden md:flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800 transition-colors duration-200"
              >
                <FiDollarSign className="mr-1.5 h-4 w-4" />
                Position Calculator
              </button>
              <div className="relative">
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 relative"
                  onClick={() => {}}
                >
                  <FiBell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
              </div>
              <button 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                onClick={() => {}}
              >
                <FiSettings className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-3">
            <StockSearch 
              value={searchQuery}
              onChange={setSearchQuery}
              onSelect={handleStockSelect}
              placeholder="Search stocks, ETFs, or cryptocurrencies..."
            />
          </div>
          
          {/* Portfolio Summary */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-800/50 mr-3">
                  <FiDollarSignIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Portfolio Value</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(portfolioValue)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-50 dark:bg-green-900/20 mr-3">
                  <FiTrendingUpIcon className={`h-5 w-5 ${dayChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Today's Change</p>
                  <p className={`text-lg font-semibold ${dayChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {dayChange >= 0 ? '+' : ''}{formatCurrency(dayChange)} ({dayChangePercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 mr-3">
                  <FiPieChartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Positions</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {watchlist.length} {watchlist.length === 1 ? 'Asset' : 'Assets'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Time Frame Selector */}
          <div className="flex items-center justify-between mt-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
              {timeFrames.map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setTimeFrame(tf.id)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                    timeFrame === tf.id
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  {tf.name}
                </button>
              ))}
            </div>
            
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <FiClock className="mr-1.5 h-3.5 w-3.5" />
              <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
          
          {/* Main Navigation Tabs */}
          <nav className="mt-2 -mb-px flex space-x-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Position Calculator Popup */}
        <AnimatePresence>
          {showCalculator && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 z-20 w-full max-w-md"
            >
              <PositionSizeCalculator />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none"
                    onClick={() => setError(null)}
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Welcome Banner */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <WelcomeBanner userName="User" />
              </div>
              
              {/* Portfolio Performance Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 pb-2">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Portfolio Performance</h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {timeFrame === '1D' ? 'Today' : 
                         timeFrame === '1W' ? 'This Week' : 
                         timeFrame === '1M' ? 'This Month' : 
                         timeFrame === '3M' ? 'Last 3 Months' : 'All Time'}
                      </span>
                      <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                        title="Refresh data"
                      >
                        <FiRefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="h-80">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                  
                  <div className="mt-4 flex flex-wrap items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-indigo-500 mr-1.5"></span>
                        <span>Portfolio Value</span>
                      </div>
                      {portfolioHistory.length > 1 && (
                        <div className="flex items-center">
                          <span className={`mr-1 ${portfolioHistory[portfolioHistory.length - 1].value >= portfolioHistory[0].value ? 'text-green-500' : 'text-red-500'}`}>
                            {portfolioHistory[portfolioHistory.length - 1].value >= portfolioHistory[0].value ? '↑' : '↓'}
                          </span>
                          <span className={portfolioHistory[portfolioHistory.length - 1].value >= portfolioHistory[0].value ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {((portfolioHistory[portfolioHistory.length - 1].value - portfolioHistory[0].value) / portfolioHistory[0].value * 100).toFixed(2)}%
                          </span>
                          <span className="ml-1 text-gray-500 dark:text-gray-400">
                            (${(portfolioHistory[portfolioHistory.length - 1].value - portfolioHistory[0].value).toFixed(2)})
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Portfolio Overview</h2>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                      ${formatCurrency(portfolioValue)}
                    </button>
                    <span className={`flex items-center text-sm ${
                      dayChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {dayChange >= 0 ? '↑' : '↓'} {formatCurrency(Math.abs(dayChange))} ({dayChangePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Positions', value: keyMetrics.positions, icon: <FiLayers className="h-5 w-5 text-indigo-500" /> },
                    { label: 'Win Rate', value: `${keyMetrics.winRate}%`, icon: <FiTrendingUp className="h-5 w-5 text-green-500" /> },
                    { label: 'Avg. Return', value: `${keyMetrics.avgReturn.toFixed(2)}%`, icon: <FiPercent className="h-5 w-5 text-blue-500" /> },
                    { label: 'Total Return', value: formatCurrency(keyMetrics.totalReturn), icon: <FiDollarIcon className="h-5 w-5 text-purple-500" /> },
                  ].map((metric, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 mr-3">
                          {metric.icon}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{metric.label}</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{metric.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Market Heatmap</h2>
                  <MarketHeatmap />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Market News</h2>
                  <FinancialNews />
                </div>
              </div>
            </>
          )}

          {/* Watchlist Tab */}
          {activeTab === 'watchlist' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">My Watchlist</h2>
                <button 
                  onClick={() => setShowAddStock(!showAddStock)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiPlus className="-ml-0.5 mr-1.5 h-4 w-4" />
                  {showAddStock ? 'Cancel' : 'Add Stock'}
                </button>
              </div>
              
              {showAddStock && (
                <div className="mb-6">
                  <StockSearch 
                    onSelect={handleAddToWatchlist}
                    placeholder="Search for a stock to add to your watchlist..."
                  />
                </div>
              )}

              {isWatchlistLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : watchlist.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Symbol</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Change</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">% Change</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Volume</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {watchlist.map((stock) => (
                        <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {stock.symbol}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              ${stock.price?.toFixed(2) || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${(stock.change || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2) || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${(stock.changePercent || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent?.toFixed(2) || 'N/A'}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {stock.volume?.toLocaleString() || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleRemoveFromWatchlist(stock.symbol)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiStar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No stocks in watchlist</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Get started by adding stocks to your watchlist.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowAddStock(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                      Add Stock
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Screener Tab */}
          {activeTab === 'screener' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <StockScreener />
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <AnalysisCharts />
            </div>
          )}

          {/* Trading Tab */}
          {activeTab === 'trading' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <TradingInterface />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
