import React from "react";
import { motion } from "framer-motion";
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiActivity, FiLoader, FiTarget } from "react-icons/fi";

const MetricCard = ({ title, value, change, icon, color, progress, delay, isLoading = false }) => {
  const isPositive = change >= 0;
  const isNeutral = change === 0;
  
  // Determine colors based on theme and value
  const getTextColor = () => {
    if (isLoading) return 'text-gray-400 dark:text-gray-600';
    if (isNeutral) return 'text-gray-500 dark:text-gray-400';
    return isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };
  
  const getProgressColor = () => {
    if (isLoading) return 'bg-gray-200 dark:bg-gray-700';
    if (isNeutral) return 'bg-blue-500';
    return isPositive ? 'bg-green-500' : 'bg-red-500';
  };
  
  const getChangeText = () => {
    if (isLoading) return 'Loading...';
    if (isNeutral) return 'No change';
    return `${isPositive ? '↑' : '↓'} ${Math.abs(change)}% ${isPositive ? 'gain' : 'loss'}`;
  };
  
  const formatValue = (val) => {
    if (isLoading) return '--';
    if (typeof val === 'number') {
      // Check if it's a large number that should be formatted as currency
      if (val > 1000 || val < -1000) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      }
      // For percentage changes
      return `${val > 0 ? '+' : ''}${val}%`;
    }
    return val;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <div className="flex items-center mt-1">
            <p className={`text-2xl font-semibold ${getTextColor()}`}>
              {isLoading ? (
                <span className="inline-flex items-center">
                  <FiLoader className="animate-spin mr-2" />
                  Loading...
                </span>
              ) : (
                formatValue(value)
              )}
            </p>
            {!isNeutral && !isLoading && (
              <span className={`ml-2 text-sm flex items-center ${getTextColor()}`}>
                {isPositive ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                {Math.abs(change)}%
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {getChangeText()}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          {isLoading ? <FiLoader className="animate-spin" /> : icon}
        </div>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getProgressColor()}`} 
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {getChangeText()}
        </p>
      </div>
    </motion.div>
  );
};

const KeyMetrics = ({ portfolioValue, weeklyReturn, winRate, totalTrades, activeGoals = 0, isLoading }) => {
  // Format currency
  const formatCurrency = (value) => {
    try {
      const numValue = typeof value === 'string' 
        ? parseFloat(value.replace(/[^0-9.-]+/g, '')) 
        : Number(value) || 0;
        
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(numValue);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return '$0';
    }
  };

  // Format percentage
  const formatPercent = (value) => {
    try {
      if (value === undefined || value === null) return '+0.00%';
      const numValue = typeof value === 'string' 
        ? parseFloat(value.replace(/[^0-9.-]+/g, ''))
        : Number(value) || 0;
      return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(2)}%`;
    } catch (error) {
      console.error('Error formatting percentage:', error);
      return '+0.00%';
    }
  };

  // Safely parse weekly return
  const safeWeeklyReturn = typeof weeklyReturn === 'number' 
    ? weeklyReturn 
    : typeof weeklyReturn === 'string' 
      ? parseFloat(weeklyReturn.replace(/[^0-9.-]+/g, '')) || 0 
      : 0;

  // Safely parse win rate
  const safeWinRate = typeof winRate === 'number' 
    ? winRate 
    : typeof winRate === 'string' 
      ? parseFloat(winRate.replace(/[^0-9.-]+/g, '')) || 0 
      : 0;
  
  const metrics = [
    {
      title: "Portfolio Value",
      value: formatCurrency(portfolioValue || 0),
      change: formatPercent(safeWeeklyReturn),
      icon: <FiDollarSign className="text-blue-500" size={20} />,
      color: "text-blue-500 bg-blue-500",
      progress: 75,
      delay: 0.1,
      isLoading,
      description: "Total value of your investments"
    },
    {
      title: "Weekly Return",
      value: formatPercent(safeWeeklyReturn),
      change: formatPercent(safeWeeklyReturn) + " this week",
      icon: <FiTrendingUp className={safeWeeklyReturn >= 0 ? "text-green-500" : "text-red-500"} size={20} />,
      color: safeWeeklyReturn >= 0 ? "text-green-500 bg-green-500" : "text-red-500 bg-red-500",
      progress: Math.min(Math.abs(safeWeeklyReturn) * 3, 100),
      delay: 0.2,
      isLoading,
      description: "Your return this week"
    },
    {
      title: "Win Rate",
      value: `${Math.round(safeWinRate)}%`,
      change: `${totalTrades || 0} total trades`,
      icon: <FiActivity className="text-purple-500" size={20} />,
      color: "text-purple-500 bg-purple-500",
      progress: safeWinRate,
      delay: 0.3,
      isLoading,
      description: "Percentage of profitable trades"
    },
    {
      title: "Active Goals",
      value: activeGoals || 0,
      change: activeGoals > 0 ? "on track" : "no active goals",
      icon: <FiTarget className="text-yellow-500" size={20} />,
      color: "text-yellow-500 bg-yellow-500",
      progress: Math.min((activeGoals || 0) * 20, 100),
      delay: 0.4,
      isLoading,
      description: "Your active investment goals"
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Portfolio Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard 
            key={index} 
            {...metric}
            isLoading={isLoading}
          >
            {metric.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{metric.description}</p>
            )}
          </MetricCard>
        ))}
      </div>
    </div>
  );
};

export default KeyMetrics;
