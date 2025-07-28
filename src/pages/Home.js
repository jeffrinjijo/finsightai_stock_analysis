import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiDollarSign, 
  FiPieChart, 
  FiActivity, 
  FiArrowRight, 
  FiBarChart2, 
  FiTarget,
  FiAward,
  FiBell,
  FiSearch,
  FiPlus,
  FiRefreshCw,
  FiChevronRight,
  FiBookOpen
} from 'react-icons/fi';
import { formatCurrency, formatPercent } from '../utils/formatters';
import usePortfolioData from '../hooks/usePortfolioData';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

// Stats card component
const StatCard = ({ title, value, change, icon: Icon, color, isLoading = false }) => (
  <motion.div 
    variants={item}
    className={`p-6 rounded-2xl bg-gradient-to-br ${color} text-white`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="text-2xl font-bold mt-1">
          {isLoading ? '--' : value}
        </p>
      </div>
      <div className="p-2 bg-white/20 rounded-lg">
        <Icon className="text-xl" />
      </div>
    </div>
    <div className="mt-4">
      <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full inline-block">
        {isLoading ? 'Loading...' : change}
      </span>
    </div>
  </motion.div>
);

function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  
  // Use the shared portfolio data hook
  const {
    portfolioValue,
    weeklyReturn,
    winRate,
    totalTrades,
    activeGoals,
    isLoading,
    error,
    refreshPortfolio
  } = usePortfolioData();

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const stats = [
    {
      title: 'Portfolio Value',
      value: formatCurrency(portfolioValue),
      change: `${weeklyReturn >= 0 ? '+' : ''}${formatPercent(weeklyReturn)} this week`,
      icon: FiTrendingUp,
      color: 'from-indigo-500 to-indigo-600',
      isLoading
    },
    {
      title: 'Weekly Return',
      value: `${weeklyReturn >= 0 ? '+' : ''}${formatCurrency(weeklyReturn / 100 * portfolioValue)}`,
      change: `${weeklyReturn >= 0 ? '+' : ''}${formatPercent(weeklyReturn)} from last week`,
      icon: FiBarChart2,
      color: weeklyReturn >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600',
      isLoading
    },
    {
      title: 'Win Rate',
      value: `${Math.round(winRate)}%`,
      change: `${totalTrades} total trades`,
      icon: FiTarget,
      color: 'from-amber-500 to-amber-600',
      isLoading
    },
    {
      title: 'Active Goals',
      value: activeGoals,
      change: activeGoals > 0 ? 'On track' : 'No active goals',
      icon: FiAward,
      color: 'from-purple-500 to-purple-600',
      isLoading
    },
    {
      title: 'Risk Level',
      value: 'Balanced',
      change: 'Moderate growth',
      icon: FiAward,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const quickLinks = [
    {
      title: 'Dashboard',
      description: 'View your portfolio performance',
      icon: <FiTrendingUp className="text-2xl" />,
      path: '/dashboard',
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
    },
    {
      title: 'Simulation',
      description: 'Test investment strategies',
      icon: <FiPieChart className="text-2xl" />,
      path: '/simulate',
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    },
    {
      title: 'Goals',
      description: 'Track financial objectives',
      icon: <FiTarget className="text-2xl" />,
      path: '/goals',
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
    },
    {
      title: 'Learn',
      description: 'Investment education',
      icon: <FiBookOpen className="text-2xl" />,
      path: '/guide',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    }
  ];

  const recentActivity = [
    { 
      id: 1,
      action: 'Added new investment', 
      date: '2 hours ago', 
      amount: '+$1,200', 
      type: 'deposit',
      icon: <FiPlus className="text-green-500" />
    },
    { 
      id: 2,
      action: 'Portfolio rebalanced', 
      date: '1 day ago', 
      amount: 'Updated', 
      type: 'update',
      icon: <FiRefreshCw className="text-blue-500" />
    },
    { 
      id: 3,
      action: 'Goal progress', 
      date: '2 days ago', 
      amount: '65%', 
      type: 'progress',
      icon: <FiTrendingUp className="text-amber-500" />
    },
    { 
      id: 4,
      action: 'Market alert', 
      date: '3 days ago', 
      amount: 'New', 
      type: 'alert',
      icon: <FiBell className="text-red-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {greeting}, {currentUser?.displayName || 'Investor'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Here's your financial overview for today
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 md:mt-0 relative"
          >
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search investments, reports..."
              className="pl-10 pr-4 py-2.5 w-full md:w-64 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        >
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
              View all <FiChevronRight className="ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <motion.button
                key={index}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(link.path)}
                className={`p-5 rounded-xl shadow-sm hover:shadow-md transition-all text-left group ${link.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${link.color.replace('text', 'bg').replace('dark:bg', 'dark:bg')} bg-opacity-20`}>
                    {link.icon}
                  </div>
                  <FiArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mt-5 mb-1 text-lg">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {link.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
                View all <FiChevronRight className="ml-1" />
              </button>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {recentActivity.map((activity) => (
                  <motion.div 
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl ${
                        activity.type === 'deposit' ? 'bg-green-50 dark:bg-green-900/20' :
                        activity.type === 'alert' ? 'bg-red-50 dark:bg-red-900/20' :
                        activity.type === 'update' ? 'bg-blue-50 dark:bg-blue-900/20' :
                        'bg-amber-50 dark:bg-amber-900/20'
                      }`}>
                        {activity.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${
                      activity.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 
                      activity.type === 'alert' ? 'text-red-600 dark:text-red-400' : 
                      activity.type === 'update' ? 'text-blue-600 dark:text-blue-400' :
                      'text-amber-600 dark:text-amber-400'
                    }`}>
                      {activity.amount}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Market Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Market Overview</h2>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                Live
              </span>
            </div>
            <div className="space-y-4">
              {[
                { symbol: 'S&P 500', value: '4,567.89', change: '+1.2%', trend: 'up' },
                { symbol: 'NASDAQ', value: '15,234.56', change: '+0.8%', trend: 'up' },
                { symbol: 'DOW', value: '34,567.89', change: '-0.3%', trend: 'down' },
                { symbol: 'BTC/USD', value: '$42,123.45', change: '+3.4%', trend: 'up' },
                { symbol: 'Gold', value: '$1,845.67', change: '-0.5%', trend: 'down' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">{item.symbol}</span>
                  <div className="flex items-center">
                    <span className="text-gray-600 dark:text-gray-300 mr-3">{item.value}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      item.trend === 'up' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full py-2.5 text-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors text-sm font-medium">
              View Full Market Data
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Home;
