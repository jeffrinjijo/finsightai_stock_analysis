import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiInfo, 
  FiRefreshCw,
  FiChevronUp,
  FiChevronDown,
  FiDollarSign,
  FiBarChart2,
  FiClock,
  FiAlertTriangle,
  FiArrowUpRight,
  FiArrowDownRight,
  FiActivity
} from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
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
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { getHistoricalData } from '../api/stockApi';
import { formatCurrency, formatPercent } from '../utils/formatters';
import useTechnicalAnalysis from '../hooks/useTechnicalAnalysis';
import useRealTimeStocks from '../hooks/useRealTimeStocks';
import { calculateSMA, calculateEMA, calculateRSI } from '../utils/technicalAnalysis';

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
  TimeScale
);

// Helper function to format volume
const formatNumber = (num) => {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num?.toString() || '0';
};

// Helper component for indicator dots
const IndicatorDot = ({ color, label, value, format = (v) => v }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-3 h-3 rounded-full ${color}`}></div>
    <span className="text-sm text-gray-600 dark:text-gray-300">
      {label}: <span className="font-medium">{format(value)}</span>
    </span>
  </div>
);

const StockAnalysisCard = ({ stock: initialStock, index, onRefresh }) => {
  // ======================
  // State Hooks - Must be at the top and unconditional
  // ======================
  const [stock, setStock] = useState(initialStock || {});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showChart, setShowChart] = useState(true);
  const [timeRange, setTimeRange] = useState('1M');
  const chartRef = useRef(null);
  
  // Toggle chart visibility
  const toggleChart = useCallback(() => {
    setShowChart(prev => !prev);
  }, []);
  
  // Toggle details visibility
  const toggleDetails = useCallback(() => {
    setShowDetails(prev => !prev);
  }, []);
  
  const isPositive = useMemo(() => {
    if (stock.gainLossPct === undefined || stock.gainLossPct === null) return true;
    return stock.gainLossPct >= 0;
  }, [stock.gainLossPct]);

  // Fetch historical price data for the chart
  const { data: historicalData, isLoading: isHistoricalLoading } = useQuery({
    queryKey: ['historicalData', stock?.symbol, timeRange],
    queryFn: () => getHistoricalData(stock?.symbol, timeRange),
    enabled: !!stock?.symbol,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!historicalData?.prices || !Array.isArray(historicalData.prices) || historicalData.prices.length === 0) {
      return null;
    }
    
    // Process and sort prices by date
    const prices = [...historicalData.prices]
      .map(item => ({
        ...item,
        date: new Date(item.date).getTime(), // Convert date to timestamp for better sorting
        close: parseFloat(item.close)
      }))
      .sort((a, b) => a.date - b.date); // Ensure dates are in ascending order
    
    const labels = prices.map(item => item.date);
    const dataPoints = prices.map(item => item.close);
    
    // Calculate if the price is trending up or down
    const firstPrice = prices[0]?.close;
    const lastPrice = prices[prices.length - 1]?.close;
    const isPriceUp = lastPrice >= firstPrice;
    
    // Set chart colors based on price movement
    const chartColor = isPriceUp ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)';
    const gradientColor = isPriceUp 
      ? 'rgba(16, 185, 129, 0.2)' 
      : 'rgba(239, 68, 68, 0.2)';
    
    return {
      labels,
      datasets: [
        {
          label: 'Price',
          data: dataPoints,
          borderColor: chartColor,
          backgroundColor: (context) => {
            const { ctx, chart } = context;
            const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
            gradient.addColorStop(0, gradientColor);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            return gradient;
          },
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointBackgroundColor: chartColor,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderWidth: 2,
          pointHoverBorderColor: chartColor,
          borderJoinStyle: 'round',
        },
      ],
    };
  }, [historicalData]);

  // Chart options
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeRange === '1D' ? 'hour' : 'day',
          tooltipFormat: 'MMM d, yyyy h:mm a',
          displayFormats: {
            hour: 'ha',
            day: 'MMM d',
            week: 'MMM d',
            month: 'MMM yyyy',
          },
        },
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 6,
          autoSkip: true,
          autoSkipPadding: 10,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          callback: (value) => `$${value.toFixed(2)}`,
          maxTicksLimit: 6,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'nearest',
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleFont: { size: 12, weight: '600' },
        bodyFont: { size: 14, weight: '600' },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `Price: $${context.parsed.y.toFixed(2)}`;
          },
          title: (context) => {
            const date = new Date(context[0].label);
            return date.toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    elements: {
      line: {
        borderWidth: 2,
        tension: 0.4,
      },
      point: {
        radius: 0,
        hoverRadius: 4,
      },
    },
  }), [timeRange]);
  
  // ======================
  // Memoized Values
  // ======================
  const stockData = useMemo(() => ({
    ...initialStock,
    currentPrice: initialStock?.price || initialStock?.currentPrice || 0,
    gainLossPct: initialStock?.changePercent || initialStock?.gainLossPct || 0,
    volume: initialStock?.volume || 0,
    lastUpdated: initialStock?.lastUpdated || new Date().toISOString()
  }), [initialStock]);
  
  // ======================
  // Technical Analysis
  // ======================
  const priceHistory = useMemo(() => {
    const historicalData = initialStock?.historicalData || [];
    return historicalData
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(item => ({
        price: item.close || item.price || 0,
        volume: item.volume || 0,
        date: item.date || ''
      }))
      .filter(item => item.price > 0);
  }, [initialStock?.historicalData]);
  
  const {
    sma20,
    sma50,
    sma200,
    ema12,
    ema26,
    rsi,
    signals,
    performance,
    isLoading: isAnalyzing,
    error: analysisError,
    getLatestSignal,
    getLatestRSI,
    getMovingAverages
  } = useTechnicalAnalysis(priceHistory.map(item => item.price));
  
  // ======================
  // Derived State
  // ======================
  const latestSignal = useMemo(() => getLatestSignal?.() || { type: 'HOLD' }, [signals, getLatestSignal]);
  const latestRSI = useMemo(() => getLatestRSI?.() || null, [rsi, getLatestRSI]);
  const movingAverages = useMemo(
    () => getMovingAverages?.() || { sma20: [], sma50: [], sma200: [], ema12: [], ema26: [] }, 
    [sma20, sma50, sma200, ema12, ema26, getMovingAverages]
  );
  
  const trend = useMemo(() => {
    if (!sma20?.length || !sma50?.length) return 'Neutral';
    const lastSMA20 = sma20[sma20.length - 1];
    const lastSMA50 = sma50[sma50.length - 1];
    const lastSMA200 = sma200?.[sma200.length - 1] || 0;
    
    if (lastSMA20 > lastSMA50 && lastSMA50 > lastSMA200) return 'Strong Uptrend';
    if (lastSMA20 > lastSMA50) return 'Uptrend';
    if (lastSMA20 < lastSMA50 && lastSMA50 < lastSMA200) return 'Strong Downtrend';
    if (lastSMA20 < lastSMA50) return 'Downtrend';
    return 'Neutral';
  }, [sma20, sma50, sma200]);
  
  const rsiStatus = useMemo(() => {
    if (!latestRSI) return 'Neutral';
    if (latestRSI > 70) return 'Overbought';
    if (latestRSI < 30) return 'Oversold';
    return 'Neutral';
  }, [latestRSI]);


  
  // ======================
  // Effects
  // ======================
  useEffect(() => {
    if (!initialStock) return;
    
    // Only update if the stock data has actually changed
    const stockChanged = (
      initialStock.symbol !== stock.symbol ||
      initialStock.price !== stock.price ||
      initialStock.changePercent !== stock.changePercent ||
      initialStock.volume !== stock.volume
    );
    
    if (stockChanged) {
      const updatedStock = {
        ...initialStock,
        currentPrice: initialStock.price || initialStock.currentPrice || 0,
        gainLossPct: initialStock.changePercent || initialStock.gainLossPct || 0,
        volume: initialStock.volume || 0,
        technicals: {
          trend,
          rsi: latestRSI,
          rsiStatus,
          signal: latestSignal?.type || 'HOLD',
          movingAverages: {
            sma20: movingAverages.sma20,
            sma50: movingAverages.sma50,
            sma200: movingAverages.sma200 || [],
            ema12: movingAverages.ema12,
            ema26: movingAverages.ema26
          },
          performance
        },
        lastUpdated: initialStock.lastUpdated || new Date().toISOString()
      };
      
      setStock(prevStock => {
        // Only update if the new stock data is different from the current state
        return JSON.stringify(updatedStock) !== JSON.stringify(prevStock) ? updatedStock : prevStock;
      });
    }
    
    setIsLoading(false);
  }, [initialStock, trend, latestRSI, rsiStatus, latestSignal, movingAverages, performance, stock]);
  
  useEffect(() => {
    if (analysisError) {
      console.warn('Technical analysis error:', analysisError);
    }
  }, [analysisError]);
  
  // ======================
  // Callbacks
  // ======================
  const handleRefresh = useCallback(() => {
    if (onRefresh && initialStock?.symbol) {
      onRefresh(initialStock.symbol);
    }
  }, [onRefresh, initialStock?.symbol]);

  const getAnalysisSummary = useCallback(() => {
    if (isLoading || isAnalyzing) return 'Analyzing stock data...';
    if (analysisError) return 'Error in analysis';
    
    const signal = latestSignal?.type || 'HOLD';
    
    if (signal === 'BUY' && rsiStatus === 'Oversold') {
      return 'Strong Buy - Oversold condition with positive momentum';
    }
    
    if (signal === 'SELL' && rsiStatus === 'Overbought') {
      return 'Strong Sell - Overbought condition with negative momentum';
    }
    
    if (signal === 'BUY') return 'Buy - Bullish signals detected';
    if (signal === 'SELL') return 'Sell - Bearish signals detected';
    
    return 'Hold - Waiting for clearer signals';
  }, [isAnalyzing, isLoading, analysisError, latestSignal, rsiStatus]);

  // Error state
  if (error) {
    return (
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <div className="text-center py-4">
          <p className="text-red-500 font-semibold">Error loading {stock.symbol}</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  if (!stock) {
    return (
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <div className="text-center py-8">
          <p className="text-red-500 font-semibold">No stock data available</p>
        </div>
      </motion.div>
    );
  }

  const isNeutral = (stock.gainLossPct || 0) === 0;
  
  // Get technical analysis summary
  const getAnalysis = () => {
    if (isLoading || isAnalyzing) return 'Analyzing market data...';
    if (error) return 'Analysis unavailable';
    
    const { technicals } = stock;
    if (!technicals) return 'Technical data loading...';
    
    const trendStrength = technicals.trend?.includes('Strong') ? 'Strong ' : '';
    const trendDirection = technicals.trend?.replace('Strong ', '').toLowerCase() || 'neutral';
    const rsiStatus = technicals.rsiStatus || 'neutral';
    const signal = technicals.signal || 'HOLD';
    
    return (
      <div className="space-y-1">
        <div className="flex items-center">
          <span className="text-gray-500 dark:text-gray-400 mr-2">Trend:</span>
          <span className={`font-medium ${
            trendDirection.includes('up') ? 'text-green-600 dark:text-green-400' : 
            trendDirection.includes('down') ? 'text-red-600 dark:text-red-400' : 
            'text-yellow-600 dark:text-yellow-400'
          }`}>
            {trendStrength}{trendDirection}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-500 dark:text-gray-400 mr-2">RSI ({technicals.rsi ? technicals.rsi.toFixed(1) : '--'}):</span>
          <span className={`font-medium ${
            rsiStatus === 'Overbought' ? 'text-red-600 dark:text-red-400' : 
            rsiStatus === 'Oversold' ? 'text-green-600 dark:text-green-400' : 
            'text-yellow-600 dark:text-yellow-400'
          }`}>
            {rsiStatus}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-500 dark:text-gray-400 mr-2">Signal:</span>
          <span className={`font-medium ${
            signal === 'BUY' ? 'text-green-600 dark:text-green-400' : 
            signal === 'SELL' ? 'text-red-600 dark:text-red-400' : 
            'text-yellow-600 dark:text-yellow-400'
          }`}>
            {signal}
          </span>
        </div>
      </div>
    );
  };
  
  // Generate recommendation based on technical analysis
  const getRecommendation = () => {
    if (isLoading || isAnalyzing) return 'Analyzing...';
    if (error) return 'Recommendation unavailable';
    
    const { technicals } = stock;
    if (!technicals) return 'Loading technical data...';
    
    const { trend, rsiStatus, signal, movingAverages } = technicals;
    const currentPrice = stock.currentPrice || 0;
    
    // Base recommendation on multiple factors
    const isUptrend = trend?.includes('Uptrend');
    const isDowntrend = trend?.includes('Downtrend');
    const isOverbought = rsiStatus === 'Overbought';
    const isOversold = rsiStatus === 'Oversold';
    
    // Moving average analysis
    const priceVsSMA20 = movingAverages?.sma20 ? 
      (currentPrice - movingAverages.sma20) / movingAverages.sma20 * 100 : 0;
    const priceVsSMA50 = movingAverages?.sma50 ? 
      (currentPrice - movingAverages.sma50) / movingAverages.sma50 * 100 : 0;
    
    // Generate recommendation
    if (isUptrend && !isOverbought && signal === 'BUY' && priceVsSMA50 > -2) {
      return 'Strong Buy - Uptrend with positive momentum';
    } 
    
    if (isDowntrend || isOverbought) {
      if (signal === 'SELL') {
        return 'Strong Sell - Downtrend with negative momentum';
      }
      return 'Sell - Consider taking profits or cutting losses';
    }
    
    if (isOversold && signal === 'BUY') {
      return 'Buy - Oversold condition with buying signal';
    }
    
    if (priceVsSMA50 > 5) {
      return 'Take Profit - Price significantly above 50-day average';
    }
    
    if (priceVsSMA50 < -5) {
      return 'Potential Buy - Price significantly below 50-day average';
    }
    
    return 'Hold - Waiting for clearer signals';
  };

  // Handle error state
  if (error) {
    return (
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <div className="text-center py-4">
          <p className="text-red-500 font-semibold">Error loading {stock.symbol}</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex flex-col h-full">
        {/* Header with stock info and price */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start space-x-4">
            <div className="flex items-center space-x-4 min-w-0">
              <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${
                isPositive 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
              }`}>
                {isPositive ? <FiTrendingUp size={26} /> : <FiTrendingDown size={26} />}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-xl truncate">
                  {stock.symbol || 'N/A'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {stock.name || 'Loading...'}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <div className={`text-2xl font-bold ${
                isPositive 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              } whitespace-nowrap`}>
                {stock.currentPrice ? formatCurrency(stock.currentPrice) : 'N/A'}
              </div>
              <div className={`text-sm font-medium mt-1 ${
                isPositive 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              } whitespace-nowrap`}>
                {stock.gainLossPct !== undefined 
                  ? (
                      <span className="inline-flex items-center">
                        {isPositive ? (
                          <FiArrowUpRight className="mr-1 flex-shrink-0" size={16} />
                        ) : (
                          <FiArrowDownRight className="mr-1 flex-shrink-0" size={16} />
                        )}
                        {formatPercent(Math.abs(stock.gainLossPct) / 100)}
                      </span>
                    ) 
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      
      {/* Chart Toggle and Time Range Controls */}
      <div className="mt-3 px-6 pb-3">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleChart}
            className="text-sm px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all duration-200 flex items-center border border-gray-100 dark:border-gray-600"
          >
            {showChart ? (
              <>
                <FiChevronUp className="mr-2" size={16} />
                Hide Chart
              </>
            ) : (
              <>
                <FiChevronDown className="mr-2" size={16} />
                Show Chart
              </>
            )}
          </button>
          
          {showChart && (
            <div className="flex space-x-1.5 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-1 border border-gray-100 dark:border-gray-600">
              {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range === 'ALL' ? '5Y' : range)}
                  className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                    timeRange === (range === 'ALL' ? '5Y' : range)
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400 font-medium border border-gray-200 dark:border-gray-500'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600/50'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Price Chart */}
      {showChart && (
        <div className="px-6 pb-5 -mt-1">
          <div className="h-56 relative bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
            {isHistoricalLoading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Loading chart...</div>
              </div>
            ) : chartData ? (
              <Line
                ref={chartRef}
                data={chartData}
                options={{
                  ...chartOptions,
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawBorder: false
                      },
                      ticks: {
                        color: '#6B7280',
                        font: {
                          size: 10
                        }
                      }
                    },
                    y: {
                      grid: {
                        color: '#E5E7EB',
                        borderDash: [4, 4],
                        drawBorder: false
                      },
                      ticks: {
                        color: '#6B7280',
                        font: {
                          size: 10
                        },
                        padding: 5,
                        callback: (value) => `$${value}`
                      }
                    }
                  }
                }}
                className="w-full h-full"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm space-y-2">
                <FiBarChart2 size={24} />
                <p>No chart data available</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="p-6 space-y-5 flex-1">
        <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700/50">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center text-base font-semibold text-gray-800 dark:text-gray-100">
              <FiBarChart2 className="mr-3 text-blue-500" size={18} />
              Technical Analysis
            </div>
            <button 
              onClick={toggleDetails}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center"
            >
              {showDetails ? (
                <>
                  <FiChevronUp className="mr-1" size={16} />
                  Hide Details
                </>
              ) : (
                <>
                  <FiChevronDown className="mr-1" size={16} />
                  Show Details
                </>
              )}
            </button>
          </div>
          
          <div className="space-y-3 text-gray-700 dark:text-gray-200 leading-relaxed">
            {getAnalysis()}
          </div>
          
          {/* Detailed Analysis */}
          {showDetails && stock.technicals?.movingAverages && (
            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Moving Averages</h4>
                  <div className="space-y-2">
                    <IndicatorDot 
                      color="bg-blue-500" 
                      label="SMA 20" 
                      value={stock.technicals.movingAverages.sma20} 
                      format={v => v ? formatCurrency(v) : 'N/A'}
                    />
                    <IndicatorDot 
                      color="bg-purple-500" 
                      label="SMA 50" 
                      value={stock.technicals.movingAverages.sma50} 
                      format={v => v ? formatCurrency(v) : 'N/A'}
                    />
                    <IndicatorDot 
                      color="bg-pink-500" 
                      label="SMA 200" 
                      value={stock.technicals.movingAverages.sma200} 
                      format={v => v ? formatCurrency(v) : 'N/A'}
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Indicators</h4>
                  <div className="space-y-2">
                    <IndicatorDot 
                      color={stock.technicals.rsiStatus === 'Overbought' ? 'bg-red-500' : 
                            stock.technicals.rsiStatus === 'Oversold' ? 'bg-green-500' : 'bg-yellow-500'} 
                      label="RSI (14)" 
                      value={stock.technicals.rsi} 
                      format={v => v ? v.toFixed(1) : 'N/A'}
                    />
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                        style={{ width: '100%' }}
                      >
                        {stock.technicals.rsi && (
                          <div 
                            className="h-full w-1 bg-black dark:bg-white absolute"
                            style={{ 
                              left: `${Math.min(100, Math.max(0, stock.technicals.rsi))}%`,
                              transform: 'translateX(-50%)'
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>0</span>
                      <span>30</span>
                      <span>50</span>
                      <span>70</span>
                      <span>100</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {stock.technicals.performance && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Performance</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      <div className="text-gray-500 dark:text-gray-400">Win Rate</div>
                      <div className="font-medium">{stock.technicals.performance.winRate}</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      <div className="text-gray-500 dark:text-gray-400">Total Return</div>
                      <div className={`font-medium ${
                        stock.technicals.performance.totalReturn?.includes('-') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                      }`}>
                        {stock.technicals.performance.totalReturn || 'N/A'}
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      <div className="text-gray-500 dark:text-gray-400">Trades</div>
                      <div className="font-medium">{stock.technicals.performance.totalTrades || 0}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Recommendation Card */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3 mt-0.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <FiInfo className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {getRecommendation()}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Based on technical indicators and price action
              </p>
            </div>
          </div>
        </div>
        
        {/* Volume and Price Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <FiBarChart2 className="mr-1.5" />
              <span>Volume</span>
            </div>
            <div className="font-medium text-gray-900 dark:text-white mt-1">
              {stock.volume ? formatNumber(stock.volume) : 'N/A'}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="text-gray-500 dark:text-gray-400">Avg Price</div>
            <div className="font-medium text-gray-900 dark:text-white mt-1">
              {stock.avgPrice ? formatCurrency(stock.avgPrice) : 'N/A'}
              {stock.avgPrice && stock.currentPrice && (
                <span className={`ml-2 text-xs ${
                  stock.currentPrice >= stock.avgPrice ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatPercent((stock.currentPrice - stock.avgPrice) / stock.avgPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with last updated time */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center mt-auto">
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
        <button 
          onClick={() => onRefresh && onRefresh(stock.symbol)}
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center"
        >
          <FiRefreshCw className="mr-1" size={12} />
          Refresh
        </button>
      </div>
    </div>
  </motion.div>
);
};

const StockAnalysis = ({ stocks: initialStocks, isLoading: initialLoading = false, title = 'Stock Analysis' }) => {
  const symbols = useMemo(() => {
    if (!initialStocks) return [];
    const stockArray = Array.isArray(initialStocks) ? initialStocks : Object.values(initialStocks);
    return stockArray
      .map(s => s.symbol || s.ticker)
      .filter(Boolean);
  }, [initialStocks]);
  // ...
  // Use real-time stocks hook
  const { 
    stocks: realTimeStocks, 
    loading: realTimeLoading, 
    error: realTimeError, 
    refresh: refreshStockData 
  } = useRealTimeStocks(symbols);
  
  // Merge real-time data with initial stock data
  const allStocks = useMemo(() => {
    if (!initialStocks) return [];
    
    const initialStocksArray = Array.isArray(initialStocks) 
      ? [...initialStocks] 
      : Object.values(initialStocks);
    
    // If no real-time data yet, return initial stocks
    if (!realTimeStocks || Object.keys(realTimeStocks).length === 0) {
      return initialStocksArray;
    }
    
    // Merge real-time data with initial stocks
    return initialStocksArray.map(stock => {
      const symbol = stock.symbol || stock.ticker;
      const realTimeData = realTimeStocks[symbol];
      
      if (!realTimeData) return stock;
      
      return {
        ...stock,
        currentPrice: realTimeData.price || stock.currentPrice || stock.price,
        change: realTimeData.change || stock.change,
        changePercent: realTimeData.changePercent || stock.changePercent,
        volume: realTimeData.volume || stock.volume,
        lastUpdated: realTimeData.lastUpdated || stock.lastUpdated || new Date().toISOString(),
        // Preserve any existing technical data
        technicals: stock.technicals || {}
      };
    });
  }, [initialStocks, realTimeStocks]);
  
  // Handle refresh for a specific stock
  const handleRefreshStock = useCallback((symbol) => {
    if (symbol) {
      refreshStockData([symbol]);
    }
  }, [refreshStockData]);
  
  // Loading state
  const isLoading = initialLoading || realTimeLoading;
  const error = realTimeError;
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
              <div className="flex justify-between">
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiAlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Error loading stock data
            </h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{error.message || 'Failed to load stock data. Please try again later.'}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="rounded-md bg-red-50 dark:bg-red-900/30 px-2 py-1.5 text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50 dark:focus:ring-offset-red-900/10"
                onClick={() => refreshStockData(symbols)}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render empty state
  if (!allStocks || allStocks.length === 0) {
    return (
      <div className="text-center py-12">
        <FiBarChart2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No stocks to analyze</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add some stocks to your portfolio or watchlist to see analysis.
        </p>
      </div>
    );
  }
  
  // Render stock analysis cards
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => refreshStockData(symbols)}
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Refresh all stocks"
            disabled={realTimeLoading}
          >
            <FiRefreshCw className={`w-4 h-4 ${realTimeLoading ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {allStocks.length} {allStocks.length === 1 ? 'stock' : 'stocks'} analyzed
          </span>
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {allStocks.map((stock, index) => (
          <StockAnalysisCard 
            key={`${stock.symbol || stock.ticker}-${index}`}
            stock={stock}
            index={index}
            onRefresh={handleRefreshStock}
          />
        ))}
      </div>
      
      <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
        <p>Analysis is based on technical indicators including moving averages and RSI.</p>
        <p className="mt-1">
          Data updates in real-time. 
          {allStocks[0]?.lastUpdated && (
            <span>Last updated: {new Date(allStocks[0].lastUpdated).toLocaleTimeString()}</span>
          )}
        </p>
        {realTimeError && (
          <p className="mt-1 text-red-500 dark:text-red-400">
            Some data may be delayed. {realTimeError}
          </p>
        )}
      </div>
    </div>
  );
};

export default StockAnalysis;
