import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const PerformanceOverview = ({ portfolioValue, weeklyReturn, winRate, totalTrades, isLoading }) => {
  // Sample data - replace with actual data from your API
  const performanceData = {
    labels: Array.from({ length: 12 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Portfolio Value ($)',
        data: Array(12).fill(0).map((_, i) => 
          (portfolioValue || 10000) * (1 + (weeklyReturn || 0) * (i / 12))
        ),
        borderColor: 'rgba(79, 70, 229, 1)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Overview</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
            1W
          </button>
          <button className="px-3 py-1 text-sm rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
            1M
          </button>
          <button className="px-3 py-1 text-sm rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
            1Y
          </button>
          <button className="px-3 py-1 text-sm rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
            ALL
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Portfolio Value</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            ${(portfolioValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Weekly Return</p>
          <p className={`text-xl font-semibold ${(weeklyReturn || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {weeklyReturn >= 0 ? '+' : ''}{(weeklyReturn * 100 || 0).toFixed(2)}%
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Win Rate</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {(winRate * 100 || 0).toFixed(1)}%
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Trades</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {totalTrades || 0}
          </p>
        </div>
      </div>
      
      <div className="h-64">
        <Line data={performanceData} options={options} />
      </div>
    </div>
  );
};

export default PerformanceOverview;
