import React from 'react';
import { FiTrendingUp, FiDollarSign, FiPieChart, FiAlertCircle } from 'react-icons/fi';

const PortfolioPerformance = ({ portfolioValue, dayChange, dayChangePercent, positions, winRate, avgReturn, totalReturn }) => {
  const stats = [
    { 
      name: 'Portfolio Value', 
      value: portfolioValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      change: dayChange,
      changePercent: dayChangePercent,
      icon: <FiDollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
    },
    { 
      name: 'Today\'s Change', 
      value: dayChange >= 0 ? `+${dayChange.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}` : dayChange.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      change: dayChange,
      changePercent: dayChangePercent,
      icon: <FiTrendingUp className={`h-6 w-6 ${dayChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
    },
    { 
      name: 'Positions', 
      value: positions,
      description: 'Active positions',
      icon: <FiPieChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
    },
    { 
      name: 'Win Rate', 
      value: `${winRate}%`,
      description: 'Profitable trades',
      icon: <FiAlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
    },
    { 
      name: 'Avg. Return', 
      value: `${avgReturn.toFixed(2)}%`,
      description: 'Per position',
      icon: <FiTrendingUp className={`h-6 w-6 ${avgReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
    },
    { 
      name: 'Total Return', 
      value: totalReturn >= 0 ? `+${totalReturn.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}` : totalReturn.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      description: 'All-time',
      icon: <FiDollarSign className={`h-6 w-6 ${totalReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Portfolio Performance</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Overview of your investment performance
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-300">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                  {stat.change !== undefined && (
                    <span className={`ml-2 text-sm font-medium ${stat.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {stat.changePercent >= 0 ? '+' : ''}{stat.changePercent?.toFixed(2)}%
                    </span>
                  )}
                </div>
                {stat.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioPerformance;
