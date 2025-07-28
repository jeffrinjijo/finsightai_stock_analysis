import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeBanner from "../components/WelcomeBanner";
import QuickActions from "../components/QuickActions";
import KeyMetrics from "../components/KeyMetrics";
import FomoStocks from "../components/FomoStocks";
import SimulationBanner from "../components/SimulationBanner";
import ChartsSection from "../components/ChartsSection";
import CommunityLeaderboard from "../components/CommunityLeaderboard";
import StockSearch from "../components/StockSearch";
import StockAnalysis from "../components/StockAnalysis";
import StockData from "../components/StockData";
import PerformanceOverview from "../components/PerformanceOverview";
import StockWatchlist from "../components/StockWatchlist";
import FinancialNews from "../components/FinancialNews";
import Chatbot from "../components/Chatbot";
import { formatPercent } from "../utils/formatters";
import usePortfolioData from "../hooks/usePortfolioData";

// Default stocks to show in the dashboard
const DEFAULT_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'];

// Helper component to manage stock selection
const StockSelector = ({ stocks, selectedStocks, onSelectStock }) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {stocks.map((symbol) => (
      <button
        key={symbol}
        onClick={() => onSelectStock(symbol)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          selectedStocks.includes(symbol)
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        {symbol}
      </button>
    ))}
  </div>
);

function Dashboard() {
  const navigate = useNavigate();
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState(['AAPL', 'MSFT', 'GOOGL']);
  
  // Use the shared portfolio data hook
  const {
    portfolioValue,
    weeklyReturn,
    winRate,
    totalTrades,
    activeGoals,
    stocks: portfolioStocks,
    isLoading: isPortfolioLoading,
    error: portfolioError,
    refreshPortfolio
  } = usePortfolioData();
  
  // Transform stocks data for the FOMO stocks and StockAnalysis components
  const { stocksData, popularStocksData } = React.useMemo(() => {
    if (!portfolioStocks || !Array.isArray(portfolioStocks)) {
      return { stocksData: {}, popularStocksData: [] };
    }
    
    const stocks = {};
    const popularStocks = [];
    
    portfolioStocks.forEach(stock => {
      if (stock && stock.symbol) {
        const stockData = {
          symbol: stock.symbol,
          name: stock.name || stock.symbol,
          currentPrice: stock.currentPrice || 0,
          dailyChange: stock.dailyChange || 0,
          volume: stock.volume || 0,
          previousClose: stock.previousClose || 0,
          shares: stock.shares || 0,
          avgPrice: stock.avgPrice || 0,
          value: stock.value || 0,
          gainLoss: stock.gainLoss || 0,
          gainLossPct: stock.gainLossPct || 0,
          isPopular: stock.isPopular || false
        };
        
        stocks[stock.symbol] = { latestData: stockData };
        
        if (stock.isPopular) {
          popularStocks.push(stockData);
        }
      }
    });
    
    return { stocksData: stocks, popularStocksData: popularStocks };
  }, [portfolioStocks]);
  
  // Initialize selected stocks with default values if none exist
  React.useEffect(() => {
    if (selectedStocks.length === 0) {
      setSelectedStocks(['AAPL', 'MSFT', 'GOOGL']);
    }
  }, []);
  
  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshPortfolio();
    } catch (error) {
      console.error('Error refreshing portfolio:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Handle adding a new stock
  const handleAddStock = (symbol) => {
    if (!selectedStocks.includes(symbol)) {
      setSelectedStocks(prev => [...prev, symbol]);
      console.log(`Added ${symbol} to watchlist`);
    }
  };

  // Handle removing a stock
  const handleRemoveStock = (symbol) => {
    setSelectedStocks(prev => prev.filter(s => s !== symbol));
    console.log(`Removed ${symbol} from watchlist`);
  };

  // If there's an API error, show an error message
  if (portfolioError) {
    console.error('Dashboard Error:', {
      error: portfolioError,
      stack: new Error().stack
    });
    
    return (
      <div className="p-6 max-w-4xl mx-auto mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error Loading Portfolio Data</h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>We encountered an issue while loading your portfolio data.</p>
              <p className="mt-1 font-mono text-xs bg-black/10 dark:bg-white/10 p-2 rounded">
                {String(portfolioError.message || portfolioError).substring(0, 200)}
              </p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isRefreshing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try Again
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate portfolio performance from the backend data
  const portfolio = {
    totalChange: weeklyReturn || 0,
    totalValue: portfolioValue || 0
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence>
          {/* Header with Title and Refresh Button */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-6"
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center text-sm px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {isRefreshing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Data
                </>
              )}
            </button>
          </motion.div>

          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <WelcomeBanner 
              experienceLevel={experienceLevel} 
              portfolioValue={portfolioValue}
              weeklyReturn={weeklyReturn}
            />
          </motion.div>
          
          {/* Performance Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <PerformanceOverview 
              portfolioValue={portfolioValue}
              weeklyReturn={weeklyReturn}
              winRate={winRate}
              totalTrades={totalTrades}
              isLoading={isPortfolioLoading}
            />
          </motion.div>
          
          {/* Main Content Grid */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Watchlist and News */}
            <div className="space-y-6">
              {/* Watchlist */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Watchlist</h2>
                  <StockSearch 
                    onSelectStock={handleAddStock} 
                    selectedStocks={selectedStocks}
                    className="w-full max-w-xs"
                  />
                </div>
                <StockWatchlist 
                  stocks={selectedStocks}
                  onRemove={handleRemoveStock}
                  isLoading={isPortfolioLoading}
                />
              </motion.div>
              
              {/* Financial News */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
              >
                <FinancialNews watchedStocks={selectedStocks} />
              </motion.div>
            </div>
            
            {/* Middle Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stock Data Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedStocks.map((symbol, index) => (
                      <motion.div
                        key={`${symbol}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="h-full"
                      >
                        <StockData 
                          symbol={symbol} 
                          onRemove={() => handleRemoveStock(symbol)}
                        />
                      </motion.div>
                    ))}
                    
                    {/* Add Stock Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: selectedStocks.length * 0.1 }}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      onClick={() => {
                        const newStock = prompt('Enter a stock symbol:');
                        if (newStock && !selectedStocks.includes(newStock.toUpperCase())) {
                          handleAddStock(newStock.toUpperCase());
                        }
                      }}
                    >
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Add Stock</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              {/* Key Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <KeyMetrics 
                  portfolioValue={portfolioValue} 
                  weeklyReturn={weeklyReturn}
                  winRate={winRate}
                  totalTrades={totalTrades}
                  activeGoals={activeGoals}
                  isLoading={isPortfolioLoading}
                />
              </motion.div>
              
              {/* Stock Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
              >
                <StockAnalysis 
                  stocks={popularStocksData.length > 0 ? popularStocksData : 
                         Object.values(stocksData).map(d => d.latestData).filter(Boolean)} 
                  isLoading={isPortfolioLoading}
                  title={popularStocksData.length > 0 ? "Popular Stock Analysis" : "Your Stock Analysis"}
                />
              </motion.div>
              
              {/* FOMO Stocks */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <FomoStocks 
                  stocksData={Object.values(stocksData).map(d => d.latestData).filter(Boolean)} 
                  isLoading={isPortfolioLoading}
                />
              </motion.div>
              
              {/* Charts Section */}
              {selectedStocks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
                >
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Stock Analytics
                  </h2>
                  <div className="space-y-8">
                    {selectedStocks.map((stock) => (
                      <div key={stock['1. symbol']}>
                        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                          {stock['2. name']} ({stock['1. symbol']})
                        </h3>
                        <ChartsSection symbol={stock['1. symbol']} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Bottom Section - Community and Simulation */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <SimulationBanner />
              </motion.div>
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <CommunityLeaderboard />
              </motion.div>
            </div>
          </div>
        </AnimatePresence>
      </div>
      
      {/* Investment Assistant Chatbot */}
      <Chatbot stocksData={Object.values(stocksData).map(d => d.latestData).filter(Boolean)} />
    </div>
  );
}

export default Dashboard;
